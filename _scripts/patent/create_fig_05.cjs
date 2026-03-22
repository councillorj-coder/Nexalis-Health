const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createFig5() {
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
    centerText(pg, 'FIG. 5', H - 45, 16, bold, black);
    centerText(pg, 'Node 4 -- Intraluminal Geometry, Compliance, and Contact Device', H - 65, 10, font, black);

    // ===== DEVICE BODY (Detailed technical schematic) =====
    const devX = 100, devTop = H - 95, devW = 125, devH = 340;
    drawBox(pg, devX, devTop - devH, devW, devH, { bw: 2 });
    lbl(pg, '500', devX + 5, devTop - 14, 9, bold);

    // Component layers
    const comps = [
        { ref: '501', name: 'Endpoint Sensing', sub: '(ToF / IR)', y: devTop - 30, h: 50 },
        { ref: '502', name: 'Expandable Cuff', sub: '(Radial Stimulus)', y: devTop - 90, h: 70 },
        { ref: '503', name: 'Pressure Rings', sub: '(Circumferential)', y: devTop - 170, h: 60 },
        { ref: '504', name: 'Impedance', sub: 'Electrodes', y: devTop - 240, h: 40 },
        { ref: '505', name: 'Pressure Trans.', sub: 'Stimulus Source', y: devTop - 290, h: 35 },
    ];

    comps.forEach(c => {
        drawBox(pg, devX + 12, c.y - c.h, devW - 24, c.h, { bw: 0.6, borderColor: gray, dash: [4, 2] });
        drawCenteredLabel(pg, c.ref, devX + 12, c.y - 12, devW - 24, 6.5, bold, gray);
        drawCenteredLabel(pg, c.name, devX + 12, c.y - 25, devW - 24, 7.5, bold);
        drawCenteredLabel(pg, c.sub, devX + 12, c.y - 36, devW - 24, 6.5, font, gray);
    });

    // Base components
    lbl(pg, '506 IMU', devX + 30, devTop - devH + 12, 7.5, bold);

    // ===== CONTROL / INTERFACE BLOCK (Right Side) =====
    const ctrlX = 275, ctrlTop = H - 95, ctrlW = 280, ctrlH = 260;
    drawBox(pg, ctrlX, ctrlTop - ctrlH, ctrlW, ctrlH, { bw: 1.2 });
    lbl(pg, '510 Control & Actuation Interface', ctrlX + 50, ctrlTop - 14, 9, bold);

    const controls = [
        ['511', 'Radial Expansion Controller', 'Pneumatic / Mechanical'],
        ['512', 'Stimulus Waveform Gen.', 'Controlled Micro-Vibrations'],
        ['513', 'Contact Integrity Monitor', 'Pressure Feedback Loop'],
        ['514', 'Compliance Logic Engine', 'Stress-Strain Analysis'],
        ['515', 'ToF Processing Unit', 'Endpoint & Depth Mapping'],
        ['516', 'Safety Overrides', 'Pressure & Time Bounding'],
    ];

    const colRef = ctrlX + 12, colName = ctrlX + 42, colDesc = ctrlX + 180;
    const rowH = 35, startY = ctrlTop - 45;

    lbl(pg, 'Ref', colRef, startY + 6, 7.5, bold, gray);
    lbl(pg, 'Control Module', colName, startY + 6, 7.5, bold, gray);
    lbl(pg, 'Functional Role', colDesc, startY + 6, 7.5, bold, gray);
    pg.drawLine({ start: { x: ctrlX + 5, y: startY }, end: { x: ctrlX + ctrlW - 5, y: startY }, thickness: 0.5, color: ltGray });

    controls.forEach(([ref, name, desc], i) => {
        const ry = startY - 12 - i * rowH;
        lbl(pg, ref, colRef, ry, 7.5, bold);
        lbl(pg, name, colName, ry, 7.5, font);
        // Draw desc text wrapped if long
        const lines = [desc];
        lines.forEach((ln, li) => {
            lbl(pg, ln, colDesc, ry - li * 8, 6, ital, gray);
        });
        if (i < controls.length - 1) {
            pg.drawLine({ start: { x: ctrlX + 5, y: ry - 14 }, end: { x: ctrlX + ctrlW - 5, y: ry - 14 }, thickness: 0.3, color: ltGray });
        }
    });

    // Cross-links
    pg.drawLine({ start: { x: devX + devW, y: devTop - 125 }, end: { x: ctrlX, y: startY - 12 }, thickness: 0.4, color: ltGray, dashArray: [2, 2] });
    pg.drawLine({ start: { x: devX + devW, y: devTop - 310 }, end: { x: ctrlX, y: startY - 185 }, thickness: 0.4, color: ltGray, dashArray: [2, 2] });

    // ===== OPERATION SEQUENCE & OUTPUT (Bottom) =====
    const seqTopY = devTop - devH - 45;
    const seqW = W - 140, seqH = 75;
    const seqX = (W - seqW) / 2;
    drawBox(pg, seqX, seqTopY - seqH, seqW, seqH, { bw: 1 });
    drawCenteredLabel(pg, 'Measurement & Stimulus Sequence', seqX, seqTopY - 14, seqW, 9, bold);

    const steps = [
        { n: '1', t: 'Endpoint\nCheck' },
        { n: '2', t: 'Initial\nContact' },
        { n: '3', t: 'Controlled\nExpansion' },
        { n: '4', t: 'Compliance\nProfiling' },
        { n: '5', t: 'Stimulus\nResponse' }
    ];
    const sW = 85, sG = 12;
    const sX = seqX + (seqW - (5 * sW + 4 * sG)) / 2;
    steps.forEach((s, i) => {
        const sx = sX + i * (sW + sG);
        const sy = seqTopY - seqH + 12;
        drawBox(pg, sx, sy, sW, 35, { bw: 0.6 });
        drawCenteredLabel(pg, s.n, sx, sy + 25, sW, 7, bold, gray);
        const lines = s.t.split('\n');
        lines.forEach((ln, li) => {
            drawCenteredLabel(pg, ln, sx, sy + 13 - li * 8, sW, 7.5, font);
        });
        if (i < steps.length - 1) {
            drawArrow(pg, sx + sW + 2, sy + 17, sx + sW + sG - 2, sy + 17, { t: 0.5 });
        }
    });

    // Arrows to sequence
    drawArrow(pg, devX + devW / 2, devTop - devH, devX + devW / 2, seqTopY);
    drawArrow(pg, ctrlX + ctrlW / 2, ctrlTop - ctrlH, ctrlX + ctrlW / 2, seqTopY);

    // Output
    const outY = seqTopY - seqH - 60;
    const outW = 320, outH = 40;
    const outX = (W - outW) / 2;
    drawBox(pg, outX, outY, outW, outH, { bw: 1.8 });
    drawCenteredLabel(pg, 'Output: Tissue Compliance & Contact Metrics', outX, outY + outH - 12, outW, 9, bold);
    drawCenteredLabel(pg, '(Elasticity Indices, Depth Map, Stimulus Thresholds)', outX, outY + outH - 26, outW, 7.5, ital, gray);
    drawArrow(pg, W / 2, seqTopY - seqH, W / 2, outY + outH);

    // Disclaimer
    centerText(pg, 'Proprietary non-anatomical sensor abstraction for compliance assessment.', outY - 18, 7, ital, gray);

    // Footer
    centerText(pg, 'Document 84 -- FIG. 5', 35, 8, ital, gray);

    const pdfBytes = await doc.save();
    const outPath = path.join('C:\\Users\\zSixt\\Desktop\\patent pdfs', 'FIG_05_Node4_Intraluminal.pdf');
    fs.writeFileSync(outPath, pdfBytes);
    console.log(`Created: ${outPath}`);
}

createFig5().catch(console.error);
