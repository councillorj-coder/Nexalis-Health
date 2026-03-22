const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createFig7() {
    const doc = await PDFDocument.create();
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const ital = await doc.embedFont(StandardFonts.HelveticaOblique);
    const W = 612, H = 792;
    const black = rgb(0, 0, 0);
    const gray = rgb(0.55, 0.55, 0.55);
    const ltGray = rgb(0.78, 0.78, 0.78);

    function centerText(pg, text, y, sz, f, color) {
        const tw = f.widthOfTextAtSize(text, sz);
        pg.drawText(text, { x: (W - tw) / 2, y, size: sz, font: f, color: color || black });
    }
    function drawBox(pg, x, y, w, h, opts = {}) {
        pg.drawRectangle({ x, y, width: w, height: h, borderColor: opts.borderColor || black, borderWidth: opts.bw || 1, borderDashArray: opts.dash });
    }
    function drawCenteredLabel(pg, text, x, y, w, sz, f, color) {
        const tw = (f || font).widthOfTextAtSize(text, sz || 8);
        pg.drawText(text, { x: x + (w - tw) / 2, y, size: sz || 8, font: f || font, color: color || black });
    }
    function lbl(pg, text, x, y, sz, f, color) {
        pg.drawText(text, { x, y, size: sz || 8, font: f || font, color: color || black });
    }
    function drawArrow(pg, x1, y1, x2, y2, opts = {}) {
        pg.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: opts.t || 0.75, color: black, dashArray: opts.dash });
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const hl = 5;
        pg.drawLine({ start: { x: x2, y: y2 }, end: { x: x2 - hl * Math.cos(angle - 0.35), y: y2 - hl * Math.sin(angle - 0.35) }, thickness: 0.75, color: black });
        pg.drawLine({ start: { x: x2, y: y2 }, end: { x: x2 - hl * Math.cos(angle + 0.35), y: y2 - hl * Math.sin(angle + 0.35) }, thickness: 0.75, color: black });
    }

    const pg = doc.addPage([W, H]);

    // ===== TITLE =====
    centerText(pg, 'FIG. 7', H - 45, 16, bold, black);
    centerText(pg, 'Data Pipeline Block Diagram (Acquisition to Reporting)', H - 65, 10, font, black);

    // ===== INPUT =====
    const inputY = H - 90;
    centerText(pg, 'Raw Multi-Node Sensor Data (Nodes 200-600)', inputY, 9, bold, gray);
    drawArrow(pg, W / 2, inputY - 10, W / 2, inputY - 30);

    // ===== PIPELINE STAGES (Vertical Stack) =====
    const stages = [
        { ref: '710', name: 'Acquisition & Synchronization', desc: 'Secure Pairing, Time-Alignment, Windowing' },
        { ref: '720', name: 'Signal Conditioning', desc: 'Filtering, Normalization, Drift Compensation' },
        { ref: '730', name: 'Artifact Rejection & Validity', desc: 'Coupling Quality, Motion Gating, Plausibility' },
        { ref: '740', name: 'Feature Extraction', desc: 'Signal Power, Frequencies, Temporal Gradients' },
        { ref: '750', name: 'Metric Generation', desc: 'Longitudinal Patterns, Vitality Indices' },
        { ref: '760', name: 'Correlation Computation', desc: 'Cross-Device & Consent-Gated Cross-User Analysis' },
        { ref: '770', name: 'Confidence & Labelling', desc: 'Probabilistic Reliability, State Classification' }
    ];

    const stageW = 320, stageH = 55;
    const stageGap = 20;
    const startY = inputY - 30;

    stages.forEach((s, i) => {
        const y = startY - i * (stageH + stageGap) - stageH;
        const x = (W - stageW) / 2;
        drawBox(pg, x, y, stageW, stageH, { bw: 1.2 });
        drawCenteredLabel(pg, s.ref, x, y + stageH - 14, stageW, 8.5, bold);
        drawCenteredLabel(pg, s.name, x, y + stageH - 28, stageW, 10, bold);
        drawCenteredLabel(pg, s.desc, x, y + stageH - 42, stageW, 7.5, ital, gray);

        if (i < stages.length - 1) {
            drawArrow(pg, W / 2, y, W / 2, y - stageGap);
        }
    });

    // ===== QUALITY INDEX SIDE MODULE =====
    const qiX = (W + stageW) / 2 + 30;
    const qiY = startY - 2.5 * (stageH + stageGap) - stageH / 2;
    const qiW = 100, qiH = 80;
    drawBox(pg, qiX, qiY, qiW, qiH, { bw: 0.8, dash: [4, 2], borderColor: gray });
    drawCenteredLabel(pg, '410', qiX, qiY + qiH - 15, qiW, 8, bold);
    drawCenteredLabel(pg, 'Quality', qiX, qiY + qiH - 30, qiW, 8.5, bold);
    drawCenteredLabel(pg, 'Indices', qiX, qiY + qiH - 42, qiW, 8.5, bold);
    drawCenteredLabel(pg, '(QI Subsystems)', qiX, qiY + qiH - 58, qiW, 7, ital, gray);

    // Connection from Artifact Rejection stage to Quality Indices
    pg.drawLine({ start: { x: (W + stageW) / 2, y: startY - 2 * (stageH + stageGap) - stageH / 2 }, end: { x: qiX, y: qiY + qiH / 2 }, thickness: 0.6, color: gray, dashArray: [2, 1] });

    // ===== FINAL OUTPUT =====
    const finalY = startY - stages.length * (stageH + stageGap) - 10;
    drawArrow(pg, W / 2, startY - (stages.length - 1) * (stageH + stageGap) - stageH, W / 2, finalY + 45);

    const outW = 340, outH = 45;
    const outX = (W - outW) / 2;
    drawBox(pg, outX, finalY, outW, outH, { bw: 2 });
    drawCenteredLabel(pg, '800', outX, finalY + outH - 12, outW, 8.5, bold);
    drawCenteredLabel(pg, 'Privacy-Preserving Output Interface', outX, finalY + outH - 25, outW, 11, bold);
    drawCenteredLabel(pg, '(Indices, Zones, Trends, Confidence Tags)', outX, finalY + outH - 38, outW, 8, ital, gray);

    // Security Label
    centerText(pg, 'All raw data is discarded post-processing or held in enclave memory.', finalY - 20, 7.5, ital, gray);

    // Footer
    centerText(pg, 'Document 84 -- FIG. 7', 35, 8, ital, gray);

    const pdfBytes = await doc.save();
    const outPath = path.join('C:\\Users\\zSixt\\Desktop\\patent pdfs', 'FIG_07_Data_Pipeline.pdf');
    fs.writeFileSync(outPath, pdfBytes);
    console.log(`Created: ${outPath}`);
}

createFig7().catch(console.error);
