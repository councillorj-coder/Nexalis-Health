/**
 * combine_figs.cjs
 * 
 * Combines individual FIG PDFs into logical groups for USPTO submission (≤100 files).
 * Ensures all figure pages fit within US Letter (8.5×11") portrait.
 * Moves originals to _originals subfolder — nothing is deleted.
 */

const fs = require('fs');
const path = require('path');
const { PDFDocument, PageSizes } = require('pdf-lib');

const PATENT_DIR = path.join('C:', 'Users', 'zSixt', 'Desktop', 'patent pdfs');
const ORIGINALS_DIR = path.join(PATENT_DIR, '_originals');

// US Letter in points: 612 x 792 (8.5 x 11 inches)
const LETTER_WIDTH = 612;
const LETTER_HEIGHT = 792;

// Define the three combination groups
const GROUPS = [
    {
        outputName: 'FIG_01-06_System_and_Node_Overviews.pdf',
        files: [
            'FIG_01_System_Overview.pdf',
            'FIG_02_Node1_External_Ring.pdf',
            'FIG_03_Node2_Intravaginal.pdf',
            'FIG_04_Node3_Scanner.pdf',
            'FIG_05_Node4_Intraluminal.pdf',
            'FIG_06_Node5_Context.pdf',
        ],
    },
    {
        outputName: 'FIG_07-12_Data_Workflow_Diagrams.pdf',
        files: [
            'FIG_07_Data_Pipeline.pdf',
            'FIG_08_Cross_Device_Correlation.pdf',
            'FIG_09_Cross_User_Consent.pdf',
            'FIG_10_Privacy_UI.pdf',
            'FIG_11_Multi_Pairing.pdf',
            'FIG_12_End_to_End_Workflow.pdf',
        ],
    },
    {
        outputName: 'FIG_13-18_Detail_Figures.pdf',
        files: [
            'FIG_13_System_Overview_Detail.pdf',
            'FIG_14_Node1_Wearable_Detail.pdf',
            'FIG_15_Node2_Intravaginal_Detail.pdf',
            'FIG_16_Node3_Scanner_Detail.pdf',
            'FIG_17_Node4_Intraluminal_Detail.pdf',
            'FIG_18_Node5_Context_Detail.pdf',
        ],
    },
];

async function combinePDFs(group) {
    const mergedPdf = await PDFDocument.create();

    for (const fileName of group.files) {
        const filePath = path.join(PATENT_DIR, fileName);
        if (!fs.existsSync(filePath)) {
            console.error(`  WARNING: ${fileName} not found, skipping.`);
            continue;
        }

        const existingBytes = fs.readFileSync(filePath);
        const existingPdf = await PDFDocument.load(existingBytes);
        const pages = await mergedPdf.copyPages(existingPdf, existingPdf.getPageIndices());

        for (const page of pages) {
            const { width, height } = page.getSize();

            // Ensure page fits within Letter portrait (8.5 x 11")
            // If page is landscape or oversized, scale it to fit
            if (width > LETTER_WIDTH || height > LETTER_HEIGHT) {
                const scaleX = LETTER_WIDTH / width;
                const scaleY = LETTER_HEIGHT / height;
                const scale = Math.min(scaleX, scaleY);
                page.setSize(LETTER_WIDTH, LETTER_HEIGHT);
                page.scaleContent(scale, scale);
                // Center the content on the new page
                const xOffset = (LETTER_WIDTH - width * scale) / 2;
                const yOffset = (LETTER_HEIGHT - height * scale) / 2;
                page.translateContent(xOffset, yOffset);
                console.log(`    Scaled page from ${fileName}: ${width.toFixed(0)}x${height.toFixed(0)} → ${LETTER_WIDTH}x${LETTER_HEIGHT} (scale: ${scale.toFixed(3)})`);
            }

            mergedPdf.addPage(page);
        }
        console.log(`  ✓ Added ${pages.length} page(s) from ${fileName}`);
    }

    const outputPath = path.join(PATENT_DIR, group.outputName);
    const mergedBytes = await mergedPdf.save();
    fs.writeFileSync(outputPath, mergedBytes);
    console.log(`  → Saved: ${group.outputName} (${mergedPdf.getPageCount()} pages, ${(mergedBytes.length / 1024).toFixed(1)}KB)\n`);
}

async function moveOriginals(group) {
    for (const fileName of group.files) {
        const srcPath = path.join(PATENT_DIR, fileName);
        const destPath = path.join(ORIGINALS_DIR, fileName);
        if (fs.existsSync(srcPath)) {
            fs.renameSync(srcPath, destPath);
            console.log(`  Moved: ${fileName} → _originals/`);
        }
    }
}

function countFiles(dir) {
    return fs.readdirSync(dir).filter(f => {
        const fullPath = path.join(dir, f);
        return fs.statSync(fullPath).isFile();
    }).length;
}

async function main() {
    console.log('=== Patent PDF Combiner for USPTO ===\n');

    // Count before
    const beforeCount = countFiles(PATENT_DIR);
    console.log(`Files before: ${beforeCount}\n`);

    // Create _originals directory
    if (!fs.existsSync(ORIGINALS_DIR)) {
        fs.mkdirSync(ORIGINALS_DIR, { recursive: true });
        console.log('Created _originals/ subfolder\n');
    }

    // Combine each group
    for (const group of GROUPS) {
        console.log(`Combining: ${group.outputName}`);
        await combinePDFs(group);
    }

    // Move originals
    console.log('Moving original FIG files to _originals/...');
    for (const group of GROUPS) {
        await moveOriginals(group);
    }

    // Count after
    console.log('');
    const afterCount = countFiles(PATENT_DIR);
    const originalsCount = countFiles(ORIGINALS_DIR);
    console.log(`\n=== Results ===`);
    console.log(`Files in main folder: ${afterCount}`);
    console.log(`Files in _originals/: ${originalsCount}`);
    console.log(`USPTO limit: 100`);
    console.log(`Status: ${afterCount <= 100 ? '✅ PASS — under 100 files' : '❌ FAIL — still over 100 files'}`);

    // Also check all remaining figure PDFs for page sizing
    console.log('\n=== Checking page sizes of all figure-related PDFs ===');
    const allFiles = fs.readdirSync(PATENT_DIR);
    const figPdfs = allFiles.filter(f => f.startsWith('FIG_') && f.endsWith('.pdf'));

    for (const fileName of figPdfs) {
        const filePath = path.join(PATENT_DIR, fileName);
        const bytes = fs.readFileSync(filePath);
        const pdf = await PDFDocument.load(bytes);
        const pages = pdf.getPages();
        for (let i = 0; i < pages.length; i++) {
            const { width, height } = pages[i].getSize();
            const withinLetter = width <= LETTER_WIDTH + 1 && height <= LETTER_HEIGHT + 1;
            console.log(`  ${fileName} p${i + 1}: ${width.toFixed(0)}x${height.toFixed(0)} ${withinLetter ? '✓' : '⚠ OVERSIZED'}`);
        }
    }

    console.log('\nDone!');
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
