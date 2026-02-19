const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createPatent83() {
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
        const footerText = `Document 83  —  Page ${pageNum}`;
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

    const header = 'SPECIFICATION — AI COMPANION & SHARED INTELLIGENCE';
    const hw = helveticaBold.widthOfTextAtSize(header, 11);
    currentPage.drawText(header, { x: (pageWidth - hw) / 2, y: pageHeight - 70, size: 11, font: helveticaBold, color: accentBlue });

    const subtitle = 'PRIVACY-PRESERVING CONVERSATIONAL INTELLIGENCE LAYER FOR';
    const subtitle2 = 'MULTI-NODE PHYSIOLOGICAL DATA SYNTHESIS AND PARTNER INSIGHTS (NON-LIMITING)';
    let sw = helveticaBold.widthOfTextAtSize(subtitle, 9);
    currentPage.drawText(subtitle, { x: (pageWidth - sw) / 2, y: pageHeight - 88, size: 9, font: helveticaBold, color: darkGray });
    sw = helveticaBold.widthOfTextAtSize(subtitle2, 9);
    currentPage.drawText(subtitle2, { x: (pageWidth - sw) / 2, y: pageHeight - 100, size: 9, font: helveticaBold, color: darkGray });

    currentPage.drawLine({ start: { x: marginLeft, y: pageHeight - 112 }, end: { x: pageWidth - marginRight, y: pageHeight - 112 }, thickness: 0.5, color: lightLine });
    currentY = pageHeight - 130;

    // --- A ---
    drawSectionHeader('A', 'Technical Field');
    drawParagraph(
        'This disclosure relates to conversational artificial intelligence systems for physiological data interpretation and, more particularly, to a privacy-preserving AI companion layer configured to synthesize multi-node sensing data into personalized conversational health insights, support shared intelligence delivery between consenting partners, and maintain longitudinal context awareness across interaction sessions without exposing raw physiological data or explicit anatomical information.'
    );

    // --- B ---
    drawSectionHeader('B', 'Background and Motivation (Non-Limiting)');
    drawParagraph(
        'Existing health monitoring applications typically present data through static dashboards, numeric displays, and threshold-based alerts. These formats require users to interpret complex physiological data independently, often leading to disengagement, misinterpretation, or anxiety. No known system provides a conversational AI companion that: (a) synthesizes multi-modal intimate physiology data from multiple sensing nodes into natural-language insights; (b) maintains longitudinal context awareness to reference and compare historical patterns; (c) operates under strict privacy constraints ensuring that conversational outputs never reveal raw data; or (d) delivers coordinated insights to two consenting partners simultaneously while preserving individual privacy boundaries.'
    );

    // --- C ---
    drawSectionHeader('C', 'AI Companion Architecture (Non-Limiting)');
    drawParagraph(
        'In certain embodiments, the AI Companion is a software layer that sits atop the Intelligence Engine Layer (as described in Document 80) and provides a conversational interface for accessing physiological insights. The architecture comprises:'
    );
    drawNumberedItem(1, 'Data Synthesis Module: Receives abstracted health markers, trend indicators, and confidence scores from the Health Intelligence Engine and transforms them into structured insight representations suitable for natural-language generation.');
    drawNumberedItem(2, 'Conversational Engine: A natural-language processing and generation module configured to produce human-readable insights, answer user queries about their health patterns, and provide contextually appropriate guidance. The engine may use large language models, rule-based generation, template-based synthesis, or hybrid approaches.');
    drawNumberedItem(3, 'Longitudinal Context Store: An encrypted, user-controlled memory system that maintains interaction history, previously discussed patterns, user-acknowledged insights, and temporal references. This enables the companion to say, for example, "your pattern has improved compared to what we discussed three weeks ago."');
    drawNumberedItem(4, 'Privacy Filter: A mandatory pre-output filtering layer that scans all generated text to ensure it contains no raw numeric values, explicit anatomical references, identifiable physiological measurements, or content that would violate the system\'s privacy-by-design principles.');
    drawNumberedItem(5, 'Abstraction Translator: A module that converts clinical-grade health markers into everyday language appropriate for consumer understanding, using analogies, metaphors, and contextual framing rather than medical terminology.');

    // --- D ---
    drawSectionHeader('D', 'Single-User Conversational Capabilities (Non-Limiting)');
    drawParagraph(
        'In various embodiments, the AI Companion provides the following capabilities for individual users:'
    );
    drawBullet('Proactive Insights: The companion surfaces notable patterns, trends, or changes without being asked, using push notifications or in-app messages (e.g., "your recovery pattern this week looks stronger than your recent baseline")');
    drawBullet('Query Response: Users may ask natural-language questions about their health data and receive contextual answers (e.g., "how has my pattern changed this month?" or "what does my current Sigil reflect?")');
    drawBullet('Historical Comparison: The companion references longitudinal data to provide temporal context (e.g., "compared to your first month of use, your stability index has improved by a meaningful margin")');
    drawBullet('Guidance and Recommendations: Based on observed patterns, the companion may suggest behavioral adjustments, measurement timing, or when to consider consulting a healthcare provider, without making diagnostic claims');
    drawBullet('Sigil Interpretation: The companion helps users understand their Sigil by describing what general patterns are reflected in the visual, supporting the familiarity-based readability system described in Document 81');
    drawBullet('Session Preparation: Before sensing sessions, the companion may provide reminders about optimal conditions, device placement, or protocol steps to improve data quality');

    // --- E ---
    drawSectionHeader('E', 'Shared Intelligence — Partner Mode (Non-Limiting)');
    drawParagraph(
        'In certain embodiments, the AI Companion supports a shared intelligence mode for two consenting partners. Shared intelligence operates under the following principles:'
    );
    drawNumberedItem(1, 'Mutual Consent Requirement: Shared intelligence is activated only when both partners explicitly consent. Either partner may revoke consent at any time, immediately disabling shared insights.');
    drawNumberedItem(2, 'Coordinated Insight Delivery: Both partners receive related but individually tailored insights derived from their combined Harmony Profile analysis. The companion delivers insights that are relevant to the partnership without exposing either partner\'s individual data to the other.');
    drawNumberedItem(3, 'Privacy Boundary Enforcement: Even in shared mode, each partner\'s individual health data remains private. The companion generates shared insights from the Compatibility Intelligence Engine\'s alignment outputs, not from individual health markers. Neither partner can ask the companion to reveal the other\'s individual data.');
    drawNumberedItem(4, 'Relationship Context Awareness: The companion maintains a shared longitudinal context that tracks the partnership\'s alignment trajectory, enabling references to shared history (e.g., "your alignment pattern has been consistently strong over the past month").');
    drawNumberedItem(5, 'Asymmetric Disclosure Control: Each partner independently controls what level of shared insight they wish to receive. One partner may opt for detailed shared insights while the other opts for minimal summaries.');

    // --- F ---
    drawSectionHeader('F', 'Privacy-Preserving Language Generation (Non-Limiting)');
    drawParagraph(
        'In various embodiments, the AI Companion enforces strict language generation rules to maintain privacy:'
    );
    drawBullet('No Raw Values: The companion never outputs specific numeric measurements, sensor readings, or quantitative data from the abstraction layer');
    drawBullet('No Anatomical Specificity: Generated text uses abstract, non-anatomical language (e.g., "your overall physical wellness pattern" rather than specific body part references)');
    drawBullet('Relative Language: Insights are expressed in relative terms (e.g., "improving," "stronger than last month," "consistent with your baseline") rather than absolute values');
    drawBullet('Category-Based Communication: Where precision is needed, the companion uses categorical labels (e.g., "in the strong range," "showing a positive trend") rather than numbers');
    drawBullet('Redaction Enforcement: All generated responses pass through the Privacy Filter before delivery. Any response that fails privacy validation is regenerated or replaced with a safe fallback.');

    // --- G ---
    drawSectionHeader('G', 'Longitudinal Context and Memory Management (Non-Limiting)');
    drawParagraph(
        'In certain embodiments, the AI Companion\'s longitudinal context store is managed according to the following principles:'
    );
    drawBullet('User-Controlled Retention: Users control how much interaction history the companion retains. History may be fully deleted at any time.');
    drawBullet('Encrypted Storage: All context data is encrypted with user-controlled keys and stored locally or in encrypted cloud storage');
    drawBullet('Context Summarization: Over time, the system summarizes older interaction context into compressed representations, maintaining key temporal references while reducing storage requirements');
    drawBullet('No Training Feedback: User interaction data is not used to train or improve AI models without explicit, separate consent for research participation');
    drawBullet('Session Isolation: Individual interaction sessions are isolated such that a compromised session cannot expose historical context');

    // --- H ---
    drawSectionHeader('H', 'Integration with System Components (Non-Limiting)');
    drawParagraph(
        'In various embodiments, the AI Companion integrates with the following system components:'
    );
    drawBullet('Health Intelligence Engine (Document 80): Receives single-user health markers for individual insight generation');
    drawBullet('Compatibility Intelligence Engine (Document 80): Receives cross-user alignment scores for shared insight generation');
    drawBullet('Sigil Rendering System (Documents 75, 81): References Sigil elements when helping users interpret their visual representations');
    drawBullet('Harmony Profile (Document 78): References profile evolution and temporal changes for longitudinal context');
    drawBullet('Nexalis Connect (Document 79): May provide companion-generated match commentary when users explore compatibility results');
    drawBullet('Node Data Pipelines: Receives session completion notifications and data quality summaries to provide post-session commentary');

    // --- I ---
    drawSectionHeader('I', 'Exemplary Claim-Like Statements (Non-Limiting)');
    drawParagraph(
        'A provisional application does not require claims. The following statements are illustrative only and do not limit the disclosure.'
    );

    drawNumberedItem(1, 'A system comprising: a) a health intelligence engine configured to produce abstracted health markers from multi-node physiological sensing data; b) an AI companion module configured to synthesize the abstracted health markers into natural-language conversational insights; and c) a privacy filter configured to validate that all generated conversational output contains no raw physiological values, explicit anatomical references, or individually identifiable measurements.');

    drawNumberedItem(2, 'The system of statement 1, further comprising a longitudinal context store configured to maintain encrypted interaction history and temporal references, enabling the AI companion to provide context-aware insights referencing historical patterns and previously discussed trends.');

    drawNumberedItem(3, 'The system of statement 1, further comprising a shared intelligence mode activated by mutual consent of two users, wherein the AI companion delivers coordinated insights derived from cross-user alignment analysis without exposing either user\'s individual health data to the other.');

    drawNumberedItem(4, 'The system of statement 3, wherein shared intelligence is derived exclusively from Compatibility Intelligence Engine alignment outputs and wherein neither user can query the AI companion for the other user\'s individual health markers.');

    drawNumberedItem(5, 'The system of statement 1, wherein the AI companion communicates using relative language, categorical labels, and abstract descriptions rather than absolute values or clinical terminology.');

    drawNumberedItem(6, 'A method comprising: a) receiving abstracted health markers from a multi-node physiological intelligence engine; b) generating natural-language conversational insights by synthesizing the health markers with longitudinal context from an encrypted context store; c) filtering the generated insights through a privacy validation layer to ensure no raw data or anatomical specificity is present; and d) delivering the validated insights to a user through a conversational interface.');

    drawNumberedItem(7, 'The method of statement 6, further comprising: e) receiving mutual consent from two users; f) receiving cross-user alignment data from a compatibility intelligence engine; g) generating coordinated partner insights tailored to each user without exposing individual data; and h) enforcing asymmetric disclosure control wherein each user independently controls their level of shared insight detail.');

    drawNumberedItem(8, 'The method of statement 6, further comprising providing Sigil interpretation assistance by generating abstract descriptions of visual Sigil elements in response to user queries, supporting familiarity-based readability development.');

    drawFooter();

    const pdfBytes = await doc.save();
    const outPath = path.join('C:\\Users\\zSixt\\Desktop\\patent pdfs', '83_AI_Companion_Shared_Intelligence.pdf');
    fs.writeFileSync(outPath, pdfBytes);
    console.log(`Created: ${outPath}`);
    console.log(`Size: ${(pdfBytes.length / 1024).toFixed(1)} KB`);
    console.log(`Pages: ${doc.getPageCount()}`);
}

createPatent83().catch(console.error);
