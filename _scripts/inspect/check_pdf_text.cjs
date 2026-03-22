const fs = require('fs');
const pdf = require('pdf-parse');

async function checkPdf(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }
    const dataBuffer = fs.readFileSync(filePath);
    try {
        const data = await pdf(dataBuffer);
        console.log(`--- Content of ${filePath} ---`);
        console.log(data.text.substring(0, 1000));
        console.log('--- End ---');
    } catch (err) {
        console.error('Error parsing PDF:', err);
    }
}

const target = process.argv[2] || 'C:\\Users\\zSixt\\Desktop\\node 4 intraluminal scanner\\Node4_Page1_FINAL.pdf';
checkPdf(target).catch(console.error);
