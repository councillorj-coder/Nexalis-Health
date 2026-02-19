export type Status = 'Stable' | 'Beta' | 'Dev' | 'Concept' | 'Deprecated';
export type IssueStatus = 'Todo' | 'In Progress' | 'Review' | 'Done';
export type Discipline = 'Firmware' | 'Hardware' | 'Software' | 'Mechanical';

export interface NodeStatus {
  id: string;
  name: string;
  status: Status;
  category: 'Male' | 'Female' | 'Neutral';
  domains: string[];
  description: string;
  tagline: string;
  purpose: string;
  keyMeasurements: string[];
  outputs: string[];
  formFactor: string;
  innovations: string[];
  specifications: SpecItem[];
  patentStatus: string;
}

export interface SpecItem {
  category: string;
  parameter: string;
  value: string;
  notes?: string;
}

export interface Issue {
  id: string;
  title: string;
  discipline: Discipline;
  status: IssueStatus;
  effort: string;
  dod: string[];
}

export const buildFocus = {
  sprint: 'Sprint 24.08',
  targets: [
    'Sentinel™ v0.9 Firmware Handover',
    'Data Pipeline Sample Rate Optimization (100Hz -> 60Hz)',
    'BLE Connection Stability Patch'
  ],
  constraints: [
    'Compute ceiling on nRF52840',
    'Battery physical dimensions fixed'
  ],
  unknowns: [
    'Thermal dissipation in sealed enclosure',
    'Long-term sensor drift compensation'
  ]
};

export const architectureNodes = [
  'Biosignals (Analog)',
  'ADC / AFE',
  'MCU (Preprocessing)',
  'BLE Transport',
  'Mobile App (Buffer)',
  'Cloud (Storage/Analysis)'
];

export const nodes: NodeStatus[] = [
  {
    id: 'mantrix',
    name: 'Sentinel™',
    status: 'Beta',
    category: 'Male',
    domains: ['Structural Stability', 'Circulation Response', 'Thermal Context', 'Variability Patterns'],
    description: 'A soft, sealed wearable designed for passive, non-invasive monitoring of erectile physiology. It captures continuous real-world data—response timing, stability patterns, and subtle variability—establishing personal baselines and detecting meaningful change over time.',
    tagline: 'Clinical-grade rigidity and physiological signal acquisition.',
    purpose: 'To capture what has never been measurable at home: continuous, real-world erectile physiology using passive, non-invasive sensing.',
    keyMeasurements: ['Response timing patterns', 'Structural stability over time', 'Variability signatures', 'Thermal context trends'],
    outputs: ['Baseline Reference Score', 'Trend Direction Indicator', 'Consistency Pattern', 'Recovery Tracking'],
    formFactor: 'Soft, sealed wearable ring',
    innovations: [
      'Magnetic Displacement Sensing: Uses Hall-effect to measure micron-scale circumference changes.',
      'Thermal Context Trends: Clinical-grade temperature sensors for artifact rejection and context marking.',
      'Active Haptic Priming: Closed-loop vibration feedback for user-enabled guidance or stimulus.',
      'Validity Gating: Multi-sensor agreement (Pressure + Strain + PPG) for trust scoring.'
    ],
    specifications: [
      { category: 'Sensing', parameter: 'Magnetic', value: 'High-precision Hall-Effect' },
      { category: 'Sensing', parameter: 'Pressure', value: 'Distributed force-sensing resistors' },
      { category: 'Mechanical', parameter: 'Closure', value: 'C-Shape or Fully Enclosed options' },
      { category: 'Privacy', parameter: 'Abstraction', value: 'No raw waveform output; indices only' }
    ],
    patentStatus: 'Patent Pending (Feb 2026)'
  },
  {
    id: 'innersense',
    name: 'Elaria™',
    status: 'Dev',
    category: 'Female',
    domains: ['Pelvic Physiology', 'Thermal Regulation', 'Longitudinal Tracking', 'Minimal Friction'],
    description: 'A sealed, passive intravaginal wearable designed to capture real pelvic physiology in everyday life. It enables longitudinal monitoring of internal temperature trends, tissue state, and circulatory signals—with minimal user friction and maximum discretion.',
    tagline: 'Clinical-grade pelvic physiology signal acquisition.',
    purpose: 'To enable longitudinal pelvic health monitoring in everyday life—capturing what cannot be measured in clinical snapshots.',
    keyMeasurements: ['Internal temperature trends', 'Tissue state indicators', 'Circulatory signals', 'Pelvic activity patterns'],
    outputs: ['Baseline Tracking', 'Change Detection', 'Symptom-Linked Journaling', 'Recovery Insights'],
    formFactor: 'Sealed, passive intravaginal wearable',
    innovations: [
      'Multi-Frequency Bio-Impedance: Frequency-dependent tissue state extraction.',
      'Solid-State pH Sensing: ISFET-based pH monitoring for longitudinal trends.',
      'Capacitive Wetness Trends: Dielectric sensing to characterize moisture patterns.',
      'Contoured Profile: Optimized for migration resistance and anatomical stability.'
    ],
    specifications: [
      { category: 'Sensing', parameter: 'pH', value: 'ISFET Solid-State' },
      { category: 'Sensing', parameter: 'Impedance', value: '4-Electrode Multi-Frequency' },
      { category: 'Materials', parameter: 'Outer Shell', value: 'Medical-grade Biocompatible Silicone' },
      { category: 'Safety', parameter: 'Retrieval', value: 'Integrated flexible tab/loop' }
    ],
    patentStatus: 'Patent Pending (Feb 2026)'
  },
  {
    id: 'caliber',
    name: 'Caliber™',
    status: 'Concept',
    category: 'Male',
    domains: ['Structural Profile', 'Guided Self-Scan', 'Privacy-First Design', 'Repeatable Footprint'],
    description: 'A fast fit-profiling device that captures a repeatable structural footprint through guided self-scan motion. It uses privacy-first design—no cameras, no photos, no explicit imagery—to establish personalized size and shape references.',
    tagline: 'Fast fit-profile scanning for length, circumference, and shape.',
    purpose: 'To eliminate guesswork in sizing and fitment by capturing a repeatable penile footprint—without cameras, photos, or explicit imagery.',
    keyMeasurements: ['Length profile', 'Circumference mapping', 'Shape geometry', 'Structural consistency'],
    outputs: ['Personalized Fit Profile', 'Size Recommendations', 'Shape Classification', 'Cross-Session Stability'],
    formFactor: 'Handheld guided-scan device',
    innovations: [
      'Optical Flow Length Estimation: Mouse-style motion sensors for axial distance tracking.',
      'Multi-Angle Diameter Sensing: ToF/LiDAR array for cross-sectional profile mapping.',
      'Anti-Spoof Confirmation: Integrated PPG for physiologic "live" validation.',
      'Dynamic Scan Guidance: Real-time haptic/visual feedback for consistent speed.'
    ],
    specifications: [
      { category: 'Distance', parameter: 'Resolution', value: 'Sub-millimeter axial/radial' },
      { category: 'Optics', parameter: 'Diameter', value: 'LiDAR / Time-of-Flight' },
      { category: 'Guidance', parameter: 'Haptics', value: 'Tactile speed markers' },
      { category: 'Security', parameter: 'Integrity', value: 'Encrypted buffer; no explicit imagery' }
    ],
    patentStatus: 'Patent Pending (Feb 2026)'
  },
  {
    id: 'meridia',
    name: 'Meridia™',
    status: 'Dev',
    category: 'Female',
    domains: ['Internal Geometry', 'Pressure Mapping', 'Session-Based', 'Conforming Design'],
    description: 'A session-based internal mapping wand designed to capture repeatable pressure distribution signatures and geometry profiles. It uses a conforming, non-rigid design to establish personalized comfort references for fitment intelligence.',
    tagline: 'Session-based internal mapping for geometry + fitment intelligence.',
    purpose: 'To capture repeatable pressure distribution signatures and internal geometry for personalized comfort modeling.',
    keyMeasurements: ['Pressure distribution', 'Internal geometry', 'Max-expansion index', 'Comfort zone mapping'],
    outputs: ['Comfort Reference Profile', 'Geometry Signature', 'Fitment Intelligence Score', 'Expansion Tracking'],
    formFactor: 'Session-based internal mapping wand',
    innovations: [
      'Controlled Radial Stimulus: Integrated microbladder/annular cuff expansion.',
      'Ultrasound Endpointing: Longitudinal distance sensing across moisture/tissue states.',
      'Compliance Relationship Index: Correlates expansion pressure with tissue response.',
      'Anatomically Agnostic: Scalable geometry measurement for diverse users.'
    ],
    specifications: [
      { category: 'Sensing', parameter: 'Endpoint', value: 'Ultrasound A-Mode / IR ToF' },
      { category: 'Actuation', parameter: 'Expansion', value: 'Pneumatic Annular Cuff' },
      { category: 'Sensing', parameter: 'Pressure', value: 'MEMS Pressure Transducer' },
      { category: 'Mechanical', parameter: 'Handle', value: 'Integrated pneumatic reservoir/pump' }
    ],
    patentStatus: 'Patent Pending (Feb 2026)'
  },
  {
    id: 'compass',
    name: 'Compass™',
    status: 'Stable',
    category: 'Neutral',
    domains: ['Systemic Context', 'Recovery State', 'Cardiovascular Load', 'Daily Rhythm'],
    description: 'The context anchor for the Nexalis system. It captures whole-body signals—cardiovascular load, recovery state, autonomic balance, and daily rhythm—so intimate-region data can be interpreted with full systemic context.',
    tagline: 'Systemic context node for longitudinal health interpretation.',
    purpose: 'To provide whole-body context so intimate-region markers can be interpreted with clarity—linking local signals to systemic state.',
    keyMeasurements: ['Cardiovascular load', 'Recovery state', 'Autonomic balance', 'Daily rhythm patterns'],
    outputs: ['Health Context Score', 'Recovery Index', 'Systemic Baseline', 'Cross-Node Correlation'],
    formFactor: 'Wrist-worn context device',
    innovations: [
      'Systemic Context Anchor: Provides truth layer for state-conditioned interpretation.',
      'Autonomic Pulse-HRV Fusion: Correlates EDA with HRV for stress tagging.',
      'Intimate-Node Validity Gating: Enables/disables other nodes based on systemic state.',
      'Like-for-Like Trend Matching: Only compares data from equivalent recovery states.'
    ],
    specifications: [
      { category: 'Sensing', parameter: 'Cardiac', value: 'ECG Electrodes + PPG' },
      { category: 'Sensing', parameter: 'Autonomic', value: 'Electrodermal Activity (EDA)' },
      { category: 'Compute', parameter: 'Role', value: 'System Master / Time Sync beacon' },
      { category: 'Sensing', parameter: 'Respiration', value: 'Inertial Proxy + Impedance' }
    ],
    patentStatus: 'Patent Pending (Feb 2026)'
  }
];

export const mantrixSpecs: SpecItem[] = [
  { category: 'Requirements', parameter: 'Battery Life', value: '> 8 Hours', notes: 'Active measure mode' },
  { category: 'Requirements', parameter: 'Waterproofing', value: 'IP68', notes: 'Submersible 1.5m 30min' },
  { category: 'Sensor Stack', parameter: 'Strain Gauge', value: 'Dual-axis soft elastomer', notes: 'Custom fab' },
  { category: 'Sensor Stack', parameter: 'IMU', value: 'BOSCH BMI270', notes: '6-axis' },
  { category: 'Sensor Stack', parameter: 'Temp', value: 'Maxim MAX30205', notes: 'Clinical grade 0.1C' },
  { category: 'Power', parameter: 'Capacity', value: '120mAh LiPo', notes: 'Coin cell form factor' },
  { category: 'Power', parameter: 'Charging', value: 'Qi Wireless', notes: '2.5W Rx' },
  { category: 'Compute', parameter: 'MCU', value: 'Nordic nRF52840', notes: '64MHz Cortex-M4F' },
  { category: 'Outputs', parameter: 'Haptics', value: 'LRA', notes: 'Feedback motor' }
];

export const openQuestions = [
  'Optimizing BLE packet overhead for 60Hz raw stream',
  'Calibration procedure for strain gauge degradation over time',
  'User feedback loop latency target < 50ms?'
];

export const appContracts = `
// TypeScript Interfaces

interface RawSample {
  timestamp: number; // Unix ms
  tumescence_raw: number; // ADC value 0-4096
  rigidity_newtons: number; // Calibrated force
  temp_c: number;
  battery_mv: number;
}

interface AbstractMetric {
  session_id: string;
  metric_type: 'EQ' | 'Duration' | 'Tmax';
  value: number;
  confidence: number; // 0.0 - 1.0
}

interface SessionSummary {
  id: string;
  user_id: string;
  start_time: string; // ISO
  end_time: string; // ISO
  duration_sec: number;
  tags: string[];
}
`;

export const validationChecklist = [
  { item: 'Unit Test Coverage > 80%', status: 'Pass' },
  { item: 'End-to-End Latency < 100ms', status: 'Fail' },
  { item: 'Battery Rundown Test (8h)', status: 'Pass' },
  { item: 'Waterproof Immersion 30m', status: 'Pending' },
  { item: 'BLE Reconnection in < 2s', status: 'Pass' }
];

export const backlog: Issue[] = [
  {
    id: 'FW-102',
    title: 'Implement Deep Sleep Mode',
    discipline: 'Firmware',
    status: 'In Progress',
    effort: 'M',
    dod: ['Current draw < 5uA', 'Wake on motion', 'Wake on charge']
  },
  {
    id: 'SW-205',
    title: 'Chart Render Performance Fix',
    discipline: 'Software',
    status: 'Todo',
    effort: 'S',
    dod: ['60FPS scroll', 'WebGL renderer']
  },
  {
    id: 'HW-055',
    title: 'Flex PCB Layout Revision B',
    discipline: 'Hardware',
    status: 'Review',
    effort: 'L',
    dod: ['Gerbers generated', 'DRC Pass', 'Vendor BOM confirmed']
  },
  {
    id: 'SW-210',
    title: 'Data Export to CSV',
    discipline: 'Software',
    status: 'Done',
    effort: 'XS',
    dod: ['Download button works', 'Headers correct']
  }
];
