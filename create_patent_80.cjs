const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createPatent80() {
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
        const footerText = `Document 80  —  Page ${pageNum}`;
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

    const header = 'SPECIFICATION — INTELLIGENCE ENGINES';
    const hw = helveticaBold.widthOfTextAtSize(header, 11);
    currentPage.drawText(header, { x: (pageWidth - hw) / 2, y: pageHeight - 70, size: 11, font: helveticaBold, color: accentBlue });

    const subtitle = 'HEALTH INTELLIGENCE ENGINE AND COMPATIBILITY INTELLIGENCE ENGINE:';
    const subtitle2 = 'UNIFIED SOFTWARE ARCHITECTURE FOR LONGITUDINAL ANALYSIS (NON-LIMITING)';
    let sw = helveticaBold.widthOfTextAtSize(subtitle, 9);
    currentPage.drawText(subtitle, { x: (pageWidth - sw) / 2, y: pageHeight - 88, size: 9, font: helveticaBold, color: darkGray });
    sw = helveticaBold.widthOfTextAtSize(subtitle2, 9);
    currentPage.drawText(subtitle2, { x: (pageWidth - sw) / 2, y: pageHeight - 100, size: 9, font: helveticaBold, color: darkGray });

    currentPage.drawLine({ start: { x: marginLeft, y: pageHeight - 112 }, end: { x: pageWidth - marginRight, y: pageHeight - 112 }, thickness: 0.5, color: lightLine });
    currentY = pageHeight - 130;

    // --- A ---
    drawSectionHeader('A', 'Technical Field');
    drawParagraph(
        'This disclosure relates to physiological data intelligence systems and, more particularly, to a unified software architecture comprising two specialized engines: (1) a Health Intelligence Engine configured to translate multi-node sensor data into longitudinal health markers with dual consumer and clinician output modes, and (2) a Compatibility Intelligence Engine configured to perform cross-user physiological pattern analysis for compatibility assessment. Both engines share a common layered architecture extending from hardware nodes through signal abstraction to display.'
    );

    // --- B ---
    drawSectionHeader('B', 'Background and Motivation (Non-Limiting)');
    drawParagraph(
        'Existing health monitoring platforms typically process sensor data in isolation per device, output simple threshold-based alerts, and lack the ability to synthesize data across multiple sensing modalities into unified health intelligence. No known system provides: (a) a unified intelligence architecture that synthesizes intimate physiology data from multiple sensing nodes into longitudinal health markers with both consumer-facing and clinician-facing outputs; or (b) a separate but architecturally parallel engine for analyzing physiological pattern alignment between two users. The disclosed intelligence engines address these gaps through a shared layered architecture with specialized processing pipelines.'
    );

    // --- C ---
    drawSectionHeader('C', 'Layered System Architecture (Non-Limiting)');
    drawParagraph(
        'In various embodiments, both intelligence engines operate within a four-layer architecture:'
    );
    drawNumberedItem(1, 'Hardware Node Layer: Physical sensing devices (Nodes 1 through 5) acquire raw physiological signals including pressure, strain, impedance, optical, thermal, inertial, and distance measurements.');
    drawNumberedItem(2, 'Signal Abstraction Layer: Per-node data processing pipelines apply quality gating, artifact rejection, validity windowing, and normalization to produce abstracted indices, zones, trends, and confidence indicators. Raw sensor data does not pass beyond this layer.');
    drawNumberedItem(3, 'Intelligence Engine Layer: The Health Intelligence Engine and Compatibility Intelligence Engine receive abstracted data from the Signal Abstraction Layer and perform higher-order analysis including pattern recognition, longitudinal tracking, cross-node synthesis, and (in the case of the Compatibility Engine) cross-user correlation.');
    drawNumberedItem(4, 'Display and Output Layer: Intelligence engine outputs are rendered for the end user through privacy-preserving visual formats including Sigils, abstract charts, trend indicators, and narrative summaries. This layer also supports data export to clinician interfaces.');
    drawParagraph(
        'This layered architecture ensures separation of concerns, allows each layer to evolve independently, and enforces privacy by preventing raw data from reaching upper layers.'
    );

    // --- D ---
    drawSectionHeader('D', 'Health Intelligence Engine — Overview (Non-Limiting)');
    drawParagraph(
        'In certain embodiments, the Health Intelligence Engine is a software module that receives abstracted data from one or more sensing nodes associated with a single user and produces longitudinal health markers. The engine is configured to support two distinct output modes:'
    );
    drawNumberedItem(1, 'Consumer Mode: Outputs simplified, privacy-preserving health indicators designed for end-user consumption. Consumer mode uses abstract representations (Sigils, trend arrows, categorical labels) and avoids explicit clinical terminology, raw numeric values, or anatomical imagery.');
    drawNumberedItem(2, 'Clinician Mode: Outputs detailed, structured clinical-grade data suitable for review by healthcare professionals. Clinician mode provides quantitative indices, temporal plots, confidence intervals, and recommended assessment categories. Clinician mode is only activated with explicit user consent and may be shared with a designated provider.');

    // --- E ---
    drawSectionHeader('E', 'Health Intelligence Engine — Functional Capabilities (Non-Limiting)');
    drawParagraph(
        'In various embodiments, the Health Intelligence Engine performs the following analyses:'
    );
    drawBullet('Dual-Track Processing: The engine supports processing pipelines tailored to masculine and feminine physiological architectures. Each track applies architecture-specific normalization, baseline computation, and pattern recognition while producing comparable output formats.');
    drawBullet('Cross-Node Synthesis: Data from multiple nodes (e.g., Node 1 rigidity dynamics combined with Node 5 cardiovascular context) is fused to produce composite health markers that neither node could generate alone.');
    drawBullet('Early Signal Detection: Subtle pattern changes that precede clinically detectable symptoms are identified through longitudinal trend analysis, baseline drift monitoring, and statistical anomaly detection.');
    drawBullet('Recovery Tracking: Following health interventions, lifestyle changes, or treatment programs, the engine maps physiological recovery trajectories and compares them to pre-intervention baselines.');
    drawBullet('Longitudinal Baseline Management: The engine maintains and continuously refines personal baselines for each user, enabling detection of meaningful deviations from individual norms rather than population averages.');
    drawBullet('Contextual Interpretation: Health markers are conditioned on systemic context data (sleep quality, cardiovascular load, activity levels) from Node 5 to reduce false positives and improve interpretation accuracy.');

    // --- F ---
    drawSectionHeader('F', 'Health Intelligence Engine — Output Formats (Non-Limiting)');
    drawParagraph(
        'In certain embodiments, the Health Intelligence Engine produces outputs in the following formats:'
    );
    drawBullet('Health Indices: Composite numerical indices representing aggregate health status across one or more physiological domains (e.g., vascular health index, tissue integrity index, pelvic function index)');
    drawBullet('Trend Indicators: Directional indicators (improving, stable, declining) computed from longitudinal baseline comparisons');
    drawBullet('Confidence Scores: Per-metric confidence indicators reflecting data quality, temporal depth, and measurement consistency');
    drawBullet('Alert Flags: Threshold-based flags indicating when a health marker has deviated significantly from personal baseline');
    drawBullet('Sigil Representations: Abstract visual encodings of health status suitable for consumer display (see Document 75)');
    drawBullet('Clinician Reports: Structured data exports in standard health informatics formats suitable for integration with electronic health records or clinical decision support systems');

    // --- G ---
    drawSectionHeader('G', 'Compatibility Intelligence Engine — Overview (Non-Limiting)');
    drawParagraph(
        'In certain embodiments, the Compatibility Intelligence Engine is a software module architecturally parallel to the Health Intelligence Engine but configured for cross-user analysis. It receives abstracted data from two users\' node ecosystems (via Harmony Profiles) and performs pattern alignment analysis. The Compatibility Intelligence Engine is distinct from the Health Intelligence Engine in the following ways:'
    );
    drawBullet('Input Scope: The Health Engine analyzes one user\'s data; the Compatibility Engine analyzes two users\' data simultaneously');
    drawBullet('Analysis Type: The Health Engine identifies health patterns and anomalies; the Compatibility Engine identifies alignment, complementarity, and resonance patterns between two users');
    drawBullet('Output Purpose: The Health Engine outputs health markers; the Compatibility Engine outputs alignment scores and compatibility indicators');
    drawBullet('Privacy Model: The Compatibility Engine enforces mutual consent gating and ensures that neither user\'s underlying data is exposed to the other');

    // --- H ---
    drawSectionHeader('H', 'Compatibility Intelligence Engine — Functional Capabilities (Non-Limiting)');
    drawParagraph(
        'In various embodiments, the Compatibility Intelligence Engine performs the following analyses:'
    );
    drawNumberedItem(1, 'Cross-Architecture Pattern Mapping: Projecting abstracted physiological patterns from different body architectures into a common analytical space where meaningful comparison is possible.');
    drawNumberedItem(2, 'Temporal Co-Evolution Analysis: Tracking how two users\' physiological patterns evolve in relation to each other over time, identifying convergent or divergent trends.');
    drawNumberedItem(3, 'Reciprocal Response Detection: Identifying physiological response patterns in one user that correlate with or complement patterns in the other user during shared temporal windows.');
    drawNumberedItem(4, 'Multi-Dimensional Alignment Scoring: Computing alignment across multiple independent physiological dimensions and generating both per-dimension and composite scores.');
    drawNumberedItem(5, 'Stability Analysis: Assessing whether observed alignment patterns are stable over time or represent transient correlations.');
    drawNumberedItem(6, 'Confidence and Coverage Assessment: Evaluating the reliability of compatibility assessments based on the quality, depth, and completeness of both users\' profile data.');

    // --- I ---
    drawSectionHeader('I', 'Shared Infrastructure and Interoperability (Non-Limiting)');
    drawParagraph(
        'In various embodiments, the Health Intelligence Engine and Compatibility Intelligence Engine share the following infrastructure:'
    );
    drawBullet('Common Signal Abstraction Layer: Both engines consume the same abstracted data format from the per-node processing pipelines');
    drawBullet('Shared Baseline Management: Personal baselines computed by the Health Engine may be referenced by the Compatibility Engine for normalization');
    drawBullet('Common Visualization Framework: Both engines output to the same Sigil and abstract visualization rendering system');
    drawBullet('Unified Privacy Enforcement: Both engines enforce the same encryption, abstraction, and consent policies');
    drawBullet('Extensible Plugin Architecture: Both engines support modular analytical plugins that can be added or updated independently of the core engine');

    // --- J ---
    drawSectionHeader('J', 'Exemplary Claim-Like Statements (Non-Limiting)');
    drawParagraph(
        'A provisional application does not require claims. The following statements are illustrative only and do not limit the disclosure.'
    );

    drawNumberedItem(1, 'A system comprising: a) a signal abstraction layer configured to receive raw sensor data from one or more physiological sensing nodes and output abstracted indices, zones, trends, and confidence indicators; b) a health intelligence engine configured to receive abstracted data from the signal abstraction layer and produce longitudinal health markers for a single user; and c) a display layer configured to render health markers in privacy-preserving visual formats; wherein the health intelligence engine supports dual output modes comprising a consumer mode using abstract representations and a clinician mode using quantitative clinical-grade data.');

    drawNumberedItem(2, 'The system of statement 1, wherein the health intelligence engine supports dual-track processing for masculine and feminine physiological architectures, each track applying architecture-specific normalization and pattern recognition while producing comparable output formats.');

    drawNumberedItem(3, 'The system of statement 1, wherein the health intelligence engine performs early signal detection by identifying subtle pattern changes through longitudinal trend analysis and baseline drift monitoring before clinically detectable symptoms manifest.');

    drawNumberedItem(4, 'The system of statement 1, further comprising a compatibility intelligence engine architecturally parallel to the health intelligence engine and configured to receive abstracted data from two users\' node ecosystems and produce cross-user alignment scores and compatibility indicators.');

    drawNumberedItem(5, 'The system of statement 4, wherein the compatibility intelligence engine performs cross-architecture pattern mapping by projecting abstracted physiological patterns from different body architectures into a common analytical space.');

    drawNumberedItem(6, 'The system of statement 4, wherein the compatibility intelligence engine performs temporal co-evolution analysis tracking how two users\' physiological patterns evolve in relation to each other over longitudinal time windows.');

    drawNumberedItem(7, 'A method comprising: a) receiving abstracted physiological data from a multi-node sensing ecosystem; b) computing longitudinal health markers comprising health indices, trend indicators, and confidence scores; c) rendering health markers in a consumer mode using abstract symbolic representations; and d) optionally rendering health markers in a clinician mode using quantitative data formats suitable for clinical review; wherein raw sensor data does not pass beyond the signal abstraction layer.');

    drawNumberedItem(8, 'The method of statement 7, further comprising: e) receiving abstracted physiological data from a second user\'s multi-node sensing ecosystem; f) computing cross-user alignment scores across multiple physiological dimensions; and g) outputting compatibility indicators using privacy-preserving abstract formats without exposing either user\'s underlying data.');

    drawFooter();

    const pdfBytes = await doc.save();
    const outPath = path.join('C:\\Users\\zSixt\\Desktop\\patent pdfs', '80_Health_Compatibility_Intelligence_Engines.pdf');
    fs.writeFileSync(outPath, pdfBytes);
    console.log(`Created: ${outPath}`);
    console.log(`Size: ${(pdfBytes.length / 1024).toFixed(1)} KB`);
    console.log(`Pages: ${doc.getPageCount()}`);
}

createPatent80().catch(console.error);
