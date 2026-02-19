const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function mergePdfs() {
    const parentDir = 'C:\\Users\\zSixt\\Desktop\\patent pdfs';
    const outputFileName = '84_Patent_Figures.pdf';

    const files = [
        'FIG_01_System_Overview.pdf',
        'FIG_02_Node1_External_Ring.pdf',
        'FIG_03_Node2_Intravaginal.pdf',
        'FIG_04_Node3_Scanner.pdf',
        'FIG_05_Node4_Intraluminal.pdf',
        'FIG_06_Node5_Context.pdf',
        'FIG_07_Data_Pipeline.pdf',
        'FIG_08_Cross_Device_Correlation.pdf',
        'FIG_09_Cross_User_Consent.pdf',
        'FIG_10_Privacy_UI.pdf',
        'FIG_11_Multi_Pairing.pdf',
        'FIG_12_End_to_End_Workflow.pdf',
        'FIG_13_System_Overview_Detail.pdf',
        'FIG_14_Node1_Wearable_Detail.pdf',
        'FIG_15_Node2_Intravaginal_Detail.pdf',
        'FIG_16_Node3_Scanner_Detail.pdf',
        'FIG_17_Node4_Intraluminal_Detail.pdf',
        'FIG_18_Node5_Context_Detail.pdf'
    ];

    const mergedPdf = await PDFDocument.create();

    for (const f of files) {
        const filePath = path.join(parentDir, f);
        if (!fs.existsSync(filePath)) {
            console.warn(`File not found: ${filePath}`);
            continue;
        }
        const pdfBytes = fs.readFileSync(filePath);
        try {
            const pdf = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
            console.log(`Added: ${f}`);
        } catch (err) {
            console.error(`Error adding ${f}:`, err);
        }
    }

    const mergedPdfBytes = await mergedPdf.save();
    fs.writeFileSync(path.join(parentDir, outputFileName), mergedPdfBytes);
    console.log(`Merged PDF created: ${path.join(parentDir, outputFileName)}`);
}

mergePdfs().catch(console.error);
