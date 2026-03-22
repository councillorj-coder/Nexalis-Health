const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_DIR = 'C:\\Users\\zSixt\\Desktop\\node 4 intraluminal scanner';

async function processFigs() {
    console.log(`Scanning directory: ${SOURCE_DIR}`);
    const files = fs.readdirSync(SOURCE_DIR);

    // 1. Identify "manual" figures first
    const manualFigs = files.filter(f =>
        (f.includes('fig_01') || f.includes('fig_node4')) && /\.(png|jpg|jpeg)$/i.test(f)
    ).sort();

    // 2. Identify ChatGPT images and sort them by timestamp (name)
    const chatGPTFigs = files.filter(f =>
        f.startsWith('ChatGPT Image') && /\.(png|jpg|jpeg)$/i.test(f)
    ).sort();

    const allImages = [...manualFigs, ...chatGPTFigs];

    console.log(`Found ${allImages.length} images to process.`);

    for (let i = 0; i < allImages.length; i++) {
        const imgFile = allImages[i];
        try {
            const srcPath = path.join(SOURCE_DIR, imgFile);

            // 1. Convert to Grayscale and get dimensions
            const imageBuffer = fs.readFileSync(srcPath);
            const sharpImg = sharp(imageBuffer).grayscale();
            const { width, height } = await sharpImg.metadata();
            const grayscaleBuffer = await sharpImg.toBuffer();

            // 2. Create PDF (Letter size: 8.5" x 11" = 612 x 792 points)
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([612, 792]);
            const W = 612;
            const H = 792;
            const margin = 72; // 1 inch = 72 points

            // Embed image
            let embeddedImg;
            if (imgFile.toLowerCase().endsWith('.png')) {
                embeddedImg = await pdfDoc.embedPng(grayscaleBuffer);
            } else {
                embeddedImg = await pdfDoc.embedJpg(grayscaleBuffer);
            }

            // Calculate scaling to fit within 1-inch margins
            const maxW = W - 2 * margin;
            const maxH = H - 2 * margin;
            const scale = Math.min(maxW / width, maxH / height, 1.0);

            const drawW = width * scale;
            const drawH = height * scale;
            const x = (W - drawW) / 2;
            const y = (H - drawH) / 2;

            page.drawImage(embeddedImg, {
                x,
                y,
                width: drawW,
                height: drawH,
            });

            // Intermediate name for drawings
            const figNum = (i + 1).toString().padStart(2, '0');
            const finalName = `Drawing_FIG_${figNum}.pdf`;

            const outPath = path.join(SOURCE_DIR, finalName);
            const pdfBytes = await pdfDoc.save();
            fs.writeFileSync(outPath, pdfBytes);

            console.log(`OK: ${imgFile} -> ${finalName}`);
        } catch (err) {
            console.error(`ERROR processing ${imgFile}:`, err);
        }
    }
    console.log('Done.');
}

processFigs().catch(console.error);
