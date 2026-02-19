/**
 * fix_fig13_18.cjs
 * 
 * Fixes FIG_13-18_Detail_Figures.pdf so ALL pages are exactly 8.5×11" (612×792pt).
 * Pages 2-6 have non-standard sizes — this script places the content centered
 * on a proper Letter page with margins.
 */

const fs = require('fs');
const path = require('path');
const { PDFDocument, PageSizes, rgb } = require('pdf-lib');

const PATENT_DIR = path.join('C:', 'Users', 'zSixt', 'Desktop', 'patent pdfs');
const FILE_NAME = 'FIG_13-18_Detail_Figures.pdf';

const LETTER_W = 612;
const LETTER_H = 792;
const TOLERANCE = 1; // 1pt tolerance

async function main() {
    const filePath = path.join(PATENT_DIR, FILE_NAME);
    console.log(`=== Fixing ${FILE_NAME} ===\n`);

    const pdfBytes = fs.readFileSync(filePath);
    const srcDoc = await PDFDocument.load(pdfBytes);
    const srcPages = srcDoc.getPages();

    // Create a new document with all-Letter pages
    const newDoc = await PDFDocument.create();

    for (let i = 0; i < srcPages.length; i++) {
        const srcPage = srcPages[i];
        const { width, height } = srcPage.getSize();

        const isLetterSized = Math.abs(width - LETTER_W) <= TOLERANCE && Math.abs(height - LETTER_H) <= TOLERANCE;

        if (isLetterSized) {
            // Already correct — copy as-is
            const [copied] = await newDoc.copyPages(srcDoc, [i]);
            newDoc.addPage(copied);
            console.log(`  Page ${i + 1}: ${width.toFixed(1)}×${height.toFixed(1)} pt — already Letter ✓`);
        } else {
            // Need to embed on a Letter page
            // Create a new Letter page
            const newPage = newDoc.addPage([LETTER_W, LETTER_H]);

            // Embed the source page as a form XObject
            const [embedded] = await newDoc.embedPages([srcPage]);

            // Scale content to fit within Letter with 0.5" margin on each side
            const margin = 36; // 0.5 inch in points
            const availW = LETTER_W - 2 * margin;
            const availH = LETTER_H - 2 * margin;

            const scaleX = availW / width;
            const scaleY = availH / height;
            const scale = Math.min(scaleX, scaleY, 1.0); // don't upscale

            const drawW = width * scale;
            const drawH = height * scale;

            // Center on page
            const x = (LETTER_W - drawW) / 2;
            const y = (LETTER_H - drawH) / 2;

            newPage.drawPage(embedded, {
                x,
                y,
                width: drawW,
                height: drawH,
            });

            console.log(`  Page ${i + 1}: ${width.toFixed(1)}×${height.toFixed(1)} pt → centered on ${LETTER_W}×${LETTER_H} pt (scale: ${(scale * 100).toFixed(1)}%) ✓`);
        }
    }

    // Save
    const newBytes = await newDoc.save();
    fs.writeFileSync(filePath, newBytes);
    console.log(`\n  → Saved: ${(newBytes.length / 1024 / 1024).toFixed(2)} MB`);

    // Verify
    const verifyDoc = await PDFDocument.load(fs.readFileSync(filePath));
    const verifyPages = verifyDoc.getPages();
    console.log(`\n=== Verification ===`);
    let allGood = true;
    for (let i = 0; i < verifyPages.length; i++) {
        const { width, height } = verifyPages[i].getSize();
        const ok = Math.abs(width - LETTER_W) <= TOLERANCE && Math.abs(height - LETTER_H) <= TOLERANCE;
        if (!ok) allGood = false;
        console.log(`  Page ${i + 1}: ${width.toFixed(1)}×${height.toFixed(1)} pt (${(width / 72).toFixed(2)}×${(height / 72).toFixed(2)} in) ${ok ? '✓' : '⚠ STILL WRONG'}`);
    }
    console.log(allGood ? '\n✅ All pages are now 8.5×11" Letter!' : '\n⚠ Some pages still need fixing.');
}

main().catch(console.error);
