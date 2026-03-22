const fs = require('fs');
const path = require('path');

const DIR = 'C:\\Users\\zSixt\\Desktop\\node 4 intraluminal scanner';

async function renumberDrawings() {
    console.log(`Working in: ${DIR}`);

    const files = fs.readdirSync(DIR);

    // Identify drawing files: XX_Drawing_FIG_YY.pdf
    const drawingFiles = files.filter(file =>
        /^\d+_Drawing_FIG_\d+.*\.pdf$/i.test(file) && fs.statSync(path.join(DIR, file)).isFile()
    );

    // Sort by original name to maintain sequence
    drawingFiles.sort((a, b) => a.localeCompare(b));

    console.log(`Found ${drawingFiles.length} drawings to re-sequence.`);

    // Map current filenames to new sequential filenames
    // Specification ends at Page 48. Drawings start at 49.
    const startOrder = 49;

    // First, rename to temporary names to avoid collisions if we were shifting upwards
    // (though here we are mostly filling gaps/shifting down)
    const tempRenames = drawingFiles.map((file, index) => {
        const tempName = `TEMP_${index}_${file}`;
        return { from: file, temp: tempName };
    });

    console.log('\n--- Creating Temporary Renames ---');
    tempRenames.forEach(op => {
        fs.renameSync(path.join(DIR, op.from), path.join(DIR, op.temp));
    });

    console.log('\n--- Final Renaming ---');
    tempRenames.forEach((op, index) => {
        const orderNum = (startOrder + index).toString().padStart(2, '0');
        const figNum = (index + 1).toString().padStart(2, '0');

        // Preserve extra info (like _Workflow or _Part_2) if it exists
        // Original format: XX_Drawing_FIG_YY[_Extra_Info].pdf
        const match = op.from.match(/^\d+_Drawing_FIG_\d+(.*)\.pdf$/i);
        const extra = match[1] || '';

        const newName = `${orderNum}_Drawing_FIG_${figNum}${extra}.pdf`;

        fs.renameSync(path.join(DIR, op.temp), path.join(DIR, newName));
        console.log(`SEQUENCED: ${op.from} -> ${newName}`);
    });

    console.log('\nRenumbering Complete.');
}

renumberDrawings().catch(console.error);
