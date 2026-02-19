const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createPatent79() {
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
        return currentPage;
    }

    function drawFooter() {
        const footerText = `Document 79  —  Page ${pageNum}`;
        const w = helveticaOblique.widthOfTextAtSize(footerText, 8);
        currentPage.drawText(footerText, { x: (pageWidth - w) / 2, y: 30, size: 8, font: helveticaOblique, color: medGray });
    }

    function wrapText(text, font, fontSize, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let cur = '';
        for (const word of words) {
            const test = cur ? cur + ' ' + word : word;
            if (font.widthOfTextAtSize(test, fontSize) > maxWidth && cur) {
                lines.push(cur);
                cur = word;
            } else { cur = test; }
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

    const header = 'SPECIFICATION — NEXALIS CONNECT & VOW';
    const hw = helveticaBold.widthOfTextAtSize(header, 11);
    currentPage.drawText(header, { x: (pageWidth - hw) / 2, y: pageHeight - 70, size: 11, font: helveticaBold, color: accentBlue });

    const subtitle = 'ALIGNMENT-BASED PHYSIOLOGICAL MATCHING SYSTEM AND CERTIFIED';
    const subtitle2 = 'BIOLOGICAL RESONANCE DESIGNATION (NON-LIMITING)';
    let sw = helveticaBold.widthOfTextAtSize(subtitle, 9);
    currentPage.drawText(subtitle, { x: (pageWidth - sw) / 2, y: pageHeight - 88, size: 9, font: helveticaBold, color: darkGray });
    sw = helveticaBold.widthOfTextAtSize(subtitle2, 9);
    currentPage.drawText(subtitle2, { x: (pageWidth - sw) / 2, y: pageHeight - 100, size: 9, font: helveticaBold, color: darkGray });

    currentPage.drawLine({ start: { x: marginLeft, y: pageHeight - 112 }, end: { x: pageWidth - marginRight, y: pageHeight - 112 }, thickness: 0.5, color: lightLine });
    currentY = pageHeight - 130;

    // --- A ---
    drawSectionHeader('A', 'Technical Field');
    drawParagraph(
        'This disclosure relates to physiological compatibility matching systems and, more particularly, to an alignment-based matching engine ("Nexalis Connect") that generates compatibility recommendations from multi-node physiological profile data, and to a certified alignment designation ("Vow") awarded when two users\' Harmony Profiles demonstrate sustained, threshold-exceeding biological resonance alignment.'
    );

    // --- B ---
    drawSectionHeader('B', 'Background and Motivation (Non-Limiting)');
    drawParagraph(
        'Existing matching and compatibility systems in relationship platforms rely exclusively on subjective self-reported preferences, behavioral signals (e.g., swipe patterns), or questionnaire-derived personality metrics. No known system provides matching recommendations based on objective, device-derived physiological compatibility data. Nexalis Connect addresses this gap by introducing alignment intelligence: matching driven by multi-dimensional physiological resonance patterns rather than subjective preference expression. The Vow designation further introduces a novel concept of certified physiological compatibility based on sustained measurement rather than self-declaration.'
    );

    // --- C ---
    drawSectionHeader('C', 'Nexalis Connect Overview (Non-Limiting)');
    drawParagraph(
        'In certain embodiments, Nexalis Connect is a matching and recommendation engine that operates on Harmony Profiles (as described in Document 78) to identify, score, and present potential compatibility matches. The system operates according to the following principles:'
    );
    drawNumberedItem(1, 'Alignment Intelligence: Matching is driven by multi-dimensional physiological alignment scores derived from cross-architecture correlation (as described in Document 77), not by subjective preferences or self-reported characteristics.');
    drawNumberedItem(2, 'Consent-First Architecture: No comparison is performed until both users have explicitly consented. Users opt into matching and may revoke consent at any time.');
    drawNumberedItem(3, 'Progressive Comparison: Initial matching provides only high-level compatibility indicators. Deeper comparison requires escalating mutual consent from both users.');
    drawNumberedItem(4, 'Privacy Preservation: The matching engine operates exclusively on abstracted Harmony Profile data. Neither user\'s raw physiological measurements are ever exposed to the other user or to the matching system.');
    drawNumberedItem(5, 'Objective Foundation: Unlike existing matching systems, Nexalis Connect provides an objective physiological basis for compatibility assessment, independent of and complementary to subjective preferences.');

    // --- D ---
    drawSectionHeader('D', 'Matching Workflow and Consent Architecture (Non-Limiting)');
    drawParagraph(
        'In various embodiments, the Nexalis Connect matching workflow proceeds through the following consent-gated stages:'
    );
    drawNumberedItem(1, 'Discovery Opt-In: A user enables their Harmony Profile for discovery within the Nexalis Connect ecosystem. The user selects a disclosure level (as defined in Document 78, Section F) that governs what profile information is available for initial matching.');
    drawNumberedItem(2, 'Candidate Identification: The system identifies potential matches by computing lightweight alignment indicators between opted-in profiles. These indicators use only the information available at each user\'s selected disclosure level.');
    drawNumberedItem(3, 'Mutual Interest Signal: When two users express mutual interest in a candidate match (e.g., both "accept" the presented match), the system proceeds to a more detailed comparison.');
    drawNumberedItem(4, 'Consent-First Handshake: Before any deeper comparison is performed, both users must explicitly consent to the specific comparison level. The system presents a clear description of what information will be analyzed and what results will be shared.');
    drawNumberedItem(5, 'Progressive Depth: Each successive level of comparison requires a new mutual consent exchange. Users may stop at any level without obligation to proceed further.');
    drawNumberedItem(6, 'Result Delivery: Comparison results are delivered as abstract alignment scores, symbolic representations, or categorical descriptions. No raw profile data is exchanged between users.');

    // --- E ---
    drawSectionHeader('E', 'Alignment Intelligence Engine (Non-Limiting)');
    drawParagraph(
        'In certain embodiments, the Alignment Intelligence Engine within Nexalis Connect performs the following analyses:'
    );
    drawBullet('Multi-Dimensional Compatibility Scoring: Computing alignment across multiple physiological dimensions (e.g., timing patterns, intensity profiles, rhythm characteristics, response dynamics) and generating per-dimension and composite scores');
    drawBullet('Complementarity Detection: Identifying not only similarity but also complementary patterns where two users\' physiological characteristics are reciprocally compatible');
    drawBullet('Temporal Compatibility: Analyzing whether two users\' longitudinal trends are convergent, stable, or divergent to assess long-term compatibility trajectory');
    drawBullet('Context-Adjusted Matching: Conditioning compatibility scores on systemic context data (cardiovascular state, sleep patterns, activity levels) to reduce noise from transient physiological states');
    drawBullet('Confidence Weighting: Weighting match quality by the depth and reliability of each user\'s profile data, with higher-confidence profiles receiving proportionally more weight in scoring');

    // --- F ---
    drawSectionHeader('F', 'Match Presentation and Abstraction (Non-Limiting)');
    drawParagraph(
        'In various embodiments, match results are presented through one or more of the following abstract formats:'
    );
    drawBullet('Composite Alignment Index: A single numerical or categorical indicator of overall compatibility');
    drawBullet('Dimensional Radar: A multi-axis representation showing per-dimension alignment without revealing underlying values');
    drawBullet('Symbolic Match Visual: A composite Sigil or abstract visual generated from the alignment characteristics of the pair');
    drawBullet('Compatibility Narrative: A brief, system-generated abstract description of the alignment characteristics in non-explicit, non-anatomical language');
    drawBullet('Trend Indicator: A directional indicator showing whether alignment between the pair is predicted to be stable, improving, or uncertain based on available longitudinal data');
    drawParagraph(
        'All match presentations are designed to be screenshot-safe and contain no individually identifiable physiological information.'
    );

    // --- G ---
    drawSectionHeader('G', 'Vow Designation — Certified Biological Resonance Alignment (Non-Limiting)');
    drawParagraph(
        'In certain embodiments, the system includes a formal designation called "Vow" that represents the highest measured level of physiological resonance alignment between two users. The Vow designation is distinguished from ordinary matching by the following characteristics:'
    );
    drawNumberedItem(1, 'Threshold-Based Certification: Vow is awarded only when composite alignment scores across multiple physiological dimensions exceed defined threshold criteria. The thresholds are set to represent statistically exceptional alignment relative to the broader user base.');
    drawNumberedItem(2, 'Multi-Dimensional Requirement: Vow requires threshold-exceeding alignment across a minimum number of physiological dimensions, not merely a single high score. This ensures that the designation reflects broad, multi-faceted compatibility.');
    drawNumberedItem(3, 'Longitudinal Verification: Vow is not awarded based on a single measurement session. The system requires sustained alignment above threshold levels across multiple temporal windows (e.g., weeks or months) to confirm that alignment is stable rather than transient.');
    drawNumberedItem(4, 'Mutual Verification: Both users must independently demonstrate profile consistency and stability over time. Vow is not awarded if either user\'s profile shows high variability or insufficient temporal depth.');
    drawNumberedItem(5, 'Symbolic Certification: The Vow designation is represented symbolically (e.g., a unique paired Sigil, a combined Lumen representation, or a certification badge) and does not expose the specific alignment scores or physiological dimensions that contributed to the designation.');
    drawNumberedItem(6, 'Revocability: The Vow designation may be revoked if subsequent data indicates that alignment has fallen below threshold levels for a sustained period, or if either user withdraws consent.');

    // --- H ---
    drawSectionHeader('H', 'Vow Lifecycle and Renewal (Non-Limiting)');
    drawParagraph(
        'In various embodiments, the Vow designation follows a defined lifecycle:'
    );
    drawBullet('Candidate Phase: The system identifies that a pair\'s alignment scores are approaching Vow thresholds and may notify both users (with consent) that Vow candidacy is emerging');
    drawBullet('Qualification Period: Both users must maintain threshold-exceeding alignment for a defined minimum duration while continuing to generate sensing data');
    drawBullet('Award: Upon meeting all multi-dimensional, longitudinal, and mutual verification criteria, the Vow designation is formally awarded');
    drawBullet('Maintenance: Ongoing sensing data is monitored to confirm sustained alignment. Minor fluctuations do not immediately affect the designation');
    drawBullet('Review: If alignment scores fall below maintenance thresholds for a sustained period, the designation enters review status');
    drawBullet('Renewal or Revocation: After review, the designation is either renewed (if alignment recovers) or revoked (if alignment remains below threshold)');

    // --- I ---
    drawSectionHeader('I', 'Privacy and Ethical Safeguards (Non-Limiting)');
    drawParagraph(
        'In various embodiments, Nexalis Connect and the Vow designation enforce the following privacy and ethical safeguards:'
    );
    drawBullet('No Ranking or Public Scoring: Users are never publicly ranked by compatibility. Match results are private between the matched pair.');
    drawBullet('No Pressure Mechanisms: The system does not create urgency, scarcity, or social pressure to participate in matching or pursue Vow designation.');
    drawBullet('Withdrawal Without Penalty: Either user may withdraw from matching, comparison, or Vow tracking at any time without penalty or data retention.');
    drawBullet('No Third-Party Data Sale: Matching results, alignment scores, and Vow status are never sold or provided to third parties for advertising, profiling, or any purpose outside the user\'s explicit consent.');
    drawBullet('Bias Monitoring: The matching system is designed to avoid reinforcing biases based on demographics, self-reported preferences, or historical matching patterns. Matching operates exclusively on objective physiological data.');

    // --- J ---
    drawSectionHeader('J', 'Exemplary Claim-Like Statements (Non-Limiting)');
    drawParagraph(
        'A provisional application does not require claims. The following statements are illustrative only and do not limit the disclosure.'
    );

    drawNumberedItem(1, 'A system comprising: a) a matching engine configured to receive Harmony Profiles from two or more users and compute multi-dimensional physiological alignment scores; b) a consent management module configured to enforce mutual consent at each comparison level; and c) an abstract result presentation module configured to output compatibility results as symbolic representations, categorical indicators, or composite indices; wherein the matching engine operates exclusively on abstracted pattern signatures and no raw physiological data is exchanged between users or exposed to the matching system.');

    drawNumberedItem(2, 'The system of statement 1, wherein the matching engine supports progressive comparison depth requiring escalating mutual consent from both users at each successive level.');

    drawNumberedItem(3, 'The system of statement 1, further comprising a complementarity detection module configured to identify reciprocally compatible physiological patterns between two users.');

    drawNumberedItem(4, 'The system of statement 1, further comprising a certified alignment designation module configured to award a Vow designation when composite alignment scores between two users exceed defined thresholds across a minimum number of physiological dimensions for a sustained temporal period.');

    drawNumberedItem(5, 'The system of statement 4, wherein the Vow designation requires longitudinal verification across multiple temporal windows and mutual profile consistency from both users.');

    drawNumberedItem(6, 'The system of statement 4, wherein the Vow designation follows a defined lifecycle comprising candidacy detection, qualification period, award, maintenance monitoring, and review with potential renewal or revocation.');

    drawNumberedItem(7, 'A method comprising: a) receiving mutual consent from two users to perform a physiological compatibility comparison; b) computing multi-dimensional alignment scores from the users\' respective Harmony Profiles; c) presenting compatibility results in an abstract format containing no individually identifiable physiological information; and d) optionally, tracking alignment scores over time and awarding a certified alignment designation when sustained threshold-exceeding alignment is verified across multiple physiological dimensions.');

    drawNumberedItem(8, 'The method of statement 7, wherein compatibility results include a temporal trend indicator based on longitudinal alignment data and a confidence weighting based on profile depth and reliability.');

    drawFooter();

    const pdfBytes = await doc.save();
    const outPath = path.join('C:\\Users\\zSixt\\Desktop\\patent pdfs', '79_Nexalis_Connect_Vow_Alignment_Matching.pdf');
    fs.writeFileSync(outPath, pdfBytes);
    console.log(`Created: ${outPath}`);
    console.log(`Size: ${(pdfBytes.length / 1024).toFixed(1)} KB`);
    console.log(`Pages: ${doc.getPageCount()}`);
}

createPatent79().catch(console.error);
