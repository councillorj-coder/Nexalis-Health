/**
 * verify_bw.cjs
 * Quick verification: scans all PDFs for any remaining color images.
 */
const fs = require('fs');
const path = require('path');
const { PDFDocument, PDFName } = require('pdf-lib');

const PATENT_DIR = path.join('C:', 'Users', 'zSixt', 'Desktop', 'patent pdfs');

async function main() {
    const allFiles = fs.readdirSync(PATENT_DIR).filter(f =>
        f.endsWith('.pdf') && fs.statSync(path.join(PATENT_DIR, f)).isFile()
    ).sort();

    console.log(`Scanning ${allFiles.length} PDFs for color images...\n`);

    let colorFound = 0;

    for (const fileName of allFiles) {
        const filePath = path.join(PATENT_DIR, fileName);
        const pdfBytes = fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const objects = pdfDoc.context.enumerateIndirectObjects();

        let fileColorImages = [];
        for (const [ref, obj] of objects) {
            if (!obj.dict) continue;
            const subtype = obj.dict.get(PDFName.of('Subtype'));
            if (!subtype || subtype.toString() !== '/Image') continue;

            const cs = obj.dict.get(PDFName.of('ColorSpace'));
            const csStr = cs ? cs.toString() : 'none';
            const w = obj.dict.get(PDFName.of('Width'));
            const h = obj.dict.get(PDFName.of('Height'));

            if (csStr !== '/DeviceGray' && csStr !== '/CalGray' && csStr !== 'none') {
                fileColorImages.push(`${w}x${h} ${csStr}`);
            }
        }

        if (fileColorImages.length > 0) {
            console.log(`⚠ ${fileName}: ${fileColorImages.length} color image(s) — ${fileColorImages.join(', ')}`);
            colorFound += fileColorImages.length;
        }
    }

    if (colorFound === 0) {
        console.log('✅ All PDFs are clean — no color images detected!');
    } else {
        console.log(`\n⚠ ${colorFound} color image(s) still found across PDFs.`);
    }

    // Also check standalone images
    console.log('\nChecking standalone images...');
    const sharp = require('sharp');
    const images = fs.readdirSync(PATENT_DIR).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
    for (const img of images) {
        const meta = await sharp(path.join(PATENT_DIR, img)).metadata();
        const isGray = meta.channels === 1 || meta.space === 'grey' || meta.space === 'b-w';
        console.log(`  ${img}: ${meta.width}x${meta.height}, ${meta.channels}ch, space=${meta.space} ${isGray ? '✓' : '⚠ COLOR'}`);
    }

    console.log('\nDone!');
}

main().catch(console.error);
