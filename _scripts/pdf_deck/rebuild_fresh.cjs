/**
 * rebuild_fresh.cjs
 *
 * Clean rebuild from the 7 original page PDFs.
 * No text changes, no font changes — just combine and add profile photo on page 7.
 */

const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const DIR = 'C:\\Users\\zSixt\\Desktop\\partnership teaser deck pdf';
const OUT = path.join(DIR, 'Nexalis_Partnership_Brief_Deck_.pdf');

const PAGES = [
    'Nexalis_Teaser_Deck_Page1_CLEAN.pdf',
    'Nexalis_Teaser_Deck_Page2_FIXED.pdf',
    'Nexalis_Teaser_Deck_Page3_CLEAN.pdf',
    'Nexalis_Teaser_Deck_Page4.pdf',
    'Nexalis_Teaser_Deck_Page5.pdf',
    'Nexalis_Teaser_Deck_Page6.pdf',
    'Nexalis_Teaser_Deck_Page7.pdf',
];

async function main() {
    const doc = await PDFDocument.create();

    // Combine all pages
    for (const pageName of PAGES) {
        const pageBytes = fs.readFileSync(path.join(DIR, pageName));
        const srcDoc = await PDFDocument.load(pageBytes);
        const [copiedPage] = await doc.copyPages(srcDoc, [0]);
        doc.addPage(copiedPage);
    }

    console.log(`Combined ${doc.getPageCount()} pages`);

    // Add profile photo on last page (page 7)
    const profilePicBytes = fs.readFileSync('C:\\Users\\zSixt\\Desktop\\profile pic.png');
    const profileImage = await doc.embedPng(profilePicBytes);

    const pg7 = doc.getPage(6);
    const pgW = pg7.getWidth();

    // Find where to place it — above the contact info area
    // On page 7, "Jake Councillor" is around y=120, so place photo above
    const imgSize = 120;
    const imgX = (pgW - imgSize) / 2;
    const imgY = 180;  // above name/title area

    pg7.drawImage(profileImage, {
        x: imgX, y: imgY,
        width: imgSize, height: imgSize,
    });

    // Save
    const savedBytes = await doc.save();
    fs.writeFileSync(OUT, savedBytes);
    console.log(`\n  Created: ${OUT}`);
    console.log(`  Pages: ${doc.getPageCount()}`);
    console.log(`  Size: ${(savedBytes.length / 1024).toFixed(1)} KB\n`);
}

main().catch(console.error);
