const fs = require('fs');
const path = require('path');

const DIR = 'C:\\Users\\zSixt\\Desktop\\Node 3 penile scanner patent pdf';
const ORIGINALS_DIR = path.join(DIR, '_originals_images');
const BACKUP_DIR = path.join(DIR, '_backup_drafts');

async function renameFiles() {
    console.log(`Working in: ${DIR}`);

    // Create subfolders if they don't exist
    if (!fs.existsSync(ORIGINALS_DIR)) fs.mkdirSync(ORIGINALS_DIR);
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR);

    const files = fs.readdirSync(DIR);

    const renameOps = [];
    const moveOps = [];

    files.forEach(file => {
        const fullPath = path.join(DIR, file);
        if (!fs.statSync(fullPath).isFile()) return;

        // 1. Move source images to _originals_images
        if (/\.(png|jpg|jpeg)$/i.test(file)) {
            moveOps.push({ from: file, to: path.join('_originals_images', file) });
            return;
        }

        // 2. Move drafts/simplified to _backup_drafts
        if (file.includes('Simplified') || file.includes('Updated') || file.includes('(1)')) {
            moveOps.push({ from: file, to: path.join('_backup_drafts', file) });
            return;
        }

        // 3. Main Renaming Logic for USPTO Complaint Names

        // Cover Sheet
        if (file.includes('CoverSheet')) {
            renameOps.push({ from: file, to: '00_Cover_Sheet.pdf' });
            return;
        }

        // Spec Pages
        // Example: USPTO_Provisional_Node03_ToF-OpticalMotion_GeometryProfile_Page01_Title-CrossRef-Field.pdf
        const specMatch = file.match(/Page(\d+)_([A-Za-z0-9_-]+)\.pdf$/i);
        if (specMatch && file.includes('USPTO_Provisional_Node03')) {
            const num = specMatch[1]; // Keep original numbering string for now
            const desc = specMatch[2];
            renameOps.push({ from: file, to: `${num}_Spec_Page_${num}_${desc}.pdf` });
            return;
        }

        // Drawing Pages (Created in previous step)
        // Example: USPTO_Node03_Drawing_FIG_01.pdf
        // We want to start drawings after the spec pages (which go up to 31)
        const dwgMatch = file.match(/Drawing_FIG_(\d+)(.*)\.pdf$/i);
        if (dwgMatch) {
            const figNum = parseInt(dwgMatch[1]);
            const extra = dwgMatch[2] || '';
            // Spec ends at Page 31. Let's start drawings at 32.
            // Offset is 31. FIG 1 -> 32.
            const orderNum = (31 + figNum).toString().padStart(2, '0');
            renameOps.push({ from: file, to: `${orderNum}_Drawing_FIG_${dwgMatch[1]}${extra}.pdf` });
            return;
        }
    });

    // Execute Move Ops
    console.log('\n--- Moving Files ---');
    moveOps.forEach(op => {
        try {
            fs.renameSync(path.join(DIR, op.from), path.join(DIR, op.to));
            console.log(`MOVED: ${op.from} -> ${op.to}`);
        } catch (e) {
            console.error(`ERROR moving ${op.from}: ${e.message}`);
        }
    });

    // Execute Rename Ops
    console.log('\n--- Renaming Files ---');
    renameOps.sort((a, b) => a.to.localeCompare(b.to)).forEach(op => {
        try {
            fs.renameSync(path.join(DIR, op.from), path.join(DIR, op.to));
            console.log(`RENAMED: ${op.from} -> ${op.to}`);
        } catch (e) {
            console.error(`ERROR renaming ${op.from}: ${e.message}`);
        }
    });

    console.log('\nProcess Complete.');
}

renameFiles().catch(console.error);
