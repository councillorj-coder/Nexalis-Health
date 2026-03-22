const fs = require('fs');
const path = require('path');

const DIR = 'C:\\Users\\zSixt\\Desktop\\patent pdfs\\node 2 longitudinal vagina monitor';
const BACKUP_DIR = path.join(DIR, '_backup_v1');

async function organizeNode2() {
    console.log(`Organizing folder: ${DIR}`);
    if (!fs.existsSync(DIR)) {
        console.error(`Error: Directory not found: ${DIR}`);
        return;
    }
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR);

    const files = fs.readdirSync(DIR).filter(f => f.endsWith('.pdf'));

    const specPages = [];
    const drawings = [];
    const cover = [];
    const masterPages = [];

    files.forEach(file => {
        // Already simplified Spec: 01_Specification_Page_01.pdf
        const simplifiedSpecMatch = file.match(/^(\d+)_Specification_Page_(\d+)/i);
        if (simplifiedSpecMatch) {
            specPages.push({ oldName: file, num: parseInt(simplifiedSpecMatch[2]), simplified: true });
            return;
        }

        // Already simplified Drawing: 45_Drawing_Figure_45.pdf
        const simplifiedDwgMatch = file.match(/^(\d+)_Drawing_Figure_(\d+|Misc)/i);
        if (simplifiedDwgMatch) {
            drawings.push({
                oldName: file,
                figNum: (simplifiedDwgMatch[2] === 'Misc' ? null : parseInt(simplifiedDwgMatch[2])),
                simplified: true
            });
            return;
        }

        // Cover Sheet
        if (file.toLowerCase().includes('cover_sheet')) {
            cover.push(file);
            return;
        }

        // Spec Pages: Node_2_Spec_Page_01.pdf
        const specMatch = file.match(/Node_2_Spec_Page_(\d+)/i);
        if (specMatch) {
            specPages.push({ oldName: file, num: parseInt(specMatch[1]) });
            return;
        }

        // Newly converted drawings: USPTO_Node02_Drawing_...
        const dwgMatch = file.match(/USPTO_Node02_Drawing_(.*)\.pdf/i);
        if (dwgMatch) {
            let desc = dwgMatch[1];
            let figNum = null;
            const figMatch = desc.match(/FIG_(\d+)/i);
            if (figMatch) figNum = parseInt(figMatch[1]);
            drawings.push({ oldName: file, figNum: figNum });
            return;
        }

        // Older FIG files
        const figMatch = file.match(/^FIG_(\d+)/i);
        if (figMatch) {
            drawings.push({ oldName: file, figNum: parseInt(figMatch[1]) });
            return;
        }

        // Master / Tie-in
        if (file.toLowerCase().includes('master_system_tiein') ||
            file.includes('84_Patent_Figures') ||
            file.includes('Continuation_Anchor') ||
            file.includes('Master_System_Integration') ||
            file.includes('Specification_Master_TieIn')) {
            masterPages.push(file);
            return;
        }
    });

    const renameOps = [];
    const processedFiles = new Set();
    let nextOrder = 0;

    // 1. Cover Sheet
    if (cover.length > 0) {
        renameOps.push({ from: cover[0], to: '00_Cover_Sheet.pdf' });
        processedFiles.add(cover[0]);
        nextOrder = 1;
    }

    // 2. Specification Pages
    const specGroup = {};
    specPages.forEach(s => {
        if (!specGroup[s.num] || s.oldName.includes('Full_Page') || s.simplified) {
            specGroup[s.num] = s.oldName;
        }
    });

    const sortedNums = Object.keys(specGroup).map(Number).sort((a, b) => a - b);
    sortedNums.forEach(num => {
        const orderStr = nextOrder.toString().padStart(2, '0');
        const numStr = num.toString().padStart(2, '0');
        const selected = specGroup[num];
        const newName = `${orderStr}_Specification_Page_${numStr}.pdf`;
        if (selected !== newName) renameOps.push({ from: selected, to: newName });
        processedFiles.add(selected);
        nextOrder++;
    });

    // Move extras
    specPages.forEach(s => {
        if (!processedFiles.has(s.oldName)) {
            try { fs.renameSync(path.join(DIR, s.oldName), path.join(BACKUP_DIR, s.oldName)); } catch (e) { }
        }
    });

    // 3. Master Pages
    masterPages.forEach(file => {
        const orderStr = nextOrder.toString().padStart(2, '0');
        const newName = `${orderStr}_Specification_Master_TieIn.pdf`;
        if (file !== newName) renameOps.push({ from: file, to: newName });
        processedFiles.add(file);
        nextOrder++;
    });

    // 4. Drawings
    drawings.sort((a, b) => {
        if (a.figNum !== null && b.figNum !== null) return a.figNum - b.figNum;
        if (a.figNum !== null) return -1;
        if (b.figNum !== null) return 1;
        return a.oldName.localeCompare(b.oldName);
    });

    drawings.forEach((dwg, index) => {
        if (processedFiles.has(dwg.oldName)) return;
        const orderStr = nextOrder.toString().padStart(2, '0');
        let figNum = dwg.figNum !== null ? dwg.figNum : index + 1;
        const figLabel = figNum.toString().padStart(2, '0');
        const newName = `${orderStr}_Drawing_Figure_${figLabel}.pdf`;
        if (dwg.oldName !== newName) renameOps.push({ from: dwg.oldName, to: newName });
        processedFiles.add(dwg.oldName);
        nextOrder++;
    });

    console.log('\n--- Final Renaming Operations ---');
    renameOps.forEach(op => {
        try {
            if (fs.existsSync(path.join(DIR, op.from))) {
                fs.renameSync(path.join(DIR, op.from), path.join(DIR, op.to));
                console.log(`OK: ${op.from} -> ${op.to}`);
            }
        } catch (err) { console.error(`ERROR: ${op.from} -> ${err.message}`); }
    });
    console.log('\nDone.');
}
organizeNode2().catch(console.error);
