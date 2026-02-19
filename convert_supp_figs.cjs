const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function convertImages() {
    const images = [
        { src: 'fig_01_system_overview_1771206907868.jpg', dest: 'FIG_13_System_Overview_Detail.pdf', label: 'FIG. 13' },
        { src: 'fig_02_node1_wearable_1771206927160.jpg', dest: 'FIG_14_Node1_Wearable_Detail.pdf', label: 'FIG. 14' },
        { src: 'fig_03_node2_intravaginal_1771206944284.jpg', dest: 'FIG_15_Node2_Intravaginal_Detail.pdf', label: 'FIG. 15' }
    ];

    const parentDir = 'C:\\Users\\zSixt\\Desktop\\patent pdfs';

    for (const img of images) {
        const srcPath = path.join(parentDir, img.src);
        const destPath = path.join(parentDir, img.dest);

        if (!fs.existsSync(srcPath)) {
            console.error(`Source not found: ${srcPath}`);
            continue;
        }

        const doc = await PDFDocument.create();
        const bold = await doc.embedFont(StandardFonts.HelveticaBold);
        const imgBytes = fs.readFileSync(srcPath);
        const image = await doc.embedJpg(imgBytes);

        // Add some margin for the label
        const margin = 50;
        const page = doc.addPage([image.width, image.height + margin]);

        // Draw label at the top
        const labelSize = 24;
        const textWidth = bold.widthOfTextAtSize(img.label, labelSize);
        page.drawText(img.label, {
            x: (image.width - textWidth) / 2,
            y: image.height + 15,
            size: labelSize,
            font: bold,
            color: rgb(0, 0, 0),
        });

        // Draw image below the label
        page.drawImage(image, {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
        });

        const pdfBytes = await doc.save();
        fs.writeFileSync(destPath, pdfBytes);
        console.log(`Created: ${destPath}`);
    }
}

convertImages().catch(console.error);
