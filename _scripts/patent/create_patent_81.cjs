const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createPatent81() {
    const doc = await PDFDocument.create();
    const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await doc.embedFont(StandardFonts.Helvetica);
    const helveticaOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

    const pageWidth = 612;
    const pageHeight = 792;
    const marginLeft = 55;
    const marginRight = 55;
    const contentWidth = pageWidth - marginLeft - marginRight;
    const maxTextWidth = contentWidth - 10;

    const darkGray = rgb(0.25, 0.25, 0.25);
    const medGray = rgb(0.45, 0.45, 0.45);
    const accentBlue = rgb(0.12, 0.29, 0.49);
    const lightLine = rgb(0.8, 0.8, 0.8);

    let currentPage, currentY, pageNum = 0;

    function addPage() {
        currentPage = doc.addPage([pageWidth, pageHeight]);
        pageNum++;
        currentY = pageHeight - 60;
    }

    function drawFooter() {
        const footerText = `Document 81  —  Page ${pageNum}`;
        const w = helveticaOblique.widthOfTextAtSize(footerText, 8);
        currentPage.drawText(footerText, { x: (pageWidth - w) / 2, y: 30, size: 8, font: helveticaOblique, color: medGray });
    }

    function wrapText(text, font, fontSize, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let cur = '';
        for (const word of words) {
            const test = cur ? cur + ' ' + word : word;
            if (font.widthOfTextAtSize(test, fontSize) > maxWidth && cur) { lines.push(cur); cur = word; }
            else { cur = test; }
        }
        if (cur) lines.push(cur);
        return lines;
    }

    function drawWrappedText(text, x, fontSize, font, color, lineSpacing = 13) {
        const lines = wrapText(text, font, fontSize, maxTextWidth - (x - marginLeft));
        for (const line of lines) {
            if (currentY < 65) { drawFooter(); addPage(); }
            currentPage.drawText(line, { x, y: currentY, size: fontSize, font, color });
            currentY -= lineSpacing;
        }
    }

    function drawSectionHeader(letter, title) {
        if (currentY < 100) { drawFooter(); addPage(); }
        currentY -= 6;
        currentPage.drawText(`${letter}. ${title}`, { x: marginLeft, y: currentY, size: 10.5, font: helveticaBold, color: accentBlue });
        currentY -= 16;
    }

    function drawBullet(text) {
        drawWrappedText(`\u2022  ${text}`, marginLeft + 15, 9.5, helvetica, darkGray, 12.5);
        currentY -= 1;
    }

    function drawNumberedItem(num, text) {
        drawWrappedText(`${num}. ${text}`, marginLeft + 15, 9.5, helvetica, darkGray, 12.5);
        currentY -= 1;
    }

    function drawParagraph(text) {
        drawWrappedText(text, marginLeft, 9.5, helvetica, darkGray, 12.5);
        currentY -= 4;
    }

    // =========================================================================
    addPage();

    currentPage.drawLine({ start: { x: marginLeft, y: pageHeight - 50 }, end: { x: pageWidth - marginRight, y: pageHeight - 50 }, thickness: 1.5, color: accentBlue });

    const header = 'SPECIFICATION — SIGIL PARAMETRIC GRAMMAR';
    const hw = helveticaBold.widthOfTextAtSize(header, 11);
    currentPage.drawText(header, { x: (pageWidth - hw) / 2, y: pageHeight - 70, size: 11, font: helveticaBold, color: accentBlue });

    const subtitle = 'DETERMINISTIC RENDERING PIPELINE, COMPOSABILITY RULES, AND';
    const subtitle2 = 'FAMILIARITY-BASED READABILITY SYSTEM FOR PHYSIOLOGICAL SIGILS (NON-LIMITING)';
    let sw = helveticaBold.widthOfTextAtSize(subtitle, 9);
    currentPage.drawText(subtitle, { x: (pageWidth - sw) / 2, y: pageHeight - 88, size: 9, font: helveticaBold, color: darkGray });
    sw = helveticaBold.widthOfTextAtSize(subtitle2, 9);
    currentPage.drawText(subtitle2, { x: (pageWidth - sw) / 2, y: pageHeight - 100, size: 9, font: helveticaBold, color: darkGray });

    currentPage.drawLine({ start: { x: marginLeft, y: pageHeight - 112 }, end: { x: pageWidth - marginRight, y: pageHeight - 112 }, thickness: 0.5, color: lightLine });
    currentY = pageHeight - 130;

    // --- A ---
    drawSectionHeader('A', 'Technical Field');
    drawParagraph(
        'This disclosure relates to abstract physiological data visualization systems and, more particularly, to a formal parametric grammar for constructing physiological Sigils from sensor-derived data, a deterministic rendering pipeline ensuring reproducible visual output, composability rules for combining and comparing Sigils, and a familiarity-based readability system enabling users to develop intuitive understanding of their Sigil representations over time. This disclosure supplements and extends Document 75 (Sensor-Derived Sigil — Abstract Physiological Visualization) with specific implementation architecture.'
    );

    // --- B ---
    drawSectionHeader('B', 'Relationship to Prior Disclosures (Non-Limiting)');
    drawParagraph(
        'Document 75 discloses the broad concept of sensor-derived abstract symbolic visualization (Sigils) including encoding physiological data into visual constructs. Document 76 discloses future-proof symbolic representation frameworks. The present disclosure extends these by specifying: (a) a formal parametric grammar defining the precise mapping between physiological parameters and visual elements; (b) a deterministic rendering pipeline guaranteeing identical visual output from identical input data across devices and software versions; (c) composability rules governing how Sigils may be combined, compared, overlaid, or decomposed; and (d) a familiarity-based readability system enabling progressive user comprehension.'
    );

    // --- C ---
    drawSectionHeader('C', 'Parametric Grammar — Definition (Non-Limiting)');
    drawParagraph(
        'In certain embodiments, a Sigil is constructed according to a formal parametric grammar that defines the mapping between physiological data parameters and visual elements. The grammar comprises the following components:'
    );
    drawNumberedItem(1, 'Parameter Vocabulary: A defined set of input parameters drawn from the multi-node signal abstraction layer, including but not limited to: health indices, trend indicators, confidence scores, dimensional alignment scores, temporal depth indicators, and zone-based summaries.');
    drawNumberedItem(2, 'Visual Element Vocabulary: A defined set of atomic visual elements that may be combined to construct a Sigil, including but not limited to: curves, radial forms, concentric rings, angular segments, gradient regions, particle fields, luminance values, hue mappings, opacity layers, and animation keyframes.');
    drawNumberedItem(3, 'Mapping Rules: Deterministic functions that map each input parameter to one or more visual element properties (e.g., a health index maps to radial extent, a trend indicator maps to curve direction, a confidence score maps to opacity).');
    drawNumberedItem(4, 'Composition Rules: Ordering and layering rules that define how multiple visual elements are assembled into a complete Sigil, including z-order precedence, blending modes, and spatial arrangement constraints.');
    drawNumberedItem(5, 'Constraint Rules: Boundary constraints ensuring that the resulting visual is always aesthetically coherent, screenshot-safe, and contains no explicit anatomical or physiological content recognizable by a naive observer.');

    // --- D ---
    drawSectionHeader('D', 'Parameter-to-Visual Mapping Examples (Non-Limiting)');
    drawParagraph(
        'In various embodiments, the parametric grammar defines mappings including, without limitation:'
    );
    drawBullet('Composite Health Index to Radial Luminance: Higher health indices produce brighter, more expansive radial forms; lower indices produce more compact, subdued forms');
    drawBullet('Trend Direction to Curve Trajectory: Improving trends produce ascending or expanding curves; declining trends produce descending or contracting curves; stable trends produce level symmetry');
    drawBullet('Confidence Level to Visual Clarity: High-confidence data produces sharp, well-defined visual elements; low-confidence data produces diffused, semi-transparent elements');
    drawBullet('Multi-Dimensional Data to Angular Segments: Each physiological dimension maps to an angular sector, with the radial extent of each sector representing the strength or magnitude of that dimension');
    drawBullet('Temporal Depth to Visual Complexity: Profiles with deeper longitudinal data produce more layered, detailed Sigils; newer profiles with less data produce simpler forms');
    drawBullet('Alignment Scores (Paired Sigils) to Symmetry and Interlock: Higher alignment between two users produces more symmetrical, interlocking paired Sigils; lower alignment produces independent, non-interlocking forms');

    // --- E ---
    drawSectionHeader('E', 'Deterministic Rendering Pipeline (Non-Limiting)');
    drawParagraph(
        'In various embodiments, the Sigil rendering pipeline is fully deterministic, ensuring that identical input data always produces an identical visual output regardless of rendering platform, device, or software version. The pipeline comprises:'
    );
    drawNumberedItem(1, 'Input Canonicalization: Input parameters are normalized to a canonical format with fixed precision, ordering, and range to eliminate platform-dependent floating-point variations.');
    drawNumberedItem(2, 'Grammar Evaluation: The parametric grammar is evaluated using the canonicalized input to produce a deterministic scene description comprising all visual elements and their properties.');
    drawNumberedItem(3, 'Layout Computation: Visual element positions, sizes, and relationships are computed using fixed-point arithmetic or platform-independent layout algorithms.');
    drawNumberedItem(4, 'Rendering Execution: The scene description is rendered to a visual output using a platform-abstracted rendering interface. The rendering interface produces bit-identical output for identical scene descriptions.');
    drawNumberedItem(5, 'Output Verification: An optional verification step computes a hash of the rendered output and compares it to an expected hash derived from the input data, confirming rendering fidelity.');
    drawParagraph(
        'Deterministic rendering ensures that a Sigil viewed on one device is visually identical to the same Sigil viewed on another device, supporting trust and recognition across platforms.'
    );

    // --- F ---
    drawSectionHeader('F', 'Composability Rules (Non-Limiting)');
    drawParagraph(
        'In certain embodiments, the Sigil system supports composability through the following operations:'
    );
    drawNumberedItem(1, 'Overlay: Two Sigils may be overlaid to produce a composite view showing both users\' representations in a single visual, using transparency and blending to maintain individual readability.');
    drawNumberedItem(2, 'Side-by-Side Comparison: Two Sigils may be rendered adjacently with alignment guides highlighting per-dimension similarities and differences.');
    drawNumberedItem(3, 'Temporal Stacking: Multiple temporal versions of a single user\'s Sigil may be stacked or animated to visualize evolution over time.');
    drawNumberedItem(4, 'Dimensional Decomposition: A composite Sigil may be decomposed into per-dimension sub-Sigils, each representing a single physiological domain in isolation.');
    drawNumberedItem(5, 'Paired Sigil Generation: When two users consent to a compatibility view, a unique paired Sigil is generated that represents the alignment characteristics of the pair, distinct from either individual Sigil.');
    drawNumberedItem(6, 'Difference Visualization: The differences between two Sigils (either the same user over time or two different users) may be rendered as a delta Sigil highlighting regions of change or divergence.');

    // --- G ---
    drawSectionHeader('G', 'Familiarity-Based Readability System (Non-Limiting)');
    drawParagraph(
        'In certain embodiments, the Sigil system is designed so that users develop intuitive understanding of their Sigil representation over time without requiring explicit labels, legends, or numeric overlays. The readability system comprises:'
    );
    drawNumberedItem(1, 'Consistency: A user\'s Sigil maintains consistent visual language over time. The same parameters always map to the same visual elements, building recognition through repetition.');
    drawNumberedItem(2, 'Gradual Change: When physiological parameters change, the Sigil evolves gradually rather than abruptly, allowing users to perceive and interpret changes naturally.');
    drawNumberedItem(3, 'Contextual Hints: Optional, dismissible contextual hints may be shown during early use to help users learn which visual elements correspond to which general categories (e.g., "this region reflects your activity patterns"). Hints are progressively withdrawn as usage time increases.');
    drawNumberedItem(4, 'Interaction-Based Exploration: Users may tap, hover, or focus on Sigil regions to reveal brief, abstract descriptions of what that region represents, without ever displaying raw numeric values.');
    drawNumberedItem(5, 'Temporal Comparison Tools: Users may compare their current Sigil to previous versions using overlay or animation, building understanding of how changes in their wellbeing manifest as visual changes.');

    // --- H ---
    drawSectionHeader('H', 'Nexalis Lumen — Temporal Vitality Symbol (Non-Limiting)');
    drawParagraph(
        'In certain embodiments, the system includes a specialized Sigil variant called "Lumen" that represents a user\'s aggregate physiological vitality as a single evolving visual symbol. The Lumen is distinguished from general Sigils by the following characteristics:'
    );
    drawBullet('Singular Focus: The Lumen represents an overall vitality composite rather than multi-dimensional detail');
    drawBullet('Temporal Evolution: The Lumen\'s appearance changes incrementally as the user\'s longitudinal baseline shifts, serving as a living indicator of physiological trajectory');
    drawBullet('Emotional Resonance: The Lumen is designed to evoke an emotional connection, using warm luminance, organic forms, and subtle animation to create a sense of personal identity');
    drawBullet('Screenshot Safety: The Lumen contains no identifiable information and may be shared publicly without privacy risk');
    drawBullet('Deterministic Generation: The Lumen is generated from the same deterministic rendering pipeline as other Sigils, ensuring consistency across devices');

    // --- I ---
    drawSectionHeader('I', 'Exemplary Claim-Like Statements (Non-Limiting)');
    drawParagraph(
        'A provisional application does not require claims. The following statements are illustrative only and do not limit the disclosure.'
    );

    drawNumberedItem(1, 'A system comprising: a) a parametric grammar defining deterministic mappings between physiological data parameters and visual elements; b) a rendering pipeline configured to produce a visual Sigil from the parametric grammar evaluation, wherein the pipeline is fully deterministic such that identical input data produces identical visual output across devices; and c) a display module configured to render the Sigil without explicit anatomical imagery, numeric values, or identifiable physiological content.');

    drawNumberedItem(2, 'The system of statement 1, wherein the parametric grammar comprises a parameter vocabulary, a visual element vocabulary, deterministic mapping rules, composition rules, and constraint rules ensuring visual coherence and screenshot safety.');

    drawNumberedItem(3, 'The system of statement 1, further comprising composability operations including overlay, side-by-side comparison, temporal stacking, dimensional decomposition, paired Sigil generation, and difference visualization.');

    drawNumberedItem(4, 'The system of statement 1, further comprising a familiarity-based readability system configured to enable users to develop intuitive understanding of their Sigil through consistent visual language, gradual change, progressive contextual hints, and interaction-based exploration.');

    drawNumberedItem(5, 'The system of statement 1, further comprising a Lumen module configured to generate a singular temporal vitality symbol representing aggregate physiological trajectory as an evolving visual form.');

    drawNumberedItem(6, 'A method comprising: a) receiving abstracted physiological data parameters from a signal abstraction layer; b) canonicalizing the parameters to a fixed-precision format; c) evaluating a parametric grammar to produce a deterministic scene description; d) rendering the scene description to produce a visual Sigil that is bit-identical across rendering platforms; and e) optionally verifying rendering fidelity by comparing a hash of the rendered output to an expected hash.');

    drawNumberedItem(7, 'The method of statement 6, further comprising generating a paired Sigil from two users\' consented alignment data, wherein the paired Sigil represents compatibility characteristics without exposing either user\'s individual physiological data.');

    drawNumberedItem(8, 'The method of statement 6, further comprising generating a temporal Lumen representation by mapping aggregated longitudinal health trajectory data to an evolving singular visual symbol.');

    drawFooter();

    const pdfBytes = await doc.save();
    const outPath = path.join('C:\\Users\\zSixt\\Desktop\\patent pdfs', '81_Sigil_Parametric_Grammar_Rendering.pdf');
    fs.writeFileSync(outPath, pdfBytes);
    console.log(`Created: ${outPath}`);
    console.log(`Size: ${(pdfBytes.length / 1024).toFixed(1)} KB`);
    console.log(`Pages: ${doc.getPageCount()}`);
}

createPatent81().catch(console.error);
