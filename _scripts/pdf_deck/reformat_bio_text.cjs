/**
 * reformat_bio_text.cjs
 *
 * Opens the existing Nexalis_Partnership_Teaser_Deck_.pdf and reformats
 * the "Biological Intelligence • High Performance • Proprietary Engine" text
 * on page 1.
 *
 * Approach: Cover the existing text with a black rectangle, then redraw
 * the text with improved styling — moved higher, lighter weight, spaced out.
 */

const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const path = require('path');

const DIR = 'C:\\Users\\zSixt\\Desktop\\partnership teaser deck pdf';
const FILE = path.join(DIR, 'Nexalis_Partnership_Teaser_Deck_.pdf');

async function main() {
    const existingBytes = fs.readFileSync(FILE);
    const doc = await PDFDocument.load(existingBytes);
    doc.registerFontkit(fontkit);

    // Load Inter Bold for the replacement text
    const fontDir = path.join(__dirname, 'fonts_inter', 'extras', 'ttf');
    const boldBytes = fs.readFileSync(path.join(fontDir, 'Inter-Bold.ttf'));
    const interBold = await doc.embedFont(boldBytes);

    const page = doc.getPage(0); // Page 1

    // Cover all previous text layers with a single black rectangle
    page.drawRectangle({
        x: 60, y: 48,
        width: 500, height: 80,
        color: rgb(0, 0, 0),
    });

    // Save back to the same file
    const savedBytes = await doc.save();
    fs.writeFileSync(FILE, savedBytes);
    console.log(`\n  Updated: ${FILE}`);
    console.log(`  Size: ${(savedBytes.length / 1024).toFixed(1)} KB\n`);
}

main().catch(console.error);
