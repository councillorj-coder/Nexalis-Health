import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const inputPath = 'c:/Users/zSixt/Desktop/meridia internal.pdf';
const outputPath = path.resolve('public/meridia-internal.png');

console.log(`Attempting to convert ${inputPath} to ${outputPath}...`);

try {
    if (!fs.existsSync(inputPath)) {
        console.error(`Error: Input file not found at ${inputPath}`);
        process.exit(1);
    }

    await sharp(inputPath, { density: 300 }) // High density for better quality
        .png()
        .toFile(outputPath);

    console.log('Success: Image extracted to public/meridia-internal.png');
} catch (error) {
    console.error('Error extracting image:', error);
    process.exit(1);
}
