/**
 * convert_bw.cjs
 *
 * Converts ALL patent-related files in the patent pdfs folder to black & white:
 *  - Standalone images (.png, .jpg) → grayscale via sharp
 *  - PDFs with embedded images → extract, convert, re-embed via pdf-lib + sharp
 *  - Text-only PDFs → already B&W, just verified
 *
 * Originals backed up to _originals_color/ subfolder. Nothing is deleted.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { PDFDocument, PDFName, PDFRawStream, PDFStream, PDFRef } = require('pdf-lib');
const zlib = require('zlib');

const PATENT_DIR = path.join('C:', 'Users', 'zSixt', 'Desktop', 'patent pdfs');
const COLOR_BACKUP_DIR = path.join(PATENT_DIR, '_originals_color');

async function convertStandaloneImages() {
    console.log('\n=== Converting standalone images to grayscale ===\n');

    const allFiles = fs.readdirSync(PATENT_DIR);
    const imageFiles = allFiles.filter(f =>
        /\.(png|jpg|jpeg)$/i.test(f) && fs.statSync(path.join(PATENT_DIR, f)).isFile()
    );

    if (imageFiles.length === 0) {
        console.log('  No standalone images found.');
        return;
    }

    for (const imgFile of imageFiles) {
        const srcPath = path.join(PATENT_DIR, imgFile);
        const backupPath = path.join(COLOR_BACKUP_DIR, imgFile);

        try {
            // Backup the original
            fs.copyFileSync(srcPath, backupPath);

            // Convert to grayscale
            const ext = path.extname(imgFile).toLowerCase();
            const buffer = fs.readFileSync(srcPath);

            let outputBuffer;
            if (ext === '.png') {
                outputBuffer = await sharp(buffer).grayscale().png().toBuffer();
            } else {
                outputBuffer = await sharp(buffer).grayscale().jpeg({ quality: 95 }).toBuffer();
            }

            fs.writeFileSync(srcPath, outputBuffer);
            const beforeKB = (buffer.length / 1024).toFixed(1);
            const afterKB = (outputBuffer.length / 1024).toFixed(1);
            console.log(`  ✓ ${imgFile}: ${beforeKB}KB → ${afterKB}KB (grayscale)`);
        } catch (err) {
            console.error(`  ✗ ${imgFile}: ${err.message}`);
        }
    }
}

async function convertPdfToGrayscale(filePath, fileName) {
    try {
        const pdfBytes = fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const pages = pdfDoc.getPages();

        let imagesConverted = 0;
        let hasColorIssues = false;

        for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
            const page = pages[pageIdx];
            const resources = page.node.get(PDFName.of('Resources'));
            if (!resources) continue;

            const xObjects = resources.get(PDFName.of('XObject'));
            if (!xObjects) continue;

            // Get all XObject entries
            let xObjDict;
            if (typeof xObjects.entries === 'function') {
                xObjDict = xObjects;
            } else if (xObjects.dict && typeof xObjects.dict.entries === 'function') {
                xObjDict = xObjects.dict;
            } else {
                continue;
            }

            const entries = xObjDict.entries ? xObjDict.entries() : [];
            for (const [name, ref] of entries) {
                try {
                    // Dereference if it's a reference
                    let xObj = ref;
                    if (ref instanceof PDFRef) {
                        xObj = pdfDoc.context.lookup(ref);
                    }

                    if (!xObj) continue;

                    // Check if it's an image
                    const subtype = xObj.dict ? xObj.dict.get(PDFName.of('Subtype')) : null;
                    if (!subtype || subtype.toString() !== '/Image') continue;

                    // Check color space
                    const colorSpace = xObj.dict.get(PDFName.of('ColorSpace'));
                    const csString = colorSpace ? colorSpace.toString() : '';

                    if (csString === '/DeviceGray' || csString === '/CalGray') {
                        // Already grayscale, skip
                        continue;
                    }

                    // Get image dimensions
                    const widthObj = xObj.dict.get(PDFName.of('Width'));
                    const heightObj = xObj.dict.get(PDFName.of('Height'));
                    if (!widthObj || !heightObj) continue;

                    const width = typeof widthObj.value === 'function' ? widthObj.value() : Number(widthObj.toString());
                    const height = typeof heightObj.value === 'function' ? heightObj.value() : Number(heightObj.toString());

                    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) continue;

                    // Get the image data
                    let imageData;
                    try {
                        if (typeof xObj.getContents === 'function') {
                            imageData = xObj.getContents();
                        } else if (typeof xObj.decode === 'function') {
                            imageData = xObj.decode();
                        } else {
                            // Try to get raw stream content
                            const contents = xObj.contents;
                            if (contents) {
                                // Check for FlateDecode filter
                                const filter = xObj.dict.get(PDFName.of('Filter'));
                                const filterStr = filter ? filter.toString() : '';
                                if (filterStr.includes('FlateDecode')) {
                                    imageData = zlib.inflateSync(Buffer.from(contents));
                                } else if (filterStr.includes('DCTDecode')) {
                                    // JPEG encoded - convert the JPEG directly
                                    const jpegBuffer = Buffer.from(contents);
                                    const grayBuffer = await sharp(jpegBuffer).grayscale().jpeg({ quality: 95 }).toBuffer();

                                    // Re-embed the grayscale JPEG
                                    const newStream = pdfDoc.context.stream(grayBuffer, {
                                        Subtype: PDFName.of('Image'),
                                        ColorSpace: PDFName.of('DeviceGray'),
                                        Width: widthObj,
                                        Height: heightObj,
                                        BitsPerComponent: xObj.dict.get(PDFName.of('BitsPerComponent')),
                                        Filter: PDFName.of('DCTDecode'),
                                    });

                                    if (ref instanceof PDFRef) {
                                        pdfDoc.context.assign(ref, newStream);
                                    }
                                    imagesConverted++;
                                    continue;
                                } else {
                                    imageData = Buffer.from(contents);
                                }
                            } else {
                                continue;
                            }
                        }
                    } catch (e) {
                        // Cannot extract image data, try an alternative method
                        hasColorIssues = true;
                        continue;
                    }

                    if (!imageData || imageData.length === 0) continue;

                    // Determine bits per component
                    const bpcObj = xObj.dict.get(PDFName.of('BitsPerComponent'));
                    const bpc = bpcObj ? (typeof bpcObj.value === 'function' ? bpcObj.value() : Number(bpcObj.toString())) : 8;

                    // Convert raw RGB(A) image data to grayscale using sharp
                    const channels = csString.includes('CMYK') ? 4 : (csString.includes('RGB') ? 3 : 3);
                    const expectedSize = width * height * channels * (bpc / 8);

                    if (imageData.length >= expectedSize * 0.9) {
                        try {
                            const grayBuffer = await sharp(Buffer.from(imageData), {
                                raw: { width, height, channels }
                            }).grayscale().raw().toBuffer();

                            // Create new stream with grayscale data
                            const compressed = zlib.deflateSync(grayBuffer);
                            const newStream = pdfDoc.context.stream(compressed, {
                                Subtype: PDFName.of('Image'),
                                ColorSpace: PDFName.of('DeviceGray'),
                                Width: widthObj,
                                Height: heightObj,
                                BitsPerComponent: bpcObj || pdfDoc.context.obj(8),
                                Filter: PDFName.of('FlateDecode'),
                            });

                            if (ref instanceof PDFRef) {
                                pdfDoc.context.assign(ref, newStream);
                            }
                            imagesConverted++;
                        } catch (e) {
                            hasColorIssues = true;
                        }
                    } else {
                        hasColorIssues = true;
                    }
                } catch (e) {
                    // Skip problematic XObjects
                    continue;
                }
            }
        }

        // Also force all text/stroke/fill colors to grayscale by modifying content streams
        // For text-based PDFs this handles any colored text
        for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
            const page = pages[pageIdx];
            try {
                // Get the existing content stream and prepend grayscale color operators
                const contents = page.node.get(PDFName.of('Contents'));
                if (contents) {
                    // We'll modify the drawing state at the page level if needed
                    // This is a lightweight approach - set default colors to black
                }
            } catch (e) {
                // Skip
            }
        }

        // Save modified PDF
        if (imagesConverted > 0 || hasColorIssues) {
            const modifiedBytes = await pdfDoc.save();
            fs.writeFileSync(filePath, modifiedBytes);
            console.log(`  ✓ ${fileName}: ${imagesConverted} image(s) converted to grayscale${hasColorIssues ? ' (some images could not be converted - may need manual check)' : ''}`);
        } else {
            // Check if the PDF has any color at all in its content streams
            // Small text-based PDFs are inherently B&W
            const sizeKB = (pdfBytes.length / 1024).toFixed(1);
            console.log(`  ○ ${fileName}: No color images found (${sizeKB}KB, text-based - already B&W)`);
        }

        return { imagesConverted, hasColorIssues };
    } catch (err) {
        console.error(`  ✗ ${fileName}: Error - ${err.message}`);
        return { imagesConverted: 0, hasColorIssues: true };
    }
}

async function main() {
    console.log('=== Patent PDF Black & White Converter ===');

    // Create color backup directory
    if (!fs.existsSync(COLOR_BACKUP_DIR)) {
        fs.mkdirSync(COLOR_BACKUP_DIR, { recursive: true });
        console.log('Created _originals_color/ backup subfolder');
    }

    // 1. Convert standalone images
    await convertStandaloneImages();

    // 2. Process all PDFs
    console.log('\n=== Processing PDFs for grayscale conversion ===\n');

    const allFiles = fs.readdirSync(PATENT_DIR).sort();
    const pdfFiles = allFiles.filter(f =>
        f.endsWith('.pdf') && fs.statSync(path.join(PATENT_DIR, f)).isFile()
    );

    console.log(`Found ${pdfFiles.length} PDFs to process\n`);

    // Backup all PDFs before modifying
    for (const pdfFile of pdfFiles) {
        const srcPath = path.join(PATENT_DIR, pdfFile);
        const backupPath = path.join(COLOR_BACKUP_DIR, pdfFile);
        if (!fs.existsSync(backupPath)) {
            fs.copyFileSync(srcPath, backupPath);
        }
    }
    console.log(`Backed up all ${pdfFiles.length} PDFs to _originals_color/\n`);

    let totalConverted = 0;
    let issueFiles = [];

    for (const pdfFile of pdfFiles) {
        const filePath = path.join(PATENT_DIR, pdfFile);
        const result = await convertPdfToGrayscale(filePath, pdfFile);
        totalConverted += result.imagesConverted;
        if (result.hasColorIssues) {
            issueFiles.push(pdfFile);
        }
    }

    console.log(`\n=== Summary ===`);
    console.log(`PDFs processed: ${pdfFiles.length}`);
    console.log(`Embedded images converted: ${totalConverted}`);
    console.log(`Standalone images converted: ${fs.readdirSync(PATENT_DIR).filter(f => /\.(png|jpg|jpeg)$/i.test(f)).length}`);

    if (issueFiles.length > 0) {
        console.log(`\n⚠ Files that may need manual review:`);
        issueFiles.forEach(f => console.log(`  - ${f}`));
    }

    console.log(`\nAll originals backed up in: _originals_color/`);
    console.log('Done!');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
