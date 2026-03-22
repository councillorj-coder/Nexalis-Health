/**
 * add_glow_circles.cjs
 *
 * Adds subtle ambient glow circles to pages 2-7 using Screen blend mode.
 * Screen blend mode adds light without obscuring text — circles glow
 * through everything, sitting visually between the black background
 * and the text/elements.
 */

const { PDFDocument, rgb, PDFName, PDFDict, PDFArray, PDFStream } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const DIR = 'C:\\Users\\zSixt\\Desktop\\partnership teaser deck pdf';
const FILE = path.join(DIR, 'Nexalis_Partnership_Brief_Deck_.pdf');

// Circle layouts per page (pages 2-7)
// Colors are RGB values that will glow via Screen blend mode
// Keep values low for subliminal effect
const pageLayouts = [
    // Page 2 — blue top-right, red bottom-left
    [
        { x: 480, y: 650, r: 160, cr: 0.02, cg: 0.04, cb: 0.10 },
        { x: 100, y: 120, r: 140, cr: 0.10, cg: 0.02, cb: 0.03 },
    ],
    // Page 3 — red top-left, blue bottom-right
    [
        { x: 80, y: 680, r: 150, cr: 0.10, cg: 0.02, cb: 0.03 },
        { x: 500, y: 100, r: 170, cr: 0.02, cg: 0.04, cb: 0.10 },
    ],
    // Page 4 — blue center-left, red top-right
    [
        { x: 60, y: 400, r: 180, cr: 0.02, cg: 0.04, cb: 0.10 },
        { x: 520, y: 700, r: 130, cr: 0.08, cg: 0.01, cb: 0.03 },
    ],
    // Page 5 — red bottom-right, blue top-left
    [
        { x: 530, y: 80, r: 160, cr: 0.10, cg: 0.02, cb: 0.03 },
        { x: 70, y: 720, r: 140, cr: 0.02, cg: 0.03, cb: 0.08 },
    ],
    // Page 6 — blue bottom-left, red center-right
    [
        { x: 90, y: 100, r: 170, cr: 0.02, cg: 0.04, cb: 0.10 },
        { x: 510, y: 380, r: 150, cr: 0.10, cg: 0.02, cb: 0.03 },
    ],
    // Page 7 (closing) — blue top-right, red bottom-left
    [
        { x: 500, y: 700, r: 150, cr: 0.02, cg: 0.03, cb: 0.08 },
        { x: 80, y: 80, r: 140, cr: 0.08, cg: 0.01, cb: 0.03 },
    ],
];

/**
 * Build raw PDF content stream for circles using Screen blend mode.
 * Draws filled circles using Bézier curves (PDF has no native circle op).
 */
function buildCircleStream(circles, gsName) {
    let ops = '';
    // Set the Screen blend mode graphics state
    ops += `/${gsName} gs\n`;

    for (const c of circles) {
        // Inner glow circle
        ops += drawFilledCircle(c.x, c.y, c.r, c.cr, c.cg, c.cb);
        // Outer halo — larger, softer
        ops += drawFilledCircle(c.x, c.y, c.r + 60, c.cr * 0.4, c.cg * 0.4, c.cb * 0.4);
    }

    return ops;
}

/**
 * Draw a filled circle using 4 Bézier curves (standard PDF technique).
 * k = 0.5523 is the magic constant for approximating a circle with Béziers.
 */
function drawFilledCircle(cx, cy, r, cr, cg, cb) {
    const k = 0.5523 * r;
    let s = '';
    s += `${cr} ${cg} ${cb} rg\n`; // set fill color
    s += `${cx} ${cy + r} m\n`; // move to top
    s += `${cx + k} ${cy + r} ${cx + r} ${cy + k} ${cx + r} ${cy} c\n`;
    s += `${cx + r} ${cy - k} ${cx + k} ${cy - r} ${cx} ${cy - r} c\n`;
    s += `${cx - k} ${cy - r} ${cx - r} ${cy - k} ${cx - r} ${cy} c\n`;
    s += `${cx - r} ${cy + k} ${cx - k} ${cy + r} ${cx} ${cy + r} c\n`;
    s += `f\n`; // fill
    return s;
}

async function main() {
    const existingBytes = fs.readFileSync(FILE);
    const doc = await PDFDocument.load(existingBytes);
    const context = doc.context;

    // Create an ExtGState dictionary with Screen blend mode
    const gsDict = context.obj({
        Type: 'ExtGState',
        BM: 'Screen',
    });
    const gsRef = context.register(gsDict);
    const gsName = 'GS_Screen';

    for (let i = 1; i < doc.getPageCount(); i++) {
        const page = doc.getPage(i);
        const layout = pageLayouts[i - 1];
        if (!layout) continue;

        // Add the graphics state to the page's Resources
        const resources = page.node.get(PDFName.of('Resources'));
        if (resources) {
            let extGState = resources.get(PDFName.of('ExtGState'));
            if (!extGState) {
                extGState = context.obj({});
                resources.set(PDFName.of('ExtGState'), extGState);
            }
            extGState.set(PDFName.of(gsName), gsRef);
        }

        // Build the circle drawing content stream
        const streamContent = buildCircleStream(layout, gsName);
        const streamBytes = Buffer.from(streamContent, 'utf-8');
        const newStream = context.stream(streamBytes);
        const newStreamRef = context.register(newStream);

        // Append to page contents (on top, but Screen blend mode = additive glow)
        const contentsObj = page.node.get(PDFName.of('Contents'));
        if (contentsObj instanceof PDFArray) {
            contentsObj.push(newStreamRef);
        } else if (contentsObj) {
            const newArray = context.obj([contentsObj, newStreamRef]);
            page.node.set(PDFName.of('Contents'), newArray);
        }
    }

    const savedBytes = await doc.save();
    fs.writeFileSync(FILE, savedBytes);
    console.log(`\n  Updated: ${FILE}`);
    console.log(`  Screen blend mode glow circles on pages 2-7`);
    console.log(`  Size: ${(savedBytes.length / 1024).toFixed(1)} KB\n`);
}

main().catch(console.error);
