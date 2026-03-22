/**
 * rebuild_simple.cjs
 *
 * Dead simple: combine the 7 original clean page PDFs + add profile photo.
 * No text changes. No font changes. No overlays. Just combine and photo.
 */

const { PDFDocument } = require('pdf-lib');
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

    for (const pageName of PAGES) {
        const fp = path.join(DIR, pageName);
        const pageBytes = fs.readFileSync(fp);
        const srcDoc = await PDFDocument.load(pageBytes);
        const [copiedPage] = await doc.copyPages(srcDoc, [0]);
        doc.addPage(copiedPage);
    }

    // Add profile photo on last page
    const profilePicBytes = fs.readFileSync('C:\\Users\\zSixt\\Desktop\\profile pic.png');
    const profileImage = await doc.embedPng(profilePicBytes);
    const pg7 = doc.getPage(6);
    const pgW = pg7.getWidth();
    const imgSize = 100;
    pg7.drawImage(profileImage, {
        x: (pgW - imgSize) / 2,
        y: 180,
        width: imgSize,
        height: imgSize,
    });

    const savedBytes = await doc.save();
    fs.writeFileSync(OUT, savedBytes);
    console.log(`Created: ${OUT}`);
    console.log(`Pages: ${doc.getPageCount()}, Size: ${(savedBytes.length / 1024).toFixed(1)} KB`);
}

main().catch(console.error);
