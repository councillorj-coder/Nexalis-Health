const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createPatent78() {
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

    const black = rgb(0, 0, 0);
    const darkGray = rgb(0.25, 0.25, 0.25);
    const medGray = rgb(0.45, 0.45, 0.45);
    const accentBlue = rgb(0.12, 0.29, 0.49);
    const lightLine = rgb(0.8, 0.8, 0.8);

    let currentPage;
    let currentY;
    let pageNum = 0;

    function addPage() {
        currentPage = doc.addPage([pageWidth, pageHeight]);
        pageNum++;
        currentY = pageHeight - 60;
        return currentPage;
    }

    function drawFooter() {
        const footerText = `Document 78  —  Page ${pageNum}`;
        const w = helveticaOblique.widthOfTextAtSize(footerText, 8);
        currentPage.drawText(footerText, {
            x: (pageWidth - w) / 2,
            y: 30,
            size: 8,
            font: helveticaOblique,
            color: medGray,
        });
    }

    function wrapText(text, font, fontSize, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        for (const word of words) {
            const testLine = currentLine ? currentLine + ' ' + word : word;
            const testWidth = font.widthOfTextAtSize(testLine, fontSize);
            if (testWidth > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) lines.push(currentLine);
        return lines;
    }

    function drawWrappedText(text, x, fontSize, font, color, lineSpacing = 13) {
        const lines = wrapText(text, font, fontSize, maxTextWidth - (x - marginLeft));
        for (const line of lines) {
            if (currentY < 65) {
                drawFooter();
                addPage();
            }
            currentPage.drawText(line, { x, y: currentY, size: fontSize, font, color });
            currentY -= lineSpacing;
        }
    }

    function drawSectionHeader(letter, title) {
        if (currentY < 100) {
            drawFooter();
            addPage();
        }
        currentY -= 6;
        currentPage.drawText(`${letter}. ${title}`, {
            x: marginLeft,
            y: currentY,
            size: 10.5,
            font: helveticaBold,
            color: accentBlue,
        });
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
    // DOCUMENT START
    // =========================================================================
    addPage();

    // Top rule
    currentPage.drawLine({
        start: { x: marginLeft, y: pageHeight - 50 },
        end: { x: pageWidth - marginRight, y: pageHeight - 50 },
        thickness: 1.5,
        color: accentBlue,
    });

    // Header
    const header = 'SPECIFICATION — HARMONY PROFILE & PORTABILITY';
    const hw = helveticaBold.widthOfTextAtSize(header, 11);
    currentPage.drawText(header, {
        x: (pageWidth - hw) / 2,
        y: pageHeight - 70,
        size: 11,
        font: helveticaBold,
        color: accentBlue,
    });

    // Subtitle
    const subtitle = 'PRIVACY-PRESERVING LONGITUDINAL COMPATIBILITY PROFILE, PORTABLE';
    const subtitle2 = 'REPRESENTATION, AND THIRD-PARTY INTEGRATION FRAMEWORK (NON-LIMITING)';
    let sw = helveticaBold.widthOfTextAtSize(subtitle, 9);
    currentPage.drawText(subtitle, {
        x: (pageWidth - sw) / 2,
        y: pageHeight - 88,
        size: 9,
        font: helveticaBold,
        color: darkGray,
    });
    sw = helveticaBold.widthOfTextAtSize(subtitle2, 9);
    currentPage.drawText(subtitle2, {
        x: (pageWidth - sw) / 2,
        y: pageHeight - 100,
        size: 9,
        font: helveticaBold,
        color: darkGray,
    });

    currentPage.drawLine({
        start: { x: marginLeft, y: pageHeight - 112 },
        end: { x: pageWidth - marginRight, y: pageHeight - 112 },
        thickness: 0.5,
        color: lightLine,
    });

    currentY = pageHeight - 130;

    // --- A. Technical Field ---
    drawSectionHeader('A', 'Technical Field');
    drawParagraph(
        'This disclosure relates to portable physiological profile systems and, more particularly, to a privacy-preserving longitudinal compatibility profile (hereinafter "Harmony Profile") derived from multi-node physiological sensing data, methods for representing and exporting the profile in portable formats, and frameworks for integrating the profile with third-party applications and platforms.'
    );

    // --- B. Background ---
    drawSectionHeader('B', 'Background and Motivation (Non-Limiting)');
    drawParagraph(
        'Existing health and wellness platforms generate user profiles that are typically locked to a single application ecosystem, expressed in raw numeric formats, and lack portability. No known system generates a longitudinal compatibility profile from multi-node intimate physiology sensing data that can be exported, shared, or integrated with third-party platforms while maintaining zero-linkage privacy guarantees. The Harmony Profile addresses this by creating a versioned, portable, and privacy-preserving data construct that represents biological resonance characteristics without exposing raw physiological measurements.'
    );

    // --- C. Harmony Profile Definition ---
    drawSectionHeader('C', 'Harmony Profile Definition and Architecture (Non-Limiting)');
    drawParagraph(
        'In certain embodiments, a Harmony Profile is a structured data construct derived from one or more multi-node physiological sensing sessions processed through the system data abstraction pipeline. The Harmony Profile comprises:'
    );
    drawNumberedItem(1, 'Pattern Signature Layer: A set of normalized, non-invertible pattern signatures representing characteristic physiological behavior across multiple sensing domains (e.g., rigidity dynamics, tissue compliance, pelvic activity, cardiovascular context).');
    drawNumberedItem(2, 'Temporal Evolution Layer: A versioned history of pattern signatures tracking how the user\'s physiological characteristics change over time, stored as encrypted temporal segments.');
    drawNumberedItem(3, 'Alignment Descriptor Layer: Pre-computed descriptors optimized for cross-user alignment scoring, enabling compatibility analysis without re-processing raw data.');
    drawNumberedItem(4, 'Confidence and Coverage Metadata: Indicators of data quality, node coverage, temporal depth, and measurement confidence associated with each profile element.');
    drawNumberedItem(5, 'Disclosure Control Layer: A permission matrix defining which profile elements may be shared, at what level of detail, and under what consent conditions.');

    // --- D. Longitudinal Evolution ---
    drawSectionHeader('D', 'Longitudinal Profile Evolution (Non-Limiting)');
    drawParagraph(
        'In various embodiments, the Harmony Profile is not a static snapshot but a living data construct that evolves as new physiological data is acquired. The profile evolution system supports:'
    );
    drawBullet('Incremental updates: New sensing sessions append to the temporal evolution layer without overwriting historical data');
    drawBullet('Baseline drift detection: The system identifies and flags significant shifts in baseline physiological characteristics over weeks or months');
    drawBullet('Version tagging: Each significant profile update generates a version identifier enabling point-in-time comparison');
    drawBullet('Recovery trajectory tracking: Changes in profile characteristics following health interventions or lifestyle changes are tracked as named recovery trajectories');
    drawBullet('Confidence growth: Profile confidence indicators improve as temporal depth and measurement coverage increase');

    // --- E. Zero-Linkage Privacy ---
    drawSectionHeader('E', 'Zero-Linkage Privacy Architecture (Non-Limiting)');
    drawParagraph(
        'In various embodiments, the Harmony Profile enforces zero-linkage integrity through the following mechanisms:'
    );
    drawNumberedItem(1, 'Non-Invertible Generation: Profile elements are generated through one-way transformations such that raw sensor data, explicit anatomical measurements, or personally identifiable physiological characteristics cannot be reconstructed from the profile.');
    drawNumberedItem(2, 'Abstracted Representation: All profile elements are expressed as abstract indices, pattern signatures, normalized vectors, or symbolic descriptors rather than explicit physiological values.');
    drawNumberedItem(3, 'Layered Disclosure: The profile is structured in disclosure layers ranging from minimal summary indicators to detailed pattern descriptors. Each layer requires explicit user consent to share.');
    drawNumberedItem(4, 'Screenshot Safety: Exported profile representations (including visual formats) contain no explicit anatomical data, raw measurements, or content that could identify specific physiological characteristics if captured or shared without authorization.');
    drawNumberedItem(5, 'Encryption at Rest: All profile data is encrypted using user-controlled keys. The system does not retain decryption capability for profile data at rest.');

    // --- F. Partial Disclosure and Progressive Sharing ---
    drawSectionHeader('F', 'Partial Disclosure and Progressive Sharing (Non-Limiting)');
    drawParagraph(
        'In certain embodiments, the Harmony Profile supports partial disclosure through a progressive sharing architecture:'
    );
    drawNumberedItem(1, 'Level 0 — Presence Only: A binary indicator that a Harmony Profile exists, without revealing any profile content.');
    drawNumberedItem(2, 'Level 1 — Summary Card: A minimal, abstract representation (e.g., a symbolic visual or single composite index) suitable for display on third-party platforms.');
    drawNumberedItem(3, 'Level 2 — Dimensional Overview: Per-dimension summary scores (e.g., timing, intensity, rhythm) without underlying pattern details.');
    drawNumberedItem(4, 'Level 3 — Alignment Preview: Estimated compatibility indicators computed against another consenting user\'s profile at the same or lower disclosure level.');
    drawNumberedItem(5, 'Level 4 — Full Pattern Comparison: Detailed cross-user alignment analysis including per-dimension sub-scores, temporal trends, and zone-based compatibility maps. Requires mutual Level 4 consent.');
    drawParagraph(
        'Disclosure levels are independently configurable per user. A user at Level 4 sharing with a user at Level 2 will produce a Level 2 comparison result. The system always operates at the lower of the two users\' consent levels.'
    );

    // --- G. Harmony Cards ---
    drawSectionHeader('G', 'Harmony Cards — Portable Profile Representations (Non-Limiting)');
    drawParagraph(
        'In certain embodiments, the system generates exportable profile representations called Harmony Cards. A Harmony Card is a portable, screenshot-safe artifact that represents a subset of the user\'s Harmony Profile in a format suitable for sharing outside the Nexalis ecosystem. Harmony Cards may comprise:'
    );
    drawBullet('A symbolic visual representation (e.g., a Sigil or Lumen) derived from the user\'s profile');
    drawBullet('A composite compatibility index or compatibility category');
    drawBullet('A verification status indicating whether the profile data has been validated against device-derived measurements');
    drawBullet('A timestamp or freshness indicator showing when the profile was last updated');
    drawBullet('An optional QR code or deep link enabling another Nexalis user to initiate a consent-gated comparison');
    drawParagraph(
        'Harmony Cards contain no raw physiological data and are designed to convey profile characteristics entirely through abstract, symbolic, or categorical representations.'
    );

    // --- H. Third-Party Integration Framework ---
    drawSectionHeader('H', 'Third-Party Platform Integration Framework (Non-Limiting)');
    drawParagraph(
        'In various embodiments, the system provides integration mechanisms for third-party platforms. The integration framework operates in the following phases:'
    );
    drawNumberedItem(1, 'Phase 1 — Share Anywhere (Passive Display): Users export a Harmony Card as a static image, embeddable widget, or shareable link. Third-party platforms display the card without any data exchange or API integration. No platform-side integration is required.');
    drawNumberedItem(2, 'Phase 2 — Verified Profile (Authenticated Display): Third-party platforms integrate a verification API to confirm that a displayed Harmony Card is authentic, current, and unmodified. The API returns only a verification status and timestamp, not profile data.');
    drawNumberedItem(3, 'Phase 3 — Alignment API (Active Comparison): Third-party platforms integrate an alignment API that enables consent-gated compatibility comparisons between two Nexalis users within the third-party platform. The API accepts encrypted profile tokens and returns abstract alignment scores without exposing underlying profile data to the third-party platform.');
    drawParagraph(
        'In all integration phases, the third-party platform never receives raw profile data, pattern signatures, or any information that could be used to reconstruct physiological measurements.'
    );

    // --- I. Match Typing and Preference Discovery ---
    drawSectionHeader('I', 'Match Typing and Preference Discovery (Non-Limiting)');
    drawParagraph(
        'In certain embodiments, the Harmony Profile enables two novel analytical capabilities:'
    );
    drawNumberedItem(1, 'Match Typing: Classification of compatibility patterns into categorical types based on objective physiological alignment data. Match types represent recurring patterns of cross-user compatibility observed across the user base (e.g., complementary rhythms, convergent baselines, or reciprocal response patterns). Match types are derived statistically and do not correspond to subjective preferences or self-reported characteristics.');
    drawNumberedItem(2, 'Preference Discovery: Identification of compatibility characteristics that a user may not have been previously aware of. By analyzing cross-user alignment patterns across multiple comparisons, the system may surface previously unrecognized compatibility preferences expressed in abstract, non-explicit terms (e.g., "your profile shows strongest alignment with users who exhibit reciprocal timing patterns").');
    drawParagraph(
        'Both Match Typing and Preference Discovery operate on abstracted pattern signatures and produce only abstract, categorical, or symbolic outputs.'
    );

    // --- J. Profile Storage and Versioning ---
    drawSectionHeader('J', 'Profile Storage, Versioning, and Lifecycle (Non-Limiting)');
    drawParagraph(
        'In various embodiments, the Harmony Profile is stored and managed according to the following principles:'
    );
    drawBullet('User-Controlled Storage: The profile may be stored on the user\'s device, in encrypted cloud storage under user-controlled keys, or both');
    drawBullet('Version History: All profile versions are retained to support longitudinal tracking and point-in-time comparison');
    drawBullet('Selective Deletion: Users may delete specific profile versions, specific disclosure layers, or the entire profile at any time');
    drawBullet('Export and Backup: Users may export their complete profile in an encrypted portable format for backup or migration');
    drawBullet('Expiration and Freshness: Shared profile representations (Harmony Cards, alignment tokens) may include configurable expiration periods after which they are no longer valid for comparison');

    // --- K. Exemplary Claim-Like Statements ---
    drawSectionHeader('K', 'Exemplary Claim-Like Statements (Non-Limiting)');
    drawParagraph(
        'A provisional application does not require claims. The following statements are illustrative only and do not limit the disclosure.'
    );

    drawNumberedItem(1, 'A system comprising: a) a data abstraction pipeline configured to receive sensor data from one or more physiological sensing nodes associated with a user and generate a set of non-invertible pattern signatures; b) a profile generation module configured to assemble the pattern signatures into a structured Harmony Profile comprising a pattern signature layer, a temporal evolution layer, an alignment descriptor layer, and a disclosure control layer; and c) a profile export module configured to generate a portable, screenshot-safe Harmony Card representing a subset of the Harmony Profile; wherein the Harmony Profile and Harmony Card contain no raw sensor data and cannot be reverse-engineered to reconstruct physiological measurements.');

    drawNumberedItem(2, 'The system of statement 1, wherein the temporal evolution layer stores versioned history of pattern signatures and tracks baseline drift, recovery trajectories, and confidence growth over time.');

    drawNumberedItem(3, 'The system of statement 1, wherein the disclosure control layer defines multiple progressive disclosure levels, each requiring explicit user consent, and wherein cross-user comparisons operate at the lower of two users\' consent levels.');

    drawNumberedItem(4, 'The system of statement 1, further comprising a third-party integration framework operating in phases comprising passive display, authenticated verification, and consent-gated active comparison.');

    drawNumberedItem(5, 'The system of statement 1, further comprising a match typing module configured to classify cross-user compatibility patterns into categorical types based on abstracted alignment data.');

    drawNumberedItem(6, 'A method comprising: a) generating non-invertible pattern signatures from multi-node physiological sensing data; b) assembling a longitudinal Harmony Profile comprising versioned temporal segments; c) generating a portable Harmony Card containing a symbolic representation, a composite index, and a verification status; and d) sharing the Harmony Card via an export that contains no raw physiological data and is screenshot-safe.');

    drawNumberedItem(7, 'The method of statement 6, further comprising: e) receiving a consent-gated comparison request from a second user; f) computing an alignment score at the lower of the two users\' disclosed consent levels; and g) returning an abstract compatibility result without exposing either user\'s underlying pattern signatures to the other user.');

    drawNumberedItem(8, 'The method of statement 6, further comprising performing preference discovery by analyzing cross-user alignment patterns across multiple comparisons and surfacing previously unrecognized compatibility characteristics in abstract, non-explicit terms.');

    drawFooter();

    // Save
    const pdfBytes = await doc.save();
    const outPath = path.join('C:\\Users\\zSixt\\Desktop\\patent pdfs', '78_Harmony_Profile_Portability_Integration.pdf');
    fs.writeFileSync(outPath, pdfBytes);
    console.log(`Created: ${outPath}`);
    console.log(`Size: ${(pdfBytes.length / 1024).toFixed(1)} KB`);
    console.log(`Pages: ${doc.getPageCount()}`);
}

createPatent78().catch(console.error);
