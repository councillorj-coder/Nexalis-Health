/**
 * fix_conf_text.cjs
 *
 * Replaces all "Confidential Teaser" and "Confidential Preview" 
 * text with "Confidential Brief" throughout the PDF.
 */

const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const path = require('path');

const DIR = 'C:\\Users\\zSixt\\Desktop\\partnership teaser deck pdf';
const FILE = path.join(DIR, 'Nexalis_Partnership_Brief_Deck_.pdf');

async function main() {
    const existingBytes = fs.readFileSync(FILE);
    const doc = await PDFDocument.load(existingBytes);
    doc.registerFontkit(fontkit);

    const fontDir = path.join(__dirname, 'fonts_inter', 'extras', 'ttf');
    const regularBytes = fs.readFileSync(path.join(fontDir, 'Inter-Regular.ttf'));
    const interRegular = await doc.embedFont(regularBytes);

    const SLATE = rgb(0.40, 0.42, 0.46);  // footer text color (subtle)

    // Page 1: Cover "Confidential Preview • Partnership Conversations • 2026"
    // at x=217.4, y=19.3, w=178.2, h=7.5
    const pg1 = doc.getPage(0);
    pg1.drawRectangle({ x: 200, y: 14, width: 220, height: 18, color: rgb(0, 0, 0) });

    const footer1 = 'Confidential Brief  •  Partnership Conversations  •  2026';
    const f1Sz = 7.5;
    const f1W = interRegular.widthOfTextAtSize(footer1, f1Sz);
    const pg1W = pg1.getWidth();
    pg1.drawText(footer1, {
        x: (pg1W - f1W) / 2, y: 19.3,
        size: f1Sz, font: interRegular, color: SLATE,
    });

    // Also cover the old CONFIDENTIAL TEASER tag text that's under the box
    // at x=255, y=560.8 — make sure cover is behind the CONFIDENTIAL BRIEF box
    pg1.drawRectangle({ x: 240, y: 555, width: 140, height: 16, color: rgb(0, 0, 0) });

    // Pages 2-7: Cover "Confidential Teaser • Nexalis Health • 2026"
    // at x=236.8, y=19.3, w=139.4, h=7.5
    for (let i = 1; i < doc.getPageCount(); i++) {
        const page = doc.getPage(i);
        page.drawRectangle({ x: 220, y: 14, width: 180, height: 18, color: rgb(0, 0, 0) });

        const footer = 'Confidential Brief  •  Nexalis Health  •  2026';
        const fSz = 7.5;
        const fW = interRegular.widthOfTextAtSize(footer, fSz);
        const pgW = page.getWidth();
        page.drawText(footer, {
            x: (pgW - fW) / 2, y: 19.3,
            size: fSz, font: interRegular, color: SLATE,
        });
    }

    const savedBytes = await doc.save();
    fs.writeFileSync(FILE, savedBytes);
    console.log(`\n  Updated: ${FILE}`);
    console.log(`  All footers now say "Confidential Brief"`);
    console.log(`  Size: ${(savedBytes.length / 1024).toFixed(1)} KB\n`);
}

main().catch(console.error);
