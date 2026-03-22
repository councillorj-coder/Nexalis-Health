/**
 * extract_ref.cjs — Extract ALL text positions, sizes, fonts from the reference PDF
 */
const fs = require('fs');
const path = require('path');

const FILE = 'C:\\Users\\zSixt\\Desktop\\Nexalis_Partnership_Brief_Deck_.pdf';

async function main() {
    const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const data = new Uint8Array(fs.readFileSync(FILE));
    const pdfDoc = await getDocument({ data }).promise;

    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        const vp = page.getViewport({ scale: 1 });
        console.log(`\n=== Page ${i} (${vp.width}x${vp.height}) ===`);
        for (const item of content.items) {
            if (item.str && item.str.trim()) {
                console.log(`  "${item.str}" x=${item.transform[4].toFixed(1)} y=${item.transform[5].toFixed(1)} w=${item.width.toFixed(1)} h=${item.height.toFixed(1)} font=${item.fontName}`);
            }
        }
    }
}
main().catch(console.error);
