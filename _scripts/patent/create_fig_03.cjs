const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createFig3() {
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
    centerText(pg, 'FIG. 3', H - 45, 16, bold, black);
    centerText(pg, 'Node 2 -- Intravaginal Longitudinal Physiology Monitor', H - 65, 10, font, black);

    // ===== DEVICE BODY (elongated vertical shape, left side) =====
    const devX = 85, devTop = H - 95, devW = 120, devH = 320;
    drawBox(pg, devX, devTop - devH, devW, devH, { bw: 1.8 });
    lbl(pg, '300', devX + 5, devTop - 14, 9, bold);

    // Sensing zones inside device body
    const zones = [
        { ref: 'Zone A', label: 'Impedance', y: devTop - 35, h: 60 },
        { ref: 'Zone B', label: 'Dielectric', y: devTop - 105, h: 60 },
        { ref: 'Zone C', label: 'pH', y: devTop - 175, h: 45 },
        { ref: 'Zone D', label: 'Pressure', y: devTop - 230, h: 50 },
    ];

    zones.forEach(z => {
        drawBox(pg, devX + 8, z.y - z.h, devW - 16, z.h, { bw: 0.6, borderColor: gray, dash: [2, 2] });
        drawCenteredLabel(pg, z.ref, devX + 8, z.y - 12, devW - 16, 6.5, bold, gray);
        drawCenteredLabel(pg, z.label, devX + 8, z.y - 23, devW - 16, 7.5, font);
    });

    // Retrieval features
    pg.drawLine({ start: { x: devX + devW / 2, y: devTop - devH }, end: { x: devX + devW / 2, y: devTop - devH - 20 }, thickness: 2, color: black });
    lbl(pg, '307 Retrieval Tab', devX + devW / 2 + 5, devTop - devH - 12, 7, ital, gray);
    drawCenteredLabel(pg, 'Sealed Silicone Body', devX, devTop - devH - 30, devW, 7.5, ital, gray);

    // ===== SENSOR SUITE TABLE (right side) =====
    const tableX = 245, tableTop = H - 95, tableW = 320, tableH = 260;
    drawBox(pg, tableX, tableTop - tableH, tableW, tableH, { bw: 1.2 });
    lbl(pg, 'Sensor Suite', tableX + 115, tableTop - 15, 10, bold);

    const sensors = [
        ['301', 'Bio-Impedance Electrodes', 'Multi-freq., 2-/4-electrode configs'],
        ['302', 'Capacitive Wetness / Dielectric', 'Trend estimation, dielectric changes'],
        ['303', 'Solid-State pH (ISFET)', 'Drift modeling, stabilization routines'],
        ['304', 'Distributed Pressure Zones', 'Multi-zone pelvic activity sensing'],
        ['305', 'Temperature Sensors', 'Context, compensation, placement check'],
        ['306', '6-Axis IMU', 'Motion gating, orientation, artifacts'],
        ['307', 'Retrieval Feature', 'Sealed tab or retrieval loop'],
    ];

    const colRef = tableX + 12, colName = tableX + 42, colDesc = tableX + 185;
    const rowH = 29, startY = tableTop - 42;

    lbl(pg, 'Ref', colRef, startY + 6, 7.5, bold, gray);
    lbl(pg, 'Sensor Modality', colName, startY + 6, 7.5, bold, gray);
    lbl(pg, 'Implementation', colDesc, startY + 6, 7.5, bold, gray);
    pg.drawLine({ start: { x: tableX + 5, y: startY }, end: { x: tableX + tableW - 5, y: startY }, thickness: 0.5, color: ltGray });

    sensors.forEach(([ref, name, desc], i) => {
        const ry = startY - 9 - i * rowH;
        lbl(pg, ref, colRef, ry, 7.5, bold);
        lbl(pg, name, colName, ry, 7.5, font);
        lbl(pg, desc, colDesc, ry, 6.5, font, gray);
        if (i < sensors.length - 1) {
            pg.drawLine({ start: { x: tableX + 5, y: ry - 9 }, end: { x: tableX + tableW - 5, y: ry - 9 }, thickness: 0.3, color: ltGray });
        }
    });

    // Simplified link lines (only 2 to keep it clean)
    pg.drawLine({ start: { x: devX + devW, y: devTop - 65 }, end: { x: tableX, y: startY - 6 }, thickness: 0.4, color: ltGray, dashArray: [2, 2] });
    pg.drawLine({ start: { x: devX + devW, y: devTop - 255 }, end: { x: tableX, y: startY - 93 }, thickness: 0.4, color: ltGray, dashArray: [2, 2] });

    // ===== DATA PIPELINE (centered lower) =====
    const pipeTopY = devTop - devH - 75;
    const pipeW = W - 140, pipeH = 38;
    const pipeX = (W - pipeW) / 2;
    drawBox(pg, pipeX, pipeTopY - pipeH, pipeW, pipeH, { bw: 1.2 });
    drawCenteredLabel(pg, 'Data Abstraction Pipeline', pipeX, pipeTopY - 12, pipeW, 8.5, bold);

    const stages = ['710 Acquire', '720 Condition', '730 Quality Gate', '740 Feature Extract', '750 Metric Gen'];
    const stageW = 85, stageGap = 5;
    const stageStartX = pipeX + (pipeW - (stages.length * stageW + (stages.length - 1) * stageGap)) / 2;
    stages.forEach((s, i) => {
        const sx = stageStartX + i * (stageW + stageGap);
        drawBox(pg, sx, pipeTopY - pipeH + 6, stageW, 16, { bw: 0.4, borderColor: gray });
        drawCenteredLabel(pg, s, sx, pipeTopY - pipeH + 11, stageW, 6.2, font);
    });

    // Connection from device to pipeline
    drawArrow(pg, devX + devW / 2, devTop - devH - 22, devX + devW / 2, pipeTopY);

    // ===== OUTPUT (centered bottom) =====
    const outY = pipeTopY - pipeH - 45;
    const outW = 320, outH = 36;
    const outX = (W - outW) / 2;
    drawBox(pg, outX, outY, outW, outH, { bw: 1.5 });
    drawCenteredLabel(pg, 'Output: Privacy-Preserving Metrics', outX, outY + outH - 12, outW, 8.5, bold);
    drawCenteredLabel(pg, '(Indices, Zones, Trends, Confidence)', outX, outY + outH - 26, outW, 7, ital, gray);
    drawArrow(pg, W / 2, pipeTopY - pipeH, W / 2, outY + outH);

    // Footer label
    centerText(pg, 'No raw physiological or anatomical data is output by the device.', outY - 18, 7, ital, gray);

    // Footer
    centerText(pg, 'Document 84 -- FIG. 3', 35, 8, ital, gray);

    const pdfBytes = await doc.save();
    const outPath = path.join('C:\\Users\\zSixt\\Desktop\\patent pdfs', 'FIG_03_Node2_Intravaginal.pdf');
    fs.writeFileSync(outPath, pdfBytes);
    console.log(`Created: ${outPath}`);
    console.log(`Size: ${(pdfBytes.length / 1024).toFixed(1)} KB`);
}

createFig3().catch(console.error);
