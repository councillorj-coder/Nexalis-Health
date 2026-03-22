/**
 * fix_tag_boxes.cjs
 *
 * Restyles the tag boxes on pages 2-7 to match the CONFIDENTIAL BRIEF
 * box style on page 1, but in white. Thin border, centered text.
 */

const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const path = require('path');

const DIR = 'C:\\Users\\zSixt\\Desktop\\partnership teaser deck pdf';
const FILE = path.join(DIR, 'Nexalis_Partnership_Brief_Deck_.pdf');

// Tags for pages 2-7 (found at x=88, y=747)
const pageTags = [
    null,                // page 1 — skip
    'THE OPPORTUNITY',   // page 2
    'THE GAP',           // page 3
    'THE PLATFORM',      // page 4
    'STRATEGIC VALUE',   // page 5
    'FRAMEWORK',         // page 6
    'INVITATION',        // page 7
];

async function main() {
    const existingBytes = fs.readFileSync(FILE);
    const doc = await PDFDocument.load(existingBytes);
    doc.registerFontkit(fontkit);

    const fontDir = path.join(__dirname, 'fonts_inter', 'extras', 'ttf');
    const semiBoldBytes = fs.readFileSync(path.join(fontDir, 'Inter-SemiBold.ttf'));
    const interSemiBold = await doc.embedFont(semiBoldBytes);

    const WHITE_SOFT = rgb(0.85, 0.86, 0.88);
    const BLUE = rgb(0.23, 0.51, 0.96);

    for (let i = 1; i < doc.getPageCount(); i++) {
        const tag = pageTags[i];
        if (!tag) continue;

        const page = doc.getPage(i);

        // Cover old tag area (at x=88, y=747, generously)
        page.drawRectangle({
            x: 70, y: 740,
            width: 200, height: 22,
            color: rgb(0, 0, 0),
        });

        // Redraw with clean bordered box style — same as CONFIDENTIAL BRIEF
        const sz = 7.5;
        const tw = interSemiBold.widthOfTextAtSize(tag, sz);
        const padX = 10;
        const padY = 4;
        const boxW = tw + padX * 2;
        const boxH = sz + padY * 2;

        // Left-aligned at x=88 (same as original position)
        const textX = 88;
        const textY = 747;
        const boxX = textX - padX;
        const boxY = textY - padY;

        // Thin white border box
        page.drawRectangle({
            x: boxX, y: boxY,
            width: boxW, height: boxH,
            borderColor: WHITE_SOFT,
            borderWidth: 0.75,
            color: rgb(0, 0, 0),
        });

        // Subtle blue dot inside box (left side)
        page.drawCircle({
            x: textX - 4, y: textY + sz / 2 - 0.5,
            size: 2.5,
            color: BLUE,
        });

        // White text
        page.drawText(tag, {
            x: textX + 2, y: textY,
            size: sz,
            font: interSemiBold,
            color: WHITE_SOFT,
        });
    }

    const savedBytes = await doc.save();
    fs.writeFileSync(FILE, savedBytes);
    console.log(`\n  Updated: ${FILE}`);
    console.log(`  Restyled tags on pages 2-7`);
    console.log(`  Size: ${(savedBytes.length / 1024).toFixed(1)} KB\n`);
}

main().catch(console.error);
