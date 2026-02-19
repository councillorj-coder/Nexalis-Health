import { PDFDocument, PDFName } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const inputPath = 'c:/Users/zSixt/Desktop/meridia internal.pdf';
const outputDir = path.resolve('public');

async function extractImages() {
    console.log(`Loading PDF from ${inputPath}...`);
    const existingPdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const enumeratedIndirectObjects = pdfDoc.context.enumerateIndirectObjects();
    let imageCount = 0;

    for (const [ref, pdfObject] of enumeratedIndirectObjects) {
        if (pdfObject.toString().includes('/Image')) {
            // It might be an image
            // Check if it has a property /Subtype /Image
            // In pdf-lib, we need to lookup properties.
            // Simplified check:
            const dict = pdfObject; // usually PDFDict
            if (dict.get && dict.get(PDFName.of('Subtype')) === PDFName.of('Image')) {
                console.log(`Found image at ref ${ref}`);

                const filter = dict.get(PDFName.of('Filter'));
                console.log(`Filter: ${filter}`);

                if (filter === PDFName.of('DCTDecode')) {
                    // It's a JPEG
                    const imageBytes = pdfDoc.context.lookup(ref).contents; // Is it contents? No, stream content.
                    // Raw stream content is harder to get in high level.
                    // We shouldn't rely on private APIs if possible, but let's try standard way.
                    // Actually, let's just use the raw bytes if we can find them.
                    // In pdf-lib, PDFRawStream has contents.

                    // Let's try to get the raw stream buffer.
                    // The object `pdfObject` might be the stream or dict.
                    // Wait, enumerateIndirectObjects returns (ref, object).
                    // If it is a stream, it has a dict and contents.

                    // Let's assume it is a stream if it is an image.
                    if (pdfObject.constructor.name === 'PDFRawStream' || pdfObject.constructor.name === 'PDFStream') {
                        const data = pdfObject.contents; // This is the compressed data (JPEG file content usually)
                        const filename = path.join(outputDir, `meridia-internal-${imageCount}.jpg`);
                        fs.writeFileSync(filename, data);
                        console.log(`Saved ${filename}`);
                        imageCount++;
                    }
                } else if (Array.isArray(filter) && filter.includes(PDFName.of('DCTDecode'))) {
                    // Array of filters
                    // similar handling
                }
            }
        }
    }

    if (imageCount === 0) {
        console.log('No JPG images found.');
        process.exit(1);
    }
}

extractImages().catch(err => {
    console.error(err);
    process.exit(1);
});
