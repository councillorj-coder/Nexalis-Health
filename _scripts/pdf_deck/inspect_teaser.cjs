const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

const DIR = 'C:\\Users\\zSixt\\Desktop\\partnership teaser deck pdf';

async function inspectPDFs() {
    const files = fs.readdirSync(DIR).filter(f => f.endsWith('.pdf')).sort();
    console.log(`Found ${files.length} PDFs:\n`);

    for (const file of files) {
        const bytes = fs.readFileSync(path.join(DIR, file));
        const pdf = await PDFDocument.load(bytes);
        const page = pdf.getPage(0);
        const { width, height } = page.getSize();
        console.log(`${file}: ${width.toFixed(0)}x${height.toFixed(0)} pts, ${pdf.getPageCount()} page(s), ${bytes.length} bytes`);
    }
}

inspectPDFs().catch(console.error);
