export interface MarketingProduct {
    id: string;
    name: string;
    tagline: string;
    hook: string;
    theExperience: string;
    synergy: string;
    trust: string;
    compatibility: string;
    heroImage: string;
}

export const marketingData: Record<string, MarketingProduct> = {
    meridia: {
        id: 'meridia',
        name: 'Meridia™',
        tagline: 'The Architecture of Internal Comfort.',
        hook: 'Beyond the clinical. Beyond the guess work. Meridia™ maps the precise geometry of your internal comfort, creating a biological blueprint that ensures every interaction is informed by your unique anatomy.',
        theExperience: 'Using Meridia™ is a moment of quiet, clinical clarity. In a dedicated session, the device uses gentle, controlled expansion to map the pressure distribution and structural nuances of your internal physiology. It isn’t just measurement—it’s a discovery of your body’s own comfort zones. The result is a high-resolution "Geometry Signature" that stays with you, privately, ensuring that any future fitting or interaction is built on a foundation of anatomical truth.',
        synergy: 'While Meridia™ maps your internal state, Caliber™ captures the external. Together, they create "Fit Harmony"—a complete 360-degree understanding of your physical interface. When paired, the Nexalis system can predict exactly how external forms will interact with your internal comfort, eliminating friction before it begins.',
        trust: 'Meridia™ operates on a "Privacy-by-Hardware" principle. No cameras, no photos. Just pure, abstract data loops that are encrypted at the edge and never leave your control as a raw signal. Your anatomy is your most private asset; we treat it as such.',
        compatibility: 'Designed for compatibility with the broader Nexalis ecosystem, Meridia™ data is anchored by Compass™. By understanding your systemic recovery and cardiac load, Meridia™ can distinguish between temporary physiological shifts and your true anatomical baseline.',
        heroImage: 'meridia-modern-2.png'
    },
    caliber: {
        id: 'caliber',
        name: 'Caliber™',
        tagline: 'The Precise External Geometry.',
        hook: 'A ten-second scan. A lifetime of perfect fit. Caliber™ uses advanced optical displacement to capture your external profile without a single camera or photo.',
        theExperience: 'Caliber™ is designed for the modern lifestyle—fast, intuitive, and remarkably accurate. By simply guiding the device in a controlled scan motion, you capture a repeatable "Structural Footprint." It uses LiDAR and optical flow to map lengths, circumferences, and taper classifications with sub-millimeter precision. It’s an empowering ritual that replaces traditional, awkward measurement methods with a high-tech signature of your physical self.',
        synergy: 'Caliber™ is the external counterpart to Meridia™ and the tactical partner to Sentinel™. By establishing your structural baseline, Caliber™ allows Sentinel™ to interpret change with absolute precision. It’s the "Calibration Gate" that makes the rest of the ecosystem smarter.',
        trust: 'In a world of visual overreach, Caliber™ is a sanctuary. We’ve architected the device to be physically incapable of capturing explicit imagery. It "feels" your shape through light and motion, translating it into a geometric curve that only the Nexalis Engine can understand.',
        compatibility: 'Caliber™ data integrates seamlessly with the Nexalis Health App, providing instant size recommendations and compatibility scores with supported hardware. It’s the first step in a personalized biometric journey.',
        heroImage: 'caliber-wireframe-epic.png'
    },
    mantrix: {
        id: 'mantrix',
        name: 'Sentinel™',
        tagline: 'The Passive Pulse of Physiological Stability.',
        hook: 'The health of your most private physiology is a story told over years, not snapshots. Sentinel™ lives with you, capturing the subtle rhythms of your life without ever being felt.',
        theExperience: 'Sentinel™ is the ultimate "set and forget" wearable. Crafted from medical-grade, soft-touch silicone, it sits passively at the core of your physiological life. It doesn’t ask for attention. Instead, it works in the background, measuring response timing, structural stability, and thermal context. Over weeks and months, it builds a "Bio-Profile"—a longitudinal map of your vitality and recovery that alerts you to meaningful shifts before they become concerns.',
        synergy: 'Sentinel™ is the "Tactical Node." While Compass™ monitors your heart and stress, Sentinel™ monitors the specific physiological outcomes. They work in a closed-loop: Compass™ tells the system you’re stressed, and Sentinel™ shows how that stress affects your intimate health. It’s the full story, finally connected.',
        trust: 'Data is identity. Sentinel™ anonymizes your signals at the source. The system doesn’t store your raw arousal waves; it stores indices of health and patterns of recovery. You own the insights; we provide the protection.',
        compatibility: 'Pairs instantly with Compass™ for context-aware interpretation. Fully compatible with the Nexalis "Fit Profile" established by Caliber™ to ensure optimal sensor-to-skin contact.',
        heroImage: 'mantrix-product.png'
    },
    innersense: {
        id: 'innersense',
        name: 'Elaria™',
        tagline: 'Clinical Discretion in Pelvic Intelligence.',
        hook: 'Vaginal health is too often a black box of clinical visits and retroactive care. Elaria™ brings discrete, clinical-grade intelligence into your daily life.',
        theExperience: 'Elaria™ is a marvel of miniaturized engineering. A sealed, passive wearable designed for multi-day wear, it captures the metrics that matter most: internal temperature trends, micro-circulatory signals, and tissue state indices. It’s designed to be completely forgotten, functioning as a silent guardian of your pelvic wellness. It turns what was once a series of disjointed symptoms into a clear, data-driven narrative of your body’s natural cycles.',
        synergy: 'Elaria™ provides the "Internal Baseline" that completes the female physiological map. When paired with Compass™, it allows you to see how your daily stress, sleep, and exercise impact your pelvic health. It’s the missing piece in the holistic wellness puzzle.',
        trust: 'Discretion is paramount. Elaria™ communicates via a low-power, encrypted link and features a seamless, biocompatible encapsulation. It’s a medical-grade device built for personal empowerment.',
        compatibility: 'Integrated with the Nexalis Health Suite for cycle tracking, symptom-linked journaling, and recovery insights. Works as a primary data source for the Nexalis "Stability Index."',
        heroImage: 'elaria_white_bg.png'
    },
    compass: {
        id: 'compass',
        name: 'Compass™',
        tagline: 'The Systemic Anchor of Human Context.',
        hook: 'Local signals are meaningless without systemic context. Compass™ is the heart of the Nexalis ecosystem—the anchor that makes everything else make sense.',
        theExperience: 'Worn on the wrist or as a discrete patch, Compass™ is your 24/7 health companion. It doesn’t just track steps; it tracks the "Intimacy Context." By measuring cardiovascular load (ECG/PPG), autonomic balance (HRV/EDA), and circadian rhythms, it knows your state of stress and recovery. It provides the "truth layer" that allows Sentinel™ and Elaria™ to accurately interpret their local signals. When you look at your Compass™ score, you’re looking at your readiness for life.',
        synergy: 'Compass™ is the "Master Sync" beacon. It coordinates the timing of every other node in the system. Without Compass™, a spike in heart rate might be misinterpreted; with Compass™, the system knows if that spike was stress, exercise, or a moment of true connection.',
        trust: 'As the hub of your systemic data, Compass™ features our most advanced edge-encryption. It processes your stress and recovery indices locally, only sharing the necessary context with other nodes to maintain a complete, yet fragmented (and thus more secure), data architecture.',
        compatibility: 'The universal anchor for all Nexalis nodes. Required for "Intimacy Intelligence" scoring and cross-node correlation.',
        heroImage: 'compass-realistic.png'
    }
};
