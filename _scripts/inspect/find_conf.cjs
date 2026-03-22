const fs = require('fs');
const path = require('path');
const DIR = 'C:\\Users\\zSixt\\Desktop\\partnership teaser deck pdf';
const FILE = path.join(DIR, 'Nexalis_Partnership_Brief_Deck_.pdf');

async function main() {
    const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const data = new Uint8Array(fs.readFileSync(FILE));
    const pdfDoc = await getDocument({ data }).promise;

    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        for (const item of content.items) {
            const s = item.str.toLowerCase();
            if (s.includes('confidential') || s.includes('teaser') || s.includes('preview')) {
                console.log(`Page ${i}: "${item.str}" x=${item.transform[4].toFixed(1)} y=${item.transform[5].toFixed(1)} w=${item.width.toFixed(1)} h=${item.height.toFixed(1)}`);
            }
        }
    }
}
main().catch(console.error);
