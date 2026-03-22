const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\zSixt\\Desktop\\patent pdfs';
const mapping = [
    { old: 'ChatGPT Image Feb 16, 2026, 12_01_17 PM.png', new: 'fig_node4_detail_v2.png' },
    { old: 'Gemini_Generated_Image_uaujs1uaujs1uauj.png', new: 'fig_node1_detail_v2.png' },
    { old: 'Gemini_Generated_Image_59j1kt59j1kt59j1.png', new: 'fig_node2_detail_v2.png' },
    { old: 'Gemini_Generated_Image_eoe8b1eoe8b1eoe8.png', new: 'fig_node3_detail_v2.png' },
    { old: 'Gemini_Generated_Image_vndpk9vndpk9vndp.png', new: 'fig_node5_detail_v2.png' },
    { old: 'Gemini_Generated_Image_u5zqtnu5zqtnu5zq.png', new: 'fig_node4_detail_alt.png' }
];

mapping.forEach(m => {
    const oldPath = path.join(dir, m.old);
    const newPath = path.join(dir, m.new);
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed: ${m.old} -> ${m.new}`);
    } else {
        console.log(`Not found: ${m.old}`);
    }
});
