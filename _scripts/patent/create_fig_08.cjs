const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createFig8() {
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
    centerText(pg, 'FIG. 8', H - 45, 16, bold, black);
    centerText(pg, 'Cross-Device Correlation Workflow (Time-Aligned Sensing)', H - 65, 10, font, black);

    // ===== SOURCE NODES =====
    const nodeY = H - 120;
    const nodeW = 95, nodeH = 45;
    const nodeGap = 12;
    const nodeStartX = (W - (5 * nodeW + 4 * nodeGap)) / 2;

    const nodeRefs = ['200', '300', '400', '500', '600'];
    const nodeNames = ['Node 1', 'Node 2', 'Node 3', 'Node 4', 'Node 5'];

    nodeRefs.forEach((ref, i) => {
        const x = nodeStartX + i * (nodeW + nodeGap);
        drawBox(pg, x, nodeY, nodeW, nodeH, { bw: 1 });
        drawCenteredLabel(pg, ref, x, nodeY + nodeH - 12, nodeW, 7.5, bold);
        drawCenteredLabel(pg, nodeNames[i], x, nodeY + nodeH - 25, nodeW, 8.5, bold);
        drawCenteredLabel(pg, '(Physio Stream)', x, nodeY + nodeH - 37, nodeW, 7, ital, gray);
    });

    // ===== TIME SYNCHRONIZATION =====
    const syncY = nodeY - 70;
    const syncW = 320, syncH = 40;
    const syncX = (W - syncW) / 2;
    drawBox(pg, syncX, syncY, syncW, syncH, { bw: 1.2 });
    drawCenteredLabel(pg, '310', syncX, syncY + syncH - 12, syncW, 8, bold);
    drawCenteredLabel(pg, 'Time Synchronization Module', syncX, syncY + syncH - 26, syncW, 10, bold);
    drawCenteredLabel(pg, '(Clock Alignment & Latency Compensation)', syncX, syncY + syncH - 37, syncW, 7.5, ital, gray);

    // Arrows from nodes to sync
    nodeRefs.forEach((_, i) => {
        const x = nodeStartX + i * (nodeW + nodeGap) + nodeW / 2;
        drawArrow(pg, x, nodeY, x, syncY + syncH);
    });

    // ===== CONTEXT-TAGGED SEGMENTATION =====
    const segY = syncY - 70;
    const segW = 320, segH = 40;
    const segX = (W - segW) / 2;
    drawBox(pg, segX, segY, segW, segH, { bw: 1.2 });
    drawCenteredLabel(pg, 'Contextual Tagging & Segmentation', segX, segY + segH - 16, segW, 10, bold);
    drawCenteredLabel(pg, '(Arousal, Stress, Sleep, or Activity States)', segX, segY + segH - 30, segW, 8, ital, gray);
    drawArrow(pg, W / 2, syncY, W / 2, segY + segH);

    // ===== PER-NODE METRIC EXTRACTION =====
    const metY = segY - 70;
    const metW = 320, metH = 40;
    const metX = (W - metW) / 2;
    drawBox(pg, metX, metY, metW, metH, { bw: 1.2 });
    drawCenteredLabel(pg, 'Per-Node Metric Extraction', segX, metY + metH - 16, metW, 10, bold);
    drawCenteredLabel(pg, '(Derived Indices: 750)', segX, metY + metH - 30, metW, 8, ital, gray);
    drawArrow(pg, W / 2, segY, W / 2, metY + metH);

    // ===== CROSS-DEVICE CORRELATION ENGINE =====
    const corrY = metY - 80;
    const corrW = 360, corrH = 60;
    const corrX = (W - corrW) / 2;
    drawBox(pg, corrX, corrY, corrW, corrH, { bw: 2 });
    drawCenteredLabel(pg, '760', corrX, corrY + corrH - 14, corrW, 8.5, bold);
    drawCenteredLabel(pg, 'Cross-Device Correlation Engine', corrX, corrY + corrH - 32, corrW, 12, bold);
    drawCenteredLabel(pg, '(Physiological Pattern Alignment Analysis)', corrX, corrY + corrH - 48, corrW, 8.5, ital, gray);
    drawArrow(pg, W / 2, metY, W / 2, corrY + corrH);

    // ===== OUTPUT REPORT =====
    const outY = corrY - 80;
    const outW = 380, outH = 50;
    const outX = (W - outW) / 2;
    drawBox(pg, outX, outY, outW, outH, { bw: 1.5, dash: [5, 2] });
    drawCenteredLabel(pg, '800', outX, outY + outH - 12, outW, 8.5, bold);
    drawCenteredLabel(pg, 'Longitudinal Multi-Node Report', outX, outY + outH - 28, outW, 11, bold);
    drawCenteredLabel(pg, '(Aggregated Privacy-Preserving Health Marker)', outX, outY + outH - 42, outW, 8, ital, gray);
    drawArrow(pg, W / 2, corrY, W / 2, outY + outH);

    // Verification Note
    centerText(pg, 'Ensures coherence across decentralized sensing architectures.', outY - 20, 7.5, ital, gray);

    // Footer
    centerText(pg, 'Document 84 -- FIG. 8', 35, 8, ital, gray);

    const pdfBytes = await doc.save();
    const outPath = path.join('C:\\Users\\zSixt\\Desktop\\patent pdfs', 'FIG_08_Cross_Device_Correlation.pdf');
    fs.writeFileSync(outPath, pdfBytes);
    console.log(`Created: ${outPath}`);
}

createFig8().catch(console.error);
