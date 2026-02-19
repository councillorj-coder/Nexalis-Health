/**
 * check_sizes.cjs
 *
 * Audits ALL files in the patent pdfs folder for USPTO page-size compliance.
 * USPTO max: US Letter 8.5×11" (612×792pt) or A4 (595×842pt).
 * We use the larger of the two (Letter) as the max: 612×792 points.
 *
 * For PDFs: checks every page dimension.
 * For images: checks pixel dimensions against 300 DPI equivalent of Letter
 *   (2550×3300 px at 300DPI) and also verifies they'd fit on a Letter page.
 * 
 * Fixes oversized PDFs by scaling pages down.
 * Fixes oversized images by resizing to fit within Letter at 300DPI.
 */

const fs = require('fs');
const path = require('path');
const { PDFDocument, PDFName } = require('pdf-lib');
const sharp = require('sharp');

const PATENT_DIR = path.join('C:', 'Users', 'zSixt', 'Desktop', 'patent pdfs');

// USPTO max dimensions
const LETTER_W_PT = 612;   // 8.5 inches * 72 pt/in
const LETTER_H_PT = 792;   // 11 inches * 72 pt/in
const DPI = 300;
const LETTER_W_PX = Math.round(8.5 * DPI);  // 2550
const LETTER_H_PX = Math.round(11 * DPI);   // 3300

// Tolerance: allow 1pt over for rounding
const TOLERANCE_PT = 1;

async function auditPDFs() {
    console.log('=== Auditing PDF Page Sizes ===\n');
    console.log(`Max allowed: ${LETTER_W_PT}×${LETTER_H_PT} pt (8.5×11" Letter)\n`);

    const allFiles = fs.readdirSync(PATENT_DIR).filter(f =>
        f.endsWith('.pdf') && fs.statSync(path.join(PATENT_DIR, f)).isFile()
    ).sort();

    let oversizedPdfs = [];
    let fixedCount = 0;

    for (const fileName of allFiles) {
        const filePath = path.join(PATENT_DIR, fileName);
        const pdfBytes = fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const pages = pdfDoc.getPages();

        let fileOversized = false;
        let needsSave = false;

        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const { width, height } = page.getSize();

            const wOver = width > LETTER_W_PT + TOLERANCE_PT;
            const hOver = height > LETTER_H_PT + TOLERANCE_PT;

            if (wOver || hOver) {
                fileOversized = true;
                console.log(`  ⚠ ${fileName} p${i + 1}: ${width.toFixed(1)}×${height.toFixed(1)} pt — OVERSIZED`);

                // Fix: scale to fit within Letter portrait
                const scaleX = LETTER_W_PT / width;
                const scaleY = LETTER_H_PT / height;
                const scale = Math.min(scaleX, scaleY);

                page.setSize(LETTER_W_PT, LETTER_H_PT);
                page.scaleContent(scale, scale);
                const xOffset = (LETTER_W_PT - width * scale) / 2;
                const yOffset = (LETTER_H_PT - height * scale) / 2;
                page.translateContent(xOffset, yOffset);

                console.log(`    → Fixed: scaled by ${(scale * 100).toFixed(1)}% to ${LETTER_W_PT}×${LETTER_H_PT} pt`);
                needsSave = true;
                fixedCount++;
            } else {
                // Check if landscape but still within bounds
                const orientation = width > height ? 'landscape' : 'portrait';
                if (width > height && (width > LETTER_H_PT + TOLERANCE_PT || height > LETTER_W_PT + TOLERANCE_PT)) {
                    // Landscape page exceeding letter in landscape orientation
                    fileOversized = true;
                    console.log(`  ⚠ ${fileName} p${i + 1}: ${width.toFixed(1)}×${height.toFixed(1)} pt — OVERSIZED (landscape)`);
                }
            }
        }

        if (needsSave) {
            const newBytes = await pdfDoc.save();
            fs.writeFileSync(filePath, newBytes);
        }

        if (!fileOversized) {
            // Just show a compact OK
            const dims = pages.map((p, i) => {
                const { width, height } = p.getSize();
                return `${width.toFixed(0)}×${height.toFixed(0)}`;
            });
            const uniqueDims = [...new Set(dims)];
            console.log(`  ✓ ${fileName} (${pages.length}p, ${uniqueDims.join(', ')} pt)`);
        } else {
            oversizedPdfs.push(fileName);
        }
    }

    return { total: allFiles.length, oversized: oversizedPdfs, fixed: fixedCount };
}

async function auditImages() {
    console.log('\n=== Auditing Image Sizes ===\n');
    console.log(`Max allowed at 300DPI: ${LETTER_W_PX}×${LETTER_H_PX} px\n`);

    const allFiles = fs.readdirSync(PATENT_DIR).filter(f =>
        /\.(png|jpg|jpeg)$/i.test(f) && fs.statSync(path.join(PATENT_DIR, f)).isFile()
    ).sort();

    let oversizedImages = [];
    let fixedCount = 0;

    for (const imgFile of allFiles) {
        const filePath = path.join(PATENT_DIR, imgFile);
        const buf = fs.readFileSync(filePath);
        const meta = await sharp(buf).metadata();

        const wOver = meta.width > LETTER_W_PX;
        const hOver = meta.height > LETTER_H_PX;

        if (wOver || hOver) {
            console.log(`  ⚠ ${imgFile}: ${meta.width}×${meta.height} px — OVERSIZED`);
            oversizedImages.push(imgFile);

            // Resize to fit within Letter at 300DPI, maintaining aspect ratio
            const ext = path.extname(imgFile).toLowerCase();
            let resized;
            if (ext === '.png') {
                resized = await sharp(buf)
                    .resize(LETTER_W_PX, LETTER_H_PX, { fit: 'inside', withoutEnlargement: true })
                    .png()
                    .toBuffer();
            } else {
                resized = await sharp(buf)
                    .resize(LETTER_W_PX, LETTER_H_PX, { fit: 'inside', withoutEnlargement: true })
                    .jpeg({ quality: 95 })
                    .toBuffer();
            }

            fs.writeFileSync(filePath, resized);
            const newMeta = await sharp(resized).metadata();
            console.log(`    → Fixed: ${newMeta.width}×${newMeta.height} px`);
            fixedCount++;
        } else {
            console.log(`  ✓ ${imgFile}: ${meta.width}×${meta.height} px`);
        }
    }

    return { total: allFiles.length, oversized: oversizedImages, fixed: fixedCount };
}

async function main() {
    console.log('=== USPTO Page Size Audit & Fix ===\n');

    const pdfResult = await auditPDFs();
    const imgResult = await auditImages();

    console.log('\n=== SUMMARY ===');
    console.log(`PDFs: ${pdfResult.total} checked, ${pdfResult.oversized.length} were oversized, ${pdfResult.fixed} fixed`);
    console.log(`Images: ${imgResult.total} checked, ${imgResult.oversized.length} were oversized, ${imgResult.fixed} fixed`);

    const totalIssues = pdfResult.oversized.length + imgResult.oversized.length;
    if (totalIssues === 0) {
        console.log('\n✅ ALL FILES ARE CORRECTLY SIZED FOR USPTO!');
    } else {
        console.log(`\n✅ All ${totalIssues} oversized file(s) have been fixed!`);
    }

    console.log('\nDone!');
}

main().catch(console.error);
