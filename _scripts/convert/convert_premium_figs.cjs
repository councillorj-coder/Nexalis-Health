const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function convertPremiumImages() {
    const parentDir = 'C:\\Users\\zSixt\\Desktop\\patent pdfs';

    // Mapping images to their formal FIG numbers (13-18)
    const images = [
        { src: 'fig13_supplementary_system_overview_v2.png', dest: 'FIG_13_System_Overview_Detail.pdf', label: 'FIG. 13' },
        { src: 'fig_node1_detail_v2.png', dest: 'FIG_14_Node1_Wearable_Detail.pdf', label: 'FIG. 14' },
        { src: 'fig_node2_detail_v2.png', dest: 'FIG_15_Node2_Intravaginal_Detail.pdf', label: 'FIG. 15' },
        { src: 'fig_node3_detail_v2.png', dest: 'FIG_16_Node3_Scanner_Detail.pdf', label: 'FIG. 16' },
        { src: 'fig_node4_detail_v2.png', dest: 'FIG_17_Node4_Intraluminal_Detail.pdf', label: 'FIG. 17' },
        { src: 'fig_node5_detail_v2.png', dest: 'FIG_18_Node5_Context_Detail.pdf', label: 'FIG. 18' }
    ];

    for (const img of images) {
        let srcPath = path.join(parentDir, img.src);

        // Check if the file is in artifacts directory (for the newly generated one)
        const artifactPath = path.join('C:\\Users\\zSixt\\.gemini\\antigravity\\brain\\01cbb430-ae6e-4b1e-a27e-a8f10e8d9650', img.src);
        if (fs.existsSync(artifactPath) && !fs.existsSync(srcPath)) {
            fs.copyFileSync(artifactPath, srcPath);
            console.log(`Copied artifact to: ${srcPath}`);
        }

        const destPath = path.join(parentDir, img.dest);

        if (!fs.existsSync(srcPath)) {
            console.error(`Source not found: ${srcPath}`);
            continue;
        }

        const doc = await PDFDocument.create();
        const bold = await doc.embedFont(StandardFonts.HelveticaBold);
        const imgBytes = fs.readFileSync(srcPath);

        const image = await doc.embedPng(imgBytes);

        const targetWidth = 600;
        const scale = targetWidth / image.width;
        const width = image.width * scale;
        const height = image.height * scale;

        const margin = 50;
        const page = doc.addPage([width, height + margin]);

        const labelSize = 24;
        const textWidth = bold.widthOfTextAtSize(img.label, labelSize);
        page.drawText(img.label, {
            x: (width - textWidth) / 2,
            y: height + 15,
            size: labelSize,
            font: bold,
            color: rgb(0, 0, 0),
        });

        page.drawImage(image, {
            x: 0,
            y: 0,
            width: width,
            height: height,
        });

        const pdfBytes = await doc.save();
        fs.writeFileSync(destPath, pdfBytes);
        console.log(`Created: ${destPath}`);
    }
}

convertPremiumImages().catch(console.error);
