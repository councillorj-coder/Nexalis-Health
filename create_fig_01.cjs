const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createFig1() {
    const doc = await PDFDocument.create();
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const ital = await doc.embedFont(StandardFonts.HelveticaOblique);
    const W = 612, H = 792;
    const black = rgb(0, 0, 0);
    const gray = rgb(0.55, 0.55, 0.55);
    const ltGray = rgb(0.78, 0.78, 0.78);

    // --- Helpers ---
    function centerText(pg, text, y, sz, f, color) {
        const tw = f.widthOfTextAtSize(text, sz);
        pg.drawText(text, { x: (W - tw) / 2, y, size: sz, font: f, color });
    }

    function drawBox(pg, x, y, w, h, opts = {}) {
        pg.drawRectangle({
            x, y, width: w, height: h,
            borderColor: opts.borderColor || black,
            borderWidth: opts.bw || 1,
            borderDashArray: opts.dash,
            color: opts.fill,
        });
    }

    function drawLabel(pg, text, x, y, sz, f, color) {
        pg.drawText(text, { x, y, size: sz || 8, font: f || font, color: color || black });
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
    centerText(pg, 'FIG. 1', H - 45, 16, bold, black);
    centerText(pg, 'Multi-Node Intimate Physiology Monitoring System', H - 65, 10, font, black);

    // ===== SYSTEM BOUNDARY (dashed outer frame) =====
    drawBox(pg, 40, 85, W - 80, H - 160, { bw: 0.6, borderColor: ltGray, dash: [6, 4] });
    drawLabel(pg, '100', 46, H - 92, 9, bold, gray);
    drawLabel(pg, 'System', 46, H - 103, 8, ital, gray);

    // ===== COMPUTING SYSTEM (top center) =====
    const csX = 191, csY = H - 130, csW = 230, csH = 50;
    drawBox(pg, csX, csY, csW, csH, { bw: 1.8 });
    drawCenteredLabel(pg, '110', csX, csY + csH - 14, csW, 8, bold);
    drawCenteredLabel(pg, 'Computing System', csX, csY + csH - 28, csW, 10, bold);
    drawCenteredLabel(pg, '(Mobile Device / Server)', csX, csY + csH - 40, csW, 7.5, ital, gray);

    // ===== COMMS LABEL =====
    const commY = csY - 22;
    centerText(pg, '120  Wireless Communications (BLE)', commY, 7.5, ital, gray);

    // ===== FIVE NODES (evenly spaced row) =====
    const nodeW = 88, nodeH = 65, nodeGap = 13;
    const totalNodesW = 5 * nodeW + 4 * nodeGap;
    const nodeStartX = (W - totalNodesW) / 2;
    const nodeTopY = commY - 18;

    const nodeLabels = [
        ['200', 'Node 1', 'External Ring'],
        ['300', 'Node 2', 'Intravaginal'],
        ['400', 'Node 3', 'Geometry Scan'],
        ['500', 'Node 4', 'Intraluminal'],
        ['600', 'Node 5', 'Context Anchor'],
    ];

    const nodeCenters = [];
    nodeLabels.forEach(([ref, name, desc], i) => {
        const nx = nodeStartX + i * (nodeW + nodeGap);
        const ny = nodeTopY - nodeH;
        drawBox(pg, nx, ny, nodeW, nodeH, { bw: 1.2 });
        drawCenteredLabel(pg, ref, nx, ny + nodeH - 14, nodeW, 7.5, bold);
        drawCenteredLabel(pg, name, nx, ny + nodeH - 27, nodeW, 8.5, bold);
        drawCenteredLabel(pg, desc, nx, ny + nodeH - 39, nodeW, 7, font, gray);
        const cx = nx + nodeW / 2;
        nodeCenters.push({ cx, top: ny + nodeH, bottom: ny });
        // Arrow up to computing system
        const csCx = csX + csW / 2;
        const targetX = Math.min(Math.max(cx, csX + 15), csX + csW - 15);
        drawArrow(pg, cx, ny + nodeH, targetX, csY, { dash: [3, 2] });
    });

    // ===== DATA PIPELINE (horizontal bar) =====
    const pipeTopY = nodeCenters[0].bottom - 35;
    const pipeH = 40;
    const pipeX = 55, pipeW = W - 110;
    drawBox(pg, pipeX, pipeTopY - pipeH, pipeW, pipeH, { bw: 1.2 });
    drawLabel(pg, '700', pipeX + 5, pipeTopY - 14, 8, bold);
    drawLabel(pg, 'Data Pipeline', pipeX + 25, pipeTopY - 14, 9, bold);

    // Pipeline stages inside
    const stageNames = ['710 Acquire', '720 Condition', '730 Quality Gate', '740 Extract'];
    const stageW = 105, stageH = 18;
    const stageStartX = pipeX + 20;
    const stageY = pipeTopY - pipeH + 8;
    stageNames.forEach((s, i) => {
        const sx = stageStartX + i * (stageW + 15);
        drawBox(pg, sx, stageY, stageW, stageH, { bw: 0.5, borderColor: gray });
        drawCenteredLabel(pg, s, sx, stageY + 4, stageW, 7, font);
        if (i < stageNames.length - 1) {
            const ax1 = sx + stageW + 1;
            const ax2 = sx + stageW + 14;
            drawArrow(pg, ax1, stageY + stageH / 2, ax2, stageY + stageH / 2, { t: 0.5 });
        }
    });

    // Arrow from computing system down to pipeline
    drawArrow(pg, csX + csW / 2, csY, csX + csW / 2, pipeTopY);

    // ===== THREE PROCESSING BLOCKS (evenly spaced) =====
    const procY = pipeTopY - pipeH - 55;
    const procW = 130, procH = 38;
    const procLabels = [
        ['750', 'Metric Generation'],
        ['760', 'Correlation'],
        ['770', 'Confidence Scoring'],
    ];
    const procStartX = (W - 3 * procW - 2 * 30) / 2;
    const procCenters = [];
    procLabels.forEach(([ref, name], i) => {
        const px = procStartX + i * (procW + 30);
        drawBox(pg, px, procY, procW, procH, { bw: 1 });
        drawCenteredLabel(pg, ref, px, procY + procH - 14, procW, 7.5, bold);
        drawCenteredLabel(pg, name, px, procY + procH - 27, procW, 8, font);
        procCenters.push({ cx: px + procW / 2, top: procY + procH, bottom: procY });
    });

    // Arrows from pipeline to each processing block
    procCenters.forEach(pc => {
        drawArrow(pg, pc.cx, pipeTopY - pipeH, pc.cx, pc.top);
    });

    // ===== PRIVACY OUTPUT (wide box) =====
    const privY = procY - 50;
    const privW = 320, privH = 40;
    const privX = (W - privW) / 2;
    drawBox(pg, privX, privY, privW, privH, { bw: 1.8 });
    drawCenteredLabel(pg, '800', privX, privY + privH - 13, privW, 8, bold);
    drawCenteredLabel(pg, 'Privacy-Preserving Output Interface', privX, privY + privH - 27, privW, 9, bold);

    // Arrows from processing blocks to privacy output
    procCenters.forEach(pc => {
        const targetX = Math.min(Math.max(pc.cx, privX + 15), privX + privW - 15);
        drawArrow(pg, pc.cx, pc.bottom, targetX, privY + privH);
    });

    // ===== USER OUTPUTS (4 dashed boxes) =====
    const outY = privY - 55;
    const outW = 100, outH = 32;
    const outLabels = ['Indices & Zones', 'Trend Curves', 'Confidence', 'Consent Status'];
    const outStartX = (W - 4 * outW - 3 * 20) / 2;
    outLabels.forEach((label, i) => {
        const ox = outStartX + i * (outW + 20);
        drawBox(pg, ox, outY, outW, outH, { bw: 0.7, dash: [3, 2], borderColor: gray });
        drawCenteredLabel(pg, label, ox, outY + 10, outW, 7.5, font, gray);
        const targetX = Math.min(Math.max(ox + outW / 2, privX + 15), privX + privW - 15);
        drawArrow(pg, targetX, privY, ox + outW / 2, outY + outH, { t: 0.5, dash: [2, 2] });
    });

    // Footer note
    centerText(pg, 'No anatomical imagery. No raw numeric values. All outputs privacy-preserving.', outY - 18, 7, ital, gray);

    // Footer
    centerText(pg, 'Document 84 -- FIG. 1', 35, 8, ital, gray);

    // Save
    const pdfBytes = await doc.save();
    const outPath = path.join('C:\\Users\\zSixt\\Desktop\\patent pdfs', 'FIG_01_System_Overview.pdf');
    fs.writeFileSync(outPath, pdfBytes);
    console.log(`Created: ${outPath}`);
    console.log(`Size: ${(pdfBytes.length / 1024).toFixed(1)} KB`);
}

createFig1().catch(console.error);
