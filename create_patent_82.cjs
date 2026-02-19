const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createPatent82() {
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
        const footerText = `Document 82  —  Page ${pageNum}`;
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

    const header = 'SPECIFICATION — MERIDIA DUAL-PROTOCOL & SPINE ARCHITECTURE';
    const hw = helveticaBold.widthOfTextAtSize(header, 11);
    currentPage.drawText(header, { x: (pageWidth - hw) / 2, y: pageHeight - 70, size: 11, font: helveticaBold, color: accentBlue });

    const subtitle = 'SESSION-BASED DUAL-PROTOCOL SENSING (PASSIVE/ACTIVE) AND CONFORMING';
    const subtitle2 = 'SPINE MECHANICAL ARCHITECTURE FOR INTRALUMINAL MAPPING (NON-LIMITING)';
    let sw = helveticaBold.widthOfTextAtSize(subtitle, 9);
    currentPage.drawText(subtitle, { x: (pageWidth - sw) / 2, y: pageHeight - 88, size: 9, font: helveticaBold, color: darkGray });
    sw = helveticaBold.widthOfTextAtSize(subtitle2, 9);
    currentPage.drawText(subtitle2, { x: (pageWidth - sw) / 2, y: pageHeight - 100, size: 9, font: helveticaBold, color: darkGray });

    currentPage.drawLine({ start: { x: marginLeft, y: pageHeight - 112 }, end: { x: pageWidth - marginRight, y: pageHeight - 112 }, thickness: 0.5, color: lightLine });
    currentY = pageHeight - 130;

    // --- A ---
    drawSectionHeader('A', 'Technical Field');
    drawParagraph(
        'This disclosure relates to intraluminal physiological mapping devices and, more particularly, to: (1) a dual-protocol sensing methodology comprising a passive baseline mapping protocol (v1) and an active micro-vibration response protocol (v2) for characterizing internal tissue geometry, compliance, and reactive behavior; and (2) a conforming spine mechanical architecture for intraluminal insertable devices, including spine design variants, placement rules, and zone-to-spine decoupling requirements. This disclosure supplements the Node 4 disclosures (Documents 52-54) with specific protocol sequencing and mechanical backbone architecture.'
    );

    // --- B ---
    drawSectionHeader('B', 'Background and Motivation (Non-Limiting)');
    drawParagraph(
        'The existing Node 4 disclosures describe an intraluminal device with controlled radial stimulus (inflation/expansion) for measuring internal geometry and compliance. However, they do not disclose: (a) a structured dual-protocol approach in which a purely passive mapping session precedes and establishes baseline for an active micro-vibration-based session; (b) differential analysis methods comparing passive and active maps to reveal reactive tissue regions; or (c) specific conforming spine architectures that govern sensor zone placement, mechanical decoupling, and measurement accuracy. The present disclosure addresses these gaps.'
    );

    // --- C ---
    drawSectionHeader('C', 'Dual-Protocol Overview (Non-Limiting)');
    drawParagraph(
        'In certain embodiments, the intraluminal mapping device operates in two distinct sensing protocols performed in a defined sequence:'
    );
    drawNumberedItem(1, 'Protocol v1 — Passive Baseline Mapping: A session conducted with zero active stimulus (no vibration, no inflation). The device passively senses contact pressure distribution, internal geometry via distance sensors, temperature gradients, and impedance characteristics. The output is a baseline map representing the resting-state geometry and pressure distribution of the internal environment.');
    drawNumberedItem(2, 'Protocol v2 — Active Micro-Vibration Response Mapping: A session conducted after v1 baseline acquisition in which controlled micro-vibration stimulus is applied while simultaneously measuring contact pressure, displacement, and impedance response. The output is an activation-response map showing how tissue responds to controlled mechanical input.');
    drawParagraph(
        'Protocol v1 must complete successfully and produce a validated baseline map before Protocol v2 may be initiated. This sequencing ensures that active-response data is always interpretable against a stable passive baseline.'
    );

    // --- D ---
    drawSectionHeader('D', 'Protocol v1 — Passive Baseline Mapping (Non-Limiting)');
    drawParagraph(
        'In various embodiments, Protocol v1 acquires the following measurements in a purely passive mode:'
    );
    drawBullet('Pressure Distribution Map: Multi-zone circumferential pressure sensing captures the resting contact pressure pattern across all instrumented zones along the device length');
    drawBullet('Distance/Geometry Profile: Time-of-flight or IR distance sensors measure internal diameter or cavity geometry at multiple positions');
    drawBullet('Temperature Gradient: Distributed temperature sensors capture the thermal profile along the device, providing context and confirming proper placement');
    drawBullet('Impedance Baseline: Bio-impedance measurements establish baseline tissue electrical characteristics at each electrode pair');
    drawBullet('IMU Stability: Inertial measurements confirm device stability and flag motion artifacts');
    drawParagraph(
        'The v1 output comprises a validated baseline pressure map, a geometry profile, quality indices (contact integrity, stability, temperature plausibility), and a confidence indicator. Segments failing quality criteria are rejected, and the user may be prompted to re-seat the device.'
    );

    // --- E ---
    drawSectionHeader('E', 'Protocol v2 — Active Micro-Vibration Response (Non-Limiting)');
    drawParagraph(
        'In various embodiments, Protocol v2 applies controlled micro-vibration stimulus while continuing to measure all sensors. The micro-vibration subsystem comprises:'
    );
    drawNumberedItem(1, 'Stimulus Source: One or more miniature LRA or piezoelectric actuators embedded within the device body, configured to produce controlled, low-amplitude mechanical vibration at specified frequencies.');
    drawNumberedItem(2, 'Stimulus Isolation: Mechanical isolation structures (elastomeric decouplers, damping layers) prevent vibration from propagating directly into pressure and distance sensors, ensuring that measured responses reflect tissue reaction rather than direct mechanical coupling.');
    drawNumberedItem(3, 'Frequency Sweep: The stimulus may be applied at a single frequency or swept across a frequency range to characterize frequency-dependent tissue response (e.g., stiffness, damping, resonance).');
    drawNumberedItem(4, 'Zone-Sequential Activation: In embodiments with multiple actuators, stimulus may be applied to one zone at a time while other zones measure passive response, enabling spatial mapping of reactive regions.');
    drawNumberedItem(5, 'Concurrent Sensing: Throughout v2 stimulus, all passive sensors continue to operate, capturing how pressure distribution, distance measurements, and impedance change in response to micro-vibration.');

    // --- F ---
    drawSectionHeader('F', 'Differential Analysis — Passive vs. Active (Non-Limiting)');
    drawParagraph(
        'In certain embodiments, the system performs differential analysis by comparing v1 baseline maps with v2 activation-response maps. This analysis reveals:'
    );
    drawBullet('Reactive Regions: Zones where pressure distribution changes significantly between v1 and v2, indicating tissue areas with high mechanical responsiveness');
    drawBullet('Compliance Mapping: Zones where distance/geometry measurements shift under micro-vibration, indicating relative tissue stiffness or elasticity');
    drawBullet('Impedance Response: Zones where bio-impedance changes under mechanical stimulus, potentially indicating differences in tissue hydration, density, or composition');
    drawBullet('Damping Characteristics: The rate at which tissue response decays after stimulus cessation, providing information about viscoelastic properties');
    drawBullet('Frequency-Dependent Behavior: How tissue response varies with stimulus frequency, enabling characterization of mechanical resonance properties');
    drawParagraph(
        'Differential outputs are expressed as relative change indices, zone-based response maps, and confidence indicators. No absolute anatomical measurements are exposed.'
    );

    // --- G ---
    drawSectionHeader('G', 'Conforming Spine Architecture — Overview (Non-Limiting)');
    drawParagraph(
        'In various embodiments, the intraluminal device includes a mechanical backbone (spine) that provides structural support, sensor positioning, and controlled flexibility. The spine architecture must satisfy competing requirements: rigidity sufficient to maintain sensor positioning, flexibility sufficient to conform to internal geometry, and mechanical decoupling sufficient to prevent the spine from corrupting pressure measurements.'
    );

    // --- H ---
    drawSectionHeader('H', 'Spine Design Variants (Non-Limiting)');
    drawParagraph(
        'In various embodiments, the spine may be implemented using one of the following architectures:'
    );
    drawNumberedItem(1, 'Continuous Flex Backbone: A single continuous flexible element (e.g., a spring-steel or nitinol strip, a flexible PCB, or a silicone-encapsulated flex cable) running the length of the device. Advantages include smooth bending, predictable flex characteristics, and manufacturing simplicity. Disadvantages include potential for spine-induced pressure artifacts and limited ability to decouple individual zones.');
    drawNumberedItem(2, 'Segmented Spine: A series of rigid or semi-rigid segments connected by controlled articulation points (e.g., living hinges, ball-and-socket joints, or elastomeric links). Advantages include zone-level mechanical independence, better decoupling of pressure measurements from spine behavior, and the ability to conform to complex geometries. Disadvantages include greater manufacturing complexity and potential for inter-segment wear.');
    drawNumberedItem(3, 'Hybrid Spine: A combination of continuous flex regions and segmented regions along the device length, optimizing flexibility and decoupling for different functional zones.');

    // --- I ---
    drawSectionHeader('I', 'Spine Placement Rules and Zone-to-Spine Decoupling (Non-Limiting)');
    drawParagraph(
        'In various embodiments, the relationship between the spine and sensor zones is governed by strict placement rules:'
    );
    drawNumberedItem(1, 'Radial Offset: Pressure-sensitive zones must be radially offset from the spine axis to minimize spine-induced contact pressure artifacts. The minimum offset distance is determined by the spine stiffness and the pressure sensor sensitivity threshold.');
    drawNumberedItem(2, 'Mechanical Decoupling: Each pressure-sensing zone includes an isolation structure (e.g., elastomeric cushion, floating mount, or compliant membrane) between the zone and the spine, preventing spine bending forces from registering as contact pressure.');
    drawNumberedItem(3, 'Angular Distribution: Sensor zones are distributed circumferentially such that no zone is directly loaded by spine bending in the primary flex direction.');
    drawNumberedItem(4, 'Zone Independence: In segmented spine designs, each sensor zone is associated with an individual spine segment, and inter-segment articulation boundaries are positioned between zone boundaries to prevent cross-zone mechanical coupling.');
    drawNumberedItem(5, 'Vibration Path Isolation: For Protocol v2, the micro-vibration stimulus path from actuator to tissue must bypass the spine or be decoupled from it to prevent spine resonance from generating measurement artifacts.');

    // --- J ---
    drawSectionHeader('J', 'Spine-Pressure Interaction Calibration (Non-Limiting)');
    drawParagraph(
        'In certain embodiments, the system includes a spine-pressure interaction calibration procedure:'
    );
    drawBullet('Factory Calibration: The device is calibrated during manufacturing by applying known external pressures at each zone position and measuring the spine-induced baseline offset');
    drawBullet('In-Session Calibration: During Protocol v1, the system may identify and subtract spine-induced pressure components by analyzing the correlation between device curvature (measured by IMU) and zone-level pressure readings');
    drawBullet('Curvature Compensation: A compensation model maps device bend radius (estimated from IMU and/or spine strain sensing) to expected spine-induced pressure artifacts at each zone, subtracting these from the measured contact pressure');

    // --- K ---
    drawSectionHeader('K', 'Exemplary Claim-Like Statements (Non-Limiting)');
    drawParagraph(
        'A provisional application does not require claims. The following statements are illustrative only and do not limit the disclosure.'
    );

    drawNumberedItem(1, 'A system comprising: a) an insertable intraluminal device having a plurality of pressure sensing zones, one or more distance sensors, and one or more micro-vibration actuators; b) a controller configured to execute a first protocol (v1) in which the device acquires a passive baseline map with zero active stimulus, and a second protocol (v2) in which the device applies controlled micro-vibration stimulus while continuing to acquire sensor data; and c) a processing module configured to perform differential analysis between v1 and v2 outputs to identify reactive regions, compliance characteristics, and frequency-dependent tissue response.');

    drawNumberedItem(2, 'The system of statement 1, wherein the controller enforces sequential protocol execution such that v2 cannot be initiated until v1 has produced a validated baseline map meeting defined quality criteria.');

    drawNumberedItem(3, 'The system of statement 1, wherein micro-vibration stimulus is mechanically isolated from pressure sensing zones by decoupling structures preventing direct mechanical coupling between actuators and sensors.');

    drawNumberedItem(4, 'The system of statement 1, wherein the micro-vibration stimulus comprises a frequency sweep for characterizing frequency-dependent tissue response including stiffness, damping, and resonance.');

    drawNumberedItem(5, 'The system of statement 1, further comprising a conforming spine providing structural support and sensor positioning, wherein the spine is mechanically decoupled from pressure sensing zones by isolation structures preventing spine bending forces from registering as contact pressure.');

    drawNumberedItem(6, 'The system of statement 5, wherein the spine comprises one of: a continuous flex backbone, a segmented spine with controlled articulation points, or a hybrid combination thereof.');

    drawNumberedItem(7, 'The system of statement 5, further comprising a curvature compensation module configured to estimate device bend radius from inertial measurements and subtract spine-induced pressure artifacts from contact pressure readings at each zone.');

    drawNumberedItem(8, 'A method comprising: a) inserting an intraluminal device and executing a passive baseline mapping protocol with zero active stimulus to produce a validated baseline pressure map and geometry profile; b) executing an active micro-vibration protocol applying controlled stimulus while continuing to acquire sensor data; c) performing differential analysis between the passive baseline and active response data to identify reactive tissue regions and compliance characteristics; and d) outputting privacy-preserving zone-based response maps and relative change indices.');

    drawNumberedItem(9, 'The method of statement 8, wherein differential analysis includes computing reactive region indices, damping characteristics, and frequency-dependent compliance profiles from the comparison of passive and active maps.');

    drawNumberedItem(10, 'The method of statement 8, further comprising calibrating for spine-induced pressure artifacts using curvature compensation derived from inertial measurements and a factory-calibrated spine-pressure interaction model.');

    drawFooter();

    const pdfBytes = await doc.save();
    const outPath = path.join('C:\\Users\\zSixt\\Desktop\\patent pdfs', '82_Meridia_DualProtocol_Spine_Architecture.pdf');
    fs.writeFileSync(outPath, pdfBytes);
    console.log(`Created: ${outPath}`);
    console.log(`Size: ${(pdfBytes.length / 1024).toFixed(1)} KB`);
    console.log(`Pages: ${doc.getPageCount()}`);
}

createPatent82().catch(console.error);
