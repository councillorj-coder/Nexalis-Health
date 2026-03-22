const fs = require('fs');
const path = require('path');

const DIR = 'C:\\Users\\zSixt\\Desktop\\node 4 intraluminal scanner';
const ORIGINALS_DIR = path.join(DIR, '_originals_images');
const BACKUP_DIR = path.join(DIR, '_backup_drafts');

async function renameFiles() {
    console.log(`Working in: ${DIR}`);

    // Create subfolders if they don't exist
    if (!fs.existsSync(ORIGINALS_DIR)) fs.mkdirSync(ORIGINALS_DIR);
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR);

    const files = fs.readdirSync(DIR);

    const specPages = {}; // { num: [files] }
    const drawings = [];
    const others = [];

    files.forEach(file => {
        const fullPath = path.join(DIR, file);
        if (!fs.statSync(fullPath).isFile()) return;

        // 1. Move original images to _originals_images
        if (/\.(png|jpg|jpeg)$/i.test(file)) {
            others.push({ file, action: 'MOVE_ORIGINAL' });
            return;
        }

        // 2. Identification
        if (file.startsWith('Drawing_FIG_')) {
            drawings.push(file);
        } else if (file.startsWith('Node4_Page')) {
            const match = file.match(/Node4_Page(\d+)/i);
            if (match) {
                const num = parseInt(match[1]);
                if (!specPages[num]) specPages[num] = [];
                specPages[num].push(file);
            } else {
                others.push({ file, action: 'BACKUP' });
            }
        } else if (file.includes('84_Patent_Figures') || file.includes('FIG_')) {
            // These seem like redundant or collection files
            others.push({ file, action: 'BACKUP' });
        } else {
            others.push({ file, action: 'STAY' });
        }
    });

    const renameOps = [];
    const moveOps = [];

    // --- Process Specification Pages ---
    for (let i = 1; i <= 48; i++) {
        const candidates = specPages[i];
        if (!candidates) {
            console.warn(`Warning: Missing Page ${i}`);
            continue;
        }

        // Selection priority: FINAL > FIXED > FULLPAGE > [Others]
        let selected = candidates[0];
        if (candidates.length > 1) {
            const priority = (f) => {
                if (f.includes('FINAL')) return 3;
                if (f.includes('FIXED')) return 2;
                if (f.includes('FULLPAGE')) return 1;
                return 0;
            };
            selected = candidates.reduce((prev, curr) => priority(curr) > priority(prev) ? curr : prev);

            // Move non-selected to backup
            candidates.forEach(f => {
                if (f !== selected) moveOps.push({ from: f, to: path.join('_backup_drafts', f) });
            });
        }

        const newName = `${i.toString().padStart(2, '0')}_Specification_Page_${i.toString().padStart(2, '0')}.pdf`;
        renameOps.push({ from: selected, to: newName });
    }

    // --- Process Drawings ---
    drawings.sort().forEach((file, index) => {
        const figNumStr = file.match(/FIG_(\d+)/)[1];
        // Start after Page 48 -> 49
        const orderNum = (48 + index + 1).toString().padStart(2, '0');
        const newName = `${orderNum}_Drawing_FIG_${figNumStr}.pdf`;
        renameOps.push({ from: file, to: newName });
    });

    // --- Process Others ---
    others.forEach(op => {
        if (op.action === 'MOVE_ORIGINAL') {
            moveOps.push({ from: op.file, to: path.join('_originals_images', op.file) });
        } else if (op.action === 'BACKUP') {
            moveOps.push({ from: op.file, to: path.join('_backup_drafts', op.file) });
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
