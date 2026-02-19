const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createFig9() {
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
    centerText(pg, 'FIG. 9', H - 45, 16, bold, black);
    centerText(pg, 'Cross-User Correlation and Consent-Gated Sharing', H - 65, 10, font, black);

    // ===== DUAL USER ARCHITECTURE (Top) =====
    const userW = 180, userH = 60;
    const userA_X = 80, userB_X = W - 80 - userW;
    const userY = H - 160;

    // User A
    drawBox(pg, userA_X, userY, userW, userH, { bw: 1.5 });
    drawCenteredLabel(pg, '100A', userA_X, userY + userH - 12, userW, 8.5, bold);
    drawCenteredLabel(pg, 'User A System', userA_X, userY + userH - 30, userW, 11, bold);
    drawCenteredLabel(pg, '(Nodes 200-600)', userA_X, userY + userH - 45, userW, 8, ital, gray);

    // User B
    drawBox(pg, userB_X, userY, userW, userH, { bw: 1.5 });
    drawCenteredLabel(pg, '100B', userB_X, userY + userH - 12, userW, 8.5, bold);
    drawCenteredLabel(pg, 'User B System', userB_X, userY + userH - 30, userW, 11, bold);
    drawCenteredLabel(pg, '(Nodes 200-600)', userB_X, userY + userH - 45, userW, 8, ital, gray);

    // ===== CONSENT MANAGER (Middle) =====
    const consentY = userY - 120;
    const consentW = 340, consentH = 80;
    const consentX = (W - consentW) / 2;
    drawBox(pg, consentX, consentY, consentW, consentH, { bw: 2 });
    drawCenteredLabel(pg, '500', consentX, consentY + consentH - 15, consentW, 9, bold);
    drawCenteredLabel(pg, 'Consent Governance & Gating Module', consentX, consentY + consentH - 35, consentW, 12, bold);

    // Consent Sub-Blocks
    const sbW = 90, sbH = 30, sbGap = 15;
    const sbStartX = consentX + (consentW - (3 * sbW + 2 * sbGap)) / 2;
    const sbY = consentY + 10;
    const subBlocks = [
        { ref: '510', name: 'Pairing' },
        { ref: '520', name: 'Perms' },
        { ref: '530', name: 'Identity' }
    ];
    subBlocks.forEach((sb, i) => {
        const x = sbStartX + i * (sbW + sbGap);
        drawBox(pg, x, sbY, sbW, sbH, { bw: 0.8, borderColor: gray });
        drawCenteredLabel(pg, sb.ref, x, sbY + sbH - 10, sbW, 7, bold, gray);
        drawCenteredLabel(pg, sb.name, x, sbY + 10, sbW, 8, bold);
    });

    // Connection Arrows from Users to Consent
    drawArrow(pg, userA_X + userW / 2, userY, consentX + 50, consentY + consentH);
    drawArrow(pg, userB_X + userW / 2, userY, consentX + consentW - 50, consentY + consentH);
    pg.drawText('Privacy-Aligned\nDerived Metrics Only', { x: consentX - 80, y: consentY + 50, size: 7.5, font: ital, color: gray });

    // ===== CORRELATION ENGINE (Bottom) =====
    const corrY = consentY - 100;
    const corrW = 340, corrH = 65;
    const corrX = (W - corrW) / 2;
    drawBox(pg, corrX, corrY, corrW, corrH, { bw: 1.8 });
    drawCenteredLabel(pg, '760', corrX, corrY + corrH - 14, corrW, 8.5, bold);
    drawCenteredLabel(pg, 'Multi-User Correlation Engine', corrX, corrY + corrH - 35, corrW, 11, bold);
    drawCenteredLabel(pg, '(Cross-User Pattern Discovery)', corrX, corrY + corrH - 50, corrW, 8, ital, gray);
    drawArrow(pg, W / 2, consentY, W / 2, corrY + corrH);

    // ===== SHARED INTELLIGENCE OUTPUT =====
    const outY = corrY - 90;
    const outW = 380, outH = 55;
    const outX = (W - outW) / 2;
    drawBox(pg, outX, outY, outW, outH, { bw: 1.5, dash: [5, 3] });
    drawCenteredLabel(pg, 'Shared Intelligence Output (800)', outX, outY + outH - 15, outW, 9, bold);
    drawCenteredLabel(pg, 'Alignment Indices, Joint Trends, Compatibility Zones', outX, outY + outH - 32, outW, 10, bold);
    drawCenteredLabel(pg, '(Zero Explicit Data Leakage Architecture)', outX, outY + outH - 45, outW, 8, ital, gray);
    drawArrow(pg, W / 2, corrY, W / 2, outY + outH);

    // Security Note
    centerText(pg, 'Consent is revocable and granular per metric type.', outY - 20, 7.5, ital, gray);

    // Footer
    centerText(pg, 'Document 84 -- FIG. 9', 35, 8, ital, gray);

    const pdfBytes = await doc.save();
    const outPath = path.join('C:\\Users\\zSixt\\Desktop\\patent pdfs', 'FIG_09_Cross_User_Consent.pdf');
    fs.writeFileSync(outPath, pdfBytes);
    console.log(`Created: ${outPath}`);
}

createFig9().catch(console.error);
