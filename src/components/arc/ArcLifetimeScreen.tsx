import type { ReactNode } from 'react';
import type { ArcAppDataSnapshot } from '../../data/arc-app-data';
import ArcScreenHeader from './ArcScreenHeader';
import { foundationTheme, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';

function LifetimeSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="rounded-[28px] border p-5"
      style={{
        ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: foundationTheme.accent.primary, tintStrength: 0.022 }),
        borderColor: hexToRgba('#FFFFFF', 0.072),
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.text.primary }}>
            {title}
          </div>
          {subtitle ? (
            <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted }}>
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function LifetimeStatCard({
  label,
  value,
  detail,
  tint = foundationTheme.accent.primary,
}: {
  label: string;
  value: string | number;
  detail: string;
  tint?: string;
}) {
  return (
    <div
      className="rounded-[22px] border p-4"
      style={{
        ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint, tintStrength: 0.024 }),
        borderColor: hexToRgba('#FFFFFF', 0.07),
      }}
    >
      <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted }}>
        {label}
      </div>
      <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'heroValue'), color: foundationTheme.text.primary }}>
        {value}
      </div>
      <div className="mt-1 leading-relaxed" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
        {detail}
      </div>
    </div>
  );
}

function RecordRow({
  label,
  value,
  date,
}: {
  label: string;
  value: string;
  date: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted }}>
          {label}
        </div>
        <div className="mt-1 truncate" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.primary }}>
          {value}
        </div>
      </div>
      <div className="shrink-0 text-right" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
        {date}
      </div>
    </div>
  );
}

export default function ArcLifetimeScreen({
  onNavigate,
  data,
}: {
  onNavigate: (screen: string) => void;
  data: ArcAppDataSnapshot;
}) {
  const stats = data.lifetimeStats;
  const hasSessions = stats.totalSessions > 0;
  const archiveReady = data.featureAvailability.lifetime;

  const archiveCards = [
    {
      label: 'Recorded Span',
      value: `${stats.archiveStartLabel} -> ${stats.archiveEndLabel}`,
      detail: `${stats.archiveWindowDays} day${stats.archiveWindowDays === 1 ? '' : 's'} from first to latest recorded session`,
      tint: foundationTheme.accent.primary,
    },
    {
      label: 'Active Days',
      value: stats.activeDays,
      detail: 'Distinct days represented in the retained archive',
      tint: foundationTheme.signal.up,
    },
    {
      label: 'Sessions / Day',
      value: stats.sessionsPerActiveDay,
      detail: 'Average capture density across active days',
      tint: foundationTheme.signal.warning,
    },
    {
      label: 'Personal Bests',
      value: stats.totalPersonalBestSessions,
      detail: 'Current class champions held until beaten',
      tint: foundationTheme.accent.secondary,
    },
  ];

  const sessionMixCards = [
    {
      label: 'Total Sessions',
      value: stats.totalSessions,
      detail: 'All retained captured sessions',
      tint: foundationTheme.text.highlight,
    },
    {
      label: 'Motion',
      value: stats.totalMotionSessions,
      detail: `${stats.motionSessionShare} of archive`,
      tint: foundationTheme.signal.down,
    },
    {
      label: 'Static',
      value: stats.totalStaticSessions,
      detail: `${stats.staticSessionShare} of archive`,
      tint: foundationTheme.chart.waking,
    },
    {
      label: 'Nocturnal',
      value: stats.totalNocturnalSessions,
      detail: `${stats.nocturnalSessionShare} of archive`,
      tint: foundationTheme.chart.nocturnal,
    },
    {
      label: 'Peak-Line Hits',
      value: stats.peakSessionsAtOrAbovePeakLine,
      detail: 'Sessions that reached or exceeded your personal peak line',
      tint: foundationTheme.signal.warning,
    },
    {
      label: 'Record-Line Hits',
      value: stats.peakSessionsAtOrAboveRecordLine,
      detail: 'Sessions that entered your above-average record band',
      tint: foundationTheme.accent.secondary,
    },
  ];

  const durationPeakCards = [
    { label: 'Total Active Time', value: stats.totalActiveTime, detail: 'Combined duration across the full archive', tint: foundationTheme.accent.primary },
    { label: 'Motion Time', value: stats.totalMotionTime, detail: 'Combined duration of motion sessions', tint: foundationTheme.signal.down },
    { label: 'Static Time', value: stats.totalStaticTime, detail: 'Combined duration of static sessions', tint: foundationTheme.chart.waking },
    { label: 'Nocturnal Time', value: stats.totalNocturnalTime, detail: 'Combined duration of nocturnal sessions', tint: foundationTheme.chart.nocturnal },
    { label: 'Average Duration', value: stats.averageSessionDuration, detail: 'Mean duration across all sessions', tint: foundationTheme.signal.warning },
    { label: 'Longest Session', value: stats.longestSession, detail: 'Longest retained session', tint: foundationTheme.signal.up },
    { label: 'Shortest Session', value: stats.shortestSession, detail: 'Shortest retained session', tint: foundationTheme.text.secondary },
    { label: 'Best Peak', value: stats.bestPeak, detail: 'Highest recorded fullness across sessions', tint: foundationTheme.accent.secondary },
    { label: 'Average Peak', value: stats.averagePeak, detail: 'Mean peak fullness across all session classes', tint: foundationTheme.text.highlight },
    { label: 'Motion Peak', value: stats.averageMotionPeak, detail: 'Average peak for motion sessions', tint: foundationTheme.signal.down },
    { label: 'Static Peak', value: stats.averageStaticPeak, detail: 'Average peak for static sessions', tint: foundationTheme.chart.waking },
    { label: 'Nocturnal Peak', value: stats.averageNocturnalPeak, detail: 'Average peak for nocturnal sessions', tint: foundationTheme.chart.nocturnal },
  ];

  const buildRecoveryCards = [
    { label: 'Fastest Build', value: stats.fastestBuild, detail: 'Best rise/build result recorded', tint: foundationTheme.accent.primary },
    { label: 'Average Build', value: stats.averageBuild, detail: 'Mean build time across the archive', tint: foundationTheme.text.highlight },
    { label: 'Motion Build', value: stats.averageMotionBuild, detail: 'Average build time for motion sessions', tint: foundationTheme.signal.down },
    { label: 'Static Build', value: stats.averageStaticBuild, detail: 'Average build time for static sessions', tint: foundationTheme.chart.waking },
    { label: 'Fastest Recovery', value: stats.fastestRecovery, detail: 'Quickest recovery observed', tint: foundationTheme.signal.up },
    { label: 'Average Recovery', value: stats.averageRecovery, detail: 'Mean recovery duration across sessions', tint: foundationTheme.signal.warning },
    { label: 'Fastest Rebound', value: stats.fastestRebound, detail: 'Shortest rebound window recorded', tint: foundationTheme.accent.secondary },
    { label: 'Average Rebound', value: stats.averageRebound, detail: 'Mean rebound duration where captured', tint: foundationTheme.text.highlight },
    { label: 'Average Hold Score', value: stats.averageHoldScore, detail: 'Hold quality score averaged across sessions', tint: foundationTheme.signal.warning },
    { label: 'Average Stability', value: stats.averageStability, detail: 'Mean stability across all sessions', tint: foundationTheme.text.highlight },
    { label: 'Best Stability', value: stats.bestStability, detail: 'Highest recorded stability score', tint: foundationTheme.signal.up },
    { label: 'Motion / Static / Night', value: `${stats.averageMotionStability} / ${stats.averageStaticStability} / ${stats.averageNocturnalStability}`, detail: 'Average stability by session class', tint: foundationTheme.accent.primary },
  ];

  const motionCards = [
    { label: 'Archive Drives', value: stats.lifetimeDriveCount, detail: 'Total repeated motion cycles detected', tint: foundationTheme.signal.down },
    { label: 'Average Drive Count', value: stats.averageDriveCount, detail: 'Mean drive count per motion session', tint: foundationTheme.signal.warning },
    { label: 'Best Drive Count', value: stats.bestDriveCount, detail: 'Highest drive count recorded', tint: foundationTheme.accent.secondary },
    { label: 'Average Cadence', value: stats.averageCadence, detail: 'Mean cadence across motion sessions', tint: foundationTheme.text.highlight },
    { label: 'Peak Cadence', value: stats.peakCadence, detail: 'Highest sustained cadence captured', tint: foundationTheme.signal.up },
    { label: 'Average Peak Cadence', value: stats.averagePeakCadence, detail: 'Mean of motion-session cadence peaks', tint: foundationTheme.signal.warning },
    { label: 'Rhythm Consistency', value: stats.averageRhythmConsistency, detail: 'Average rhythm consistency score', tint: foundationTheme.text.highlight },
    { label: 'Motion Control', value: stats.averageMotionControl, detail: 'Average IMU motion-stability score', tint: foundationTheme.signal.down },
    { label: 'Drive Interval', value: stats.averageDriveInterval, detail: 'Average spacing between detected drives', tint: foundationTheme.accent.primary },
    { label: 'Rhythm Split', value: `${stats.consistentMotionSessions} / ${stats.variableMotionSessions} / ${stats.irregularMotionSessions}`, detail: 'Consistent, variable, and irregular motion sessions', tint: foundationTheme.signal.warning },
  ];

  const nocturnalCards = [
    { label: 'Total Nocturnal Events', value: stats.totalNocturnalEvents, detail: 'Combined overnight event count', tint: foundationTheme.chart.nocturnal },
    { label: 'Avg Events / Night', value: stats.averageNocturnalEvents, detail: 'Average nocturnal events per recorded night session', tint: foundationTheme.signal.warning },
    { label: 'Strongest Set', value: stats.strongestNocturnalSet, detail: 'Largest overnight set detected in one session', tint: foundationTheme.accent.secondary },
    { label: 'Avg Nocturnal Quality', value: stats.averageNocturnalQuality, detail: 'Average overnight quality score', tint: foundationTheme.text.highlight },
    { label: 'Best Nocturnal Quality', value: stats.bestNocturnalQuality, detail: 'Strongest overnight quality score', tint: foundationTheme.signal.up },
    { label: 'Avg Nocturnal Duration', value: stats.averageNocturnalDuration, detail: 'Average duration of nocturnal sessions', tint: foundationTheme.chart.nocturnal },
  ];

  return (
    <div className="space-y-4">
      <ArcScreenHeader title="Archive" onBack={() => onNavigate('milestones')} />

      <div
        className="rounded-[30px] border p-6"
        style={{
          ...getArcGlassSurfaceStyle(foundationTheme, 'hero', { tint: foundationTheme.accent.primary, tintStrength: 0.034 }),
          borderColor: hexToRgba('#FFFFFF', 0.076),
        }}
      >
        <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.accent.primary }}>
          {hasSessions ? 'Full archive intelligence' : 'Awaiting first session'}
        </div>
        <div
          className="mt-3"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'displayHero'),
            color: foundationTheme.text.highlight,
            fontSize: hasSessions ? '2.15rem' : '1.85rem',
          }}
        >
          {hasSessions
            ? `${stats.totalSessions} sessions / ${stats.totalActiveTime}`
            : 'Archive analytics begin after your first captured session'}
        </div>
        <div className="mt-3" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.secondary }}>
          {hasSessions
            ? archiveReady
              ? 'Every statistic available from the retained session archive is being tallied here across build, peak, hold, motion, nocturnal support, and records.'
              : 'The archive is already calculating full session statistics. Longer-range confidence will keep strengthening as more history accumulates.'
            : 'Once the first qualifying session is captured, this tab starts calculating every available archive statistic automatically.'}
        </div>
        <div
          className="mt-5 rounded-[22px] border px-4 py-3"
          style={{
            ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.026 }),
            borderColor: hexToRgba('#FFFFFF', 0.07),
          }}
        >
          <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted }}>
            {archiveReady ? 'Archive status' : 'Archive maturity'}
          </div>
          <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
            {hasSessions
              ? `Archive record spans ${stats.archiveStartLabel} through ${stats.archiveEndLabel} across ${stats.activeDays} active day${stats.activeDays === 1 ? '' : 's'}.`
              : 'No session archive has been captured yet.'}
          </div>
        </div>
      </div>

      <LifetimeSection title="Archive Coverage" subtitle="First-to-latest span, active days, and capture density">
        <div className="grid grid-cols-2 gap-3">
          {archiveCards.map(card => (
            <LifetimeStatCard key={card.label} {...card} />
          ))}
        </div>
      </LifetimeSection>

      <LifetimeSection title="Session Mix" subtitle="How the retained archive splits across session classes">
        <div className="grid grid-cols-2 gap-3">
          {sessionMixCards.map(card => (
            <LifetimeStatCard key={card.label} {...card} />
          ))}
        </div>
      </LifetimeSection>

      <LifetimeSection title="Duration And Peak" subtitle="Time, peak, and overall range behavior">
        <div className="grid grid-cols-2 gap-3">
          {durationPeakCards.map(card => (
            <LifetimeStatCard key={card.label} {...card} />
          ))}
        </div>
      </LifetimeSection>

      <LifetimeSection title="Build, Recovery, And Hold" subtitle="Rise, recovery, rebound, and stability">
        <div className="grid grid-cols-2 gap-3">
          {buildRecoveryCards.map(card => (
            <LifetimeStatCard key={card.label} {...card} />
          ))}
        </div>
      </LifetimeSection>

      <LifetimeSection title="Motion Archive" subtitle="Everything derived from IMU-qualified motion sessions">
        <div className="grid grid-cols-2 gap-3">
          {motionCards.map(card => (
            <LifetimeStatCard key={card.label} {...card} />
          ))}
        </div>
      </LifetimeSection>

      <LifetimeSection title="Nocturnal Archive" subtitle="Overnight support, event count, and nocturnal quality">
        <div className="grid grid-cols-2 gap-3">
          {nocturnalCards.map(card => (
            <LifetimeStatCard key={card.label} {...card} />
          ))}
        </div>
      </LifetimeSection>

      <LifetimeSection
        title="Archive Records"
        subtitle="Best retained values across the current archive"
      >
        <div className="space-y-4">
          {data.personalRecords.map(record => (
            <RecordRow key={record.label} label={record.label} value={record.value} date={record.date} />
          ))}
        </div>
      </LifetimeSection>
    </div>
  );
}
