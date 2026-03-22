const fs = require('fs');
const path = require('path');

const DIR = 'C:\\Users\\zSixt\\Desktop\\patent pdfs\\node 5 provisional pdfs';

async function organizeNode5() {
    console.log(`Organizing folder: ${DIR}`);
    if (!fs.existsSync(DIR)) {
        console.error(`Error: Directory not found: ${DIR}`);
        return;
    }

    const files = fs.readdirSync(DIR).filter(f => f.endsWith('.pdf'));

    const specPages = [];
    const drawings = [];

    files.forEach(file => {
        // Handle both original and already-simplified names
        // Original: Nexalis_Node5_Provisional_Page_01_Title-Field-CrossRef.pdf
        // Simplified: 01_Specification_Page_01.pdf
        const specMatch = file.match(/(?:Nexalis_Node5_Provisional_Page_|^\d+_Specification_Page_)(\d+)/i);
        if (specMatch) {
            specPages.push({
                oldName: file,
                num: parseInt(specMatch[1])
            });
            return;
        }

        // Handle newly converted drawings: USPTO_Node05_Drawing_...
        const dwgMatch = file.match(/USPTO_Node05_Drawing_(.*)\.pdf/i);
        if (dwgMatch) {
            drawings.push({
                oldName: file,
                desc: dwgMatch[1]
            });
            return;
        }

        // Handle already simplified drawings (just in case)
        const simplifiedDwgMatch = file.match(/^\d+_Drawing_Figure_(\d+)/i);
        if (simplifiedDwgMatch) {
            drawings.push({
                oldName: file,
                figNum: parseInt(simplifiedDwgMatch[1])
            });
            return;
        }
    });

    const renameOps = [];
    let nextOrder = 1;

    // 1. Sort and rename Specification Pages
    // Remove duplicates if some are original and some simplified
    const uniqueSpecs = {};
    specPages.forEach(s => {
        if (!uniqueSpecs[s.num] || s.oldName.includes('Nexalis_Node5')) {
            // Keep the most "original" looking one for processing, or just any
            uniqueSpecs[s.num] = s.oldName;
        }
    });

    const sortedSpecNums = Object.keys(uniqueSpecs).map(Number).sort((a, b) => a - b);
    sortedSpecNums.forEach(num => {
        const orderStr = nextOrder.toString().padStart(2, '0');
        const numStr = num.toString().padStart(2, '0');
        const newName = `${orderStr}_Specification_Page_${numStr}.pdf`;
        if (uniqueSpecs[num] !== newName) {
            renameOps.push({ from: uniqueSpecs[num], to: newName });
        }
        nextOrder++;
    });

    // 2. Sort and rename Drawings
    // The "desc" of newly converted images contains the timestamp, which helps preserve order if multiple were added.
    drawings.sort((a, b) => a.oldName.localeCompare(b.oldName)).forEach((dwg, index) => {
        const orderStr = nextOrder.toString().padStart(2, '0');
        // If we don't have a figure number mentioned in original filename, we'll assign one sequentially starting from 01 (for drawings)
        // or just use the index. The user said "properly titled figures".
        // Let's use the sequence of drawings.
        const figNum = (index + 1).toString().padStart(2, '0');
        const newName = `${orderStr}_Drawing_Figure_${figNum}.pdf`;
        if (dwg.oldName !== newName) {
            renameOps.push({ from: dwg.oldName, to: newName });
        }
        nextOrder++;
    });

    console.log('\n--- Renaming Operations ---');
    if (renameOps.length === 0) {
        console.log('No files need renaming.');
    } else {
        renameOps.forEach(op => {
            const fromPath = path.join(DIR, op.from);
            const toPath = path.join(DIR, op.to);
            try {
                if (fs.existsSync(fromPath)) {
                    fs.renameSync(fromPath, toPath);
                    console.log(`OK: ${op.from} -> ${op.to}`);
                }
            } catch (err) {
                console.error(`ERROR: ${op.from} -> ${err.message}`);
            }
        });
    }

    console.log('\nProcess Complete.');
}

organizeNode5().catch(console.error);
