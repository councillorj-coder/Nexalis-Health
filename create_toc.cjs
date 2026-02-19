const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createTOC() {
    const doc = await PDFDocument.create();
    const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await doc.embedFont(StandardFonts.Helvetica);
    const helveticaOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

    const pageWidth = 612; // Letter size
    const pageHeight = 792;
    const marginLeft = 55;
    const marginRight = 55;
    const contentWidth = pageWidth - marginLeft - marginRight;

    // Colors
    const black = rgb(0, 0, 0);
    const darkGray = rgb(0.25, 0.25, 0.25);
    const medGray = rgb(0.45, 0.45, 0.45);
    const accentBlue = rgb(0.12, 0.29, 0.49);
    const lightLine = rgb(0.8, 0.8, 0.8);

    // TOC data - sections with entries
    const sections = [
        {
            title: 'COVER',
            entries: [
                ['01', 'Cover Sheet'],
            ]
        },
        {
            title: 'SYSTEM SPECIFICATION',
            entries: [
                ['02', 'Field of the Invention & System Overview'],
                ['03', 'Field of the Invention & System Overview (Duplicate)'],
                ['04', 'Node-Specific Disclosure Overview (Pre-Page)'],
                ['05', 'Background and Limitations of Existing Approaches'],
                ['06', 'Summary of the Invention'],
                ['07', 'Brief Description of the Drawings'],
                ['08', 'Definitions and Terminology'],
                ['09', 'System Architecture Overview'],
                ['10', 'Data Pipeline and Metric Generation'],
                ['11', 'General Embodiments and Variations'],
                ['12', 'Detailed Description of the System'],
            ]
        },
        {
            title: 'NODE OVERVIEWS (IN MAIN SPECIFICATION)',
            entries: [
                ['13', 'Node 1 — All-Day/Night External Tumescence & Rigidity Monitor'],
                ['14', 'Node 2 — Intravaginal Longitudinal Physiology Monitor'],
                ['15', 'Node 3 — Self-Scan External Geometry Measurement Device'],
                ['16', 'Node 4 — Intraluminal Geometry, Compliance & Contact Device'],
                ['17', 'Node 5 — Upper-Body Physiologic Context Device'],
            ]
        },
        {
            title: 'CROSS-DEVICE, WORKFLOWS, PRIVACY & CLAIMS',
            entries: [
                ['18', 'Cross-Device Correlation and Contextual Interpretation'],
                ['19', 'Cross-User Correlation and Pairing-Context Methods'],
                ['20', 'Example Workflows and Operating Modes'],
                ['21', 'Privacy, Security, and Data Governance'],
                ['22', 'Computing System, Software Architecture & Implementation'],
                ['23', 'Example Claim-Style Statements and Scope'],
                ['24', 'Figures, Reference Numerals & Illustrative Diagrams'],
                ['25', 'Definitions, Terminology & Interpretation'],
                ['26', 'Advantages and Industrial Applicability'],
                ['27', 'Abstract and Final Notes'],
            ]
        },
        {
            title: 'APPENDICES',
            entries: [
                ['28', 'Appendix B — Parameters, Sampling Modes & Quality Indices'],
                ['29', 'Appendix C — Consent, Sharing Flows & Access Control'],
                ['30', 'Appendix D — Materials, Sealing, Cleaning & Power/Charging'],
                ['31', 'Appendix E — Privacy-Preserving Output Formats & UI'],
                ['32', 'Appendix F — Validation, Anti-Spoof & Data Integrity'],
                ['33', 'Appendix G — Exemplary Metrics, Indices & Features'],
                ['34', 'Appendix H — Embodiment Combinations & Variants'],
                ['35', 'Appendix J — Kits, Accessories, Packaging & Deployment'],
                ['36', 'Appendix K — Communications, Sync & Data Pipeline'],
                ['37', 'Appendix L — Exemplar Claim-Like Statements'],
                ['38', 'Appendix M — Figures, Drawings & Reference Labels'],
                ['39', 'Appendix N — Definitions, Terminology & Interpretation Rules'],
            ]
        },
        {
            title: 'NODE 1 — EXTERNAL LONGITUDINAL WEARABLE (DETAILED)',
            entries: [
                ['40', 'Technical Field & Summary'],
                ['41', 'Sampling, Quality Indices, Processing & Outputs'],
                ['42', 'Mechanical Architecture, Power & Communications'],
                ['43', 'Claim-Like Statements'],
            ]
        },
        {
            title: 'NODE 2 — INTRAVAGINAL LONGITUDINAL WEARABLE (DETAILED)',
            entries: [
                ['44', 'Technical Field & Summary'],
                ['45', 'Sampling, Quality Indices, Artifact Rejection & Outputs'],
                ['46', 'Mechanical Architecture, Electrodes & Power'],
                ['47', 'Claim-Like Statements'],
            ]
        },
        {
            title: 'NODE 3 — EXTERNAL GEOMETRY SCANNER (DETAILED)',
            entries: [
                ['48', 'Technical Field & Summary'],
                ['49', 'Scan Modes, Validation, Quality Indices & Anti-Spoof'],
                ['50', 'Hardware Architecture, Power & Standalone Use Cases'],
                ['51', 'Claim-Like Statements'],
            ]
        },
        {
            title: 'NODE 4 — INTRALUMINAL GEOMETRY/COMPLIANCE DEVICE (DETAILED)',
            entries: [
                ['52', 'Technical Field & Summary'],
                ['53', 'Hardware Architecture, Actuation & Power'],
                ['54', 'Claim-Like Statements'],
            ]
        },
        {
            title: 'NODE 5 — UPPER-BODY CONTEXT NODE (DETAILED)',
            entries: [
                ['55', 'Technical Field & Summary'],
                ['56', 'Derived Features, Quality Indices & Interpretation'],
                ['57', 'Hardware Architecture, Power & Standalone Use Cases'],
                ['58', 'Claim-Like Statements'],
            ]
        },
        {
            title: 'VIBRATION, HAPTICS & ACTIVE STIMULUS',
            entries: [
                ['59', 'Node 1 — Haptics Preliminary Overview'],
                ['60', 'Node 1 — Haptic Guidance, Coupling & Event Marking'],
                ['61', 'Node 1 — Closed-Loop Actuation & Consent Controls'],
                ['62', 'Node 2 — Internal Vibration & Haptic Stimulus'],
                ['63', 'Node 3 — Tactile Guidance & Scan Feedback'],
                ['64', 'Node 4 — Mechanical Stimulus Integration'],
                ['65', 'Node 5 — Somatic Feedback & Cross-Node Coordination'],
            ]
        },
        {
            title: 'ULTRASOUND ENDPOINT SENSING (NODE 4)',
            entries: [
                ['66', 'Technical Field & Summary — Ultrasound Distance/Geometry'],
                ['67', 'Ultrasound Modes, Frequency, Calibration & Quality'],
                ['68', 'Multi-Axis Endpointing, Feature Discrimination & Robustness'],
            ]
        },
        {
            title: 'NODE 5 AS SYSTEM CONTEXT ANCHOR',
            entries: [
                ['69', 'State Disambiguation, Artifact Control & Confidence'],
                ['70', 'Architecture, Derived Systemic State & Interpretation'],
                ['71', 'Context-Conditioned Baselines & Longitudinal Comparability'],
            ]
        },
        {
            title: 'SECURITY & PRIVACY',
            entries: [
                ['72', 'On-Device Encryption, Key Management & Secure Comms'],
                ['73', 'Secure Boot, Firmware Integrity & Audit Controls'],
                ['74', 'Privacy-by-Design: Abstracted Metrics & Safe Correlation'],
            ]
        },
        {
            title: 'SPECIALTY DISCLOSURES',
            entries: [
                ['75', 'Sensor-Derived Sigil — Abstract Physiological Visualization'],
                ['76', 'Future-Proof Symbolic Compatibility Framework'],
            ]
        },
        {
            title: 'HARMONY, INTELLIGENCE & EXTENDED DISCLOSURES',
            entries: [
                ['77', 'Harmony Engine — Cross-Architecture Physiological Correlation'],
                ['78', 'Harmony Profile — Portability & Third-Party Integration'],
                ['79', 'Nexalis Connect & Vow — Alignment-Based Matching'],
                ['80', 'Health & Compatibility Intelligence Engines'],
                ['81', 'Sigil Parametric Grammar & Deterministic Rendering'],
                ['82', 'Meridia Dual-Protocol Sensing & Spine Architecture'],
                ['83', 'AI Companion & Shared Intelligence'],
            ]
        },
        {
            title: 'FIGURE DRAWINGS',
            entries: [
                ['84', 'Consolidated Patent Figures (FIGS. 1–18)'],
            ]
        },
    ];

    let currentY;
    let pageNum = 0;

    function addPage() {
        const page = doc.addPage([pageWidth, pageHeight]);
        pageNum++;
        currentY = pageHeight - 60;
        return page;
    }

    function drawFooter(page) {
        const footerText = `Table of Contents  —  Page ${pageNum}`;
        const w = helveticaOblique.widthOfTextAtSize(footerText, 8);
        page.drawText(footerText, {
            x: (pageWidth - w) / 2,
            y: 30,
            size: 8,
            font: helveticaOblique,
            color: medGray,
        });
    }

    // --- PAGE 1: Title Page ---
    let page = addPage();

    // Horizontal rule at top
    page.drawLine({
        start: { x: marginLeft, y: pageHeight - 80 },
        end: { x: pageWidth - marginRight, y: pageHeight - 80 },
        thickness: 2,
        color: accentBlue,
    });

    // Title
    const title1 = 'PROVISIONAL PATENT APPLICATION';
    let w = helveticaBold.widthOfTextAtSize(title1, 14);
    page.drawText(title1, {
        x: (pageWidth - w) / 2,
        y: pageHeight - 120,
        size: 14,
        font: helveticaBold,
        color: accentBlue,
    });

    const title2 = 'TABLE OF CONTENTS';
    w = helveticaBold.widthOfTextAtSize(title2, 22);
    page.drawText(title2, {
        x: (pageWidth - w) / 2,
        y: pageHeight - 155,
        size: 22,
        font: helveticaBold,
        color: black,
    });

    // Divider
    page.drawLine({
        start: { x: pageWidth / 2 - 80, y: pageHeight - 170 },
        end: { x: pageWidth / 2 + 80, y: pageHeight - 170 },
        thickness: 1,
        color: lightLine,
    });

    // Patent info
    const infoLines = [
        ['Title:', 'Multi-Node Intimate Physiology System for Longitudinal'],
        ['', 'Pattern Measurement, Cross-Device Correlation, and'],
        ['', 'Privacy-Preserving Outputs'],
        ['', ''],
        ['Inventor:', 'Jake Councillor'],
        ['Residence:', 'Port St. Lucie, Florida, United States'],
        ['Filing Date:', 'February 14, 2026'],
        ['Entity:', 'Small Entity'],
        ['Total Documents:', '84 PDF Files'],
    ];

    let infoY = pageHeight - 210;
    for (const [label, value] of infoLines) {
        if (label) {
            page.drawText(label, {
                x: marginLeft + 60,
                y: infoY,
                size: 10,
                font: helveticaBold,
                color: darkGray,
            });
        }
        if (value) {
            page.drawText(value, {
                x: marginLeft + 160,
                y: infoY,
                size: 10,
                font: helvetica,
                color: darkGray,
            });
        }
        infoY -= 16;
    }

    // Divider
    page.drawLine({
        start: { x: marginLeft, y: infoY - 5 },
        end: { x: pageWidth - marginRight, y: infoY - 5 },
        thickness: 1,
        color: lightLine,
    });

    currentY = infoY - 35;

    // --- Draw sections ---
    for (const section of sections) {
        // Check if we need space for header + at least 2 entries
        const neededForHeader = 35;
        const neededForMin = neededForHeader + 32;

        if (currentY < 80 + neededForMin) {
            drawFooter(page);
            page = addPage();
        }

        // Section header
        page.drawRectangle({
            x: marginLeft,
            y: currentY - 3,
            width: contentWidth,
            height: 18,
            color: rgb(0.93, 0.95, 0.97),
        });

        page.drawText(section.title, {
            x: marginLeft + 8,
            y: currentY,
            size: 9.5,
            font: helveticaBold,
            color: accentBlue,
        });

        currentY -= 26;

        // Entries
        for (const [num, desc] of section.entries) {
            if (currentY < 65) {
                drawFooter(page);
                page = addPage();
            }

            // Number
            page.drawText(num, {
                x: marginLeft + 12,
                y: currentY,
                size: 10,
                font: helveticaBold,
                color: accentBlue,
            });

            // Dot leader area
            const descX = marginLeft + 38;

            // Description text
            page.drawText(desc, {
                x: descX,
                y: currentY,
                size: 9.5,
                font: helvetica,
                color: darkGray,
            });

            // Light separator line
            page.drawLine({
                start: { x: marginLeft + 10, y: currentY - 6 },
                end: { x: pageWidth - marginRight, y: currentY - 6 },
                thickness: 0.3,
                color: rgb(0.9, 0.9, 0.9),
            });

            currentY -= 17;
        }

        currentY -= 8; // spacing between sections
    }

    drawFooter(page);

    // Save
    const pdfBytes = await doc.save();
    const outPath = path.join('C:\\Users\\zSixt\\Desktop\\patent pdfs', '00_Table_of_Contents.pdf');
    fs.writeFileSync(outPath, pdfBytes);
    console.log(`Created: ${outPath}`);
    console.log(`Size: ${(pdfBytes.length / 1024).toFixed(1)} KB`);
}

createTOC().catch(console.error);
