const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createFig4() {
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
    centerText(pg, 'FIG. 4', H - 45, 16, bold, black);
    centerText(pg, 'Node 3 -- External Geometry Self-Scan Device', H - 65, 10, font, black);

    // ===== DEVICE BODY (Handheld form factor) =====
    const devW = 140, devH = 300;
    const devX = 80, devTop = H - 95;
    drawBox(pg, devX, devTop - devH, devW, devH, { bw: 2 });
    lbl(pg, '400', devX + 5, devTop - 14, 9, bold);

    // Optical flow / sensor zones
    const sensorsRegionY = devTop - 45;
    const sensorsRegionH = 210;
    drawBox(pg, devX + 15, sensorsRegionY - sensorsRegionH, devW - 30, sensorsRegionH, { bw: 0.5, borderColor: gray, dash: [4, 2] });
    drawCenteredLabel(pg, 'Sense Regions', devX + 15, sensorsRegionY - 12, devW - 30, 7, ital, gray);

    // Component boxes
    const comps = [
        { ref: '401', name: 'Optical Flow', sub: 'Sensor Array', y: sensorsRegionY - 20, h: 45 },
        { ref: '402', name: 'ToF Distances', sub: 'Lidar Sensors (x4)', y: sensorsRegionY - 75, h: 45 },
        { ref: '403', name: 'IMU', sub: 'Orientation / Motion', y: sensorsRegionY - 130, h: 35 },
        { ref: '404', name: 'Anti-Spoof', sub: 'Thermal Sensing', y: sensorsRegionY - 175, h: 35 },
    ];

    comps.forEach(c => {
        drawBox(pg, devX + 25, c.y - c.h, devW - 50, c.h, { bw: 0.8 });
        drawCenteredLabel(pg, c.ref, devX + 25, c.y - 12, devW - 50, 7, bold);
        drawCenteredLabel(pg, c.name, devX + 25, c.y - 23, devW - 50, 8, bold);
        drawCenteredLabel(pg, c.sub, devX + 25, c.y - 33, devW - 50, 6.5, font, gray);
    });

    // Handle / Bottom Area
    lbl(pg, 'Handle Area', devX + 40, devTop - devH + 15, 7.5, ital, gray);
    lbl(pg, '408 BLE Radio', devX + 40, devTop - devH + 30, 7.5, bold);

    // ===== SCAN PATH CONCEPT (Right Side) =====
    const pathX = 350, pathTop = H - 110, pathW = 180, pathH = 200;
    drawBox(pg, pathX, pathTop - pathH, pathW, pathH, { bw: 1.2, dash: [5, 3], borderColor: gray });
    drawCenteredLabel(pg, '405 Scan Path Concept', pathX, pathTop - 15, pathW, 9, bold);

    // Drawing the object being scanned (abstract silhouette)
    const silW = 40, silH = 120;
    const silX = pathX + 40, silY = pathTop - 50;
    drawBox(pg, silX, silY - silH, silW, silH, { bw: 0.5, borderColor: ltGray });
    lbl(pg, 'Measured Tissue', silX, silY - silH - 12, 6.5, ital, gray);

    // Scan Arrow
    const arrowX = silX + silW + 25;
    drawArrow(pg, arrowX, silY - 20, arrowX, silY - silH + 20, { t: 1.5 });
    lbl(pg, 'Scan Direction', arrowX + 8, silY - silH / 2, 7, bold);
    lbl(pg, 'Relative Movement', arrowX + 8, silY - silH / 2 - 10, 6.5, ital, gray);

    // Sensor Orientation
    lbl(pg, 'Orthogonal Orientation', pathX + 40, pathTop - 180, 7, ital, gray);

    // ===== DATA ABSTRACTION & VALIDITY (Bottom) =====
    const logicTopY = devTop - devH - 60;
    const logicW = W - 140, logicH = 65;
    const logicX = (W - logicW) / 2;
    drawBox(pg, logicX, logicTopY - logicH, logicW, logicH, { bw: 1 });
    drawCenteredLabel(pg, 'Internal Validation & Output Logic', logicX, logicTopY - 14, logicW, 9, bold);

    const steps = [
        { ref: '406', name: 'Quality Gating', sub: 'Signal Coherence' },
        { ref: '407', name: 'Valid Window', sub: 'Spatial Consistency' },
        { ref: '800', name: 'Privacy Interface', sub: 'Abstract Metrics' },
    ];
    const stepW = 110, stepGap = 35;
    const stepStartX = logicX + (logicW - (steps.length * stepW + (steps.length - 1) * stepGap)) / 2;

    steps.forEach((s, i) => {
        const sx = stepStartX + i * (stepW + stepGap);
        const sy = logicTopY - logicH + 10;
        drawBox(pg, sx, sy, stepW, 35, { bw: 0.7 });
        drawCenteredLabel(pg, s.ref, sx, sy + 22, stepW, 7, bold);
        drawCenteredLabel(pg, s.name, sx, sy + 11, stepW, 8, bold);
        drawCenteredLabel(pg, s.sub, sx, sy + 2, stepW, 6.5, font, gray);

        if (i < steps.length - 1) {
            drawArrow(pg, sx + stepW + 5, sy + 17, sx + stepW + stepGap - 5, sy + 17);
        }
    });

    // Arrows from top components to logic
    drawArrow(pg, devX + devW / 2, devTop - devH, devX + devW / 2, logicTopY, { t: 0.5 });
    drawArrow(pg, pathX + pathW / 2, pathTop - pathH, pathX + pathW / 2, logicTopY, { t: 0.5 });

    // Output
    const outY = logicTopY - logicH - 55;
    const outW = 280, outH = 35;
    const outX = (W - outW) / 2;
    drawBox(pg, outX, outY, outW, outH, { bw: 1.8 });
    drawCenteredLabel(pg, 'Privacy-Preserving Geometry Report', outX, outY + outH - 12, outW, 9, bold);
    drawCenteredLabel(pg, '(Indices, Length/Diameter Trends, Confidence)', outX, outY + outH - 26, outW, 7.5, ital, gray);
    drawArrow(pg, W / 2, logicTopY - logicH, W / 2, outY + outH);

    // Footer label
    centerText(pg, 'No raw images or anatomical silhouettes are stored or transmitted.', outY - 18, 7, ital, gray);

    // Footer
    centerText(pg, 'Document 84 -- FIG. 4', 35, 8, ital, gray);

    const pdfBytes = await doc.save();
    const outPath = path.join('C:\\Users\\zSixt\\Desktop\\patent pdfs', 'FIG_04_Node3_Scanner.pdf');
    fs.writeFileSync(outPath, pdfBytes);
    console.log(`Created: ${outPath}`);
}

createFig4().catch(console.error);
