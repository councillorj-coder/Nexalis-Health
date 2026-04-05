import { useState } from 'react';
import type { ArcAppDataSnapshot } from '../../data/arc-app-data';
import { InlineAmoraInsight, type ArcAmoraGuidanceLevel } from './ArcAmora';
import { foundationTheme, getArcGlassPillStyle, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';

function ProgressRing({
  progress,
  valueText,
  label,
  strokeColor,
}: {
  progress: number;
  valueText: string;
  label: string;
  strokeColor: string;
}) {
  const dashArray = 264;
  const dashOffset = dashArray - dashArray * progress;

  return (
    <svg width="176" height="176" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="42" fill="none" stroke={foundationTheme.chart.grid} strokeWidth="6" />
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke={strokeColor}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset}
        transform="rotate(-90 50 50)"
      />
      <text
        x="50"
        y="45"
        textAnchor="middle"
        dominantBaseline="central"
        fill={foundationTheme.text.highlight}
        style={{ ...getArcTypographyStyle(foundationTheme, 'displayHero'), fontSize: '16px' }}
      >
        {valueText}
      </text>
      <text
        x="50"
        y="61"
        textAnchor="middle"
        dominantBaseline="central"
        fill={foundationTheme.text.muted}
        style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), fontSize: '6px' }}
      >
        {label}
      </text>
    </svg>
  );
}

function getEdgeUnlockSummary(progress: number, unlocked: boolean) {
  if (unlocked) {
    return 'Edge intelligence unlocked';
  }

  if (progress < 0.34) {
    return 'Early system learning';
  }

  if (progress < 0.67) {
    return 'Baseline building in progress';
  }

  return 'Edge Score forming';
}

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

function formatTrendDirection(direction: ArcAppDataSnapshot['edgeScore']['trendDirection']) {
  switch (direction) {
    case 'rising':
      return 'Rising';
    case 'falling':
      return 'Falling';
    default:
      return 'Stable';
  }
}

type EdgePillarId = 'baseline' | 'erection' | 'session' | 'overnight' | 'consistency';

interface EdgeSubscoreRowData {
  label: string;
  value: number;
  weight: number;
  rawValue: string;
  sources: string[];
}

interface EdgePillarData {
  id: EdgePillarId;
  title: string;
  score: number;
  summary: string;
  accent: string;
  subscores: EdgeSubscoreRowData[];
}

function getScoreDescriptor(score: number) {
  if (score >= 100) {
    return 'Unicorn';
  }

  if (score >= 93) {
    return 'Apex';
  }

  if (score >= 85) {
    return 'Elite';
  }

  if (score >= 75) {
    return 'Advanced';
  }

  if (score >= 65) {
    return 'Strong';
  }

  if (score >= 50) {
    return 'Balanced';
  }

  if (score >= 35) {
    return 'Developing';
  }

  if (score >= 20) {
    return 'Limited';
  }

  return 'Very Low';
}

function EdgeSubscoreRow({ label, value, weight, rawValue, sources, isLast }: EdgeSubscoreRowData & { isLast: boolean }) {
  return (
    <div
      className="flex items-center justify-between gap-4 py-3"
      style={{
        borderBottom: isLast ? 'none' : `1px solid ${hexToRgba('#FFFFFF', 0.045)}`,
      }}
    >
      <div className="min-w-0">
        <div style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.primary }}>
          {label}
        </div>
        <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.secondary, fontSize: '0.82rem' }}>
          {rawValue}
        </div>
        <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: hexToRgba(foundationTheme.text.secondary, 0.82) }}>
          Sources: {sources.join(' • ')}
        </div>
        <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted }}>
          {getScoreDescriptor(value)} - {weight}% weight
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.highlight, fontSize: '1.02rem' }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function EdgePillarCard({
  pillar,
  isOpen,
  onToggle,
}: {
  pillar: EdgePillarData;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="overflow-hidden rounded-[28px] border"
      style={{
        ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: pillar.accent, tintStrength: 0.04 }),
        borderColor: hexToRgba('#FFFFFF', 0.062),
      }}
    >
      <button type="button" onClick={onToggle} className="w-full text-left" aria-expanded={isOpen}>
        <div className="flex items-start justify-between gap-4 p-5">
          <div className="min-w-0 flex-1">
            <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted }}>
              {pillar.title}
            </div>
            <div className="mt-2 max-w-[270px]" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.secondary }}>
              {pillar.summary}
            </div>
            <div className="mt-3 inline-flex items-center gap-2" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted }}>
              <span>{isOpen ? 'Hide breakdown' : 'View breakdown'}</span>
              <svg
                className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <div style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted }}>
              {getScoreDescriptor(pillar.score)}
            </div>
            <div
              className="mt-1"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'heroValue'),
                color: pillar.accent,
                fontSize: '2rem',
                lineHeight: 1,
              }}
            >
              {pillar.score}
            </div>
          </div>
        </div>
      </button>

      {isOpen ? (
        <div
          className="animate-in fade-in-0 slide-in-from-top-1 px-5 pb-4 pt-1 duration-300"
          style={{ borderTop: `1px solid ${hexToRgba('#FFFFFF', 0.05)}` }}
        >
          <div className="pb-2 pt-3" style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted }}>
            Feeding subscores
          </div>
          {pillar.subscores.map((subscore, index) => (
            <EdgeSubscoreRow
              key={`${pillar.id}-${subscore.label}`}
              label={subscore.label}
              value={subscore.value}
              weight={subscore.weight}
              rawValue={subscore.rawValue}
              sources={subscore.sources}
              isLast={index === pillar.subscores.length - 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function ArcEdgeScoreDetails({
  onBack,
  data,
  amoraEnabled = true,
  proactiveInsightsEnabled = true,
  amoraGuidanceLevel = 'standard',
  onOpenAmora,
}: {
  onBack: () => void;
  data: ArcAppDataSnapshot;
  amoraEnabled?: boolean;
  proactiveInsightsEnabled?: boolean;
  amoraGuidanceLevel?: ArcAmoraGuidanceLevel;
  onOpenAmora?: () => void;
}) {
  const edgeUnlockPercentage = data.edgeScore.unlockPercentage;
  const edgeUnlockReady = data.edgeScore.unlocked;
  const edgeUnlockSummary = edgeUnlockReady ? data.edgeScore.status : getEdgeUnlockSummary(data.calibration.progress, false);
  const edgeTone = getEdgeStateTone(data.edgeScore.state);
  const [openPillarId, setOpenPillarId] = useState<EdgePillarId | null>(null);
  const showAmoraInsight =
    amoraEnabled &&
    proactiveInsightsEnabled &&
    amoraGuidanceLevel !== 'minimal' &&
    !!onOpenAmora;
  const amoraMessage = !edgeUnlockReady
    ? 'Profile formation is still shaping the baseline Edge will read against.'
    : data.edgeScore.dayDelta != null && data.edgeScore.dayDelta < 0
      ? 'Readiness holds up, but hold stability is softer than your recent norm.'
      : data.edgeScore.dayDelta != null && data.edgeScore.dayDelta > 0
        ? 'Recent sessions are reinforcing the score with steadier consistency.'
        : 'Your score is being supported more by consistency than peak volatility.';

  const pillarCards: EdgePillarData[] = [
    {
      id: 'baseline',
      title: 'Baseline Readiness',
      score: data.edgeScore.baselineReadiness,
      summary: 'Resting quality and stability',
      accent: foundationTheme.chart.baseline,
      subscores: [
        {
          label: 'Baseline Mean',
          value: data.edgeScore.baselineReadinessBreakdown.averageBaselineFullnessScore,
          weight: 25,
          rawValue: data.edgeScore.baselineReadinessRawValues.averageBaselineFullness,
          sources: ['Live chart', 'Trend chart'],
        },
        {
          label: 'Stability',
          value: data.edgeScore.baselineReadinessBreakdown.baselineStabilityScore,
          weight: 25,
          rawValue: data.edgeScore.baselineReadinessRawValues.baselineStability,
          sources: ['Live chart', 'Trend chart'],
        },
        {
          label: 'Reduced Frequency',
          value: data.edgeScore.baselineReadinessBreakdown.reducedBaselinePenaltyScore,
          weight: 20,
          rawValue: data.edgeScore.baselineReadinessRawValues.reducedBaselineFrequency,
          sources: ['Live chart', 'Trend chart'],
        },
        {
          label: 'Elevated Support',
          value: data.edgeScore.baselineReadinessBreakdown.elevatedBaselineSupportScore,
          weight: 10,
          rawValue: data.edgeScore.baselineReadinessRawValues.elevatedBaselineSupport,
          sources: ['Live chart', 'Trend chart'],
        },
        {
          label: 'Volatility Quality',
          value: data.edgeScore.baselineReadinessBreakdown.baselineVolatilityQualityScore,
          weight: 20,
          rawValue: data.edgeScore.baselineReadinessRawValues.baselineVolatilityQuality,
          sources: ['Live chart', 'Trend chart'],
        },
      ],
    },
    {
      id: 'erection',
      title: 'Erection Quality',
      score: data.edgeScore.erectionQuality,
      summary: 'Peak, hold, stability, and recovery behavior',
      accent: foundationTheme.accent.primary,
      subscores: [
        {
          label: 'Peak Fullness',
          value: data.edgeScore.erectionQualityBreakdown.peakFullnessScore,
          weight: 20,
          rawValue: data.edgeScore.erectionQualityRawValues.peakFullness,
          sources: ['Trend chart', 'Qualified sessions'],
        },
        {
          label: 'Peak Consistency',
          value: data.edgeScore.erectionQualityBreakdown.peakConsistencyScore,
          weight: 10,
          rawValue: data.edgeScore.erectionQualityRawValues.peakConsistency,
          sources: ['Trend chart', 'Qualified sessions'],
        },
        {
          label: 'Hold Quality',
          value: data.edgeScore.erectionQualityBreakdown.holdQualityScore,
          weight: 22,
          rawValue: data.edgeScore.erectionQualityRawValues.holdQuality,
          sources: ['Qualified sessions', 'Trend chart'],
        },
        {
          label: 'Hold Stability',
          value: data.edgeScore.erectionQualityBreakdown.stabilityScore,
          weight: 10,
          rawValue: data.edgeScore.erectionQualityRawValues.stability,
          sources: ['Qualified sessions', 'Trend chart'],
        },
        {
          label: 'Hold Duration',
          value: data.edgeScore.erectionQualityBreakdown.durationQualityScore,
          weight: 14,
          rawValue: data.edgeScore.erectionQualityRawValues.durationQuality,
          sources: ['Qualified sessions'],
        },
        {
          label: 'Build Quality',
          value: data.edgeScore.erectionQualityBreakdown.buildQualityScore,
          weight: 10,
          rawValue: data.edgeScore.erectionQualityRawValues.buildQuality,
          sources: ['Qualified sessions'],
        },
        {
          label: 'Recovery Quality',
          value: data.edgeScore.erectionQualityBreakdown.recoveryQualityScore,
          weight: 8,
          rawValue: data.edgeScore.erectionQualityRawValues.recoveryQuality,
          sources: ['Qualified sessions'],
        },
        {
          label: 'Rebound Quality',
          value: data.edgeScore.erectionQualityBreakdown.reboundQualityScore,
          weight: 6,
          rawValue: data.edgeScore.erectionQualityRawValues.reboundQuality,
          sources: ['Qualified sessions'],
        },
      ],
    },
    {
      id: 'session',
      title: 'Session Performance',
      score: data.edgeScore.sessionPerformance,
      summary: 'Qualified session strength and motion performance',
      accent: foundationTheme.signal.up,
      subscores: [
        {
          label: 'Motion Session Quality',
          value: data.edgeScore.sessionPerformanceBreakdown.motionSessionQualityScore,
          weight: 18,
          rawValue: data.edgeScore.sessionPerformanceRawValues.motionSessionQuality,
          sources: ['Motion sessions'],
        },
        {
          label: 'Motion Peak',
          value: data.edgeScore.sessionPerformanceBreakdown.motionPeakQualityScore,
          weight: 15,
          rawValue: data.edgeScore.sessionPerformanceRawValues.motionPeakQuality,
          sources: ['Motion sessions'],
        },
        {
          label: 'Motion Hold',
          value: data.edgeScore.sessionPerformanceBreakdown.motionHoldQualityScore,
          weight: 15,
          rawValue: data.edgeScore.sessionPerformanceRawValues.motionHoldQuality,
          sources: ['Motion sessions'],
        },
        {
          label: 'Motion Duration',
          value: data.edgeScore.sessionPerformanceBreakdown.motionDurationScore,
          weight: 12,
          rawValue: data.edgeScore.sessionPerformanceRawValues.motionDuration,
          sources: ['Motion sessions'],
        },
        {
          label: 'Motion / Static Ratio',
          value: data.edgeScore.sessionPerformanceBreakdown.motionStaticRatioScore,
          weight: 10,
          rawValue: data.edgeScore.sessionPerformanceRawValues.motionStaticRatio,
          sources: ['Motion sessions', 'Session archive'],
        },
        {
          label: 'Drive Count',
          value: data.edgeScore.sessionPerformanceBreakdown.driveCountQualityScore,
          weight: 10,
          rawValue: data.edgeScore.sessionPerformanceRawValues.driveCount,
          sources: ['Motion sessions'],
        },
        {
          label: 'Cadence',
          value: data.edgeScore.sessionPerformanceBreakdown.cadenceQualityScore,
          weight: 8,
          rawValue: data.edgeScore.sessionPerformanceRawValues.cadence,
          sources: ['Motion sessions'],
        },
        {
          label: 'Rhythm Consistency',
          value: data.edgeScore.sessionPerformanceBreakdown.rhythmConsistencyScore,
          weight: 6,
          rawValue: data.edgeScore.sessionPerformanceRawValues.rhythmConsistency,
          sources: ['Motion sessions'],
        },
        {
          label: 'Motion Control',
          value: data.edgeScore.sessionPerformanceBreakdown.motionControlScore,
          weight: 6,
          rawValue: data.edgeScore.sessionPerformanceRawValues.motionControl,
          sources: ['Motion sessions'],
        },
      ],
    },
    {
      id: 'overnight',
      title: 'Overnight Support',
      score: data.edgeScore.overnightSupport,
      summary: 'Overnight support and quality',
      accent: foundationTheme.signal.warning,
      subscores: [
        {
          label: 'Nocturnal Fullness',
          value: data.edgeScore.overnightSupportBreakdown.averageNocturnalFullnessScore,
          weight: 30,
          rawValue: data.edgeScore.overnightSupportRawValues.averageNocturnalFullness,
          sources: ['Nocturnal sessions'],
        },
        {
          label: 'Nocturnal Duration',
          value: data.edgeScore.overnightSupportBreakdown.averageNocturnalDurationScore,
          weight: 25,
          rawValue: data.edgeScore.overnightSupportRawValues.averageNocturnalDuration,
          sources: ['Nocturnal sessions'],
        },
        {
          label: 'Events Per Night',
          value: data.edgeScore.overnightSupportBreakdown.eventFrequencyScore,
          weight: 20,
          rawValue: data.edgeScore.overnightSupportRawValues.eventFrequency,
          sources: ['Nocturnal sessions'],
        },
        {
          label: 'Overnight Consistency',
          value: data.edgeScore.overnightSupportBreakdown.nocturnalConsistencyScore,
          weight: 15,
          rawValue: data.edgeScore.overnightSupportRawValues.nocturnalConsistency,
          sources: ['Nocturnal sessions'],
        },
        {
          label: 'Strongest Set',
          value: data.edgeScore.overnightSupportBreakdown.strongestSetSupportScore,
          weight: 10,
          rawValue: data.edgeScore.overnightSupportRawValues.strongestSetSupport,
          sources: ['Nocturnal sessions'],
        },
      ],
    },
    {
      id: 'consistency',
      title: 'Discipline & Diligence',
      score: data.edgeScore.consistencyReliability,
      summary: 'Repeatability, control, and trust in the profile',
      accent: foundationTheme.text.secondary,
      subscores: [
        {
          label: 'Peak Consistency',
          value: data.edgeScore.consistencyReliabilityBreakdown.peakConsistencyScore,
          weight: 25,
          rawValue: data.edgeScore.consistencyReliabilityRawValues.peakConsistency,
          sources: ['Trend chart', 'Qualified sessions'],
        },
        {
          label: 'Hold Consistency',
          value: data.edgeScore.consistencyReliabilityBreakdown.holdConsistencyScore,
          weight: 25,
          rawValue: data.edgeScore.consistencyReliabilityRawValues.holdConsistency,
          sources: ['Qualified sessions'],
        },
        {
          label: 'Active Day Density',
          value: data.edgeScore.consistencyReliabilityBreakdown.activeDayDensityScore,
          weight: 15,
          rawValue: data.edgeScore.consistencyReliabilityRawValues.activeDayDensity,
          sources: ['Trend chart', 'Session archive'],
        },
        {
          label: 'Archive Maturity',
          value: data.edgeScore.consistencyReliabilityBreakdown.archiveMaturityScore,
          weight: 15,
          rawValue: data.edgeScore.consistencyReliabilityRawValues.archiveMaturity,
          sources: ['Trend chart', 'Session archive', 'Nocturnal sessions'],
        },
        {
          label: 'Pattern Reliability',
          value: data.edgeScore.consistencyReliabilityBreakdown.patternReliabilityScore,
          weight: 20,
          rawValue: data.edgeScore.consistencyReliabilityRawValues.patternReliability,
          sources: ['Trend chart', 'Session archive'],
        },
      ],
    },
  ];

  return (
    <div className="animate-in slide-in-from-bottom-4 pb-12 duration-700">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
          style={{
            ...getArcGlassPillStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.045 }),
            borderColor: hexToRgba('#FFFFFF', 0.075),
          }}
        >
          <svg className="h-5 w-5" style={{ color: foundationTheme.text.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.accent.primary }}>
          Edge Score
        </div>
        <div className="w-10" />
      </div>

      <div className="space-y-5">
        <div style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.secondary }}>
          {edgeUnlockReady
            ? 'Built from the last 30 days, weighted toward recent performance.'
            : 'EDGE is still building from baseline, session, and overnight coverage across the last 30 days.'}
        </div>

        <div
          className="relative overflow-hidden rounded-[32px] border p-6"
          style={{
            ...getArcGlassSurfaceStyle(foundationTheme, 'hero', { tint: foundationTheme.accent.primary, tintStrength: 0.055 }),
            borderColor: hexToRgba('#FFFFFF', 0.08),
          }}
        >
          <div
            className="absolute right-0 top-0 h-40 w-40 rounded-full opacity-25 blur-3xl"
            style={{ background: hexToRgba(foundationTheme.accent.primary, 0.14) }}
          />

          <div className="relative z-10 flex items-center justify-between gap-5">
            <div className="max-w-[185px]">
              <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.accent.primary }}>
                EDGE SCORE
              </div>
              <div className="mt-3" style={{ ...getArcTypographyStyle(foundationTheme, 'heroValue'), color: foundationTheme.text.highlight, fontSize: '2.9rem', lineHeight: 1 }}>
                {edgeUnlockReady ? data.edgeScore.value : `${edgeUnlockPercentage}%`}
              </div>
              <div className="mt-3" style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary }}>
                {edgeUnlockReady ? data.edgeScore.primaryLine : edgeUnlockSummary}
              </div>
              <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
                {data.edgeScore.secondaryLine}
              </div>
              {showAmoraInsight ? (
                <div className="mt-4 max-w-[280px]">
                  <InlineAmoraInsight
                    variant="insight"
                    density="compact"
                    message={amoraMessage}
                    ctaLabel="View interpretation"
                    onTap={onOpenAmora}
                  />
                </div>
              ) : null}
            </div>

            <div className="flex flex-col items-center gap-3">
              <ProgressRing
                progress={edgeUnlockReady ? 1 : data.edgeScore.unlockProgress}
                valueText={edgeUnlockReady && data.edgeScore.value != null ? String(data.edgeScore.value) : `${edgeUnlockPercentage}%`}
                label={edgeUnlockReady ? 'Edge score' : 'Model build'}
                strokeColor={edgeUnlockReady ? edgeTone : foundationTheme.accent.primary}
              />
              <div className="flex flex-col items-center gap-2">
                <div
                  className="rounded-full border px-3 py-1"
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                    ...getArcGlassPillStyle(
                      foundationTheme,
                      'light',
                      {
                        tint: edgeUnlockReady ? edgeTone : foundationTheme.accent.primary,
                        tintStrength: edgeUnlockReady ? 0.055 : 0.045,
                      },
                    ),
                    color: edgeUnlockReady ? edgeTone : foundationTheme.accent.primary,
                    borderColor: edgeUnlockReady ? hexToRgba(edgeTone, 0.18) : hexToRgba('#FFFFFF', 0.07),
                  }}
                >
                  {edgeUnlockReady ? data.edgeScore.status : 'Building'}
                </div>
                <div
                  className="rounded-full border px-3 py-1"
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                    ...getArcGlassPillStyle(foundationTheme, 'light', {
                      tint: foundationTheme.accent.primary,
                      tintStrength: 0.04,
                    }),
                    color: foundationTheme.text.secondary,
                    borderColor: hexToRgba('#FFFFFF', 0.07),
                  }}
                >
                  30-day weighted
                </div>
              </div>
            </div>
          </div>
        </div>

        {edgeUnlockReady ? (
          <div
            className="rounded-[28px] border p-5"
            style={{
              ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.042 }),
              borderColor: hexToRgba('#FFFFFF', 0.068),
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.text.primary }}>
                  30-day weighted model
                </div>
                <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted }}>
                  Recent 7 days carry the most influence, followed by days 8-14, then days 15-30.
                </div>
              </div>
              <div
                className="rounded-full border px-3 py-1"
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                  ...getArcGlassPillStyle(foundationTheme, 'light', {
                    tint: foundationTheme.text.secondary,
                    tintStrength: 0.03,
                  }),
                  color: foundationTheme.text.secondary,
                  borderColor: hexToRgba('#FFFFFF', 0.062),
                }}
              >
                {data.edgeScore.confidenceLabel} confidence
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { label: 'Days 0-7', weight: '50%' },
                { label: 'Days 8-14', weight: '30%' },
                { label: 'Days 15-30', weight: '20%' },
              ].map(item => (
                <div
                  key={item.label}
                  className="rounded-full border px-3 py-2"
                  style={{
                    ...getArcGlassPillStyle(foundationTheme, 'light', {
                      tint: foundationTheme.accent.primary,
                      tintStrength: 0.03,
                    }),
                    borderColor: hexToRgba('#FFFFFF', 0.055),
                  }}
                >
                  <div style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted }}>
                    {item.label}
                  </div>
                  <div className="mt-0.5" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.primary }}>
                    {item.weight}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {edgeUnlockReady ? (
          <div className="space-y-3">
            <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.text.primary }}>
              Score pillars
            </div>
            {pillarCards.map(pillar => (
              <EdgePillarCard
                key={pillar.id}
                pillar={pillar}
                isOpen={openPillarId === pillar.id}
                onToggle={() => setOpenPillarId(current => (current === pillar.id ? null : pillar.id))}
              />
            ))}
          </div>
        ) : null}

        <div
          className="rounded-[28px] border p-5"
          style={{
            ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.045 }),
            borderColor: hexToRgba('#FFFFFF', 0.07),
          }}
        >
          <div style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary }}>
            {edgeUnlockReady ? 'How EDGE comes together' : 'Building your EDGE Score'}
          </div>
          <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted }}>
            {data.edgeScore.methodologyLine}
          </div>
          <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.secondary }}>
            {data.edgeScore.detailBody}
          </div>
          {edgeUnlockReady ? (
            <div className="mt-3" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted }}>
              Trend {formatTrendDirection(data.edgeScore.trendDirection)} - Confidence {data.edgeScore.confidenceLabel}
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}
