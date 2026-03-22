/**
 * fix_closing_title.cjs
 *
 * Changes "Founder & CEO, Nexalis Health" on the last page to
 * "Founder, Inventor, CEO"
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
    const italicBytes = fs.readFileSync(path.join(fontDir, 'Inter-MediumItalic.ttf'));
    const interItalic = await doc.embedFont(italicBytes);

    const pg = doc.getPage(doc.getPageCount() - 1);
    const pageW = pg.getWidth();
    const BLUE_SOFT = rgb(0.38, 0.60, 0.99);

    // Cover old text generously
    pg.drawRectangle({
        x: 170, y: 90,
        width: 280, height: 28,
        color: rgb(0, 0, 0),
    });

    // Redraw with new text
    const text = 'Founder, Inventor, and CEO';
    const sz = 14;
    const tw = interItalic.widthOfTextAtSize(text, sz);
    const cx = (pageW - tw) / 2;

    pg.drawText(text, {
        x: cx, y: 99,
        size: sz,
        font: interItalic,
        color: BLUE_SOFT,
    });

    const savedBytes = await doc.save();
    fs.writeFileSync(FILE, savedBytes);
    console.log(`\n  Updated: ${FILE}`);
    console.log(`  Size: ${(savedBytes.length / 1024).toFixed(1)} KB\n`);
}

main().catch(console.error);
