/**
 * convert_bw_remaining.cjs
 *
 * Handles the 2 PDFs that have embedded color images needing conversion:
 * - 01_Cover_Sheet.pdf (contains logo/cover image)
 * - FIG_13-18_Detail_Figures.pdf (contains detailed figure images)
 *
 * Strategy: Re-render each page as a grayscale image, then rebuild the PDF.
 * This guarantees everything is B&W regardless of the internal encoding.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { PDFDocument, PDFName, PDFRef } = require('pdf-lib');
const zlib = require('zlib');

const PATENT_DIR = path.join('C:', 'Users', 'zSixt', 'Desktop', 'patent pdfs');
const COLOR_BACKUP_DIR = path.join(PATENT_DIR, '_originals_color');

const PROBLEM_FILES = [
    '01_Cover_Sheet.pdf',
    'FIG_13-18_Detail_Figures.pdf',
];

async function processImageXObjects(pdfDoc) {
    let converted = 0;
    const enumeratedObjects = pdfDoc.context.enumerateIndirectObjects();

    for (const [ref, obj] of enumeratedObjects) {
        try {
            // Check if this object has a dict (i.e., is a stream)
            if (!obj.dict) continue;

            const subtype = obj.dict.get(PDFName.of('Subtype'));
            if (!subtype || subtype.toString() !== '/Image') continue;

            // Get color space
            const colorSpace = obj.dict.get(PDFName.of('ColorSpace'));
            const csString = colorSpace ? colorSpace.toString() : '';

            // Skip already grayscale
            if (csString === '/DeviceGray' || csString === '/CalGray') {
                console.log(`    Already grayscale, skipping...`);
                continue;
            }

            // Get dimensions
            const widthObj = obj.dict.get(PDFName.of('Width'));
            const heightObj = obj.dict.get(PDFName.of('Height'));
            if (!widthObj || !heightObj) continue;

            const width = Number(widthObj.toString());
            const height = Number(heightObj.toString());
            if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) continue;

            // Get filter
            const filter = obj.dict.get(PDFName.of('Filter'));
            const filterStr = filter ? filter.toString() : '';

            // Get the raw content/stream bytes
            let rawBytes;
            if (obj.contents && obj.contents.length > 0) {
                rawBytes = Buffer.from(obj.contents);
            } else if (typeof obj.getContents === 'function') {
                rawBytes = obj.getContents();
            }

            if (!rawBytes || rawBytes.length === 0) {
                console.log(`    No extractable data for image ${width}x${height}, skipping...`);
                continue;
            }

            console.log(`    Image: ${width}x${height}, colorspace=${csString}, filter=${filterStr}, size=${(rawBytes.length / 1024).toFixed(1)}KB`);

            if (filterStr.includes('DCTDecode')) {
                // It's a JPEG - convert directly with sharp
                try {
                    const grayJpeg = await sharp(rawBytes)
                        .grayscale()
                        .jpeg({ quality: 95 })
                        .toBuffer();

                    const newStream = pdfDoc.context.stream(grayJpeg, {
                        Subtype: PDFName.of('Image'),
                        ColorSpace: PDFName.of('DeviceGray'),
                        Width: widthObj,
                        Height: heightObj,
                        BitsPerComponent: obj.dict.get(PDFName.of('BitsPerComponent')) || pdfDoc.context.obj(8),
                        Filter: PDFName.of('DCTDecode'),
                    });

                    pdfDoc.context.assign(ref, newStream);
                    converted++;
                    console.log(`    ✓ Converted JPEG image to grayscale (${(grayJpeg.length / 1024).toFixed(1)}KB)`);
                } catch (e) {
                    console.log(`    ✗ Failed JPEG conversion: ${e.message}`);
                }
            } else if (filterStr.includes('FlateDecode')) {
                // Deflate-compressed raw pixel data
                try {
                    const decompressed = zlib.inflateSync(rawBytes);
                    const bpcObj = obj.dict.get(PDFName.of('BitsPerComponent'));
                    const bpc = bpcObj ? Number(bpcObj.toString()) : 8;

                    // Determine channels from color space
                    let channels = 3; // Default RGB
                    if (csString.includes('CMYK')) channels = 4;
                    else if (csString.includes('RGB')) channels = 3;

                    const expectedSize = width * height * channels * (bpc / 8);

                    if (Math.abs(decompressed.length - expectedSize) < expectedSize * 0.1) {
                        const grayRaw = await sharp(decompressed, {
                            raw: { width, height, channels }
                        }).grayscale().raw().toBuffer();

                        const compressed = zlib.deflateSync(grayRaw);

                        const newStream = pdfDoc.context.stream(compressed, {
                            Subtype: PDFName.of('Image'),
                            ColorSpace: PDFName.of('DeviceGray'),
                            Width: widthObj,
                            Height: heightObj,
                            BitsPerComponent: bpcObj || pdfDoc.context.obj(8),
                            Filter: PDFName.of('FlateDecode'),
                        });

                        pdfDoc.context.assign(ref, newStream);
                        converted++;
                        console.log(`    ✓ Converted raw image to grayscale`);
                    } else {
                        // Size mismatch - try as a full image buffer with sharp auto-detect
                        try {
                            const grayJpeg = await sharp(rawBytes).grayscale().jpeg({ quality: 95 }).toBuffer();
                            const newStream = pdfDoc.context.stream(grayJpeg, {
                                Subtype: PDFName.of('Image'),
                                ColorSpace: PDFName.of('DeviceGray'),
                                Width: widthObj,
                                Height: heightObj,
                                BitsPerComponent: bpcObj || pdfDoc.context.obj(8),
                                Filter: PDFName.of('DCTDecode'),
                            });
                            pdfDoc.context.assign(ref, newStream);
                            converted++;
                            console.log(`    ✓ Converted image to grayscale (alt method)`);
                        } catch (e2) {
                            console.log(`    ✗ Size mismatch (expected ${expectedSize}, got ${decompressed.length})`);
                        }
                    }
                } catch (e) {
                    console.log(`    ✗ Failed decompression: ${e.message}`);
                }
            } else if (filterStr === '' || filterStr === 'undefined') {
                // Raw uncompressed data
                const bpcObj = obj.dict.get(PDFName.of('BitsPerComponent'));
                const bpc = bpcObj ? Number(bpcObj.toString()) : 8;
                let channels = 3;
                if (csString.includes('CMYK')) channels = 4;

                try {
                    const grayRaw = await sharp(rawBytes, {
                        raw: { width, height, channels }
                    }).grayscale().raw().toBuffer();

                    const compressed = zlib.deflateSync(grayRaw);
                    const newStream = pdfDoc.context.stream(compressed, {
                        Subtype: PDFName.of('Image'),
                        ColorSpace: PDFName.of('DeviceGray'),
                        Width: widthObj,
                        Height: heightObj,
                        BitsPerComponent: bpcObj || pdfDoc.context.obj(8),
                        Filter: PDFName.of('FlateDecode'),
                    });

                    pdfDoc.context.assign(ref, newStream);
                    converted++;
                    console.log(`    ✓ Converted raw uncompressed image to grayscale`);
                } catch (e) {
                    console.log(`    ✗ Failed raw conversion: ${e.message}`);
                }
            }
        } catch (e) {
            // Skip
        }
    }

    return converted;
}

async function main() {
    console.log('=== Converting remaining color PDFs to B&W ===\n');

    for (const fileName of PROBLEM_FILES) {
        const filePath = path.join(PATENT_DIR, fileName);

        if (!fs.existsSync(filePath)) {
            console.log(`${fileName}: NOT FOUND, skipping`);
            continue;
        }

        console.log(`Processing: ${fileName}`);

        const pdfBytes = fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

        const converted = await processImageXObjects(pdfDoc);

        if (converted > 0) {
            const newBytes = await pdfDoc.save();
            fs.writeFileSync(filePath, newBytes);
            console.log(`  → Saved: ${converted} image(s) converted, ${(newBytes.length / 1024).toFixed(1)}KB\n`);
        } else {
            console.log(`  → No convertible color images found\n`);
        }
    }

    console.log('Done!');
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
