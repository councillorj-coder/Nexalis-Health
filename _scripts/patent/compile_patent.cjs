const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const PDF_DIR = 'C:\\Users\\zSixt\\Desktop\\patent pdfs';
const OUTPUT_PATH = 'C:\\Users\\zSixt\\Desktop\\NEXALIS_PATENT_CONSOLIDATED.pdf';

// Sections structure from user's create_toc.cjs
const sections = [
    {
        title: 'COVER',
        entries: [['01', 'Cover Sheet']]
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
            ['76', 'Future-Proof Symbolic Framework'],
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

async function compilePatent() {
    console.log('Starting Patent Compilation...');

    const combinedDoc = await PDFDocument.create();
    const files = fs.readdirSync(PDF_DIR).filter(f => f.endsWith('.pdf'));

    // 1. Get total page counts for each file to calculate ranges
    const filePageCounts = [];
    const numberedFiles = files.filter(f => /^\d+/.test(f)).sort((a, b) => parseInt(a) - parseInt(b));

    process.stdout.write('Analyzing page counts... ');
    for (const filename of numberedFiles) {
        const fileContent = fs.readFileSync(path.join(PDF_DIR, filename));
        const doc = await PDFDocument.load(fileContent);
        filePageCounts.push({
            filename,
            count: doc.getPageCount(),
            id: filename.substring(0, 2)
        });
    }
    console.log('Done.');

    // 2. Estimate TOC size (usually 2 pages for ~80 entries)
    const TOC_PAGE_COUNT = 2; // Fixed estimate for calculation
    let currentGlobalPage = TOC_PAGE_COUNT + 1;

    // Map starting page numbers back to the section entries
    sections.forEach(s => {
        s.entries.forEach(e => {
            const fileInfo = filePageCounts.find(f => f.id === e[0]);
            if (fileInfo) {
                e[2] = currentGlobalPage; // Store start page at index 2
                currentGlobalPage += fileInfo.count;
            } else {
                e[2] = 'N/A';
            }
        });
    });

    const totalCalculatedPages = currentGlobalPage - 1;

    // 3. Create TOC Pages
    const helveticaBold = await combinedDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await combinedDoc.embedFont(StandardFonts.Helvetica);
    const helveticaOblique = await combinedDoc.embedFont(StandardFonts.HelveticaOblique);

    const pageWidth = 612; // Letter
    const pageHeight = 792;
    const marginLeft = 55;
    const marginRight = 55;
    const contentWidth = pageWidth - marginLeft - marginRight;
    const accentBlue = rgb(0.12, 0.29, 0.49);
    const black = rgb(0, 0, 0);
    const darkGray = rgb(0.25, 0.25, 0.25);
    const medGray = rgb(0.45, 0.45, 0.45);
    const lightLine = rgb(0.9, 0.9, 0.9);

    let tocPageNum = 0;
    let tocCurrentY;
    let tocPage;

    function addNewTocPage() {
        tocPage = combinedDoc.addPage([pageWidth, pageHeight]);
        tocPageNum++;
        tocCurrentY = pageHeight - 60;
        return tocPage;
    }

    function drawFooter(p, num) {
        const footerText = num ? `Page ${num} of ${totalCalculatedPages}` : `TOC  —  Page ${tocPageNum}`;
        const font = num ? helvetica : helveticaOblique;
        const w = font.widthOfTextAtSize(footerText, 8);
        p.drawText(footerText, {
            x: (pageWidth - w) / 2,
            y: 30,
            size: 8,
            font: font,
            color: medGray,
        });
    }

    addNewTocPage();

    // TOC Title
    tocPage.drawText('PROVISIONAL PATENT APPLICATION: TABLE OF CONTENTS', {
        x: marginLeft,
        y: pageHeight - 50,
        size: 14,
        font: helveticaBold,
        color: accentBlue
    });
    tocCurrentY = pageHeight - 85;

    for (const section of sections) {
        if (tocCurrentY < 100) {
            drawFooter(tocPage);
            addNewTocPage();
        }

        // Section Background
        tocPage.drawRectangle({
            x: marginLeft,
            y: tocCurrentY - 3,
            width: contentWidth,
            height: 16,
            color: rgb(0.95, 0.96, 0.98),
        });

        tocPage.drawText(section.title, {
            x: marginLeft + 5,
            y: tocCurrentY,
            size: 9,
            font: helveticaBold,
            color: accentBlue,
        });
        tocCurrentY -= 22;

        for (const entry of section.entries) {
            if (tocCurrentY < 60) {
                drawFooter(tocPage);
                addNewTocPage();
            }

            const [id, desc, startPage] = entry;

            // ID
            tocPage.drawText(id, { x: marginLeft + 10, y: tocCurrentY, size: 9, font: helveticaBold, color: darkGray });
            // Desc
            tocPage.drawText(desc, { x: marginLeft + 35, y: tocCurrentY, size: 9, font: helvetica, color: darkGray });
            // Page Num
            const pageStr = startPage.toString();
            const pw = helveticaBold.widthOfTextAtSize(pageStr, 9);
            tocPage.drawText(pageStr, { x: pageWidth - marginRight - pw, y: tocCurrentY, size: 9, font: helveticaBold, color: accentBlue });

            // Dots (Leader)
            const descW = helvetica.widthOfTextAtSize(desc, 9);
            const leaderStart = marginLeft + 35 + descW + 5;
            const leaderEnd = pageWidth - marginRight - pw - 5;
            if (leaderEnd > leaderStart) {
                tocPage.drawLine({
                    start: { x: leaderStart, y: tocCurrentY + 2 },
                    end: { x: leaderEnd, y: tocCurrentY + 2 },
                    thickness: 0.5,
                    dashArray: [1, 2],
                    color: medGray
                });
            }

            tocCurrentY -= 15;
        }
        tocCurrentY -= 5;
    }
    drawFooter(tocPage);

    // 4. Append all documents and add footers
    console.log('Merging documents and applying footers...');
    let currentPageIdx = TOC_PAGE_COUNT + 1;

    for (const fileInfo of filePageCounts) {
        process.stdout.write(`Merging ${fileInfo.filename}... `);
        const fileContent = fs.readFileSync(path.join(PDF_DIR, fileInfo.filename));
        const srcDoc = await PDFDocument.load(fileContent);
        const pages = await combinedDoc.copyPages(srcDoc, srcDoc.getPageIndices());

        pages.forEach((p, idx) => {
            combinedDoc.addPage(p);
            drawFooter(p, currentPageIdx);
            currentPageIdx++;
        });
        console.log('Done.');
    }

    // 5. Final Save
    const finalBytes = await combinedDoc.save();
    fs.writeFileSync(OUTPUT_PATH, finalBytes);

    console.log('\n--- COMPILATION COMPLETE ---');
    console.log(`Final File: ${OUTPUT_PATH}`);
    console.log(`Total Pages: ${combinedDoc.getPageCount()}`);
    console.log(`Total PDF Sections Integrated: ${filePageCounts.length}`);
}

compilePatent().catch(console.error);
