import { sessions } from '../../data/arc-mock-data';
import type { Session } from '../../data/arc-types';
import { InlineAmoraInsight, type ArcAmoraGuidanceLevel } from './ArcAmora';
import { foundationTheme, getArcGlassPillStyle, getArcGlassSurfaceStyle, hexToRgba } from './arc-theme';

function buildWaveformPath(values: number[], width: number, height: number, padding = 6) {
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

function MetricTile({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div>
      <div className="text-[9px]" style={{ color: foundationTheme.text.muted }}>{label}</div>
      <div className="text-xl font-black">{value ?? '--'}</div>
    </div>
  );
}

function formatAnalysisValue(value?: number) {
  return typeof value === 'number' ? `${Math.round(value)}` : '--';
}

function SignalWaveformPanel({
  title,
  subtitle,
  series,
  stroke,
  motionSeries,
  motionStroke,
}: {
  title: string;
  subtitle: string;
  series: number[] | undefined;
  stroke: string;
  motionSeries?: number[];
  motionStroke?: string;
}) {
  const primarySeries = series && series.length > 0 ? series : [20, 24, 36, 52, 68, 75, 70, 58, 42, 29, 23];
  const primaryPath = buildWaveformPath(primarySeries, 300, 86, 8);
  const motionPath =
    motionSeries && motionSeries.length > 0
      ? buildWaveformPath(motionSeries, 300, 36, 3)
      : '';

  return (
    <div className="rounded-3xl border p-5" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.022 }), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
      <div className="mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>{title}</div>
      <div className="mb-4 text-[11px]" style={{ color: foundationTheme.text.secondary }}>{subtitle}</div>
      <div className="relative overflow-hidden rounded-[22px] border px-3 py-3" style={{ background: foundationTheme.surface.graph, borderColor: hexToRgba('#FFFFFF', 0.06) }}>
        <svg className="h-[92px] w-full" viewBox="0 0 300 92" preserveAspectRatio="none">
          <path d={primaryPath} stroke={stroke} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {motionPath ? (
            <g transform="translate(0, 54)">
              <path d={motionPath} stroke={motionStroke ?? hexToRgba(foundationTheme.signal.down, 0.54)} strokeWidth="1.25" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ) : null}
        </svg>
      </div>
    </div>
  );
}

function getSessionInterpretation(session: Session) {
  if (session.type === 'motion') {
    const rhythmConsistency = session.motion?.rhythmConsistency ?? 0;
    return rhythmConsistency >= 78
      ? 'Movement stayed controlled and the hold remained relatively clean.'
      : 'This session peaked well, but hold stability dropped earlier under motion.';
  }

  if (session.type === 'static') {
    return session.metrics.stability >= 80
      ? 'Build and hold stayed controlled with minimal early softening.'
      : 'This session built cleanly, but staying power softened earlier than usual.';
  }

  return typeof session.nocturnalQuality === 'number' && session.nocturnalQuality >= 80
    ? 'Overnight support stayed relatively steady through the main hold.'
    : 'Overnight support was present, but lighter than your stronger nights.';
}

export default function ArcSessionDetail({
  sessionId,
  onBack,
  sessionsData = [],
  calibrationComplete = true,
  amoraEnabled = true,
  proactiveInsightsEnabled = true,
  amoraGuidanceLevel = 'standard',
  onOpenAmora,
}: {
  sessionId: string;
  onBack: () => void;
  sessionsData?: Session[];
  calibrationComplete?: boolean;
  amoraEnabled?: boolean;
  proactiveInsightsEnabled?: boolean;
  amoraGuidanceLevel?: ArcAmoraGuidanceLevel;
  onOpenAmora?: () => void;
}) {
  const sessionPool = [...sessionsData, ...sessions.filter(session => !sessionsData.some(item => item.id === session.id))];
  const session = sessionPool.find(item => item.id === sessionId);

  if (!session) {
    return <div className="p-6" style={{ color: foundationTheme.text.muted }}>Session not found.</div>;
  }

  const statusColors: Record<string, { color: string; background: string; borderColor: string }> = {
    'Strong Session': { color: foundationTheme.signal.up, background: hexToRgba(foundationTheme.signal.up, 0.1), borderColor: hexToRgba(foundationTheme.signal.up, 0.2) },
    'Steady Session': { color: foundationTheme.chart.waking, background: hexToRgba(foundationTheme.chart.waking, 0.1), borderColor: hexToRgba(foundationTheme.chart.waking, 0.2) },
    'Variable Session': { color: foundationTheme.signal.warning, background: hexToRgba(foundationTheme.signal.warning, 0.1), borderColor: hexToRgba(foundationTheme.signal.warning, 0.2) },
    'Above Baseline': { color: foundationTheme.chart.nocturnal, background: hexToRgba(foundationTheme.chart.nocturnal, 0.1), borderColor: hexToRgba(foundationTheme.chart.nocturnal, 0.2) },
    'Baseline': { color: foundationTheme.text.secondary, background: foundationTheme.surface.pill, borderColor: foundationTheme.border.soft },
    'Calibration Session': { color: foundationTheme.accent.primary, background: hexToRgba(foundationTheme.accent.primary, 0.08), borderColor: hexToRgba(foundationTheme.accent.primary, 0.16) },
  };
  const sessionStatusLabel = calibrationComplete ? session.statusLabel : 'Calibration Session';
  const sessionStatus = statusColors[sessionStatusLabel] ?? { color: foundationTheme.text.secondary, background: foundationTheme.surface.pill, borderColor: foundationTheme.border.soft };
  const metaLine = session.time ? `${session.date} / ${session.time}` : session.date;
  const showAmoraInsight =
    amoraEnabled &&
    proactiveInsightsEnabled &&
    amoraGuidanceLevel !== 'minimal' &&
    !!onOpenAmora;
  const typeLabel =
    session.type === 'motion'
      ? 'Motion Session'
      : session.type === 'static'
        ? 'Static Session'
        : 'Nocturnal Session';
  const waveformStroke =
    session.type === 'motion'
      ? hexToRgba(foundationTheme.accent.primary, 0.76)
      : session.type === 'nocturnal'
        ? hexToRgba(foundationTheme.chart.nocturnal, 0.72)
        : hexToRgba(foundationTheme.chart.waking, 0.72);

  return (
    <div className="space-y-4">
      <div className="mb-2 flex items-center gap-3">
        <button onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-full border transition-colors" style={{ ...getArcGlassPillStyle(foundationTheme, 'light'), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex-1">
          <div className="text-sm font-bold">{typeLabel}</div>
          <div className="text-[10px]" style={{ color: foundationTheme.text.muted }}>{metaLine}</div>
        </div>
        <span className="rounded-full border px-2.5 py-1 text-[9px] font-bold" style={sessionStatus}>
          {sessionStatusLabel}
        </span>
      </div>

      <div className="rounded-3xl border p-5" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: session.type === 'nocturnal' ? foundationTheme.chart.nocturnal : foundationTheme.accent.primary, tintStrength: 0.024 }), borderColor: hexToRgba('#FFFFFF', 0.072) }}>
        <div className="mb-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>
          {session.type === 'nocturnal' ? 'Nocturnal Summary' : 'Session Summary'}
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <MetricTile label="Peak" value={typeof session.peakLevel === 'number' ? `${session.peakLevel.toFixed(0)}%` : '--'} />
          <MetricTile label="Hold" value={session.metrics.holdQuality ?? session.metrics.stability} />
          <MetricTile label="Build" value={session.metrics.buildSpeed} />
          <MetricTile label="Duration" value={session.metrics.duration} />
          <MetricTile label="Recovery" value={session.metrics.recovery} />
          <MetricTile label={session.type === 'nocturnal' ? 'Quality' : 'Peak Quality'} value={session.overnightStability ?? session.metrics.peakQuality} />
          {session.metrics.rebound ? <MetricTile label="Rebound" value={session.metrics.rebound} /> : null}
          {session.type !== 'nocturnal' ? <MetricTile label="Stability" value={session.metrics.stability} /> : null}
        </div>
      </div>

      {showAmoraInsight ? (
        <InlineAmoraInsight
          variant="read"
          density="regular"
          message={getSessionInterpretation(session)}
          ctaLabel="View interpretation"
          onTap={onOpenAmora}
        />
      ) : null}

      <SignalWaveformPanel
        title={session.type === 'motion' ? 'Performance Trace' : session.type === 'nocturnal' ? 'Overnight Trace' : 'Erection Trace'}
        subtitle={
          session.type === 'motion'
            ? 'Erection behavior is shown above, with intimate motion activity layered below.'
            : session.type === 'nocturnal'
              ? 'This nocturnal event is stored separately from daytime sessions.'
              : 'Static sessions stay erection-focused and omit motion analysis.'
        }
        series={session.erectionWaveform}
        stroke={waveformStroke}
        motionSeries={session.type === 'motion' ? session.motionWaveform : undefined}
        motionStroke={hexToRgba(foundationTheme.signal.down, 0.58)}
      />

      {session.motion ? (
        <div className="rounded-3xl border p-5" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.signal.down, tintStrength: 0.024 }), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
          <div className="mb-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>Motion Analysis</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <MetricTile label="Drive Count" value={session.motion.driveCount} />
            <MetricTile label="Avg Cadence" value={session.motion.cadenceAvg ?? session.motion.cadence} />
            <MetricTile label="Peak Cadence" value={session.motion.cadencePeak ?? session.motion.cadence} />
            <MetricTile label="Rhythm" value={session.motion.rhythm} />
            <MetricTile label="Consistency" value={session.motion.rhythmConsistency != null ? `${session.motion.rhythmConsistency}%` : undefined} />
            <MetricTile label="Motion Duration" value={session.motion.motionDuration ?? session.motion.activeDuration} />
            <MetricTile label="Avg Interval" value={session.motion.averageDriveInterval} />
            <MetricTile label="Intensity" value={session.motion.motionIntensity} />
          </div>
        </div>
      ) : null}

      {session.analysis ? (
        <div className="rounded-3xl border p-5" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.02 }), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
          <div className="mb-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>Performance Analysis</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <MetricTile label="Session Quality" value={formatAnalysisValue(session.analysis.sessionQualityScore)} />
            <MetricTile label="Control" value={formatAnalysisValue(session.analysis.controlScore)} />
            <MetricTile label="Peak Integrity" value={formatAnalysisValue(session.analysis.peakIntegrityScore)} />
            <MetricTile label="Hold Efficiency" value={formatAnalysisValue(session.analysis.holdEfficiencyScore)} />
            <MetricTile label="Build Efficiency" value={formatAnalysisValue(session.analysis.buildEfficiencyScore)} />
            <MetricTile label="Recovery Efficiency" value={formatAnalysisValue(session.analysis.recoveryEfficiencyScore)} />
            {session.type === 'motion' ? (
              <>
                <MetricTile label="Motion Efficiency" value={formatAnalysisValue(session.analysis.motionEfficiencyScore)} />
                <MetricTile label="Rhythm Control" value={formatAnalysisValue(session.analysis.rhythmControlScore)} />
              </>
            ) : null}
            {session.type === 'nocturnal' ? (
              <MetricTile label="Night Regularity" value={formatAnalysisValue(session.analysis.overnightRegularityScore)} />
            ) : null}
          </div>
        </div>
      ) : null}

      {session.insights.length > 0 ? (
        <div className="rounded-3xl border p-5" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.022 }), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
          <div className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>Insights</div>
          <div className="space-y-2">
            {session.insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full" style={{ background: foundationTheme.accent.primary }} />
                <div className="text-xs leading-relaxed" style={{ color: foundationTheme.text.secondary }}>{insight}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
