const fs = require('fs');
const path = require('path');

const DIR = 'C:\\Users\\zSixt\\Desktop\\Node 3 penile scanner patent pdf';
const BACKUP_DIR = path.join(DIR, '_backup_drafts');

const filesToMove = [
    'FIG_04_Node3_Scanner.pdf',
    'FIG_16_Node3_Scanner_Detail.pdf'
];

const filesToRename = [
    { from: 'USPTO_Node03_FIG11_Workflow.pdf', to: '41_Drawing_FIG_11_Workflow.pdf' }
];

filesToMove.forEach(f => {
    const fromPath = path.join(DIR, f);
    const toPath = path.join(BACKUP_DIR, f);
    if (fs.existsSync(fromPath)) {
        fs.renameSync(fromPath, toPath);
        console.log(`MOVED: ${f}`);
    }
});

filesToRename.forEach(op => {
    const fromPath = path.join(DIR, op.from);
    const toPath = path.join(DIR, op.to);
    if (fs.existsSync(fromPath)) {
        fs.renameSync(fromPath, toPath);
        console.log(`RENAMED: ${op.from} -> ${op.to}`);
    }
});
