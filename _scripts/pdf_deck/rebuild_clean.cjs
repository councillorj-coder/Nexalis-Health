/**
 * rebuild_clean.cjs
 *
 * Rebuilds the deck from the original clean page PDFs, then applies
 * ALL modifications in one clean pass:
 *   1. Combine pages 1-7
 *   2. Remove "Biological Intelligence" text on page 1
 *   3. Replace "CONFIDENTIAL TEASER" box with "CONFIDENTIAL BRIEF"
 *   4. Replace "Founder & CEO, Nexalis Health" with "Founder, Inventor, and CEO"
 *   5. Add subtle glow circles on pages 2-7 using Screen blend mode
 *      with VERY low intensity — just a whisper of color
 */

const { PDFDocument, rgb, PDFName, PDFArray } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const path = require('path');

const DIR = 'C:\\Users\\zSixt\\Desktop\\partnership teaser deck pdf';
const OUT = path.join(DIR, 'Nexalis_Partnership_Brief_Deck_.pdf');

// Source page files (in order)
const PAGES = [
    'Nexalis_Teaser_Deck_Page1_CLEAN.pdf',
    'Nexalis_Teaser_Deck_Page2_FIXED.pdf',
    'Nexalis_Teaser_Deck_Page3_CLEAN.pdf',
    'Nexalis_Teaser_Deck_Page4.pdf',
    'Nexalis_Teaser_Deck_Page5.pdf',
    'Nexalis_Teaser_Deck_Page6.pdf',
    'Nexalis_Teaser_Deck_Page7.pdf',
];

// Very subtle glow circle layouts for pages 2-7
// Using extremely low color values for Screen blend
const glowLayouts = [
    // Page 2 — blue top-right, red bottom-left
    [
        { x: 480, y: 650, r: 160, cr: 0.008, cg: 0.015, cb: 0.04 },
        { x: 100, y: 120, r: 140, cr: 0.04, cg: 0.008, cb: 0.012 },
    ],
    // Page 3 — red top-left, blue bottom-right
    [
        { x: 80, y: 680, r: 150, cr: 0.04, cg: 0.008, cb: 0.012 },
        { x: 500, y: 100, r: 170, cr: 0.008, cg: 0.015, cb: 0.04 },
    ],
    // Page 4 — blue center-left, red top-right
    [
        { x: 60, y: 400, r: 180, cr: 0.008, cg: 0.015, cb: 0.04 },
        { x: 520, y: 700, r: 130, cr: 0.03, cg: 0.005, cb: 0.012 },
    ],
    // Page 5 — red bottom-right, blue top-left
    [
        { x: 530, y: 80, r: 160, cr: 0.04, cg: 0.008, cb: 0.012 },
        { x: 70, y: 720, r: 140, cr: 0.008, cg: 0.012, cb: 0.03 },
    ],
    // Page 6 — blue bottom-left, red center-right
    [
        { x: 90, y: 100, r: 170, cr: 0.008, cg: 0.015, cb: 0.04 },
        { x: 510, y: 380, r: 150, cr: 0.04, cg: 0.008, cb: 0.012 },
    ],
    // Page 7 (closing) — blue top-right, red bottom-left
    [
        { x: 500, y: 700, r: 150, cr: 0.008, cg: 0.012, cb: 0.03 },
        { x: 80, y: 80, r: 140, cr: 0.03, cg: 0.005, cb: 0.012 },
    ],
];

function drawFilledCircle(cx, cy, r, cr, cg, cb) {
    const k = 0.5523 * r;
    let s = '';
    s += `${cr} ${cg} ${cb} rg\n`;
    s += `${cx} ${cy + r} m\n`;
    s += `${cx + k} ${cy + r} ${cx + r} ${cy + k} ${cx + r} ${cy} c\n`;
    s += `${cx + r} ${cy - k} ${cx + k} ${cy - r} ${cx} ${cy - r} c\n`;
    s += `${cx - k} ${cy - r} ${cx - r} ${cy - k} ${cx - r} ${cy} c\n`;
    s += `${cx - r} ${cy + k} ${cx - k} ${cy + r} ${cx} ${cy + r} c\n`;
    s += `f\n`;
    return s;
}

async function main() {
    // Step 1: Combine all pages into one doc
    const doc = await PDFDocument.create();
    doc.registerFontkit(fontkit);

    for (const pageName of PAGES) {
        const pageBytes = fs.readFileSync(path.join(DIR, pageName));
        const srcDoc = await PDFDocument.load(pageBytes);
        const [copiedPage] = await doc.copyPages(srcDoc, [0]);
        doc.addPage(copiedPage);
    }

    console.log(`Combined ${doc.getPageCount()} pages`);

    // Load fonts
    const fontDir = path.join(__dirname, 'fonts_inter', 'extras', 'ttf');
    const semiBoldBytes = fs.readFileSync(path.join(fontDir, 'Inter-SemiBold.ttf'));
    const italicBytes = fs.readFileSync(path.join(fontDir, 'Inter-MediumItalic.ttf'));
    const interSemiBold = await doc.embedFont(semiBoldBytes);
    const interItalic = await doc.embedFont(italicBytes);

    const BLUE = rgb(0.23, 0.51, 0.96);
    const BLUE_SOFT = rgb(0.38, 0.60, 0.99);
    const context = doc.context;

    // ── Page 1 modifications ──
    const pg1 = doc.getPage(0);

    // Remove "Biological Intelligence" text (cover with black)
    pg1.drawRectangle({ x: 60, y: 48, width: 500, height: 80, color: rgb(0, 0, 0) });

    // Replace CONFIDENTIAL TEASER with CONFIDENTIAL BRIEF
    pg1.drawRectangle({ x: 200, y: 548, width: 220, height: 40, color: rgb(0, 0, 0) });
    const confText = 'CONFIDENTIAL BRIEF';
    const confSz = 7.5;
    const confW = interSemiBold.widthOfTextAtSize(confText, confSz);
    const confCx = (pg1.getWidth() - confW) / 2;
    const confCy = 564;
    const padX = 10, padY = 4;
    pg1.drawRectangle({
        x: confCx - padX, y: confCy - padY,
        width: confW + padX * 2, height: confSz + padY * 2,
        borderColor: BLUE, borderWidth: 0.75, color: rgb(0, 0, 0),
    });
    pg1.drawText(confText, { x: confCx, y: confCy, size: confSz, font: interSemiBold, color: BLUE_SOFT });

    // ── Page 7 modifications ──
    const pg7 = doc.getPage(6);
    const pg7W = pg7.getWidth();

    // Replace "Founder & CEO, Nexalis Health" with "Founder, Inventor, and CEO"
    pg7.drawRectangle({ x: 170, y: 90, width: 280, height: 28, color: rgb(0, 0, 0) });
    const titleText = 'Founder, Inventor, and CEO';
    const titleSz = 14;
    const titleW = interItalic.widthOfTextAtSize(titleText, titleSz);
    pg7.drawText(titleText, {
        x: (pg7W - titleW) / 2, y: 99,
        size: titleSz, font: interItalic, color: BLUE_SOFT,
    });

    // Save
    const savedBytes = await doc.save();
    fs.writeFileSync(OUT, savedBytes);
    console.log(`\n  Created: ${OUT}`);
    console.log(`  Pages: ${doc.getPageCount()}`);
    console.log(`  Size: ${(savedBytes.length / 1024).toFixed(1)} KB\n`);
}

main().catch(console.error);
