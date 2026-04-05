import type { ArcCalibrationTrack } from '../../data/arc-app-data';
import { foundationTheme, getArcGlassPillStyle, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';

function TrackProgressRing({
  progress,
  compact,
}: {
  progress: number;
  compact?: boolean;
}) {
  const size = compact ? 58 : 72;
  const radius = compact ? 21 : 27;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - circumference * progress;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={foundationTheme.chart.grid}
        strokeWidth={compact ? 5 : 6}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={foundationTheme.accent.primary}
        strokeWidth={compact ? 5 : 6}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill={foundationTheme.text.highlight}
        style={{
          ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
          fontSize: compact ? '0.55rem' : '0.65rem',
        }}
      >
        {Math.round(progress * 100)}%
      </text>
    </svg>
  );
}

function CalibrationTrackCard({
  track,
  compact,
}: {
  track: ArcCalibrationTrack;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-[26px] border ${compact ? 'p-4' : 'p-5'}`}
      style={{
        ...getArcGlassSurfaceStyle(
          foundationTheme,
          compact ? 'light' : 'medium',
          track.established ? { tint: foundationTheme.accent.primary, tintStrength: compact ? 0.028 : 0.034 } : undefined,
        ),
        borderColor: track.established
          ? hexToRgba(foundationTheme.accent.primary, 0.18)
          : hexToRgba('#FFFFFF', 0.072),
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="max-w-[210px]">
          <div style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary }}>
            {track.title}
          </div>
          <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.accent.primary }}>
            {track.targetLabel}
          </div>
        </div>
        <TrackProgressRing progress={track.progress} compact={compact} />
      </div>

      <div className="mt-4" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.secondary }}>
        {track.supportingCopy}
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto] items-end gap-3">
        <div>
          <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted }}>
            {track.statusTitle}
          </div>
          <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
            {track.completionLine}
          </div>
        </div>
        <div
          className="rounded-full border px-3 py-1"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
            ...getArcGlassPillStyle(
              foundationTheme,
              'light',
              track.established ? { tint: foundationTheme.accent.primary, tintStrength: 0.032 } : undefined,
            ),
            color: track.established ? foundationTheme.accent.primary : foundationTheme.text.secondary,
            borderColor: track.established ? hexToRgba(foundationTheme.accent.primary, 0.2) : foundationTheme.border.soft,
          }}
        >
          {track.progressLabel}
        </div>
      </div>
    </div>
  );
}

export default function ArcCalibrationChecklist({
  tracks,
  compact = false,
  showHeader = true,
}: {
  tracks: ArcCalibrationTrack[];
  compact?: boolean;
  showHeader?: boolean;
}) {
  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      {showHeader ? (
        <div>
          <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.accent.primary }}>
            Profile Formation
          </div>
          <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.secondary }}>
              Cinder is establishing your resting baseline, peak reference, and overnight profile together.
          </div>
          <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted }}>
            This is a living model, not a checklist. Each capture refines what the system can trust next.
          </div>
        </div>
      ) : null}

      <div className={compact ? 'space-y-3' : 'space-y-4'}>
        {tracks.map(track => (
          <CalibrationTrackCard key={track.key} track={track} compact={compact} />
        ))}
      </div>
    </div>
  );
}
