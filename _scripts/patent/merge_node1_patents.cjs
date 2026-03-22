const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'C:\\Users\\zSixt\\Desktop\\patent pdfs\\node 1 logitudinal penile physiology';
const OUTPUT_PATH = 'C:\\Users\\zSixt\\Desktop\\Node1_Consolidated_Patent.pdf';

async function mergePDFs() {
    console.log('Starting Node 1 PDF merge...');
    const pdfFiles = fs.readdirSync(SOURCE_DIR)
        .filter(file => file.toLowerCase().endsWith('.pdf'))
        .sort();

    if (pdfFiles.length === 0) {
        console.log('No PDF files found to merge.');
        return;
    }

    const mergedDoc = await PDFDocument.create();

    for (const fileName of pdfFiles) {
        process.stdout.write(`Merging: ${fileName}... `);
        try {
            const filePath = path.join(SOURCE_DIR, fileName);
            const pdfBytes = fs.readFileSync(filePath);
            const srcDoc = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedDoc.copyPages(srcDoc, srcDoc.getPageIndices());
            copiedPages.forEach(page => mergedDoc.addPage(page));
            console.log('Done.');
        } catch (err) {
            console.error(`\nFailed to merge ${fileName}:`, err.message);
        }
    }

    const mergedPdfBytes = await mergedDoc.save();
    fs.writeFileSync(OUTPUT_PATH, mergedPdfBytes);
    console.log(`\nMerge complete! Consolidated file saved to: ${OUTPUT_PATH}`);
}

mergePDFs().catch(console.error);
