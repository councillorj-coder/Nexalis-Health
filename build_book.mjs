import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const inputDir = 'C:\\Users\\zSixt\\Desktop\\engineering sheets';
const srcPdfPath = path.join(inputDir, '10 page c ring build summary.pdf');
const outputPath = path.join(inputDir, 'Nexalis_C_Ring_Complete_Engineering_Book.pdf');

// Map PNG files to the page number they follow, in order
// Sorted so that sub-images (1.2, 1.3) come after the main image (1)
const pngInserts = [
    { file: 'page 1.png', afterPage: 1 },
    { file: 'page 1.2.png', afterPage: 1 },
    { file: 'page1.3.png', afterPage: 1 },
    { file: 'page 2.png', afterPage: 2 },
    { file: 'page 2.2.png', afterPage: 2 },
    { file: 'page 3.png', afterPage: 3 },
    { file: 'page 4.png', afterPage: 4 },
    { file: 'page 5.png', afterPage: 5 },
    { file: 'page 6.png', afterPage: 6 },
];

// Verify all files exist
console.log('Verifying files...');
if (!fs.existsSync(srcPdfPath)) {
    console.error(`Missing source PDF: ${srcPdfPath}`);
    process.exit(1);
}
for (const item of pngInserts) {
    const fullPath = path.join(inputDir, item.file);
    if (!fs.existsSync(fullPath)) {
        console.error(`Missing PNG: ${item.file}`);
        process.exit(1);
    }
}
console.log('All files found.\n');

async function buildBook() {
    // Load the source PDF
    const srcPdfBytes = fs.readFileSync(srcPdfPath);
    const srcPdf = await PDFDocument.load(srcPdfBytes);
    const srcPageCount = srcPdf.getPageCount();
    console.log(`Source PDF: ${srcPageCount} pages`);

    // Create the output PDF
    const outPdf = await PDFDocument.create();

    // US Letter dimensions
    const LETTER_W = 612;
    const LETTER_H = 792;
    const MARGIN = 36; // 0.5 inch margin for PNG pages

    // Group PNGs by the page they follow
    const pngsByPage = {};
    for (const item of pngInserts) {
        if (!pngsByPage[item.afterPage]) {
            pngsByPage[item.afterPage] = [];
        }
        pngsByPage[item.afterPage].push(item.file);
    }

    // Build the book: for each source page, copy it, then insert any PNGs that follow it
    for (let pageNum = 1; pageNum <= srcPageCount; pageNum++) {
        // Copy the source PDF page
        const [copiedPage] = await outPdf.copyPages(srcPdf, [pageNum - 1]);
        outPdf.addPage(copiedPage);
        console.log(`Added PDF page ${pageNum}`);

        // Insert any PNGs that follow this page
        if (pngsByPage[pageNum]) {
            for (const pngFile of pngsByPage[pageNum]) {
                const pngPath = path.join(inputDir, pngFile);
                const pngBytes = fs.readFileSync(pngPath);
                const pngImage = await outPdf.embedPng(pngBytes);

                // Get image dimensions
                const imgW = pngImage.width;
                const imgH = pngImage.height;

                // Calculate scale to fit within page with margins
                const usableW = LETTER_W - 2 * MARGIN;
                const usableH = LETTER_H - 2 * MARGIN;
                const scaleX = usableW / imgW;
                const scaleY = usableH / imgH;
                const scale = Math.min(scaleX, scaleY);

                const drawW = imgW * scale;
                const drawH = imgH * scale;

                // Center on page
                const x = (LETTER_W - drawW) / 2;
                const y = (LETTER_H - drawH) / 2;

                // Add new page and draw the image
                const imgPage = outPdf.addPage([LETTER_W, LETTER_H]);
                imgPage.drawImage(pngImage, {
                    x,
                    y,
                    width: drawW,
                    height: drawH,
                });

                console.log(`  Inserted: ${pngFile} (${imgW}x${imgH} → ${drawW.toFixed(0)}x${drawH.toFixed(0)})`);
            }
        }
    }

    // Set metadata
    outPdf.setTitle('Nexalis C-Ring Complete Engineering Book');
    outPdf.setAuthor('Nexalis Health');
    outPdf.setSubject('Engineering Architecture & Specifications');
    outPdf.setCreator('Nexalis Health Engineering');

    const outBytes = await outPdf.save();
    fs.writeFileSync(outputPath, outBytes);
    console.log(`\nSuccessfully created: ${outputPath}`);
    console.log(`Total pages: ${outPdf.getPageCount()} (${srcPageCount} PDF + ${pngInserts.length} PNG)`);
}

buildBook().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
