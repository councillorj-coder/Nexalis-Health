const fs = require('fs');
const path = require('path');
const { getDocument } = require('pdfjs-dist/legacy/build/pdf.mjs');

const DIR = 'C:\\Users\\zSixt\\Desktop\\partnership teaser deck pdf';

async function extractText() {
    const files = fs.readdirSync(DIR).filter(f => f.endsWith('.pdf')).sort();

    for (const file of files) {
        const filePath = path.join(DIR, file);
        const data = new Uint8Array(fs.readFileSync(filePath));
        const doc = await getDocument({ data }).promise;
        const page = await doc.getPage(1);
        const content = await page.getTextContent();
        const text = content.items.map(i => i.str).join(' ');
        console.log(`\n=== ${file} ===`);
        console.log(text);
        console.log('---');
    }
}

extractText().catch(console.error);
