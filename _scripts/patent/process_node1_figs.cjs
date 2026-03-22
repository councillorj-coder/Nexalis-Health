const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_DIR = 'C:\\Users\\zSixt\\Desktop\\patent pdfs\\node 1 logitudinal penile physiology';
const PREFIX = 'USPTO_Node01_Drawing_';

async function processFigs() {
    console.log(`Scanning directory: ${SOURCE_DIR}`);
    if (!fs.existsSync(SOURCE_DIR)) {
        console.error(`Error: Source directory does not exist: ${SOURCE_DIR}`);
        return;
    }

    const files = fs.readdirSync(SOURCE_DIR);

    // Filter for image files
    const imageFiles = files.filter(f =>
        /\.(png|jpg|jpeg)$/i.test(f)
    );

    console.log(`Found ${imageFiles.length} images to process.`);

    for (const imgFile of imageFiles) {
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

            // 3. Generate correct file name
            // Example: "FIG 1.png" -> "FIG_01"
            let baseName = imgFile.replace(/\.(png|jpg|jpeg)$/i, '');
            let match = baseName.match(/FIG[\s_](\d+)(.*)/i);
            let finalName = '';

            if (match) {
                let num = match[1].padStart(2, '0');
                let extra = match[2].trim().replace(/[\s_]+/g, '_');
                finalName = `${PREFIX}FIG_${num}${extra ? '_' + extra : ''}.pdf`;
            } else if (baseName.toLowerCase().startsWith('chatgpt image')) {
                // Handle ChatGPT default names: ChatGPT Image Feb 23, 2026, 03_31_55 PM
                let cleanName = baseName.replace(/ChatGPT Image\s+/i, '').replace(/[\s,:]+/g, '_');
                finalName = `${PREFIX}C_GPT_${cleanName}.pdf`;
            } else {
                finalName = `${PREFIX}${baseName.replace(/[\s_]+/g, '_')}.pdf`;
            }

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
