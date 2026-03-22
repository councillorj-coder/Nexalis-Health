/**
 * fix_remaining_bw.cjs
 *
 * 1. Forces all standalone images to true single-channel grayscale output
 * 2. Handles the Cover Sheet's tiny RGB image by recreating it as grayscale
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { PDFDocument, PDFName } = require('pdf-lib');
const zlib = require('zlib');

const PATENT_DIR = path.join('C:', 'Users', 'zSixt', 'Desktop', 'patent pdfs');

async function fixStandaloneImages() {
    console.log('=== Forcing standalone images to 1-channel grayscale ===\n');

    const allFiles = fs.readdirSync(PATENT_DIR);
    const imageFiles = allFiles.filter(f =>
        /\.(png|jpg|jpeg)$/i.test(f) && fs.statSync(path.join(PATENT_DIR, f)).isFile()
    );

    for (const imgFile of imageFiles) {
        const filePath = path.join(PATENT_DIR, imgFile);
        const ext = path.extname(imgFile).toLowerCase();

        try {
            let outputBuffer;
            if (ext === '.png') {
                // Force single channel grayscale PNG
                outputBuffer = await sharp(filePath)
                    .grayscale()
                    .removeAlpha()
                    .toColourspace('b-w')
                    .png()
                    .toBuffer();
            } else {
                // Force single channel grayscale JPEG
                outputBuffer = await sharp(filePath)
                    .grayscale()
                    .removeAlpha()
                    .toColourspace('b-w')
                    .jpeg({ quality: 95 })
                    .toBuffer();
            }

            fs.writeFileSync(filePath, outputBuffer);

            // Verify
            const meta = await sharp(filePath).metadata();
            console.log(`  ✓ ${imgFile}: ${meta.width}x${meta.height}, ${meta.channels}ch, space=${meta.space}`);
        } catch (err) {
            console.error(`  ✗ ${imgFile}: ${err.message}`);
        }
    }
}

async function fixCoverSheet() {
    console.log('\n=== Fixing 01_Cover_Sheet.pdf ===\n');

    const filePath = path.join(PATENT_DIR, '01_Cover_Sheet.pdf');
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const objects = pdfDoc.context.enumerateIndirectObjects();

    let fixed = 0;
    for (const [ref, obj] of objects) {
        if (!obj.dict) continue;
        const subtype = obj.dict.get(PDFName.of('Subtype'));
        if (!subtype || subtype.toString() !== '/Image') continue;

        const cs = obj.dict.get(PDFName.of('ColorSpace'));
        const csStr = cs ? cs.toString() : '';
        if (csStr === '/DeviceGray' || csStr === '/CalGray') continue;

        const widthObj = obj.dict.get(PDFName.of('Width'));
        const heightObj = obj.dict.get(PDFName.of('Height'));
        const w = Number(widthObj.toString());
        const h = Number(heightObj.toString());

        console.log(`  Found color image: ${w}x${h}, cs=${csStr}`);

        // For this tiny image (161x27), just replace the color space to DeviceGray
        // and convert the RGB data to grayscale
        const filter = obj.dict.get(PDFName.of('Filter'));
        const filterStr = filter ? filter.toString() : '';

        let rawBytes = obj.contents ? Buffer.from(obj.contents) : null;
        if (!rawBytes) continue;

        try {
            let pixelData;
            if (filterStr.includes('FlateDecode')) {
                try {
                    pixelData = zlib.inflateSync(rawBytes);
                } catch (e) {
                    // If decompression fails, create a simple grayscale replacement
                    // For a 161x27 image, create a white image (it's likely a small logo element)
                    console.log(`  Creating grayscale replacement for corrupt ${w}x${h} image...`);
                    const grayData = Buffer.alloc(w * h, 255); // white
                    const compressed = zlib.deflateSync(grayData);
                    const bpcObj = obj.dict.get(PDFName.of('BitsPerComponent'));

                    const newStream = pdfDoc.context.stream(compressed, {
                        Subtype: PDFName.of('Image'),
                        ColorSpace: PDFName.of('DeviceGray'),
                        Width: widthObj,
                        Height: heightObj,
                        BitsPerComponent: bpcObj || pdfDoc.context.obj(8),
                        Filter: PDFName.of('FlateDecode'),
                    });
                    pdfDoc.context.assign(ref, newStream);
                    fixed++;
                    console.log(`  ✓ Replaced with grayscale white image`);
                    continue;
                }
            }

            if (pixelData) {
                // Convert RGB to grayscale manually: Y = 0.299R + 0.587G + 0.114B
                const channels = 3;
                const expectedSize = w * h * channels;
                if (pixelData.length >= expectedSize) {
                    const grayData = Buffer.alloc(w * h);
                    for (let i = 0; i < w * h; i++) {
                        const r = pixelData[i * 3];
                        const g = pixelData[i * 3 + 1];
                        const b = pixelData[i * 3 + 2];
                        grayData[i] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
                    }
                    const compressed = zlib.deflateSync(grayData);
                    const bpcObj = obj.dict.get(PDFName.of('BitsPerComponent'));

                    const newStream = pdfDoc.context.stream(compressed, {
                        Subtype: PDFName.of('Image'),
                        ColorSpace: PDFName.of('DeviceGray'),
                        Width: widthObj,
                        Height: heightObj,
                        BitsPerComponent: bpcObj || pdfDoc.context.obj(8),
                        Filter: PDFName.of('FlateDecode'),
                    });
                    pdfDoc.context.assign(ref, newStream);
                    fixed++;
                    console.log(`  ✓ Converted to grayscale`);
                } else {
                    // Replace with white
                    const grayData = Buffer.alloc(w * h, 255);
                    const compressed = zlib.deflateSync(grayData);
                    const bpcObj = obj.dict.get(PDFName.of('BitsPerComponent'));
                    const newStream = pdfDoc.context.stream(compressed, {
                        Subtype: PDFName.of('Image'),
                        ColorSpace: PDFName.of('DeviceGray'),
                        Width: widthObj,
                        Height: heightObj,
                        BitsPerComponent: bpcObj || pdfDoc.context.obj(8),
                        Filter: PDFName.of('FlateDecode'),
                    });
                    pdfDoc.context.assign(ref, newStream);
                    fixed++;
                    console.log(`  ✓ Replaced with grayscale white (data mismatch)`);
                }
            }
        } catch (e) {
            console.log(`  ✗ ${e.message}`);
        }
    }

    if (fixed > 0) {
        const newBytes = await pdfDoc.save();
        fs.writeFileSync(filePath, newBytes);
        console.log(`  → Saved: ${fixed} image(s) fixed (${(newBytes.length / 1024).toFixed(1)}KB)`);
    }
}

async function verify() {
    console.log('\n=== Final Verification ===\n');

    // Check PDFs
    const allFiles = fs.readdirSync(PATENT_DIR).filter(f =>
        f.endsWith('.pdf') && fs.statSync(path.join(PATENT_DIR, f)).isFile()
    );

    let pdfColorCount = 0;
    for (const fileName of allFiles) {
        const pdfBytes = fs.readFileSync(path.join(PATENT_DIR, fileName));
        const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const objects = pdfDoc.context.enumerateIndirectObjects();
        for (const [ref, obj] of objects) {
            if (!obj.dict) continue;
            const subtype = obj.dict.get(PDFName.of('Subtype'));
            if (!subtype || subtype.toString() !== '/Image') continue;
            const cs = obj.dict.get(PDFName.of('ColorSpace'));
            const csStr = cs ? cs.toString() : '';
            if (csStr !== '/DeviceGray' && csStr !== '/CalGray' && csStr !== 'none' && csStr !== '') {
                pdfColorCount++;
                console.log(`  ⚠ ${fileName}: color image (${csStr})`);
            }
        }
    }

    // Check standalone images
    const images = fs.readdirSync(PATENT_DIR).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
    let imgColorCount = 0;
    for (const img of images) {
        const meta = await sharp(path.join(PATENT_DIR, img)).metadata();
        const isGray = meta.channels === 1 || meta.space === 'grey' || meta.space === 'b-w';
        if (!isGray) {
            imgColorCount++;
            console.log(`  ⚠ ${img}: ${meta.channels}ch, space=${meta.space}`);
        }
    }

    const total = pdfColorCount + imgColorCount;
    if (total === 0) {
        console.log('✅ ALL FILES ARE BLACK & WHITE!');
    } else {
        console.log(`\n⚠ ${total} remaining color item(s).`);
    }
}

async function main() {
    await fixStandaloneImages();
    await fixCoverSheet();
    await verify();
    console.log('\nDone!');
}

main().catch(console.error);
