const fs = require('fs');
const path = require('path');

const pdfDir = 'C:\\Users\\zSixt\\Desktop\\patent pdfs';

async function extractPDF(filePath) {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const data = new Uint8Array(fs.readFileSync(filePath));
    const doc = await pdfjsLib.getDocument({ data }).promise;
    let text = '';
    for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + '\n';
    }
    return text;
}

async function main() {
    const files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf')).sort();
    const results = {};

    for (const file of files) {
        try {
            const text = await extractPDF(path.join(pdfDir, file));
            results[file] = text.substring(0, 3000);
            process.stdout.write('.');
        } catch (err) {
            results[file] = `ERROR: ${err.message}`;
            process.stdout.write('X');
        }
    }

    console.log('\nDone.');
    fs.writeFileSync(
        path.join(pdfDir, 'extracted_text.json'),
        JSON.stringify(results, null, 2),
        'utf8'
    );
}

main().catch(console.error);
