const fs = require('fs');
const path = require('path');

const DIR = 'C:\\Users\\zSixt\\Desktop\\patent pdfs\\node 1 logitudinal penile physiology';

async function renameForUSPTO() {
    console.log(`Working in: ${DIR}`);
    const files = fs.readdirSync(DIR).filter(f => f.endsWith('.pdf'));

    const specPages = [];
    const drawings = [];
    const others = [];

    files.forEach(file => {
        // Spec pages: node1_page1_true_single_page.pdf
        const specMatch = file.match(/node1_page(\d+)(.*)\.pdf/i);
        if (specMatch) {
            specPages.push({
                oldName: file,
                num: parseInt(specMatch[1]),
                desc: specMatch[2].replace(/^_+/, '').replace(/_true_single_page/i, '').replace(/[\s_]+/g, '_')
            });
            return;
        }

        // Drawings I just created: USPTO_Node01_Drawing_FIG_02__node1_wearable_1771206927160.pdf
        // Drawings from ChatGPT: USPTO_Node01_Drawing_C_GPT_Feb_23_2026_03_31_55_PM.pdf
        const dwgMatch = file.match(/USPTO_Node01_Drawing_(.*)\.pdf/i);
        if (dwgMatch) {
            let desc = dwgMatch[1];
            let figNum = null;

            // Try to extract FIG number if present
            const figMatch = desc.match(/FIG_(\d+)/i);
            if (figMatch) {
                figNum = parseInt(figMatch[1]);
                desc = desc.replace(/FIG_(\d+)_*/i, '');
            } else if (desc.startsWith('C_GPT_')) {
                desc = desc.replace('C_GPT_', 'ChatGPT_');
            }

            drawings.push({
                oldName: file,
                figNum: figNum,
                desc: desc.replace(/[\s_]+/g, '_')
            });
            return;
        }

        // Other FIG files: FIG_01-06_System_and_Node_Overviews.pdf
        if (file.match(/^FIG_|^fig_/i)) {
            others.push(file);
            return;
        }
    });

    // Sort Spec Pages by number
    specPages.sort((a, b) => a.num - b.num);

    const renameOps = [];

    // 1. Rename Spec Pages (01-31)
    specPages.forEach(spec => {
        const order = spec.num.toString().padStart(2, '0');
        const newName = `${order}_Specification_Page_${order}${spec.desc ? '_' + spec.desc : ''}.pdf`;
        renameOps.push({ from: spec.oldName, to: newName });
    });

    // 2. Rename Drawings (starting after spec pages)
    // Let's assume spec goes up to 31. If not, we'll find the max.
    const maxSpec = specPages.length > 0 ? Math.max(...specPages.map(s => s.num)) : 0;
    let nextOrder = maxSpec + 1;

    // Sort drawings: specific FIG numbers first, then others
    drawings.sort((a, b) => {
        if (a.figNum !== null && b.figNum !== null) return a.figNum - b.figNum;
        if (a.figNum !== null) return -1;
        if (b.figNum !== null) return 1;
        return a.desc.localeCompare(b.desc);
    });

    drawings.forEach(dwg => {
        const order = nextOrder.toString().padStart(2, '0');
        const figLabel = dwg.figNum !== null ? `Figure_${dwg.figNum.toString().padStart(2, '0')}` : `Figure_Misc`;
        const newName = `${order}_Drawing_${figLabel}${dwg.desc ? '_' + dwg.desc : ''}.pdf`;
        renameOps.push({ from: dwg.oldName, to: newName });
        nextOrder++;
    });

    // 3. Rename "Others" (if any FIG files left)
    others.forEach(file => {
        const order = nextOrder.toString().padStart(2, '0');
        const newName = `${order}_Drawing_Additional_${file.replace(/^FIG_|^fig_/i, '').replace(/\.pdf$/i, '').replace(/[\s_]+/g, '_')}.pdf`;
        renameOps.push({ from: file, to: newName });
        nextOrder++;
    });

    console.log('\n--- Renaming Operations ---');
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

    console.log('\nDone.');
}

renameForUSPTO().catch(console.error);
