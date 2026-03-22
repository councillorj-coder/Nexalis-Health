const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createFig12() {
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
    function drawArrow(pg, x1, y1, x2, y2, opts = {}) {
        pg.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: opts.t || 0.75, color: black, dashArray: opts.dash });
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const hl = 5;
        pg.drawLine({ start: { x: x2, y: y2 }, end: { x: x2 - hl * Math.cos(angle - 0.35), y: y2 - hl * Math.sin(angle - 0.35) }, thickness: 0.75, color: black });
        pg.drawLine({ start: { x: x2, y: y2 }, end: { x: x2 - hl * Math.cos(angle + 0.35), y: y2 - hl * Math.sin(angle + 0.35) }, thickness: 0.75, color: black });
    }

    const pg = doc.addPage([W, H]);

    // ===== TITLE =====
    centerText(pg, 'FIG. 12', H - 45, 16, bold, black);
    centerText(pg, 'End-to-End System Workflow (Lifecycle of a Session)', H - 65, 10, font, black);

    // ===== LIFECYCLE STEPS (Vertical Flowchart) =====
    const steps = [
        { ref: '1201', name: 'System Initialization', desc: 'Secure Boot, Sensor Self-Test, BLE Activation' },
        { ref: '1202', name: 'Pairing & Consent Gating', desc: 'Node Correlation Handshake, Governance Auth (500)' },
        { ref: '1203', name: 'Wear Detect & Coupling Check', desc: 'Verification of Anatomical Placement (410)' },
        { ref: '1204', name: 'Baseline Profile Generation', desc: 'Idle State Normalization, Signal Calibration' },
        { ref: '1205', name: 'Longitudinal Collection', desc: 'Streaming Data Pipeline Execution (710-740)' },
        { ref: '1206', name: 'Derived Metric Extraction', desc: 'Vitality Index & Alignment Zone Computation (750)' },
        { ref: '1207', name: 'Correlation & Pattern Analysis', desc: 'Cross-Device & Cross-User Context Sync (760)' },
        { ref: '1208', name: 'Privacy-Preserving Reporting', desc: 'Zero-Explicit Output to Interface (800)' }
    ];

    const stepW = 340, stepH = 50;
    const stepGap = 20;
    const startY = H - 100;

    steps.forEach((s, i) => {
        const x = (W - stepW) / 2;
        const y = startY - i * (stepH + stepGap) - stepH;

        drawBox(pg, x, y, stepW, stepH, { bw: 1.2 });
        drawCenteredLabel(pg, s.ref, x, y + stepH - 12, stepW, 8.5, bold);
        drawCenteredLabel(pg, s.name, x, y + stepH - 26, stepW, 10, bold);
        drawCenteredLabel(pg, s.desc, x, y + stepH - 38, stepW, 7.5, ital, gray);

        if (i < steps.length - 1) {
            drawArrow(pg, W / 2, y, W / 2, y - stepGap);
        }
    });

    // ===== LOOP-BACK (Optional for continuous tracking) =====
    const loopX = (W + stepW) / 2 + 20;
    const startLoopY = startY - 4 * (stepH + stepGap) - stepH / 2;
    const endLoopY = startY - 7 * (stepH + stepGap) - stepH / 2;

    // Right side loop line
    pg.drawLine({ start: { x: (W + stepW) / 2, y: endLoopY }, end: { x: loopX, y: endLoopY }, thickness: 0.8, color: gray, dashArray: [4, 2] });
    pg.drawLine({ start: { x: loopX, y: endLoopY }, end: { x: loopX, y: startLoopY }, thickness: 0.8, color: gray, dashArray: [4, 2] });
    pg.drawLine({ start: { x: loopX, y: startLoopY }, end: { x: (W + stepW) / 2, y: startLoopY }, thickness: 0.8, color: gray, dashArray: [4, 2] });

    pg.drawText('Continuous\nCycle', { x: loopX + 5, y: (startLoopY + endLoopY) / 2, size: 7, font: ital, color: gray });

    // ===== EXTERNAL STORAGE REF =====
    const dbX = 60, dbY = startY - 7 * (stepH + stepGap) - stepH;
    const dbW = 100, dbH = 40;
    drawBox(pg, dbX, dbY, dbW, dbH, { bw: 0.8, dash: [2, 2], borderColor: gray });
    drawCenteredLabel(pg, '120', dbX, dbY + dbH - 12, dbW, 7, bold, gray);
    drawCenteredLabel(pg, 'Encrypted', dbX, dbY + 18, dbW, 8, font, gray);
    drawCenteredLabel(pg, 'Archive', dbX, dbY + 8, dbW, 8, font, gray);

    // Connection from Correlation to Archive
    pg.drawLine({ start: { x: (W - stepW) / 2, y: startY - 6 * (stepH + stepGap) - stepH / 2 }, end: { x: dbX + dbW, y: dbY + dbH / 2 }, thickness: 0.5, color: ltGray, dashArray: [2, 1] });

    // Footer Annotation
    centerText(pg, 'Chronological sequence of operations for an active Nexalis Health session.', startY - 8 * (stepH + stepGap) - 10, 8, ital, gray);

    // Footer
    centerText(pg, 'Document 84 -- FIG. 12', 35, 8, ital, gray);

    const pdfBytes = await doc.save();
    const outPath = path.join('C:\\Users\\zSixt\\Desktop\\patent pdfs', 'FIG_12_End_to_End_Workflow.pdf');
    fs.writeFileSync(outPath, pdfBytes);
    console.log(`Created: ${outPath}`);
}

createFig12().catch(console.error);
