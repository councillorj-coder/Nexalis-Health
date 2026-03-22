const fs = require('fs');
const path = require('path');

const DIR = 'C:\\Users\\zSixt\\Desktop\\patent pdfs\\node 1 logitudinal penile physiology';

async function simplifyNames() {
    console.log(`Simplifying names in: ${DIR}`);
    if (!fs.existsSync(DIR)) {
        console.error(`Error: Directory not found: ${DIR}`);
        return;
    }

    const files = fs.readdirSync(DIR).filter(f => f.endsWith('.pdf'));

    const specs = [];
    const drawings = [];

    files.forEach(file => {
        // Match specification pages: XX_Specification_Page_XX...
        const specMatch = file.match(/^(\d+)_Specification_Page_(\d+)/i);
        if (specMatch) {
            specs.push({
                oldName: file,
                order: specMatch[1],
                num: specMatch[2]
            });
            return;
        }

        // Match drawings: XX_Drawing_Figure_XX... or XX_Drawing_Figure_Misc...
        const dwgMatch = file.match(/^(\d+)_Drawing_Figure_(\d+|Misc)/i);
        if (dwgMatch) {
            drawings.push({
                oldName: file,
                order: dwgMatch[1],
                label: dwgMatch[2]
            });
            return;
        }

        // Match additional drawings: XX_Drawing_Additional_...
        const addMatch = file.match(/^(\d+)_Drawing_Additional_(.*)/i);
        if (addMatch) {
            drawings.push({
                oldName: file,
                order: addMatch[1],
                label: 'Misc', // Will simplify to Figure_[order]
                desc: addMatch[2]
            });
            return;
        }
    });

    const renameOps = [];

    // 1. Simplify Specification Pages
    specs.forEach(spec => {
        const newName = `${spec.order}_Specification_Page_${spec.num}.pdf`;
        if (spec.oldName !== newName) {
            renameOps.push({ from: spec.oldName, to: newName });
        }
    });

    // 2. Simplify Drawings
    // We'll keep the order, but simplify the naming
    drawings.sort((a, b) => parseInt(a.order) - parseInt(b.order)).forEach((dwg, index) => {
        let figNum;
        if (dwg.label === 'Misc') {
            // Assign a sequential "Figure" number based on its position if no specific FIG was found
            // In the previous step, drawings started after spec pages.
            // Let's just use the current order suffix or extract FIG if possible.
            figNum = dwg.order; // Using the order number as the figure label if it was "Misc"
        } else {
            figNum = dwg.label;
        }

        const newName = `${dwg.order}_Drawing_Figure_${figNum}.pdf`;
        if (dwg.oldName !== newName) {
            renameOps.push({ from: dwg.oldName, to: newName });
        }
    });

    console.log('\n--- Simplification Operations ---');
    if (renameOps.length === 0) {
        console.log('No files need simplification.');
    } else {
        renameOps.forEach(op => {
            const fromPath = path.join(DIR, op.from);
            const toPath = path.join(DIR, op.to);
            try {
                fs.renameSync(fromPath, toPath);
                console.log(`OK: ${op.from} -> ${op.to}`);
            } catch (err) {
                console.error(`ERROR: ${op.from} -> ${err.message}`);
            }
        });
    }

    console.log('\nSimplification Complete.');
}

simplifyNames().catch(console.error);
