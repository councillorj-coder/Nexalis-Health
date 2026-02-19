const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createFig2() {
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
        pg.drawText(text, { x: (W - tw) / 2, y, size: sz, font: f, color });
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
    centerText(pg, 'FIG. 2', H - 45, 16, bold, black);
    centerText(pg, 'Node 1 -- External Longitudinal Wearable (Ring Form Factor)', H - 65, 10, font, black);

    // ===== DEVICE OUTLINE (Two form factors side by side) =====

    // --- Form Factor A: C-Shape ---
    const csLabel = 'Form Factor A: C-Shape (Open Ring)';
    lbl(pg, csLabel, 62, H - 95, 8.5, bold);

    // C-shape drawn as thick lines forming an open ring
    const cLeft = 80, cTop = H - 115, cW = 140, cH = 200;
    drawBox(pg, cLeft, cTop - cH, cW, cH, { bw: 0.5, borderColor: ltGray, dash: [4, 3] });
    lbl(pg, '200', cLeft + 5, cTop - 14, 8, bold);

    // Draw the C-shape body
    const cx1 = cLeft + 25, cx2 = cLeft + cW - 25;
    const cyTop = cTop - 30, cyBot = cTop - cH + 30;
    const cMid = (cyTop + cyBot) / 2;
    // Left arc (vertical line)
    pg.drawLine({ start: { x: cx1, y: cyTop }, end: { x: cx1, y: cyBot }, thickness: 3, color: black });
    // Top curve
    pg.drawLine({ start: { x: cx1, y: cyTop }, end: { x: cx2, y: cyTop }, thickness: 3, color: black });
    // Bottom curve
    pg.drawLine({ start: { x: cx1, y: cyBot }, end: { x: cx2, y: cyBot }, thickness: 3, color: black });
    // Right side with gap
    pg.drawLine({ start: { x: cx2, y: cyTop }, end: { x: cx2 + 12, y: cyTop - 10 }, thickness: 3, color: black });
    pg.drawLine({ start: { x: cx2, y: cyBot }, end: { x: cx2 + 12, y: cyBot + 10 }, thickness: 3, color: black });
    pg.drawLine({ start: { x: cx2 + 12, y: cyTop - 10 }, end: { x: cx2 + 12, y: cMid + 18 }, thickness: 3, color: black });
    pg.drawLine({ start: { x: cx2 + 12, y: cyBot + 10 }, end: { x: cx2 + 12, y: cMid - 18 }, thickness: 3, color: black });
    // Gap label
    lbl(pg, 'Gap', cx2 + 17, cMid - 4, 7, ital, gray);
    // Inner surface label
    lbl(pg, 'Inner', cx1 + 8, cMid + 8, 6.5, ital, gray);
    lbl(pg, 'Contact', cx1 + 5, cMid - 2, 6.5, ital, gray);
    lbl(pg, 'Surface', cx1 + 6, cMid - 12, 6.5, ital, gray);

    // --- Form Factor B: Enclosed Ring ---
    const erLabel = 'Form Factor B: Enclosed Ring';
    lbl(pg, erLabel, 360, H - 95, 8.5, bold);

    const rLeft = 355, rTop = H - 115, rW = 140, rH = 200;
    drawBox(pg, rLeft, rTop - rH, rW, rH, { bw: 0.5, borderColor: ltGray, dash: [4, 3] });

    // Draw enclosed ring as a rectangle with rounded ends (simplified)
    const rx1 = rLeft + 25, rx2 = rLeft + rW - 25;
    const ryTop = rTop - 30, ryBot = rTop - rH + 30;
    // Full closed shape
    pg.drawLine({ start: { x: rx1, y: ryTop }, end: { x: rx1, y: ryBot }, thickness: 3, color: black });
    pg.drawLine({ start: { x: rx1, y: ryTop }, end: { x: rx2, y: ryTop }, thickness: 3, color: black });
    pg.drawLine({ start: { x: rx1, y: ryBot }, end: { x: rx2, y: ryBot }, thickness: 3, color: black });
    pg.drawLine({ start: { x: rx2, y: ryTop }, end: { x: rx2, y: ryBot }, thickness: 3, color: black });
    // Electronics pod
    const podY = (ryTop + ryBot) / 2;
    drawBox(pg, rx1 + 5, podY - 12, rx2 - rx1 - 10, 24, { bw: 0.5, borderColor: gray });
    drawCenteredLabel(pg, 'Electronics Pod', rx1 + 5, podY - 5, rx2 - rx1 - 10, 6, ital, gray);

    // ===== SENSOR SUITE (table below both form factors) =====
    const tableTop = H - 345;
    drawBox(pg, 55, tableTop - 265, W - 110, 265, { bw: 1.2 });
    lbl(pg, 'Sensor Suite', 260, tableTop - 14, 10, bold);

    const sensors = [
        ['201', 'Pressure / Contact Sensors', 'FSR, capacitive, piezoresistive arrays'],
        ['202', 'Strain / Deformation Sensors', 'Strain gauges, elastomer-embedded elements'],
        ['203', 'Hall-Effect Sensor + Magnet', 'Relative displacement, geometry changes'],
        ['204', 'Optical PPG Sensor', 'Physiologic confirmation, vascular features'],
        ['205', 'Temperature Sensor', 'Thermal context, on-body confirmation'],
        ['206', '6-Axis IMU', 'Motion gating, orientation, artifact rejection'],
        ['207', 'BLE Radio Module', 'Secure data sync to computing system 110'],
    ];

    const colRef = 70, colName = 110, colDesc = 310;
    const rowH = 30, startY = tableTop - 40;

    // Headers
    lbl(pg, 'Ref', colRef, startY + 6, 7.5, bold, gray);
    lbl(pg, 'Sensor Modality', colName, startY + 6, 7.5, bold, gray);
    lbl(pg, 'Implementation', colDesc, startY + 6, 7.5, bold, gray);
    pg.drawLine({ start: { x: 65, y: startY }, end: { x: W - 65, y: startY }, thickness: 0.5, color: ltGray });

    sensors.forEach(([ref, name, desc], i) => {
        const ry = startY - 8 - i * rowH;
        lbl(pg, ref, colRef, ry, 8, bold);
        lbl(pg, name, colName, ry, 8, font);
        lbl(pg, desc, colDesc, ry, 7, font, gray);
        if (i < sensors.length - 1) {
            pg.drawLine({ start: { x: 65, y: ry - 10 }, end: { x: W - 65, y: ry - 10 }, thickness: 0.3, color: ltGray });
        }
    });

    // ===== OUTPUT BOX =====
    const outY = tableTop - 290;
    drawBox(pg, 150, outY, 310, 35, { bw: 1 });
    drawCenteredLabel(pg, 'Output: Privacy-Preserving Metrics', 150, outY + 20, 310, 8.5, bold);
    drawCenteredLabel(pg, '(Indices, Zones, Trends, Confidence -- No Raw Data)', 150, outY + 7, 310, 7, ital, gray);
    drawArrow(pg, W / 2, tableTop - 265, W / 2, outY + 35);

    // Footer
    centerText(pg, 'Document 84 -- FIG. 2', 35, 8, ital, gray);

    const pdfBytes = await doc.save();
    const outPath = path.join('C:\\Users\\zSixt\\Desktop\\patent pdfs', 'FIG_02_Node1_External_Ring.pdf');
    fs.writeFileSync(outPath, pdfBytes);
    console.log(`Created: ${outPath}`);
    console.log(`Size: ${(pdfBytes.length / 1024).toFixed(1)} KB`);
}

createFig2().catch(console.error);
