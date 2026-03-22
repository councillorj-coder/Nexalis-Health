const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function verify() {
    const SOURCE_DIR = 'C:\\Users\\zSixt\\Desktop\\patent pdfs\\node 1 logitudinal penile physiology';
    const files = fs.readdirSync(SOURCE_DIR).filter(f => f.startsWith('USPTO_Node01_Drawing_') && f.endsWith('.pdf'));

    console.log(`Checking ${files.length} PDFs...`);

    for (const file of files) {
        const bytes = fs.readFileSync(path.join(SOURCE_DIR, file));
        const pdf = await PDFDocument.load(bytes);
        const page = pdf.getPage(0);
        const { width, height } = page.getSize();

        // 8.5" x 11" = 612 x 792 points
        const isLetter = Math.abs(width - 612) < 1 && Math.abs(height - 792) < 1;
        console.log(`${file}: ${width}x${height} ${isLetter ? 'OK' : 'FAIL'}`);
    }
}

verify().catch(console.error);
