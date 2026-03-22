const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createFig11() {
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
    centerText(pg, 'FIG. 11', H - 45, 16, bold, black);
    centerText(pg, 'Flexible Multi-Pairing Correlation Topologies', H - 65, 10, font, black);

    // Helper to draw a "User Node"
    function drawUserNode(pg, x, y, label, sub) {
        const w = 110, h = 40;
        drawBox(pg, x, y, w, h, { bw: 1.2 });
        drawCenteredLabel(pg, label, x, y + h - 14, w, 8, bold);
        drawCenteredLabel(pg, sub, x, y + 8, w, 7.5, ital, gray);
        return { cx: x + w / 2, cy: y + h / 2, top: y + h, bottom: y, left: x, right: x + w };
    }

    // ===== CASE 1: PROTOTYPICAL PAIRING (Top) =====
    centerText(pg, 'Scenario A: Prototypical Correlation (M-F)', H - 100, 9, bold, gray);
    const u1 = drawUserNode(pg, 120, H - 160, '100-A', '(User A)');
    const u2 = drawUserNode(pg, 380, H - 160, '100-B', '(User B)');

    // Consent Gated Link
    const midX = (u1.right + u2.left) / 2;
    const midY = u1.cy;
    drawBox(pg, midX - 40, midY - 15, 80, 30, { bw: 1, dash: [3, 2], borderColor: black });
    drawCenteredLabel(pg, '500-G', midX - 40, midY - 5, 80, 7.5, bold);
    drawCenteredLabel(pg, '(Consent Gated)', midX - 40, midY - 18, 80, 6, ital, gray);

    drawArrow(pg, u1.right, u1.cy, midX - 40, midY);
    drawArrow(pg, u2.left, u2.cy, midX + 40, midY);

    // ===== CASE 2: FLEXIBLE PAIRING (Middle) =====
    centerText(pg, 'Scenario B: Flexible Gender-Neutral Pairing (M-M, F-F, etc.)', H - 240, 9, bold, gray);
    const u3 = drawUserNode(pg, 120, H - 320, '100-X', '(Subject X)');
    const u4 = drawUserNode(pg, 380, H - 320, '100-Y', '(Subject Y)');

    const midX2 = (u3.right + u4.left) / 2;
    const midY2 = u3.cy;
    drawBox(pg, midX2 - 40, midY2 - 15, 80, 30, { bw: 1, dash: [3, 2], borderColor: black });
    drawCenteredLabel(pg, '500-G', midX2 - 40, midY2 - 5, 80, 7.5, bold);

    drawArrow(pg, u3.right, u3.cy, midX2 - 40, midY2);
    drawArrow(pg, u4.left, u4.cy, midX2 + 40, midY2);

    // ===== CASE 3: ONE-TO-MANY / DISTRIBUTED (Bottom) =====
    centerText(pg, 'Scenario C: One-to-Many Contextual Correlation', H - 420, 9, bold, gray);
    const uP = drawUserNode(pg, W / 2 - 55, H - 480, '100-P', '(Primary)');
    const uS1 = drawUserNode(pg, 100, H - 580, '100-S1', '(Secondary 1)');
    const uS2 = drawUserNode(pg, 400, H - 580, '100-S2', '(Secondary 2)');

    drawArrow(pg, uP.cx - 20, uP.bottom, uS1.cx + 20, uS1.top);
    drawArrow(pg, uP.cx + 20, uP.bottom, uS2.cx - 20, uS2.top);

    const coreY = H - 540;
    drawBox(pg, W / 2 - 50, coreY - 15, 100, 30, { bw: 1, dash: [4, 2], borderColor: gray });
    drawCenteredLabel(pg, '800 (Shared Zone)', W / 2 - 50, coreY - 5, 100, 7.5, bold, gray);

    // ===== CORRELATION LOGIC BLOCK (Final) =====
    const logX = 80, logY = H - 710, logW = W - 160, logH = 55;
    drawBox(pg, logX, logY, logW, logH, { bw: 1.5 });
    drawCenteredLabel(pg, '760 (Multi-Pairing Correlation Engine)', logX, logY + logH - 15, logW, 9, bold);
    drawCenteredLabel(pg, 'Dynamic Role Assignment & Abstract Coordinate Alignment', logX, logY + 12, logW, 8.5, font);

    // Output Arrow
    drawArrow(pg, W / 2, logY, W / 2, logY - 25);
    drawBox(pg, W / 2 - 120, logY - 60, 240, 35, { bw: 1.8 });
    drawCenteredLabel(pg, '800 Shared Shared Intelligence Output', W / 2 - 120, logY - 48, 240, 9, bold);

    // Footer label
    centerText(pg, 'Architecture is gender-agnostic and supports arbitrary n-way pairing via consent governance.', logY - 78, 7.5, ital, gray);

    // Footer
    centerText(pg, 'Document 84 -- FIG. 11', 35, 8, ital, gray);

    const pdfBytes = await doc.save();
    const outPath = path.join('C:\\Users\\zSixt\\Desktop\\patent pdfs', 'FIG_11_Multi_Pairing.pdf');
    fs.writeFileSync(outPath, pdfBytes);
    console.log(`Created: ${outPath}`);
}

createFig11().catch(console.error);
