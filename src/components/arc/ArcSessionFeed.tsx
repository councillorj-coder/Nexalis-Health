import { useEffect, useMemo, useRef, useState } from 'react';
import type { Session } from '../../data/arc-types';
import { InlineAmoraInsight, type ArcAmoraGuidanceLevel } from './ArcAmora';
import { foundationTheme, getArcGlassSurfaceStyle, hexToRgba } from './arc-theme';

type SessionFilterKey = 'All' | 'Motion' | 'Static' | 'Nocturnal' | 'Personal Bests';

type SessionFilterOption = {
  key: SessionFilterKey;
  label: string;
  description: string;
};

type MilestoneSlot = {
  title: string;
  value: string;
  date?: string;
};

function parseDurationSeconds(value?: string) {
  if (!value) {
    return null;
  }

  const match = value.match(/(?:(\d+)m)?\s*(?:(\d+)s)?/i);
  if (!match) {
    return null;
  }

  const minutes = Number(match[1] ?? 0);
  const seconds = Number(match[2] ?? 0);
  return minutes * 60 + seconds;
}

function buildWaveformPath(values: number[], width: number, height: number, padding = 3) {
  if (values.length === 0) {
    return '';
  }

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = Math.max(maxValue - minValue, 0.001);

  return values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * width;
      const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

function MiniWaveform({ session }: { session: Session }) {
  const erectionStroke =
    session.type === 'motion'
      ? hexToRgba(foundationTheme.accent.primary, 0.62)
      : session.type === 'nocturnal'
        ? hexToRgba(foundationTheme.chart.nocturnal, 0.58)
        : hexToRgba(foundationTheme.chart.waking, 0.56);
  const motionStroke = hexToRgba(foundationTheme.signal.down, 0.44);
  const erectionValues =
    session.erectionWaveform && session.erectionWaveform.length > 0
      ? session.erectionWaveform
      : session.type === 'motion'
        ? [20, 24, 36, 52, 69, 81, 77, 73, 67, 58, 43, 29, 23]
        : session.type === 'nocturnal'
          ? [18, 22, 31, 47, 68, 79, 75, 63, 49, 34, 25, 21]
          : [20, 22, 28, 43, 59, 63, 57, 49, 38, 30, 25, 22];
  const motionValues =
    session.motionWaveform && session.motionWaveform.length > 0
      ? session.motionWaveform
      : session.type === 'motion'
        ? [0.08, 0.2, 0.5, 0.74, 0.42, 0.78, 0.55, 0.82, 0.46, 0.76, 0.28]
        : [];
  const erectionPath = buildWaveformPath(erectionValues, 200, 30);
  const motionPath = motionValues.length > 0 ? buildWaveformPath(motionValues, 200, 18, 2) : '';

  return (
    <svg className="mt-3 h-7 w-full opacity-70" viewBox="0 0 200 30" preserveAspectRatio="none">
      <path d={erectionPath} stroke={erectionStroke} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {motionPath ? (
        <g transform="translate(0, 12)">
          <path d={motionPath} stroke={motionStroke} strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}
    </svg>
  );
}

function SessionMetric({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div>
      <div className="text-[9px]" style={{ color: foundationTheme.text.muted }}>{label}</div>
      <div className="text-sm font-bold">{value ?? '--'}</div>
    </div>
  );
}

function formatAnalysisValue(value?: number) {
  return typeof value === 'number' ? `${Math.round(value)}` : '--';
}

function SessionCard({
  session,
  onTap,
  calibrationComplete,
}: {
  session: Session;
  onTap: () => void;
  calibrationComplete: boolean;
}) {
  const typeColors: Record<string, { border: string; tint: string }> = {
    motion: { border: hexToRgba(foundationTheme.signal.down, 0.2), tint: foundationTheme.signal.down },
    static: { border: hexToRgba(foundationTheme.chart.waking, 0.2), tint: foundationTheme.chart.waking },
    nocturnal: { border: hexToRgba(foundationTheme.chart.nocturnal, 0.2), tint: foundationTheme.chart.nocturnal },
  };

  const typeLabels: Record<string, string> = {
    motion: 'Motion Session',
    static: 'Static Session',
    nocturnal: 'Nocturnal Session',
  };

  const typeAccent: Record<string, string> = {
    motion: foundationTheme.signal.down,
    static: foundationTheme.chart.waking,
    nocturnal: foundationTheme.chart.nocturnal,
  };
  const cardTone = typeColors[session.type] ?? { border: foundationTheme.border.soft, tint: foundationTheme.accent.primary };
  const sessionStatusLabel = calibrationComplete ? session.statusLabel : 'Calibration Session';

  return (
    <button
      onClick={onTap}
      className="relative w-full overflow-hidden rounded-3xl border p-5 text-left transition-colors"
      style={{
        ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: cardTone.tint, tintStrength: 0.026 }),
        borderColor: cardTone.border,
      }}
    >
      {session.isPersonalBest && (
        <div className="absolute right-4 top-4 rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.signal.warning, background: hexToRgba(foundationTheme.signal.warning, 0.1), borderColor: hexToRgba(foundationTheme.signal.warning, 0.2) }}>
          {session.personalBestLabel ?? 'PB'}
        </div>
      )}
      <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: typeAccent[session.type] }}>
        {typeLabels[session.type]}
      </div>
      <div className="mb-2 text-[10px]" style={{ color: foundationTheme.text.muted }}>{session.date} / {session.time}</div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="text-sm font-semibold tracking-tight" style={{ color: foundationTheme.text.primary }}>
          {sessionStatusLabel}
        </div>
        {typeof session.peakLevel === 'number' ? (
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: foundationTheme.text.secondary }}>
            Peak {session.peakLevel.toFixed(0)}%
          </div>
        ) : null}
      </div>

      {session.type === 'motion' ? (
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <SessionMetric label="Drive Count" value={session.motion?.driveCount} />
          <SessionMetric label="Cadence" value={session.motion?.cadenceAvg ?? session.motion?.cadence} />
          <SessionMetric label="Duration" value={session.metrics.duration} />
          <SessionMetric label="Hold" value={session.metrics.holdQuality} />
          <SessionMetric label="Rhythm" value={session.motion?.rhythm} />
          <SessionMetric label="Recovery" value={session.metrics.recovery} />
        </div>
      ) : session.type === 'static' ? (
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <SessionMetric label="Build" value={session.metrics.buildSpeed} />
          <SessionMetric label="Hold" value={session.metrics.holdQuality ?? session.metrics.stability} />
          <SessionMetric label="Duration" value={session.metrics.duration} />
          <SessionMetric label="Recovery" value={session.metrics.recovery} />
          <SessionMetric label="Peak Quality" value={session.metrics.peakQuality} />
          <SessionMetric label="Stability" value={session.metrics.stability} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <SessionMetric label="Duration" value={session.metrics.duration} />
          <SessionMetric label="Hold" value={session.metrics.holdQuality} />
          <SessionMetric label="Peak" value={typeof session.peakLevel === 'number' ? `${session.peakLevel.toFixed(0)}%` : '--'} />
          <SessionMetric label="Quality" value={session.overnightStability ?? session.metrics.peakQuality} />
          <SessionMetric label="Build" value={session.metrics.buildSpeed} />
          <SessionMetric label="Recovery" value={session.metrics.recovery} />
        </div>
      )}
      <div
        className="mt-3 flex items-center gap-2 border-t pt-3"
        style={{ borderColor: hexToRgba('#FFFFFF', 0.05) }}
      >
        <div
          className="rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em]"
          style={{
            background: hexToRgba('#FFFFFF', 0.04),
            borderColor: hexToRgba('#FFFFFF', 0.06),
            color: foundationTheme.text.muted,
          }}
        >
          Quality {formatAnalysisValue(session.analysis?.sessionQualityScore)}
        </div>
        <div
          className="rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em]"
          style={{
            background: hexToRgba('#FFFFFF', 0.04),
            borderColor: hexToRgba('#FFFFFF', 0.06),
            color: foundationTheme.text.muted,
          }}
        >
          {session.type === 'nocturnal' ? 'Regularity' : 'Control'}{' '}
          {formatAnalysisValue(
            session.type === 'nocturnal'
              ? session.analysis?.overnightRegularityScore
              : session.analysis?.controlScore ?? session.analysis?.rhythmControlScore,
          )}
        </div>
      </div>
      <MiniWaveform session={session} />
    </button>
  );
}

function MilestoneSlotCard({ slot }: { slot: MilestoneSlot }) {
  return (
    <div
      className="rounded-2xl p-3"
      style={{
        background: hexToRgba('#FFFFFF', 0.04),
        boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.04)}`,
      }}
    >
      <div className="text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: hexToRgba('#FFFFFF', 0.58) }}>
        {slot.title}
      </div>
      <div className="mt-2 text-sm font-semibold" style={{ color: foundationTheme.text.secondary }}>
        {slot.value}
      </div>
      {slot.date ? (
        <div className="mt-1 text-[10px]" style={{ color: foundationTheme.text.muted }}>
          {slot.date}
        </div>
      ) : null}
    </div>
  );
}

export default function ArcSessionFeed({
  onNavigate,
  sessionsData = [],
  calibrationComplete = true,
  amoraEnabled = true,
  proactiveInsightsEnabled = true,
  amoraGuidanceLevel = 'standard',
  onOpenAmora,
}: {
  onNavigate: (screen: string) => void;
  sessionsData?: Session[];
  calibrationComplete?: boolean;
  amoraEnabled?: boolean;
  proactiveInsightsEnabled?: boolean;
  amoraGuidanceLevel?: ArcAmoraGuidanceLevel;
  onOpenAmora?: () => void;
}) {
  const [filter, setFilter] = useState<SessionFilterKey>('All');
  const filters: SessionFilterOption[] = [
    {
      key: 'All',
      label: 'All',
      description: 'Every recorded session in one rolling timeline.',
    },
    {
      key: 'Motion',
      label: 'Motion',
      description: 'Qualified daytime sessions with repeated intimate movement.',
    },
    {
      key: 'Static',
      label: 'Static',
      description: 'Qualified daytime sessions without enough motion to classify as motion.',
    },
    {
      key: 'Nocturnal',
      label: 'Nocturnal',
      description: 'Overnight support events captured separately from daytime sessions.',
    },
    {
      key: 'Personal Bests',
      label: 'Bests',
      description: 'Your top session milestones and standout captures.',
    },
  ];
  const sessionPool = sessionsData;
  const filterCounts = useMemo(() => ({
    All: sessionPool.length,
    Motion: sessionPool.filter(session => session.type === 'motion').length,
    Static: sessionPool.filter(session => session.type === 'static').length,
    Nocturnal: sessionPool.filter(session => session.type === 'nocturnal').length,
    'Personal Bests': sessionPool.filter(session => session.isPersonalBest).length,
  } satisfies Record<SessionFilterKey, number>), [sessionPool]);
  const selectedFilter = filters.find(option => option.key === filter) ?? filters[0]!;
  const isBestsActive = filter === 'Personal Bests';
  const personalBestSessions = useMemo(
    () => sessionPool.filter(session => session.isPersonalBest),
    [sessionPool],
  );
  const selectedCountLabel = useMemo(() => {
    const count = filterCounts[filter];

    switch (filter) {
      case 'All':
        return `${count} ${count === 1 ? 'Session' : 'Sessions'}`;
      case 'Motion':
        return `${count} Motion ${count === 1 ? 'Session' : 'Sessions'}`;
      case 'Static':
        return `${count} Static ${count === 1 ? 'Session' : 'Sessions'}`;
      case 'Nocturnal':
        return `${count} Nocturnal ${count === 1 ? 'Session' : 'Sessions'}`;
      case 'Personal Bests':
        return `${count} Personal Best${count === 1 ? '' : 's'}`;
      default:
        return `${count} Sessions`;
    }
  }, [filter, filterCounts]);
  const selectedSummaryTitle = isBestsActive ? 'Personal Bests' : selectedCountLabel;
  const selectedSummarySubtitle = isBestsActive
    ? !calibrationComplete
      ? 'Unlocks after calibration completes'
      : personalBestSessions.length > 0
        ? 'Top performance moments'
        : 'No milestones recorded yet'
    : null;
  const milestoneSlots = useMemo<MilestoneSlot[]>(() => {
    const peakSession = personalBestSessions.reduce<Session | null>((best, session) => {
      const peakValue = session.peakLevel ?? Number.NEGATIVE_INFINITY;
      const bestPeak = best?.peakLevel ?? Number.NEGATIVE_INFINITY;
      return peakValue > bestPeak ? session : best;
    }, null);
    const longestSession = personalBestSessions.reduce<Session | null>((best, session) => {
      const durationValue =
        typeof session.durationMs === 'number'
          ? session.durationMs / 1000
          : parseDurationSeconds(session.metrics.duration) ?? Number.NEGATIVE_INFINITY;
      const bestDuration =
        best == null
          ? Number.NEGATIVE_INFINITY
          : typeof best.durationMs === 'number'
            ? best.durationMs / 1000
            : parseDurationSeconds(best.metrics.duration) ?? Number.NEGATIVE_INFINITY;
      return durationValue > bestDuration ? session : best;
    }, null);
    const stabilitySession = personalBestSessions.reduce<Session | null>((best, session) => {
      const stabilityValue = Number(session.metrics.stability ?? Number.NEGATIVE_INFINITY);
      const bestStability = Number(best?.metrics.stability ?? Number.NEGATIVE_INFINITY);
      return stabilityValue > bestStability ? session : best;
    }, null);

    return [
      {
        title: 'Peak Performance',
        value: !calibrationComplete ? 'Locked during calibration' : peakSession ? `${Math.round(peakSession.peakLevel ?? 0)}% peak` : 'Not yet recorded',
        date: peakSession?.date,
      },
      {
        title: 'Longest Duration',
        value: !calibrationComplete ? 'Locked during calibration' : longestSession ? longestSession.metrics.duration : 'Not yet recorded',
        date: longestSession?.date,
      },
      {
        title: 'Strongest Stability',
        value: !calibrationComplete ? 'Locked during calibration' : stabilitySession ? `${Math.round(stabilitySession.metrics.stability)} stability` : 'Not yet recorded',
        date: stabilitySession?.date,
      },
    ];
  }, [calibrationComplete, personalBestSessions]);
  const tabButtonRefs = useRef<Record<SessionFilterKey, HTMLButtonElement | null>>({
    All: null,
    Motion: null,
    Static: null,
    Nocturnal: null,
    'Personal Bests': null,
  });
  const [activeIndicator, setActiveIndicator] = useState({ left: 0, width: 0, ready: false });
  const showAmoraHint =
    amoraEnabled &&
    proactiveInsightsEnabled &&
    amoraGuidanceLevel !== 'minimal' &&
    !!onOpenAmora &&
    sessionPool.length > 0;
  const amoraSummary =
    sessionPool.length === 1
      ? 'Your first session is now shaping the early read of your pattern.'
      : 'Session differences are starting to separate into clearer patterns.';

  useEffect(() => {
    const updateIndicator = () => {
      const activeButton = tabButtonRefs.current[filter];

      if (!activeButton) {
        setActiveIndicator(current => ({ ...current, ready: false }));
        return;
      }

      const nextLeft = activeButton.offsetLeft;
      const nextWidth = activeButton.offsetWidth;
      setActiveIndicator({
        left: nextLeft,
        width: nextWidth,
        ready: true,
      });

      activeButton.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.03)' },
          { transform: 'scale(1)' },
        ],
        {
          duration: 280,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        },
      );
    };

    const frame = window.requestAnimationFrame(updateIndicator);
    const handleResize = () => updateIndicator();
    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
    };
  }, [filter]);

  const filtered = sessionPool.filter(session => {
    if (filter === 'All') return true;
    if (filter === 'Motion') return session.type === 'motion';
    if (filter === 'Static') return session.type === 'static';
    if (filter === 'Nocturnal') return session.type === 'nocturnal';
    if (filter === 'Personal Bests') return session.isPersonalBest;
    return true;
  });

  return (
    <div className="space-y-4">
      <style>{`
        @keyframes session-bests-shimmer {
          0% {
            transform: translateX(-125%) skewX(-18deg);
            opacity: 0;
          }
          24% {
            opacity: 0.24;
          }
          100% {
            transform: translateX(150%) skewX(-18deg);
            opacity: 0;
          }
        }
      `}</style>
      <div className="mb-2">
        <div className="text-lg font-black tracking-tight">Sessions</div>
        <div className="mt-0.5 text-[10px]" style={{ color: foundationTheme.text.muted }}>Early archive</div>
      </div>

      {showAmoraHint ? (
        <InlineAmoraInsight
          variant="read"
          density="compact"
          message={amoraSummary}
          ctaLabel="View interpretation"
          onTap={onOpenAmora}
        />
      ) : null}

      <div className="space-y-2">
        <div className="px-1">
          <div className="text-[11px] font-semibold tracking-[0.03em]" style={{ color: foundationTheme.text.secondary }}>
            {selectedSummaryTitle}
          </div>
          {selectedSummarySubtitle ? (
            <div className="mt-0.5 text-[10px]" style={{ color: foundationTheme.text.muted }}>
              {selectedSummarySubtitle}
            </div>
          ) : null}
        </div>

        <div className="px-0.5">
          <div
            className="relative flex items-stretch gap-2 rounded-full p-[0.34rem]"
            style={{
              background: 'transparent',
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background: hexToRgba('#FFFFFF', 0.05),
                boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.04)}`,
              }}
            />
            {activeIndicator.ready ? (
              <div
                className="pointer-events-none absolute rounded-full"
                style={{
                  left: activeIndicator.left,
                  width: activeIndicator.width,
                  top: 4,
                  bottom: 4,
                  height: 'auto',
                  borderRadius: 999,
                  overflow: 'hidden',
                  background: isBestsActive
                    ? 'linear-gradient(135deg, rgba(255,215,160,0.18), rgba(255,255,255,0.08))'
                    : hexToRgba('#FFFFFF', 0.12),
                  border: isBestsActive ? `1px solid ${hexToRgba('#FFD7A0', 0.25)}` : '1px solid transparent',
                  backdropFilter: 'blur(10px)',
                  boxShadow: isBestsActive
                    ? `inset 0 0 12px ${hexToRgba('#FFD7A0', 0.15)}, inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.08)}, 0 0 16px ${hexToRgba('#FFD7A0', 0.06)}`
                    : `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.08)}, 0 0 14px ${hexToRgba('#FFFFFF', 0.045)}`,
                  transitionProperty: 'left, width, transform',
                  transitionDuration: '300ms',
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                {isBestsActive ? (
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div
                      key={filter}
                      style={{
                        position: 'absolute',
                        insetBlock: 0,
                        left: 0,
                        width: '42%',
                        background: `linear-gradient(90deg, ${hexToRgba('#FFF6E5', 0)}, ${hexToRgba('#FFF6E5', 0.2)}, ${hexToRgba('#FFF6E5', 0)})`,
                        filter: 'blur(1px)',
                        animation: 'session-bests-shimmer 600ms ease-out 1',
                      }}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}

            {filters.map(option => {
              const isActive = filter === option.key;

              return (
                <button
                  key={option.key}
                  ref={element => {
                    tabButtonRefs.current[option.key] = element;
                  }}
                  onClick={() => setFilter(option.key)}
                  className="group relative z-10 flex min-w-0 flex-1 items-center justify-center rounded-full px-3.25 py-2.35 text-center transition-all duration-200 ease-out active:scale-[0.97]"
                  style={{
                    color:
                      isActive && option.key === 'Personal Bests'
                        ? '#FFF6E5'
                        : isActive
                          ? foundationTheme.text.primary
                          : foundationTheme.text.secondary,
                    background: 'transparent',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <span className="block whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.04em]">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          key={selectedFilter.key}
          className="min-h-[1rem] px-1 text-[10px] leading-relaxed transition-opacity duration-200 ease-out"
          style={{ color: foundationTheme.text.muted }}
        >
          {isBestsActive
            ? 'Milestones unlock automatically as stronger sessions are detected.'
            : selectedFilter.description}
        </div>
      </div>

      {isBestsActive ? (
        <div className="space-y-3">
          <div
            className="rounded-[28px] border p-6"
            style={{
              ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: '#D0B08C', tintStrength: 0.026 }),
              borderColor: hexToRgba('#FFD7A0', 0.12),
              boxShadow: `inset 0 1px 0 ${hexToRgba('#FFF6E5', 0.05)}, 0 18px 42px ${hexToRgba('#000000', 0.18)}`,
            }}
          >
            {filtered.length === 0 ? (
              <>
                <div className="text-lg font-black tracking-tight" style={{ color: foundationTheme.text.primary }}>
                  {calibrationComplete ? 'No milestones captured yet' : 'Records locked during calibration'}
                </div>
                <div className="mt-2 text-xs leading-relaxed" style={{ color: foundationTheme.text.secondary }}>
                  {calibrationComplete ? (
                    <>
                      Your standout sessions will appear here as your performance evolves.
                      <br />
                      First peak, longest hold, strongest session, all tracked automatically.
                    </>
                  ) : (
                    <>
                      Calibration sessions are already being preserved.
                      <br />
                      Bests will unlock automatically and include your strongest calibration-phase sessions.
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="text-sm font-semibold tracking-tight" style={{ color: foundationTheme.text.primary }}>
                Standout records across your recent sessions
              </div>
            )}

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {milestoneSlots.map(slot => (
                <MilestoneSlotCard key={slot.title} slot={slot} />
              ))}
            </div>

            <div className="mt-4 text-[10px] leading-relaxed" style={{ color: foundationTheme.text.muted }}>
              {calibrationComplete
                ? 'Milestones unlock automatically as stronger sessions are detected.'
                : 'Records remain locked until calibration reaches 100%.'}
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="space-y-3">
              {filtered.map(session => (
                <SessionCard
                  key={session.id}
                  session={session}
                  calibrationComplete={calibrationComplete}
                  onTap={() => onNavigate(`session-detail:${session.id}`)}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              calibrationComplete={calibrationComplete}
              onTap={() => onNavigate(`session-detail:${session.id}`)}
            />
          ))}
        </div>
      ) : (
        <div
          className="rounded-[28px] border p-6"
          style={{
            ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: foundationTheme.accent.primary, tintStrength: 0.024 }),
            borderColor: hexToRgba('#FFFFFF', 0.072),
          }}
        >
          <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.accent.primary }}>
            Day one archive
          </div>
          <div className="mt-3 text-lg font-black tracking-tight" style={{ color: foundationTheme.text.primary }}>
            No sessions captured yet
          </div>
          <div className="mt-2 text-xs leading-relaxed" style={{ color: foundationTheme.text.secondary }}>
            Your first session will appear here as soon as the system captures one. Session history begins as part of baseline learning and expands with use.
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border p-3" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.022 }), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
              <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>
                Available now
              </div>
              <div className="mt-2 text-xs font-semibold" style={{ color: foundationTheme.text.primary }}>
                Live signal
              </div>
              <div className="mt-1 text-[10px]" style={{ color: foundationTheme.text.secondary }}>
                Resting-state signal is already active while your archive is still empty.
              </div>
            </div>
            <div className="rounded-2xl border p-3" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.022 }), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
              <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>
                Unlocks next
              </div>
              <div className="mt-2 text-xs font-semibold" style={{ color: foundationTheme.text.primary }}>
                First session detail
              </div>
              <div className="mt-1 text-[10px]" style={{ color: foundationTheme.text.secondary }}>
                Capture one early session to begin comparison, detail, and recovery learning.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
