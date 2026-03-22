const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function verify() {
    const SOURCE_DIR = 'C:\\Users\\zSixt\\Desktop\\patent pdfs\\node 5 provisional pdfs';
    const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.pdf'));

    console.log(`Checking ${files.length} PDFs...`);

    for (const file of files) {
        const bytes = fs.readFileSync(path.join(SOURCE_DIR, file));
        const pdf = await PDFDocument.load(bytes);
        const page = pdf.getPage(0);
        const { width, height } = page.getSize();

        // 8.5" x 11" = 612 x 792 points
        const isLetter = Math.abs(width - 612) < 2 && Math.abs(height - 792) < 2;
        if (!isLetter) {
            console.log(`${file}: ${width.toFixed(1)}x${height.toFixed(1)} FAIL`);
        }
    }
    console.log('Verification Complete (only failures shown above if any).');
}

verify().catch(console.error);
