import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { Session } from '../../data/arc-types';
import type { ArcAppDataSnapshot } from '../../data/arc-app-data';
import {
  buildCardShapeMaskImage,
  insertCardShapePointAtNearestEdge,
  removeCardShapePointAtIndex,
  type ArcCardShapePoint,
} from '../../data/arc-card-shape';
import type { ArcEdgeCardLayout, ArcEdgeCardMoveItemId } from '../../data/arc-card-layout';
import type { ArcFoundationGoalState } from '../../data/foundationGoalState';
import { type ArcTrendHistoryPoint, type ArcTrendViewMode } from './ArcExpansionInsights';
import { ArcAmoraAccessButton, type ArcAmoraGuidanceLevel, type ArcAmoraTopicId } from './ArcAmora';
import ArcInsignia from './ArcInsignia';
import { ArcToolSlotRack, getArcSlottedToolsForPlacement, type ArcToolAssignments } from './ArcToolBox';
import { foundationTheme, getArcGlassPillStyle, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';
import { getPulsePalette, PulseGlyph } from './pulseAppearance';
import { usePulse } from './pulseManager';
import { isEmberSigilTier } from '../../data/arc-insignia';

type ArcPanel = 'insignia' | 'identity' | 'accountStatus' | 'goal' | 'momentum' | 'edgeScore' | 'sync' | 'connection' | 'battery' | 'pulse';
const PROFILE_STAGES = ['Foundation', 'Signal', 'Form', 'Prime', 'Vector', 'Apex', 'Sovereign', 'Obsidian'] as const;
const HEADER_BATTERY_INDICATOR_ASSET = '/battery-life-indicator-1.png';
const HOME_SCORE_INDICATOR_CORE = foundationTheme.accent.primary;
const HOME_SCORE_INDICATOR_SOFT = foundationTheme.accent.secondary;
const HOME_SCORE_INDICATOR_GLOW = foundationTheme.accent.primary;

function getProfileStage(_progress: number) {
  return PROFILE_STAGES[0];
}

function TopBarMotionStyles() {
  return (
    <style>
      {`
        @keyframes nexhub-crest-breathe {
          0%, 100% { opacity: 0.58; transform: scale(0.985); }
          50% { opacity: 0.9; transform: scale(1.015); }
        }

        @keyframes nexhub-crest-arc {
          0%, 100% { opacity: 0.68; }
          50% { opacity: 1; }
        }

        @keyframes nexhub-streak-seam-breathe {
          0%, 100% { opacity: var(--streak-seam-opacity, 0.16); }
          50% { opacity: var(--streak-seam-peak-opacity, 0.28); }
        }

        @keyframes nexhub-artifact-uplight-breathe {
          0%, 100% { opacity: 0.46; }
          50% { opacity: 0.68; }
        }

        @keyframes nexhub-pulse-mailbox-breathe {
          0%, 100% { opacity: 0.7; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.03); }
        }

        @keyframes nexhub-pulse-mailbox-halo {
          0%, 100% { opacity: 0.14; transform: scale(0.88); }
          50% { opacity: 0.28; transform: scale(1.08); }
        }

      `}
    </style>
  );
}

function ChevronHint() {
  return (
    <svg className="h-3 w-3" style={{ color: foundationTheme.text.secondary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  );
}

type FocusScoreContext = 'baseline' | 'peak' | 'overnight' | 'streak' | 'motion' | 'recovery' | 'hold' | 'overall';

interface HomeScoreMoverCard {
  id: string;
  label: string;
  tone: string;
  valueText: string;
  direction: 'up' | 'down' | 'neutral';
}

interface HomeEdgePillarCard {
  id: string;
  label: string;
  displayLabel: string;
  tone: string;
  score: number | null;
  weight: number;
}

interface HomeFocusScorePresentation {
  value: number;
  progress: number;
  stateLabel: string;
  supportLabel: string;
  context: FocusScoreContext;
  tone: string;
  movers: HomeScoreMoverCard[];
}

interface HomeEdgeCardShapeEditor {
  enabled: boolean;
  points: ArcCardShapePoint[];
  selectedPointIndex: number | null;
  onPointsChange: (points: ArcCardShapePoint[]) => void;
  onSelectedPointChange: (index: number | null) => void;
}

interface HomeEdgeCardMoveEditor {
  enabled: boolean;
  layout: ArcEdgeCardLayout;
  onLayoutChange: (layout: ArcEdgeCardLayout) => void;
}

const FOCUS_MOVER_PRESETS: Record<
  FocusScoreContext,
  {
    ids: string[];
    fallbackLabels: string[];
  }
> = {
  baseline: {
    ids: ['baseline-stability', 'baseline-mean', 'reduced-baseline', 'elevated-support', 'baseline-volatility'],
    fallbackLabels: ['Baseline Stability', 'Baseline Mean', 'Reduced Baseline'],
  },
  peak: {
    ids: ['peak-fullness', 'hold-quality', 'hold-stability', 'build-quality', 'peak-consistency'],
    fallbackLabels: ['Peak Fullness', 'Hold Quality', 'Build Quality'],
  },
  overnight: {
    ids: ['nocturnal-fullness', 'nocturnal-duration', 'events-per-night', 'overnight-consistency', 'strongest-set'],
    fallbackLabels: ['Nocturnal Fullness', 'Nocturnal Duration', 'Events Per Night'],
  },
  streak: {
    ids: ['active-day-density', 'archive-maturity', 'pattern-reliability', 'motion-session-quality', 'hold-quality'],
    fallbackLabels: ['Active Day Density', 'Archive Maturity', 'Pattern Reliability'],
  },
  motion: {
    ids: ['motion-session-quality', 'motion-hold', 'motion-peak', 'cadence', 'rhythm-consistency', 'motion-control'],
    fallbackLabels: ['Motion Session Quality', 'Cadence', 'Rhythm Consistency'],
  },
  recovery: {
    ids: ['recovery-quality', 'rebound-quality', 'hold-duration', 'hold-quality', 'overnight-consistency'],
    fallbackLabels: ['Recovery Quality', 'Rebound Quality', 'Hold Duration'],
  },
  hold: {
    ids: ['hold-quality', 'hold-stability', 'hold-duration', 'peak-consistency', 'pattern-reliability'],
    fallbackLabels: ['Hold Quality', 'Hold Stability', 'Hold Duration'],
  },
  overall: {
    ids: ['hold-quality', 'motion-session-quality', 'peak-fullness', 'active-day-density', 'pattern-reliability'],
    fallbackLabels: ['Hold Quality', 'Motion Session Quality', 'Peak Fullness'],
  },
};

const HOME_MOVER_LABEL_OVERRIDES: Record<string, string> = {
  'Motion Session Quality': 'Motion Quality',
  'Motion / Static Ratio': 'Motion Ratio',
  'Active Day Density': 'Active Density',
  'Pattern Reliability': 'Pattern Trust',
  'Archive Maturity': 'Archive Depth',
  'Overnight Consistency': 'Night Consistency',
  'Nocturnal Fullness': 'Night Fullness',
  'Nocturnal Duration': 'Night Duration',
  'Strongest Set': 'Best Set',
  'Reduced Baseline': 'Reduced Days',
  'Elevated Support': 'Elevated Support',
  'Volatility Quality': 'Volatility',
};

function getEdgeStateTone(state: ArcAppDataSnapshot['edgeScore']['state']) {
  switch (state) {
    case 'stable':
    case 'strengthening':
      return foundationTheme.signal.up;
    case 'reduced':
      return foundationTheme.signal.down;
    case 'volatile':
      return foundationTheme.signal.warning;
    default:
      return foundationTheme.accent.primary;
  }
}

function getScoreMoverTone(direction: HomeScoreMoverCard['direction']) {
  if (direction === 'up') {
    return '#477756';
  }

  if (direction === 'down') {
    return '#824F4C';
  }

  return '#8F98A3';
}

function buildNeutralMoverCard(id: string, label: string): HomeScoreMoverCard {
  return {
    id,
    label: HOME_MOVER_LABEL_OVERRIDES[label] ?? label,
    tone: getScoreMoverTone('neutral'),
    valueText: '--',
    direction: 'neutral',
  };
}

function buildNeutralMoverCards(prefix: string, labels: string[]): HomeScoreMoverCard[] {
  return labels.slice(0, 3).map((label, index) => buildNeutralMoverCard(`${prefix}-${index}`, label));
}

function mapSwingToHomeMoverCard(swing: ArcAppDataSnapshot['edgeScore']['recentImpactSwings'][number]): HomeScoreMoverCard {
  return {
    id: swing.id,
    label: HOME_MOVER_LABEL_OVERRIDES[swing.label] ?? swing.label,
    tone: getScoreMoverTone(swing.direction),
    valueText: `${swing.delta > 0 ? '+' : ''}${swing.delta}`,
    direction: swing.direction,
  };
}

function getEdgeCardPresentation(edgeScore: ArcAppDataSnapshot['edgeScore']) {
  if (edgeScore.unlocked) {
    return {
      stateLabel: 'PRIME',
      interpretation: 'Stronger hold. Faster rise.',
      deltaLabel: '\u2191 +4 today',
    };
  }

  if (edgeScore.value == null) {
    return {
      stateLabel: 'Building',
      interpretation: 'Still building from new history',
      deltaLabel: 'Building today',
    };
  }

  return {
    stateLabel: 'Elevated',
    interpretation: 'Lifted by steadier hold and response',
    deltaLabel: '↑ 4 today',
  };
}

function getLiveEdgeCardPresentation(edgeScore: ArcAppDataSnapshot['edgeScore']) {
  if (!edgeScore.unlocked) {
    return {
      stateLabel: 'Building',
      interpretation: 'Still building from new history',
      deltaLabel: 'Building today',
    };
  }

  const deltaLabel =
    edgeScore.dayDelta == null
      ? '— today'
      : edgeScore.dayDelta > 0
        ? `↑ +${edgeScore.dayDelta} today`
        : edgeScore.dayDelta < 0
          ? `↓ ${edgeScore.dayDelta} today`
          : 'No change today';

  switch (edgeScore.state) {
    case 'stable':
    case 'strengthening':
      return {
        stateLabel: 'PRIME',
        interpretation: 'Stronger hold. Faster rise.',
        deltaLabel,
      };
    case 'live':
    case 'early_calibrated':
      return {
        stateLabel: 'READY',
        interpretation: 'Clean build. Better hold.',
        deltaLabel,
      };
    case 'reduced':
      return {
        stateLabel: 'DECLINING',
        interpretation: 'Lower hold. Slower rise.',
        deltaLabel,
      };
    case 'volatile':
      return {
        stateLabel: 'STEADY',
        interpretation: 'Mixed hold. Uneven response.',
        deltaLabel,
      };
    default:
      return {
        stateLabel: 'READY',
        interpretation: 'Signal is live and learning.',
        deltaLabel,
      };
  }
}

function getInstrumentEdgeCardPresentation(edgeScore: ArcAppDataSnapshot['edgeScore'], unlockPercentage: number) {
  const base = {
    supportLabel: edgeScore.maturityLabel as string | null,
    description: '5-pillar index. 50-64 balanced. 65-74 strong. 75-84 advanced. 85-92 elite. 93-99 apex. 100 unicorn.',
    progressLabel: null as string | null,
    deltaLabel: null as string | null,
  };

  if (edgeScore.value == null) {
    return {
      ...base,
      supportLabel: 'Building',
      interpretation: 'Provisional score forming',
      description: 'Five pillars are coming online. Early reads stay conservative while coverage builds.',
      progressLabel: `${unlockPercentage}% confidence`,
      deltaLabel: '— today',
    };
  }

  const score = edgeScore.value;
  const deltaLabel =
    edgeScore.dayDelta == null
      ? '— today'
      : edgeScore.dayDelta > 0
        ? `+${edgeScore.dayDelta} today`
        : edgeScore.dayDelta < 0
          ? `${edgeScore.dayDelta} today`
          : '0 today';

  const normalizedDeltaLabel =
    edgeScore.dayDelta == null
      ? 'No change'
      : edgeScore.dayDelta > 0
        ? `+${edgeScore.dayDelta} today`
        : edgeScore.dayDelta < 0
          ? `${edgeScore.dayDelta} today`
          : '0 today';

  if (score >= 100) {
    return {
      ...base,
      interpretation: 'Unicorn',
      deltaLabel: normalizedDeltaLabel,
    };
  }

  if (score >= 93) {
    return {
      ...base,
      interpretation: 'Apex',
      deltaLabel: normalizedDeltaLabel,
    };
  }

  if (score >= 85) {
    return {
      ...base,
      interpretation: 'Elite',
      description: 'High-end performance is holding across the five pillars, with strong depth and control.',
      deltaLabel: normalizedDeltaLabel,
    };
  }

  if (score >= 75) {
    return {
      ...base,
      interpretation: 'Advanced',
      description: '',
      deltaLabel: normalizedDeltaLabel,
    };
  }

  if (score >= 65) {
    return {
      ...base,
      interpretation: 'Strong',
      description: 'Current scoring is being supported by stronger day-to-day performance and steadier session quality.',
      deltaLabel: normalizedDeltaLabel,
    };
  }

  if (score >= 50) {
    return {
      ...base,
      interpretation: 'Balanced',
      description: 'The profile is sitting in a balanced range, with usable support across the five pillars.',
      deltaLabel: normalizedDeltaLabel,
    };
  }

  if (score >= 35) {
    return {
      ...base,
      interpretation: 'Developing',
      deltaLabel: normalizedDeltaLabel,
    };
  }

  if (score >= 20) {
    return {
      ...base,
      interpretation: 'Limited',
      deltaLabel: normalizedDeltaLabel,
    };
  }

  return {
    ...base,
    interpretation: 'Very Low',
    deltaLabel: normalizedDeltaLabel,
  };
}

function getHomeEdgeSubscores(edgeScore: ArcAppDataSnapshot['edgeScore']) {
  const baseSubscores = buildNeutralMoverCards('edge-fallback', [
    'Hold Quality',
    'Motion Session Quality',
    'Peak Fullness',
  ]);

  if (!edgeScore.unlocked) {
    return baseSubscores;
  }

  const populatedSwings = edgeScore.recentImpactSwings.map(mapSwingToHomeMoverCard);
  return baseSubscores.map((fallback, index) => populatedSwings[index] ?? fallback);
}

function getHomeEdgePillarCards(edgeScore: ArcAppDataSnapshot['edgeScore']): HomeEdgePillarCard[] {
  const pillarScore = (value: number) => (edgeScore.unlocked ? Math.round(value) : null);

  return [
    {
      id: 'baseline',
      label: 'Baseline Readiness',
      displayLabel: 'Baseline',
      tone: foundationTheme.chart.baseline,
      score: pillarScore(edgeScore.baselineReadiness),
      weight: 10,
    },
    {
      id: 'erection',
      label: 'Erection Quality',
      displayLabel: 'Erection',
      tone: foundationTheme.text.highlight,
      score: pillarScore(edgeScore.erectionQuality),
      weight: 30,
    },
    {
      id: 'session',
      label: 'Session Performance',
      displayLabel: 'Session',
      tone: foundationTheme.accent.primary,
      score: pillarScore(edgeScore.sessionPerformance),
      weight: 25,
    },
    {
      id: 'overnight',
      label: 'Overnight Support',
      displayLabel: 'Overnight',
      tone: foundationTheme.chart.nocturnal,
      score: pillarScore(edgeScore.overnightSupport),
      weight: 15,
    },
    {
      id: 'consistency',
      label: 'Discipline & Diligence',
      displayLabel: 'Discipline',
      tone: foundationTheme.accent.secondary,
      score: pillarScore(edgeScore.consistencyReliability),
      weight: 20,
    },
  ];
}

function resolveFocusScoreContext(goal: ArcFoundationGoalState): FocusScoreContext {
  switch (goal.currentSectionId) {
    case 'wear':
      return 'streak';
    case 'baseline':
      return 'baseline';
    case 'sessions':
      return 'overall';
    case 'sessionType':
      return 'motion';
    case 'sessionQuality':
      return 'hold';
    case 'finish':
      return 'overall';
    default:
      break;
  }

  const goalText = `${goal.id} ${goal.label} ${goal.activeFocusLabel ?? ''}`.toLowerCase();

  if (goalText.includes('overnight') || goalText.includes('nocturnal')) {
    return 'overnight';
  }

  if (goalText.includes('baseline') || goalText.includes('resting')) {
    return 'baseline';
  }

  if (goalText.includes('peak')) {
    return 'peak';
  }

  if (goalText.includes('crest') || goalText.includes('streak') || goalText.includes('discipline')) {
    return 'streak';
  }

  if (goalText.includes('motion')) {
    return 'motion';
  }

  if (goalText.includes('recovery')) {
    return 'recovery';
  }

  if (goalText.includes('hold')) {
    return 'hold';
  }

  return 'overall';
}

function getFocusContextTone(context: FocusScoreContext) {
  switch (context) {
    case 'baseline':
      return foundationTheme.chart.baseline;
    case 'overnight':
      return foundationTheme.chart.nocturnal;
    case 'peak':
      return foundationTheme.chart.waking;
    case 'streak':
      return foundationTheme.accent.secondary;
    case 'motion':
      return foundationTheme.accent.primary;
    case 'recovery':
      return foundationTheme.chart.waking;
    case 'hold':
      return foundationTheme.text.highlight;
    case 'overall':
    default:
      return foundationTheme.accent.primary;
  }
}

function getFocusStateLabel(context: FocusScoreContext, score: number) {
  switch (context) {
    case 'baseline':
      if (score >= 84) return 'Anchored';
      if (score >= 68) return 'Forming';
      return 'Building';
    case 'peak':
      if (score >= 84) return 'Locked in';
      if (score >= 66) return 'Focused';
      return 'Building';
    case 'overnight':
      if (score >= 84) return 'Established';
      if (score >= 66) return 'Gathering';
      return 'Building';
    case 'streak':
      if (score >= 84) return 'Disciplined';
      if (score >= 66) return 'Steady';
      return 'Building';
    case 'motion':
      if (score >= 84) return 'Adaptive';
      if (score >= 66) return 'Responsive';
      return 'Building';
    case 'recovery':
      if (score >= 84) return 'Recovering';
      if (score >= 66) return 'Settling';
      return 'Building';
    case 'hold':
      if (score >= 84) return 'Stable';
      if (score >= 66) return 'Holding';
      return 'Building';
    case 'overall':
    default:
      if (score >= 84) return 'Goal aligned';
      if (score >= 66) return 'Focused';
      return 'Building';
  }
}

function getHomeFocusMovers(data: ArcAppDataSnapshot, context: FocusScoreContext) {
  const preset = FOCUS_MOVER_PRESETS[context];
  const rankedSwings = data.edgeScore.recentImpactCatalog ?? [];
  const relevantSwings = rankedSwings
    .filter(swing => preset.ids.includes(swing.id))
    .sort((left, right) => Math.abs(right.impact) - Math.abs(left.impact) || Math.abs(right.delta) - Math.abs(left.delta))
    .slice(0, 3)
    .map(mapSwingToHomeMoverCard);

  if (relevantSwings.length >= 3) {
    return relevantSwings;
  }

  const existingLabels = new Set(relevantSwings.map(swing => swing.label));
  const fallbackCards = preset.fallbackLabels
    .filter(label => !existingLabels.has(label))
    .map((label, index) => buildNeutralMoverCard(`focus-${context}-${index}`, label));

  return [...relevantSwings, ...fallbackCards].slice(0, 3);
}

function getHomeFocusScorePresentation(
  data: ArcAppDataSnapshot,
  goalState: ArcFoundationGoalState,
): HomeFocusScorePresentation {
  const context = resolveFocusScoreContext(goalState);
  const value = Math.round(Math.min(100, Math.max(0, goalState.completionPercent)));
  const supportLabel = goalState.currentTaskTitle ?? goalState.activeFocusLabel ?? goalState.label;

  return {
    value,
    progress: Math.min(1, Math.max(0, goalState.completionRatio)),
    stateLabel: goalState.foundationComplete ? 'Complete' : goalState.currentSectionTitle ?? getFocusStateLabel(context, value),
    supportLabel,
    context,
    tone: goalState.foundationComplete ? foundationTheme.text.highlight : getFocusContextTone(context),
    movers: getHomeFocusMovers(data, context),
  };
}

function parseEdgeMoverNumericValue(valueText: string) {
  const parsed = Number(valueText);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatEdgeMoverNumericValue(value: number) {
  return `${value > 0 ? '+' : ''}${Math.round(value)}`;
}

function EdgeMoverValue({
  valueText,
  direction,
}: {
  valueText: string;
  direction: HomeScoreMoverCard['direction'];
}) {
  const targetValue = parseEdgeMoverNumericValue(valueText);
  const animatedValueRef = useRef<number | null>(targetValue);
  const [displayValue, setDisplayValue] = useState<number | null>(targetValue);

  useEffect(() => {
    if (targetValue == null) {
      animatedValueRef.current = null;
      setDisplayValue(null);
      return undefined;
    }

    const startValue = animatedValueRef.current ?? targetValue;
    if (Math.round(startValue) === Math.round(targetValue)) {
      animatedValueRef.current = targetValue;
      setDisplayValue(targetValue);
      return undefined;
    }

    let frame = 0;
    const startedAt = performance.now();
    const duration = 640;

    const tick = (timestamp: number) => {
      const progress = Math.min(1, (timestamp - startedAt) / duration);
      const eased = 1 - (1 - progress) ** 3;
      const nextValue = startValue + (targetValue - startValue) * eased;
      animatedValueRef.current = nextValue;
      setDisplayValue(nextValue);

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
        return;
      }

      animatedValueRef.current = targetValue;
      setDisplayValue(targetValue);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [targetValue]);

  return (
    <div
      style={{
        ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
        color:
          direction === 'up'
            ? '#BCD7C3'
            : direction === 'down'
              ? '#DEBBB4'
              : hexToRgba(foundationTheme.text.highlight, 0.88),
        fontSize: '0.8rem',
        lineHeight: 1,
        fontWeight: 700,
        letterSpacing: '0.005em',
        fontVariantNumeric: 'tabular-nums',
        minWidth: '2.45rem',
      }}
      className="shrink-0 text-right"
      aria-label={valueText}
      title={valueText}
      role="text"
    >
      {targetValue == null ? valueText : formatEdgeMoverNumericValue(displayValue ?? targetValue)}
    </div>
  );
}

function EdgeMoverContent({ mover }: { mover: HomeScoreMoverCard }) {
  return (
    <div className="grid h-full grid-rows-[minmax(0,1fr)_auto] gap-[0.26rem]">
      <div
        style={{
          ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
          color: hexToRgba(foundationTheme.text.secondary, 0.84),
          fontSize: '0.485rem',
          fontWeight: 500,
          letterSpacing: '0.01em',
          lineHeight: 1.14,
          textTransform: 'none',
          whiteSpace: 'normal',
          wordBreak: 'normal',
          overflowWrap: 'normal',
        }}
        className="min-w-0"
        title={mover.label}
      >
        {mover.label}
      </div>
      <div className="flex w-full items-end justify-end">
        <EdgeMoverValue valueText={mover.valueText} direction={mover.direction} />
      </div>
    </div>
  );
}

function EdgeMoverSlot({
  mover,
  unlocked,
}: {
  mover: HomeScoreMoverCard;
  unlocked: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[14px] border px-[0.58rem] py-[0.46rem] transition-[opacity,color,background-color,border-color] duration-300"
      style={{
        opacity: unlocked ? 1 : 0.72,
        minHeight: '2.7rem',
        background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.026)} 0%, ${hexToRgba('#FFFFFF', 0.012)} 100%)`,
        borderColor: hexToRgba('#FFFFFF', 0.054),
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[40%]"
        style={{ background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.018)} 0%, transparent 100%)` }}
      />
      <div className="relative z-10 h-full w-full" style={{ transition: 'color 320ms ease' }}>
        <EdgeMoverContent mover={mover} />
      </div>
    </div>
  );
}

function EdgeMoverStack({
  movers,
  unlocked,
}: {
  movers: HomeScoreMoverCard[];
  unlocked: boolean;
}) {
  return (
    <div className="grid grid-cols-3 gap-1.55">
      {movers.map((mover, index) => (
        <EdgeMoverSlot
          key={`slot-${index}`}
          mover={mover}
          unlocked={unlocked}
        />
      ))}
    </div>
  );
}

function EdgePillarScoreSlot({
  pillar,
  unlocked,
  elevated = false,
}: {
  pillar: HomeEdgePillarCard;
  unlocked: boolean;
  elevated?: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[15px] border px-[0.42rem] py-[0.5rem] transition-[opacity,color,background-color,border-color] duration-300"
      style={{
        opacity: unlocked ? 1 : 0.76,
        minHeight: '3.52rem',
        background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', elevated ? 0.036 : 0.026)} 0%, ${hexToRgba('#FFFFFF', 0.012)} 100%)`,
        borderColor: hexToRgba('#FFFFFF', elevated ? 0.07 : 0.054),
        clipPath: 'polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)',
      }}
      title={pillar.label}
    >
      <div
        className="pointer-events-none absolute inset-x-[22%] top-0 h-[1px] rounded-full"
        style={{ background: `linear-gradient(90deg, transparent 0%, ${hexToRgba(pillar.tone, elevated ? 0.78 : 0.58)} 50%, transparent 100%)` }}
      />
      <div
        className="pointer-events-none absolute inset-x-[16%] top-[8%] h-[52%] rounded-[999px]"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${hexToRgba(pillar.tone, elevated ? 0.13 : 0.09)} 0%, transparent 72%)`,
        }}
      />
      <div className="relative z-10 flex h-full flex-col justify-between gap-[0.44rem]">
        <div className="flex items-start">
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
              color: hexToRgba(foundationTheme.text.secondary, elevated ? 0.88 : 0.82),
              fontSize: '0.39rem',
              fontWeight: 600,
              letterSpacing: '0.055em',
              lineHeight: 1.18,
              textTransform: 'uppercase',
              whiteSpace: 'normal',
              maxWidth: '100%',
            }}
          >
            {pillar.label}
          </div>
        </div>
        <div className="space-y-[0.24rem]">
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
              color: pillar.score == null ? hexToRgba(foundationTheme.text.highlight, 0.44) : hexToRgba(foundationTheme.text.highlight, 0.92),
              fontSize: '0.94rem',
              lineHeight: 0.95,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {pillar.score == null ? '--' : pillar.score}
          </div>
          <div
            className="h-[2.35px] overflow-hidden rounded-full"
            style={{ background: hexToRgba('#FFFFFF', 0.075) }}
          >
            <div
              className="h-full rounded-full transition-[width,background-color] duration-500"
              style={{
                width: pillar.score == null ? '18%' : `${Math.max(10, pillar.score)}%`,
                background: `linear-gradient(90deg, ${hexToRgba(pillar.tone, 0.76)} 0%, ${hexToRgba(pillar.tone, 0.34)} 100%)`,
                boxShadow: `0 0 ${elevated ? 10 : 8}px ${hexToRgba(pillar.tone, elevated ? 0.24 : 0.18)}`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function EdgePillarScoreStrip({
  pillars,
  unlocked,
}: {
  pillars: HomeEdgePillarCard[];
  unlocked: boolean;
}) {
  const sortedPillars = [...pillars].sort((left, right) => right.weight - left.weight);
  const topRow = sortedPillars.slice(0, 2);
  const baseRow = sortedPillars.slice(2);

  return (
    <div className="relative mx-auto w-full max-w-[27.1rem] pt-[0.24rem]">
      <div className="relative z-10 mt-[0.48rem] flex justify-center">
        <div className="grid gap-2.45" style={{ gridTemplateColumns: 'repeat(2, 7.28rem)' }}>
          {topRow.map(pillar => (
            <EdgePillarScoreSlot key={pillar.id} pillar={pillar} unlocked={unlocked} elevated />
          ))}
        </div>
      </div>
      <div className="pointer-events-none relative z-0 mx-auto mt-[0.32rem] h-[0.96rem] w-[75%]">
        <div
          className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2"
          style={{ background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.12)} 0%, transparent 100%)` }}
        />
      </div>
      <div
        className="relative z-10 mt-[0.4rem] grid justify-center gap-1.55"
        style={{ gridTemplateColumns: 'repeat(3, 7.28rem)' }}
      >
        {baseRow.map(pillar => (
          <EdgePillarScoreSlot key={pillar.id} pillar={pillar} unlocked={unlocked} />
        ))}
      </div>
    </div>
  );
}

function GoalScoreArc({
  value,
  progress,
  tone,
  size = 58,
  width,
  height,
  trackStroke = 2.7,
  activeStroke = 3.1,
  valueFontSize = '0.7rem',
  showPercentLabel = true,
}: {
  value: number;
  progress: number;
  tone: string;
  size?: number;
  width?: number;
  height?: number;
  trackStroke?: number;
  activeStroke?: number;
  valueFontSize?: string;
  showPercentLabel?: boolean;
}) {
  const normalizedProgress = Math.min(1, Math.max(0, progress));
  const railWidth = width ?? size;
  const railHeight = height ?? (size >= 100 ? Math.round(size * 0.84) : Math.round(size * 0.58));
  const isHeroRail = railHeight >= 84;
  const horizontalInset = Math.max(isHeroRail ? 9 : 8, size * (isHeroRail ? 0.075 : 0.12));
  const trackWidth = railWidth - horizontalInset * 2;
  const trackY = railHeight * (isHeroRail ? 0.81 : 0.74);
  const activeTrackWidth = Math.max(trackWidth * 0.06, trackWidth * normalizedProgress);
  const nodeX = horizontalInset + activeTrackWidth;
  const percentLabel = `${Math.round(value)}%`;

  const activeRailTone = HOME_SCORE_INDICATOR_CORE;
  const activeNodeTone = HOME_SCORE_INDICATOR_SOFT;
  const sharedGlow = HOME_SCORE_INDICATOR_GLOW;

  return (
    <div
      className="relative shrink-0"
      style={{ width: `${railWidth}px`, height: `${railHeight}px` }}
    >
      {isHeroRail ? (
        <div
          className="pointer-events-none absolute inset-x-[10%] top-[14%] h-[40%] rounded-[999px]"
          style={{
            background: `radial-gradient(circle at 50% 52%, ${hexToRgba(sharedGlow, isHeroRail ? 0.18 : 0.12)} 0%, ${hexToRgba('#FFFFFF', 0.02)} 36%, transparent 78%)`,
          }}
        />
      ) : null}
      <svg width={railWidth} height={railHeight} viewBox={`0 0 ${railWidth} ${railHeight}`}>
        <line
          x1={horizontalInset}
          y1={trackY}
          x2={railWidth - horizontalInset}
          y2={trackY}
          stroke={hexToRgba('#EEE5D8', 0.16)}
          strokeWidth={trackStroke}
          strokeLinecap="round"
        />
        <line
          x1={horizontalInset}
          y1={trackY - trackStroke * 0.42}
          x2={railWidth - horizontalInset}
          y2={trackY - trackStroke * 0.42}
          stroke={hexToRgba('#FFFFFF', 0.045)}
          strokeWidth={Math.max(0.9, trackStroke * 0.28)}
          strokeLinecap="round"
        />
        <line
          x1={horizontalInset}
          y1={trackY}
          x2={nodeX}
          y2={trackY}
          stroke={hexToRgba(activeRailTone, 0.96)}
          strokeWidth={activeStroke}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 ${Math.max(5, size * 0.05)}px ${hexToRgba(sharedGlow, isHeroRail ? 0.32 : 0.24)})`,
            transition: 'x2 420ms ease, stroke 320ms ease',
          }}
        />
        <circle
          cx={nodeX}
          cy={trackY}
          r={Math.max(isHeroRail ? 3.2 : 2.4, activeStroke * (isHeroRail ? 0.76 : 0.68))}
          fill={hexToRgba(activeNodeTone, 0.94)}
          style={{
            filter: `drop-shadow(0 0 ${Math.max(5, size * (isHeroRail ? 0.05 : 0.055))}px ${hexToRgba(sharedGlow, isHeroRail ? 0.34 : 0.26)})`,
            transition: 'cx 420ms ease, fill 320ms ease',
          }}
        />
      </svg>
      {showPercentLabel ? (
        <div
          className="pointer-events-none absolute"
          style={{
            left: `${horizontalInset}px`,
            width: `${trackWidth}px`,
            top: `${Math.max(0, trackY - (isHeroRail ? railHeight * 0.58 : railHeight * 0.54))}px`,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              ...getArcTypographyStyle(foundationTheme, 'caption'),
              color: hexToRgba(foundationTheme.text.highlight, 0.9),
              fontSize: valueFontSize,
              fontWeight: 600,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
              textAlign: 'right',
            }}
          >
            {percentLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
}

function EdgeCardShapeEditorOverlay({
  points,
  selectedPointIndex,
  onPointsChange,
  onSelectedPointChange,
}: Omit<HomeEdgeCardShapeEditor, 'enabled'>) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const latestPointsRef = useRef(points);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  useEffect(() => {
    latestPointsRef.current = points;
  }, [points]);

  const updatePointFromClientPosition = (clientX: number, clientY: number, pointIndex: number) => {
    const overlayBounds = overlayRef.current?.getBoundingClientRect();
    if (!overlayBounds || overlayBounds.width <= 0 || overlayBounds.height <= 0) {
      return;
    }

    const nextX = Math.min(100, Math.max(0, ((clientX - overlayBounds.left) / overlayBounds.width) * 100));
    const nextY = Math.min(100, Math.max(0, ((clientY - overlayBounds.top) / overlayBounds.height) * 100));

    onPointsChange(
      latestPointsRef.current.map((point, index) =>
        index === pointIndex
          ? {
              x: nextX,
              y: nextY,
            }
          : point,
      ),
    );
  };

  useEffect(() => {
    if (draggingIndex == null) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      updatePointFromClientPosition(event.clientX, event.clientY, draggingIndex);
    };

    const handlePointerUp = () => {
      setDraggingIndex(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingIndex]);

  const handleOverlayDoubleClick = (event: any) => {
    const overlayBounds = overlayRef.current?.getBoundingClientRect();
    if (!overlayBounds) {
      return;
    }

    const nextX = Math.min(100, Math.max(0, ((event.clientX - overlayBounds.left) / overlayBounds.width) * 100));
    const nextY = Math.min(100, Math.max(0, ((event.clientY - overlayBounds.top) / overlayBounds.height) * 100));
    const nextPoints = insertCardShapePointAtNearestEdge(latestPointsRef.current, { x: nextX, y: nextY });
    const insertedIndex = nextPoints.findIndex(
      point => Math.abs(point.x - nextX) < 0.01 && Math.abs(point.y - nextY) < 0.01,
    );

    onPointsChange(nextPoints);
    onSelectedPointChange(insertedIndex >= 0 ? insertedIndex : null);
  };

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 z-30 select-none"
      onDoubleClick={handleOverlayDoubleClick}
      style={{
        borderRadius: 'inherit',
        background: `linear-gradient(180deg, ${hexToRgba('#0A0F16', 0.08)} 0%, ${hexToRgba('#0A0F16', 0.02)} 100%)`,
      }}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polygon
          points={points.map(point => `${point.x},${point.y}`).join(' ')}
          fill={hexToRgba(foundationTheme.accent.primary, 0.045)}
          stroke={hexToRgba('#FFFFFF', 0.28)}
          strokeWidth="0.7"
          strokeDasharray="2.2 1.8"
          vectorEffect="non-scaling-stroke"
        />
        {points.map((point, index) => {
          const isSelected = selectedPointIndex === index;
          return (
            <circle
              key={`${point.x.toFixed(2)}-${point.y.toFixed(2)}-${index}`}
              cx={point.x}
              cy={point.y}
              r={isSelected ? 2.4 : 1.9}
              fill={isSelected ? foundationTheme.text.highlight : hexToRgba('#0B1117', 0.92)}
              stroke={hexToRgba('#FFFFFF', isSelected ? 0.82 : 0.54)}
              strokeWidth="0.8"
              vectorEffect="non-scaling-stroke"
              style={{ cursor: draggingIndex === index ? 'grabbing' : 'grab' }}
              onPointerDown={event => {
                event.preventDefault();
                event.stopPropagation();
                onSelectedPointChange(index);
                setDraggingIndex(index);
                updatePointFromClientPosition(event.clientX, event.clientY, index);
              }}
              onDoubleClick={event => {
                event.preventDefault();
                event.stopPropagation();
                const nextPoints = removeCardShapePointAtIndex(latestPointsRef.current, index);
                const nextSelectedIndex =
                  nextPoints.length === latestPointsRef.current.length ? index : Math.min(index, nextPoints.length - 1);
                onPointsChange(nextPoints);
                onSelectedPointChange(nextSelectedIndex >= 0 ? nextSelectedIndex : null);
              }}
            />
          );
        })}
      </svg>
      <div
        className="pointer-events-none absolute right-3 top-3 rounded-full border px-2 py-1"
        style={{
          ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
          background: hexToRgba('#0B1117', 0.72),
          borderColor: hexToRgba('#FFFFFF', 0.08),
          color: hexToRgba('#FFFFFF', 0.72),
          letterSpacing: '0.08em',
        }}
      >
        SHAPE CUTTER
      </div>
    </div>
  );
}

function EdgeCardMoveEditorOverlay({
  rootRef,
  titleRef,
  gaugeRef,
  pillarsRef,
  layout,
  onLayoutChange,
}: {
  rootRef: React.RefObject<HTMLDivElement | null>;
  titleRef: React.RefObject<HTMLDivElement | null>;
  gaugeRef: React.RefObject<HTMLDivElement | null>;
  pillarsRef: React.RefObject<HTMLDivElement | null>;
  layout: ArcEdgeCardLayout;
  onLayoutChange: (layout: ArcEdgeCardLayout) => void;
}) {
  const [draggingId, setDraggingId] = useState<ArcEdgeCardMoveItemId | null>(null);
  const [boxes, setBoxes] = useState<Record<ArcEdgeCardMoveItemId, { left: number; top: number; width: number; height: number }>>({
    title: { left: 0, top: 0, width: 0, height: 0 },
    gauge: { left: 0, top: 0, width: 0, height: 0 },
    pillars: { left: 0, top: 0, width: 0, height: 0 },
  });
  const dragStateRef = useRef<{
    id: ArcEdgeCardMoveItemId;
    originX: number;
    originY: number;
    baseX: number;
    baseY: number;
  } | null>(null);

  const measureBoxes = () => {
    const rootBounds = rootRef.current?.getBoundingClientRect();
    if (!rootBounds) {
      return;
    }

    const nextBoxes = {
      title: titleRef.current?.getBoundingClientRect(),
      gauge: gaugeRef.current?.getBoundingClientRect(),
      pillars: pillarsRef.current?.getBoundingClientRect(),
    };

    setBoxes({
      title: nextBoxes.title
        ? {
            left: nextBoxes.title.left - rootBounds.left,
            top: nextBoxes.title.top - rootBounds.top,
            width: nextBoxes.title.width,
            height: nextBoxes.title.height,
          }
        : boxes.title,
      gauge: nextBoxes.gauge
        ? {
            left: nextBoxes.gauge.left - rootBounds.left,
            top: nextBoxes.gauge.top - rootBounds.top,
            width: nextBoxes.gauge.width,
            height: nextBoxes.gauge.height,
          }
        : boxes.gauge,
      pillars: nextBoxes.pillars
        ? {
            left: nextBoxes.pillars.left - rootBounds.left,
            top: nextBoxes.pillars.top - rootBounds.top,
            width: nextBoxes.pillars.width,
            height: nextBoxes.pillars.height,
          }
        : boxes.pillars,
    });
  };

  useEffect(() => {
    const animationId = window.requestAnimationFrame(measureBoxes);
    return () => window.cancelAnimationFrame(animationId);
  }, [layout.title.x, layout.title.y, layout.gauge.x, layout.gauge.y, layout.pillars.x, layout.pillars.y]);

  useEffect(() => {
    const handleResize = () => {
      measureBoxes();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!draggingId) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const dragState = dragStateRef.current;
      const rootBounds = rootRef.current?.getBoundingClientRect();
      if (!dragState || !rootBounds) {
        return;
      }

      const xLimit = Math.max(56, rootBounds.width * 0.34);
      const yLimit = Math.max(56, rootBounds.height * 0.34);
      const nextX = Math.min(xLimit, Math.max(-xLimit, dragState.baseX + (event.clientX - dragState.originX)));
      const nextY = Math.min(yLimit, Math.max(-yLimit, dragState.baseY + (event.clientY - dragState.originY)));

      onLayoutChange({
        ...layout,
        [dragState.id]: {
          x: nextX,
          y: nextY,
        },
      });
    };

    const handlePointerUp = () => {
      dragStateRef.current = null;
      setDraggingId(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingId, layout, onLayoutChange, rootRef]);

  const targets: Array<{
    id: ArcEdgeCardMoveItemId;
    label: string;
    tone: string;
    box: { left: number; top: number; width: number; height: number };
  }> = [
    { id: 'title', label: 'TEXT', tone: foundationTheme.text.secondary, box: boxes.title },
    { id: 'gauge', label: 'SCORE', tone: foundationTheme.accent.primary, box: boxes.gauge },
    { id: 'pillars', label: 'PILLARS', tone: foundationTheme.accent.secondary, box: boxes.pillars },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-30 select-none">
      {targets.map(target => {
        if (target.box.width <= 0 || target.box.height <= 0) {
          return null;
        }

        const isDragging = draggingId === target.id;
        return (
          <div
            key={target.id}
            className="pointer-events-auto absolute rounded-[18px] border"
            style={{
              left: `${target.box.left - 4}px`,
              top: `${target.box.top - 4}px`,
              width: `${target.box.width + 8}px`,
              height: `${target.box.height + 8}px`,
              borderColor: hexToRgba('#FFFFFF', isDragging ? 0.48 : 0.22),
              background: `linear-gradient(180deg, ${hexToRgba('#0A1017', isDragging ? 0.14 : 0.08)} 0%, ${hexToRgba('#0A1017', isDragging ? 0.04 : 0.015)} 100%)`,
              boxShadow: `inset 0 0 0 1px ${hexToRgba(target.tone, isDragging ? 0.18 : 0.1)}`,
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onPointerDown={event => {
              event.preventDefault();
              event.stopPropagation();
              dragStateRef.current = {
                id: target.id,
                originX: event.clientX,
                originY: event.clientY,
                baseX: layout[target.id].x,
                baseY: layout[target.id].y,
              };
              setDraggingId(target.id);
            }}
          >
            <div
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border px-2 py-0.5"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                background: hexToRgba('#091018', 0.88),
                borderColor: hexToRgba('#FFFFFF', isDragging ? 0.2 : 0.08),
                color: hexToRgba('#FFFFFF', 0.82),
                letterSpacing: '0.08em',
              }}
            >
              {target.label}
            </div>
          </div>
        );
      })}
      <div
        className="pointer-events-none absolute right-3 top-3 rounded-full border px-2 py-1"
        style={{
          ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
          background: hexToRgba('#0B1117', 0.72),
          borderColor: hexToRgba('#FFFFFF', 0.08),
          color: hexToRgba('#FFFFFF', 0.72),
          letterSpacing: '0.08em',
        }}
      >
        MOVE TOOL
      </div>
    </div>
  );
}

function GoalCompletionCard({
  value,
  progress,
  tone,
  stateLabel,
  supportLabel,
}: {
  value: number;
  progress: number;
  tone: string;
  stateLabel: string;
  supportLabel: string;
}) {
  return (
    <div
      className="w-full rounded-[24px] border px-4 py-[0.88rem] text-left"
      style={{
        ...getArcGlassSurfaceStyle(foundationTheme, 'light', {
          tint: tone,
          tintStrength: 0.02,
        }),
        borderColor: hexToRgba('#FFFFFF', 0.06),
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'label'),
              color: hexToRgba('#FFFFFF', 0.42),
              fontSize: '0.32rem',
              fontWeight: 600,
              letterSpacing: '0.085em',
              whiteSpace: 'nowrap',
            }}
          >
            GOAL COMPLETION
          </div>
          <div
            className="mt-[0.22rem]"
            style={{
                ...getArcTypographyStyle(foundationTheme, 'caption'),
                color: hexToRgba(foundationTheme.text.secondary, 0.78),
                fontSize: '0.58rem',
                lineHeight: 1,
              }}
            >
            {stateLabel}
          </div>
        </div>
        <div
          style={{
            ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
            color: hexToRgba(foundationTheme.text.highlight, 0.9),
            fontSize: '0.96rem',
            fontWeight: 600,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
        >
          {Math.round(value)}%
        </div>
      </div>
      <GoalScoreArc
        value={value}
        progress={progress}
        tone={tone}
        width={292}
        height={36}
        trackStroke={2.1}
        activeStroke={2.45}
        valueFontSize="0.64rem"
        showPercentLabel={false}
      />
      <div
        className="mt-[0.3rem] truncate"
        title={supportLabel}
        style={{
          ...getArcTypographyStyle(foundationTheme, 'caption'),
          color: hexToRgba(foundationTheme.text.secondary, 0.72),
          fontSize: '0.56rem',
          lineHeight: 1.1,
        }}
      >
        {supportLabel}
      </div>
    </div>
  );
}

function EdgeScoreGauge({
  progress,
  valueText,
  tone,
  locked = false,
  mirrored = false,
  size = 140,
  profile = 'edge',
}: {
  progress: number;
  valueText: string;
  tone: string;
  locked?: boolean;
  mirrored?: boolean;
  size?: number;
  profile?: 'edge' | 'focus';
}) {
  const gaugeId = useId().replace(/:/g, '');
  const normalizedProgress = Math.min(1, Math.max(0, progress));
  const scale = size / 140;
  const isFocusProfile = profile === 'focus';
  const center = size / 2;
  const arcGradientId = `${gaugeId}-edge-arc-gradient`;
  const radius = (isFocusProfile ? 39 : 47) * scale;
  const trackStroke = (locked ? 4.2 : isFocusProfile ? 4.4 : 5.1) * scale;
  const activeStroke = trackStroke;
  const arcStart = 200;
  const arcSweep = 320;
  const circumference = 2 * Math.PI * radius;
  const trackLength = (arcSweep / 360) * circumference;
  const activeLength = Math.max(trackLength * (locked ? 0.08 : 0.12), trackLength * normalizedProgress);
  const scoreTextColor = locked ? '#CFC4B7' : '#F1E6D8';
  const transitionDuration = locked ? 560 : isFocusProfile ? 430 : 760;
  const transitionCurve = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const rotation = `rotate(${arcStart - 90} ${center} ${center})`;

  return (
    <div className="relative flex items-center justify-center" style={{ width: `${size}px`, height: `${size}px` }}>
      <div
        className="pointer-events-none absolute inset-[16%] rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 44%, ${hexToRgba(tone, locked ? 0.015 : 0.03)} 0%, transparent 72%)`,
        }}
      />
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          transform: mirrored ? 'scaleX(-1)' : undefined,
          transformOrigin: 'center',
        }}
      >
        <defs>
          <linearGradient id={arcGradientId} x1="18%" y1="18%" x2="82%" y2="18%">
            <stop offset="0%" stopColor={hexToRgba('#FFFFFF', locked ? 0.42 : 0.68)} />
            <stop offset="52%" stopColor={hexToRgba(tone, locked ? 0.46 : isFocusProfile ? 0.72 : 0.84)} />
            <stop offset="100%" stopColor={hexToRgba(tone, locked ? 0.28 : 0.48)} />
          </linearGradient>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={hexToRgba('#FFFFFF', locked ? 0.11 : 0.14)}
          strokeWidth={trackStroke}
          strokeLinecap="round"
          strokeDasharray={`${trackLength} ${circumference}`}
          transform={rotation}
          style={{
            transition: `stroke-dasharray ${transitionDuration}ms ${transitionCurve}, transform ${transitionDuration}ms ${transitionCurve}`,
          }}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${arcGradientId})`}
          strokeWidth={activeStroke}
          strokeLinecap="round"
          strokeDasharray={`${activeLength} ${circumference}`}
          transform={rotation}
          style={{
            transition: `stroke-dasharray ${transitionDuration}ms ${transitionCurve}, transform ${transitionDuration}ms ${transitionCurve}`,
            filter: `drop-shadow(0 0 ${Math.max(4, size * 0.022)}px ${hexToRgba(tone, locked ? 0.14 : 0.22)})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          {locked ? (
            <div
              className="mb-1 flex h-5.5 w-5.5 items-center justify-center rounded-full border"
              style={{
                borderColor: hexToRgba(scoreTextColor, 0.18),
                background: hexToRgba(scoreTextColor, 0.035),
              }}
            >
              <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke={hexToRgba(scoreTextColor, 0.8)} strokeWidth="1.9">
                <path d="M7.5 11V8.8a4.5 4.5 0 119 0V11" strokeLinecap="round" />
                <rect x="5.6" y="11" width="12.8" height="9" rx="2.4" />
              </svg>
            </div>
          ) : null}
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'heroValue'),
              color: scoreTextColor,
              fontSize: `${(locked ? 2.18 : 2.88) * scale}rem`,
              lineHeight: 0.9,
              letterSpacing: locked ? '-0.04em' : '-0.06em',
              fontWeight: 700,
              transform: 'translateY(-0.5px)',
            }}
          >
            {valueText}
          </div>
        </div>
      </div>
    </div>
  );
}

function EdgeScoreArc({
  progress,
  valueText,
  tone,
}: {
  progress: number;
  valueText: string;
  tone: string;
}) {
  const normalizedProgress = Math.min(1, Math.max(0, progress));
  const size = 112;
  const center = size / 2;
  const radius = 40;
  const strokeWidth = 4.25;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - circumference * normalizedProgress;
  const gradientId = 'edge-summary-gradient';

  return (
    <div className="relative flex items-center justify-center" style={{ width: `${size}px`, height: `${size}px` }}>
      <div
        className="absolute inset-[18%] rounded-full blur-xl"
        style={{ background: hexToRgba(tone, 0.04) }}
      />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradientId} x1="10%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor={hexToRgba('#FFFFFF', 0.7)} />
            <stop offset="20%" stopColor={hexToRgba(tone, 0.92)} />
            <stop offset="100%" stopColor={hexToRgba(tone, 0.28)} />
          </linearGradient>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={radius + 8}
          fill="none"
          stroke={hexToRgba('#FFFFFF', 0.022)}
          strokeWidth="1"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={hexToRgba('#FFFFFF', 0.055)}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-100 ${center} ${center})`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          style={{
            ...getArcTypographyStyle(foundationTheme, 'heroValue'),
            color: foundationTheme.text.highlight,
            fontSize: '2.35rem',
            lineHeight: 0.94,
            letterSpacing: '-0.055em',
          }}
        >
          {valueText}
        </div>
      </div>
    </div>
  );
}

function ProgressRing({
  progress,
  label,
  compact = false,
  valueText,
  strokeColor,
}: {
  progress: number;
  label: string;
  compact?: boolean;
  valueText?: string;
  strokeColor?: string;
}) {
  const normalized = Math.round(progress * 100);
  const size = compact ? 88 : 104;
  const center = size / 2;
  const radius = compact ? 31 : 37;
  const strokeWidth = compact ? 6 : 7;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - circumference * progress;
  const resolvedStrokeColor = strokeColor ?? foundationTheme.accent.primary;

  return (
    <div
      className="relative flex items-center justify-center transition-all duration-300"
      style={{ height: `${size}px`, width: `${size}px` }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke={foundationTheme.chart.grid} strokeWidth={strokeWidth} />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={resolvedStrokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div
          style={{
            ...getArcTypographyStyle(foundationTheme, 'heroValue'),
            color: foundationTheme.text.highlight,
            fontSize: compact ? '1.15rem' : '1.4rem',
          }}
        >
          {valueText ?? `${normalized}%`}
        </div>
        <div
          style={{
            ...getArcTypographyStyle(foundationTheme, 'caption'),
            color: foundationTheme.text.muted,
            fontSize: compact ? '0.62rem' : undefined,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

function WearStreakGlyph({ streakDays: _streakDays }: { streakDays: number }) {
  const progress = Math.min(Math.max(_streakDays / 30, 0), 1);
  const seamOpacity = 0.34 + progress * 0.42;
  const seamPeakOpacity = Math.min(seamOpacity + 0.18 + progress * 0.14, 1);
  const seamBlur = 1.2 + progress * 1.55;
  const radianceOpacity = 0.24 + progress * 0.38;
  const blendHexColor = (from: string, to: string, amount: number) => {
    const normalized = Math.min(Math.max(amount, 0), 1);
    const fromInt = Number.parseInt(from.slice(1), 16);
    const toInt = Number.parseInt(to.slice(1), 16);
    const fromRgb = {
      r: (fromInt >> 16) & 255,
      g: (fromInt >> 8) & 255,
      b: fromInt & 255,
    };
    const toRgb = {
      r: (toInt >> 16) & 255,
      g: (toInt >> 8) & 255,
      b: toInt & 255,
    };

    return `rgb(${Math.round(fromRgb.r + (toRgb.r - fromRgb.r) * normalized)} ${Math.round(
      fromRgb.g + (toRgb.g - fromRgb.g) * normalized,
    )} ${Math.round(fromRgb.b + (toRgb.b - fromRgb.b) * normalized)})`;
  };
  const outerStrokeColor = blendHexColor('#FFFFFF', '#6C080C', progress);
  const innerStrokeColor = blendHexColor('#E9E2DE', '#9C1116', progress);

  return (
    <div className="flex h-7 w-4.5 items-center justify-center overflow-visible">
      <svg className="h-7 w-4.5 overflow-visible" viewBox="0 0 18 34" fill="none" aria-hidden="true" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="wear-streak-monolith-seam" x1="9" y1="2.6" x2="9" y2="31.4" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={hexToRgba('#8C0E12', seamOpacity * 0.74)} />
            <stop offset="45%" stopColor={hexToRgba('#B81419', seamOpacity)} />
            <stop offset="100%" stopColor={hexToRgba('#7A0A0E', seamOpacity * 0.78)} />
          </linearGradient>
          <radialGradient id="wear-streak-monolith-core" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor={hexToRgba('#4F0507', seamOpacity * 1.15)} />
            <stop offset="24%" stopColor={hexToRgba('#7A0C10', seamOpacity * 1.02)} />
            <stop offset="48%" stopColor={hexToRgba('#B3181E', seamOpacity * 0.7)} />
            <stop offset="82%" stopColor={hexToRgba('#E04133', seamOpacity * 0.2)} />
            <stop offset="100%" stopColor={hexToRgba('#FFFFFF', 0)} />
          </radialGradient>
          <linearGradient id="wear-streak-monolith-flame" x1="9" y1="1.8" x2="9" y2="32.2" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={hexToRgba('#951015', radianceOpacity * 0.5)} />
            <stop offset="24%" stopColor={hexToRgba('#C3161D', radianceOpacity * 1.02)} />
            <stop offset="56%" stopColor={hexToRgba('#A21118', radianceOpacity * 0.94)} />
            <stop offset="76%" stopColor={hexToRgba('#6F090D', radianceOpacity * 0.56)} />
            <stop offset="100%" stopColor={hexToRgba('#4A0508', 0)} />
          </linearGradient>
          <clipPath id="wear-streak-monolith-core-clip">
            <path d="M9 2.7L7.68 16.9L9 31.3L10.32 16.9L9 2.7Z" />
          </clipPath>
          <filter id="wear-streak-monolith-glow" x="-110%" y="-34%" width="320%" height="190%">
            <feGaussianBlur stdDeviation={String(seamBlur)} />
          </filter>
          <filter id="wear-streak-monolith-radiance-blur" x="-360%" y="-150%" width="820%" height="400%">
            <feGaussianBlur stdDeviation={String(seamBlur * 3.2)} />
          </filter>
        </defs>
        <path
          d="M8.95 2.2L5.15 16.9L8.95 31.8"
          stroke={outerStrokeColor}
          strokeWidth="1.05"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M9.05 2.2L12.85 16.9L9.05 31.8"
          stroke={outerStrokeColor}
          strokeWidth="1.05"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M8.95 2.2L7.55 16.9L8.95 31.8"
          stroke={innerStrokeColor}
          strokeWidth="0.9"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M9.05 2.2L10.45 16.9L9.05 31.8"
          stroke={innerStrokeColor}
          strokeWidth="0.9"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <g
          style={
            {
              ['--streak-seam-opacity' as string]: seamOpacity.toFixed(3),
              ['--streak-seam-peak-opacity' as string]: seamPeakOpacity.toFixed(3),
              animation: 'nexhub-streak-seam-breathe 4s ease-in-out infinite',
            } as any
          }
        >
          <path
            d="M9 -5.4C12.55 1.28 14.38 8.56 13.98 16.4C13.66 23.46 12 30.64 9 40.4C6 30.64 4.34 23.46 4.02 16.4C3.62 8.56 5.45 1.28 9 -5.4Z"
            fill="url(#wear-streak-monolith-flame)"
            filter="url(#wear-streak-monolith-radiance-blur)"
            opacity={0.78}
          />
          <path
            d="M9 -2.6C12.02 3.22 13.58 9.52 13.24 16.26C12.97 22.52 11.53 28.98 9 37.8C6.47 28.98 5.03 22.52 4.76 16.26C4.42 9.52 5.98 3.22 9 -2.6Z"
            fill="url(#wear-streak-monolith-flame)"
            filter="url(#wear-streak-monolith-radiance-blur)"
          />
          <g clipPath="url(#wear-streak-monolith-core-clip)">
            <path
              d="M9 3.7C9.9 7.1 10.32 11.44 10.14 16.86C10.01 20.96 9.64 25.28 9 29.9C8.36 25.28 7.99 20.96 7.86 16.86C7.68 11.44 8.1 7.1 9 3.7Z"
              fill="url(#wear-streak-monolith-core)"
              filter="url(#wear-streak-monolith-glow)"
            />
          </g>
          <path
            d="M9 2.9L8.46 16.9L9 31.1L9.54 16.9L9 2.9Z"
            fill="url(#wear-streak-monolith-seam)"
          />
          <path
            d="M9 4.1V29.7"
            stroke={hexToRgba('#F3C2BD', seamOpacity * 0.92)}
            strokeWidth="0.82"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}

function WearStreakPill({ streakDays }: { streakDays: number }) {
  return (
    <div className="flex h-7 items-center gap-1.5">
      <WearStreakGlyph streakDays={streakDays} />
      <span
        className="flex items-center"
        style={{
          ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
          color: foundationTheme.text.primary,
          fontSize: '0.62rem',
          lineHeight: 1,
        }}
      >
        {streakDays}
      </span>
    </div>
  );
}

function HeaderWearStreakIndicator({
  streakDays,
  onPanelHover,
}: {
  streakDays: number;
  onPanelHover?: (panel: ArcPanel | null) => void;
}) {
  return (
    <div
      className="flex h-full items-center justify-center px-[0.08rem] py-[0.04rem]"
      onMouseEnter={() => onPanelHover?.('momentum')}
      onMouseLeave={() => onPanelHover?.(null)}
      aria-label={`${streakDays} day wear streak`}
    >
      <WearStreakPill streakDays={streakDays} />
    </div>
  );
}

function PulseMailboxButton({
  onNavigate,
  onPanelHover,
}: {
  onNavigate: (screen: `session-detail:${string}` | 'account-status' | 'current-goal' | 'edgescore-details' | 'live-detail' | 'trend-detail' | 'resting' | 'build' | 'active' | 'recovery' | 'motion' | 'nocturnal' | 'sessions' | 'insignia-inventory' | 'pulse-mailbox' | 'battery') => void;
  onPanelHover?: (panel: ArcPanel | null) => void;
}) {
  const { recentPulseHistory } = usePulse();
  const latestPulse = recentPulseHistory[0] ?? null;
  const unreadCount = useMemo(
    () => recentPulseHistory.reduce((count, pulse) => count + (pulse.isRead ? 0 : 1), 0),
    [recentPulseHistory],
  );
  const palette = latestPulse ? getPulsePalette(latestPulse) : null;
  const accent = palette?.accent ?? foundationTheme.text.highlight;

  return (
    <button
      type="button"
      className="group relative flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
      onClick={() => onNavigate('pulse-mailbox')}
      onMouseEnter={() => onPanelHover?.('pulse')}
      onMouseLeave={() => onPanelHover?.(null)}
      aria-label={unreadCount > 0 ? `${unreadCount} unread pulse messages` : 'Open Pulse mailbox'}
      title={unreadCount > 0 ? `${unreadCount} unread pulse messages` : 'Pulse mailbox'}
      style={{
        background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.038)} 0%, ${hexToRgba('#FFFFFF', 0.014)} 100%)`,
        border: `1px solid ${hexToRgba('#FFFFFF', 0.06)}`,
        boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.045)}, 0 0 0 1px ${hexToRgba('#000000', 0.04)}`,
        backdropFilter: 'blur(10px)',
      }}
    >
      {unreadCount > 0 ? (
        <div
          className="pointer-events-none absolute inset-[-4px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${hexToRgba(accent, 0.18)} 0%, transparent 68%)`,
            animation: 'nexhub-pulse-mailbox-halo 3.1s ease-in-out infinite',
          }}
        />
      ) : null}
      <div
        className="relative z-[1] flex h-[1.05rem] w-[1.05rem] items-center justify-center rounded-full"
        style={{
          color: unreadCount > 0 ? accent : hexToRgba(foundationTheme.text.secondary, 0.78),
          animation: unreadCount > 0 ? 'nexhub-pulse-mailbox-breathe 2.6s ease-in-out infinite' : 'none',
        }}
      >
        <PulseGlyph
          iconType={latestPulse?.iconType ?? 'ring'}
          color={unreadCount > 0 ? accent : hexToRgba(foundationTheme.text.secondary, 0.74)}
          className="h-[0.86rem] w-[0.86rem]"
        />
      </div>
      {unreadCount > 0 ? (
        <span
          className="absolute -right-0.5 -top-0.5 h-[0.42rem] w-[0.42rem] rounded-full"
          style={{
            background: accent,
            boxShadow: `0 0 6px ${hexToRgba(accent, 0.45)}`,
          }}
        />
      ) : null}
    </button>
  );
}

function DeviceBatteryMicroIndicator({
  level: _level,
}: {
  level: number;
}) {
  return (
    <div className="relative flex h-7 w-7 items-center justify-center">
      <img
        src={HEADER_BATTERY_INDICATOR_ASSET}
        alt=""
        aria-hidden="true"
        className="pointer-events-none h-[182%] w-[182%] max-w-none object-contain"
        style={{
          mixBlendMode: 'screen',
          opacity: 0.95,
          filter: 'contrast(1.08) brightness(1.02)',
          objectPosition: 'center center',
        }}
      />
    </div>
  );
}

function HeaderMicroUtilityPill({
  batteryLevel,
  onNavigate,
  onPanelHover,
}: {
  batteryLevel: number;
  onNavigate: (screen: `session-detail:${string}` | 'account-status' | 'current-goal' | 'edgescore-details' | 'live-detail' | 'trend-detail' | 'resting' | 'build' | 'active' | 'recovery' | 'motion' | 'nocturnal' | 'sessions' | 'insignia-inventory' | 'pulse-mailbox' | 'battery') => void;
  onPanelHover?: (panel: ArcPanel | null) => void;
}) {
  return (
    <div
      className="absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-[91%] items-center gap-[0.72rem] rounded-full border px-[0.9rem] py-[0.42rem]"
      style={{
        ...getArcGlassSurfaceStyle(foundationTheme, 'light', {
          tint: '#D7E1EF',
          tintStrength: 0.014,
        }),
        borderColor: hexToRgba('#FFFFFF', 0.07),
        boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.045)}, 0 8px 26px ${hexToRgba('#000000', 0.18)}`,
        backdropFilter: 'blur(14px)',
        borderBottomColor: 'transparent',
      }}
    >
      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center px-0.5 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
        aria-label={`Open battery details, device battery ${batteryLevel}%`}
        title="Battery details"
        onClick={() => onNavigate('battery')}
        onMouseEnter={() => onPanelHover?.('battery')}
        onMouseLeave={() => onPanelHover?.(null)}
      >
        <DeviceBatteryMicroIndicator level={batteryLevel} />
      </button>

      <div className="h-3.5 w-px rounded-full" style={{ background: hexToRgba('#FFFFFF', 0.08) }} />

      <PulseMailboxButton onNavigate={onNavigate} onPanelHover={onPanelHover} />
    </div>
  );
}

function LivingInsigniaButton({
  tier,
  progress,
  onClick,
  onPanelHover,
}: {
  tier: ArcAppDataSnapshot['userProfile']['tier'];
  progress: number;
  onClick: () => void;
  onPanelHover?: (panel: ArcPanel | null) => void;
}) {
  const isRawEmberTier = isEmberSigilTier(tier);
  const insigniaSize = isRawEmberTier ? 66 : 35;

  return (
    <button
      type="button"
      className="group relative cursor-pointer transition-transform duration-300 hover:scale-[1.03] active:scale-[0.99]"
      onClick={onClick}
      onMouseEnter={() => onPanelHover?.('insignia')}
      onMouseLeave={() => onPanelHover?.(null)}
      aria-label="Open insignia inventory"
    >
      {isRawEmberTier ? null : (
        <div
          className="pointer-events-none absolute -inset-0.5 rounded-full blur-lg"
          style={{
            background: `radial-gradient(circle, ${hexToRgba(foundationTheme.accent.primary, 0.06)} 0%, transparent 66%)`,
            animation: 'nexhub-crest-breathe 6.6s ease-in-out infinite',
          }}
        />
      )}
      <div
        className={`relative flex h-[44px] w-[44px] items-center justify-center ${isRawEmberTier ? 'overflow-visible' : 'rounded-full'}`}
        style={
          isRawEmberTier
            ? undefined
            : {
                background: `radial-gradient(circle at 50% 42%, ${hexToRgba('#ffffff', 0.04)} 0%, ${hexToRgba(foundationTheme.surface.cardSecondary, 0.14)} 56%, transparent 100%)`,
              }
        }
      >
        {isRawEmberTier ? (
          <>
            <div
              className="pointer-events-none absolute left-1/2 top-[57%] h-[40px] w-[30px] -translate-x-1/2"
              style={{
                background: `
                  radial-gradient(ellipse at 50% 100%,
                    ${hexToRgba('#F3E7D8', 0.5)} 0%,
                    ${hexToRgba('#EFE2D1', 0.28)} 26%,
                    ${hexToRgba('#E9DCCA', 0.15)} 48%,
                    transparent 78%)
                `,
                filter: 'blur(12.5px)',
                mixBlendMode: 'screen',
                animation: 'nexhub-artifact-uplight-breathe 11.5s ease-in-out infinite',
              }}
            />
            <div
              className="pointer-events-none absolute left-1/2 top-[72%] h-[14px] w-[20px] -translate-x-1/2 rounded-full"
              style={{
                background: `radial-gradient(circle, ${hexToRgba('#F6ECDF', 0.42)} 0%, ${hexToRgba('#F1E5D4', 0.24)} 42%, transparent 78%)`,
                filter: 'blur(8px)',
                opacity: 1,
              }}
            />
          </>
        ) : null}
        {isRawEmberTier ? null : (
          <>
            <svg className="pointer-events-none absolute inset-0" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <circle
                cx="24"
                cy="24"
                r="21.75"
                stroke={hexToRgba(foundationTheme.border.strong, 0.4)}
                strokeWidth="1"
              />
              <circle
                cx="24"
                cy="24"
                r="18.6"
                stroke={hexToRgba(foundationTheme.accent.primary, 0.22)}
                strokeWidth="1.35"
                style={{ animation: 'nexhub-crest-arc 5.2s ease-in-out infinite' }}
              />
            </svg>
            <div
              className="pointer-events-none absolute inset-[6px] rounded-full border"
              style={{ borderColor: hexToRgba('#ffffff', 0.035) }}
            />
          </>
        )}
        {isRawEmberTier ? (
          <div
            className="pointer-events-none absolute left-1/2 top-[58%]"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <ArcInsignia tier={tier} size={insigniaSize} />
          </div>
        ) : (
          <ArcInsignia tier={tier} size={insigniaSize} />
        )}
      </div>
    </button>
  );
}

function PerformanceMetricBlock({
  title,
  value,
  supportingLine,
  accent,
  inactive = false,
  onClick,
}: {
  title: string;
  value: string;
  supportingLine: string;
  accent: string;
  inactive?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[16px] px-3.5 py-3.5 text-left transition-all duration-300 hover:bg-white/[0.02] active:scale-[0.995]"
      style={{
        opacity: inactive ? 0.5 : 1,
      }}
    >
      <div
        style={{
          ...getArcTypographyStyle(foundationTheme, 'label'),
          color: hexToRgba('#FFFFFF', 0.5),
          fontSize: '0.62rem',
          fontWeight: 600,
          letterSpacing: '0.11em',
        }}
      >
        {title}
      </div>
      <div
        className="mt-2.5"
        style={{
          ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
          color: inactive ? hexToRgba('#E6EDF3', 0.62) : hexToRgba('#E6EDF3', 0.88),
          fontSize: '1.18rem',
          lineHeight: 1.06,
          fontWeight: 600,
        }}
      >
        {value}
      </div>
      <div
        className="mt-2"
        style={{
          ...getArcTypographyStyle(foundationTheme, 'caption'),
          color: hexToRgba('#C9D3DE', inactive ? 0.42 : 0.52),
          fontSize: '0.72rem',
          fontWeight: 500,
          lineHeight: 1.22,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {supportingLine}
      </div>
    </button>
  );
}

function SessionMark({ session }: { session: Session }) {
  const tone =
    session.type === 'motion'
      ? foundationTheme.signal.warning
      : session.type === 'static'
        ? foundationTheme.chart.waking
        : foundationTheme.chart.nocturnal;
  const label =
    session.type === 'motion'
      ? 'MO'
      : session.type === 'static'
        ? 'ST'
        : 'NI';

  return (
    <div
      className="flex h-9 w-9 items-center justify-center rounded-2xl"
      style={{
        ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
        color: tone,
        background: hexToRgba(tone, 0.12),
      }}
    >
      {label}
    </div>
  );
}

function formatSessionMeta(session: Session) {
  return session.time ? `${session.date} / ${session.time}` : session.date;
}

export default function ArcHomeScreen({
  onNavigate,
  onPanelHover,
  onOpenAmora,
  amoraEnabled = true,
  proactiveInsightsEnabled = true,
  amoraGuidanceLevel = 'standard',
  amoraIntroVisible = false,
  toolAssignments,
  data,
  goalState,
  trendHistory,
  trendViewMode = 'accumulated',
  deviceStatusRows,
  syncBanner = null,
  lastSyncLabel,
  pendingImportLabel,
  deviceMemoryLabel,
  liveSyncState,
  liveSyncProgress = 0,
  edgeCardClipPath,
  edgeCardShapePoints,
  edgeCardGlassOpacity = 1,
  edgeCardGlassBlur = 1,
  edgeCardGlassTintOverride = null,
  edgeCardLayout,
  edgeCardMoveEditor = null,
  edgeCardShapeEditor = null,
}: {
  onNavigate: (screen: `session-detail:${string}` | 'account-status' | 'current-goal' | 'edgescore-details' | 'live-detail' | 'trend-detail' | 'resting' | 'build' | 'active' | 'recovery' | 'motion' | 'nocturnal' | 'sessions' | 'insignia-inventory' | 'pulse-mailbox' | 'battery') => void;
  onPanelHover?: (panel: ArcPanel | null) => void;
  onOpenAmora?: (topic: ArcAmoraTopicId) => void;
  amoraEnabled?: boolean;
  proactiveInsightsEnabled?: boolean;
  amoraGuidanceLevel?: ArcAmoraGuidanceLevel;
  amoraIntroVisible?: boolean;
  toolAssignments: ArcToolAssignments;
  data: ArcAppDataSnapshot;
  goalState: ArcFoundationGoalState;
  trendHistory?: ArcTrendHistoryPoint[];
  trendViewMode?: ArcTrendViewMode;
  deviceStatusRows: Array<{ label: string; value: string }>;
  syncBanner?: { title: string; detail: string } | null;
  lastSyncLabel: string;
  pendingImportLabel: string;
  deviceMemoryLabel: string;
  liveSyncState: {
    pillLabel: string;
    statusLine: string;
    detailLine: string;
  };
  liveSyncProgress?: number;
  edgeCardClipPath?: string;
  edgeCardShapePoints?: ArcCardShapePoint[];
  edgeCardGlassOpacity?: number;
  edgeCardGlassBlur?: number;
  edgeCardGlassTintOverride?: string | null;
  edgeCardLayout: ArcEdgeCardLayout;
  edgeCardMoveEditor?: HomeEdgeCardMoveEditor | null;
  edgeCardShapeEditor?: HomeEdgeCardShapeEditor | null;
}) {
  const latestSession = data.sessions[0] ?? null;
  const edgeUnlockPercentage = data.edgeScore.unlockPercentage;
  const edgeUnlockReady = data.edgeScore.unlocked;
  const compactEdgeCard = !edgeUnlockReady;
  const wearStreakDays = data.wearStreakDays;
  const profileStage = getProfileStage(data.calibration.progress);
  const edgeCardTone = edgeUnlockReady ? foundationTheme.text.highlight : foundationTheme.text.secondary;
  const edgeCardPresentation = getInstrumentEdgeCardPresentation(data.edgeScore, edgeUnlockPercentage);
  const edgeHomePillars = useMemo(() => getHomeEdgePillarCards(data.edgeScore), [data.edgeScore]);
  const focusCardPresentation = useMemo(() => getHomeFocusScorePresentation(data, goalState), [data, goalState]);
  const edgeHeroValue =
    edgeUnlockReady && data.edgeScore.value != null ? String(data.edgeScore.value) : '--';
  const edgeHeroProgress =
    edgeUnlockReady && data.edgeScore.value != null
      ? Math.min(1, Math.max(0, data.edgeScore.value / 100))
      : data.edgeScore.unlockProgress;
  const edgeCardPadding = compactEdgeCard ? '0.3rem 0.52rem 0.32rem' : '0.34rem 0.56rem 0.34rem';
  const edgeCardGlassStrength = Math.min(1, Math.max(0, edgeCardGlassOpacity));
  const edgeCardBlurStrength = Math.min(1, Math.max(0, edgeCardGlassBlur));
  const edgeCardSurfaceStrength = Math.min(1, Math.max(edgeCardBlurStrength, edgeCardGlassStrength));
  const edgeCardBackdropBlur = edgeCardBlurStrength > 0.001 ? 15 * edgeCardBlurStrength : 0;
  const edgeCardSheenAlpha = edgeCardSurfaceStrength * 0.022;
  const edgeCardGlassTint = edgeCardGlassTintOverride ?? edgeCardTone;
  const edgeCardSolidTintTopAlpha = Math.min(1, 0.18 * edgeCardGlassStrength + 0.82 * edgeCardGlassStrength * edgeCardGlassStrength);
  const edgeCardSolidTintBottomAlpha = Math.min(1, 0.24 * edgeCardGlassStrength + 0.76 * edgeCardGlassStrength * edgeCardGlassStrength);
  const edgeCardMaskImage = useMemo(
    () => buildCardShapeMaskImage(edgeCardShapePoints ?? []),
    [edgeCardShapePoints],
  );
  const edgeCardShapeGlassStyle = useMemo(
    () => ({
      background:
        edgeCardGlassStrength > 0
          ? `linear-gradient(180deg, ${hexToRgba(edgeCardGlassTint, edgeCardSolidTintTopAlpha)} 0%, ${hexToRgba(
              edgeCardGlassTint,
              edgeCardSolidTintBottomAlpha,
            )} 100%)`
          : 'transparent',
      borderColor: hexToRgba('#FFFFFF', 0.072 * edgeCardGlassStrength),
      boxShadow:
        edgeCardGlassStrength > 0
          ? `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.044 * edgeCardGlassStrength)}, inset 0 -16px 24px ${hexToRgba(
              foundationTheme.accent.secondary,
              0.014 * edgeCardGlassStrength,
            )}, inset 0 0 0 1px ${hexToRgba(foundationTheme.accent.primary, 0.025 * edgeCardGlassStrength)}`
          : 'none',
      backdropFilter: edgeCardBlurStrength > 0 ? `blur(${edgeCardBackdropBlur}px) saturate(118%)` : 'none',
      WebkitBackdropFilter: edgeCardBlurStrength > 0 ? `blur(${edgeCardBackdropBlur}px) saturate(118%)` : 'none',
      transition: 'background 180ms ease, border-color 180ms ease, box-shadow 180ms ease, backdrop-filter 180ms ease, -webkit-backdrop-filter 180ms ease',
    }),
    [edgeCardBackdropBlur, edgeCardBlurStrength, edgeCardGlassStrength, edgeCardGlassTint, edgeCardSolidTintBottomAlpha, edgeCardSolidTintTopAlpha],
  );
  const edgeCardShapeBoundaryStyle = useMemo(
    () => ({
      clipPath: edgeCardClipPath,
      WebkitClipPath: edgeCardClipPath,
      WebkitMaskImage: edgeCardMaskImage,
      maskImage: edgeCardMaskImage,
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskSize: '100% 100%',
      maskSize: '100% 100%',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      overflow: 'hidden' as const,
      isolation: 'isolate' as const,
    }),
    [edgeCardClipPath, edgeCardMaskImage],
  );
  const edgeCardPolygonPoints = useMemo(
    () => (edgeCardShapePoints && edgeCardShapePoints.length >= 4 ? edgeCardShapePoints.map(point => `${point.x},${point.y}`).join(' ') : null),
    [edgeCardShapePoints],
  );
  const edgeCardRootRef = useRef<HTMLDivElement | null>(null);
  const edgeCardTitleRef = useRef<HTMLDivElement | null>(null);
  const edgeCardGaugeRef = useRef<HTMLDivElement | null>(null);
  const edgeCardPillarsRef = useRef<HTMLDivElement | null>(null);
  const edgeCardTitleTransform = `translate(${edgeCardLayout.title.x}px, ${edgeCardLayout.title.y}px)`;
  const edgeCardGaugeTransform = `translate(${edgeCardLayout.gauge.x}px, ${edgeCardLayout.gauge.y}px)`;
  const edgeCardPillarsTransform = `translate(${edgeCardLayout.pillars.x}px, ${edgeCardLayout.pillars.y}px)`;
  const restingStateLabel =
    data.dashboardMetrics.restingState.status === 'stable'
      ? 'Stable'
      : data.dashboardMetrics.restingState.status === 'elevated'
        ? 'Elevated'
        : 'Reduced';
  const responseValue =
    data.dashboardMetrics.buildSpeed.latest !== 'No data yet'
      ? data.dashboardMetrics.buildSpeed.latest
      : data.featureAvailability.buildInsights
        ? data.highlights.buildSpeedSevenDayAverage
        : 'Awaiting first';
  const responseSupport =
    data.dashboardMetrics.buildSpeed.average !== 'Not enough data'
      ? `7d avg ${data.dashboardMetrics.buildSpeed.average}`
      : undefined;
  const recoveryValue =
    data.dashboardMetrics.recovery.latest !== 'No data yet'
      ? data.dashboardMetrics.recovery.latest
      : data.dashboardMetrics.recovery.best !== 'Not enough data'
        ? data.dashboardMetrics.recovery.best
        : 'Awaiting first';
  const recoverySupport =
    data.dashboardMetrics.recovery.best !== 'Not enough data'
      ? `Best ${data.dashboardMetrics.recovery.best}`
      : undefined;
  const overnightEventCount = data.latestNocturnalSession?.nocturnalEvents ?? null;
  const overnightValue = overnightEventCount != null ? `${overnightEventCount} events` : 'Awaiting nights';
  const overnightSupport = data.latestNocturnalSession ? `${data.highlights.nocturnalTotalActive} active overnight` : undefined;
  const performanceContextMetrics = [
    {
      title: 'Baseline',
      value: restingStateLabel,
      supportingLine: data.dashboardMetrics.restingState.baseline || data.highlights.liveStatusSummary,
      accent: foundationTheme.chart.baseline,
      inactive: false,
      onClick: () => onNavigate('resting'),
    },
    {
      title: 'Response',
      value: responseValue,
      supportingLine: responseSupport ?? data.dashboardMetrics.buildSpeed.indicator,
      accent: foundationTheme.accent.primary,
      inactive: responseValue.toLowerCase().startsWith('awaiting'),
      onClick: () => onNavigate('build'),
    },
    {
      title: 'Recovery',
      value: recoveryValue,
      supportingLine: recoverySupport ?? data.highlights.recoveryTrendLabel,
      accent: foundationTheme.chart.waking,
      inactive: recoveryValue.toLowerCase().startsWith('awaiting'),
      onClick: () => onNavigate('recovery'),
    },
    {
      title: 'Overnight',
      value: overnightValue,
      supportingLine: overnightSupport ?? data.highlights.nocturnalTrendLabel,
      accent: foundationTheme.chart.nocturnal,
      inactive: overnightValue === 'Awaiting nights',
      onClick: () => onNavigate('nocturnal'),
    },
  ];
  const phaseLine = `${profileStage.toUpperCase()} • ${
    data.calibration.progress >= 1 ? 'Profile established' : 'Profile forming'
  }`;
  const continuityLine =
    liveSyncState.pillLabel === 'SYNCING'
      ? 'Syncing stored capture…'
      : liveSyncState.pillLabel === 'BUFFERED'
        ? liveSyncState.detailLine.toLowerCase().includes('paused')
          ? 'Away • Capture paused'
          : 'Away • Recording on device'
        : liveSyncState.pillLabel === 'UP TO DATE'
          ? 'Capture reconciled'
          : 'Connected • Capture active';

  const statusValue = profileStage;
  const activeFocusValue = goalState.currentTaskTitle ?? goalState.activeFocusLabel ?? goalState.label;
  const derivedBatteryLevel = useMemo(() => {
    const numericValue = Number.parseInt(deviceMemoryLabel.replace(/[^0-9]/g, ''), 10);
    if (Number.isFinite(numericValue)) {
      return Math.min(100, Math.max(0, numericValue));
    }

    return deviceStatusRows.some(row => row.label === 'DEVICE' && row.value === 'Connected') ? 86 : 0;
  }, [deviceMemoryLabel, deviceStatusRows]);
  const homeToolSlots = useMemo(
    () => getArcSlottedToolsForPlacement(toolAssignments, 'home'),
    [toolAssignments],
  );

  return (
    <div className="space-y-4">
      <TopBarMotionStyles />
      <div
        className="relative mb-2 flex items-start justify-between rounded-[28px] border px-3 py-2"
        data-amora-anchor="home-header"
        style={{
          ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: foundationTheme.accent.primary, tintStrength: 0.028 }),
          borderColor: hexToRgba('#FFFFFF', 0.052),
        }}
      >
        <HeaderMicroUtilityPill
          batteryLevel={derivedBatteryLevel}
          onNavigate={onNavigate}
          onPanelHover={onPanelHover}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-6 rounded-t-[28px]"
          style={{ background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.016)} 0%, transparent 100%)` }}
        />
        <div className="grid min-w-0 grid-cols-[3.35rem_minmax(0,1fr)_3.35rem] items-start gap-x-2.5">
          <div
            className="flex justify-center pt-0.5"
            style={{ transform: 'translate(8px, 4px)' }}
          >
            <LivingInsigniaButton
              tier={data.userProfile.tier}
              progress={data.calibration.progress}
              onClick={() => onNavigate('insignia-inventory')}
              onPanelHover={onPanelHover}
            />
          </div>
          <div className="min-w-0">
            <div
              className="mx-auto grid min-w-0 max-w-[24rem] items-start gap-x-2.5 gap-y-2"
              style={{ gridTemplateColumns: 'minmax(0,1fr) 1px minmax(0,1fr)' }}
            >
              <div
                className="min-w-0 justify-self-end text-right"
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
                  color: hexToRgba(foundationTheme.text.primary, 0.96),
                  fontSize: '0.82rem',
                  transform: 'translateX(-7px)',
                }}
              >
                Cinder HUB
              </div>
              <div
                className="row-span-2 shrink-0 self-stretch rounded-full"
                style={{
                  width: '1px',
                  minHeight: '100%',
                  background: `linear-gradient(180deg, ${hexToRgba('#F1EEE8', 0.18)} 0%, ${hexToRgba('#E2D7C8', 0.72)} 50%, ${hexToRgba('#F1EEE8', 0.18)} 100%)`,
                  boxShadow: `0 0 8px ${hexToRgba('#D7CCC0', 0.16)}`,
                }}
              />
              <button
                type="button"
                className="min-w-0 cursor-help truncate text-left"
                onMouseEnter={() => onPanelHover?.('identity')}
                onMouseLeave={() => onPanelHover?.(null)}
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'caption'),
                  color: hexToRgba(foundationTheme.text.secondary, 0.92),
                  fontSize: '0.68rem',
                  letterSpacing: '0.03em',
                  transform: 'translateX(12px)',
                }}
              >
                {data.userProfile.anonymousUsername}
              </button>
              <div
                className="min-w-[4.25rem] justify-self-end text-center"
                style={{ transform: 'translateX(-6px)' }}
              >
                <div
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'label'),
                    color: hexToRgba('#FFFFFF', 0.42),
                    fontSize: '0.4rem',
                    fontWeight: 600,
                    letterSpacing: '0.13em',
                  }}
                >
                  STATUS
                </div>
                <button
                  type="button"
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'caption'),
                    color: '#E3DDD3',
                    fontSize: '0.54rem',
                    letterSpacing: '0.03em',
                    fontWeight: 600,
                    textShadow: `0 0 8px ${hexToRgba('#F3EEE7', 0.08)}`,
                    background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.045)} 0%, ${hexToRgba('#FFFFFF', 0.02)} 100%)`,
                    border: `1px solid ${hexToRgba('#E8DED0', 0.08)}`,
                    boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.05)}, 0 0 0 1px ${hexToRgba('#000000', 0.06)}`,
                    borderRadius: '999px',
                    padding: '0.18rem 0.5rem 0.2rem',
                    backdropFilter: 'blur(10px)',
                  }}
                  className="mt-0.5 cursor-pointer"
                  onClick={() => onNavigate('account-status')}
                  onMouseEnter={() => onPanelHover?.('accountStatus')}
                  onMouseLeave={() => onPanelHover?.(null)}
                >
                  {statusValue}
                </button>
              </div>
              <div className="min-w-0" style={{ transform: 'translateX(10px)' }}>
                <div
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'label'),
                    color: hexToRgba('#FFFFFF', 0.42),
                    fontSize: '0.4rem',
                    fontWeight: 600,
                    letterSpacing: '0.13em',
                  }}
                >
                  ACTIVE FOCUS
                </div>
                <button
                  type="button"
                  className="mt-1 cursor-pointer text-left"
                  onClick={() => onNavigate('current-goal')}
                  onMouseEnter={() => onPanelHover?.('goal')}
                  onMouseLeave={() => onPanelHover?.(null)}
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'caption'),
                    color: hexToRgba(foundationTheme.text.highlight, 0.9),
                    fontSize: '0.58rem',
                    fontWeight: 500,
                    letterSpacing: '0.015em',
                  }}
                >
                  {activeFocusValue}
                </button>
              </div>
            </div>
            <div className="hidden">
              <button
                type="button"
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                  color: hexToRgba(foundationTheme.text.highlight, 0.88),
                  fontSize: '0.58rem',
                  letterSpacing: '0.11em',
                }}
                className="cursor-pointer text-left"
                onClick={() => onNavigate('account-status')}
                onMouseEnter={() => onPanelHover?.('accountStatus')}
                onMouseLeave={() => onPanelHover?.(null)}
              >
                {phaseLine.replaceAll('â€¢', '•')}
              </button>
            </div>
            <div
              className="hidden"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'caption'),
                color: liveSyncState.pillLabel === 'SYNCING' || liveSyncState.pillLabel === 'UP TO DATE'
                  ? hexToRgba(foundationTheme.text.secondary, 0.94)
                  : hexToRgba(foundationTheme.text.tertiary, 0.82),
                fontSize: '0.59rem',
                lineHeight: 1.12,
              }}
            >
              {continuityLine.replaceAll('â€¢', '•').replace('â€¦', '...')}
            </div>
          </div>
          <div className="flex flex-col items-end gap-0.85 justify-self-end">
            <div
              className="flex h-[44px] items-center justify-center"
              style={{ transform: 'translate(-1px, 4px)' }}
            >
              <HeaderWearStreakIndicator streakDays={wearStreakDays} onPanelHover={onPanelHover} />
            </div>
            {amoraEnabled && onOpenAmora ? (
              <ArcAmoraAccessButton
                onClick={() => onOpenAmora('home')}
                quiet
                anchorId="amora-icon"
                introReveal={amoraIntroVisible}
              />
            ) : null}
          </div>
        </div>
      </div>
        <div
          data-amora-anchor="edge-score"
          ref={edgeCardRootRef}
          className="relative w-full transition-all duration-300"
          style={{
            ...edgeCardShapeBoundaryStyle,
            ...edgeCardShapeGlassStyle,
          }}
        >
          <div className="pointer-events-none absolute inset-0 z-0">
            <div
              className="absolute inset-x-0 top-0 transition-all duration-300"
              style={{
                height: compactEdgeCard ? '0.92rem' : '1.04rem',
                background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', edgeCardSheenAlpha)} 0%, transparent 100%)`,
              }}
            />
          </div>
          <div
            className="relative z-10"
            style={{
              padding: edgeCardPadding,
            }}
          >
            <div className="relative z-10 w-full">
            <div
              className="pointer-events-none absolute inset-0 rounded-[22px] opacity-0 transition-opacity duration-300"
              style={{ background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.012)} 0%, transparent 100%)` }}
            />
            <div className="relative z-10">
              <div
                ref={edgeCardTitleRef}
                className="relative min-w-0 max-w-[9.65rem] pr-1 transition-transform duration-300"
                style={{ minHeight: '2.7rem', transform: edgeCardTitleTransform }}
              >
                <div
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'sectionTitle'),
                    color: hexToRgba(foundationTheme.text.highlight, 0.9),
                    letterSpacing: '0.18em',
                    fontSize: '0.54rem',
                  }}
                >
                  EDGE SCORE
                </div>
                <div
                  className="min-h-[1.2rem]"
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
                    color: foundationTheme.text.primary,
                    fontSize: '0.86rem',
                    lineHeight: 1.08,
                    marginTop: '0.18rem',
                  }}
                >
                  {edgeCardPresentation.interpretation}
                </div>
              </div>
            </div>
            <div className="relative mt-[-0.08rem]">
              <div
                ref={edgeCardGaugeRef}
                className="absolute left-1/2 top-[-2.28rem] z-20 transition-transform duration-300"
                style={{
                  width: '12.6rem',
                  height: '11rem',
                  transform: `translate(calc(-50% + ${edgeCardLayout.gauge.x}px), ${edgeCardLayout.gauge.y}px)`,
                }}
              >
                <div
                  className="pointer-events-none absolute left-1/2 top-[1rem] z-0 h-[9.15rem] w-[9.15rem] -translate-x-1/2 rounded-full blur-3xl"
                  style={{ background: hexToRgba(HOME_SCORE_INDICATOR_GLOW, 0.042) }}
                />
                <button
                  type="button"
                  className="absolute left-1/2 top-0 z-20 -translate-x-1/2 transition-transform duration-500"
                  style={{ transform: 'translateX(-50%) scale(1)' }}
                  onClick={event => {
                    event.stopPropagation();
                    onNavigate('edgescore-details');
                  }}
                  onMouseEnter={() => onPanelHover?.('edgeScore')}
                  onMouseLeave={() => onPanelHover?.(null)}
                >
                  <EdgeScoreGauge
                    progress={edgeHeroProgress}
                    valueText={edgeHeroValue}
                    tone={edgeCardTone}
                    locked={!edgeUnlockReady}
                    size={200}
                    profile="edge"
                  />
                </button>
              </div>
              <div
                ref={edgeCardPillarsRef}
                className="pt-[9.25rem] transition-transform duration-300"
                style={{ transform: edgeCardPillarsTransform }}
              >
                <EdgePillarScoreStrip pillars={edgeHomePillars} unlocked={edgeUnlockReady} />
              </div>
            </div>
          </div>
          {edgeCardMoveEditor?.enabled ? (
            <EdgeCardMoveEditorOverlay
              rootRef={edgeCardRootRef}
              titleRef={edgeCardTitleRef}
              gaugeRef={edgeCardGaugeRef}
              pillarsRef={edgeCardPillarsRef}
              layout={edgeCardMoveEditor.layout}
              onLayoutChange={edgeCardMoveEditor.onLayoutChange}
            />
          ) : edgeCardShapeEditor?.enabled ? (
            <EdgeCardShapeEditorOverlay
              points={edgeCardShapeEditor.points}
              selectedPointIndex={edgeCardShapeEditor.selectedPointIndex}
              onPointsChange={edgeCardShapeEditor.onPointsChange}
              onSelectedPointChange={edgeCardShapeEditor.onSelectedPointChange}
            />
          ) : null}
        </div>
          {edgeCardPolygonPoints ? (
            <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polygon
                points={edgeCardPolygonPoints}
                fill="none"
                stroke={hexToRgba('#FFFFFF', edgeCardSurfaceStrength * 0.082)}
                strokeWidth="0.85"
                vectorEffect="non-scaling-stroke"
              />
              <polygon
                points={edgeCardPolygonPoints}
                fill="none"
                stroke={hexToRgba('#FFFFFF', edgeCardSurfaceStrength * 0.034)}
                strokeWidth="2.2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          ) : null}
      </div>

      <div className="pt-1">
        <button
          type="button"
          className="relative z-10 block w-full"
          onClick={() => onNavigate('current-goal')}
          onMouseEnter={() => onPanelHover?.('goal')}
          onMouseLeave={() => onPanelHover?.(null)}
        >
          <GoalCompletionCard
            value={focusCardPresentation.value}
            progress={focusCardPresentation.progress}
            tone={focusCardPresentation.tone}
            stateLabel={focusCardPresentation.stateLabel}
            supportLabel={focusCardPresentation.supportLabel}
          />
        </button>
      </div>

      {homeToolSlots.some(Boolean) ? (
        <div className="space-y-3 pt-1" data-amora-anchor="insight-tools">
          <ArcToolSlotRack
            slots={homeToolSlots}
            chartProps={{
              onOpenLiveDetail: () => onNavigate('live-detail'),
              onOpenTrendDetail: () => onNavigate('trend-detail'),
              amoraEnabled,
              proactiveInsightsEnabled,
              amoraGuidanceLevel,
              onOpenLiveAmora: () => onOpenAmora?.('live-signal'),
              onOpenTrendAmora: () => onOpenAmora?.('trend-view'),
              liveTelemetry: data.liveTelemetry,
              trendHistory,
              trendMode: trendViewMode,
              thresholdModel: data.thresholdModel,
              liveSyncState,
              liveSyncProgress,
            }}
          />
        </div>
      ) : null}

      <div className="space-y-3 pt-2" data-amora-anchor="insight-grid">
        <div
          style={{
            ...getArcTypographyStyle(foundationTheme, 'sectionTitle'),
            color: hexToRgba('#FFFFFF', 0.62),
            letterSpacing: '0.1em',
            fontSize: '0.62rem',
            fontWeight: 600,
          }}
        >
          PERFORMANCE CONTEXT
        </div>
        <div
          className="relative overflow-hidden rounded-[20px] border p-4"
          style={{
            ...getArcGlassSurfaceStyle(foundationTheme, 'light', {
              tint: foundationTheme.accent.primary,
              tintStrength: 0.022,
            }),
            borderColor: hexToRgba('#FFFFFF', 0.068),
          }}
        >
          <div className="relative grid grid-cols-2 gap-x-3.5 gap-y-3">
            {performanceContextMetrics.map(metric => (
              <PerformanceMetricBlock
                key={metric.title}
                title={metric.title}
                value={metric.value}
                supportingLine={metric.supportingLine}
                accent={metric.accent}
                inactive={metric.inactive}
                onClick={metric.onClick}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-1" data-amora-anchor="session-archive">
        <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.text.muted }}>
          Early archive
        </div>
        {latestSession ? (
          <button
            type="button"
            onClick={() => onNavigate(`session-detail:${latestSession.id}`)}
            className="relative flex w-full items-center justify-between overflow-hidden rounded-[26px] border p-4 text-left transition-colors"
            style={{
              ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.045 }),
              borderColor: hexToRgba('#FFFFFF', 0.068),
            }}
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-8"
              style={{ background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.024)} 0%, transparent 100%)` }}
            />
            <div className="flex items-center gap-3">
              <SessionMark session={latestSession} />
              <div>
                <div style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary }}>
                  Latest captured session
                </div>
                <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
                  {formatSessionMeta(latestSession)}
                </div>
              </div>
            </div>
            <ChevronHint />
          </button>
        ) : (
          <div
            className="relative overflow-hidden rounded-[26px] border p-5"
            style={{
              ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.04 }),
              borderColor: hexToRgba('#FFFFFF', 0.068),
            }}
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-8"
              style={{ background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.024)} 0%, transparent 100%)` }}
            />
            <div style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary }}>
              No sessions captured yet
            </div>
            <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.secondary }}>
              Your first captured session will appear here, begin your archive, and unlock richer comparison across the system.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
