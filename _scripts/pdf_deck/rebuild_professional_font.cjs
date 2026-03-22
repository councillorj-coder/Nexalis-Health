/**
 * rebuild_professional_font.cjs
 *
 * Rebuilds Nexalis_Partnership_Brief_Deck_.pdf with professional typography:
 *   - Montserrat ExtraBold   → main headings (bold, modern, geometric)
 *   - Montserrat SemiBold It → subheadings (clean, confident)
 *   - Source Sans 3 Light    → body text (maximally readable, professional)
 *   - Source Sans 3 SemiBold → name / emphasis
 *   - Source Sans 3 Lit. It  → footers
 *   - Montserrat Bold        → tag labels / page numbers
 *
 * Aesthetic: modern tech firm meets established institution.
 * Easy to read, attention-grabbing, professional.
 */

const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const path = require('path');

// ── NEXALIS PALETTE ─────────────────────────────────────────────────
const BG = rgb(0, 0, 0);
const WHITE = rgb(1, 1, 1);
const WHITE_90 = rgb(0.90, 0.90, 0.90);
const WHITE_60 = rgb(0.60, 0.60, 0.62);
const WHITE_40 = rgb(0.40, 0.40, 0.42);
const BLUE = rgb(0.23, 0.51, 0.96);
const BLUE_SOFT = rgb(0.38, 0.60, 0.99);
const ROSE = rgb(0.88, 0.11, 0.28);
const PURPLE = rgb(0.65, 0.55, 0.98);
const SLATE = rgb(0.58, 0.64, 0.72);
const SLATE_DIM = rgb(0.39, 0.46, 0.54);

// ── PAGE CONSTANTS ──────────────────────────────────────────────────
const W = 612; const H = 792;
const ML = 72; const MR = 72;
const USABLE = W - ML - MR;
const FOOT_H = 44;
const TOP_BAR_H = 5;

// ── SLIDE DATA ───────────────────────────────────────────────────────
const slides = [
    {
        tag: 'CONFIDENTIAL BRIEF',
        heading: 'NEXALIS HEALTH',
        subheading: 'A New Layer of Sexual Wellbeing Intelligence',
        body: [
            'The next category in intimacy wellness will not be toys. It will be insight.',
            '',
            'Nexalis is developing a privacy-first physiology intelligence platform designed to transform confidence, comfort, and performance into measurable wellbeing outcomes.',
        ],
        footer: 'Confidential Brief  •  Partnership Conversations  •  2026',
        isTitleSlide: true,
    },
    {
        tag: 'MARKET SHIFT',
        heading: 'THE SHIFT\nHAPPENING NOW',
        subheading: 'Sexual wellness is moving beyond products and toward measurable wellbeing.',
        body: [
            'Consumers are no longer only buying experiences. They are seeking understanding, confidence, and personal insight.',
            '',
            'Across health, fitness, sleep, and mental wellbeing, intelligence platforms have replaced standalone products. Intimacy wellness remains one of the last major categories without a trusted insight layer.',
            '',
            'The next market leader will not simply sell devices. It will define how people understand intimacy health itself.',
        ],
        footer: 'Confidential Brief  •  Nexalis Health  •  2026',
    },
    {
        tag: 'THE GAP',
        heading: 'THE PROBLEM\nNOBODY OWNS',
        subheading: 'Intimacy wellness lacks a trusted intelligence layer.',
        body: [
            'Consumers experiment. Brands sell products. But no company owns understanding.',
            '',
            "Today's market delivers stimulation, accessories, and experiences, yet offers little measurable feedback about comfort, confidence, performance, or progression.",
            '',
            'Without trusted insight, customers remain uncertain, loyalty remains shallow, and long-term engagement is limited.',
            '',
            'The company that introduces intelligence becomes more than a retailer or manufacturer. It becomes the platform customers return to for guidance.',
        ],
        footer: 'Confidential Brief  •  Nexalis Health  •  2026',
    },
    {
        tag: 'THE PLATFORM',
        heading: 'WHAT NEXALIS\nIS BUILDING',
        subheading: 'A privacy-first intelligence layer for intimacy wellbeing.',
        body: [
            'Nexalis is creating a connected ecosystem that translates physiology into clear, non-explicit insight designed for everyday confidence and comfort.',
            '',
            'Instead of focusing on stimulation alone, Nexalis introduces measurable understanding through discreet devices, abstract metrics, and longitudinal wellbeing guidance.',
            '',
            'The result is not a single product, but an expandable platform capable of supporting multiple devices, new services, and long-term customer relationships.',
            '',
            'Nexalis transforms intimacy wellness from episodic purchases into an ongoing confidence and wellbeing journey.',
        ],
        footer: 'Confidential Brief  •  Nexalis Health  •  2026',
    },
    {
        tag: 'STRATEGIC VALUE',
        heading: 'WHY PARTNERS\nMATTER',
        subheading: 'Category leadership will belong to the companies that move first.',
        body: [
            'The transition from products to intelligence will not be won by hardware alone. It will be shaped by trusted retail and brand partners capable of introducing a new consumer narrative.',
            '',
            'Nexalis is designed to integrate with established leaders who understand customer trust, global distribution, and modern sexual wellbeing positioning.',
            '',
            'Early partners gain more than inventory. They help define the category, influence rollout strategy, and participate in long-term ecosystem growth.',
            '',
            'This is not a supplier relationship. It is an opportunity to help shape the next layer of intimacy wellness.',
        ],
        footer: 'Confidential Brief  •  Nexalis Health  •  2026',
    },
    {
        tag: 'FRAMEWORK',
        heading: 'PARTNERSHIP\nCONCEPT',
        subheading: 'An option to participate before the category fully emerges.',
        body: [
            'Nexalis is exploring a limited number of early partnership relationships designed to provide strategic partners with early access, collaborative input, and future commercial positioning.',
            '',
            'Rather than traditional distribution agreements, Nexalis is considering an option-based framework allowing partners to evaluate the platform as it moves toward launch.',
            '',
            'This structure enables alignment, validation, and shared category development before long-term commitments are established.',
            '',
            'Details are intentionally reserved for direct discussion.',
        ],
        footer: 'Confidential Brief  •  Nexalis Health  •  2026',
    },
    {
        tag: 'INVITATION',
        heading: 'CONFIDENTIAL\nINVITATION',
        subheading: 'The next category in intimacy wellness is being defined now.',
        body: [
            'Nexalis is engaging a small number of forward-looking partners to explore early collaboration and category leadership opportunities.',
            '',
            'We welcome a confidential conversation to share the full vision, product roadmap, and partnership framework.',
            '',
            '',
            'Jake Councillor',
            'Founder, Inventor, and CEO',
            'Contact:',
            'jc@nexalishealth.com',
        ],
        footer: 'Confidential Brief  •  Nexalis Health  •  2026',
        isClosingSlide: true,
    },
];

// ── helpers ──────────────────────────────────────────────────────────
function wrap(text, font, size, maxW) {
    if (!text) return [''];
    const words = text.split(' ');
    const lines = [];
    let cur = '';
    for (const w of words) {
        const test = cur ? `${cur} ${w}` : w;
        if (font.widthOfTextAtSize(test, size) > maxW) {
            if (cur) lines.push(cur);
            cur = w;
        } else cur = test;
    }
    if (cur) lines.push(cur);
    return lines;
}

function measureBody(s, bodyFont, boldFont, obliqueFont, bodySz, bodyLH) {
    let totalH = 0;
    for (const para of s.body) {
        if (para === '') { totalH += 16; continue; }
        let f = bodyFont; let sz = bodySz;
        if (s.isClosingSlide && para === 'Jake Councillor') { f = boldFont; sz = 20; }
        else if (s.isClosingSlide && para.includes('Founder, Inventor')) { f = obliqueFont; sz = 14; }
        else if (s.isClosingSlide && para === 'Contact:') { f = boldFont; sz = 13; }
        const lines = wrap(para, f, sz, USABLE);
        totalH += lines.length * bodyLH;
    }
    return totalH;
}

// ── BUILD ─────────────────────────────────────────────────────────────
async function build() {
    const doc = await PDFDocument.create();
    doc.registerFontkit(fontkit);

    const profDir = path.join(__dirname, 'fonts_professional');

    // ─ Heading: Montserrat ExtraBold (bold, modern, geometric — grabs attention)
    const msBoldBytes = fs.readFileSync(path.join(profDir, 'Montserrat-Bold.ttf'));
    const msXBoldBytes = fs.readFileSync(path.join(profDir, 'Montserrat-ExtraBold.ttf'));
    const msItBytes = fs.readFileSync(path.join(profDir, 'Montserrat-SemiBoldItalic.ttf'));

    // ─ Body: Source Sans 3 (gold standard professional readability)
    const ssLightBytes = fs.readFileSync(path.join(profDir, 'SourceSans3-Light.ttf'));
    const ssRegularBytes = fs.readFileSync(path.join(profDir, 'SourceSans3-Regular.ttf'));
    const ssSemiBoldBytes = fs.readFileSync(path.join(profDir, 'SourceSans3-SemiBold.ttf'));
    const ssItalicBytes = fs.readFileSync(path.join(profDir, 'SourceSans3-Italic.ttf'));
    const ssLightItBytes = fs.readFileSync(path.join(profDir, 'SourceSans3-LightItalic.ttf'));

    // Embed fonts
    const headingFont = await doc.embedFont(msXBoldBytes);      // main headings
    const subheadFont = await doc.embedFont(msItBytes);         // subheadings
    const bodyFont = await doc.embedFont(ssLightBytes);      // body text
    const bodyBold = await doc.embedFont(ssSemiBoldBytes);   // name / emphasis
    const bodyItalic = await doc.embedFont(ssLightItBytes);    // footer
    const tagFont = await doc.embedFont(msBoldBytes);       // tag / page num

    // Load profile picture
    const profilePicBytes = fs.readFileSync('C:\\Users\\zSixt\\Desktop\\profile pic.png');
    const profileImage = await doc.embedPng(profilePicBytes);

    for (let idx = 0; idx < slides.length; idx++) {
        const s = slides[idx];
        const page = doc.addPage([W, H]);

        // ── 1. Black background ─────────────────────────────────────────
        page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: BG });

        // ── 2. Gradient accent bar — top ────────────────────────────────
        const barSegments = 60;
        for (let i = 0; i < barSegments; i++) {
            const t = i / barSegments;
            const r = 0.23 + (0.88 - 0.23) * t;
            const g = 0.51 + (0.11 - 0.51) * t;
            const b = 0.96 + (0.28 - 0.96) * t;
            const segW = W / barSegments;
            page.drawRectangle({
                x: segW * i, y: H - TOP_BAR_H, width: segW + 1, height: TOP_BAR_H,
                color: rgb(r, g, b), opacity: 0.85
            });
        }

        // ── 3. Footer bar ───────────────────────────────────────────────
        page.drawRectangle({ x: 0, y: 0, width: W, height: FOOT_H, color: rgb(0.04, 0.04, 0.05) });
        page.drawLine({
            start: { x: 0, y: FOOT_H }, end: { x: W, y: FOOT_H },
            thickness: 0.5, color: rgb(1, 1, 1), opacity: 0.05
        });
        const footSz = 7.5;
        const fw = bodyItalic.widthOfTextAtSize(s.footer, footSz);
        page.drawText(s.footer, {
            x: (W - fw) / 2, y: (FOOT_H - footSz) / 2 + 1,
            size: footSz, font: bodyItalic, color: SLATE_DIM,
        });

        // ── 4. Page number (top-right) ──────────────────────────────────
        if (!s.isTitleSlide) {
            const numTxt = `${String(idx + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
            const numW = bodyFont.widthOfTextAtSize(numTxt, 9);
            page.drawText(numTxt, { x: W - MR - numW, y: H - 30, size: 9, font: tagFont, color: SLATE_DIM });
        }

        // ── available vertical zone ─────────────────────────────────────
        const topY = H - TOP_BAR_H - 40;
        const botY = FOOT_H + 30;
        const zoneH = topY - botY;

        // ═══════════════════════════════════════════════════════════════
        //   TITLE SLIDE
        // ═══════════════════════════════════════════════════════════════
        if (s.isTitleSlide) {
            const tagSz = 8.5;
            const headSz = 40;   // Montserrat ExtraBold — punchy, modern
            const subSz = 16;
            const bodySz = 14.5;
            const bodyLH = bodySz + 9;

            const headingLines = s.heading.split('\n');
            const subLines = wrap(s.subheading, subheadFont, subSz, USABLE);
            const bodyH = measureBody(s, bodyFont, bodyBold, subheadFont, bodySz, bodyLH);

            const totalContentH =
                20 +
                40 +
                headingLines.length * (headSz + 6) +
                20 +
                subLines.length * (subSz + 6) +
                36 +
                bodyH;

            let y = botY + (zoneH + totalContentH) / 2;

            // Tag box
            const tagW = tagFont.widthOfTextAtSize(s.tag, tagSz);
            const padX = 10; const padY = 5;
            const boxW = tagW + padX * 2 + 10;
            const boxH = tagSz + padY * 2;
            const boxX = (W - boxW) / 2;
            const boxY = y - 5;
            page.drawRectangle({
                x: boxX, y: boxY, width: boxW, height: boxH,
                borderColor: WHITE_90, borderWidth: 0.5, color: BG
            });
            page.drawCircle({ x: boxX + 10, y: boxY + boxH / 2, size: 2.5, color: ROSE });
            page.drawText(s.tag, { x: boxX + padX + 10, y: boxY + padY, size: tagSz, font: tagFont, color: WHITE_90 });

            const lineW = 30;
            page.drawRectangle({ x: (W - lineW) / 2, y: y - 10, width: lineW, height: 0.5, color: SLATE_DIM });
            y -= 56;

            // Heading (Playfair Display Black)
            for (const line of headingLines) {
                const tw = headingFont.widthOfTextAtSize(line, headSz);
                page.drawText(line, { x: (W - tw) / 2, y, size: headSz, font: headingFont, color: WHITE });
                y -= headSz + 6;
            }

            // Accent underline
            const ulW = 56;
            page.drawRectangle({ x: (W - ulW) / 2, y: y + 6, width: ulW, height: 3.5, color: BLUE });
            y -= 30;

            // Subheading (Playfair Display Bold Italic)
            for (const line of subLines) {
                const tw = subheadFont.widthOfTextAtSize(line, subSz);
                page.drawText(line, { x: (W - tw) / 2, y, size: subSz, font: subheadFont, color: rgb(0.75, 0.77, 0.80) });
                y -= subSz + 6;
            }
            y -= 28;

            // Body (Lato Light)
            for (const para of s.body) {
                if (para === '') { y -= 16; continue; }
                const lines = wrap(para, bodyFont, bodySz, USABLE - 40);
                for (const line of lines) {
                    const tw = bodyFont.widthOfTextAtSize(line, bodySz);
                    page.drawText(line, { x: (W - tw) / 2, y, size: bodySz, font: bodyFont, color: rgb(0.85, 0.86, 0.88) });
                    y -= bodyLH;
                }
            }

            continue;
        }

        // ═══════════════════════════════════════════════════════════════
        //   CONTENT SLIDES
        // ═══════════════════════════════════════════════════════════════
        const headSz = 30;   // Montserrat ExtraBold — crisp and bold
        const subSz = 14;
        const bodySz = 13.5;
        const bodyLH = bodySz + 8;

        // TAG pill
        let y = topY;
        if (s.tag) {
            const tagSz = 8.5;
            const tagW = tagFont.widthOfTextAtSize(s.tag, tagSz);
            const padX = 10; const padY = 5;
            const boxW = tagW + padX * 2 + 10;
            const boxH = tagSz + padY * 2;
            page.drawRectangle({
                x: ML, y: y - 5, width: boxW, height: boxH,
                borderColor: WHITE_90, borderWidth: 0.5, color: BG
            });
            page.drawCircle({ x: ML + 10, y: y - 5 + boxH / 2, size: 2.5, color: ROSE });
            page.drawText(s.tag, { x: ML + padX + 10, y: y - 5 + padY, size: tagSz, font: tagFont, color: WHITE_90 });
            y -= 50;
        }

        // HEADING (Playfair Display Black)
        const headingLines = s.heading.split('\n');
        for (const line of headingLines) {
            if (s.isClosingSlide) {
                const tw = headingFont.widthOfTextAtSize(line, headSz);
                page.drawText(line, { x: (W - tw) / 2, y, size: headSz, font: headingFont, color: WHITE_90 });
            } else {
                page.drawText(line, { x: ML, y, size: headSz, font: headingFont, color: WHITE_90 });
            }
            y -= headSz + 6;
        }

        // Accent underline
        if (s.isClosingSlide) {
            const ulW = 50;
            page.drawRectangle({ x: (W - ulW) / 2, y: y + 4, width: ulW, height: 3.5, color: BLUE });
        } else {
            page.drawRectangle({ x: ML, y: y + 4, width: 50, height: 3.5, color: BLUE });
        }
        y -= 32;

        // SUBHEADING (Playfair Display Bold Italic)
        const subLines = wrap(s.subheading, subheadFont, subSz, USABLE);
        for (const line of subLines) {
            if (s.isClosingSlide) {
                const tw = subheadFont.widthOfTextAtSize(line, subSz);
                page.drawText(line, { x: (W - tw) / 2, y, size: subSz, font: subheadFont, color: rgb(0.78, 0.80, 0.84) });
            } else {
                page.drawText(line, { x: ML, y, size: subSz, font: subheadFont, color: rgb(0.78, 0.80, 0.84) });
            }
            y -= subSz + 6;
        }

        // Distribute body text across remaining space
        const bodyTopY = y - 24;
        const bodyBotY = botY;
        const bodyZone = bodyTopY - bodyBotY;
        const naturalBodyH = measureBody(s, bodyFont, bodyBold, subheadFont, bodySz, bodyLH);
        const emptyParas = s.body.filter(p => p === '').length;
        const extraSpace = Math.max(0, bodyZone - naturalBodyH);
        const extraPerGap = emptyParas > 0 ? Math.min(extraSpace / emptyParas, 40) : 0;

        y = bodyTopY;

        for (const para of s.body) {
            if (para === '') { y -= 16 + extraPerGap; continue; }

            let font = bodyFont;
            let color = rgb(0.85, 0.86, 0.88);
            let sz = bodySz;

            if (s.isClosingSlide && para === 'Jake Councillor') {
                // Profile image above name
                const imgSize = 120;
                const imgX = (W - imgSize) / 2;
                const imgY = y - imgSize - 10;
                page.drawImage(profileImage, { x: imgX, y: imgY, width: imgSize, height: imgSize });
                y = imgY - 18;
                font = bodyBold; color = WHITE; sz = 22;
            }
            if (s.isClosingSlide && para.includes('Founder, Inventor')) {
                font = subheadFont; color = BLUE_SOFT; sz = 14;
            }
            if (s.isClosingSlide && para === 'Contact:') {
                font = bodyBold; color = WHITE_60; sz = 13;
            }
            if (s.isClosingSlide && para === 'jc@nexalishealth.com') {
                font = bodyFont; color = BLUE_SOFT; sz = 14;
            }

            const lines = wrap(para, font, sz, USABLE);
            for (const line of lines) {
                if (s.isClosingSlide) {
                    const tw = font.widthOfTextAtSize(line, sz);
                    page.drawText(line, { x: (W - tw) / 2, y, size: sz, font, color });
                } else {
                    page.drawText(line, { x: ML, y, size: sz, font, color });
                }
                y -= bodyLH;
            }
        }

        // Decorative side accent lines
        const lineTop = topY - 20;
        const lineBot = botY + 20;
        page.drawLine({
            start: { x: W - 36, y: lineTop }, end: { x: W - 36, y: lineBot },
            thickness: 1, color: BLUE, opacity: 0.08
        });
        page.drawLine({
            start: { x: W - 32, y: lineTop }, end: { x: W - 32, y: lineBot },
            thickness: 0.5, color: ROSE, opacity: 0.05
        });
    }

    const outPath = 'C:\\Users\\zSixt\\Desktop\\partnership teaser deck pdf\\Nexalis_Partnership_Brief_Deck_.pdf';
    const bytes = await doc.save();
    fs.writeFileSync(outPath, bytes);
    console.log(`\n  Created: ${outPath}`);
    console.log(`  Pages:   ${slides.length}`);
    console.log(`  Fonts:   Montserrat ExtraBold (headings) + Source Sans 3 Light (body)`);
    console.log(`  Size:    ${(bytes.length / 1024).toFixed(1)} KB\n`);
}

build().catch(console.error);
