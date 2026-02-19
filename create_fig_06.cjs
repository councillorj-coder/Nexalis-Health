const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createFig6() {
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
    centerText(pg, 'FIG. 6', H - 45, 16, bold, black);
    centerText(pg, 'Node 5 -- Upper-Body Physiologic Context Device', H - 65, 10, font, black);

    // ===== FORM FACTORS (Top Section) =====
    const ffY = H - 160;
    const ffW = 140, ffH = 80;
    const ffGap = 40;
    const ffStartX = (W - (3 * ffW + 2 * ffGap)) / 2;

    const formFactors = [
        { ref: '600A', name: 'Chest-Mounted', desc: 'Elastic Strap / Adhesive' },
        { ref: '600B', name: 'Wrist-Worn', desc: 'Standard Watch Band' },
        { ref: '600C', name: 'Ring-Form', desc: 'Finger Wearable' },
    ];

    formFactors.forEach((ff, i) => {
        const x = ffStartX + i * (ffW + ffGap);
        drawBox(pg, x, ffY, ffW, ffH, { bw: 1.5 });
        drawCenteredLabel(pg, ff.ref, x, ffY + ffH - 14, ffW, 8.5, bold);
        drawCenteredLabel(pg, ff.name, x, ffY + ffH - 30, ffW, 10, bold);
        drawCenteredLabel(pg, ff.desc, x, ffY + ffH - 45, ffW, 7, ital, gray);

        // Abstract representation of form factor
        if (i === 0) { // Chest
            pg.drawLine({ start: { x: x + 20, y: ffY + 15 }, end: { x: x + ffW - 20, y: ffY + 15 }, thickness: 3, color: ltGray });
        } else if (i === 1) { // Wrist
            pg.drawCircle({ x: x + ffW / 2, y: ffY + 15, radius: 10, borderColor: ltGray, borderWidth: 2 });
        } else if (i === 2) { // Ring
            pg.drawCircle({ x: x + ffW / 2, y: ffY + 15, radius: 7, borderColor: ltGray, borderWidth: 1.5 });
        }
    });

    // ===== COMMON SENSOR SUITE (Middle Section) =====
    const suiteTopY = ffY - 40;
    const suiteW = W - 140, suiteH = 200;
    const suiteX = (W - suiteW) / 2;
    drawBox(pg, suiteX, suiteTopY - suiteH, suiteW, suiteH, { bw: 1.2, dash: [5, 3], borderColor: gray });
    drawCenteredLabel(pg, 'Common Sensor Suite (Interchangeable Modules)', suiteX, suiteTopY - 18, suiteW, 9, bold);

    const sensors = [
        { ref: '601', name: 'ECG Electrodes', sub: 'Heart Rate, HRV, Rhythm' },
        { ref: '602', name: 'PPG Optical Sensor', sub: 'Pulse Ox, Perfusion Trend' },
        { ref: '603', name: '6-Axis IMU', sub: 'Activity, Posture, Respiration' },
        { ref: '604', name: 'EDA / GSR Sensor', sub: 'Autonomic Arousal, Stress' },
        { ref: '605', name: 'Temperature Sensor', sub: 'Skin Temp, Cycle Tracking' },
        { ref: '606', name: 'Respiratory Sensor', sub: 'Chest Expansion / Acoustic' },
    ];

    const sW = 135, sH = 45, sGapX = 30, sGapY = 20;
    const sStartX = suiteX + (suiteW - (2 * sW + sGapX)) / 2;
    const sStartY = suiteTopY - 50;

    sensors.forEach((s, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const sx = sStartX + col * (sW + sGapX);
        const sy = sStartY - row * (sH + sGapY);
        drawBox(pg, sx, sy, sW, sH, { bw: 1 });
        drawCenteredLabel(pg, s.ref, sx, sy + sH - 12, sW, 7, bold);
        drawCenteredLabel(pg, s.name, sx, sy + sH - 24, sW, 8.5, bold);
        drawCenteredLabel(pg, s.sub, sx, sy + sH - 35, sW, 6.5, font, gray);
    });

    // Connection arrows from form factors to common suite
    const suiteCx = suiteX + suiteW / 2;
    formFactors.forEach((ff, i) => {
        const x = ffStartX + i * (ffW + ffGap) + ffW / 2;
        drawArrow(pg, x, ffY, x, suiteTopY, { t: 0.5, dash: [2, 2], color: gray });
    });

    // ===== DATA ABSTRACTION & CONTEXT (Bottom Section) =====
    const logicTopY = suiteTopY - suiteH - 40;
    const logicW = W - 140, logicH = 70;
    const logicX = (W - logicW) / 2;
    drawBox(pg, logicX, logicTopY - logicH, logicW, logicH, { bw: 1.2 });
    drawCenteredLabel(pg, 'Systemic Context Abstraction Layer', logicX, logicTopY - 14, logicW, 9, bold);

    const modules = [
        { name: 'Baseline\nNormalization', ref: '250' },
        { name: 'Contextual\nTagging', ref: '251' },
        { name: 'Validity\nGating', ref: '252' },
        { name: 'Multi-Node\nSync', ref: '253' }
    ];
    const mW = 90, mGap = 15;
    const mStartX = logicX + (logicW - (4 * mW + 3 * mGap)) / 2;
    modules.forEach((m, i) => {
        const mx = mStartX + i * (mW + mGap);
        const my = logicTopY - logicH + 10;
        drawBox(pg, mx, my, mW, 35, { bw: 0.6 });
        drawCenteredLabel(pg, m.ref, mx, my + 25, mW, 6.5, bold, gray);
        const lines = m.name.split('\n');
        lines.forEach((ln, li) => {
            drawCenteredLabel(pg, ln, mx, my + 13 - li * 8, mW, 7.5, font);
        });
        if (i < modules.length - 1) {
            drawArrow(pg, mx + mW + 2, my + 17, mx + mW + mGap - 2, my + 17, { t: 0.4 });
        }
    });

    // Arrow from suite to logic
    drawArrow(pg, suiteCx, suiteTopY - suiteH, suiteCx, logicTopY);

    // ===== OUTPUT =====
    const outY = logicTopY - logicH - 60;
    const outW = 320, outH = 38;
    const outX = (W - outW) / 2;
    drawBox(pg, outX, outY, outW, outH, { bw: 1.8 });
    drawCenteredLabel(pg, 'Output: Systemic Context Metrics (110)', outX, outY + outH - 12, outW, 9, bold);
    drawCenteredLabel(pg, '(Heart Rate Trend, HRV, Activity, Stress, Posture)', outX, outY + outH - 26, outW, 7, ital, gray);
    drawArrow(pg, W / 2, logicTopY - logicH, W / 2, outY + outH);

    // Footer label
    centerText(pg, 'Provides whole-body context to anchor intimate-region measurements.', outY - 18, 7, ital, gray);

    // Footer coordinate
    centerText(pg, 'Document 84 -- FIG. 6', 35, 8, ital, gray);

    const pdfBytes = await doc.save();
    const outPath = path.join('C:\\Users\\zSixt\\Desktop\\patent pdfs', 'FIG_06_Node5_Context.pdf');
    fs.writeFileSync(outPath, pdfBytes);
    console.log(`Created: ${outPath}`);
}

createFig6().catch(console.error);
