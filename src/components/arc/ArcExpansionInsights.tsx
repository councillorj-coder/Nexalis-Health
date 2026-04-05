import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import ArcAtmosphere from './ArcAtmosphere';
import { InlineAmoraInsight, type ArcAmoraGuidanceLevel } from './ArcAmora';
import { useArcSimulationClock } from './ArcSimulationClock';
import { foundationTheme, getArcGlassPillStyle, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgbTuple, hexToRgba } from './arc-theme';
import type { Session } from '../../data/arc-types';
import type { ArcLiveLinePhase, ArcLiveTelemetry, ArcLiveTelemetryTrend, ArcThresholdModel } from '../../data/arc-app-data';

const LIVE_WIDTH = 400;
const LIVE_HEIGHT = 100;
const LIVE_SAMPLES = 56;
const HOLD_CENTER = 55;
const HOLD_MIN = 49;
const HOLD_MAX = 61;
const DETAIL_THRESHOLD_PERCENTAGES = {
  reduced: 20,
  baseline: 22.5,
  elevated: 26,
  activeEntry: 65,
  peak: 100,
  record: 107,
} as const;
const DETAIL_DOMAIN_MIN = 0;
const DETAIL_DOMAIN_MAX = 110;
const FLACCID_BASELINE_MEAN = 22.4;
const FLACCID_BASELINE_MIN = 20;
const FLACCID_BASELINE_MAX = 25;
const FLACCID_ELEVATED_MIN = 26;
const FLACCID_ELEVATED_MAX = 35;
const SESSION_ACTION_VISIBLE_MS = 8000;
const SESSION_ACTION_EXIT_MS = 320;

export type ArcPerformancePresetId = 'poor' | 'below_average' | 'average' | 'strong' | 'exceptional';

type ArcPerformancePreset = {
  id: ArcPerformancePresetId;
  label: string;
  shortLabel: string;
  description: string;
  baselineShift: number;
  averageMaxShift: number;
  daytimeQualityShift: number;
  daytimeStabilityShift: number;
  nocturnalQualityShift: number;
  nocturnalStabilityShift: number;
  daytimeEventBias: number;
  nocturnalEventBias: number;
  volatilityShift: number;
  recoveryShift: number;
  motionBias: number;
  livePeakShift: number;
};

const ARC_PERFORMANCE_PRESETS: readonly ArcPerformancePreset[] = [
  {
    id: 'poor',
    label: 'Poor Performer',
    shortLabel: 'Poor',
    description: 'Lower rise, shorter holds, lighter overnight support, and less reliable usable sessions.',
    baselineShift: -1.8,
    averageMaxShift: -9,
    daytimeQualityShift: -0.22,
    daytimeStabilityShift: -0.18,
    nocturnalQualityShift: -0.18,
    nocturnalStabilityShift: -0.16,
    daytimeEventBias: -0.9,
    nocturnalEventBias: -0.8,
    volatilityShift: 0.2,
    recoveryShift: 0.18,
    motionBias: -0.18,
    livePeakShift: -10,
  },
  {
    id: 'below_average',
    label: 'Below Average',
    shortLabel: 'Below Avg',
    description: 'Usable activity appears, but with softer peaks, lighter holds, and more variable recovery.',
    baselineShift: -0.9,
    averageMaxShift: -4.5,
    daytimeQualityShift: -0.1,
    daytimeStabilityShift: -0.08,
    nocturnalQualityShift: -0.08,
    nocturnalStabilityShift: -0.07,
    daytimeEventBias: -0.35,
    nocturnalEventBias: -0.2,
    volatilityShift: 0.1,
    recoveryShift: 0.08,
    motionBias: -0.08,
    livePeakShift: -4,
  },
  {
    id: 'average',
    label: 'Average',
    shortLabel: 'Average',
    description: 'Balanced real-world baseline for moderate peaks, usable sessions, and normal overnight support.',
    baselineShift: 0,
    averageMaxShift: 0,
    daytimeQualityShift: 0,
    daytimeStabilityShift: 0,
    nocturnalQualityShift: 0,
    nocturnalStabilityShift: 0,
    daytimeEventBias: 0,
    nocturnalEventBias: 0,
    volatilityShift: 0,
    recoveryShift: 0,
    motionBias: 0,
    livePeakShift: 0,
  },
  {
    id: 'strong',
    label: 'Strong',
    shortLabel: 'Strong',
    description: 'Higher peak quality, better staying power, steadier motion control, and stronger overnight support.',
    baselineShift: 0.7,
    averageMaxShift: 4.2,
    daytimeQualityShift: 0.08,
    daytimeStabilityShift: 0.08,
    nocturnalQualityShift: 0.08,
    nocturnalStabilityShift: 0.08,
    daytimeEventBias: 0.3,
    nocturnalEventBias: 0.24,
    volatilityShift: -0.06,
    recoveryShift: -0.08,
    motionBias: 0.08,
    livePeakShift: 4.5,
  },
  {
    id: 'exceptional',
    label: 'Exceptional',
    shortLabel: 'Exceptional',
    description: 'Rare upper-range pattern with stronger peaks, better support, cleaner motion behavior, and deeper recovery.',
    baselineShift: 1.25,
    averageMaxShift: 7.4,
    daytimeQualityShift: 0.16,
    daytimeStabilityShift: 0.14,
    nocturnalQualityShift: 0.15,
    nocturnalStabilityShift: 0.14,
    daytimeEventBias: 0.55,
    nocturnalEventBias: 0.45,
    volatilityShift: -0.12,
    recoveryShift: -0.12,
    motionBias: 0.14,
    livePeakShift: 8.5,
  },
] as const;

export function getArcPerformancePresets() {
  return ARC_PERFORMANCE_PRESETS.map(({ id, label, shortLabel, description }) => ({
    id,
    label,
    shortLabel,
    description,
  }));
}

function getArcPerformancePreset(presetId: ArcPerformancePresetId = 'average') {
  return ARC_PERFORMANCE_PRESETS.find(preset => preset.id === presetId) ?? ARC_PERFORMANCE_PRESETS[2]!;
}

type LivePhase = 'hold' | 'transition' | 'return';
type LiveInsightState = 'reduced' | 'baseline' | 'elevated';
type LiveDetailSimulationPhase =
  | 'idle'
  | 'restingHold'
  | 'earlyRise'
  | 'activeEntry'
  | 'activeRise'
  | 'plateau'
  | 'decline'
  | 'recovery'
  | 'nocturnalRise'
  | 'nocturnalHold'
  | 'nocturnalDecline';
type LiveDetailStateKey = 'reduced' | 'baseline' | 'elevated' | 'entering' | 'active' | 'peak' | 'returning';
type DetailThresholdKey = keyof typeof DETAIL_THRESHOLD_PERCENTAGES;
type DetailThresholdDefinition = {
  key: DetailThresholdKey;
  label: string;
  value: number;
  color: readonly [number, number, number];
  priority: 'primary' | 'secondary' | 'tertiary';
  placement: 'left' | 'right';
};
type LiveDetailState = {
  key: LiveDetailStateKey;
  label: string;
  toneColor: string;
  chipBorderColor: string;
  chipBackground: string;
  chipTextColor: string;
  insightKey: LiveInsightState | null;
};
type LiveDetailSignalSnapshot = {
  history: number[];
  historyLinePhases: ArcLiveLinePhase[];
  currentValue: number;
  phase: LiveDetailSimulationPhase;
  linePhase: ArcLiveLinePhase;
  isSimulating: boolean;
  isNocturnalActive: boolean;
  simulateEvent: () => void;
};
export type ArcLiveSignalSnapshot = LiveDetailSignalSnapshot;
type DetailSimulationStage = {
  id: Exclude<LiveDetailSimulationPhase, 'idle'>;
  duration: number;
  target: number;
  jitter: number;
};
type SessionIndicatorState = 'idle' | 'inProgress' | 'ready';

type LiveSignalSnapshot = {
  history: number[];
  currentValue: number;
  baseline: number;
};

type LiveSignalOptions = {
  samples: number;
  sampleInterval: number;
  quietRange: [number, number];
  moveRange: [number, number];
  transitionRange: [number, number];
  settleRange: [number, number];
  returnToBaseline?: boolean;
  anchorToBaseline?: boolean;
  breathing: {
    holdSin: number;
    holdCos: number;
    settleSin: number;
    settleCos: number;
    holdSpeedA: number;
    holdSpeedB: number;
    settleSpeedA: number;
    settleSpeedB: number;
  };
};

const RECORD_COLOR = hexToRgbTuple(foundationTheme.accent.secondary);
const PEAK_COLOR = hexToRgbTuple(foundationTheme.chart.peak);
const ACTIVE_ENTRY_COLOR = hexToRgbTuple(foundationTheme.signal.warning);
const ELEVATED_COLOR = hexToRgbTuple(foundationTheme.signal.up);
const BASELINE_COLOR = hexToRgbTuple(foundationTheme.chart.baseline);
const REDUCED_COLOR = hexToRgbTuple(foundationTheme.signal.down);

function resolveThresholdModel(thresholdModel?: ArcThresholdModel) {
  return {
    reduced: thresholdModel?.reduced ?? DETAIL_THRESHOLD_PERCENTAGES.reduced,
    baseline: thresholdModel?.baseline ?? DETAIL_THRESHOLD_PERCENTAGES.baseline,
    elevated: thresholdModel?.elevated ?? DETAIL_THRESHOLD_PERCENTAGES.elevated,
    activeEntry: thresholdModel?.activeEntry ?? DETAIL_THRESHOLD_PERCENTAGES.activeEntry,
    peak: thresholdModel?.peak ?? DETAIL_THRESHOLD_PERCENTAGES.peak,
    record: thresholdModel?.record ?? DETAIL_THRESHOLD_PERCENTAGES.record,
    baselineReady: thresholdModel?.baselineReady ?? false,
    peakReady: thresholdModel?.peakReady ?? false,
    nocturnalReady: thresholdModel?.nocturnalReady ?? false,
  };
}

function buildDetailThresholds(thresholdModel?: ArcThresholdModel): DetailThresholdDefinition[] {
  const resolved = resolveThresholdModel(thresholdModel);

  return [
    {
      key: 'record',
      label: resolved.peakReady ? 'Record' : 'Record est',
      value: resolved.record,
      color: RECORD_COLOR,
      priority: 'tertiary',
      placement: 'right',
    },
    {
      key: 'peak',
      label: resolved.peakReady ? 'Peak' : 'Peak est',
      value: resolved.peak,
      color: PEAK_COLOR,
      priority: 'tertiary',
      placement: 'right',
    },
    {
      key: 'activeEntry',
      label: 'Active',
      value: resolved.activeEntry,
      color: ACTIVE_ENTRY_COLOR,
      priority: 'secondary',
      placement: 'left',
    },
    {
      key: 'elevated',
      label: resolved.baselineReady ? 'Elevated' : 'Elevated est',
      value: resolved.elevated,
      color: ELEVATED_COLOR,
      priority: 'primary',
      placement: 'left',
    },
    {
      key: 'baseline',
      label: resolved.baselineReady ? 'Baseline' : 'Baseline est',
      value: resolved.baseline,
      color: BASELINE_COLOR,
      priority: 'primary',
      placement: 'left',
    },
    {
      key: 'reduced',
      label: resolved.baselineReady ? 'Reduced' : 'Reduced est',
      value: resolved.reduced,
      color: REDUCED_COLOR,
      priority: 'primary',
      placement: 'left',
    },
  ];
}

const DETAIL_MINOR_GUIDES = [40, 80];
const FULLSCREEN_AXIS_VALUES = Array.from({ length: 21 }, (_, index) => 100 - index * 5);
const TREND_AXIS_VALUES = [100, 50, 0] as const;
const TREND_GUIDE_VALUES = [72, 50, 28] as const;
const TREND_CHART_WIDTH = 1000;
const TREND_CHART_HEIGHT = 188;
const TREND_PLOT_LEFT = 68;
const TREND_PLOT_RIGHT = 34;
const TREND_TOP_PADDING_RATIO = 0.13;
const TREND_BOTTOM_PADDING_RATIO = 0.2;
const TREND_PRIMARY_RANGE_KEYS: TrendRangeKey[] = ['24h', '48h', 'week'];
const TREND_TOOLTIP_MIN_X = 12;
const TREND_TOOLTIP_MAX_X = 88;
const ONE_HOUR_IN_MS = 60 * 60 * 1000;
const FIVE_HOURS_IN_MS = 5 * 60 * 60 * 1000;
const MIN_TREND_RENDERABLE_SPAN_MS = 30 * 60 * 1000;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

type TrendRangeKey = '1h' | '5h' | '24h' | '48h' | 'week' | 'month';
export type ArcTrendViewMode = 'accumulated' | 'demo-seeded';
export type ArcTrendHistoryPoint = {
  timestamp: number;
  value: number;
  linePhase?: ArcLiveLinePhase;
};
type TrendRangeDefinition = {
  key: TrendRangeKey;
  label: string;
  totalMinutes: number;
  points: number;
  smoothingPasses: number;
  tailPoints: number;
  axisFractions: number[];
  showNocturnalBands: boolean;
  showDaySeparators: boolean;
  markerCount: number;
};
type HistoricalSignalPoint = {
  time: Date;
  value: number;
  context: 'day' | 'night';
  linePhase: ArcLiveLinePhase;
};
type HistoricalSignalWindow = {
  start: Date;
  end: Date;
  rolling: boolean;
};
type HistoricalSignalBand = {
  start: Date;
  end: Date;
  kind: 'nocturnal';
};
type HistoricalSignalMarker = {
  time: Date;
  value: number;
  label: string;
  color: string;
};
type HistoricalSignalAxisLabel = {
  time: Date;
  label: string;
  align: 'left' | 'center' | 'right';
  priority: number;
};
type HistoricalSignalDataset = {
  window: HistoricalSignalWindow;
  points: HistoricalSignalPoint[];
  bands: HistoricalSignalBand[];
  separators: Date[];
  markers: HistoricalSignalMarker[];
  axisLabels: HistoricalSignalAxisLabel[];
  hasMeaningfulHistory: boolean;
  isSeeded: boolean;
};

function getCollectedHistorySpanMs(
  trendHistory: ArcTrendHistoryPoint[] | undefined,
  cutoffDate: Date,
  trendMode: ArcTrendViewMode,
) {
  if (trendMode === 'demo-seeded') {
    return Number.POSITIVE_INFINITY;
  }

  const cutoff = cutoffDate.getTime();
  const validHistory = (trendHistory ?? [])
    .filter(point => point.timestamp <= cutoff)
    .sort((left, right) => left.timestamp - right.timestamp);

  if (validHistory.length < 2) {
    return 0;
  }

  return Math.max(0, cutoff - validHistory[0]!.timestamp);
}

const TREND_RANGE_DEFINITIONS: TrendRangeDefinition[] = [
  {
    key: '1h',
    label: '1H',
    totalMinutes: 60,
    points: 72,
    smoothingPasses: 2,
    tailPoints: 14,
    axisFractions: [0, 0.25, 0.5, 0.75, 1],
    showNocturnalBands: false,
    showDaySeparators: false,
    markerCount: 0,
  },
  {
    key: '5h',
    label: '5H',
    totalMinutes: 5 * 60,
    points: 60,
    smoothingPasses: 1,
    tailPoints: 12,
    axisFractions: [0, 0.25, 0.5, 0.75, 1],
    showNocturnalBands: false,
    showDaySeparators: false,
    markerCount: 0,
  },
  {
    key: '24h',
    label: '24H',
    totalMinutes: 24 * 60,
    points: 96,
    smoothingPasses: 2,
    tailPoints: 18,
    axisFractions: [0, 0.25, 0.5, 0.75, 1],
    showNocturnalBands: true,
    showDaySeparators: false,
    markerCount: 1,
  },
  {
    key: '48h',
    label: '48H',
    totalMinutes: 48 * 60,
    points: 112,
    smoothingPasses: 3,
    tailPoints: 18,
    axisFractions: [0, 0.25, 0.5, 0.75, 1],
    showNocturnalBands: true,
    showDaySeparators: true,
    markerCount: 2,
  },
  {
    key: 'week',
    label: 'Week',
    totalMinutes: 7 * 24 * 60,
    points: 112,
    smoothingPasses: 4,
    tailPoints: 16,
    axisFractions: [0, 0.24, 0.5, 0.76, 1],
    showNocturnalBands: true,
    showDaySeparators: true,
    markerCount: 3,
  },
  {
    key: 'month',
    label: 'Month',
    totalMinutes: 30 * 24 * 60,
    points: 96,
    smoothingPasses: 4,
    tailPoints: 12,
    axisFractions: [0, 0.25, 0.5, 0.75, 1],
    showNocturnalBands: true,
    showDaySeparators: true,
    markerCount: 2,
  },
];

function formatClockLabel(date: Date) {
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });
}

type SessionMotionProfile = {
  qualifies: boolean;
  confidence: number;
  motion: NonNullable<Session['motion']>;
  motionWaveform: number[];
};

function formatDurationLabel(totalSeconds: number) {
  return `${Math.floor(totalSeconds / 60)}m ${String(totalSeconds % 60).padStart(2, '0')}s`;
}

function formatMinutesLabel(minutes: number) {
  return `${minutes.toFixed(1)}m`;
}

function describePeakQuality(peakLevel: number, thresholds: ReturnType<typeof resolveThresholdModel>) {
  if (peakLevel >= thresholds.record) return 'Exceptional';
  if (peakLevel >= thresholds.peak + 2) return 'Outstanding';
  if (peakLevel >= thresholds.peak) return 'Strong';
  if (peakLevel >= thresholds.activeEntry + 14) return 'Elevated';
  return 'Qualified';
}

function describeHoldQuality(stabilityScore: number, holdDurationSeconds: number) {
  const composite = stabilityScore * 0.72 + Math.min(holdDurationSeconds / 60, 16) * 2.4;

  if (composite >= 88) return 'Locked in';
  if (composite >= 80) return 'Steady';
  if (composite >= 72) return 'Controlled';
  if (composite >= 64) return 'Developing';
  return 'Brief';
}

function describeNocturnalQuality(qualityScore: number, stabilityScore: number) {
  const composite = qualityScore * 0.58 + stabilityScore * 0.42;

  if (composite >= 0.82) return 'High support';
  if (composite >= 0.68) return 'Steady support';
  if (composite >= 0.54) return 'Moderate support';
  return 'Light support';
}

function buildDaytimeSessionAnalysis(options: {
  qualityScore: number;
  stabilityScore: number;
  peakLevel: number;
  thresholds: ReturnType<typeof resolveThresholdModel>;
  buildSeconds: number;
  totalDurationSeconds: number;
  holdDurationSeconds: number;
  recoveryMinutes: number;
  motionProfile?: SessionMotionProfile | null;
}) {
  const {
    qualityScore,
    stabilityScore,
    peakLevel,
    thresholds,
    buildSeconds,
    totalDurationSeconds,
    holdDurationSeconds,
    recoveryMinutes,
    motionProfile,
  } = options;

  const peakIntegrityScore = Math.round(
    clamp(
      50 +
        qualityScore * 26 +
        stabilityScore * 11 +
        ((peakLevel - thresholds.activeEntry) / Math.max(thresholds.peak - thresholds.activeEntry, 1)) * 12,
      42,
      98,
    ),
  );
  const buildEfficiencyScore = Math.round(clamp(92 - (buildSeconds / 60) * 3.6 + qualityScore * 10, 42, 96));
  const holdEfficiencyScore = Math.round(
    clamp(46 + stabilityScore * 28 + Math.min(holdDurationSeconds / 60, 16) * 1.55 + qualityScore * 12, 42, 97),
  );
  const recoveryEfficiencyScore = Math.round(clamp(94 - recoveryMinutes * 3.5 + qualityScore * 10, 40, 96));
  const controlScore = Math.round(
    clamp(48 + stabilityScore * 24 + qualityScore * 18 + Math.min(totalDurationSeconds / 60, 18) * 0.9, 42, 96),
  );
  const motionEfficiencyScore =
    motionProfile && motionProfile.qualifies
      ? Math.round(
          clamp(
            (motionProfile.motion.rhythmConsistency ?? 60) * 0.32 +
              (motionProfile.motion.motionStability ?? 60) * 0.28 +
              motionProfile.confidence * 28 +
              clamp(motionProfile.motion.driveCount / 2.4, 12, 38),
            42,
            97,
          ),
        )
      : undefined;
  const rhythmControlScore =
    motionProfile && motionProfile.qualifies
      ? Math.round(
          clamp(
            (motionProfile.motion.rhythmConsistency ?? 60) * 0.52 +
              (motionProfile.motion.motionStability ?? 60) * 0.48,
            42,
            97,
          ),
        )
      : undefined;
  const sessionQualityScore = Math.round(
    clamp(
      peakIntegrityScore * 0.22 +
        holdEfficiencyScore * 0.24 +
        controlScore * 0.18 +
        buildEfficiencyScore * 0.12 +
        recoveryEfficiencyScore * 0.12 +
        (motionEfficiencyScore ?? peakIntegrityScore) * 0.12,
      42,
      98,
    ),
  );

  return {
    buildEfficiencyScore,
    peakIntegrityScore,
    holdEfficiencyScore,
    recoveryEfficiencyScore,
    controlScore,
    sessionQualityScore,
    motionEfficiencyScore,
    rhythmControlScore,
  };
}

function buildNocturnalSessionAnalysis(options: {
  qualityScore: number;
  stabilityScore: number;
  peakLevel: number;
  thresholds: ReturnType<typeof resolveThresholdModel>;
  riseDurationSeconds: number;
  holdDurationSeconds: number;
  declineDurationSeconds: number;
}) {
  const {
    qualityScore,
    stabilityScore,
    peakLevel,
    thresholds,
    riseDurationSeconds,
    holdDurationSeconds,
    declineDurationSeconds,
  } = options;
  const peakIntegrityScore = Math.round(
    clamp(
      48 +
        qualityScore * 24 +
        stabilityScore * 14 +
        ((peakLevel - thresholds.activeEntry) / Math.max(thresholds.peak - thresholds.activeEntry, 1)) * 10,
      42,
      97,
    ),
  );
  const buildEfficiencyScore = Math.round(clamp(88 - (riseDurationSeconds / 60) * 2.4 + qualityScore * 8, 42, 95));
  const holdEfficiencyScore = Math.round(
    clamp(44 + stabilityScore * 30 + Math.min(holdDurationSeconds / 60, 26) * 1.3 + qualityScore * 10, 42, 98),
  );
  const recoveryEfficiencyScore = Math.round(
    clamp(88 - (declineDurationSeconds / 60) * 2 + qualityScore * 8 + stabilityScore * 5, 42, 95),
  );
  const overnightRegularityScore = Math.round(clamp(46 + qualityScore * 28 + stabilityScore * 26, 42, 98));
  const sessionQualityScore = Math.round(
    clamp(
      peakIntegrityScore * 0.24 +
        holdEfficiencyScore * 0.28 +
        overnightRegularityScore * 0.24 +
        buildEfficiencyScore * 0.1 +
        recoveryEfficiencyScore * 0.14,
      42,
      98,
    ),
  );

  return {
    buildEfficiencyScore,
    peakIntegrityScore,
    holdEfficiencyScore,
    recoveryEfficiencyScore,
    sessionQualityScore,
    overnightRegularityScore,
  };
}

function getMotionRhythm(consistency: number): NonNullable<Session['motion']>['rhythm'] {
  if (consistency >= 82) return 'Consistent';
  if (consistency >= 66) return 'Variable';
  return 'Irregular';
}

function getMotionIntensityBand(cadencePeak: number, driveCount: number): NonNullable<Session['motion']>['motionIntensity'] {
  if (cadencePeak >= 33 || driveCount >= 92) return 'High';
  if (cadencePeak >= 24 || driveCount >= 46) return 'Moderate';
  return 'Low';
}

function buildErectionWaveform(options: {
  seedKey: string;
  peakLevel: number;
  riseDurationSeconds: number;
  holdDurationSeconds: number;
  declineDurationSeconds: number;
  stabilityScore: number;
  baseline?: number;
  samples?: number;
}) {
  const {
    seedKey,
    peakLevel,
    riseDurationSeconds,
    holdDurationSeconds,
    declineDurationSeconds,
    stabilityScore,
    baseline = FLACCID_BASELINE_MEAN,
    samples = 32,
  } = options;
  const rng = createSeededRandom(hashSeed(`${seedKey}-erection-wave`));
  const totalDuration = Math.max(1, riseDurationSeconds + holdDurationSeconds + declineDurationSeconds);
  const amplitude = Math.max(peakLevel - baseline, 8);

  return Array.from({ length: samples }, (_, index) => {
    const progress = index / Math.max(1, samples - 1);
    const second = progress * totalDuration;

    if (second <= riseDurationSeconds) {
      const riseProgress = clamp(second / Math.max(1, riseDurationSeconds), 0, 1);
      const texture = Math.sin(riseProgress * Math.PI * 1.35 + rng() * 0.4) * amplitude * (0.008 + (1 - stabilityScore / 100) * 0.012);
      return Number(clamp(baseline + amplitude * easeSmoother(riseProgress) + texture, 0, DAYTIME_SIGNAL_MAX).toFixed(2));
    }

    if (second <= riseDurationSeconds + holdDurationSeconds) {
      const holdProgress = clamp((second - riseDurationSeconds) / Math.max(1, holdDurationSeconds), 0, 1);
      const plateauNoise =
        Math.sin(holdProgress * Math.PI * 2.1 + rng() * Math.PI * 2) * amplitude * (0.01 + (1 - stabilityScore / 100) * 0.018) +
        Math.cos(holdProgress * Math.PI * 3.2 + rng() * Math.PI) * amplitude * 0.006;
      const plateau = baseline + amplitude * (0.952 + Math.sin(holdProgress * Math.PI) * 0.02);
      return Number(clamp(plateau + plateauNoise, 0, DAYTIME_SIGNAL_MAX).toFixed(2));
    }

    const declineProgress = clamp(
      (second - riseDurationSeconds - holdDurationSeconds) / Math.max(1, declineDurationSeconds),
      0,
      1,
    );
    const declineNoise = Math.sin(declineProgress * Math.PI * 1.4 + rng() * 0.5) * amplitude * 0.01;
    return Number(clamp(baseline + amplitude * (1 - easeSmoother(declineProgress)) + declineNoise, 0, DAYTIME_SIGNAL_MAX).toFixed(2));
  });
}

function buildMotionWaveform(options: {
  seedKey: string;
  rhythmConsistency: number;
  driveCount: number;
  motionDurationMinutes: number;
  intensityBand: NonNullable<Session['motion']>['motionIntensity'];
  samples?: number;
}) {
  const { seedKey, rhythmConsistency, driveCount, motionDurationMinutes, intensityBand, samples = 32 } = options;
  const rng = createSeededRandom(hashSeed(`${seedKey}-motion-wave`));
  const cycles = clamp(Math.round(driveCount / 18), 3, 10);
  const baseIntensity =
    intensityBand === 'High'
      ? 0.78
      : intensityBand === 'Moderate'
        ? 0.58
        : 0.42;
  const consistencyFactor = rhythmConsistency / 100;

  return Array.from({ length: samples }, (_, index) => {
    const progress = index / Math.max(1, samples - 1);
    const envelope = Math.sin(progress * Math.PI);
    const beat = Math.abs(Math.sin(progress * Math.PI * cycles + rng() * 0.36));
    const secondary = Math.abs(Math.sin(progress * Math.PI * (cycles * 0.5 + 1.2) + rng() * 0.4));
    const texture = (1 - consistencyFactor) * (0.04 + rng() * 0.06);
    const durationLift = clamp(motionDurationMinutes / 12, 0.24, 1);
    const value = 0.08 + envelope * (baseIntensity * durationLift) * (0.52 + beat * 0.48 + secondary * 0.14) + texture;
    return Number(clamp(value, 0.02, 1).toFixed(3));
  });
}

function buildDaytimeMotionProfile(options: {
  seedKey: string;
  startTime: number;
  peakLevel: number;
  qualityScore: number;
  stabilityScore: number;
  totalDurationSeconds: number;
  holdDurationSeconds: number;
  shapeVariant: DaytimeShapeVariant;
  thresholds: ReturnType<typeof resolveThresholdModel>;
  interactiveBias?: number;
}) {
  const {
    seedKey,
    startTime,
    peakLevel,
    qualityScore,
    stabilityScore,
    totalDurationSeconds,
    holdDurationSeconds,
    shapeVariant,
    thresholds,
    interactiveBias = 0,
  } = options;

  const startedAt = new Date(startTime);
  const startHour = startedAt.getHours() + startedAt.getMinutes() / 60;
  const dayKey = formatNightPlanKey(startedAt);
  const monthKey = `${startedAt.getFullYear()}-${String(startedAt.getMonth() + 1).padStart(2, '0')}`;
  const rng = createSeededRandom(hashSeed(`${seedKey}-motion-profile`));
  const peakScore = clamp((peakLevel - thresholds.activeEntry) / 26, 0, 1);
  const durationScore = clamp((totalDurationSeconds / 60 - 6) / 14, 0, 1);
  const holdScore = clamp((holdDurationSeconds / 60 - 2.5) / 12, 0, 1);
  const timeOfDayBias =
    startHour < 9.5
      ? 0.045
      : startHour < 14.5
        ? 0.068
        : startHour < 18
          ? 0.038
          : startHour < 22.5
            ? 0.084
            : 0.052;
  const shapeBias =
    shapeVariant === 'strongHold'
      ? 0.075
      : shapeVariant === 'clean'
        ? 0.058
        : shapeVariant === 'doubleLift'
          ? 0.05
          : shapeVariant === 'softHold'
            ? 0.018
            : shapeVariant === 'rounded'
              ? -0.01
              : shapeVariant === 'tapered'
                ? -0.032
                : shapeVariant === 'partial'
                  ? -0.092
                  : -0.124;
  const dayBias = noise(hashSeed(`motion-day-${dayKey}`) * 0.00019) * 0.042;
  const monthBias = noise(hashSeed(`motion-month-${monthKey}`) * 0.00013) * 0.05;
  const sessionBias = randomBetweenSeeded(rng, -0.11, 0.085);

  const motionConfidence = clamp(
    0.015 +
      qualityScore * 0.16 +
      stabilityScore * 0.12 +
      peakScore * 0.1 +
      durationScore * 0.09 +
      holdScore * 0.1 +
      timeOfDayBias +
      shapeBias +
      dayBias +
      monthBias +
      interactiveBias +
      sessionBias,
    0.08,
    0.98,
  );
  const motionGate = clamp(
    qualityScore * 0.46 +
      stabilityScore * 0.28 +
      durationScore * 0.14 +
      holdScore * 0.12 +
      dayBias * 0.35 +
      monthBias * 0.4,
    0,
    1,
  );

  const motionDurationMinutes = clamp(
    totalDurationSeconds / 60 * (0.36 + qualityScore * 0.16 + stabilityScore * 0.08 + rng() * 0.14),
    1.8,
    totalDurationSeconds / 60 * 0.88,
  );
  const effectiveDriveWindowMinutes = clamp(
    motionDurationMinutes *
      (
        0.42 +
        qualityScore * 0.09 +
        stabilityScore * 0.08 +
        holdScore * 0.04 +
        randomBetweenSeeded(rng, -0.05, 0.08)
      ),
    1.3,
    Math.max(1.3, motionDurationMinutes * 0.72),
  );
  const cadenceAvg = clamp(
    16.5 +
      qualityScore * 7.2 +
      stabilityScore * 5.8 +
      peakScore * 3.2 +
      durationScore * 1.8 +
      randomBetweenSeeded(rng, -2.8, 2.6),
    14,
    39,
  );
  const cadencePeak = clamp(cadenceAvg + 3.2 + peakScore * 2.8 + rng() * 5.2, cadenceAvg + 2, 44);
  const driveQualificationFloor = Math.round(
    clamp(
      30 +
        qualityScore * 6 +
        holdScore * 4 +
        stabilityScore * 5 +
        peakScore * 3 +
        randomBetweenSeeded(rng, -2, 2),
      28,
      40,
    ),
  );
  const driveCount = Math.round(
    clamp(
      cadenceAvg * effectiveDriveWindowMinutes * (0.72 + stabilityScore * 0.06 + rng() * 0.08),
      14,
      168,
    ),
  );
  const rhythmConsistency = Math.round(
    clamp(
      48 + stabilityScore * 23 + qualityScore * 9 + peakScore * 4 + shapeBias * 92 + randomBetweenSeeded(rng, -6, 5),
      40,
      96,
    ),
  );
  const motionStability = Math.round(clamp(rhythmConsistency * 0.78 + stabilityScore * 18 + randomBetweenSeeded(rng, -4, 4), 42, 95));
  const intensityBand = getMotionIntensityBand(cadencePeak, driveCount);
  const qualifies =
    peakLevel >= thresholds.activeEntry &&
    motionConfidence >= 0.58 &&
    motionGate >= 0.5 &&
    driveCount >= driveQualificationFloor &&
    motionDurationMinutes >= 3.4 &&
    rhythmConsistency >= 60;

  return {
    qualifies,
    confidence: motionConfidence,
    motion: {
      driveCount,
      cadence: `${Math.round(cadenceAvg)}/min`,
      rhythm: getMotionRhythm(rhythmConsistency),
      peakWindow: formatDurationLabel(holdDurationSeconds),
      activeDuration: formatDurationLabel(Math.round(motionDurationMinutes * 60)),
      cadenceAvg: `${Math.round(cadenceAvg)}/min`,
      cadencePeak: `${Math.round(cadencePeak)}/min`,
      rhythmConsistency,
      motionDuration: formatDurationLabel(Math.round(motionDurationMinutes * 60)),
      motionIntensity: intensityBand,
      motionStability,
      averageDriveInterval: `${(60 / Math.max(cadenceAvg, 1)).toFixed(1)}s`,
    },
    motionWaveform: buildMotionWaveform({
      seedKey,
      rhythmConsistency,
      driveCount,
      motionDurationMinutes,
      intensityBand,
    }),
  } satisfies SessionMotionProfile;
}

function createNocturnalSessionWaveform(options: {
  seedKey: string;
  peakLevel: number;
  riseDurationSeconds: number;
  holdDurationSeconds: number;
  declineDurationSeconds: number;
  stabilityScore: number;
}) {
  return buildErectionWaveform({
    ...options,
    baseline: 20.8,
    samples: 34,
  });
}

export function createCompletedSession(
  peakValue: number,
  startedAt: Date | null,
  completedAt?: Date | null,
  thresholdModel?: ArcThresholdModel,
  performancePresetId: ArcPerformancePresetId = 'average',
): Session {
  const preset = getArcPerformancePreset(performancePresetId);
  const thresholds = resolveThresholdModel(thresholdModel);
  const sessionStart = startedAt ?? completedAt ?? new Date();
  const sessionEnd = completedAt ?? new Date();
  const adjustedPeakValue = clamp(peakValue + preset.livePeakShift * 0.35, thresholds.activeEntry + 2, DETAIL_THRESHOLD_PERCENTAGES.record);
  const peakHoldSeconds = Math.round(clamp(randomBetween(612, 1044) * (1 - preset.recoveryShift * 0.32), 360, 1180));
  const totalDurationSeconds = peakHoldSeconds + Math.round(clamp(randomBetween(286, 522) * (1 - preset.recoveryShift * 0.26), 180, 620));
  const buildSeconds = Math.max(72, Math.round(totalDurationSeconds * clamp(randomBetween(0.12, 0.2) + preset.recoveryShift * 0.04, 0.1, 0.24)));
  const recoveryMinutes = clamp(randomBetween(8.4, 12.8) * (1 + preset.recoveryShift * 0.48), 6.8, 15.2);
  const sessionId = `SEN-${String(sessionStart.getHours()).padStart(2, '0')}${String(sessionStart.getMinutes()).padStart(2, '0')}`;
  const stabilityScore = Math.round(clamp(74 + (adjustedPeakValue - thresholds.activeEntry) * 0.4 + preset.daytimeStabilityShift * 32, 68, 97));
  const durationLabel = formatDurationLabel(totalDurationSeconds);
  const buildSpeedLabel = formatDurationLabel(buildSeconds);
  const quality =
    adjustedPeakValue >= thresholds.peak
      ? 'Strong Session'
      : adjustedPeakValue >= thresholds.activeEntry + 8
        ? 'Strong Session'
        : 'Steady Session';
  const holdQuality = describeHoldQuality(stabilityScore, peakHoldSeconds);
  const peakQuality = describePeakQuality(adjustedPeakValue, thresholds);
  const motionProfile = buildDaytimeMotionProfile({
    seedKey: sessionId,
    startTime: sessionStart.getTime(),
    peakLevel: adjustedPeakValue,
    qualityScore: clamp((adjustedPeakValue - thresholds.activeEntry) / Math.max(thresholds.peak - thresholds.activeEntry, 1) + preset.daytimeQualityShift, 0.24, 0.98),
    stabilityScore: stabilityScore / 100,
    totalDurationSeconds,
    holdDurationSeconds: peakHoldSeconds,
    shapeVariant: adjustedPeakValue >= thresholds.peak ? 'strongHold' : 'clean',
    thresholds,
    interactiveBias: 0.18 + preset.motionBias,
  });
  const reboundMinutes = clamp(randomBetween(18, 31) * (1 + preset.recoveryShift * 0.28), 12, 34);
  const analysis = buildDaytimeSessionAnalysis({
    qualityScore: clamp((adjustedPeakValue - thresholds.activeEntry) / Math.max(thresholds.peak - thresholds.activeEntry, 1), 0.22, 0.98),
    stabilityScore: stabilityScore / 100,
    peakLevel: adjustedPeakValue,
    thresholds,
    buildSeconds,
    totalDurationSeconds,
    holdDurationSeconds: peakHoldSeconds,
    recoveryMinutes,
    motionProfile,
  });

  return {
    id: sessionId,
    type: 'motion',
    date: formatDateLabel(sessionStart),
    time: formatClockLabel(sessionStart),
    capturedAt: sessionEnd.getTime(),
    statusLabel: quality,
    peakLevel: Number(adjustedPeakValue.toFixed(1)),
    metrics: {
      buildSpeed: buildSpeedLabel,
      stability: stabilityScore,
      duration: durationLabel,
      recovery: formatMinutesLabel(recoveryMinutes),
      rebound: `${reboundMinutes.toFixed(1)}m`,
      holdQuality,
      peakQuality,
    },
    motion: motionProfile.motion,
    durationMs: totalDurationSeconds * 1000,
    buildDurationMs: buildSeconds * 1000,
    recoveryDurationMs: Math.round(recoveryMinutes * 60_000),
    analysis,
    erectionWaveform: buildErectionWaveform({
      seedKey: sessionId,
      peakLevel: adjustedPeakValue,
      riseDurationSeconds: buildSeconds,
      holdDurationSeconds: peakHoldSeconds,
      declineDurationSeconds: Math.max(90, totalDurationSeconds - buildSeconds - peakHoldSeconds),
      stabilityScore,
    }),
    motionWaveform: motionProfile.motionWaveform,
    insights: [
      peakValue >= thresholds.peak
        ? 'This session crossed peak threshold before settling back below active entry.'
        : 'This session crossed active entry, established a stable hold, and returned below threshold cleanly.',
      `Motion settled into ${motionProfile.motion.rhythm.toLowerCase()} repeated movement through the active window.`,
    ],
  };
}

export function createAutonomousDaytimeSession(
  event: ArcAutonomousDaytimeEventSummary,
  thresholdModel?: ArcThresholdModel,
  performancePresetId: ArcPerformancePresetId = 'average',
): Session | null {
  const preset = getArcPerformancePreset(performancePresetId);
  const thresholds = resolveThresholdModel(thresholdModel);
  if (event.peakLevel < thresholds.activeEntry) {
    return null;
  }

  const startedAt = new Date(event.startTime);
  const totalDurationSeconds = Math.max(120, Math.round(event.totalDuration * 60));
  const holdDurationSeconds = Math.max(90, Math.round(event.holdDuration * 60));
  const riseDurationSeconds = Math.max(60, Math.round(event.riseDuration * 60));
  const declineDurationSeconds = Math.max(75, Math.round(event.declineDuration * 60));
  const buildSeconds = Math.max(
    72,
    Math.round(totalDurationSeconds * (0.17 + (1 - event.qualityScore) * 0.08)),
  );
  const stabilityScore = Math.round(
    clamp(
      68 + event.stabilityScore * 22 + (event.peakLevel - thresholds.activeEntry) * 0.12,
      68,
      95,
    ),
  );
  const recoveryMinutes = clamp(
    13.8 - event.qualityScore * 3.2 - event.stabilityScore * 1.8,
    7.4,
    14.6,
  );
  const reboundMinutes = clamp(26.5 - event.qualityScore * 4.8, 14.5, 28.8);
  const statusLabel =
    event.peakLevel >= thresholds.peak || event.qualityScore >= 0.82
      ? 'Strong Session'
      : 'Steady Session';
  const holdQuality = describeHoldQuality(stabilityScore, holdDurationSeconds);
  const peakQuality = describePeakQuality(event.peakLevel, thresholds);
  const motionProfile = buildDaytimeMotionProfile({
    seedKey: event.id,
    startTime: event.startTime,
    peakLevel: event.peakLevel,
    qualityScore: event.qualityScore,
    stabilityScore: event.stabilityScore,
    totalDurationSeconds,
    holdDurationSeconds,
    shapeVariant: event.shapeVariant,
    thresholds,
    interactiveBias: preset.motionBias,
  });
  const type: Session['type'] = motionProfile.qualifies ? 'motion' : 'static';
  const analysis = buildDaytimeSessionAnalysis({
    qualityScore: event.qualityScore,
    stabilityScore: event.stabilityScore,
    peakLevel: event.peakLevel,
    thresholds,
    buildSeconds,
    totalDurationSeconds,
    holdDurationSeconds,
    recoveryMinutes,
    motionProfile: type === 'motion' ? motionProfile : null,
  });
  const baseInsights =
    type === 'motion'
      ? 'Repeated intimate motion was detected during the active window, promoting this event into a Motion Session.'
      : 'This qualified event held above threshold without enough repeated motion to classify as a Motion Session.';

  return {
    id: `AUTO-${event.id}`,
    type,
    date: formatDateLabel(startedAt),
    time: formatClockLabel(startedAt),
    capturedAt: event.timestamp,
    statusLabel,
    peakLevel: Number(event.peakLevel.toFixed(1)),
    metrics: {
      buildSpeed: formatDurationLabel(buildSeconds),
      stability: stabilityScore,
      duration: formatDurationLabel(totalDurationSeconds),
      recovery: formatMinutesLabel(recoveryMinutes),
      rebound: formatMinutesLabel(reboundMinutes),
      holdQuality,
      peakQuality,
    },
    motion: type === 'motion' ? motionProfile.motion : undefined,
    durationMs: totalDurationSeconds * 1000,
    buildDurationMs: buildSeconds * 1000,
    recoveryDurationMs: Math.round(recoveryMinutes * 60_000),
    analysis,
    erectionWaveform: buildErectionWaveform({
      seedKey: event.id,
      peakLevel: event.peakLevel,
      riseDurationSeconds,
      holdDurationSeconds,
      declineDurationSeconds,
      stabilityScore,
    }),
    motionWaveform: type === 'motion' ? motionProfile.motionWaveform : undefined,
    insights: [
      baseInsights,
      `Peak level reached ${event.peakLevel.toFixed(1)}% with a ${formatDurationLabel(holdDurationSeconds)} hold window.`,
    ],
  };
}

export function createAutonomousNocturnalSession(
  event: ArcAutonomousNocturnalEventSummary,
  thresholdModel?: ArcThresholdModel,
  _performancePresetId: ArcPerformancePresetId = 'average',
): Session | null {
  const thresholds = resolveThresholdModel(thresholdModel);
  if (event.peakLevel < thresholds.activeEntry) {
    return null;
  }

  const startedAt = new Date(event.startTime);
  const totalDurationSeconds = Math.max(240, Math.round(event.totalDuration * 60));
  const holdDurationSeconds = Math.max(120, Math.round(event.holdDuration * 60));
  const riseDurationSeconds = Math.max(90, Math.round(event.riseDuration * 60));
  const declineDurationSeconds = Math.max(90, Math.round(event.declineDuration * 60));
  const stabilityScore = Math.round(
    clamp(66 + event.stabilityScore * 24 + (event.peakLevel - thresholds.activeEntry) * 0.12, 64, 96),
  );
  const nocturnalQuality = Math.round(clamp(58 + event.qualityScore * 28 + event.stabilityScore * 14, 54, 98));
  const statusLabel =
    event.peakLevel >= thresholds.peak || nocturnalQuality >= 86
      ? 'Above Baseline'
      : nocturnalQuality >= 72
        ? 'Baseline'
        : 'Variable Session';
  const analysis = buildNocturnalSessionAnalysis({
    qualityScore: event.qualityScore,
    stabilityScore: event.stabilityScore,
    peakLevel: event.peakLevel,
    thresholds,
    riseDurationSeconds,
    holdDurationSeconds,
    declineDurationSeconds,
  });

  return {
    id: `NOC-${event.id}`,
    type: 'nocturnal',
    date: formatDateLabel(startedAt),
    time: formatClockLabel(startedAt),
    capturedAt: event.timestamp,
    statusLabel,
    peakLevel: Number(event.peakLevel.toFixed(1)),
    metrics: {
      buildSpeed: formatDurationLabel(riseDurationSeconds),
      stability: stabilityScore,
      duration: formatDurationLabel(totalDurationSeconds),
      recovery: formatDurationLabel(declineDurationSeconds),
      holdQuality: describeHoldQuality(stabilityScore, holdDurationSeconds),
      peakQuality: describeNocturnalQuality(event.qualityScore, event.stabilityScore),
    },
    nocturnalEvents: 1,
    strongestEvent: formatDurationLabel(totalDurationSeconds),
    overnightStability: describeNocturnalQuality(event.qualityScore, event.stabilityScore),
    nocturnalQuality,
    durationMs: totalDurationSeconds * 1000,
    buildDurationMs: riseDurationSeconds * 1000,
    recoveryDurationMs: declineDurationSeconds * 1000,
    analysis,
    erectionWaveform: createNocturnalSessionWaveform({
      seedKey: event.id,
      peakLevel: event.peakLevel,
      riseDurationSeconds,
      holdDurationSeconds,
      declineDurationSeconds,
      stabilityScore,
    }),
    insights: [
      'This overnight event was detected during nocturnal mode and stored separately from daytime sessions.',
      `Peak level reached ${event.peakLevel.toFixed(1)}% with ${describeNocturnalQuality(event.qualityScore, event.stabilityScore).toLowerCase()}.`,
    ],
  };
}

type LiveSignalGraphProps = {
  width: number;
  height: number;
  history: number[];
  linePhases?: ArcLiveLinePhase[];
  xPositions?: number[];
  strokeWidth?: number;
  glowWidth?: number;
  gradientId: string;
  showEndpoint?: boolean;
  guides?: number[];
  className?: string;
  domainMin?: number;
  domainMax?: number;
  animateEndpoint?: boolean;
  topPaddingRatio?: number;
  bottomPaddingRatio?: number;
  riseBoost?: number;
  endpointGlowScale?: number;
  trailOpacityScale?: number;
  uniformTrendStroke?: boolean;
  showEndpointGuide?: boolean;
  smoothingPasses?: number;
};
type DiscreteTrendKey = 'up' | 'down' | 'hold';

const LIVE_CARD_SIGNAL_OPTIONS: LiveSignalOptions = {
  samples: LIVE_SAMPLES,
  sampleInterval: 0.16,
  quietRange: [6.4, 10.6],
  moveRange: [0.12, 0.28],
  transitionRange: [2.2, 3.4],
  settleRange: [3.8, 5.8],
  returnToBaseline: true,
  breathing: {
    holdSin: 0.016,
    holdCos: 0.007,
    settleSin: 0.012,
    settleCos: 0.006,
    holdSpeedA: 0.28,
    holdSpeedB: 0.15,
    settleSpeedA: 0.33,
    settleSpeedB: 0.18,
  },
};

function mixColor(from: readonly [number, number, number], to: readonly [number, number, number], amount: number) {
  return [
    Math.round(from[0] + (to[0] - from[0]) * amount),
    Math.round(from[1] + (to[1] - from[1]) * amount),
    Math.round(from[2] + (to[2] - from[2]) * amount),
  ] as const;
}

const HOLD_TONE = hexToRgbTuple(foundationTheme.signal.hold);
const RISE_TONE = hexToRgbTuple(foundationTheme.signal.up);
const FALL_TONE = hexToRgbTuple(foundationTheme.signal.down);
const SOFT_RISE_TONE = mixColor(HOLD_TONE, RISE_TONE, 0.74);
const SOFT_FALL_TONE = mixColor(HOLD_TONE, FALL_TONE, 0.72);
const LIVE_BOLD_UP_TONE = mixColor(hexToRgbTuple(foundationTheme.signal.up), [40, 214, 113], 0.72);
const LIVE_BOLD_DOWN_TONE = mixColor(hexToRgbTuple(foundationTheme.signal.down), [226, 78, 78], 0.76);
const LIVE_BOLD_HOLD_TONE = mixColor(hexToRgbTuple(foundationTheme.signal.warning), [226, 182, 72], 0.78);
const NOCTURNAL_HOLD_TONE = mixColor(hexToRgbTuple(foundationTheme.chart.nocturnal), [102, 154, 224], 0.56);
const NOCTURNAL_WINDOW_START_MINUTE = 0;
const NOCTURNAL_WINDOW_DEFAULT_END_MINUTE = 8 * 60;
const NOCTURNAL_EVENT_COUNT_WEIGHTS = [0.04, 0.09, 0.17, 0.24, 0.22, 0.14, 0.07, 0.03] as const;
const NOCTURNAL_PLAN_CACHE = new Map<string, NocturnalNightPlan>();
const DAYTIME_SIGNAL_MAX = 110;
const DAYTIME_EVENT_COUNT_WEIGHTS = [0.08, 0.13, 0.17, 0.2, 0.17, 0.11, 0.08, 0.04, 0.02] as const;
const DAYTIME_PLAN_CACHE = new Map<string, DaytimeDayPlan>();

type RenderSignalSegmentKey = DiscreteTrendKey | Exclude<ArcLiveLinePhase, 'default'>;
type NocturnalShapeVariant = 'rounded' | 'flatTop' | 'wavy' | 'interrupted' | 'doublePeak' | 'softDecline' | 'sharpDrop';
type DaytimeShapeVariant = 'clean' | 'rounded' | 'partial' | 'interrupted' | 'softHold' | 'strongHold' | 'doubleLift' | 'tapered';
type NocturnalEventPlan = {
  startMinute: number;
  riseDuration: number;
  holdDuration: number;
  declineDuration: number;
  peakLevel: number;
  qualityScore: number;
  stabilityScore: number;
  shapeVariant: NocturnalShapeVariant;
  noiseSeed: number;
};
type NocturnalNightPlan = {
  key: string;
  baseline: number;
  wakeMinute: number;
  eventCount: number;
  quietLevel: number;
  volatilityFactor: number;
  recoveryFactor: number;
  pulses: BaselinePulsePlan[];
  events: NocturnalEventPlan[];
};
type BaselinePulsePlan = {
  centerMinute: number;
  width: number;
  amplitude: number;
};
type BaselineRecoveryEvent = {
  startMinute: number;
  riseDuration: number;
  holdDuration: number;
  declineDuration: number;
  peakLevel: number;
  qualityScore: number;
  stabilityScore: number;
};
type DaytimeVolatilityProfile = 'low' | 'moderate' | 'higher';
type DaytimeEventPlan = {
  id: string;
  startMinute: number;
  riseDuration: number;
  holdDuration: number;
  declineDuration: number;
  peakLevel: number;
  qualityScore: number;
  stabilityScore: number;
  shapeVariant: DaytimeShapeVariant;
  noiseSeed: number;
};
type DaytimeDayPlan = {
  key: string;
  baseline: number;
  averageMaxFullness: number;
  dayStartMinute: number;
  dayEndMinute: number;
  eventCount: number;
  quietLevel: number;
  volatilityProfile: DaytimeVolatilityProfile;
  volatilityFactor: number;
  recoveryFactor: number;
  pulses: BaselinePulsePlan[];
  events: DaytimeEventPlan[];
};
export type ArcAutonomousDaytimeEventSummary = {
  id: string;
  timestamp: number;
  startTime: number;
  endTime: number;
  peakLevel: number;
  qualityScore: number;
  stabilityScore: number;
  riseDuration: number;
  holdDuration: number;
  declineDuration: number;
  totalDuration: number;
  shapeVariant: DaytimeShapeVariant;
};
export type ArcAutonomousNocturnalEventSummary = {
  id: string;
  timestamp: number;
  startTime: number;
  endTime: number;
  peakLevel: number;
  qualityScore: number;
  stabilityScore: number;
  riseDuration: number;
  holdDuration: number;
  declineDuration: number;
  totalDuration: number;
  shapeVariant: NocturnalShapeVariant;
};
type AutonomousSignalPoint = {
  value: number;
  linePhase: ArcLiveLinePhase;
  isNocturnalActive: boolean;
  context: 'day' | 'night';
  phase: LiveDetailSimulationPhase;
};
type AutonomousSignalOptions = {
  autonomousDaytimeEnabled?: boolean;
  performancePreset?: ArcPerformancePresetId;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeInOut(progress: number) {
  return 0.5 - 0.5 * Math.cos(progress * Math.PI);
}

function easeSmoother(progress: number) {
  return progress * progress * progress * (progress * (progress * 6 - 15) + 10);
}

function getTrendTone(slope: number) {
  const holdThreshold = 0.12;
  const maxSlope = 0.96;

  if (Math.abs(slope) <= holdThreshold) {
    return HOLD_TONE;
  }

  const amount = Math.min(1, (Math.abs(slope) - holdThreshold) / (maxSlope - holdThreshold));
  return slope < 0
    ? mixColor(HOLD_TONE, SOFT_RISE_TONE, amount)
    : mixColor(HOLD_TONE, SOFT_FALL_TONE, amount);
}

function getTrendColor(slope: number, alpha = 1) {
  const tone = getTrendTone(slope);
  return alpha >= 1
    ? `rgb(${tone[0]},${tone[1]},${tone[2]})`
    : `rgba(${tone[0]}, ${tone[1]}, ${tone[2]}, ${alpha})`;
}

function getDiscreteTrendTone(slope: number) {
  const threshold = 0.045;

  if (slope < -threshold) {
    return LIVE_BOLD_UP_TONE;
  }

  if (slope > threshold) {
    return LIVE_BOLD_DOWN_TONE;
  }

  return LIVE_BOLD_HOLD_TONE;
}

function getDiscreteTrendKey(slope: number): DiscreteTrendKey {
  const threshold = 0.045;

  if (slope < -threshold) return 'up';
  if (slope > threshold) return 'down';
  return 'hold';
}

function rgba(color: readonly [number, number, number], alpha: number) {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(input: string) {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function randomBetweenSeeded(rng: () => number, min: number, max: number) {
  return min + rng() * (max - min);
}

function weightedPick(rng: () => number, weights: readonly number[]) {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let cursor = rng() * total;

  for (let index = 0; index < weights.length; index += 1) {
    cursor -= weights[index] ?? 0;
    if (cursor <= 0) {
      return index;
    }
  }

  return weights.length - 1;
}

function formatNightPlanKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function gaussianLinearPulse(position: number, center: number, width: number) {
  const distance = Math.abs(position - center);
  return Math.exp(-0.5 * (distance / Math.max(1, width)) ** 2);
}

function buildBaselinePulses(
  rng: () => number,
  options: {
    startMinute: number;
    endMinute: number;
    count: number;
    amplitudeMin: number;
    amplitudeMax: number;
    widthMin: number;
    widthMax: number;
    negativeChance: number;
  },
) {
  const usableStart = options.startMinute;
  const usableEnd = Math.max(options.startMinute + 24, options.endMinute);

  return Array.from({ length: Math.max(0, options.count) }, () => {
    const centerMinute = randomBetweenSeeded(rng, usableStart, usableEnd);
    const width = randomBetweenSeeded(rng, options.widthMin, options.widthMax);
    const signedAmplitude = randomBetweenSeeded(rng, options.amplitudeMin, options.amplitudeMax);
    const amplitude =
      rng() < options.negativeChance
        ? -signedAmplitude * randomBetweenSeeded(rng, 0.48, 0.88)
        : signedAmplitude * randomBetweenSeeded(rng, 0.72, 1.18);

    return {
      centerMinute,
      width,
      amplitude,
    } satisfies BaselinePulsePlan;
  }).sort((left, right) => left.centerMinute - right.centerMinute);
}

function sampleBaselinePulseContribution(minuteOfDay: number, pulses: readonly BaselinePulsePlan[]) {
  return pulses.reduce(
    (sum, pulse) => sum + gaussianLinearPulse(minuteOfDay, pulse.centerMinute, pulse.width) * pulse.amplitude,
    0,
  );
}

function samplePostEventRecoveryOffset(
  minuteOfDay: number,
  baseline: number,
  recoveryFactor: number,
  events: readonly BaselineRecoveryEvent[],
) {
  const recoveryOffset = events.reduce((sum, event) => {
    const totalDuration = event.riseDuration + event.holdDuration + event.declineDuration;
    const minutesSinceEnd = minuteOfDay - (event.startMinute + totalDuration);

    if (minutesSinceEnd < 0 || minutesSinceEnd > 220) {
      return sum;
    }

    const amplitudeRatio = clamp((event.peakLevel - baseline) / 62, 0.12, 1.08);
    const initialOffset =
      (0.45 + event.qualityScore * 0.92 + event.stabilityScore * 0.28) * recoveryFactor * amplitudeRatio;
    const decayWindow = 34 + event.holdDuration * 2.1 + event.qualityScore * 42;
    const decay = Math.exp(-minutesSinceEnd / Math.max(18, decayWindow));

    return sum + initialOffset * decay;
  }, 0);

  return Math.min(recoveryOffset, 5.8 * recoveryFactor);
}

function sampleRestingBaseline(options: {
  date: Date;
  minuteOfDay: number;
  planKey: string;
  context: 'day' | 'night';
  baseBaseline: number;
  quietLevel: number;
  volatilityFactor: number;
  recoveryFactor: number;
  pulses: readonly BaselinePulsePlan[];
  events: readonly BaselineRecoveryEvent[];
  minValue: number;
  maxValue: number;
}) {
  const {
    date,
    minuteOfDay,
    planKey,
    context,
    baseBaseline,
    quietLevel,
    volatilityFactor,
    recoveryFactor,
    pulses,
    events,
    minValue,
    maxValue,
  } = options;
  const timestamp = date.getTime();
  const seed = hashSeed(`${context}-baseline-${planKey}`);
  const driftPhaseA = noise(seed * 0.00013 + 1.4) * Math.PI;
  const driftPhaseB = noise(seed * 0.00017 + 4.2) * Math.PI;
  const texturePhaseA = noise(seed * 0.00023 + 6.7) * Math.PI;
  const texturePhaseB = noise(seed * 0.00029 + 8.9) * Math.PI;
  const volatilityWeight =
    context === 'day'
      ? 0.9 +
        gaussianLinearPulse(minuteOfDay, 10 * 60 + 50 + noise(seed * 0.00019 + 2.2) * 52, 185) * 0.2 +
        gaussianLinearPulse(minuteOfDay, 15 * 60 + 10 + noise(seed * 0.00027 + 5.8) * 60, 210) * 0.28 +
        gaussianLinearPulse(minuteOfDay, 20 * 60 + noise(seed * 0.00034 + 8.2) * 36, 118) * 0.14
      : 0.76 +
        gaussianLinearPulse(minuteOfDay, 2 * 60 + 18 + noise(seed * 0.00021 + 3.6) * 18, 126) * 0.12 +
        gaussianLinearPulse(minuteOfDay, 5 * 60 + 6 + noise(seed * 0.00031 + 7.1) * 24, 110) * 0.1;
  const driftAmplitude = (context === 'day' ? 1.08 : 0.64) * (0.86 + volatilityFactor * 0.92);
  const drift =
    Math.sin((minuteOfDay / 1440) * Math.PI * 2 + driftPhaseA) * driftAmplitude +
    Math.cos((minuteOfDay / 1440) * Math.PI * 4 + driftPhaseB) * driftAmplitude * 0.44;
  const pulseContribution = sampleBaselinePulseContribution(minuteOfDay, pulses) * (context === 'day' ? 1.08 : 0.9);
  const textureAmplitude =
    (context === 'day' ? 0.28 : 0.16) * (0.6 + volatilityFactor * 0.94) * (1.02 - quietLevel * 0.16);
  const texture =
    Math.sin(timestamp / 1000 / (context === 'day' ? 235 : 310) + texturePhaseA) * textureAmplitude +
    Math.cos(timestamp / 1000 / (context === 'day' ? 515 : 660) + texturePhaseB) * textureAmplitude * 0.62;
  const quietWindowBias =
    -gaussianLinearPulse(
      minuteOfDay,
      (context === 'day' ? 9 * 60 + 35 : 3 * 60 + 18) + noise(seed * 0.00037 + 1.1) * (context === 'day' ? 92 : 34),
      context === 'day' ? 180 : 118,
    ) *
    (context === 'day' ? 1.4 + volatilityFactor * 2.3 + quietLevel * 0.35 : 0.8 + volatilityFactor * 1.05);
  const elevatedWindowBias =
    gaussianLinearPulse(
      minuteOfDay,
      (context === 'day' ? 14 * 60 + 10 : 1 * 60 + 42) + noise(seed * 0.00043 + 2.6) * (context === 'day' ? 110 : 24),
      context === 'day' ? 210 : 92,
    ) *
      (context === 'day' ? 1.7 + volatilityFactor * 2.8 + (1 - quietLevel) * 0.45 : 0.55 + volatilityFactor * 1.1) +
    gaussianLinearPulse(
      minuteOfDay,
      (context === 'day' ? 19 * 60 + 10 : 5 * 60 + 20) + noise(seed * 0.00051 + 6.9) * (context === 'day' ? 70 : 22),
      context === 'day' ? 128 : 74,
    ) *
      (context === 'day' ? 0.9 + volatilityFactor * 1.5 : 0.32 + volatilityFactor * 0.7);
  const recoveryOffset = samplePostEventRecoveryOffset(minuteOfDay, baseBaseline, recoveryFactor, events);
  const restingMean = clamp((baseBaseline + FLACCID_BASELINE_MEAN) / 2, 21.2, 23.6);
  const rawTerrain =
    baseBaseline +
    drift * volatilityWeight +
    pulseContribution +
    texture +
    quietWindowBias +
    elevatedWindowBias;
  let resolvedValue = rawTerrain + recoveryOffset;

  if (resolvedValue < 14) {
    resolvedValue = 14 - (14 - resolvedValue) * 0.42;
  }

  if (resolvedValue > 38) {
    resolvedValue = 38 + (resolvedValue - 38) * 0.3;
  }

  resolvedValue += (restingMean - resolvedValue) * (context === 'day' ? 0.055 : 0.08);

  if (resolvedValue < FLACCID_BASELINE_MIN && quietWindowBias >= -0.25) {
    resolvedValue += (FLACCID_BASELINE_MIN - resolvedValue) * 0.08;
  }

  if (resolvedValue > FLACCID_ELEVATED_MAX + 1.4) {
    resolvedValue = FLACCID_ELEVATED_MAX + 1.4 + (resolvedValue - (FLACCID_ELEVATED_MAX + 1.4)) * 0.24;
  }

  return clamp(resolvedValue, minValue, maxValue);
}

function getNocturnalNightPlan(date: Date, performancePresetId: ArcPerformancePresetId = 'average') {
  const nightDate = startOfDay(date);
  const preset = getArcPerformancePreset(performancePresetId);
  const key = `${formatNightPlanKey(nightDate)}-${preset.id}`;
  const cached = NOCTURNAL_PLAN_CACHE.get(key);

  if (cached) {
    return cached;
  }

  const rng = createSeededRandom(hashSeed(`nexalis-night-${key}`));
  const wakeMinute = Math.round(randomBetweenSeeded(rng, 405, 490));
  const quietLevel = randomBetweenSeeded(rng, 0.18, 0.82);
  const baseline = clamp(21.1 + noise(hashSeed(`baseline-${key}`) * 0.0003) * 1.25 + (rng() - 0.5) * 1.15 + preset.baselineShift, 18.6, 25.8);
  const eventCount = Math.max(0, Math.round(weightedPick(rng, NOCTURNAL_EVENT_COUNT_WEIGHTS) + preset.nocturnalEventBias));
  const volatilityFactor = clamp(0.52 + rng() * 0.42 + eventCount * 0.05 + quietLevel * 0.08 + preset.volatilityShift, 0.42, 1.24);
  const recoveryFactor = clamp(0.52 + rng() * 0.34 + eventCount * 0.05 + preset.recoveryShift, 0.42, 1.12);
  const pulses = buildBaselinePulses(rng, {
    startMinute: NOCTURNAL_WINDOW_START_MINUTE + 16,
    endMinute: Math.max(NOCTURNAL_WINDOW_START_MINUTE + 92, wakeMinute - 18),
    count: Math.max(1, Math.round(2 + volatilityFactor * 2.4 + rng() * 1.4)),
    amplitudeMin: 0.22,
    amplitudeMax: 1.3,
    widthMin: 42,
    widthMax: 156,
    negativeChance: 0.46,
  });

  const shapeVariants: NocturnalShapeVariant[] = [
    'rounded',
    'flatTop',
    'wavy',
    'interrupted',
    'doublePeak',
    'softDecline',
    'sharpDrop',
  ];

  const events = Array.from({ length: eventCount }, () => {
    const qualityScore = clamp(Math.pow(rng(), 0.82) * 1.08 + 0.06 + preset.nocturnalQualityShift, 0.08, 1);
    const stabilityScore = clamp(0.34 + rng() * 0.56 + qualityScore * 0.12 + preset.nocturnalStabilityShift, 0.22, 0.98);
    const peakLevel = clamp(
      baseline + 10 + qualityScore * randomBetweenSeeded(rng, 26, 64) + (rng() - 0.5) * 6.5,
      baseline + 7,
      98,
    );
    const riseDuration = randomBetweenSeeded(rng, 5.5, 15.5) + (1 - qualityScore) * 4.2;
    const holdDuration = randomBetweenSeeded(rng, 6.5, 26.5) + qualityScore * 13.5;
    const declineDuration = randomBetweenSeeded(rng, 5.5, 16.5) + (1 - qualityScore) * 3.8;
    const shapeVariant = shapeVariants[Math.floor(rng() * shapeVariants.length)] ?? 'rounded';

    return {
      startMinute: 0,
      riseDuration,
      holdDuration,
      declineDuration,
      peakLevel,
      qualityScore,
      stabilityScore,
      shapeVariant,
      noiseSeed: rng() * Math.PI * 2,
    } satisfies NocturnalEventPlan;
  });

  if (events.length > 0) {
    const minimumGap = 9;
    const totalDuration = events.reduce((sum, event) => sum + event.riseDuration + event.holdDuration + event.declineDuration, 0);
    const availableSpan = Math.max(80, wakeMinute - NOCTURNAL_WINDOW_START_MINUTE);
    const gapBudget = Math.max(0, availableSpan - totalDuration - minimumGap * (events.length + 1));
    const clusteringBias = randomBetweenSeeded(rng, 0.65, 1.9);
    const gapWeights = Array.from({ length: events.length + 1 }, () => 0.08 + Math.pow(rng(), clusteringBias));
    const totalGapWeight = gapWeights.reduce((sum, weight) => sum + weight, 0);
    let cursor = minimumGap + (gapWeights[0] ?? 0) / Math.max(0.001, totalGapWeight) * gapBudget;

    events.forEach((event, index) => {
      event.startMinute = cursor;
      cursor += event.riseDuration + event.holdDuration + event.declineDuration;
      cursor += minimumGap + ((gapWeights[index + 1] ?? 0) / Math.max(0.001, totalGapWeight)) * gapBudget;
    });
  }

  const plan = {
    key,
    baseline,
    wakeMinute,
    eventCount,
    quietLevel,
    volatilityFactor,
    recoveryFactor,
    pulses,
    events,
  } satisfies NocturnalNightPlan;

  NOCTURNAL_PLAN_CACHE.set(key, plan);
  return plan;
}

function getDaytimeDayPlan(date: Date, performancePresetId: ArcPerformancePresetId = 'average') {
  const dayDate = startOfDay(date);
  const preset = getArcPerformancePreset(performancePresetId);
  const key = `${formatNightPlanKey(dayDate)}-${preset.id}`;
  const cached = DAYTIME_PLAN_CACHE.get(key);

  if (cached) {
    return cached;
  }

  const overnightPlan = getNocturnalNightPlan(dayDate, performancePresetId);
  const rng = createSeededRandom(hashSeed(`nexalis-day-${key}`));
  const quietLevel = randomBetweenSeeded(rng, 0.18, 0.86);
  const volatilityProfile = (['low', 'moderate', 'higher'] as const)[weightedPick(rng, [0.3, 0.48, 0.22])] ?? 'moderate';
  const volatilityFactor = clamp(
    (volatilityProfile === 'low'
      ? randomBetweenSeeded(rng, 0.66, 0.92)
      : volatilityProfile === 'higher'
        ? randomBetweenSeeded(rng, 1.24, 1.62)
        : randomBetweenSeeded(rng, 0.96, 1.26)) + preset.volatilityShift,
    0.62,
    1.78,
  );
  const averageMaxFullness = clamp(
    99.4 + noise(hashSeed(`day-avg-${key}`) * 0.00021) * 3.4 + (rng() - 0.5) * 2.2 + preset.averageMaxShift,
    88,
    106,
  );
  const baseline = clamp(
    22.4 + noise(hashSeed(`day-base-${key}`) * 0.00019) * 1.25 + (rng() - 0.5) * 1.2 + preset.baselineShift,
    18.8,
    26.4,
  );
  const eventCount = Math.max(0, Math.round(weightedPick(rng, DAYTIME_EVENT_COUNT_WEIGHTS) + preset.daytimeEventBias));
  const recoveryFactor = clamp(0.54 + rng() * 0.36 + eventCount * 0.04 + preset.recoveryShift, 0.42, 1.18);
  const dayStartMinute = clamp(overnightPlan.wakeMinute + Math.round(randomBetweenSeeded(rng, 10, 36)), 6 * 60, 10 * 60);
  const dayEndMinute = 24 * 60;
  const pulses = buildBaselinePulses(rng, {
    startMinute: dayStartMinute + 24,
    endMinute: dayEndMinute - 18,
    count:
      volatilityProfile === 'low'
        ? Math.round(randomBetweenSeeded(rng, 3, 5))
        : volatilityProfile === 'higher'
          ? Math.round(randomBetweenSeeded(rng, 5, 8))
          : Math.round(randomBetweenSeeded(rng, 4, 6)),
    amplitudeMin: 0.6,
    amplitudeMax: 3.4,
    widthMin: 54,
    widthMax: 220,
    negativeChance: 0.42,
  });

  const shapeVariants: DaytimeShapeVariant[] = [
    'clean',
    'rounded',
    'partial',
    'interrupted',
    'softHold',
    'strongHold',
    'doubleLift',
    'tapered',
  ];

  const candidateWindows = [
    { start: dayStartMinute, end: Math.min(10 * 60 + 30, dayEndMinute - 12), weight: 1.14 },
    { start: 11 * 60 + 15, end: 14 * 60 + 20, weight: 0.96 },
    { start: 15 * 60, end: 17 * 60 + 45, weight: 0.82 },
    { start: 18 * 60, end: 21 * 60 + 40, weight: 1.08 },
    { start: 21 * 60 + 10, end: 23 * 60 + 32, weight: 0.64 },
    { start: dayStartMinute, end: 23 * 60 + 36, weight: 0.24 },
  ];

  const candidates = Array.from({ length: eventCount }, (_, index) => {
    const windowIndex = weightedPick(rng, candidateWindows.map(window => window.weight));
    const window = candidateWindows[windowIndex] ?? candidateWindows[0]!;
    const qualityScore = clamp(Math.pow(rng(), 0.82) * 1.04 + 0.06 + preset.daytimeQualityShift, 0.08, 1);
    const stabilityScore = clamp(0.3 + qualityScore * 0.48 + rng() * 0.22 + preset.daytimeStabilityShift, 0.18, 0.98);
    const riseDuration = randomBetweenSeeded(rng, 4.5, 13.2) + (1 - qualityScore) * 5.2;
    const holdDuration = randomBetweenSeeded(rng, 3.2, 17.5) + qualityScore * 9.4 + (rng() > 0.78 ? randomBetweenSeeded(rng, 2.5, 8.4) : 0);
    const declineDuration = randomBetweenSeeded(rng, 5.6, 17.2) + (1 - qualityScore) * 4.6;
    const totalDuration = riseDuration + holdDuration + declineDuration;
    const usableWindowEnd = Math.max(window.start + totalDuration + 10, window.end);
    const desiredStart = randomBetweenSeeded(rng, window.start, Math.max(window.start, usableWindowEnd - totalDuration));
    let peakLevel = averageMaxFullness - randomBetweenSeeded(rng, 3, 24) + qualityScore * randomBetweenSeeded(rng, 7, 22);

    if (rng() < 0.18) {
      peakLevel -= randomBetweenSeeded(rng, 5, 11.5);
    }

    if (rng() < 0.12 + qualityScore * 0.1) {
      peakLevel += randomBetweenSeeded(rng, 1.2, 6.8);
    }

    return {
      id: `${key}-day-${index}`,
      desiredStart,
      windowStart: window.start,
      windowEnd: usableWindowEnd,
      riseDuration,
      holdDuration,
      declineDuration,
      peakLevel: clamp(peakLevel, 42, DAYTIME_SIGNAL_MAX),
      qualityScore,
      stabilityScore,
      shapeVariant: shapeVariants[Math.floor(rng() * shapeVariants.length)] ?? 'clean',
      noiseSeed: rng() * Math.PI * 2,
    };
  }).sort((left, right) => left.desiredStart - right.desiredStart);

  const events: DaytimeEventPlan[] = [];
  const minimumGap = 14;

  candidates.forEach(candidate => {
    const totalDuration = candidate.riseDuration + candidate.holdDuration + candidate.declineDuration;
    const latestStart = Math.min(dayEndMinute - totalDuration - 2, candidate.windowEnd - totalDuration);

    if (latestStart <= candidate.windowStart) {
      return;
    }

    let placedStart: number | null = null;

    for (let attempt = 0; attempt < 20; attempt += 1) {
      const jitter = attempt === 0 ? 0 : randomBetweenSeeded(rng, -55, 55);
      const candidateStart = clamp(candidate.desiredStart + jitter, candidate.windowStart, latestStart);
      const candidateEnd = candidateStart + totalDuration;
      const overlapsExisting = events.some(existing => {
        const existingEnd = existing.startMinute + existing.riseDuration + existing.holdDuration + existing.declineDuration;
        return candidateStart < existingEnd + minimumGap && candidateEnd > existing.startMinute - minimumGap;
      });

      if (!overlapsExisting) {
        placedStart = candidateStart;
        break;
      }
    }

    if (placedStart == null) {
      return;
    }

    events.push({
      id: candidate.id,
      startMinute: placedStart,
      riseDuration: candidate.riseDuration,
      holdDuration: candidate.holdDuration,
      declineDuration: candidate.declineDuration,
      peakLevel: candidate.peakLevel,
      qualityScore: candidate.qualityScore,
      stabilityScore: candidate.stabilityScore,
      shapeVariant: candidate.shapeVariant,
      noiseSeed: candidate.noiseSeed,
    });
  });

  events.sort((left, right) => left.startMinute - right.startMinute);

  const plan = {
    key,
    baseline,
    averageMaxFullness,
    dayStartMinute,
    dayEndMinute,
    eventCount: events.length,
    quietLevel,
    volatilityProfile,
    volatilityFactor,
    recoveryFactor,
    pulses,
    events,
  } satisfies DaytimeDayPlan;

  DAYTIME_PLAN_CACHE.set(key, plan);
  return plan;
}

function getAmbientSignalBaseline(date: Date) {
  const timestamp = date.getTime();
  const minuteOfDay = date.getHours() * 60 + date.getMinutes();
  const daySeed = Math.floor(timestamp / DAY_IN_MS);
  const baseline = FLACCID_BASELINE_MEAN + noise(daySeed * 0.27 + 2.7) * 0.9 + Math.cos(daySeed * 0.13 + 0.9) * 0.45;
  const circadianDrift =
    Math.sin((minuteOfDay / 1440) * Math.PI * 2 + daySeed * 0.14) * 0.56 +
    Math.cos((minuteOfDay / 1440) * Math.PI * 4 + daySeed * 0.31) * 0.24;
  const morningLiftCenter = 480 + noise(daySeed * 0.42 + 7.2) * 28;
  const afternoonLiftCenter = 915 + noise(daySeed * 0.34 + 2.9) * 34;
  const eveningLiftCenter = 1160 + noise(daySeed * 0.29 + 3.4) * 26;
  const morningLift = gaussianMinutePulse(minuteOfDay, morningLiftCenter, 90) * (1.15 + noise(daySeed * 0.41 + 9.2) * 0.35);
  const afternoonLift = gaussianMinutePulse(minuteOfDay, afternoonLiftCenter, 132) * (0.92 + noise(daySeed * 0.48 + 5.6) * 0.28);
  const eveningLift = gaussianMinutePulse(minuteOfDay, eveningLiftCenter, 112) * (0.74 + noise(daySeed * 0.22 + 4.8) * 0.22);
  return clamp(baseline + circadianDrift + morningLift + afternoonLift + eveningLift, 18.2, 28.8);
}

function getNocturnalPhaseTone(linePhase: ArcLiveLinePhase) {
  switch (linePhase) {
    case 'nocturnalRise':
    case 'nocturnalHold':
    case 'nocturnalDecline':
      return NOCTURNAL_HOLD_TONE;
    default:
      return HOLD_TONE;
  }
}

function resolveLinePhaseKey(linePhase: ArcLiveLinePhase, slope: number): RenderSignalSegmentKey {
  if (linePhase !== 'default') {
    return linePhase;
  }

  return getDiscreteTrendKey(slope);
}

function getRenderSignalTone(key: RenderSignalSegmentKey) {
  switch (key) {
    case 'nocturnalRise':
    case 'nocturnalHold':
    case 'nocturnalDecline':
      return NOCTURNAL_HOLD_TONE;
    case 'up':
      return LIVE_BOLD_UP_TONE;
    case 'down':
      return LIVE_BOLD_DOWN_TONE;
    case 'hold':
    default:
      return LIVE_BOLD_HOLD_TONE;
  }
}

function mapLinePhaseToLivePhase(linePhase: ArcLiveLinePhase): LiveDetailSimulationPhase {
  switch (linePhase) {
    case 'nocturnalRise':
      return 'nocturnalRise';
    case 'nocturnalHold':
      return 'nocturnalHold';
    case 'nocturnalDecline':
      return 'nocturnalDecline';
    default:
      return 'idle';
  }
}

function sampleNocturnalEventValue(event: NocturnalEventPlan, minuteOfDay: number, baseline: number) {
  const eventMinute = minuteOfDay - event.startMinute;
  const totalDuration = event.riseDuration + event.holdDuration + event.declineDuration;

  if (eventMinute < 0 || eventMinute > totalDuration) {
    return null;
  }

  const amplitude = Math.max(5, event.peakLevel - baseline);
  const eventOscillation = Math.sin((eventMinute + event.noiseSeed) * 0.26) * amplitude * 0.012;

  if (eventMinute <= event.riseDuration) {
    const progress = clamp(eventMinute / Math.max(0.001, event.riseDuration), 0, 1);
    const eased = easeSmoother(progress);
    const riseTexture = Math.sin((progress * Math.PI * 1.6) + event.noiseSeed) * amplitude * (0.006 + (1 - event.stabilityScore) * 0.012);
    return {
      value: baseline + amplitude * eased + riseTexture + eventOscillation * 0.4,
      linePhase: 'nocturnalRise' as const,
    };
  }

  if (eventMinute <= event.riseDuration + event.holdDuration) {
    const holdMinute = eventMinute - event.riseDuration;
    const progress = clamp(holdMinute / Math.max(0.001, event.holdDuration), 0, 1);
    const stabilityAmplitude = amplitude * (0.012 + (1 - event.stabilityScore) * 0.06);
    let profile = 0.966;

    switch (event.shapeVariant) {
      case 'rounded':
        profile += Math.sin(progress * Math.PI) * 0.026;
        break;
      case 'flatTop':
        profile += Math.sin(progress * Math.PI * 2 + event.noiseSeed) * 0.008;
        break;
      case 'wavy':
        profile += Math.sin(progress * Math.PI * 2.8 + event.noiseSeed) * 0.035;
        break;
      case 'interrupted':
        profile += Math.sin(progress * Math.PI * 2 + event.noiseSeed) * 0.016;
        profile -= Math.exp(-(((progress - 0.5) / 0.12) ** 2)) * 0.13;
        break;
      case 'doublePeak':
        profile += Math.abs(Math.sin(progress * Math.PI * 2)) * 0.058 - 0.02;
        break;
      case 'softDecline':
        profile += Math.sin(progress * Math.PI + event.noiseSeed) * 0.018;
        break;
      case 'sharpDrop':
        profile += Math.sin(progress * Math.PI * 1.8 + event.noiseSeed) * 0.012;
        break;
      default:
        break;
    }

    const holdTexture =
      Math.sin((holdMinute + event.noiseSeed) * 0.28) * stabilityAmplitude +
      Math.cos((holdMinute + event.noiseSeed) * 0.14) * stabilityAmplitude * 0.46;

    return {
      value: baseline + amplitude * profile + holdTexture + eventOscillation * 0.24,
      linePhase: 'nocturnalHold' as const,
    };
  }

  const declineMinute = eventMinute - event.riseDuration - event.holdDuration;
  const progress = clamp(declineMinute / Math.max(0.001, event.declineDuration), 0, 1);
  const eased =
    event.shapeVariant === 'sharpDrop'
      ? Math.pow(progress, 0.62)
      : event.shapeVariant === 'softDecline'
        ? Math.pow(progress, 1.28)
        : easeSmoother(progress);
  const declineTexture = Math.sin((declineMinute + event.noiseSeed) * 0.22) * amplitude * 0.01;

  return {
    value: baseline + amplitude * (1 - eased) + declineTexture,
    linePhase: 'nocturnalDecline' as const,
  };
}

function sampleDaytimeEventValue(event: DaytimeEventPlan, minuteOfDay: number, baseline: number) {
  const eventMinute = minuteOfDay - event.startMinute;
  const totalDuration = event.riseDuration + event.holdDuration + event.declineDuration;

  if (eventMinute < 0 || eventMinute > totalDuration) {
    return null;
  }

  const amplitude = Math.max(9, event.peakLevel - baseline);
  const oscillation =
    Math.sin((eventMinute + event.noiseSeed) * 0.31) * amplitude * 0.012 +
    Math.cos((eventMinute + event.noiseSeed) * 0.17) * amplitude * 0.006;

  if (eventMinute <= event.riseDuration) {
    const progress = clamp(eventMinute / Math.max(0.001, event.riseDuration), 0, 1);
    const eased = easeSmoother(progress);
    const riseTexture =
      Math.sin(progress * Math.PI * 1.4 + event.noiseSeed) * amplitude * (0.008 + (1 - event.stabilityScore) * 0.014);
    const value = baseline + amplitude * eased + riseTexture + oscillation * 0.45;
    return {
      value,
      phase: value >= DETAIL_THRESHOLD_PERCENTAGES.activeEntry ? ('activeRise' as const) : ('activeEntry' as const),
    };
  }

  if (eventMinute <= event.riseDuration + event.holdDuration) {
    const holdMinute = eventMinute - event.riseDuration;
    const progress = clamp(holdMinute / Math.max(0.001, event.holdDuration), 0, 1);
    const stabilityAmplitude = amplitude * (0.01 + (1 - event.stabilityScore) * 0.052);
    let profile = 0.958;

    switch (event.shapeVariant) {
      case 'clean':
        profile += Math.sin(progress * Math.PI + event.noiseSeed) * 0.012;
        break;
      case 'rounded':
        profile += Math.sin(progress * Math.PI) * 0.028;
        break;
      case 'partial':
        profile -= 0.11;
        profile += Math.sin(progress * Math.PI * 1.6 + event.noiseSeed) * 0.018;
        break;
      case 'interrupted':
        profile -= Math.exp(-(((progress - 0.54) / 0.12) ** 2)) * 0.12;
        break;
      case 'softHold':
        profile += Math.sin(progress * Math.PI + event.noiseSeed) * 0.018;
        break;
      case 'strongHold':
        profile += 0.032 + Math.sin(progress * Math.PI * 2 + event.noiseSeed) * 0.01;
        break;
      case 'doubleLift':
        profile += Math.abs(Math.sin(progress * Math.PI * 2.1)) * 0.05 - 0.016;
        break;
      case 'tapered':
        profile -= progress * 0.08;
        break;
      default:
        break;
    }

    const holdTexture =
      Math.sin((holdMinute + event.noiseSeed) * 0.28) * stabilityAmplitude +
      Math.cos((holdMinute + event.noiseSeed) * 0.13) * stabilityAmplitude * 0.42;

    return {
      value: baseline + amplitude * profile + holdTexture + oscillation * 0.2,
      phase: 'plateau' as const,
    };
  }

  const declineMinute = eventMinute - event.riseDuration - event.holdDuration;
  const progress = clamp(declineMinute / Math.max(0.001, event.declineDuration), 0, 1);
  const eased =
    event.shapeVariant === 'tapered'
      ? Math.pow(progress, 1.24)
      : event.shapeVariant === 'interrupted'
        ? Math.pow(progress, 0.76)
        : easeSmoother(progress);
  const declineTexture = Math.sin((declineMinute + event.noiseSeed) * 0.24) * amplitude * 0.01;
  const value = baseline + amplitude * (1 - eased) + declineTexture;

  return {
    value,
    phase: value <= DETAIL_THRESHOLD_PERCENTAGES.elevated ? ('recovery' as const) : ('decline' as const),
  };
}

function getDateAtMinute(dayDate: Date, minuteOfDay: number) {
  return new Date(dayDate.getTime() + minuteOfDay * 60_000);
}

export function collectAutonomousDaytimeEventsBetween(
  startTimestamp: number,
  endTimestamp: number,
  options: AutonomousSignalOptions = {},
): ArcAutonomousDaytimeEventSummary[] {
  if (!(options.autonomousDaytimeEnabled ?? true) || endTimestamp <= startTimestamp) {
    return [];
  }

  const summaries: ArcAutonomousDaytimeEventSummary[] = [];
  let cursor = startOfDay(new Date(startTimestamp));
  const rangeEnd = startOfDay(new Date(endTimestamp));
  const performancePreset = options.performancePreset ?? 'average';

  while (cursor.getTime() <= rangeEnd.getTime()) {
    const dayPlan = getDaytimeDayPlan(cursor, performancePreset);

    dayPlan.events.forEach(event => {
      const startTime = getDateAtMinute(cursor, event.startMinute).getTime();
      const totalDuration = event.riseDuration + event.holdDuration + event.declineDuration;
      const endTime = startTime + totalDuration * 60_000;

      if (endTime <= startTimestamp || endTime > endTimestamp) {
        return;
      }

      summaries.push({
        id: event.id,
        timestamp: endTime,
        startTime,
        endTime,
        peakLevel: Number(event.peakLevel.toFixed(1)),
        qualityScore: Number(event.qualityScore.toFixed(3)),
        stabilityScore: Number(event.stabilityScore.toFixed(3)),
        riseDuration: Number(event.riseDuration.toFixed(1)),
        holdDuration: Number(event.holdDuration.toFixed(1)),
        declineDuration: Number(event.declineDuration.toFixed(1)),
        totalDuration: Number(totalDuration.toFixed(1)),
        shapeVariant: event.shapeVariant,
      });
    });

    cursor = new Date(cursor.getTime() + DAY_IN_MS);
  }

  return summaries.sort((left, right) => left.startTime - right.startTime);
}

export function collectAutonomousNocturnalEventsBetween(
  startTimestamp: number,
  endTimestamp: number,
  thresholdModel?: ArcThresholdModel,
  options: AutonomousSignalOptions = {},
): ArcAutonomousNocturnalEventSummary[] {
  if (endTimestamp <= startTimestamp) {
    return [];
  }

  const thresholds = resolveThresholdModel(thresholdModel);
  const summaries: ArcAutonomousNocturnalEventSummary[] = [];
  let cursor = startOfDay(new Date(startTimestamp));
  const rangeEnd = startOfDay(new Date(endTimestamp));
  const performancePreset = options.performancePreset ?? 'average';

  while (cursor.getTime() <= rangeEnd.getTime()) {
    const nightPlan = getNocturnalNightPlan(cursor, performancePreset);

    nightPlan.events.forEach((event, index) => {
      if (event.peakLevel < thresholds.activeEntry) {
        return;
      }

      const startTime = getDateAtMinute(cursor, event.startMinute).getTime();
      const totalDuration = event.riseDuration + event.holdDuration + event.declineDuration;
      const endTime = startTime + totalDuration * 60_000;

      if (endTime <= startTimestamp || endTime > endTimestamp) {
        return;
      }

      summaries.push({
        id: `${nightPlan.key}-night-${index}`,
        timestamp: endTime,
        startTime,
        endTime,
        peakLevel: Number(event.peakLevel.toFixed(1)),
        qualityScore: Number(event.qualityScore.toFixed(3)),
        stabilityScore: Number(event.stabilityScore.toFixed(3)),
        riseDuration: Number(event.riseDuration.toFixed(1)),
        holdDuration: Number(event.holdDuration.toFixed(1)),
        declineDuration: Number(event.declineDuration.toFixed(1)),
        totalDuration: Number(totalDuration.toFixed(1)),
        shapeVariant: event.shapeVariant,
      });
    });

    cursor = new Date(cursor.getTime() + DAY_IN_MS);
  }

  return summaries.sort((left, right) => left.startTime - right.startTime);
}

export function buildAutonomousSignalPoint(timestamp: number, options: AutonomousSignalOptions = {}): AutonomousSignalPoint {
  const date = new Date(timestamp);
  const minuteOfDay = date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60 + date.getMilliseconds() / 60_000;
  const ambientBaseline = getAmbientSignalBaseline(date);
  const overnightPlan = getNocturnalNightPlan(date, options.performancePreset ?? 'average');
  const overnightBaseline = clamp((ambientBaseline + overnightPlan.baseline) / 2, 10, 28);
  const overnightRestingValue = sampleRestingBaseline({
    date,
    minuteOfDay,
    planKey: overnightPlan.key,
    context: 'night',
    baseBaseline: overnightBaseline,
    quietLevel: overnightPlan.quietLevel,
    volatilityFactor: overnightPlan.volatilityFactor,
    recoveryFactor: overnightPlan.recoveryFactor,
    pulses: overnightPlan.pulses,
    events: overnightPlan.events,
    minValue: 8.5,
    maxValue: 31.5,
  });

  if (minuteOfDay >= NOCTURNAL_WINDOW_START_MINUTE && minuteOfDay < overnightPlan.wakeMinute) {
    for (const event of overnightPlan.events) {
      const sampled = sampleNocturnalEventValue(event, minuteOfDay, overnightRestingValue);

      if (sampled) {
        return {
          value: clamp(sampled.value, 0, DAYTIME_SIGNAL_MAX),
          linePhase: sampled.linePhase,
          isNocturnalActive: true,
          context: 'night',
          phase: mapLinePhaseToLivePhase(sampled.linePhase),
        };
      }
    }

    return {
      value: clamp(overnightRestingValue, 0, DAYTIME_SIGNAL_MAX),
      linePhase: 'default',
      isNocturnalActive: false,
      context: 'night',
      phase: 'idle',
    };
  }

  const daytimePlan = getDaytimeDayPlan(date, options.performancePreset ?? 'average');
  const daytimeBaseline = clamp((ambientBaseline + daytimePlan.baseline) / 2, 12, 30);
  const daytimeEvents = options.autonomousDaytimeEnabled ?? true ? daytimePlan.events : [];
  const daytimeRestingValue = sampleRestingBaseline({
    date,
    minuteOfDay,
    planKey: daytimePlan.key,
    context: 'day',
    baseBaseline: daytimeBaseline,
    quietLevel: daytimePlan.quietLevel,
    volatilityFactor: daytimePlan.volatilityFactor,
    recoveryFactor: daytimePlan.recoveryFactor,
    pulses: daytimePlan.pulses,
    events: daytimeEvents,
    minValue: 10.5,
    maxValue: 37.5,
  });

  if (options.autonomousDaytimeEnabled ?? true) {
    for (const event of daytimeEvents) {
      const sampled = sampleDaytimeEventValue(event, minuteOfDay, daytimeRestingValue);

      if (sampled) {
        return {
          value: clamp(sampled.value, 0, DAYTIME_SIGNAL_MAX),
          linePhase: 'default',
          isNocturnalActive: false,
          context: 'day',
          phase: sampled.phase,
        };
      }
    }
  }

  return {
    value: clamp(daytimeRestingValue, 0, DAYTIME_SIGNAL_MAX),
    linePhase: 'default',
    isNocturnalActive: false,
    context: 'day',
    phase: 'idle',
  };
}

function createRestingTarget(currentAnchor: number) {
  const roll = Math.random();

  if (roll < 0.6) {
    return clamp(currentAnchor + randomBetween(-1.05, 1.05), 20.4, 25.4);
  }

  if (roll < 0.83) {
    return clamp(randomBetween(26.2, 33.1), 25.2, 34);
  }

  return clamp(randomBetween(17.2, 20.6), 15.2, 21);
}

function getDetailState(
  currentValue: number,
  phase: LiveDetailSimulationPhase,
  thresholdModel?: ArcThresholdModel,
): LiveDetailState {
  const thresholds = resolveThresholdModel(thresholdModel);

  if (phase === 'activeEntry' || phase === 'activeRise') {
    return {
      key: 'entering',
      label: 'Entering Active State',
      toneColor: foundationTheme.signal.warning,
      chipBorderColor: hexToRgba(foundationTheme.signal.warning, 0.22),
      chipBackground: hexToRgba(foundationTheme.signal.warning, 0.1),
      chipTextColor: foundationTheme.signal.warning,
      insightKey: null,
    };
  }

  if (phase === 'plateau' || (phase === 'decline' && currentValue >= thresholds.activeEntry)) {
    if (currentValue >= thresholds.peak - 1.5) {
      return {
        key: 'peak',
        label: 'Peak Hold',
        toneColor: foundationTheme.chart.peak,
        chipBorderColor: hexToRgba(foundationTheme.chart.peak, 0.22),
        chipBackground: hexToRgba(foundationTheme.chart.peak, 0.1),
        chipTextColor: foundationTheme.chart.peak,
        insightKey: null,
      };
    }

    return {
      key: 'active',
      label: 'Active Hold',
      toneColor: foundationTheme.text.highlight,
      chipBorderColor: hexToRgba(foundationTheme.signal.warning, 0.22),
      chipBackground: hexToRgba(foundationTheme.signal.warning, 0.08),
      chipTextColor: foundationTheme.text.highlight,
      insightKey: null,
    };
  }

  if ((phase === 'decline' || phase === 'recovery') && currentValue >= thresholds.reduced) {
    return {
      key: 'returning',
      label: 'Returning to Baseline',
      toneColor: foundationTheme.chart.baseline,
      chipBorderColor: hexToRgba(foundationTheme.chart.baseline, 0.2),
      chipBackground: hexToRgba(foundationTheme.chart.baseline, 0.085),
      chipTextColor: foundationTheme.accent.secondary,
      insightKey: null,
    };
  }

  if (!thresholds.baselineReady) {
    if (currentValue >= thresholds.elevated) {
      return {
        key: 'elevated',
        label: 'Early Elevated Estimate',
        toneColor: foundationTheme.signal.up,
        chipBorderColor: hexToRgba(foundationTheme.signal.up, 0.22),
        chipBackground: hexToRgba(foundationTheme.signal.up, 0.1),
        chipTextColor: foundationTheme.signal.up,
        insightKey: 'elevated',
      };
    }

    if (currentValue >= thresholds.reduced) {
      return {
        key: 'baseline',
        label: 'Learning Baseline',
        toneColor: foundationTheme.chart.baseline,
        chipBorderColor: hexToRgba(foundationTheme.chart.baseline, 0.22),
        chipBackground: hexToRgba(foundationTheme.chart.baseline, 0.1),
        chipTextColor: foundationTheme.accent.secondary,
        insightKey: 'baseline',
      };
    }

    return {
      key: 'reduced',
      label: 'Early Reduced Estimate',
      toneColor: foundationTheme.signal.down,
      chipBorderColor: hexToRgba(foundationTheme.signal.down, 0.22),
      chipBackground: hexToRgba(foundationTheme.signal.down, 0.1),
      chipTextColor: foundationTheme.signal.down,
      insightKey: 'reduced',
    };
  }

  if (currentValue >= thresholds.elevated) {
    return {
      key: 'elevated',
      label: 'Elevated Fullness',
      toneColor: foundationTheme.signal.up,
      chipBorderColor: hexToRgba(foundationTheme.signal.up, 0.22),
      chipBackground: hexToRgba(foundationTheme.signal.up, 0.1),
      chipTextColor: foundationTheme.signal.up,
      insightKey: 'elevated',
    };
  }

  if (currentValue >= thresholds.reduced) {
    return {
      key: 'baseline',
      label: 'Baseline Hold',
      toneColor: foundationTheme.chart.baseline,
      chipBorderColor: hexToRgba(foundationTheme.chart.baseline, 0.22),
      chipBackground: hexToRgba(foundationTheme.chart.baseline, 0.1),
      chipTextColor: foundationTheme.accent.secondary,
      insightKey: 'baseline',
    };
  }

  return {
    key: 'reduced',
    label: 'Reduced Fullness',
    toneColor: foundationTheme.signal.down,
    chipBorderColor: hexToRgba(foundationTheme.signal.down, 0.22),
    chipBackground: hexToRgba(foundationTheme.signal.down, 0.1),
    chipTextColor: foundationTheme.signal.down,
    insightKey: 'reduced',
  };
}

function getThresholdVisual(
  threshold: DetailThresholdDefinition,
  currentValue: number,
  isSimulating: boolean,
  phase: LiveDetailSimulationPhase,
  thresholdModel?: ArcThresholdModel,
) {
  const resolved = resolveThresholdModel(thresholdModel);
  const isPrimary = threshold.priority === 'primary';
  const isSecondary = threshold.priority === 'secondary';
  let baseLineAlpha =
    isPrimary
      ? 0.16
      : isSecondary
        ? 0.07
        : 0.03;
  let baseLabelAlpha =
    isPrimary
      ? 0.74
      : isSecondary
        ? 0.44
        : 0.22;
  const proximityWindow =
    isPrimary
      ? 12
      : isSecondary
        ? 18
        : 24;
  const proximity = clamp(1 - Math.abs(currentValue - threshold.value) / proximityWindow, 0, 1);
  const crossed = isSimulating && currentValue >= threshold.value ? 1 : 0;
  const isAscendingPhase =
    phase === 'earlyRise' || phase === 'activeEntry' || phase === 'activeRise';
  let stageBoost = 0;

  if (isSimulating) {
    if (threshold.key === 'elevated') {
      if (phase === 'earlyRise') {
        stageBoost = 0.08;
      } else if (isAscendingPhase || phase === 'plateau' || phase === 'decline') {
        baseLineAlpha *= 0.9;
        baseLabelAlpha *= 0.92;
        stageBoost = 0.02;
      }
    } else if (threshold.key === 'activeEntry') {
      if (phase === 'earlyRise') {
        stageBoost = 0.03 + proximity * 0.04;
      } else if (phase === 'activeEntry') {
        stageBoost = 0.12;
      } else if (phase === 'activeRise' || phase === 'plateau') {
        stageBoost = 0.08;
      } else if (phase === 'decline' && currentValue >= DETAIL_THRESHOLD_PERCENTAGES.activeEntry - 6) {
        stageBoost = 0.05;
      }
    } else if (threshold.key === 'peak') {
      if (phase === 'activeRise') {
        stageBoost = proximity * 0.05;
      } else if (phase === 'plateau' && currentValue >= DETAIL_THRESHOLD_PERCENTAGES.peak - 4.5) {
        stageBoost = 0.06;
      }
    } else if (threshold.key === 'record') {
      if (
        (phase === 'activeRise' || phase === 'plateau') &&
        currentValue >= DETAIL_THRESHOLD_PERCENTAGES.record - 5.5
      ) {
        stageBoost = 0.05;
      }
    }
  }

  if (!resolved.peakReady && (threshold.key === 'peak' || threshold.key === 'record')) {
    baseLineAlpha *= 0.56;
    baseLabelAlpha *= 0.64;
  }

  if (!resolved.baselineReady && (threshold.key === 'reduced' || threshold.key === 'baseline' || threshold.key === 'elevated')) {
    baseLineAlpha *= 0.82;
    baseLabelAlpha *= 0.9;
  }

  const emphasis =
    isSimulating
      ? Math.max(
          proximity * (threshold.priority === 'tertiary' ? 0.78 : 0.9),
          crossed * (threshold.priority === 'tertiary' ? 0.92 : 0.72),
          stageBoost,
        )
      : 0;

  const idleVisibility = isPrimary ? proximity : 0;
  const activeVisibility = Math.max(
    proximity * (isPrimary ? 0.9 : isSecondary ? 0.82 : 0.78),
    crossed * (isPrimary ? 0.62 : isSecondary ? 0.78 : 0.84),
    stageBoost * (isPrimary ? 0.78 : 0.92),
  );
  const visibility = isSimulating ? activeVisibility : idleVisibility;
  const showLine = visibility > (isPrimary ? 0.12 : isSecondary ? 0.24 : 0.34);
  const showLabel = visibility > (isPrimary ? 0.24 : isSecondary ? 0.42 : 0.56);
  const lineAlphaMultiplier = isSimulating ? 0.25 + visibility * 0.9 : visibility;
  const labelAlphaMultiplier = isSimulating ? 0.28 + visibility * 0.9 : visibility;

  return {
    showLine,
    showLabel,
    lineColor: rgba(
      threshold.color,
      showLine
        ? clamp(
            (baseLineAlpha +
              emphasis *
                (isPrimary
                  ? 0.07
                  : isSecondary
                    ? 0.1
                    : 0.14)) * lineAlphaMultiplier,
            0,
            0.34,
          )
        : 0,
    ),
    labelColor: rgba(
      threshold.color,
      showLabel ? clamp((baseLabelAlpha + emphasis * 0.16) * labelAlphaMultiplier, 0, 0.9) : 0,
    ),
    labelBackground: showLabel ? rgba(
      [0, 0, 0],
      isPrimary
        ? 0.14 + emphasis * 0.02
        : isSecondary
          ? 0.08 + emphasis * 0.02
          : 0.03 + emphasis * 0.02,
    ) : 'transparent',
    strokeWidth:
      isPrimary
        ? 1.02 + emphasis * 0.08
        : isSecondary
          ? 0.82 + emphasis * 0.1
          : 0.64 + emphasis * 0.12,
  };
}

function getReactiveSignalTone(state: LiveDetailState) {
  if (state.key === 'reduced') {
    return {
      color: foundationTheme.signal.down,
      thresholdValue: DETAIL_THRESHOLD_PERCENTAGES.reduced,
      bandOpacity: 0.14,
      borderColor: hexToRgba(foundationTheme.signal.down, 0.2),
    };
  }

  if (state.key === 'elevated') {
    return {
      color: foundationTheme.signal.up,
      thresholdValue: DETAIL_THRESHOLD_PERCENTAGES.elevated,
      bandOpacity: 0.16,
      borderColor: hexToRgba(foundationTheme.signal.up, 0.22),
    };
  }

  if (state.key === 'entering' || state.key === 'active' || state.key === 'peak') {
    return {
      color: foundationTheme.signal.warning,
      thresholdValue: DETAIL_THRESHOLD_PERCENTAGES.activeEntry,
      bandOpacity: 0.16,
      borderColor: hexToRgba(foundationTheme.signal.warning, 0.22),
    };
  }

  return {
    color: foundationTheme.chart.baseline,
    thresholdValue: DETAIL_THRESHOLD_PERCENTAGES.baseline,
    bandOpacity: 0.12,
    borderColor: hexToRgba(foundationTheme.chart.baseline, 0.18),
  };
}

function buildSmoothPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0]!.x} ${points[0]!.y}`;
  if (points.length === 2) return `M ${points[0]!.x} ${points[0]!.y} L ${points[1]!.x} ${points[1]!.y}`;

  let path = `M ${points[0]!.x} ${points[0]!.y}`;

  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index]!;
    const next = points[index + 1]!;
    const midpointX = (current.x + next.x) / 2;
    const midpointY = (current.y + next.y) / 2;

    path += ` Q ${current.x} ${current.y}, ${midpointX} ${midpointY}`;
  }

  const penultimate = points[points.length - 2]!;
  const last = points[points.length - 1]!;
  path += ` Q ${penultimate.x} ${penultimate.y}, ${last.x} ${last.y}`;

  return path;
}

function buildClosedAreaPath(points: Array<{ x: number; y: number }>, baselineY: number) {
  if (points.length === 0) {
    return '';
  }

  const first = points[0]!;
  const last = points[points.length - 1]!;
  return `${buildSmoothPath(points)} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
}

type TrendFillSegment = {
  context: HistoricalSignalPoint['context'];
  points: Array<{ x: number; y: number }>;
};

function buildTrendFillSegments(
  points: HistoricalSignalPoint[],
  geometryPoints: Array<{ x: number; y: number }>,
  toX: (time: Date) => number,
  yScale: (value: number) => number,
) {
  if (points.length === 0 || geometryPoints.length === 0) {
    return [] as TrendFillSegment[];
  }

  const segments: TrendFillSegment[] = [];
  let currentContext = getTrendTimeContext(points[0]!.time);
  let currentRun: Array<{ x: number; y: number }> = [geometryPoints[0]!];

  for (let index = 1; index < points.length; index += 1) {
    const endPoint = points[index]!;
    const endGeometry = geometryPoints[index]!;
    let startTime = points[index - 1]!.time;
    let startValue = points[index - 1]!.value;
    const endTime = endPoint.time;
    const endValue = endPoint.value;

    while (true) {
      const boundary = getNextTrendTimeBoundary(startTime);
      if (boundary.getTime() >= endTime.getTime()) {
        break;
      }

      const blend = clamp((boundary.getTime() - startTime.getTime()) / Math.max(1, endTime.getTime() - startTime.getTime()), 0, 1);
      const boundaryValue = startValue + (endValue - startValue) * blend;
      const boundaryPoint = {
        x: toX(boundary),
        y: yScale(boundaryValue),
      };

      currentRun.push(boundaryPoint);
      if (currentRun.length > 1) {
        segments.push({
          context: currentContext,
          points: currentRun,
        });
      }

      currentContext = getTrendTimeContext(boundary);
      currentRun = [boundaryPoint];
      startTime = boundary;
      startValue = boundaryValue;
    }

    currentRun.push(endGeometry);
  }

  if (currentRun.length > 1) {
    segments.push({
      context: currentContext,
      points: currentRun,
    });
  }

  return segments;
}

type RenderSignalPoint = {
  x: number;
  y: number;
  slope: number;
};

function getMedianXStep(points: Array<{ x: number }>) {
  const steps = points
    .slice(1)
    .map((point, index) => point.x - points[index]!.x)
    .filter(step => step > 0)
    .sort((left, right) => left - right);

  if (steps.length === 0) {
    return 0;
  }

  return steps[Math.floor(steps.length / 2)] ?? 0;
}

function buildPointRuns(points: RenderSignalPoint[], gapThresholdMultiplier = Number.POSITIVE_INFINITY) {
  if (points.length === 0) {
    return [] as RenderSignalPoint[][];
  }

  if (!Number.isFinite(gapThresholdMultiplier) || points.length < 3) {
    return [points];
  }

  const medianStep = getMedianXStep(points);
  if (medianStep <= 0) {
    return [points];
  }

  const gapThreshold = medianStep * gapThresholdMultiplier;
  const runs: RenderSignalPoint[][] = [];
  let currentRun: RenderSignalPoint[] = [points[0]!];

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1]!;
    const point = points[index]!;

    if (point.x - previous.x > gapThreshold) {
      runs.push(currentRun);
      currentRun = [point];
      continue;
    }

    currentRun.push(point);
  }

  runs.push(currentRun);
  return runs;
}

function useLiveSignal(options: LiveSignalOptions): LiveSignalSnapshot {
  const [history, setHistory] = useState<number[]>(() => Array.from({ length: options.samples + 1 }, () => HOLD_CENTER));
  const {
    quietRange,
    moveRange,
    transitionRange,
    settleRange,
    returnToBaseline = false,
    anchorToBaseline = false,
    sampleInterval,
    breathing: breathingConfig,
  } = options;

  const phaseRef = useRef<LivePhase>('hold');
  const currentValueRef = useRef(HOLD_CENTER);
  const holdAnchorRef = useRef(HOLD_CENTER);
  const startValueRef = useRef(HOLD_CENTER);
  const targetValueRef = useRef(HOLD_CENTER);
  const phaseStartedAtRef = useRef(0);
  const transitionDurationRef = useRef(1);
  const returnDurationRef = useRef(2.2);
  const nextEventAtRef = useRef(1.4);
  const sampleAccumulatorRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let animationFrame = 0;
    const start = performance.now();

    const step = (now: number) => {
      const seconds = (now - start) / 1000;
      const lastFrame = lastFrameRef.current ?? now;
      const dt = Math.min(0.05, (now - lastFrame) / 1000);
      lastFrameRef.current = now;

      if (phaseRef.current === 'hold' && seconds >= nextEventAtRef.current) {
        const direction = Math.random() > 0.5 ? -1 : 1;
        const move = moveRange[0] + Math.random() * (moveRange[1] - moveRange[0]);
        const targetBase = anchorToBaseline ? HOLD_CENTER : holdAnchorRef.current;
        const target = clamp(targetBase + direction * move, HOLD_MIN, HOLD_MAX);

        startValueRef.current = currentValueRef.current;
        targetValueRef.current = target;
        transitionDurationRef.current = transitionRange[0] + Math.random() * (transitionRange[1] - transitionRange[0]);
        returnDurationRef.current = settleRange[0] + Math.random() * (settleRange[1] - settleRange[0]);
        phaseStartedAtRef.current = seconds;
        phaseRef.current = 'transition';
      }

      if (phaseRef.current === 'transition') {
        const progress = clamp((seconds - phaseStartedAtRef.current) / transitionDurationRef.current, 0, 1);
        const eased = easeInOut(progress);
        currentValueRef.current = startValueRef.current + (targetValueRef.current - startValueRef.current) * eased;

        if (progress >= 1) {
          if (returnToBaseline) {
            startValueRef.current = currentValueRef.current;
            targetValueRef.current = HOLD_CENTER;
            phaseRef.current = 'return';
            phaseStartedAtRef.current = seconds;
          } else {
            holdAnchorRef.current = targetValueRef.current;
            currentValueRef.current = holdAnchorRef.current;
            phaseRef.current = 'hold';
            nextEventAtRef.current = seconds + quietRange[0] + Math.random() * (quietRange[1] - quietRange[0]);
          }
        }
      } else if (phaseRef.current === 'return') {
        const returnProgress = clamp((seconds - phaseStartedAtRef.current) / returnDurationRef.current, 0, 1);
        const eased = easeInOut(returnProgress);
        const drift =
          Math.sin(seconds * breathingConfig.settleSpeedA) * breathingConfig.settleSin +
          Math.cos(seconds * breathingConfig.settleSpeedB) * breathingConfig.settleCos;
        const returningValue = startValueRef.current + (targetValueRef.current - startValueRef.current) * eased;
        currentValueRef.current = returningValue + drift * (1 - eased);

        if (returnProgress >= 1) {
          holdAnchorRef.current = HOLD_CENTER;
          currentValueRef.current = HOLD_CENTER;
          phaseRef.current = 'hold';
          nextEventAtRef.current = seconds + quietRange[0] + Math.random() * (quietRange[1] - quietRange[0]);
        }
      } else {
        const breathing =
          Math.sin(seconds * breathingConfig.holdSpeedA) * breathingConfig.holdSin +
          Math.cos(seconds * breathingConfig.holdSpeedB) * breathingConfig.holdCos;
        currentValueRef.current = holdAnchorRef.current + breathing;
      }

      sampleAccumulatorRef.current += dt;
      if (sampleAccumulatorRef.current >= sampleInterval) {
        sampleAccumulatorRef.current = 0;
        setHistory(prev => [...prev.slice(1), currentValueRef.current]);
      }

      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [
    quietRange,
    moveRange,
    transitionRange,
    settleRange,
    returnToBaseline,
    anchorToBaseline,
    sampleInterval,
    breathingConfig,
  ]);

  return {
    history,
    currentValue: history[history.length - 1] ?? HOLD_CENTER,
    baseline: HOLD_CENTER,
  };
}

function useLiveDetailSignal({
  samples,
  sampleInterval,
  simulatedDate,
  autonomousDaytimeEnabled = true,
  performancePreset = 'average',
}: {
  samples: number;
  sampleInterval: number;
  simulatedDate?: Date;
  autonomousDaytimeEnabled?: boolean;
  performancePreset?: ArcPerformancePresetId;
}): LiveDetailSignalSnapshot {
  const restingBaseline: number = DETAIL_THRESHOLD_PERCENTAGES.baseline;
  const [history, setHistory] = useState<number[]>(() => Array.from({ length: samples + 1 }, () => restingBaseline));
  const [historyLinePhases, setHistoryLinePhases] = useState<ArcLiveLinePhase[]>(() => Array.from({ length: samples + 1 }, () => 'default'));
  const [phase, setPhase] = useState<LiveDetailSimulationPhase>('idle');
  const [linePhase, setLinePhase] = useState<ArcLiveLinePhase>('default');
  const [isNocturnalActive, setIsNocturnalActive] = useState(false);
  const phaseRef = useRef<LiveDetailSimulationPhase>('idle');
  const linePhaseRef = useRef<ArcLiveLinePhase>('default');
  const isNocturnalActiveRef = useRef(false);
  const currentValueRef = useRef(restingBaseline);
  const restingAnchorRef = useRef(restingBaseline);
  const startValueRef = useRef(restingBaseline);
  const targetValueRef = useRef(restingBaseline);
  const stageStartedAtRef = useRef(0);
  const stageDurationRef = useRef(1);
  const holdUntilRef = useRef(4.4);
  const isSimulatingRef = useRef(false);
  const sampleAccumulatorRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);
  const currentSecondsRef = useRef(0);
  const simulationStagesRef = useRef<DetailSimulationStage[]>([]);
  const simulationIndexRef = useRef(-1);
  const simulatedDateRef = useRef<Date | null>(simulatedDate ?? null);

  const setLivePhase = (nextPhase: LiveDetailSimulationPhase) => {
    phaseRef.current = nextPhase;
    setPhase(previousPhase => (previousPhase === nextPhase ? previousPhase : nextPhase));
  };

  const setCurrentLinePhase = (nextLinePhase: ArcLiveLinePhase) => {
    linePhaseRef.current = nextLinePhase;
    setLinePhase(previous => (previous === nextLinePhase ? previous : nextLinePhase));
  };

  const setNocturnalActiveState = (nextValue: boolean) => {
    isNocturnalActiveRef.current = nextValue;
    setIsNocturnalActive(previous => (previous === nextValue ? previous : nextValue));
  };

  const startSimulationStage = (seconds: number) => {
    simulationIndexRef.current += 1;
    const nextStage = simulationStagesRef.current[simulationIndexRef.current];

    if (!nextStage) {
      isSimulatingRef.current = false;
      restingAnchorRef.current = targetValueRef.current;
      startValueRef.current = currentValueRef.current;
      targetValueRef.current = restingAnchorRef.current;
      holdUntilRef.current = seconds + randomBetween(4.8, 7.4);
      setCurrentLinePhase('default');
      setNocturnalActiveState(false);
      setLivePhase('idle');
      return;
    }

    startValueRef.current = currentValueRef.current;
    targetValueRef.current = nextStage.target;
    stageDurationRef.current = nextStage.duration;
    stageStartedAtRef.current = seconds;
    setLivePhase(nextStage.id);
  };

  const simulateEvent = () => {
    if (isSimulatingRef.current) return;

    const preset = getArcPerformancePreset(performancePreset);
    const restingStart = currentValueRef.current;
    const earlyRiseTarget = clamp(randomBetween(33.5, 38.8) + preset.livePeakShift * 0.18, DETAIL_THRESHOLD_PERCENTAGES.elevated + 1.5, 43.5);
    const activeEntryTarget = clamp(randomBetween(67.5, 73.5) + preset.livePeakShift * 0.26, DETAIL_THRESHOLD_PERCENTAGES.activeEntry + 1, 79.5);
    const peakTarget =
      Math.random() > 0.9
        ? clamp(randomBetween(100.8, 104.2) + preset.livePeakShift, DETAIL_THRESHOLD_PERCENTAGES.peak - 1.5, DETAIL_THRESHOLD_PERCENTAGES.record)
        : clamp(randomBetween(88.5, 98.4) + preset.livePeakShift, DETAIL_THRESHOLD_PERCENTAGES.activeEntry + 8, DETAIL_THRESHOLD_PERCENTAGES.peak + 2);
    const returningTarget = clamp(randomBetween(24.8, 29.8) + preset.recoveryShift * 9, DETAIL_THRESHOLD_PERCENTAGES.baseline + 0.8, 33.5);
    const recoveryTarget = clamp(randomBetween(19.2, 22.8) + preset.recoveryShift * 8 + preset.baselineShift * 0.25, DETAIL_THRESHOLD_PERCENTAGES.baseline - 1.5, 24.8);

    simulationStagesRef.current = [
      { id: 'restingHold', duration: randomBetween(1.3, 1.8), target: restingStart, jitter: 0.1 },
      { id: 'earlyRise', duration: randomBetween(4.2, 5.2), target: earlyRiseTarget, jitter: 0.035 },
      { id: 'activeEntry', duration: randomBetween(3.1, 3.9), target: activeEntryTarget, jitter: 0.03 },
      { id: 'activeRise', duration: randomBetween(4.1, 5.1), target: peakTarget, jitter: 0.045 },
      { id: 'plateau', duration: randomBetween(1.8, 2.5), target: peakTarget, jitter: peakTarget >= DETAIL_THRESHOLD_PERCENTAGES.peak ? 0.08 : 0.06 },
      { id: 'decline', duration: randomBetween(7.8, 9.4), target: returningTarget, jitter: 0.024 },
      { id: 'recovery', duration: randomBetween(7.0, 8.6), target: recoveryTarget, jitter: 0.026 },
    ];

    simulationIndexRef.current = -1;
    isSimulatingRef.current = true;
    startSimulationStage(currentSecondsRef.current);
  };

  useEffect(() => {
    simulatedDateRef.current = simulatedDate ?? null;
  }, [simulatedDate]);

  useEffect(() => {
    let animationFrame = 0;
    const start = performance.now();

    const step = (now: number) => {
      const seconds = (now - start) / 1000;
      currentSecondsRef.current = seconds;

      const lastFrame = lastFrameRef.current ?? now;
      const dt = Math.min(0.05, (now - lastFrame) / 1000);
      lastFrameRef.current = now;

      if (isSimulatingRef.current) {
        const activeStage = simulationStagesRef.current[simulationIndexRef.current];

        if (activeStage) {
          const progress = clamp((seconds - stageStartedAtRef.current) / stageDurationRef.current, 0, 1);
          const eased =
            activeStage.id === 'restingHold' || activeStage.id === 'plateau'
              ? easeInOut(progress)
              : easeSmoother(progress);
          const microDrift =
            Math.sin(seconds * (activeStage.id === 'decline' || activeStage.id === 'recovery' ? 0.34 : 0.52)) * activeStage.jitter +
            Math.cos(seconds * 0.24) * activeStage.jitter * 0.42;

          if (activeStage.id === 'restingHold' || activeStage.id === 'plateau') {
            currentValueRef.current = activeStage.target + microDrift * 0.72;
          } else {
            const movedValue = startValueRef.current + (targetValueRef.current - startValueRef.current) * eased;
            const settleFade =
              activeStage.id === 'recovery'
                ? Math.max(0, 1 - easeInOut(progress))
                : 1;
            const softenedMotion =
              microDrift *
              (activeStage.id === 'decline'
                ? 0.11
                : activeStage.id === 'recovery'
                  ? 0.07 * settleFade
                  : 0.18);
            currentValueRef.current = movedValue + softenedMotion;
          }

          if (progress >= 1) {
            currentValueRef.current = activeStage.target;
            startSimulationStage(seconds);
          }
        }
      } else {
        const activeSimulatedDate = simulatedDateRef.current;
        const autonomousSignal =
          activeSimulatedDate != null
            ? buildAutonomousSignalPoint(activeSimulatedDate.getTime(), { autonomousDaytimeEnabled, performancePreset })
            : null;

        if (autonomousSignal) {
          currentValueRef.current = autonomousSignal.value;
          restingAnchorRef.current = clamp(autonomousSignal.value, DETAIL_THRESHOLD_PERCENTAGES.reduced, DETAIL_THRESHOLD_PERCENTAGES.elevated + 12);
          setCurrentLinePhase(autonomousSignal.linePhase);
          setNocturnalActiveState(autonomousSignal.isNocturnalActive);
          setLivePhase(autonomousSignal.phase);
        } else {
          setCurrentLinePhase('default');
          setNocturnalActiveState(false);

          if (phaseRef.current === 'idle' && seconds >= holdUntilRef.current) {
            startValueRef.current = currentValueRef.current;
            targetValueRef.current = createRestingTarget(restingAnchorRef.current);
            stageDurationRef.current = randomBetween(4.8, 7.4);
            stageStartedAtRef.current = seconds;
            setLivePhase('restingHold');
          }

          if (phaseRef.current === 'restingHold') {
            const progress = clamp((seconds - stageStartedAtRef.current) / stageDurationRef.current, 0, 1);
            const eased = easeInOut(progress);
            const drift = Math.sin(seconds * 0.22) * 0.06 + Math.cos(seconds * 0.14) * 0.035;
            currentValueRef.current = startValueRef.current + (targetValueRef.current - startValueRef.current) * eased + drift;

            if (progress >= 1) {
              restingAnchorRef.current = targetValueRef.current;
              currentValueRef.current = restingAnchorRef.current;
              holdUntilRef.current = seconds + randomBetween(5.6, 8.8);
              setLivePhase('idle');
            }
          } else {
            const breathing = Math.sin(seconds * 0.18) * 0.08 + Math.cos(seconds * 0.11) * 0.05;
            currentValueRef.current = restingAnchorRef.current + breathing;
          }
        }
      }

      currentValueRef.current = clamp(currentValueRef.current, DETAIL_DOMAIN_MIN, DETAIL_DOMAIN_MAX);

      sampleAccumulatorRef.current += dt;
      if (sampleAccumulatorRef.current >= sampleInterval) {
        sampleAccumulatorRef.current = 0;
        setHistory(previousHistory => [...previousHistory.slice(1), currentValueRef.current]);
        setHistoryLinePhases(previousPhases => [...previousPhases.slice(1), linePhaseRef.current]);
      }

      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [autonomousDaytimeEnabled, performancePreset, sampleInterval]);

  useEffect(() => {
    setHistory(Array.from({ length: samples + 1 }, () => currentValueRef.current));
    setHistoryLinePhases(Array.from({ length: samples + 1 }, () => linePhaseRef.current));
  }, [samples]);

  return {
    history,
    historyLinePhases,
    currentValue: currentValueRef.current,
    phase,
    linePhase,
    isSimulating: isSimulatingRef.current,
    isNocturnalActive,
    simulateEvent,
  };
}

export function useArcSharedLiveSignal(
  simulatedDate?: Date,
  options: AutonomousSignalOptions = {},
): ArcLiveSignalSnapshot {
  return useLiveDetailSignal({
    samples: 92,
    sampleInterval: 0.1,
    simulatedDate,
    autonomousDaytimeEnabled: options.autonomousDaytimeEnabled,
    performancePreset: options.performancePreset,
  });
}

export function useArcLiveTelemetry(signal: ArcLiveSignalSnapshot): ArcLiveTelemetry {
  const state = getDetailState(signal.currentValue, signal.phase);
  const previousValue = signal.history[signal.history.length - 2] ?? signal.currentValue;
  const slope = signal.currentValue - previousValue;
  const trend: ArcLiveTelemetryTrend = slope > 0.12 ? 'up' : slope < -0.12 ? 'down' : 'hold';

  return useMemo(
    () => ({
      currentValue: signal.currentValue,
      history: signal.history,
      historyLinePhases: signal.historyLinePhases,
      phase: signal.phase,
      linePhase: signal.linePhase,
      stateKey: state.key,
      trend,
      isSimulating: signal.isSimulating,
      isNocturnalActive: signal.isNocturnalActive,
      updatedAt: Date.now(),
    }),
    [
      signal.currentValue,
      signal.history,
      signal.historyLinePhases,
      signal.isSimulating,
      signal.isNocturnalActive,
      signal.linePhase,
      signal.phase,
      state.key,
      trend,
    ],
  );
}

function useSignalGeometry(
  history: number[],
  width: number,
  height: number,
  domainMin = HOLD_MIN,
  domainMax = HOLD_MAX,
  topPaddingRatio = 0.14,
  bottomPaddingRatio = 0.1,
  xPositions?: number[],
) {
  return useMemo(() => {
    const yScale = createYScale(height, domainMin, domainMax, topPaddingRatio, bottomPaddingRatio);
    const horizontalInset = width * 0.018;
    const drawableWidth = width - horizontalInset * 2;

    const points = history.map((value, index) => {
      const x = xPositions?.[index] ?? (horizontalInset + (index / Math.max(1, history.length - 1)) * drawableWidth);
      const previous = history[Math.max(0, index - 1)] ?? value;
      const next = history[Math.min(history.length - 1, index + 1)] ?? value;
      return { x, y: yScale(value), slope: previous - next };
    });

    const pointRuns = xPositions ? buildPointRuns(points, 5.5) : [points];
    const paths = pointRuns.map(run => buildSmoothPath(run)).filter(path => path.length > 0);
    const endPoint = points[points.length - 1];

    return {
      points,
      pointRuns,
      paths,
      endPoint,
      endColor: getTrendColor(endPoint?.slope ?? 0),
      yScale,
    };
  }, [bottomPaddingRatio, domainMax, domainMin, height, history, topPaddingRatio, width, xPositions]);
}

function createYScale(
  height: number,
  domainMin = HOLD_MIN,
  domainMax = HOLD_MAX,
  topPaddingRatio = 0.14,
  bottomPaddingRatio = 0.1,
) {
  const topPadding = height * topPaddingRatio;
  const bottomPadding = height * bottomPaddingRatio;
  const drawableHeight = height - topPadding - bottomPadding;

  return (value: number) => {
    const progress = (value - domainMin) / Math.max(0.001, domainMax - domainMin);
    return topPadding + (1 - progress) * drawableHeight;
  };
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function noise(seed: number) {
  const raw = Math.sin(seed * 12.9898 + 78.233) * 43758.5453123;
  return (raw - Math.floor(raw)) * 2 - 1;
}

function circularMinuteDistance(a: number, b: number) {
  const difference = Math.abs(a - b);
  return Math.min(difference, 1440 - difference);
}

function gaussianMinutePulse(minuteOfDay: number, center: number, width: number) {
  const distance = circularMinuteDistance(minuteOfDay, center);
  return Math.exp(-0.5 * (distance / width) ** 2);
}

function smoothSeries(values: number[], passes: number) {
  let smoothed = [...values];

  for (let pass = 0; pass < passes; pass += 1) {
    smoothed = smoothed.map((value, index) => {
      const previous = smoothed[Math.max(0, index - 1)] ?? value;
      const next = smoothed[Math.min(smoothed.length - 1, index + 1)] ?? value;
      return previous * 0.22 + value * 0.56 + next * 0.22;
    });
  }

  return smoothed;
}

function resampleSeries(values: number[], targetCount: number) {
  if (targetCount <= 0) {
    return [];
  }

  if (values.length <= 1) {
    return Array.from({ length: targetCount }, () => values[0] ?? HOLD_CENTER);
  }

  return Array.from({ length: targetCount }, (_, index) => {
    const progress = index / Math.max(1, targetCount - 1);
    const sourceIndex = progress * (values.length - 1);
    const lowerIndex = Math.floor(sourceIndex);
    const upperIndex = Math.min(values.length - 1, lowerIndex + 1);
    const blend = sourceIndex - lowerIndex;
    const lowerValue = values[lowerIndex] ?? values[0] ?? HOLD_CENTER;
    const upperValue = values[upperIndex] ?? lowerValue;
    return lowerValue + (upperValue - lowerValue) * blend;
  });
}

function getTrendTimeContext(date: Date): HistoricalSignalPoint['context'] {
  const hour = date.getHours();
  return hour < 7 ? 'night' : 'day';
}

function formatTrendTimeContextLabel(date: Date) {
  return getTrendTimeContext(date) === 'day' ? 'Day' : 'Nocturnal';
}

function getTrendFillPalette() {
  const dayFill = mixColor(hexToRgbTuple(foundationTheme.accent.primary), hexToRgbTuple(foundationTheme.text.highlight), 0.3);
  const nightBase: [number, number, number] = [92, 78, 146];
  const nightFill = mixColor(nightBase, [24, 18, 42], 0.26);

  return {
    dayFill,
    nightFill,
  };
}

function getNextTrendTimeBoundary(date: Date) {
  const boundary = new Date(date);

  if (getTrendTimeContext(date) === 'day') {
    boundary.setHours(24, 0, 0, 0);
    if (boundary.getTime() <= date.getTime()) {
      boundary.setDate(boundary.getDate() + 1);
    }
    return boundary;
  }

  boundary.setHours(7, 0, 0, 0);
  if (boundary.getTime() <= date.getTime()) {
    boundary.setDate(boundary.getDate() + 1);
  }
  return boundary;
}

function formatTrendAxisLabel(date: Date, rangeKey: TrendRangeKey, isLast: boolean) {
  if (isLast) {
    return 'NOW';
  }

  if (rangeKey === '1h') {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  if (rangeKey === '5h') {
    return formatTrendTimeMarker(date);
  }

  if (rangeKey === '24h') {
    return '';
  }

  if (rangeKey === '48h') {
    return `${date.toLocaleDateString([], { weekday: 'short' })} ${date.toLocaleTimeString([], { hour: 'numeric' })}`;
  }

  if (rangeKey === 'week') {
    return date.toLocaleDateString([], { weekday: 'short' });
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function formatTrendRangeDurationLabel(rangeKey: TrendRangeKey) {
  switch (rangeKey) {
    case '1h':
      return '1 HOUR';
    case '5h':
      return '5 HOURS';
    case '24h':
      return '24 HOURS';
    case '48h':
      return '48 HOURS';
    case 'week':
      return 'WEEK';
    case 'month':
      return 'MONTH';
    default:
      return 'TREND';
  }
}

function formatTrendRelativeMinuteLabel(minutes: number) {
  return `${Math.max(0, minutes)}M`;
}

function formatTrendRelativeHourLabel(hours: number, includeAgo = false) {
  return `${Math.max(0, hours)}H${includeAgo ? ' AGO' : ''}`;
}

function formatTrendDayHalfLabel(date: Date) {
  return `${date.toLocaleDateString([], { weekday: 'short' }).toUpperCase()} ${date.getHours() < 12 ? 'AM' : 'PM'}`;
}

function formatTrendTimeAnchorLabel(date: Date) {
  return date
    .toLocaleTimeString([], { hour: 'numeric' })
    .replace(/\s/g, '')
    .toUpperCase();
}

function formatTrendDateMarker(date: Date) {
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' }).toUpperCase();
}

function formatTrendTimeMarker(date: Date) {
  return date
    .toLocaleTimeString([], { hour: 'numeric' })
    .replace(/\s/g, '')
    .toUpperCase();
}

function formatTrendMinuteMarker(date: Date) {
  return date
    .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    .replace(/\s/g, '')
    .toUpperCase();
}

function buildRollingAnchorTimes(window: HistoricalSignalWindow, hours: number[]) {
  const anchors: Date[] = [];
  let cursor = startOfDay(window.start);

  while (cursor.getTime() <= window.end.getTime()) {
    hours.forEach(hour => {
      const anchor = new Date(cursor);
      anchor.setHours(hour, 0, 0, 0);

      if (anchor.getTime() > window.start.getTime() && anchor.getTime() < window.end.getTime()) {
        anchors.push(anchor);
      }
    });

    cursor = addDays(cursor, 1);
  }

  return anchors.sort((left, right) => left.getTime() - right.getTime());
}

function dedupeAxisLabels(labels: HistoricalSignalAxisLabel[]) {
  return labels.filter((label, index) => index === 0 || label.time.getTime() !== labels[index - 1]?.time.getTime());
}

function formatTrendRangeEndDate(date: Date) {
  const weekday = date.toLocaleDateString([], { weekday: 'short' }).toUpperCase();
  const monthDay = date.toLocaleDateString([], { month: 'short', day: 'numeric' }).toUpperCase();

  return `${weekday}, ${monthDay}`;
}

function formatTrendRangeSummary(rangeKey: TrendRangeKey, endDate: Date) {
  return `LAST ${formatTrendRangeDurationLabel(rangeKey)} | ENDS ${formatTrendRangeEndDate(endDate)} | ${formatClockLabel(endDate)}`;
}

function buildStableAxisLabels(
  rangeKey: TrendRangeKey,
  labels: HistoricalSignalAxisLabel[],
  positionForTime: (time: Date) => number,
  chartWidth = TREND_CHART_WIDTH,
) {
  const positioned = labels.map(label => ({
    ...label,
    leftX: positionForTime(label.time),
  }));

  const minSpacingByRange: Record<TrendRangeKey, number> = {
    '1h': 58,
    '5h': 64,
    '24h': 82,
    '48h': 90,
    week: 132,
    month: 128,
  };
  const maxVisibleByRange: Record<TrendRangeKey, number> = {
    '1h': 5,
    '5h': 6,
    '24h': 5,
    '48h': 5,
    week: 4,
    month: 5,
  };

  const minSpacing = minSpacingByRange[rangeKey] * (chartWidth / TREND_CHART_WIDTH);
  const maxVisible = maxVisibleByRange[rangeKey];
  const kept = [...positioned]
    .sort((left, right) => {
      if (right.priority !== left.priority) {
        return right.priority - left.priority;
      }

      return right.time.getTime() - left.time.getTime();
    })
    .reduce<Array<typeof positioned[number]>>((visible, candidate) => {
      if (visible.length >= maxVisible) {
        return visible;
      }

      const collides = visible.some(label => Math.abs(label.leftX - candidate.leftX) < minSpacing);

      if (!collides) {
        visible.push(candidate);
      }

      return visible;
    }, [])
    .sort((left, right) => left.leftX - right.leftX);

  return kept.map((label, index) => ({
    ...label,
    align:
      index === 0
        ? 'left'
        : index === kept.length - 1
          ? 'right'
          : 'center',
    leftPercent: (label.leftX / chartWidth) * 100,
  }));
}

function getHistoricalPointState(value: number, thresholdModel?: ArcThresholdModel) {
  const thresholds = resolveThresholdModel(thresholdModel);

  if (value >= thresholds.activeEntry) {
    return { label: 'Active', color: foundationTheme.signal.warning };
  }

  if (value >= thresholds.elevated) {
    return { label: 'Elevated', color: foundationTheme.signal.up };
  }

  if (value >= thresholds.reduced) {
    return { label: 'Baseline', color: foundationTheme.chart.baseline };
  }

  return { label: 'Reduced', color: foundationTheme.signal.down };
}

function buildTrendWindow(rangeKey: TrendRangeKey, simulatedDate: Date): HistoricalSignalWindow {
  const liveMoment = new Date(simulatedDate);

  if (rangeKey === '1h') {
    return {
      start: new Date(liveMoment.getTime() - ONE_HOUR_IN_MS),
      end: liveMoment,
      rolling: true,
    };
  }

  if (rangeKey === '5h') {
    return {
      start: new Date(liveMoment.getTime() - FIVE_HOURS_IN_MS),
      end: liveMoment,
      rolling: true,
    };
  }

  if (rangeKey === '24h') {
    return {
      start: new Date(liveMoment.getTime() - 24 * 60 * 60 * 1000),
      end: liveMoment,
      rolling: true,
    };
  }

  const end = new Date(simulatedDate);

  if (rangeKey === '48h') {
    return {
      start: new Date(end.getTime() - 48 * 60 * 60 * 1000),
      end,
      rolling: true,
    };
  }

  const totalDays = rangeKey === 'week' ? 7 : 30;
  const start = addDays(startOfDay(end), -(totalDays - 1));

  return {
    start,
    end,
    rolling: false,
  };
}

function buildTrendAxisLabels(window: HistoricalSignalWindow, rangeKey: TrendRangeKey): HistoricalSignalAxisLabel[] {
  if (rangeKey === '1h') {
    const labels: HistoricalSignalAxisLabel[] = [
      {
        time: window.start,
        label: formatTrendRelativeMinuteLabel(0),
        align: 'left',
        priority: 4,
      },
      ...Array.from({ length: 3 }, (_, index) => {
        const anchor = new Date(window.start.getTime() + (index + 1) * 15 * 60 * 1000);
        return {
          time: anchor,
          label: formatTrendRelativeMinuteLabel((index + 1) * 15),
          align: 'center' as const,
          priority: 2,
        };
      }).filter(label => label.time.getTime() < window.end.getTime()),
      {
        time: window.end,
        label: 'NOW',
        align: 'right',
        priority: 5,
      },
    ];

    return dedupeAxisLabels(labels);
  }

  if (rangeKey === '5h') {
    const labels: HistoricalSignalAxisLabel[] = [
      {
        time: window.start,
        label: formatTrendRelativeHourLabel(5, true),
        align: 'left',
        priority: 4,
      },
      ...Array.from({ length: 4 }, (_, index) => {
        const anchor = new Date(window.start.getTime() + (index + 1) * 60 * 60 * 1000);
        return {
          time: anchor,
          label: formatTrendRelativeHourLabel(4 - index),
          align: 'center' as const,
          priority: 2,
        };
      }).filter(label => label.time.getTime() < window.end.getTime()),
      {
        time: window.end,
        label: 'NOW',
        align: 'right',
        priority: 5,
      },
    ];

    return dedupeAxisLabels(labels);
  }

  if (rangeKey === '24h') {
    const labels: HistoricalSignalAxisLabel[] = [
      ...buildRollingAnchorTimes(window, [0, 6, 12, 18]).map(anchor => ({
        time: anchor,
        label: formatTrendTimeAnchorLabel(anchor),
        align: 'center' as const,
        priority: anchor.getHours() === 0 || anchor.getHours() === 12 ? 3 : 2,
      })),
      {
        time: window.end,
        label: 'NOW',
        align: 'right',
        priority: 5,
      },
    ];

    return dedupeAxisLabels(labels);
  }

  if (rangeKey === '48h') {
    const labels: HistoricalSignalAxisLabel[] = [
      ...buildRollingAnchorTimes(window, [0, 12]).slice(-3).map(anchor => ({
        time: anchor,
        label: formatTrendDayHalfLabel(anchor),
        align: 'center' as const,
        priority: 3,
      })),
      {
        time: window.end,
        label: 'NOW',
        align: 'right',
        priority: 5,
      },
    ];

    return dedupeAxisLabels(labels);
  }

  if (rangeKey === 'week') {
    const weekOffsets = [0, 2, 4, 6];
    const labels = weekOffsets.map((offset, index) => ({
      time: addDays(window.start, offset),
      label: formatTrendAxisLabel(addDays(window.start, offset), rangeKey, false),
      align: (index === 0 ? 'left' : 'center') as HistoricalSignalAxisLabel['align'],
      priority: index === 0 ? 4 : 2,
    }));

    labels.push({
      time: window.end,
      label: formatTrendAxisLabel(window.end, rangeKey, true),
      align: 'right',
      priority: 5,
    });

    return labels;
  }

  if (rangeKey === 'month') {
    const monthOffsets = [0, 7, 14, 21];
    const labels = monthOffsets.map((offset, index) => ({
      time: addDays(window.start, offset),
      label: formatTrendAxisLabel(addDays(window.start, offset), rangeKey, false),
      align: (index === 0 ? 'left' : 'center') as HistoricalSignalAxisLabel['align'],
      priority: index === 0 ? 4 : 2,
    }));

    labels.push({
      time: window.end,
      label: formatTrendAxisLabel(window.end, rangeKey, true),
      align: 'right',
      priority: 5,
    });

    return labels;
  }

  const definition = TREND_RANGE_DEFINITIONS.find(option => option.key === rangeKey) ?? TREND_RANGE_DEFINITIONS[1]!;
  const totalMs = window.end.getTime() - window.start.getTime();

  return definition.axisFractions.map((fraction, index, labels) => {
    const time = new Date(window.start.getTime() + totalMs * fraction);
    return {
      time,
      label: formatTrendAxisLabel(time, rangeKey, index === labels.length - 1),
      align: (index === 0 ? 'left' : index === labels.length - 1 ? 'right' : 'center') as HistoricalSignalAxisLabel['align'],
      priority: index === labels.length - 1 ? 5 : 1,
    };
  });
}

function buildNocturnalBands(window: HistoricalSignalWindow): HistoricalSignalBand[] {
  const bands: HistoricalSignalBand[] = [];
  let cursor = startOfDay(window.start);

  while (cursor.getTime() <= window.end.getTime()) {
    const overnightPlan = getNocturnalNightPlan(cursor);
    const bandStart = new Date(cursor);
    bandStart.setHours(0, 0, 0, 0);
    const bandEnd = new Date(cursor);
    bandEnd.setMinutes(overnightPlan.wakeMinute, 0, 0);

    const startMs = Math.max(bandStart.getTime(), window.start.getTime());
    const endMs = Math.min(bandEnd.getTime(), window.end.getTime());

    if (endMs > startMs) {
      bands.push({
        start: new Date(startMs),
        end: new Date(endMs),
        kind: 'nocturnal',
      });
    }

    cursor = addDays(cursor, 1);
  }

  return bands;
}

function buildDaySeparators(window: HistoricalSignalWindow): Date[] {
  const separators: Date[] = [];
  let cursor = addDays(startOfDay(window.start), 1);

  while (cursor.getTime() < window.end.getTime()) {
    separators.push(new Date(cursor));
    cursor = addDays(cursor, 1);
  }

  return separators;
}

function useTimedSignalGeometry(
  points: HistoricalSignalPoint[],
  width: number,
  height: number,
  window: HistoricalSignalWindow,
  domainMin = 0,
  domainMax = DAYTIME_SIGNAL_MAX,
  topPaddingRatio = 0.1,
  bottomPaddingRatio = 0.12,
  leftPadding = width * 0.018,
  rightPadding = width * 0.018,
) {
  return useMemo(() => {
    const yScale = createYScale(height, domainMin, domainMax, topPaddingRatio, bottomPaddingRatio);
    const drawableWidth = width - leftPadding - rightPadding;
    const rangeMs = Math.max(1, window.end.getTime() - window.start.getTime());
    const toX = (time: Date) =>
      leftPadding +
      clamp((time.getTime() - window.start.getTime()) / rangeMs, 0, 1) * drawableWidth;

    const resolvedPoints = points.map((point, index) => {
      const x = toX(point.time);
      const previous = points[Math.max(0, index - 1)]?.value ?? point.value;
      const next = points[Math.min(points.length - 1, index + 1)]?.value ?? point.value;
      return {
        x,
        y: yScale(point.value),
        slope: previous - next,
      };
    });

    const pointRuns = buildPointRuns(resolvedPoints, 5.5);
    const paths = pointRuns.map(run => buildSmoothPath(run)).filter(path => path.length > 0);
    const endPoint = resolvedPoints[resolvedPoints.length - 1];

    return {
      points: resolvedPoints,
      pointRuns,
      paths,
      endPoint,
      yScale,
      toX,
    };
  }, [bottomPaddingRatio, domainMax, domainMin, height, leftPadding, points, rightPadding, topPaddingRatio, width, window]);
}

function buildSeededHistoricalSignalDataset({
  rangeKey,
  simulatedDate,
  liveTelemetry,
  thresholdModel,
}: {
  rangeKey: TrendRangeKey;
  simulatedDate: Date;
  liveTelemetry?: ArcLiveTelemetry | null;
  thresholdModel?: ArcThresholdModel;
}): HistoricalSignalDataset {
  const range = TREND_RANGE_DEFINITIONS.find(option => option.key === rangeKey) ?? TREND_RANGE_DEFINITIONS[1]!;
  const window = buildTrendWindow(rangeKey, simulatedDate);
  const plotEnd = rangeKey === '24h' ? new Date(simulatedDate) : window.end;
  const thresholds = resolveThresholdModel(thresholdModel);
  const baseline = thresholds.baseline;
  const lowerFloor = Math.max(4, thresholds.reduced - 8);
  const upperCeiling = Math.min(DAYTIME_SIGNAL_MAX, thresholds.peakReady ? thresholds.record : thresholds.activeEntry + 32);
  const intervalMs = (plotEnd.getTime() - window.start.getTime()) / Math.max(1, range.points - 1);

  const points = Array.from({ length: range.points }, (_, index) => {
    const time = new Date(window.start.getTime() + intervalMs * index);
    const autonomousPoint = buildAutonomousSignalPoint(time.getTime());

    return {
      time,
      value: clamp(autonomousPoint.value, lowerFloor, upperCeiling),
      context: autonomousPoint.context,
      linePhase: autonomousPoint.linePhase,
    };
  });

  const smoothedValues = smoothSeries(points.map(point => point.value), range.smoothingPasses);
  const blendedValues = [...smoothedValues];

  if (liveTelemetry?.history?.length) {
    const liveTail = resampleSeries(
      liveTelemetry.history.map(value => clamp(value, 0, DAYTIME_SIGNAL_MAX)),
      range.tailPoints,
    );
    const tailStart = Math.max(0, blendedValues.length - liveTail.length);

    for (let index = 0; index < liveTail.length; index += 1) {
      const targetIndex = tailStart + index;
      const progress = easeInOut(index / Math.max(1, liveTail.length - 1));
      blendedValues[targetIndex] = blendedValues[targetIndex]! * (1 - progress) + liveTail[index]! * progress;
    }

    blendedValues[blendedValues.length - 1] = clamp(liveTelemetry.currentValue, 0, DAYTIME_SIGNAL_MAX);
  }

  const resolvedPoints = points.map((point, index) => ({
    ...point,
    value: clamp(blendedValues[index] ?? point.value, 0, DAYTIME_SIGNAL_MAX),
  })) as HistoricalSignalPoint[];

  const separators = range.showDaySeparators ? buildDaySeparators(window) : [];
  const bands = range.showNocturnalBands ? buildNocturnalBands(window) : [];
  const markers: HistoricalSignalMarker[] = [];
  const candidateMarkers = resolvedPoints
    .map((point, index) => ({ point, index }))
    .filter(({ point, index }) => {
      const previous = resolvedPoints[index - 1]?.value ?? point.value;
      const next = resolvedPoints[index + 1]?.value ?? point.value;
      return point.context === 'night' && point.value > baseline + 14 && point.value >= previous && point.value >= next;
    })
    .sort((a, b) => b.point.value - a.point.value);

  candidateMarkers.forEach(candidate => {
    const tooClose = markers.some(existing => Math.abs(existing.time.getTime() - candidate.point.time.getTime()) < 6 * 60 * 60 * 1000);
    if (tooClose || markers.length >= range.markerCount) {
      return;
    }

    markers.push({
      time: candidate.point.time,
      value: candidate.point.value,
      label: 'Nocturnal peak',
      color: foundationTheme.chart.nocturnal,
    });
  });

  return {
    window,
    points: resolvedPoints,
    bands,
    separators,
    markers,
    axisLabels: buildTrendAxisLabels(window, rangeKey),
    hasMeaningfulHistory: true,
    isSeeded: true,
  };
}

function buildHistoricalSignalDataset({
  rangeKey,
  simulatedDate,
  liveTelemetry,
  trendHistory,
  mode = 'accumulated',
  thresholdModel,
}: {
  rangeKey: TrendRangeKey;
  simulatedDate: Date;
  liveTelemetry?: ArcLiveTelemetry | null;
  trendHistory?: ArcTrendHistoryPoint[];
  mode?: ArcTrendViewMode;
  thresholdModel?: ArcThresholdModel;
}): HistoricalSignalDataset {
  if (mode === 'demo-seeded') {
    return buildSeededHistoricalSignalDataset({
      rangeKey,
      simulatedDate,
      liveTelemetry,
      thresholdModel,
    });
  }

  const window = buildTrendWindow(rangeKey, simulatedDate);
  const resolvedRange = TREND_RANGE_DEFINITIONS.find(option => option.key === rangeKey) ?? TREND_RANGE_DEFINITIONS[0]!;
  const thresholds = resolveThresholdModel(thresholdModel);
  const historyCutoff = simulatedDate.getTime();
  const filteredHistory = (trendHistory ?? [])
    .filter(point => point.timestamp >= window.start.getTime() && point.timestamp <= historyCutoff)
    .sort((left, right) => left.timestamp - right.timestamp);

  const accumulatedPoints = filteredHistory.map(point => {
    const time = new Date(point.timestamp);
    return {
      time,
      value: clamp(point.value, 0, DAYTIME_SIGNAL_MAX),
      context: getTrendTimeContext(time),
      linePhase: point.linePhase ?? 'default',
    };
  }) as HistoricalSignalPoint[];

  const currentPoint =
    liveTelemetry != null
      ? {
          time: new Date(simulatedDate),
          value: clamp(liveTelemetry.currentValue, 0, DAYTIME_SIGNAL_MAX),
          context: getTrendTimeContext(simulatedDate),
          linePhase: liveTelemetry.linePhase,
        } as HistoricalSignalPoint
      : null;

  const resolvedPoints: HistoricalSignalPoint[] = [...accumulatedPoints];

  if (currentPoint) {
    const lastPoint = resolvedPoints[resolvedPoints.length - 1];

    if (!lastPoint) {
      resolvedPoints.push(currentPoint);
    } else if (lastPoint.time.getTime() === currentPoint.time.getTime()) {
      resolvedPoints[resolvedPoints.length - 1] = currentPoint;
    } else {
      resolvedPoints.push(currentPoint);
    }
  }

  const displayPoints = resolvedPoints;

  const markers: HistoricalSignalMarker[] = [];
  const candidateMarkers = displayPoints
    .map((point, index) => ({ point, index }))
    .filter(({ point, index }) => {
      const previous = displayPoints[index - 1]?.value ?? point.value;
      const next = displayPoints[index + 1]?.value ?? point.value;
      return point.context === 'night' && point.value > thresholds.baseline + 14 && point.value >= previous && point.value >= next;
    })
    .sort((a, b) => b.point.value - a.point.value);

  candidateMarkers.forEach(candidate => {
    const tooClose = markers.some(existing => Math.abs(existing.time.getTime() - candidate.point.time.getTime()) < 6 * 60 * 60 * 1000);
    if (tooClose || markers.length >= resolvedRange.markerCount) {
      return;
    }

    markers.push({
      time: candidate.point.time,
      value: candidate.point.value,
      label: 'Nocturnal peak',
      color: foundationTheme.chart.nocturnal,
    });
  });

  return {
    window,
    points: displayPoints,
    bands: resolvedRange.showNocturnalBands ? buildNocturnalBands(window) : [],
    separators: resolvedRange.showDaySeparators ? buildDaySeparators(window) : [],
    markers,
    axisLabels: buildTrendAxisLabels(window, rangeKey),
    hasMeaningfulHistory: accumulatedPoints.length >= 2,
    isSeeded: false,
  };
}

function LiveSignalGraph({
  width,
  height,
  history,
  linePhases,
  xPositions,
  strokeWidth = 2,
  glowWidth = 5,
  gradientId,
  showEndpoint = true,
  guides = [],
  className,
  domainMin,
  domainMax,
  animateEndpoint = false,
  topPaddingRatio = 0.14,
  bottomPaddingRatio = 0.1,
  riseBoost = 0,
  endpointGlowScale = 1,
  trailOpacityScale = 1,
  uniformTrendStroke = false,
  showEndpointGuide = false,
  smoothingPasses = 0,
}: LiveSignalGraphProps) {
  const renderedHistory = useMemo(() => {
    if (smoothingPasses <= 0 || history.length < 3) {
      return history;
    }

    const smoothed = smoothSeries(history, smoothingPasses);
    smoothed[0] = history[0] ?? smoothed[0] ?? 0;
    smoothed[smoothed.length - 1] = history[history.length - 1] ?? smoothed[smoothed.length - 1] ?? 0;

    if (history.length > 2) {
      const penultimateIndex = history.length - 2;
      smoothed[penultimateIndex] = (smoothed[penultimateIndex] ?? 0) * 0.42 + (history[penultimateIndex] ?? 0) * 0.58;
    }

    return smoothed;
  }, [history, smoothingPasses]);
  const resolvedDomainMin = domainMin ?? Math.min(...guides, ...renderedHistory);
  const resolvedDomainMax = domainMax ?? Math.max(...guides, ...renderedHistory);
  const signal = useSignalGeometry(
    renderedHistory,
    width,
    height,
    resolvedDomainMin,
    resolvedDomainMax,
    topPaddingRatio,
    bottomPaddingRatio,
    xPositions,
  );
  const resolveTone = (slope: number) => {
    const baseTone = getTrendTone(slope);

    if (riseBoost > 0 && slope < -0.12) {
      return mixColor(baseTone, RISE_TONE, riseBoost);
    }

    return baseTone;
  };
  const resolveColor = (slope: number, alpha = 1) => {
    const tone = resolveTone(slope);
    return alpha >= 1
      ? `rgb(${tone[0]},${tone[1]},${tone[2]})`
      : `rgba(${tone[0]}, ${tone[1]}, ${tone[2]}, ${alpha})`;
  };
  const resolvePointTone = (index: number, slope: number) => {
    const pointLinePhase = linePhases?.[index] ?? 'default';
    return pointLinePhase === 'default'
      ? resolveTone(slope)
      : getNocturnalPhaseTone(pointLinePhase);
  };
  const resolvePointColor = (index: number, slope: number, alpha = 1) => {
    const tone = resolvePointTone(index, slope);
    return alpha >= 1
      ? `rgb(${tone[0]},${tone[1]},${tone[2]})`
      : `rgba(${tone[0]}, ${tone[1]}, ${tone[2]}, ${alpha})`;
  };
  const glowDropShadowAlpha = clamp(0.14 * endpointGlowScale, 0.08, 0.24);
  const dominantSlope =
    signal.points.length > 1
      ? signal.points
          .slice(Math.max(0, signal.points.length - 3))
          .reduce((total, point) => total + point.slope, 0) /
        Math.max(1, Math.min(3, signal.points.length))
      : signal.endPoint?.slope ?? 0;
  const endLinePhase = linePhases?.[linePhases.length - 1] ?? 'default';
  const uniformTrendTone =
    endLinePhase === 'default'
      ? getDiscreteTrendTone(dominantSlope)
      : getNocturnalPhaseTone(endLinePhase);
  const uniformTrendColor = `rgb(${uniformTrendTone[0]},${uniformTrendTone[1]},${uniformTrendTone[2]})`;
  const endpointColor = uniformTrendStroke ? uniformTrendColor : resolvePointColor(signal.points.length - 1, signal.endPoint?.slope ?? 0);
  const trendUnderlayColor = hexToRgba(foundationTheme.bg.app.includes('linear-gradient') ? foundationTheme.text.inverse : foundationTheme.bg.app, 0.62);
  const trendSegments = useMemo(() => {
    if (!uniformTrendStroke || signal.pointRuns.length === 0) {
      return [];
    }

    let runOffset = 0;

    return signal.pointRuns.flatMap(run => {
      if (run.length < 2) {
        runOffset += run.length;
        return [];
      }

      const runLinePhases = linePhases?.slice(runOffset, runOffset + run.length) ?? [];
      const segments: Array<{ key: RenderSignalSegmentKey; path: string }> = [];
      let segmentStart = 0;
      let currentKey = resolveLinePhaseKey(runLinePhases[0] ?? 'default', run[0]?.slope ?? 0);

      for (let index = 1; index < run.length; index += 1) {
        const pointKey = resolveLinePhaseKey(runLinePhases[index] ?? 'default', run[index]?.slope ?? 0);

        if (pointKey === currentKey) {
          continue;
        }

        const sliceStart = Math.max(0, segmentStart - 1);
        const sliceEnd = Math.min(run.length, index + 1);
        segments.push({
          key: currentKey,
          path: buildSmoothPath(run.slice(sliceStart, sliceEnd)),
        });
        segmentStart = index;
        currentKey = pointKey;
      }

      segments.push({
        key: currentKey,
        path: buildSmoothPath(run.slice(Math.max(0, segmentStart - 1))),
      });

      runOffset += run.length;
      return segments;
    });
  }, [linePhases, signal.pointRuns, uniformTrendStroke]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className={className ?? 'h-full w-full overflow-visible'}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          {signal.points.map((point, index) => (
            <stop
              key={index}
              offset={`${(index / Math.max(1, signal.points.length - 1)) * 100}%`}
              stopColor={uniformTrendStroke ? uniformTrendColor : resolvePointColor(index, point.slope)}
              stopOpacity={uniformTrendStroke ? 1 : 0.18 + (index / Math.max(1, signal.points.length - 1)) * 0.54}
            />
          ))}
        </linearGradient>
        <linearGradient id={`${gradientId}-glow`} x1="0" y1="0" x2="1" y2="0">
          {signal.points.map((point, index) => (
            <stop
              key={`glow-${index}`}
              offset={`${(index / Math.max(1, signal.points.length - 1)) * 100}%`}
              stopColor={uniformTrendStroke ? uniformTrendColor : resolvePointColor(index, point.slope)}
              stopOpacity={uniformTrendStroke ? 0 : 0.012 + (index / Math.max(1, signal.points.length - 1)) * 0.05}
            />
          ))}
        </linearGradient>
        <linearGradient id={`${gradientId}-trail`} x1="0" y1="0" x2="1" y2="0">
          {signal.points.map((point, index) => (
            <stop
              key={`trail-${index}`}
              offset={`${(index / Math.max(1, signal.points.length - 1)) * 100}%`}
              stopColor={uniformTrendStroke ? uniformTrendColor : resolvePointColor(index, point.slope, 0.6)}
              stopOpacity={uniformTrendStroke ? 0 : (0.018 + (index / Math.max(1, signal.points.length - 1)) * 0.072) * trailOpacityScale}
            />
          ))}
        </linearGradient>
      </defs>

      {guides.map((guide, index) => (
        <line
          key={`${guide}-${index}`}
          x1="0"
          y1={signal.yScale(guide)}
          x2={width}
          y2={signal.yScale(guide)}
          stroke={foundationTheme.chart.grid}
          strokeWidth="1"
          strokeDasharray={index === 1 ? '0' : '2 8'}
        />
      ))}

      {!uniformTrendStroke &&
        signal.paths.map((path, index) => (
          <path
            key={`glow-path-${index}`}
            d={path}
            fill="none"
            stroke={`url(#${gradientId}-glow)`}
            strokeWidth={glowWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.42"
            style={{ filter: `drop-shadow(0 0 ${3 * endpointGlowScale}px ${resolvePointColor(signal.points.length - 1, signal.endPoint?.slope ?? 0, glowDropShadowAlpha * 0.55)})` }}
          />
        ))}
      {!uniformTrendStroke &&
        signal.paths.map((path, index) => (
          <path
            key={`trail-path-${index}`}
            d={path}
            fill="none"
            stroke={`url(#${gradientId}-trail)`}
            strokeWidth={strokeWidth + 0.95}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.58"
          />
        ))}
      {uniformTrendStroke &&
        signal.paths.map((path, index) => (
          <path
            key={`underlay-path-${index}`}
            d={path}
            fill="none"
            stroke={trendUnderlayColor}
            strokeWidth={strokeWidth + 1.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
        ))}
      {!uniformTrendStroke &&
        signal.paths.map((path, index) => (
          <path
            key={`base-path-${index}`}
            d={path}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 1px ${resolvePointColor(signal.points.length - 1, signal.endPoint?.slope ?? 0, 0.05)})` }}
          />
        ))}
      {uniformTrendStroke &&
        trendSegments.map((segment, index) => {
          const tone = getRenderSignalTone(segment.key);
          const stroke = `rgb(${tone[0]},${tone[1]},${tone[2]})`;

          return (
            <path
              key={`${segment.key}-${index}`}
              d={segment.path}
              fill="none"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}

      {showEndpoint && signal.endPoint && (
        <>
          {showEndpointGuide ? (
            <line
              x1={signal.endPoint.x}
              y1={signal.endPoint.y + 2}
              x2={signal.endPoint.x}
              y2={signal.yScale(resolvedDomainMin)}
              stroke={hexToRgba(endpointColor, uniformTrendStroke ? 0.14 : 0.11)}
              strokeWidth={1}
              strokeDasharray="1 6"
            />
          ) : null}
          <circle
            cx={signal.endPoint.x}
            cy={signal.endPoint.y}
            r={uniformTrendStroke ? 4.1 : 3.8}
            fill="none"
            stroke={hexToRgba(endpointColor, uniformTrendStroke ? 0.48 : 0.38)}
            strokeWidth={uniformTrendStroke ? 1.1 : 1}
            opacity={animateEndpoint ? 0.24 : 0.18}
          >
            {animateEndpoint && (
              <animate
                attributeName="opacity"
                values="0.16;0.28;0.16"
                dur="1.8s"
                repeatCount="indefinite"
              />
            )}
          </circle>
          <circle
            cx={signal.endPoint.x}
            cy={signal.endPoint.y}
            r={uniformTrendStroke ? 2.15 : 2.05}
            fill={endpointColor}
          />
          <circle
            cx={signal.endPoint.x}
            cy={signal.endPoint.y}
            r={uniformTrendStroke ? 0.9 : 1}
            fill={uniformTrendStroke ? hexToRgba(foundationTheme.text.highlight, 0.88) : foundationTheme.text.highlight}
            opacity={uniformTrendStroke ? '0.82' : '0.78'}
          />
        </>
      )}
    </svg>
  );
}

const MemoizedLiveSignalGraph = memo(LiveSignalGraph);

type PremiumTrendGraphProps = {
  width: number;
  height: number;
  points: HistoricalSignalPoint[];
  geometry: ReturnType<typeof useTimedSignalGeometry>;
  gradientIdBase: string;
  rangeKey: TrendRangeKey;
  hoveredPointIndex?: number | null;
  fullScreen?: boolean;
};

function PremiumTrendGraph({
  width,
  height,
  points,
  geometry,
  gradientIdBase,
  rangeKey,
  hoveredPointIndex = null,
  fullScreen = false,
}: PremiumTrendGraphProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const trendFillPalette = useMemo(() => getTrendFillPalette(), []);
  const dayFillTone = trendFillPalette.dayFill;
  const nightFillTone = trendFillPalette.nightFill;
  const dayLineTone = mixColor(hexToRgbTuple(foundationTheme.text.highlight), hexToRgbTuple(foundationTheme.accent.primary), 0.22);
  const dayCrestTone = mixColor(dayLineTone, hexToRgbTuple(foundationTheme.accent.primary), 0.26);
  const nightLineTone = mixColor(nightFillTone, hexToRgbTuple(foundationTheme.text.highlight), 0.06);
  const nightCrestTone = mixColor(nightLineTone, nightFillTone, 0.18);
  const glowTone = mixColor(hexToRgbTuple(foundationTheme.accent.primary), [12, 18, 28], 0.34);
  const fillTopTone = mixColor(dayLineTone, hexToRgbTuple(foundationTheme.text.highlight), 0.18);
  const bottomY = geometry.yScale(0);
  const strokeWidth = fullScreen ? 3.1 : 2.55;
  const glowWidth = fullScreen ? 4.3 : 3.25;
  const sheenWidth = fullScreen ? 1.18 : 0.96;
  const hoveredGeometryPoint = hoveredPointIndex != null ? geometry.points[hoveredPointIndex] ?? null : null;
  const activePoint = hoveredGeometryPoint;
  const fillSegments = useMemo(
    () => buildTrendFillSegments(points, geometry.points, geometry.toX, geometry.yScale),
    [geometry.points, geometry.toX, geometry.yScale, points],
  );
  const lineSegments = useMemo(
    () =>
      fillSegments
        .map(segment => ({
          ...segment,
          path: buildSmoothPath(segment.points),
        }))
        .filter(segment => segment.path.length > 0),
    [fillSegments],
  );
  const activeContext = hoveredPointIndex != null ? getTrendTimeContext(points[hoveredPointIndex]?.time ?? new Date()) : 'day';
  const activeLineTone = activeContext === 'night' ? nightLineTone : dayLineTone;
  const activePointTone = activeContext === 'night' ? nightCrestTone : fillTopTone;

  useEffect(() => {
    setIsRevealed(false);
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setIsRevealed(true);
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [rangeKey]);

  const peakHighlights = useMemo(() => {
    const minimumPeakValue = fullScreen ? 60 : 56;
    const maxHighlights = fullScreen ? 2 : 1;
    const candidates = points
      .map((point, index) => {
        const geometryPoint = geometry.points[index];
        if (!geometryPoint) {
          return null;
        }

        const previous = points[index - 1]?.value ?? point.value;
        const next = points[index + 1]?.value ?? point.value;
        return point.value >= previous && point.value >= next && point.value >= minimumPeakValue
          ? { point, geometryPoint }
          : null;
      })
      .filter((candidate): candidate is { point: HistoricalSignalPoint; geometryPoint: ReturnType<typeof useTimedSignalGeometry>['points'][number] } => candidate != null)
      .sort((left, right) => right.point.value - left.point.value);

    return candidates.reduce<Array<{ point: HistoricalSignalPoint; geometryPoint: ReturnType<typeof useTimedSignalGeometry>['points'][number] }>>(
      (selected, candidate) => {
        if (selected.length >= maxHighlights) {
          return selected;
        }

        const tooClose = selected.some(existing => Math.abs(existing.geometryPoint.x - candidate.geometryPoint.x) < width * (fullScreen ? 0.12 : 0.15));
        if (!tooClose) {
          selected.push(candidate);
        }
        return selected;
      },
      [],
    );
  }, [fullScreen, geometry.points, points, width]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-full w-full overflow-visible">
      <defs>
        <linearGradient id={`${gradientIdBase}-trend-day-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={rgba(dayLineTone, 0.82)} />
          <stop offset="55%" stopColor={rgba(dayCrestTone, 0.96)} />
          <stop offset="100%" stopColor={rgba(fillTopTone, 0.84)} />
        </linearGradient>
        <linearGradient id={`${gradientIdBase}-trend-night-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={rgba(nightLineTone, 0.9)} />
          <stop offset="55%" stopColor={rgba(nightCrestTone, 0.96)} />
          <stop offset="100%" stopColor={rgba(nightLineTone, 0.88)} />
        </linearGradient>
        <linearGradient id={`${gradientIdBase}-trend-day-sheen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={rgba(hexToRgbTuple(foundationTheme.text.highlight), 0.3)} />
          <stop offset="100%" stopColor={rgba(hexToRgbTuple(foundationTheme.text.highlight), 0)} />
        </linearGradient>
        <linearGradient id={`${gradientIdBase}-trend-night-sheen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={rgba(nightLineTone, 0.26)} />
          <stop offset="100%" stopColor={rgba(nightLineTone, 0)} />
        </linearGradient>
        <linearGradient id={`${gradientIdBase}-trend-day-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={rgba(dayFillTone, fullScreen ? 0.68 : 0.58)} />
          <stop offset="46%" stopColor={rgba(dayFillTone, fullScreen ? 0.42 : 0.34)} />
          <stop offset="74%" stopColor={rgba(dayFillTone, fullScreen ? 0.18 : 0.14)} />
          <stop offset="100%" stopColor={rgba(dayFillTone, 0)} />
        </linearGradient>
        <linearGradient id={`${gradientIdBase}-trend-night-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={rgba(nightFillTone, fullScreen ? 0.74 : 0.64)} />
          <stop offset="46%" stopColor={rgba(nightFillTone, fullScreen ? 0.48 : 0.38)} />
          <stop offset="74%" stopColor={rgba(nightFillTone, fullScreen ? 0.2 : 0.15)} />
          <stop offset="100%" stopColor={rgba(nightFillTone, 0)} />
        </linearGradient>
        <radialGradient id={`${gradientIdBase}-peak-glow`} cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor={rgba(fillTopTone, 0.11)} />
          <stop offset="55%" stopColor={rgba(dayCrestTone, 0.045)} />
          <stop offset="100%" stopColor={rgba(dayCrestTone, 0)} />
        </radialGradient>
      </defs>

      {TREND_GUIDE_VALUES.map(value => (
        <line
          key={`trend-guide-${value}`}
          x1="0"
          y1={geometry.yScale(value)}
          x2={width}
          y2={geometry.yScale(value)}
          stroke={hexToRgba('#FFFFFF', fullScreen ? 0.038 : 0.03)}
          strokeWidth="1"
        />
      ))}

      {peakHighlights.map((peak, index) => (
        <g
          key={`trend-peak-${index}`}
          opacity={hoveredPointIndex == null ? 1 : 0.32}
          style={{
            opacity: isRevealed ? hoveredPointIndex == null ? 1 : 0.32 : 0,
            transition: 'opacity 360ms ease 180ms',
          }}
        >
          <circle
            cx={peak.geometryPoint.x}
            cy={peak.geometryPoint.y}
            r={fullScreen ? 22 : 14}
            fill={`url(#${gradientIdBase}-peak-glow)`}
          />
          <circle
            cx={peak.geometryPoint.x}
            cy={peak.geometryPoint.y}
            r={fullScreen ? 3.1 : 2.2}
            fill={rgba(fillTopTone, 0.22)}
          />
        </g>
      ))}

      {fillSegments.map((segment, index) => (
        <path
          key={`trend-fill-${segment.context}-${index}`}
          d={buildClosedAreaPath(segment.points, bottomY)}
          fill={`url(#${gradientIdBase}-${segment.context === 'day' ? 'trend-day-fill' : 'trend-night-fill'})`}
          opacity={isRevealed ? 1 : 0}
          style={{
            transition: 'opacity 420ms ease 120ms',
          }}
        />
      ))}

      {lineSegments.map((segment, index) => (
        <path
          key={`trend-glow-${segment.context}-${index}`}
          d={segment.path}
          fill="none"
          stroke={rgba(segment.context === 'night' ? nightLineTone : glowTone, segment.context === 'night' ? (fullScreen ? 0.16 : 0.12) : fullScreen ? 0.13 : 0.1)}
          strokeWidth={glowWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={isRevealed ? 0 : 1}
          style={{
            transition: 'stroke-dashoffset 680ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      ))}

      {lineSegments.map((segment, index) => (
        <path
          key={`trend-line-${segment.context}-${index}`}
          d={segment.path}
          fill="none"
          stroke={`url(#${gradientIdBase}-${segment.context === 'day' ? 'trend-day-line' : 'trend-night-line'})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={isRevealed ? 0 : 1}
          style={{
            transition: 'stroke-dashoffset 780ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      ))}

      {lineSegments.map((segment, index) => (
        <path
          key={`trend-sheen-${segment.context}-${index}`}
          d={segment.path}
          fill="none"
          stroke={`url(#${gradientIdBase}-${segment.context === 'day' ? 'trend-day-sheen' : 'trend-night-sheen'})`}
          strokeWidth={sheenWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.56}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={isRevealed ? 0 : 1}
          style={{
            transition: 'stroke-dashoffset 820ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      ))}

      {activePoint ? (
        <>
          <line
            x1={activePoint.x}
            y1={geometry.yScale(100) + (fullScreen ? 4 : 6)}
            x2={activePoint.x}
            y2={bottomY - (fullScreen ? 6 : 8)}
            stroke={rgba(activeLineTone, 0.22)}
            strokeWidth="1"
            opacity="0.88"
          />
          <circle
            cx={activePoint.x}
            cy={activePoint.y}
            r={fullScreen ? 6 : 4.8}
            fill="none"
            stroke={rgba(activeLineTone, 0.34)}
            strokeWidth={1}
          />
          <circle
            cx={activePoint.x}
            cy={activePoint.y}
            r={fullScreen ? 2.2 : 1.9}
            fill={rgba(activePointTone, 0.94)}
          />
        </>
      ) : null}
    </svg>
  );
}

function LiveExpansionGraph({
  onOpen,
  liveTelemetry,
  thresholdModel,
  amoraEnabled = true,
  proactiveInsightsEnabled = true,
  amoraGuidanceLevel = 'standard',
  onOpenLiveAmora,
  liveSyncState,
  liveSyncProgress = 0,
}: {
  onOpen?: () => void;
  liveTelemetry?: ArcLiveTelemetry | null;
  thresholdModel?: ArcThresholdModel;
  amoraEnabled?: boolean;
  proactiveInsightsEnabled?: boolean;
  amoraGuidanceLevel?: ArcAmoraGuidanceLevel;
  onOpenLiveAmora?: () => void;
  liveSyncState?: {
    pillLabel: string;
    statusLine: string;
    detailLine: string;
  };
  liveSyncProgress?: number;
}) {
  const simulationClock = useArcSimulationClock();
  const previewSignal = useLiveDetailSignal({
    samples: LIVE_SAMPLES + 10,
    sampleInterval: 0.12,
    simulatedDate: simulationClock.simulatedDate,
  });
  const gradientId = useId();
  const graphHeight = 124;
  const previewHistory = liveTelemetry?.history?.length ? liveTelemetry.history : previewSignal.history;
  const previewHistoryLinePhases =
    liveTelemetry?.historyLinePhases?.length ? liveTelemetry.historyLinePhases : previewSignal.historyLinePhases;
  const previewCurrentValue = liveTelemetry?.currentValue ?? previewSignal.currentValue;
  const previewPhase = liveTelemetry?.phase ?? previewSignal.phase;
  const previewState = getDetailState(previewCurrentValue, previewPhase, thresholdModel);
  const currentLevelLabel = `+${previewCurrentValue.toFixed(1)}%`;
  const previewDomainMin = 0;
  const previewDomainMax = DAYTIME_SIGNAL_MAX;
  const hoverRevealIndicators = Boolean(onOpen);
  const hoverRevealMotionClass = hoverRevealIndicators
    ? 'transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
    : '';
  const hoverRevealLiftClass = hoverRevealIndicators
    ? 'translate-y-1 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100'
    : '';
  const resolvedLiveSyncState = liveSyncState ?? {
    pillLabel: 'LIVE',
    statusLine: 'Real-time telemetry active',
    detailLine: '',
  };
  const isBufferedState = resolvedLiveSyncState.pillLabel === 'BUFFERED';
  const isSyncingState = resolvedLiveSyncState.pillLabel === 'SYNCING';
  const previewYScale = useMemo(
    () => createYScale(LIVE_HEIGHT + 18, previewDomainMin, previewDomainMax, 0.1, 0.1),
    [previewDomainMax, previewDomainMin],
  );
  const reducedBandTop = previewYScale(19);
  const reducedBandHeight = Math.max(4, previewYScale(14) - previewYScale(19));
  const baselineBandTop = previewYScale(FLACCID_BASELINE_MAX);
  const baselineBandHeight = Math.max(4, previewYScale(FLACCID_BASELINE_MIN) - previewYScale(FLACCID_BASELINE_MAX));
  const elevatedBandTop = previewYScale(FLACCID_ELEVATED_MAX);
  const elevatedBandHeight = Math.max(4, previewYScale(FLACCID_ELEVATED_MIN) - previewYScale(FLACCID_ELEVATED_MAX));
  const showLiveAmoraHint =
    amoraEnabled &&
    proactiveInsightsEnabled &&
    amoraGuidanceLevel !== 'minimal' &&
    !!onOpenLiveAmora;
  const liveAmoraMessage =
    !resolveThresholdModel(thresholdModel).baselineReady
      ? 'Baseline interpretation is still being learned from early signal.'
      : previewState.key === 'reduced'
        ? 'Current signal is tracking below your baseline band.'
        : previewState.key === 'baseline'
          ? 'Current signal is holding close to baseline.'
          : previewState.key === 'elevated'
            ? 'Resting fullness is sitting slightly above baseline.'
            : previewState.key === 'entering'
              ? 'Build speed is rising more decisively than your baseline.'
              : previewState.key === 'returning'
                ? 'Recovery is settling back toward your baseline range.'
                : 'Active response is holding above your resting norm.';

  const content = (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-14" style={{ background: foundationTheme.bg.overlay }} />
      <div className="absolute inset-x-4 top-3 z-10 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div
              className={`h-1.5 w-1.5 rounded-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${hoverRevealIndicators ? 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100' : ''}`}
              style={{
                backgroundColor: previewState.chipTextColor,
              }}
            />
            <h4 style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.text.primary }}>LIVE</h4>
          </div>
          <div
            className={`mt-1 ${hoverRevealLiftClass}`}
            style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}
          >
            {resolvedLiveSyncState.statusLine}
          </div>
          {resolvedLiveSyncState.detailLine ? (
            <div
              className={`mt-0.5 ${hoverRevealLiftClass}`}
              style={{
                ...getArcTypographyStyle(foundationTheme, 'label'),
                color: hexToRgba(foundationTheme.text.tertiary, 0.78),
                fontSize: '0.48rem',
                letterSpacing: '0.04em',
              }}
            >
              {resolvedLiveSyncState.detailLine}
            </div>
          ) : null}
        </div>
        <div className={`flex flex-col items-end gap-1 ${hoverRevealLiftClass}`}>
          <div
            className="rounded-full border px-2.5 py-1"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
              ...getArcGlassPillStyle(
                foundationTheme,
                'light',
                {
                  tint: isBufferedState
                    ? foundationTheme.text.secondary
                    : isSyncingState
                      ? foundationTheme.accent.primary
                      : foundationTheme.signal.up,
                  tintStrength: 0.05,
                },
              ),
              fontSize: '0.48rem',
              borderColor: hexToRgba('#FFFFFF', 0.07),
              color: isBufferedState ? foundationTheme.text.secondary : foundationTheme.text.highlight,
            }}
          >
            {resolvedLiveSyncState.pillLabel}
          </div>
          <div
            className="rounded-full border px-2.5 py-1"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
              ...getArcGlassPillStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.04 }),
              fontSize: '0.46rem',
              borderColor: hexToRgba('#FFFFFF', 0.06),
              color: hexToRgba(foundationTheme.text.secondary, 0.88),
            }}
          >
            {currentLevelLabel}
          </div>
        </div>
      </div>

      <div
        className="absolute inset-x-4 bottom-4 top-[50px] overflow-hidden rounded-[18px] border"
        style={{
          background: `linear-gradient(180deg, ${hexToRgba(foundationTheme.text.inverse, 0.56)} 0%, ${hexToRgba(foundationTheme.text.inverse, 0.7)} 100%)`,
          borderColor: hexToRgba('#FFFFFF', 0.05),
          backdropFilter: 'blur(10px) saturate(112%)',
          boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.028)}`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${hexToRgba(foundationTheme.text.inverse, 0)} 0%, ${hexToRgba(foundationTheme.text.inverse, 0.08)} 100%)`,
          }}
        />
        <div className={`pointer-events-none absolute inset-0 px-1 py-1 ${hoverRevealMotionClass}`}>
          <div className="relative h-full w-full overflow-hidden rounded-[16px]">
            <div
              className="absolute inset-x-0 rounded-[10px]"
              style={{
                top: reducedBandTop,
                height: reducedBandHeight,
                background: `linear-gradient(90deg, ${hexToRgba(foundationTheme.signal.down, 0.018)} 0%, ${hexToRgba(foundationTheme.signal.down, 0.034)} 55%, ${hexToRgba(foundationTheme.signal.down, 0.016)} 100%)`,
              }}
            />
            <div
              className="absolute inset-x-0 rounded-[12px]"
              style={{
                top: baselineBandTop,
                height: baselineBandHeight,
                background: `linear-gradient(90deg, ${hexToRgba(foundationTheme.chart.baseline, 0.022)} 0%, ${hexToRgba(foundationTheme.chart.baseline, 0.05)} 58%, ${hexToRgba(foundationTheme.chart.baseline, 0.022)} 100%)`,
              }}
            />
            <div
              className="absolute inset-x-0 rounded-[14px]"
              style={{
                top: elevatedBandTop,
                height: elevatedBandHeight,
                background: `linear-gradient(90deg, ${hexToRgba(foundationTheme.signal.up, 0.016)} 0%, ${hexToRgba(foundationTheme.signal.up, 0.038)} 58%, ${hexToRgba(foundationTheme.signal.up, 0.014)} 100%)`,
              }}
            />
          </div>
        </div>
        <div className="absolute inset-0 px-1 py-1">
          <LiveSignalGraph
            width={LIVE_WIDTH}
            height={LIVE_HEIGHT + 18}
            history={previewHistory}
            linePhases={previewHistoryLinePhases}
            gradientId={gradientId}
            domainMin={previewDomainMin}
            domainMax={previewDomainMax}
            strokeWidth={2.25}
            glowWidth={4}
            className="h-full w-full overflow-visible"
            animateEndpoint
            topPaddingRatio={0.1}
            bottomPaddingRatio={0.1}
            riseBoost={previewPhase === 'activeEntry' || previewPhase === 'activeRise' ? 0.08 : 0}
            endpointGlowScale={0.78}
            trailOpacityScale={0.78}
            showEndpointGuide
            smoothingPasses={2}
          />
        </div>
        <div className={hoverRevealMotionClass}>
          {isBufferedState ? (
            <div
              className="pointer-events-none absolute inset-y-2 right-2 w-[22%] rounded-[16px]"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${hexToRgba('#FFFFFF', 0.035)} 100%)`,
                borderLeft: `1px dashed ${hexToRgba('#FFFFFF', 0.08)}`,
              }}
            />
          ) : null}
          {isSyncingState ? (
            <div
              className="pointer-events-none absolute inset-y-2 left-2 rounded-[16px] transition-all duration-300"
              style={{
                width: `${Math.max(10, Math.round(clamp(liveSyncProgress, 0, 1) * 100))}%`,
                background: `linear-gradient(90deg, ${hexToRgba(foundationTheme.accent.primary, 0.08)} 0%, ${hexToRgba(foundationTheme.accent.primary, 0.03)} 100%)`,
                boxShadow: `inset -1px 0 0 ${hexToRgba('#FFFFFF', 0.08)}`,
              }}
            />
          ) : null}
        </div>
      </div>
    </>
  );

  if (!onOpen) {
    return (
      <div
        className="relative h-[166px] w-full overflow-hidden rounded-[26px] border"
        style={{
          ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: foundationTheme.accent.primary, tintStrength: 0.04 }),
          borderColor: hexToRgba('#FFFFFF', 0.07),
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-10"
          style={{ background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.022)} 0%, transparent 100%)` }}
        />
        <ArcAtmosphere variant="live" intensity={0.58} className="z-0" />
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative h-[166px] w-full overflow-hidden rounded-[26px] border text-left transition-all duration-300"
      style={{
        ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: foundationTheme.accent.primary, tintStrength: 0.04 }),
        borderColor: hexToRgba('#FFFFFF', 0.07),
      }}
      aria-label="Open expanded LIVE graph"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-10"
        style={{ background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.022)} 0%, transparent 100%)` }}
      />
      <ArcAtmosphere variant="live" intensity={0.58} className="z-0" />
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100" style={{ background: `linear-gradient(135deg, ${hexToRgba(foundationTheme.accent.primary, 0.06)} 0%, transparent 55%)` }} />
      {content}
    </button>
  );
}

export function ArcLiveExpansionCard({
  onOpen,
  liveTelemetry,
  thresholdModel,
  amoraEnabled = true,
  proactiveInsightsEnabled = true,
  amoraGuidanceLevel = 'standard',
  onOpenLiveAmora,
  liveSyncState,
  liveSyncProgress = 0,
}: {
  onOpen?: () => void;
  liveTelemetry?: ArcLiveTelemetry | null;
  thresholdModel?: ArcThresholdModel;
  amoraEnabled?: boolean;
  proactiveInsightsEnabled?: boolean;
  amoraGuidanceLevel?: ArcAmoraGuidanceLevel;
  onOpenLiveAmora?: () => void;
  liveSyncState?: {
    pillLabel: string;
    statusLine: string;
    detailLine: string;
  };
  liveSyncProgress?: number;
}) {
  return (
    <LiveExpansionGraph
      onOpen={onOpen}
      liveTelemetry={liveTelemetry}
      thresholdModel={thresholdModel}
      amoraEnabled={amoraEnabled}
      proactiveInsightsEnabled={proactiveInsightsEnabled}
      amoraGuidanceLevel={amoraGuidanceLevel}
      onOpenLiveAmora={onOpenLiveAmora}
      liveSyncState={liveSyncState}
      liveSyncProgress={liveSyncProgress}
    />
  );
}

type ExpansionTimelineProps = {
  liveTelemetry?: ArcLiveTelemetry | null;
  trendHistory?: ArcTrendHistoryPoint[];
  trendMode?: ArcTrendViewMode;
  thresholdModel?: ArcThresholdModel;
  onOpen?: () => void;
  fullScreen?: boolean;
  amoraEnabled?: boolean;
  proactiveInsightsEnabled?: boolean;
  amoraGuidanceLevel?: ArcAmoraGuidanceLevel;
  onOpenTrendAmora?: () => void;
};

const ExpansionTimeline = ({
  liveTelemetry,
  trendHistory,
  trendMode = 'accumulated',
  thresholdModel,
  onOpen,
  fullScreen = false,
  amoraEnabled = true,
  proactiveInsightsEnabled = true,
  amoraGuidanceLevel = 'standard',
  onOpenTrendAmora,
}: ExpansionTimelineProps) => {
  const simulationClock = useArcSimulationClock();
  const gradientId = useId();
  const [selectedRange, setSelectedRange] = useState<TrendRangeKey>('24h');
  const [displayedRange, setDisplayedRange] = useState<TrendRangeKey>('24h');
  const [isSwitchingRange, setIsSwitchingRange] = useState(false);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [isTrendViewHovered, setIsTrendViewHovered] = useState(false);
  const hoverFrameRef = useRef<number | null>(null);
  const pendingHoverXRef = useRef<number | null>(null);
  const chartWidth = fullScreen ? 920 : TREND_CHART_WIDTH;
  const chartHeight = fullScreen ? 516 : TREND_CHART_HEIGHT;
  const chartPlotLeft = fullScreen ? 78 : TREND_PLOT_LEFT;
  const chartPlotRight = fullScreen ? 42 : TREND_PLOT_RIGHT;
  const chartTopPaddingRatio = fullScreen ? 0.13 : TREND_TOP_PADDING_RATIO;
  const chartBottomPaddingRatio = fullScreen ? 0.18 : TREND_BOTTOM_PADDING_RATIO;
  const collectedHistorySpanMs = useMemo(
    () => getCollectedHistorySpanMs(trendHistory, simulationClock.simulatedDate, trendMode),
    [simulationClock.simulatedDate, trendHistory, trendMode],
  );
  const availableTrendRanges = useMemo(
    () =>
      TREND_RANGE_DEFINITIONS.filter(option => {
        if (trendMode === 'demo-seeded') {
          return true;
        }

        switch (option.key) {
          case '1h':
            return false;
          case '5h':
            return false;
          case '24h':
            return true;
          case '48h':
            return collectedHistorySpanMs > DAY_IN_MS;
          case 'week':
            return collectedHistorySpanMs > 2 * DAY_IN_MS;
          case 'month':
            return collectedHistorySpanMs > 7 * DAY_IN_MS;
          default:
            return false;
        }
      }),
    [collectedHistorySpanMs, trendMode],
  );
  const selectorRanges = useMemo(
    () => availableTrendRanges.filter(option => TREND_PRIMARY_RANGE_KEYS.includes(option.key)),
    [availableTrendRanges],
  );
  const highestAvailableRange = selectorRanges[selectorRanges.length - 1]?.key ?? '24h';

  useEffect(() => {
    if (selectorRanges.some(option => option.key === selectedRange)) {
      return;
    }

    setSelectedRange(highestAvailableRange);
  }, [highestAvailableRange, selectedRange, selectorRanges]);

  useEffect(() => {
    if (selectedRange === displayedRange) {
      return undefined;
    }

    setIsSwitchingRange(true);
    const swapTimer = window.setTimeout(() => {
      setDisplayedRange(selectedRange);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setIsSwitchingRange(false);
        });
      });
    }, 170);

    return () => window.clearTimeout(swapTimer);
  }, [displayedRange, selectedRange]);

  const rangeDefinition =
    TREND_RANGE_DEFINITIONS.find(option => option.key === displayedRange) ?? TREND_RANGE_DEFINITIONS[0]!;
  const dataset = useMemo(
    () =>
      buildHistoricalSignalDataset({
        rangeKey: displayedRange,
        simulatedDate: simulationClock.simulatedDate,
        liveTelemetry,
        trendHistory,
        mode: trendMode,
        thresholdModel,
      }),
    [displayedRange, liveTelemetry, simulationClock.simulatedDate, thresholdModel, trendHistory, trendMode],
  );
  const displayPoints = useMemo(() => {
    if (dataset.points.length < 3) {
      return dataset.points;
    }

    const additionalPasses = displayedRange === '1h' ? 3 : displayedRange === '5h' ? 2 : displayedRange === '24h' ? 1 : 0;
    const smoothedValues = smoothSeries(dataset.points.map(point => point.value), rangeDefinition.smoothingPasses + additionalPasses);
    smoothedValues[0] = dataset.points[0]?.value ?? smoothedValues[0] ?? 0;
    smoothedValues[smoothedValues.length - 1] = dataset.points[dataset.points.length - 1]?.value ?? smoothedValues[smoothedValues.length - 1] ?? 0;

    return dataset.points.map((point, index) => ({
      ...point,
      value: clamp(smoothedValues[index] ?? point.value, 0, DAYTIME_SIGNAL_MAX),
    }));
  }, [dataset.points, displayedRange, rangeDefinition.smoothingPasses]);
  const geometry = useTimedSignalGeometry(
    displayPoints,
    chartWidth,
    chartHeight,
    dataset.window,
    0,
    100,
    chartTopPaddingRatio,
    chartBottomPaddingRatio,
    chartPlotLeft,
    chartPlotRight,
  );
  const geometryPointXs = useMemo(() => geometry.points.map(point => point.x), [geometry.points]);
  const geometryPointXsRef = useRef<number[]>(geometryPointXs);
  geometryPointXsRef.current = geometryPointXs;
  useEffect(() => {
    setHoveredPointIndex(current => {
      if (current == null) {
        return current;
      }

      return current < displayPoints.length ? current : null;
    });
    pendingHoverXRef.current = null;
    if (hoverFrameRef.current != null) {
      window.cancelAnimationFrame(hoverFrameRef.current);
      hoverFrameRef.current = null;
    }
  }, [displayPoints.length, displayedRange]);
  const displayedAxisLabels = dataset.axisLabels;
  const axisLabelToX = useMemo(() => {
    const axisWindow = dataset.window;
    const startMs = axisWindow.start.getTime();
    const rangeMs = Math.max(1, axisWindow.end.getTime() - startMs);
    const drawableWidth = chartWidth - chartPlotLeft - chartPlotRight;

    return (time: Date) => chartPlotLeft + clamp((time.getTime() - startMs) / rangeMs, 0, 1) * drawableWidth;
  }, [chartPlotLeft, chartPlotRight, chartWidth, dataset.window]);
  const visibleAxisLabels = useMemo(
    () => buildStableAxisLabels(displayedRange, displayedAxisLabels, axisLabelToX, chartWidth),
    [axisLabelToX, chartWidth, displayedAxisLabels, displayedRange],
  );
  const rangeCaption = formatTrendRangeSummary(displayedRange, dataset.window.end);
  const trendFillPalette = useMemo(() => getTrendFillPalette(), []);
  const timeContextLegend = (
    <div className="flex items-center gap-3">
      {[
        { label: 'DAY', color: rgba(trendFillPalette.dayFill, 0.8) },
        { label: 'NOCTURNAL', color: rgba(trendFillPalette.nightFill, 0.82) },
      ].map(item => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: item.color,
              boxShadow: `0 0 0 1px ${hexToRgba('#FFFFFF', 0.035)}`,
            }}
          />
          <span
            style={{
              ...getArcTypographyStyle(foundationTheme, 'label'),
              color: hexToRgba(foundationTheme.text.secondary, 0.64),
              fontSize: fullScreen ? '0.42rem' : '0.38rem',
              letterSpacing: '0.08em',
            }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
  /*
  const legacyRangeCaption =
    displayedRange === '1h'
      ? `LAST 1 HOUR • ENDS ${formatTrendRangeEndDate(dataset.window.end)} • ${formatClockLabel(dataset.window.end)}`
      : displayedRange === '5h'
      ? `LAST 5 HOURS • ENDS ${formatTrendRangeEndDate(dataset.window.end)} • ${formatClockLabel(dataset.window.end)}`
      : displayedRange === '24h'
      ? `LAST 24 HOURS • ENDS ${formatTrendRangeEndDate(dataset.window.end)} • ${formatClockLabel(dataset.window.end)}`
      : displayedRange === '48h'
        ? `${dataset.window.start.toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
          })}–${addDays(dataset.window.start, 1).toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
          })} | 48H View`
        : `${rangeDefinition.label} | Through ${formatChartDateContext(dataset.window.end)}`;
  void legacyRangeCaption;
  const rangeCaption =
    displayedRange === '1h'
      ? `LAST 1 HOUR | ENDS ${formatTrendRangeEndDate(dataset.window.end)} | ${formatClockLabel(dataset.window.end)}`
      : displayedRange === '5h'
      ? `LAST 5 HOURS | ENDS ${formatTrendRangeEndDate(dataset.window.end)} | ${formatClockLabel(dataset.window.end)}`
      : displayedRange === '24h'
      ? `LAST 24 HOURS | ENDS ${formatTrendRangeEndDate(dataset.window.end)} | ${formatClockLabel(dataset.window.end)}`
      : displayedRange === '48h'
        ? `LAST 48 HOURS | ENDS ${formatTrendRangeEndDate(dataset.window.end)} | ${formatClockLabel(dataset.window.end)}`
        : `${rangeDefinition.label} | Through ${formatChartDateContext(dataset.window.end)}`;
  */
  const hoveredPoint =
    hoveredPointIndex != null && displayPoints[hoveredPointIndex] && geometry.points[hoveredPointIndex]
      ? {
          data: displayPoints[hoveredPointIndex]!,
          geometry: geometry.points[hoveredPointIndex]!,
          index: hoveredPointIndex,
        }
      : null;
  const hoveredPointState = hoveredPoint ? getHistoricalPointState(hoveredPoint.data.value, thresholdModel) : null;
  const hoveredPointTimeContextLabel = hoveredPoint ? formatTrendTimeContextLabel(hoveredPoint.data.time) : null;
  const hoveredPointTooltipLayout = useMemo(() => {
    if (!hoveredPoint) {
      return null;
    }

    const isNearRightEdge = hoveredPoint.geometry.x > chartWidth * 0.82;
    const isNearLeftEdge = hoveredPoint.geometry.x < chartWidth * 0.18;
    const isNearTopEdge = hoveredPoint.geometry.y < (fullScreen ? 78 : 58);
    const top = isNearTopEdge
      ? Math.min(chartHeight - 12, hoveredPoint.geometry.y + 14)
      : Math.max(10, hoveredPoint.geometry.y - 14);
    const transform =
      isNearRightEdge
        ? isNearTopEdge
          ? 'translate(-100%, 0)'
          : 'translate(-100%, -100%)'
        : isNearLeftEdge
          ? isNearTopEdge
            ? 'translate(0, 0)'
            : 'translate(0, -100%)'
          : isNearTopEdge
            ? 'translate(-50%, 0)'
            : 'translate(-50%, -100%)';

    return {
      left: `${clamp((hoveredPoint.geometry.x / chartWidth) * 100, fullScreen ? 10 : TREND_TOOLTIP_MIN_X, fullScreen ? 90 : TREND_TOOLTIP_MAX_X)}%`,
      top,
      transform,
    };
  }, [chartHeight, chartWidth, fullScreen, hoveredPoint]);
  const showTrendIndicators = fullScreen || isTrendViewHovered || hoveredPointIndex != null;
  const showTrendAmoraHint =
    fullScreen &&
    amoraEnabled &&
    !!onOpenTrendAmora &&
    amoraGuidanceLevel !== 'minimal' &&
    ((!dataset.hasMeaningfulHistory && proactiveInsightsEnabled) || showTrendIndicators);
  const trendAmoraSummary = dataset.hasMeaningfulHistory
    ? 'Recent performance is becoming more repeatable, with less variation between sessions.'
    : 'Trend memory is still forming from your live signal.';

  useEffect(() => {
    return () => {
      if (hoverFrameRef.current != null) {
        window.cancelAnimationFrame(hoverFrameRef.current);
      }
    };
  }, []);

  const flushHoveredPoint = useCallback(() => {
    hoverFrameRef.current = null;
    const hoverX = pendingHoverXRef.current;
    const currentGeometryPointXs = geometryPointXsRef.current;

    if (hoverX == null || currentGeometryPointXs.length === 0) {
      setHoveredPointIndex(null);
      return;
    }

    let low = 0;
    let high = currentGeometryPointXs.length - 1;

    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if ((currentGeometryPointXs[mid] ?? 0) < hoverX) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }

    const candidateIndex = low;
    const previousIndex = Math.max(0, candidateIndex - 1);
    const nextDistance = Math.abs((currentGeometryPointXs[candidateIndex] ?? 0) - hoverX);
    const previousDistance = Math.abs((currentGeometryPointXs[previousIndex] ?? 0) - hoverX);
    const closestIndex = previousDistance <= nextDistance ? previousIndex : candidateIndex;

    setHoveredPointIndex(current => (current === closestIndex ? current : closestIndex));
  }, []);

  const scheduleHoveredPoint = useCallback((hoverX: number) => {
    pendingHoverXRef.current = hoverX;

    if (hoverFrameRef.current != null) {
      return;
    }

    hoverFrameRef.current = window.requestAnimationFrame(flushHoveredPoint);
  }, [flushHoveredPoint]);

  useEffect(() => {
    if (pendingHoverXRef.current == null || geometryPointXs.length === 0) {
      return;
    }

    if (hoverFrameRef.current != null) {
      window.cancelAnimationFrame(hoverFrameRef.current);
      hoverFrameRef.current = null;
    }

    hoverFrameRef.current = window.requestAnimationFrame(flushHoveredPoint);
  }, [dataset.window.end.getTime(), dataset.window.start.getTime(), flushHoveredPoint, geometryPointXs.length]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const hoverX = clamp((event.clientX - bounds.left) / Math.max(1, bounds.width), 0, 1) * chartWidth;

    if (geometryPointXs.length === 0) {
      setHoveredPointIndex(null);
      return;
    }

    scheduleHoveredPoint(hoverX);
  };

  const resetTrendHover = () => {
    pendingHoverXRef.current = null;
    if (hoverFrameRef.current != null) {
      window.cancelAnimationFrame(hoverFrameRef.current);
      hoverFrameRef.current = null;
    }
    setHoveredPointIndex(null);
  };

  const rangeSelector = (
    <div
      className="flex items-center gap-1 rounded-full border p-1"
      style={{
        background: `linear-gradient(180deg, ${hexToRgba('#111722', fullScreen ? 0.74 : 0.78)} 0%, ${hexToRgba('#0A0F17', fullScreen ? 0.88 : 0.9)} 100%)`,
        borderColor: hexToRgba('#FFFFFF', fullScreen ? 0.055 : 0.048),
        boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.03)}, 0 10px 22px ${hexToRgba('#000000', 0.16)}`,
        backdropFilter: 'blur(16px) saturate(108%)',
      }}
    >
      {selectorRanges.map(option => {
        const isActive = option.key === selectedRange;

        return (
          <button
            key={option.key}
            type="button"
            onClick={() => setSelectedRange(option.key)}
            className="rounded-full px-2.5 py-1 transition-all duration-300"
            tabIndex={0}
            style={{
              ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
              fontSize: fullScreen ? '0.54rem' : '0.49rem',
              letterSpacing: '0.08em',
              color: isActive ? foundationTheme.text.primary : hexToRgba(foundationTheme.text.secondary, 0.76),
              background: isActive ? `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.11)} 0%, ${hexToRgba('#FFFFFF', 0.04)} 100%)` : 'transparent',
              border: isActive ? `1px solid ${hexToRgba('#FFFFFF', 0.06)}` : '1px solid transparent',
              boxShadow: isActive ? `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.045)}, 0 8px 18px ${hexToRgba('#000000', 0.16)}` : 'none',
              transform: isActive ? 'translateY(-0.5px)' : 'translateY(0)',
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="relative min-h-[100dvh] overflow-hidden">
        <ArcAtmosphere variant="live" intensity={0.1} className="z-0" />
        <div className="absolute inset-0" style={{ background: hexToRgba('#04070C', 0.985) }} />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${hexToRgba(foundationTheme.accent.primary, 0.038)} 0%, transparent 34%), linear-gradient(180deg, ${hexToRgba('#0A0D14', 0.08)} 0%, transparent 36%, ${hexToRgba('#000000', 0.12)} 100%)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32"
          style={{ background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.016)} 0%, transparent 100%)` }}
        />

        <div className="relative z-10 flex min-h-[100dvh] flex-col px-7 pb-8 pt-6">
          <div className="flex items-start justify-between gap-5">
            <div>
              <div
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'sectionTitle'),
                  color: foundationTheme.text.primary,
                  fontSize: '0.84rem',
                  letterSpacing: '0.1em',
                }}
              >
                TREND VIEW
              </div>
              <div
                className="mt-2 flex items-center justify-between gap-4"
              >
                <div
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'label'),
                    color: hexToRgba(foundationTheme.text.secondary, 0.7),
                    fontSize: '0.56rem',
                    letterSpacing: '0.09em',
                  }}
                >
                  {rangeCaption}
                </div>
                {timeContextLegend}
              </div>
              {!dataset.hasMeaningfulHistory ? (
                <div
                  className="mt-2"
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'caption'),
                    color: hexToRgba(foundationTheme.text.tertiary, 0.8),
                    fontSize: '0.58rem',
                  }}
                >
                  Trend memory is beginning to form from your live activity.
                </div>
              ) : null}
            </div>

            {rangeSelector}
          </div>

          <div className="relative mt-7 flex flex-1 flex-col justify-center">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 50% 36%, ${hexToRgba(foundationTheme.accent.primary, 0.028)} 0%, transparent 46%), linear-gradient(180deg, ${hexToRgba('#0B1018', 0.18)} 0%, transparent 22%, transparent 78%, ${hexToRgba('#000000', 0.1)} 100%)`,
              }}
            />

            <div
              className="relative"
              style={{ height: chartHeight }}
              onPointerMove={handlePointerMove}
              onPointerLeave={resetTrendHover}
              onPointerDown={handlePointerMove}
            >
              <PremiumTrendGraph
                width={chartWidth}
                height={chartHeight}
                points={displayPoints}
                geometry={geometry}
                gradientIdBase={gradientId}
                rangeKey={displayedRange}
                hoveredPointIndex={hoveredPointIndex}
                fullScreen
              />

              <div className="pointer-events-none absolute inset-0 z-10">
                <div className="absolute left-0 top-0 bottom-0" style={{ width: `${chartPlotLeft - 22}px` }}>
                  {TREND_AXIS_VALUES.map(value => (
                    <div
                      key={`trend-full-axis-${value}`}
                      className="absolute left-0 -translate-y-1/2"
                      style={{
                        ...getArcTypographyStyle(foundationTheme, 'label'),
                        top: geometry.yScale(value),
                        fontSize: '0.42rem',
                        color: hexToRgba(foundationTheme.text.secondary, value === 50 ? 0.46 : 0.58),
                        letterSpacing: '0.08em',
                      }}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0">
                {hoveredPoint && hoveredPointState ? (
                  <div
                    className="absolute z-20 rounded-[16px] border px-3 py-2"
                    style={{
                      background: `linear-gradient(180deg, ${hexToRgba('#111720', 0.94)} 0%, ${hexToRgba('#090D14', 0.97)} 100%)`,
                      left: hoveredPointTooltipLayout?.left,
                      top: hoveredPointTooltipLayout?.top,
                      transform: hoveredPointTooltipLayout?.transform,
                      borderColor: hexToRgba('#FFFFFF', 0.06),
                      minWidth: '138px',
                      boxShadow: `0 14px 28px ${hexToRgba('#000000', 0.18)}, inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.03)}`,
                    }}
                  >
                    <div
                      style={{
                        ...getArcTypographyStyle(foundationTheme, 'caption'),
                        color: hexToRgba(foundationTheme.text.secondary, 0.84),
                        fontSize: '0.54rem',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {formatClockLabel(hoveredPoint.data.time)} • {hoveredPointTimeContextLabel}
                    </div>
                    <div
                      className="mt-1"
                      style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.highlight, fontSize: '0.78rem' }}
                    >
                      {hoveredPoint.data.value.toFixed(1)}%
                    </div>
                    <div
                      className="mt-1"
                      style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: hexToRgba(foundationTheme.text.tertiary, 0.8), fontSize: '0.42rem', letterSpacing: '0.07em' }}
                    >
                      {hoveredPointState.label}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="relative mt-4 h-5 px-1">
              {visibleAxisLabels.map(label => (
                <div
                  key={`${label.label}-${label.time.getTime()}`}
                  className="absolute top-0"
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'navLabel'),
                    fontSize: displayedRange === '48h' ? '0.46rem' : '0.44rem',
                    color: label.label === 'NOW' ? hexToRgba(foundationTheme.text.primary, 0.96) : hexToRgba(foundationTheme.text.secondary, 0.72),
                    left: `${label.leftPercent}%`,
                    transform:
                      label.align === 'left'
                        ? 'translateX(0)'
                        : label.align === 'right'
                          ? 'translateX(-100%)'
                          : 'translateX(-50%)',
                  }}
                >
                  {label.label}
                </div>
              ))}
            </div>
          </div>

          {showTrendAmoraHint ? (
            <div className="mt-5 max-w-[420px]">
              <InlineAmoraInsight
                variant="pattern"
                density="compact"
                message={trendAmoraSummary}
                ctaLabel="See pattern"
                onTap={onOpenTrendAmora}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-[32px] border px-5 pb-4 pt-5"
      data-amora-anchor={!fullScreen ? 'trend-view' : undefined}
      onPointerEnter={() => setIsTrendViewHovered(true)}
      onPointerLeave={() => {
        resetTrendHover();
        setIsTrendViewHovered(false);
      }}
      style={{
        background: `linear-gradient(180deg, ${hexToRgba('#08090D', 0.86)} 0%, ${hexToRgba('#0B0D12', 0.97)} 100%)`,
        borderColor: hexToRgba('#FFFFFF', 0.044),
        backdropFilter: 'blur(16px) saturate(102%)',
        boxShadow: `0 14px 24px ${hexToRgba('#000000', 0.1)}, inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.022)}`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-16"
        style={{ background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.012)} 0%, transparent 100%)` }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(circle at 50% -10%, ${hexToRgba('#FFFFFF', 0.01)} 0%, transparent 40%)` }}
      />

      <div className="relative z-10 flex items-center justify-between gap-3">
        <div
          style={{
            ...getArcTypographyStyle(foundationTheme, 'sectionTitle'),
            color: foundationTheme.text.primary,
            fontSize: '0.76rem',
            letterSpacing: '0.1em',
          }}
        >
          TREND VIEW
        </div>

        {rangeSelector}
      </div>

      <div
        className="relative z-10 mt-2 flex items-center justify-between gap-4 pl-0.5"
      >
        <div
          style={{
            ...getArcTypographyStyle(foundationTheme, 'label'),
            color: hexToRgba(foundationTheme.text.secondary, 0.68),
            fontSize: '0.44rem',
            letterSpacing: '0.09em',
          }}
        >
          {rangeCaption}
        </div>
        {timeContextLegend}
      </div>

      {!dataset.hasMeaningfulHistory ? (
        <div
          className="relative z-10 mt-2"
          style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted, fontSize: '0.56rem' }}
        >
          Trend memory is beginning to form from your live activity.
        </div>
      ) : null}

      <div
        className="relative z-10 mt-4 overflow-hidden rounded-[26px] border px-4 pb-4 pt-4 transition-all duration-500"
        style={{
          background: `linear-gradient(180deg, ${hexToRgba(foundationTheme.text.inverse, 0.56)} 0%, ${hexToRgba(foundationTheme.text.inverse, 0.7)} 100%)`,
          borderColor: hexToRgba('#FFFFFF', 0.05),
          boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.028)}`,
          backdropFilter: 'blur(10px) saturate(112%)',
          opacity: isSwitchingRange ? 0.32 : 1,
          transform: isSwitchingRange ? 'translateY(4px)' : 'translateY(0px)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-20"
          style={{ background: `linear-gradient(180deg, ${hexToRgba(foundationTheme.text.inverse, 0)} 0%, ${hexToRgba(foundationTheme.text.inverse, 0.08)} 100%)` }}
        />
        <div
          className="relative"
          style={{ height: `${chartHeight}px`, cursor: onOpen ? 'pointer' : 'default' }}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTrendHover}
          onPointerDown={handlePointerMove}
          onClick={() => onOpen?.()}
          onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
            if (!onOpen) {
              return;
            }

            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onOpen();
            }
          }}
          role={onOpen ? 'button' : undefined}
          tabIndex={onOpen ? 0 : -1}
          aria-label={onOpen ? 'Open Trend View detail' : undefined}
        >
          <div
            className="absolute inset-0"
          >
            <PremiumTrendGraph
              width={chartWidth}
              height={chartHeight}
              points={displayPoints}
              geometry={geometry}
              gradientIdBase={gradientId}
              rangeKey={displayedRange}
              hoveredPointIndex={hoveredPointIndex}
            />
          </div>

          <div className="pointer-events-none absolute inset-0 z-10">
            <div
              className="absolute left-0 top-0 bottom-5 w-9"
              style={{
                opacity: showTrendIndicators ? 0.82 : 0.64,
                transition: 'opacity 220ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {TREND_AXIS_VALUES.map(value => (
                <div
                  key={`trend-axis-${value}`}
                  className="absolute left-0 -translate-y-1/2"
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'label'),
                    top: geometry.yScale(value),
                    fontSize: '0.34rem',
                    color: hexToRgba(foundationTheme.text.secondary, value === 50 ? 0.44 : 0.56),
                    letterSpacing: '0.06em',
                  }}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0">
            {hoveredPoint && hoveredPointState ? (
              <div
                className="absolute z-20 rounded-[14px] border px-2.5 py-1.5"
                style={{
                  background: `linear-gradient(180deg, ${hexToRgba('#111720', 0.94)} 0%, ${hexToRgba('#090D14', 0.97)} 100%)`,
                  left: hoveredPointTooltipLayout?.left,
                  top: hoveredPointTooltipLayout?.top,
                  transform: hoveredPointTooltipLayout?.transform,
                  borderColor: hexToRgba('#FFFFFF', 0.06),
                  minWidth: '118px',
                  boxShadow: `0 12px 24px ${hexToRgba('#000000', 0.18)}, inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.028)}`,
                }}
              >
                <div
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'caption'),
                    color: hexToRgba(foundationTheme.text.secondary, 0.84),
                    fontSize: '0.5rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  {formatClockLabel(hoveredPoint.data.time)} • {hoveredPointTimeContextLabel}
                </div>
                <div
                  className="mt-1"
                  style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.highlight, fontSize: '0.72rem' }}
                >
                  {hoveredPoint.data.value.toFixed(1)}%
                </div>
                <div
                  className="mt-1"
                  style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: hexToRgba(foundationTheme.text.tertiary, 0.8), fontSize: '0.42rem' }}
                >
                  {hoveredPointState.label}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div
          className="relative mt-3.5 h-4 px-1"
          style={{
            opacity: 0.92,
          }}
        >
          {visibleAxisLabels.map(label => {
              return (
                <div
                  key={`${label.label}-${label.time.getTime()}`}
                  className="absolute top-0"
                  style={{
                  ...getArcTypographyStyle(foundationTheme, 'navLabel'),
                  fontSize: displayedRange === '48h' ? '0.44rem' : '0.42rem',
                    color:
                      label.label === 'NOW'
                        ? hexToRgba(foundationTheme.text.primary, 0.96)
                        : hexToRgba(foundationTheme.text.secondary, 0.72),
                  left: `${label.leftPercent}%`,
                  transform:
                    label.align === 'left'
                      ? 'translateX(0)'
                      : label.align === 'right'
                        ? 'translateX(-100%)'
                        : 'translateX(-50%)',
                }}
              >
                {label.label}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export function ArcTrendExpansionCard({
  liveTelemetry,
  trendHistory,
  trendMode = 'accumulated',
  thresholdModel,
  onOpen,
  amoraEnabled = true,
  proactiveInsightsEnabled = true,
  amoraGuidanceLevel = 'standard',
  onOpenTrendAmora,
}: {
  liveTelemetry?: ArcLiveTelemetry | null;
  trendHistory?: ArcTrendHistoryPoint[];
  trendMode?: ArcTrendViewMode;
  thresholdModel?: ArcThresholdModel;
  onOpen?: () => void;
  amoraEnabled?: boolean;
  proactiveInsightsEnabled?: boolean;
  amoraGuidanceLevel?: ArcAmoraGuidanceLevel;
  onOpenTrendAmora?: () => void;
}) {
  return (
    <ExpansionTimeline
      liveTelemetry={liveTelemetry}
      trendHistory={trendHistory}
      trendMode={trendMode}
      thresholdModel={thresholdModel}
      onOpen={onOpen}
      amoraEnabled={amoraEnabled}
      proactiveInsightsEnabled={proactiveInsightsEnabled}
      amoraGuidanceLevel={amoraGuidanceLevel}
      onOpenTrendAmora={onOpenTrendAmora}
    />
  );
}

export function ArcTrendExpansionDetail({
  liveTelemetry,
  trendHistory,
  trendMode = 'accumulated',
  thresholdModel,
}: {
  liveTelemetry?: ArcLiveTelemetry | null;
  trendHistory?: ArcTrendHistoryPoint[];
  trendMode?: ArcTrendViewMode;
  thresholdModel?: ArcThresholdModel;
}) {
  return (
    <ExpansionTimeline
      liveTelemetry={liveTelemetry}
      trendHistory={trendHistory}
      trendMode={trendMode}
      thresholdModel={thresholdModel}
      fullScreen
    />
  );
}

export function ArcLiveExpansionDetail({
  compact = false,
  fullScreen = false,
  liveSignal,
  onOpenSessionDetails,
  onSessionCaptured,
  thresholdModel,
  onSimulationStateChange,
  showInternalSimulateButton = true,
  amoraEnabled = true,
  proactiveInsightsEnabled = true,
  amoraGuidanceLevel = 'standard',
  onOpenLiveAmora,
}: {
  compact?: boolean;
  fullScreen?: boolean;
  liveSignal: ArcLiveSignalSnapshot;
  onOpenSessionDetails?: (session: Session) => void;
  onSessionCaptured?: (session: Session) => void;
  thresholdModel?: ArcThresholdModel;
  onSimulationStateChange?: (isSimulating: boolean) => void;
  showInternalSimulateButton?: boolean;
  amoraEnabled?: boolean;
  proactiveInsightsEnabled?: boolean;
  amoraGuidanceLevel?: ArcAmoraGuidanceLevel;
  onOpenLiveAmora?: () => void;
}) {
  const simulationClock = useArcSimulationClock();
  const baseGraphHeight = compact ? 240 : fullScreen ? 548 : 360;
  const detailSignal = liveSignal;
  const graphHeight = baseGraphHeight;
  const gradientId = useId();
  const currentLevelLabel = `+${detailSignal.currentValue.toFixed(1)}%`;
  const graphTopPaddingRatio = fullScreen ? 0.12 : 0.14;
  const graphBottomPaddingRatio = fullScreen ? 0.08 : 0.1;
  const graphDomainMax = fullScreen ? 100 : DETAIL_DOMAIN_MAX;
  const displayHistory = useMemo(
    () => (fullScreen ? detailSignal.history.map(value => clamp(value, DETAIL_DOMAIN_MIN, graphDomainMax)) : detailSignal.history),
    [detailSignal.history, fullScreen, graphDomainMax],
  );
  const displayCurrentValue = fullScreen ? clamp(detailSignal.currentValue, DETAIL_DOMAIN_MIN, graphDomainMax) : detailSignal.currentValue;
  const resolvedThresholds = useMemo(() => resolveThresholdModel(thresholdModel), [thresholdModel]);
  const detailThresholds = useMemo(() => buildDetailThresholds(thresholdModel), [thresholdModel]);
  const yScale = useMemo(
    () => createYScale(graphHeight, DETAIL_DOMAIN_MIN, graphDomainMax, graphTopPaddingRatio, graphBottomPaddingRatio),
    [graphBottomPaddingRatio, graphDomainMax, graphHeight, graphTopPaddingRatio],
  );
  const state = getDetailState(detailSignal.currentValue, detailSignal.phase, thresholdModel);
  const showLiveAmoraHint =
    amoraEnabled &&
    proactiveInsightsEnabled &&
    amoraGuidanceLevel !== 'minimal' &&
    !!onOpenLiveAmora;
  const liveAmoraMessage =
    !resolvedThresholds.baselineReady
      ? 'Baseline interpretation is still being learned from early signal.'
      : state.key === 'reduced'
        ? 'Current signal is tracking below your baseline band.'
        : state.key === 'baseline'
          ? 'Current signal is holding close to baseline.'
          : state.key === 'elevated'
            ? 'Resting fullness is sitting slightly above baseline.'
            : state.key === 'returning'
              ? 'Recovery is settling back toward your baseline range.'
              : 'Build and active response are sitting above your resting norm.';
  const reactiveTone = getReactiveSignalTone(state);
  const thresholdVisuals = useMemo(
    () =>
      detailThresholds.map(threshold => ({
        threshold,
        visual: getThresholdVisual(
          threshold,
          detailSignal.currentValue,
          detailSignal.isSimulating,
          detailSignal.phase,
          thresholdModel,
        ),
      })),
    [detailSignal.currentValue, detailSignal.isSimulating, detailSignal.phase, detailThresholds, thresholdModel],
  );
  const isAscendingSimulation =
    detailSignal.phase === 'earlyRise' ||
    detailSignal.phase === 'activeEntry' ||
    detailSignal.phase === 'activeRise';
  const fullScreenChartTop = 54;
  const currentValueMarkerTop = clamp(
    fullScreenChartTop + yScale(displayCurrentValue) - 13,
    fullScreenChartTop + 18,
    fullScreenChartTop + graphHeight - 32,
  );
  const [sessionIndicatorState, setSessionIndicatorState] = useState<SessionIndicatorState>('idle');
  const [completedSession, setCompletedSession] = useState<Session | null>(null);
  const [sessionActionPhase, setSessionActionPhase] = useState<'hidden' | 'visible' | 'exiting'>('hidden');
  const wasAboveActiveEntryRef = useRef(false);
  const activeSessionPeakRef = useRef<number>(resolvedThresholds.activeEntry);
  const activeSessionStartedAtRef = useRef<Date | null>(null);

  useEffect(() => {
    if (detailSignal.isNocturnalActive) {
      wasAboveActiveEntryRef.current = false;
      activeSessionStartedAtRef.current = null;
      activeSessionPeakRef.current = resolvedThresholds.activeEntry;

      if (sessionIndicatorState === 'inProgress') {
        setSessionIndicatorState('idle');
      }

      return;
    }

    const isAboveActiveEntry = detailSignal.currentValue >= resolvedThresholds.activeEntry;

    if (isAboveActiveEntry) {
      if (!wasAboveActiveEntryRef.current) {
        activeSessionStartedAtRef.current = new Date(simulationClock.simulatedDate.getTime());
        activeSessionPeakRef.current = detailSignal.currentValue;
      } else {
        activeSessionPeakRef.current = Math.max(activeSessionPeakRef.current, detailSignal.currentValue);
      }
      wasAboveActiveEntryRef.current = true;
      setSessionIndicatorState('inProgress');
      return;
    }

    if (wasAboveActiveEntryRef.current) {
      wasAboveActiveEntryRef.current = false;
      const completed = createCompletedSession(
        activeSessionPeakRef.current,
        activeSessionStartedAtRef.current,
        simulationClock.simulatedDate,
        thresholdModel,
      );
      setCompletedSession(completed);
      onSessionCaptured?.(completed);
      setSessionIndicatorState('ready');
      setSessionActionPhase('visible');
      activeSessionStartedAtRef.current = null;
    } else if (sessionIndicatorState === 'inProgress') {
      setSessionIndicatorState('idle');
    }
  }, [detailSignal.currentValue, detailSignal.isNocturnalActive, onSessionCaptured, sessionIndicatorState, simulationClock.simulatedDate, resolvedThresholds.activeEntry, thresholdModel]);

  useEffect(() => {
    onSimulationStateChange?.(detailSignal.isSimulating);
  }, [detailSignal.isSimulating, onSimulationStateChange]);

  useEffect(() => {
    if (sessionActionPhase !== 'visible' || !completedSession) {
      return;
    }

    const timeout = setTimeout(() => {
      setSessionActionPhase('exiting');
    }, SESSION_ACTION_VISIBLE_MS);

    return () => clearTimeout(timeout);
  }, [completedSession, sessionActionPhase]);

  useEffect(() => {
    if (sessionActionPhase !== 'exiting') {
      return;
    }

    const timeout = setTimeout(() => {
      setSessionActionPhase('hidden');
      setSessionIndicatorState('idle');
      setCompletedSession(null);
    }, SESSION_ACTION_EXIT_MS);

    return () => clearTimeout(timeout);
  }, [sessionActionPhase]);

  const handleSimulateEvent = () => {
    setSessionIndicatorState('idle');
    setCompletedSession(null);
    setSessionActionPhase('hidden');
    wasAboveActiveEntryRef.current = false;
    activeSessionStartedAtRef.current = null;
    activeSessionPeakRef.current = resolvedThresholds.activeEntry;
    detailSignal.simulateEvent();
  };

  const handleOpenCompletedSession = () => {
    const session = completedSession;
    setSessionActionPhase('hidden');
    setSessionIndicatorState('idle');
    setCompletedSession(null);
    if (session) {
      onOpenSessionDetails?.(session);
    }
  };

  if (fullScreen) {
    return (
      <div className="relative min-h-[620px] overflow-hidden">
        <ArcAtmosphere variant="live" intensity={0.26} className="z-0" />
        <div
          className="absolute inset-0"
          style={{
            background: hexToRgba('#000000', 0.94),
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 12%, ${hexToRgba(reactiveTone.color, 0.08)} 0%, transparent 32%), linear-gradient(180deg, ${hexToRgba('#000000', 0.16)} 0%, ${hexToRgba('#000000', 0.08)} 24%, transparent 48%, ${hexToRgba('#000000', 0.1)} 100%)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, transparent 0%, ${hexToRgba('#000000', 0.08)} 70%, ${hexToRgba('#000000', 0.18)} 100%)`,
          }}
        />

        <div className="absolute inset-x-0 top-0 z-20 px-5 pt-2">
          <div className="flex items-start justify-between gap-3">
            <div
              className="rounded-full border px-4 py-2"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                ...getArcGlassPillStyle(foundationTheme, 'medium', { tint: state.toneColor, tintStrength: 0.055 }),
                fontSize: '0.66rem',
                borderColor: state.chipBorderColor,
                color: state.chipTextColor,
              }}
            >
              {state.label}
            </div>

            {sessionIndicatorState === 'inProgress' ? (
              <div
                className="rounded-full border px-3 py-1.5"
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                  ...getArcGlassPillStyle(foundationTheme, 'light', { tint: foundationTheme.chart.nocturnal, tintStrength: 0.06 }),
                  fontSize: '0.54rem',
                  borderColor: hexToRgba(foundationTheme.chart.nocturnal, 0.18),
                  color: foundationTheme.chart.nocturnal,
                }}
              >
                Session In Progress
              </div>
            ) : null}
          </div>
        </div>

        <div
          className="absolute right-4 z-20 -translate-y-1/2"
          style={{ top: currentValueMarkerTop + 40 }}
        >
          <div
            className="rounded-full border px-3 py-1.5"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
              ...getArcGlassPillStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.038 }),
              fontSize: '0.56rem',
              borderColor: hexToRgba('#FFFFFF', 0.065),
              color: foundationTheme.text.secondary,
            }}
          >
            Current {currentLevelLabel}
          </div>
        </div>

        <div className="absolute inset-x-0 z-10 px-3" style={{ top: fullScreenChartTop }}>
          <div className="relative" style={{ height: graphHeight }}>
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-9">
              {FULLSCREEN_AXIS_VALUES.map(value => (
                <div
                  key={`axis-${value}`}
                  className="absolute left-0 -translate-y-1/2"
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'label'),
                    top: yScale(value),
                    fontSize: '0.43rem',
                    color: value % 10 === 0 ? foundationTheme.text.secondary : foundationTheme.text.muted,
                    letterSpacing: '0.08em',
                  }}
                >
                  {value}
                </div>
              ))}
            </div>

            <div className="pointer-events-none absolute left-10 right-0 top-0 bottom-0">
              {FULLSCREEN_AXIS_VALUES.map(value => (
                <div
                  key={`grid-${value}`}
                  className="absolute left-0 right-0 h-px"
                  style={{
                    top: yScale(value),
                    background: value % 10 === 0 ? 'rgba(255,255,255,0.075)' : 'rgba(255,255,255,0.032)',
                  }}
                />
              ))}
            </div>

            <div className="absolute left-10 right-0 top-0 bottom-0">
              <LiveSignalGraph
                width={880}
                height={graphHeight}
                history={displayHistory}
                linePhases={detailSignal.historyLinePhases}
                gradientId={gradientId}
                domainMin={DETAIL_DOMAIN_MIN}
                domainMax={graphDomainMax}
                strokeWidth={detailSignal.isSimulating ? 3.1 : 2.95}
                glowWidth={detailSignal.isSimulating ? 5.2 : 4.9}
                className="h-full w-full overflow-visible"
                animateEndpoint
                topPaddingRatio={graphTopPaddingRatio}
                bottomPaddingRatio={graphBottomPaddingRatio}
                riseBoost={isAscendingSimulation ? 0.1 : detailSignal.isSimulating ? 0.04 : 0}
                endpointGlowScale={isAscendingSimulation ? 0.94 : detailSignal.isSimulating ? 0.86 : 0.8}
                trailOpacityScale={isAscendingSimulation ? 0.58 : 0.62}
                uniformTrendStroke
                smoothingPasses={2}
              />
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-4 z-20 flex items-end justify-between gap-3 px-4">
          <div className="flex min-h-[54px] flex-1 items-end">
            {sessionIndicatorState === 'ready' && completedSession ? (
              <div
                className="flex flex-wrap items-center gap-2 transition-all duration-300"
                style={{
                  opacity: sessionActionPhase === 'visible' ? 1 : 0,
                  transform: sessionActionPhase === 'visible' ? 'translateY(0px)' : 'translateY(6px)',
                  pointerEvents: sessionActionPhase === 'hidden' ? 'none' : 'auto',
                }}
              >
                <div
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'caption'),
                    fontSize: '0.42rem',
                    color: foundationTheme.text.muted,
                  }}
                >
                  Session captured
                </div>
                <div
                  className="relative"
                  style={{
                    borderRadius: '9999px',
                    boxShadow: `0 10px 20px ${hexToRgba(foundationTheme.signal.up, 0.08)}`,
                  }}
                >
                  <button
                    type="button"
                    onClick={handleOpenCompletedSession}
                    className="rounded-full border pl-3 pr-7 py-1 transition-colors duration-300"
                    style={{
                      ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                      fontSize: '0.57rem',
                      ...getArcGlassPillStyle(foundationTheme, 'light', { tint: foundationTheme.signal.up, tintStrength: 0.05 }),
                      borderColor: hexToRgba(foundationTheme.signal.up, 0.16),
                      color: foundationTheme.signal.up,
                    }}
                  >
                    View Session Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionActionPhase('exiting')}
                    className="absolute right-[4px] top-[3px] flex h-[14px] w-[14px] items-center justify-center rounded-full transition-colors duration-300"
                    style={{
                      ...getArcGlassPillStyle(foundationTheme, 'light'),
                      color: foundationTheme.text.tertiary,
                    }}
                    aria-label="Dismiss session action"
                  >
                    <svg className="h-[8px] w-[8px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {showInternalSimulateButton ? (
            <button
              type="button"
              onClick={handleSimulateEvent}
              disabled={detailSignal.isSimulating}
              className="rounded-full border px-4 py-2 transition-all duration-300 disabled:cursor-default"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                ...getArcGlassPillStyle(foundationTheme, 'medium', { tint: foundationTheme.signal.down, tintStrength: detailSignal.isSimulating ? 0.08 : 0.06 }),
                borderColor: hexToRgba(foundationTheme.signal.down, detailSignal.isSimulating ? 0.24 : 0.2),
                color: detailSignal.isSimulating ? hexToRgba(foundationTheme.text.highlight, 0.86) : foundationTheme.signal.down,
              }}
            >
              {detailSignal.isSimulating ? 'Simulating' : 'Simulate Event'}
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      <div
        className={`relative overflow-hidden rounded-[34px] border ${compact ? 'px-5 py-5' : 'px-6 py-6'}`}
        data-amora-anchor={!fullScreen ? 'live-chart' : undefined}
        style={{
          ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: reactiveTone.color, tintStrength: 0.045 }),
          borderColor: hexToRgba('#FFFFFF', 0.075),
        }}
      >
        <ArcAtmosphere variant="live" intensity={0.72} className="z-0" />
        <div className="absolute inset-x-0 top-0 h-16" style={{ background: foundationTheme.bg.overlay }} />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-14"
          style={{ background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.022)} 0%, transparent 100%)` }}
        />
        <div className={`relative z-10 flex flex-col items-center text-center ${compact ? 'mb-4' : 'mb-5'}`}>
          <div className="flex flex-col items-center gap-2">
            <div
              className="rounded-full border px-4.5 py-2.5"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                ...getArcGlassPillStyle(foundationTheme, 'medium', { tint: state.toneColor, tintStrength: 0.06 }),
                fontSize: '0.71875rem',
                borderColor: state.chipBorderColor,
                color: state.chipTextColor,
                boxShadow: `0 10px 24px ${
                  hexToRgba(
                    state.key === 'entering'
                      ? foundationTheme.signal.warning
                      : isAscendingSimulation
                        ? foundationTheme.signal.up
                        : reactiveTone.color,
                    detailSignal.isSimulating ? 0.16 : 0.12,
                  )
                }`,
              }}
            >
              {state.label}
            </div>
            <div
              className="rounded-full border px-3 py-1.5"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                ...getArcGlassPillStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.04 }),
                fontSize: '0.53125rem',
                borderColor: hexToRgba('#FFFFFF', 0.07),
                color: foundationTheme.text.secondary,
              }}
            >
              Current {currentLevelLabel}
            </div>
          </div>
          <div className="mt-3 max-w-[220px]" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.secondary }}>
            Live resting-state signal
          </div>
          {(!resolvedThresholds.baselineReady || !resolvedThresholds.peakReady) && (
            <div className="mt-2 max-w-[250px]" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted }}>
              {!resolvedThresholds.baselineReady && !resolvedThresholds.peakReady
                ? 'Resting-state and peak thresholds are still being learned from your own data.'
                : !resolvedThresholds.baselineReady
                  ? 'Lower resting-state bands are still based on an early baseline estimate.'
                  : 'Peak and Record remain provisional until more peak events are captured.'}
            </div>
          )}
          {showLiveAmoraHint ? (
            <div className="mt-3 w-full max-w-[276px]">
              <InlineAmoraInsight
                variant="note"
                density="compact"
                message={liveAmoraMessage}
                ctaLabel="View interpretation"
                onTap={onOpenLiveAmora}
              />
            </div>
          ) : null}
        </div>

        <div
          className="relative overflow-hidden rounded-[30px] border px-4 py-5 transition-colors duration-500"
          style={{
            height: graphHeight + 28,
            background: `linear-gradient(180deg, ${hexToRgba(foundationTheme.text.inverse, 0.54)} 0%, ${hexToRgba(foundationTheme.text.inverse, 0.7)} 100%)`,
            borderColor: hexToRgba('#FFFFFF', state.key === 'reduced' || state.key === 'elevated' ? 0.08 : 0.07),
            backdropFilter: 'blur(10px) saturate(112%)',
            boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.028)}`,
          }}
        >
          <div className="relative" style={{ height: graphHeight }}>
            <div className="pointer-events-none absolute inset-x-0 top-0 bottom-0">
              {DETAIL_MINOR_GUIDES.map(gridValue => (
                <div
                  key={`guide-${gridValue}`}
                  className="absolute inset-x-0 h-px"
                  style={{
                    top: yScale(gridValue),
                    background: 'rgba(255,255,255,0.022)',
                  }}
                />
              ))}
              {thresholdVisuals.map(({ threshold, visual }) =>
                visual.showLine ? (
                  <div
                    key={threshold.key}
                    className="absolute inset-x-0 h-px transition-all duration-500"
                    style={{
                      top: yScale(threshold.value),
                      backgroundColor: visual.lineColor,
                      height: visual.strokeWidth,
                    }}
                  />
                ) : null,
              )}
            </div>
            {thresholdVisuals.map(({ threshold, visual }) =>
              visual.showLabel ? (
                <div
                  key={`${threshold.key}-label`}
                  className="pointer-events-none absolute -translate-y-1/2 rounded-full px-1.5 py-0.5 transition-all duration-500"
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'label'),
                    fontSize:
                      threshold.priority === 'primary'
                        ? '0.39rem'
                        : threshold.priority === 'secondary'
                          ? '0.355rem'
                          : '0.33rem',
                    top: yScale(threshold.value),
                    left: threshold.placement === 'left' ? 2 : 'auto',
                    right: threshold.placement === 'right' ? 2 : 'auto',
                    color: visual.labelColor,
                    backgroundColor: visual.labelBackground,
                    letterSpacing:
                      threshold.priority === 'primary'
                        ? '0.14em'
                        : threshold.priority === 'secondary'
                          ? '0.16em'
                          : '0.18em',
                  }}
                >
                  {threshold.label}
                </div>
              ) : null,
            )}
            <LiveSignalGraph
              width={880}
              height={graphHeight}
              history={detailSignal.history}
              linePhases={detailSignal.historyLinePhases}
              gradientId={gradientId}
              domainMin={DETAIL_DOMAIN_MIN}
              domainMax={DETAIL_DOMAIN_MAX}
              strokeWidth={detailSignal.isSimulating ? 2.5 : 2.35}
              glowWidth={detailSignal.isSimulating ? 4.8 : 4.2}
              className="h-full w-full overflow-visible"
              animateEndpoint
              topPaddingRatio={graphTopPaddingRatio}
              bottomPaddingRatio={graphBottomPaddingRatio}
              riseBoost={isAscendingSimulation ? 0.1 : detailSignal.isSimulating ? 0.04 : 0}
              endpointGlowScale={isAscendingSimulation ? 0.9 : detailSignal.isSimulating ? 0.82 : 0.76}
              trailOpacityScale={isAscendingSimulation ? 0.62 : 0.66}
              uniformTrendStroke
              smoothingPasses={2}
            />
          </div>
        </div>

        <div className="relative z-10 mt-4 flex items-center justify-between gap-3">
          <div className="min-h-[54px] flex flex-1 items-center">
            {sessionIndicatorState === 'inProgress' && (
              <div
                className="rounded-full border px-3 py-1.5"
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                  ...getArcGlassPillStyle(foundationTheme, 'light', { tint: foundationTheme.chart.nocturnal, tintStrength: 0.07 }),
                  borderColor: hexToRgba(foundationTheme.chart.nocturnal, 0.2),
                  color: foundationTheme.chart.nocturnal,
                }}
              >
                Session In Progress
              </div>
            )}
            {sessionIndicatorState === 'ready' && completedSession && (
              <div
                className="flex flex-wrap items-center gap-2 pl-0.5 transition-all duration-300"
                style={{
                  opacity: sessionActionPhase === 'visible' ? 1 : 0,
                  transform: sessionActionPhase === 'visible' ? 'translateY(0px)' : 'translateY(6px)',
                  pointerEvents: sessionActionPhase === 'hidden' ? 'none' : 'auto',
                }}
              >
                <div
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'caption'),
                    fontSize: '0.42rem',
                    color: foundationTheme.text.muted,
                  }}
                >
                  Session captured
                </div>
                <div
                  className="relative"
                  style={{
                    borderRadius: '9999px',
                    boxShadow: `0 10px 20px ${hexToRgba(foundationTheme.signal.up, 0.08)}`,
                  }}
                >
                  <button
                    type="button"
                    onClick={handleOpenCompletedSession}
                    className="rounded-full border pl-3 pr-7 py-1 transition-colors duration-300"
                    style={{
                      ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                      fontSize: '0.57rem',
                      ...getArcGlassPillStyle(foundationTheme, 'light', { tint: foundationTheme.signal.up, tintStrength: 0.05 }),
                      borderColor: hexToRgba(foundationTheme.signal.up, 0.16),
                      color: foundationTheme.signal.up,
                    }}
                  >
                    View Session Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionActionPhase('exiting')}
                    className="absolute right-[4px] top-[3px] flex h-[14px] w-[14px] items-center justify-center rounded-full transition-colors duration-300"
                    style={{
                      ...getArcGlassPillStyle(foundationTheme, 'light'),
                      color: foundationTheme.text.tertiary,
                    }}
                    aria-label="Dismiss session action"
                  >
                    <svg className="h-[8px] w-[8px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {showInternalSimulateButton && (
            <button
              type="button"
              onClick={handleSimulateEvent}
              disabled={detailSignal.isSimulating}
              className="rounded-full border px-4 py-2 transition-all duration-300 disabled:cursor-default"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                ...getArcGlassPillStyle(foundationTheme, 'medium', { tint: foundationTheme.signal.down, tintStrength: detailSignal.isSimulating ? 0.08 : 0.06 }),
                borderColor: hexToRgba(foundationTheme.signal.down, detailSignal.isSimulating ? 0.24 : 0.2),
                color: detailSignal.isSimulating ? hexToRgba(foundationTheme.text.highlight, 0.86) : foundationTheme.signal.down,
              }}
            >
              {detailSignal.isSimulating ? 'Simulating' : 'Simulate Event'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ArcExpansionInsights({
  onOpenLiveDetail,
  onOpenTrendDetail,
  amoraEnabled = true,
  proactiveInsightsEnabled = true,
  amoraGuidanceLevel = 'standard',
  showLiveView = true,
  showTrendView = true,
  onOpenLiveAmora,
  onOpenTrendAmora,
  liveTelemetry,
  trendHistory,
  trendMode = 'accumulated',
  thresholdModel,
  liveSyncState,
  liveSyncProgress = 0,
}: {
  onOpenLiveDetail?: () => void;
  onOpenTrendDetail?: () => void;
  amoraEnabled?: boolean;
  proactiveInsightsEnabled?: boolean;
  amoraGuidanceLevel?: ArcAmoraGuidanceLevel;
  showLiveView?: boolean;
  showTrendView?: boolean;
  onOpenLiveAmora?: () => void;
  onOpenTrendAmora?: () => void;
  liveTelemetry?: ArcLiveTelemetry | null;
  trendHistory?: ArcTrendHistoryPoint[];
  trendMode?: ArcTrendViewMode;
  thresholdModel?: ArcThresholdModel;
  liveSyncState?: {
    pillLabel: string;
    statusLine: string;
    detailLine: string;
  };
  liveSyncProgress?: number;
}) {
  const simulationClock = useArcSimulationClock();
  const hasRenderableTrendHistory = useMemo(
    () => getCollectedHistorySpanMs(trendHistory, simulationClock.simulatedDate, trendMode) >= MIN_TREND_RENDERABLE_SPAN_MS,
    [simulationClock.simulatedDate, trendHistory, trendMode],
  );
  const shouldRenderTrendView = showTrendView && hasRenderableTrendHistory;

  if (!showLiveView && !shouldRenderTrendView) {
    return null;
  }

  return (
    <div className="mb-4 space-y-3 pt-1">
      {showLiveView ? (
        <LiveExpansionGraph
          onOpen={onOpenLiveDetail}
          liveTelemetry={liveTelemetry}
          thresholdModel={thresholdModel}
          amoraEnabled={amoraEnabled}
          proactiveInsightsEnabled={proactiveInsightsEnabled}
          amoraGuidanceLevel={amoraGuidanceLevel}
          onOpenLiveAmora={onOpenLiveAmora}
          liveSyncState={liveSyncState}
          liveSyncProgress={liveSyncProgress}
        />
      ) : null}
      {shouldRenderTrendView ? (
        <ExpansionTimeline
          liveTelemetry={liveTelemetry}
          trendHistory={trendHistory}
          trendMode={trendMode}
          thresholdModel={thresholdModel}
          onOpen={onOpenTrendDetail}
          amoraEnabled={amoraEnabled}
          proactiveInsightsEnabled={proactiveInsightsEnabled}
          amoraGuidanceLevel={amoraGuidanceLevel}
          onOpenTrendAmora={onOpenTrendAmora}
        />
      ) : null}
    </div>
  );
}
