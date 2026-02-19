const { PDFDocument, StandardFonts, rgb, LineCapStyle } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createFigures() {
    const doc = await PDFDocument.create();
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const W = 612, H = 792;
    const black = rgb(0, 0, 0);
    const gray = rgb(0.5, 0.5, 0.5);

    // Helper: draw a box with label
    function box(pg, x, y, w, h, label, opts = {}) {
        const dash = opts.dash;
        pg.drawRectangle({ x, y: y - h, width: w, height: h, borderColor: black, borderWidth: opts.bw || 1, color: opts.fill || undefined, borderDashArray: dash });
        if (label) {
            const lines = label.split('\n');
            const sz = opts.sz || 8;
            const f = opts.bold ? bold : font;
            lines.forEach((ln, i) => {
                const tw = f.widthOfTextAtSize(ln, sz);
                pg.drawText(ln, { x: x + (w - tw) / 2, y: y - h / 2 - (sz * 0.35) + ((lines.length - 1) * sz / 2) - i * sz * 1.2, size: sz, font: f, color: black });
            });
        }
        return { cx: x + w / 2, cy: y - h / 2, x, y, w, h, bottom: y - h, top: y, left: x, right: x + w };
    }

    // Helper: arrow line
    function arrow(pg, x1, y1, x2, y2, opts = {}) {
        pg.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: opts.t || 0.8, color: black, dashArray: opts.dash });
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const hl = 6;
        pg.drawLine({ start: { x: x2, y: y2 }, end: { x: x2 - hl * Math.cos(angle - 0.4), y: y2 - hl * Math.sin(angle - 0.4) }, thickness: 0.8, color: black });
        pg.drawLine({ start: { x: x2, y: y2 }, end: { x: x2 - hl * Math.cos(angle + 0.4), y: y2 - hl * Math.sin(angle + 0.4) }, thickness: 0.8, color: black });
    }

    // Helper: centered title
    function title(pg, text, y) {
        const tw = bold.widthOfTextAtSize(text, 12);
        pg.drawText(text, { x: (W - tw) / 2, y, size: 12, font: bold, color: black });
    }

    // Helper: small label
    function lbl(pg, text, x, y, sz = 7) {
        pg.drawText(text, { x, y, size: sz, font, color: black });
    }

    // =================== FIG. 1 — System Overview ===================
    let pg = doc.addPage([W, H]);
    title(pg, 'FIG. 1', H - 40);
    lbl(pg, 'High-Level Block Diagram of Multi-Node Monitoring System', 170, H - 55, 9);
    const cs = box(pg, 220, H - 90, 170, 45, '110 Computing System\n(Mobile / Server)', { sz: 8, bold: true });
    const nLabels = ['200 Node 1 (External)', '300 Node 2 (Intravaginal)', '400 Node 3 (Scanner)', '500 Node 4 (Intraluminal)', '600 Node 5 (Context)'];
    const nX = [56, 156, 256, 356, 456];
    const nY = H - 200;
    const nodes = nLabels.map((l, i) => box(pg, nX[i], nY, 90, 45, l, { sz: 7 }));
    nodes.forEach(n => arrow(pg, n.cx, n.top, cs.cx < n.cx ? cs.right - 10 : cs.cx > n.cx + 10 ? cs.left + 10 : cs.cx, cs.bottom));
    lbl(pg, '120 Communications Link (BLE)', 215, nY + 18, 7);
    const po = box(pg, 200, nY - 80, 210, 35, '800 Privacy-Preserving\nOutput Interface', { sz: 7 });
    arrow(pg, cs.cx, cs.bottom - cs.h, po.cx, po.top);
    pg.drawRectangle({ x: 40, y: nY - 100, width: 530, height: 135, borderColor: gray, borderWidth: 0.5, borderDashArray: [4, 4] });
    lbl(pg, '100 System', 45, H - 85, 8);

    // =================== FIG. 2 — Example Data-Flow Diagram ===================
    pg = doc.addPage([W, H]);
    title(pg, 'FIG. 2', H - 40);
    lbl(pg, 'Example Data-Flow Diagram (Privacy-Preserved)', 190, H - 55, 9);
    const stages = [
        ['710 Acquisition &\nSynchronization'],
        ['720 Signal\nConditioning'],
        ['730 Artifact Rejection\n& Wear Validation'],
        ['740 Feature\nExtraction'],
        ['750 Metric\nGeneration (Abstracted)'],
        ['800 Privacy-Preserving\nOutput Presentation'],
    ];
    const pipeY = H - 90;
    stages.forEach((s, i) => {
        const by = pipeY - i * 95;
        box(pg, 180, by, 250, 55, s[0], { sz: 8 });
        if (i > 0) arrow(pg, 305, by + 55 + 40, 305, by);
    });
    lbl(pg, 'Raw Signal Input (200-600)', 230, pipeY + 15, 8);
    arrow(pg, 305, pipeY + 10, 305, pipeY);

    // =================== FIG. 3 — Cross-Device Correlation ===================
    pg = doc.addPage([W, H]);
    title(pg, 'FIG. 3', H - 40);
    lbl(pg, 'Cross-Device Correlation between Intimate and Context Nodes', 145, H - 55, 9);
    const cdNodes = ['Node 1 (200)', 'Node 2 (300)', 'Node 3 (400)', 'Node 4 (500)', 'Node 5 (600)'];
    cdNodes.forEach((n, i) => box(pg, 55 + i * 108, H - 85, 95, 40, n, { sz: 7 }));
    const ts = box(pg, 160, H - 155, 280, 35, 'Time Synchronization Module', { sz: 8 });
    cdNodes.forEach((_, i) => arrow(pg, 102 + i * 108, H - 125, ts.cx, ts.top));
    const ct = box(pg, 160, H - 220, 280, 35, '760 Correlation Engine\n(Context-Tagged Segmentation)', { sz: 8 });
    arrow(pg, ts.cx, ts.bottom, ct.cx, ct.top);
    const co = box(pg, 160, H - 285, 280, 35, 'Multi-Node Correlated Report', { sz: 8 });
    arrow(pg, ct.cx, ct.bottom, co.cx, co.top);

    // =================== FIG. 4 — Baseline and Longitudinal Tracking ===================
    pg = doc.addPage([W, H]);
    title(pg, 'FIG. 4', H - 40);
    lbl(pg, 'Baseline Establishment and Longitudinal Tracking', 180, H - 55, 9);
    box(pg, 80, H - 100, 450, 200, '', { dash: [2, 2] });
    lbl(pg, 'Time-Series (Longitudinal)', 100, H - 115, 8);
    pg.drawLine({ start: { x: 120, y: H - 250 }, end: { x: 500, y: H - 250 }, thickness: 1, color: black });
    pg.drawLine({ start: { x: 120, y: H - 250 }, end: { x: 120, y: H - 150 }, thickness: 1, color: black });
    lbl(pg, 'Metric Value', 85, H - 150, 7);
    lbl(pg, 'Time (Days/Weeks)', 420, H - 265, 7);
    // Sigmoid/Baseline curve
    pg.drawLine({ start: { x: 130, y: H - 240 }, end: { x: 200, y: H - 235 }, thickness: 1.5, color: black });
    pg.drawLine({ start: { x: 200, y: H - 235 }, end: { x: 300, y: H - 180 }, thickness: 1.5, color: black });
    pg.drawLine({ start: { x: 300, y: H - 180 }, end: { x: 480, y: H - 190 }, thickness: 1.5, color: black });
    lbl(pg, 'Established Baseline (Personal Norm)', 310, H - 175, 7);
    box(pg, 80, H - 330, 210, 60, 'Baseline Establishment\n(Initial Calibration Window)', { sz: 8 });
    box(pg, 320, H - 330, 210, 60, 'Window Comparison\n(Trend Analysis vs Baseline)', { sz: 8 });
    box(pg, 200, H - 420, 210, 40, 'Confidence Indicator\n(Data Quality Gate)', { sz: 8 });

    // =================== FIG. 5 — Node 1 (External) ===================
    pg = doc.addPage([W, H]);
    title(pg, 'FIG. 5', H - 40);
    lbl(pg, 'Node 1 — All-Day/Night External Tumescence and Rigidity Monitor', 130, H - 55, 9);
    box(pg, 150, H - 100, 300, 200, '200 Node 1 Body\n(C-Shape or Enclosed Ring)', { bw: 2 });
    const s5 = [['201 Pressure', 160, H - 150], ['202 Strain', 160, H - 180], ['203 Hall/Mag', 160, H - 210], ['204 Optical', 160, H - 240]];
    s5.forEach(([t, x, y]) => box(pg, x, y, 100, 25, t, { sz: 7 }));
    lbl(pg, 'Configured for External Wear', 230, H - 310, 8);

    // =================== FIG. 6 — Node 2 (Intravaginal) ===================
    pg = doc.addPage([W, H]);
    title(pg, 'FIG. 6', H - 40);
    lbl(pg, 'Node 2 — Intravaginal Longitudinal Physiology Monitor', 160, H - 55, 9);
    box(pg, 200, H - 100, 180, 280, '300 Node 2\nSealed Housing', { bw: 2 });
    const s6 = ['301 Impedance', '302 Dielectric', '303 pH (ISFET)', '304 Pressure Array'];
    s6.forEach((t, i) => box(pg, 220, H - 140 - i * 45, 140, 35, t, { sz: 7, dash: [2, 2] }));

    // =================== FIG. 7 — Node 3 (Scanner) ===================
    pg = doc.addPage([W, H]);
    title(pg, 'FIG. 7', H - 40);
    lbl(pg, 'Node 3 — Self-Scan External Geometry Measurement Device', 150, H - 55, 9);
    box(pg, 200, H - 100, 180, 220, '400 Node 3', { bw: 2 });
    box(pg, 220, H - 130, 140, 40, '401 Optical Flow', { sz: 8 });
    box(pg, 220, H - 180, 140, 40, '402 ToF / Lidar', { sz: 8 });
    box(pg, 220, H - 230, 140, 40, '403 IMU', { sz: 8 });
    lbl(pg, 'Measurement Path Validation', 220, H - 340, 8);

    // =================== FIG. 8 — Node 4 (Intraluminal) ===================
    pg = doc.addPage([W, H]);
    title(pg, 'FIG. 8', H - 40);
    lbl(pg, 'Node 4 — Intraluminal Geometry, Compliance, and Contact Device', 135, H - 55, 9);
    box(pg, 180, H - 100, 220, 300, '500 Node 4', { bw: 2 });
    box(pg, 200, H - 130, 180, 40, '501 Endpoint Sensing', { sz: 8 });
    box(pg, 200, H - 180, 180, 40, '502 Radial Stimulus', { sz: 8 });
    box(pg, 200, H - 230, 180, 40, '503 Pressure Rings', { sz: 8 });
    lbl(pg, 'Controlled Internal Measurement', 220, H - 420, 8);

    // =================== FIG. 9 — Node 5 (Context) ===================
    pg = doc.addPage([W, H]);
    title(pg, 'FIG. 9', H - 40);
    lbl(pg, 'Node 5 — Upper-Body Physiologic Context Device', 180, H - 55, 9);
    const ff = ['600A Chest', '600B Wrist', '600C Ring'];
    ff.forEach((l, i) => box(pg, 80 + i * 160, H - 100, 140, 50, l, { bw: 2 }));
    box(pg, 150, H - 200, 300, 150, 'Common Suite:\n601 ECG, 602 PPG, 603 IMU,\n604 EDA, 605 Temp', { sz: 9 });

    // =================== FIG. 10 — UI Output ===================
    pg = doc.addPage([W, H]);
    title(pg, 'FIG. 10', H - 40);
    lbl(pg, 'Privacy-Preserving User Interface Output', 200, H - 55, 9);
    box(pg, 120, H - 80, 360, 450, '800 Output Interface Mockup', { dash: [3, 3] });
    lbl(pg, '- Vitality Index (Non-Numeric)', 150, H - 150, 9);
    lbl(pg, '- Sigil Representation', 150, H - 180, 9);
    lbl(pg, '- Pattern Curves (Longitudinal)', 150, H - 210, 9);
    lbl(pg, '- No Anatomical Imagery', 150, H - 240, 9, { bold: true });

    // =================== FIG. 11 — Cross-User Pairing ===================
    pg = doc.addPage([W, H]);
    title(pg, 'FIG. 11', H - 40);
    lbl(pg, 'Privacy-Preserving Cross-User Correlation', 190, H - 55, 9);
    box(pg, 80, H - 120, 120, 40, 'User A', { sz: 8 });
    box(pg, 400, H - 120, 120, 40, 'User B', { sz: 8 });
    box(pg, 180, H - 200, 240, 40, '500 Consent Manager\n(Opt-In Required)', { sz: 8, bw: 2 });
    box(pg, 180, H - 270, 240, 40, '760 Correlation Engine\n(Abstracted Metrics Only)', { sz: 8 });

    // =================== FIG. 12 — Workflow Initialization ===================
    pg = doc.addPage([W, H]);
    title(pg, 'FIG. 12', H - 40);
    lbl(pg, 'System Workflow: Initialization to Longitudinal Correlation', 150, H - 55, 9);
    const wfs = [
        '1. Initialization & Pairing',
        '2. Wear Detection & Validation',
        '3. Multi-Node Data Collection',
        '4. Baseline Establishment',
        '5. Longitudinal Tracking',
        '6. Cross-Device Correlation',
        '7. Privacy-Preserving Output',
    ];
    wfs.forEach((s, i) => {
        box(pg, 180, H - 100 - i * 65, 240, 40, s, { sz: 9 });
        if (i > 0) arrow(pg, 300, H - 100 - i * 65 + 40 + 25, 300, H - 100 - i * 65 + 40);
    });

    const pdfBytes = await doc.save();
    const outPath = path.join('C:\\Users\\zSixt\\Desktop\\patent pdfs', '84_Patent_Figures.pdf');
    fs.writeFileSync(outPath, pdfBytes);
    console.log(`Created: ${outPath}`);
}
createFigures().catch(console.error);
