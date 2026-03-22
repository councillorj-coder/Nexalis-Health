/**
 * rebuild_from_ref.cjs
 *
 * Uses the desktop reference PDF as the base (preserving all text, fonts,
 * positions exactly), just adds the profile photo on page 7.
 */

const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const REF = 'C:\\Users\\zSixt\\Desktop\\Nexalis_Partnership_Brief_Deck_.pdf';
const OUT = 'C:\\Users\\zSixt\\Desktop\\partnership teaser deck pdf\\Nexalis_Partnership_Brief_Deck_.pdf';

async function main() {
    // Load the reference PDF directly
    const refBytes = fs.readFileSync(REF);
    const doc = await PDFDocument.load(refBytes);

    console.log(`Loaded reference: ${doc.getPageCount()} pages`);

    // Add profile photo on page 7
    const profilePicBytes = fs.readFileSync('C:\\Users\\zSixt\\Desktop\\profile pic.png');
    const profileImage = await doc.embedPng(profilePicBytes);

    const pg7 = doc.getPage(6);
    const pgW = pg7.getWidth();

    // Jake Councillor text is at y=120.5, Contact at y=76.5
    // Place photo centered above the name
    const imgSize = 100;
    const imgX = (pgW - imgSize) / 2;
    const imgY = 180;  // above "Jake Councillor"

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
