const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createFig10() {
    const doc = await PDFDocument.create();
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const ital = await doc.embedFont(StandardFonts.HelveticaOblique);
    const W = 612, H = 792;
    const black = rgb(0, 0, 0);
    const gray = rgb(0.55, 0.55, 0.55);
    const ltGray = rgb(0.85, 0.85, 0.85);

    function centerText(pg, text, y, sz, f, color) {
        const tw = f.widthOfTextAtSize(text, sz);
        pg.drawText(text, { x: (W - tw) / 2, y, size: sz, font: f, color: color || black });
    }
    function drawBox(pg, x, y, w, h, opts = {}) {
        pg.drawRectangle({ x, y, width: w, height: h, borderColor: opts.borderColor || black, borderWidth: opts.bw || 1, borderDashArray: opts.dash, color: opts.fill });
    }
    function drawCenteredLabel(pg, text, x, y, w, sz, f, color) {
        const tw = (f || font).widthOfTextAtSize(text, sz || 8);
        pg.drawText(text, { x: x + (w - tw) / 2, y, size: sz || 8, font: f || font, color: color || black });
    }

    const pg = doc.addPage([W, H]);

    // ===== TITLE =====
    centerText(pg, 'FIG. 10', H - 45, 16, bold, black);
    centerText(pg, 'Privacy-Preserving User Interface (Abstract Metric Representation)', H - 65, 10, font, black);

    // ===== MOBILE DEVICE FRAME =====
    const phoneW = 280, phoneH = 500;
    const phoneX = (W - phoneW) / 2;
    const phoneY = H - 600;
    drawBox(pg, phoneX, phoneY, phoneW, phoneH, { bw: 3 });
    drawCenteredLabel(pg, '800 (User Interface)', phoneX, phoneY - 20, phoneW, 9, bold);

    // Screen Content Area
    const scrX = phoneX + 15, scrY = phoneY + 15, scrW = phoneW - 30, scrH = phoneH - 60;
    drawBox(pg, scrX, scrY, scrW, scrH, { bw: 1, borderColor: gray });

    // Status Bar abstract
    drawBox(pg, scrX + 5, scrY + scrH - 12, scrW - 10, 8, { bw: 0.5, borderColor: ltGray });

    // 1. PRIMARY METRIC (Top Hub)
    const hubY = scrY + scrH - 120;
    pg.drawCircle({ x: phoneX + phoneW / 2, y: hubY, radius: 60, borderColor: black, borderWidth: 1.5 });
    drawCenteredLabel(pg, 'VITALITY INDEX', phoneX, hubY + 15, phoneW, 8, bold);
    drawCenteredLabel(pg, '78', phoneX, hubY - 15, phoneW, 25, bold);
    drawCenteredLabel(pg, '(Derived Marker)', phoneX, hubY - 35, phoneW, 7, ital, gray);

    // 2. ZONE MAP (Abstract Geometric Representation)
    const zoneY = hubY - 140;
    const zoneW = 180, zoneH = 80;
    const zoneX = phoneX + (phoneW - zoneW) / 2;
    drawBox(pg, zoneX, zoneY, zoneW, zoneH, { bw: 1, dash: [2, 2], borderColor: gray });
    drawCenteredLabel(pg, 'Intimate Alignment Zones', zoneX, zoneY + zoneH + 5, zoneW, 8, bold);

    // Hexagons/Circles representing nodes without anatomy
    const nodeDots = [
        { x: zoneX + 30, y: zoneY + 40, ref: '200' },
        { x: zoneX + 75, y: zoneY + 40, ref: '300' },
        { x: zoneX + 105, y: zoneY + 40, ref: '400' },
        { x: zoneX + 150, y: zoneY + 40, ref: '600' }
    ];
    nodeDots.forEach(d => {
        pg.drawCircle({ x: d.x, y: d.y, radius: 12, borderColor: black, borderWidth: 1 });
        pg.drawText(d.ref, { x: d.x - 7, y: d.y - 3, size: 6, font: bold });
    });

    // 3. TREND CURVE (Bottom)
    const trendY = zoneY - 120;
    const trendW = 200, trendH = 80;
    const trendX = phoneX + (phoneW - trendW) / 2;
    // Axes
    pg.drawLine({ start: { x: trendX, y: trendY }, end: { x: trendX + trendW, y: trendY }, thickness: 1, color: black });
    pg.drawLine({ start: { x: trendX, y: trendY }, end: { x: trendX, y: trendY + trendH }, thickness: 1, color: black });

    // Abstract Curve
    pg.drawLine({ start: { x: trendX + 5, y: trendY + 10 }, end: { x: trendX + 50, y: trendY + 45 }, thickness: 1.5, color: black });
    pg.drawLine({ start: { x: trendX + 50, y: trendY + 45 }, end: { x: trendX + 100, y: trendY + 30 }, thickness: 1.5, color: black });
    pg.drawLine({ start: { x: trendX + 100, y: trendY + 30 }, end: { x: trendX + 200, y: trendY + 70 }, thickness: 1.5, color: black });

    drawCenteredLabel(pg, 'Longitudinal Trend Pattern', trendX, trendY - 15, trendW, 8, bold);
    pg.drawText('Intensity (No Units)', { x: trendX - 10, y: trendY + 15, size: 6, font: ital, color: gray, rotate: { angle: 90, type: 'degrees' } });
    pg.drawText('Time', { x: trendX + trendW - 25, y: trendY - 8, size: 6, font: ital, color: gray });

    // 4. CONSENT & PRIVACY BADGE
    const badgeY = scrY + 25;
    drawBox(pg, scrX + 40, badgeY, scrW - 80, 25, { bw: 0.8, fill: ltGray });
    drawCenteredLabel(pg, 'Zero-Leakage Privacy Active', scrX + 40, badgeY + 8, scrW - 80, 8, bold);

    // CALLOUTS (Outside the phone)
    const callout1X = phoneX + phoneW + 20;
    pg.drawText('No Raw Biological Values', { x: callout1X, y: hubY + 10, size: 8, font: ital });
    pg.drawLine({ start: { x: phoneX + phoneW - 10, y: hubY }, end: { x: callout1X - 5, y: hubY }, thickness: 0.5, color: gray });

    const callout2X = phoneX - 130;
    pg.drawText('Abstract Spatial Mapping', { x: callout2X, y: zoneY + 40, size: 8, font: ital });
    pg.drawLine({ start: { x: phoneX + 10, y: zoneY + 40 }, end: { x: callout2X + 100, y: zoneY + 40 }, thickness: 0.5, color: gray });

    // Footer Annotation
    centerText(pg, 'The UI presents computed indices and abstract visualizations rather than explicit physiological data.', phoneY - 50, 8, ital, gray);

    // Footer
    centerText(pg, 'Document 84 -- FIG. 10', 35, 8, ital, gray);

    const pdfBytes = await doc.save();
    const outPath = path.join('C:\\Users\\zSixt\\Desktop\\patent pdfs', 'FIG_10_Privacy_UI.pdf');
    fs.writeFileSync(outPath, pdfBytes);
    console.log(`Created: ${outPath}`);
}

createFig10().catch(console.error);
