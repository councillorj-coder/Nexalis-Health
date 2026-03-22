/**
 * fix_conf_box.cjs
 *
 * Changes "CONFIDENTIAL TEASER" to "CONFIDENTIAL BRIEF" on page 1,
 * with a cleaner, more professional styling.
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
    const semiBoldBytes = fs.readFileSync(path.join(fontDir, 'Inter-SemiBold.ttf'));
    const interSemiBold = await doc.embedFont(semiBoldBytes);

    const page = doc.getPage(0);
    const BLUE = rgb(0.23, 0.51, 0.96);       // #3B82F6
    const BLUE_SOFT = rgb(0.38, 0.60, 0.99);  // #60A5FA

    // Cover old boxes generously
    page.drawRectangle({
        x: 200, y: 548,
        width: 220, height: 40,
        color: rgb(0, 0, 0),
    });

    // Redraw smaller, tighter box
    const text = 'CONFIDENTIAL BRIEF';
    const sz = 7.5;
    const tw = interSemiBold.widthOfTextAtSize(text, sz);
    const pageW = page.getWidth();
    const cx = (pageW - tw) / 2;
    const cy = 564;

    const padX = 10;
    const padY = 4;
    const boxW = tw + padX * 2;
    const boxH = sz + padY * 2;
    const boxX = cx - padX;
    const boxY = cy - padY;

    page.drawRectangle({
        x: boxX, y: boxY,
        width: boxW, height: boxH,
        borderColor: BLUE,
        borderWidth: 0.75,
        color: rgb(0, 0, 0),  // solid black fill, no transparency issues
    });

    // Text — clean Inter SemiBold in blue
    page.drawText(text, {
        x: cx, y: cy,
        size: sz,
        font: interSemiBold,
        color: BLUE_SOFT,
    });

    // Save
    const savedBytes = await doc.save();
    fs.writeFileSync(FILE, savedBytes);
    console.log(`\n  Updated: ${FILE}`);
    console.log(`  Size: ${(savedBytes.length / 1024).toFixed(1)} KB\n`);
}

main().catch(console.error);
