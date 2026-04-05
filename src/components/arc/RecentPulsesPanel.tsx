import { useMemo, useState } from 'react';
import { foundationTheme, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';
import PulseExpandedView from './PulseExpandedView';
import {
  formatPulseTimestamp,
  getPulseCategoryLabel,
  getPulseChipStyle,
  getPulsePalette,
  getPulsePriorityLabel,
  PulseGlyph,
} from './pulseAppearance';
import { usePulse } from './pulseManager';

export default function RecentPulsesPanel({
  onAction,
}: {
  onAction?: (payload: Record<string, unknown> | undefined) => void;
}) {
  const { recentPulseHistory, markPulseRead } = usePulse();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const visiblePulses = useMemo(() => recentPulseHistory.slice(0, 8), [recentPulseHistory]);

  return (
    <div
      className="rounded-[26px] border px-4 py-4"
      style={{
        ...getArcGlassSurfaceStyle(foundationTheme, 'light', {
          tint: '#B2CFF2',
          tintStrength: 0.018,
        }),
        borderColor: hexToRgba('#FFFFFF', 0.055),
      }}
    >
      <div className="flex items-end justify-between gap-3">
        <div>
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'sectionTitle'),
              color: hexToRgba(foundationTheme.text.secondary, 0.76),
              letterSpacing: '0.12em',
            }}
          >
            Pulse
          </div>
          <div
            className="mt-1"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
              color: foundationTheme.text.primary,
              fontSize: '0.94rem',
            }}
          >
            Recent Pulses
          </div>
        </div>
        <div style={getPulseChipStyle(hexToRgba(foundationTheme.text.muted, 0.82))}>
          {visiblePulses.length} visible
        </div>
      </div>

      {visiblePulses.length === 0 ? (
        <div
          className="mt-3 rounded-[18px] border px-3 py-3"
          style={{
            background: hexToRgba('#FFFFFF', 0.02),
            borderColor: hexToRgba('#FFFFFF', 0.045),
            color: foundationTheme.text.muted,
            ...getArcTypographyStyle(foundationTheme, 'caption'),
          }}
        >
          New Pulse signals will collect here as accomplishments, insights, and guidance appear across the app.
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {visiblePulses.map(pulse => {
            const palette = getPulsePalette(pulse);
            const expanded = expandedId === pulse.id;

            return (
              <div key={pulse.id}>
                <button
                  type="button"
                  onClick={() => {
                    markPulseRead(pulse.id);
                    setExpandedId(current => (current === pulse.id ? null : pulse.id));
                  }}
                  className="relative flex w-full items-start gap-3 overflow-hidden rounded-[18px] border px-3 py-3 text-left transition-all duration-200"
                  style={{
                    background: hexToRgba('#FFFFFF', expanded ? 0.03 : 0.022),
                    borderColor: expanded ? palette.border : hexToRgba('#FFFFFF', 0.045),
                  }}
                >
                  <div className="pointer-events-none absolute inset-y-3 left-0 w-px" style={{ background: palette.edge }} />
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border"
                    style={{
                      background: palette.surface,
                      borderColor: palette.chipBorder,
                    }}
                  >
                    <PulseGlyph iconType={pulse.iconType} color={palette.accent} className="h-3 w-3" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: pulse.isRead ? hexToRgba(palette.historyDot, 0.24) : palette.historyDot }}
                        />
                        <span
                          className="rounded-full border px-2 py-[0.14rem]"
                          style={{
                            ...getPulseChipStyle(palette.categoryChipText),
                            background: palette.categoryChip,
                            borderColor: palette.categoryChipBorder,
                          }}
                        >
                          {getPulseCategoryLabel(pulse.category)}
                        </span>
                        <span
                          className="rounded-full border px-2 py-[0.14rem]"
                          style={{
                            ...getPulseChipStyle(palette.chipText),
                            background: palette.chip,
                            borderColor: palette.chipBorder,
                          }}
                        >
                          {getPulsePriorityLabel(pulse.priority)}
                        </span>
                      </div>
                      <div style={getPulseChipStyle(hexToRgba(foundationTheme.text.muted, 0.78))}>
                        {formatPulseTimestamp(pulse.timestamp)}
                      </div>
                    </div>
                    <div
                      className="mt-1"
                      style={{
                        ...getArcTypographyStyle(foundationTheme, 'body'),
                        color: foundationTheme.text.primary,
                        fontSize: '0.74rem',
                      }}
                    >
                      {pulse.title}
                    </div>
                    <div
                      className="mt-0.5 overflow-hidden"
                      style={{
                        ...getArcTypographyStyle(foundationTheme, 'caption'),
                        color: foundationTheme.text.muted,
                        fontSize: '0.61rem',
                        lineHeight: 1.25,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {pulse.message}
                    </div>
                  </div>
                </button>

                {expanded ? (
                  <PulseExpandedView
                    pulse={pulse}
                    compact
                    onClose={() => setExpandedId(null)}
                    onAction={
                      pulse.actionType === 'navigate' && onAction
                        ? () => onAction(pulse.actionPayload)
                        : undefined
                    }
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
