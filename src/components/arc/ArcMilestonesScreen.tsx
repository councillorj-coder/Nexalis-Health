import type { ArcAppDataSnapshot } from '../../data/arc-app-data';
import type { ArcAmoraGuidanceLevel, ArcAmoraSettings } from './ArcAmora';
import { foundationTheme, getArcGlassPillStyle, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';

function formatArchiveHoursLogged(totalActiveTime: string) {
  const hoursMatch = totalActiveTime.match(/(\d+)h/i);
  const minutesMatch = totalActiveTime.match(/(\d+)m/i);
  const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? Number(minutesMatch[1]) : 0;
  const totalHours = hours + minutes / 60;

  if (totalHours >= 10) {
    return `${Math.round(totalHours)} hours logged`;
  }

  if (totalHours >= 1) {
    const formatted = totalHours.toFixed(1).replace(/\.0$/, '');
    return `${formatted} hours logged`;
  }

  return '0 hours logged';
}

function SettingsToggleRow({
  title,
  description,
  enabled,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="rounded-[22px] border px-4 py-3"
      style={{
        ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.022 }),
        borderColor: hexToRgba('#FFFFFF', 0.068),
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary, fontSize: '0.84rem' }}>
            {title}
          </div>
          <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
            {description}
          </div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="relative flex h-7 w-[58px] items-center rounded-full border px-1 transition-all duration-300"
          style={{
            background: enabled
              ? hexToRgba(foundationTheme.accent.primary, 0.18)
              : hexToRgba(foundationTheme.text.primary, 0.08),
            borderColor: enabled
              ? hexToRgba(foundationTheme.accent.primary, 0.24)
              : foundationTheme.border.soft,
          }}
          aria-pressed={enabled}
        >
          <span
            className="absolute left-1 top-1 h-5 w-5 rounded-full transition-all duration-300"
            style={{
              background: enabled ? foundationTheme.accent.primary : foundationTheme.text.muted,
              boxShadow: `0 4px 10px ${hexToRgba(foundationTheme.text.inverse, 0.18)}`,
              transform: enabled ? 'translateX(30px)' : 'translateX(0px)',
            }}
          />
          <span
            className="absolute inset-0 flex items-center justify-center"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'label'),
              color: enabled ? foundationTheme.text.primary : foundationTheme.text.muted,
              letterSpacing: '0.08em',
              fontSize: '0.42rem',
            }}
          >
            {enabled ? 'On' : 'Off'}
          </span>
        </button>
      </div>
    </div>
  );
}

export default function ArcMilestonesScreen({
  onNavigate,
  data,
  onResetData,
  onOpenDeviceHub,
  amoraSettings,
  homeScreenLiveViewEnabled,
  homeScreenTrendViewEnabled,
  onToggleAmoraEnabled,
  onToggleProactiveInsights,
  onGuidanceLevelChange,
  onPartnerAwarenessGuidanceChange,
  onToggleHomeScreenLiveView,
  onToggleHomeScreenTrendView,
  onResetAmoraIntro,
}: {
  onNavigate: (screen: string) => void;
  data: ArcAppDataSnapshot;
  onResetData: () => void;
  onOpenDeviceHub: () => void;
  amoraSettings: ArcAmoraSettings;
  homeScreenLiveViewEnabled: boolean;
  homeScreenTrendViewEnabled: boolean;
  onToggleAmoraEnabled: () => void;
  onToggleProactiveInsights: () => void;
  onGuidanceLevelChange: (value: ArcAmoraGuidanceLevel) => void;
  onPartnerAwarenessGuidanceChange: (value: ArcAmoraSettings['partnerAwarenessGuidance']) => void;
  onToggleHomeScreenLiveView: () => void;
  onToggleHomeScreenTrendView: () => void;
  onResetAmoraIntro: () => void;
}) {
  const showAmoraControls = false;
  const guidanceLevels: ArcAmoraGuidanceLevel[] = ['minimal', 'standard', 'detailed'];
  const partnerGuidanceModes: ArcAmoraSettings['partnerAwarenessGuidance'][] = ['on', 'reduced', 'off'];
  const archiveHoursLogged = formatArchiveHoursLogged(data.lifetimeStats.totalActiveTime);

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <div
          style={{
            ...getArcTypographyStyle(foundationTheme, 'sectionTitle'),
            color: hexToRgba('#F1EEE8', 0.84),
            letterSpacing: '0.16em',
            fontSize: '0.68rem',
            fontWeight: 600,
          }}
        >
          ARCHIVE
        </div>
        <div
          style={{
            ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
            color: hexToRgba(foundationTheme.text.primary, 0.78),
            fontSize: '0.86rem',
          }}
        >
          {data.lifetimeStats.totalSessions} sessions recorded
        </div>
        <div
          style={{
            ...getArcTypographyStyle(foundationTheme, 'caption'),
            color: hexToRgba(foundationTheme.text.secondary, 0.74),
            fontSize: '0.72rem',
          }}
        >
          {archiveHoursLogged}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onNavigate('lifetime')}
        className="group relative w-full overflow-hidden rounded-[30px] border px-5 py-5 text-left transition-all duration-300 active:scale-[1.012]"
        style={{
          ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.024 }),
          borderColor: hexToRgba('#FFFFFF', 0.07),
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-10"
          style={{ background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.024)} 0%, transparent 100%)` }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100"
          style={{ background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.016)} 0%, ${hexToRgba('#FFFFFF', 0.008)} 100%)` }}
        />
        <div className="relative flex items-end justify-between gap-4">
          <div className="min-w-0 pb-0.5">
            <div
              style={{
                ...getArcTypographyStyle(foundationTheme, 'displayHero'),
                color: foundationTheme.text.highlight,
                fontSize: '1.62rem',
                lineHeight: 0.96,
              }}
            >
              Enter Archive
            </div>
            <div
              className="mt-2"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'body'),
                color: hexToRgba(foundationTheme.text.secondary, 0.82),
                fontSize: '0.88rem',
              }}
            >
              Your full recorded profile across time.
            </div>
          </div>
          <div className="shrink-0 text-right pb-0.5">
            <div
              style={{
                ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
                color: hexToRgba(foundationTheme.text.primary, 0.76),
                fontSize: '0.9rem',
              }}
            >
              {data.lifetimeStats.totalSessions} sessions
            </div>
          </div>
        </div>
      </button>

      <div className="rounded-[28px] border p-5" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: foundationTheme.accent.primary, tintStrength: 0.024 }), borderColor: hexToRgba('#FFFFFF', 0.072) }}>
        <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.text.muted }}>
          Unlock journey
        </div>
        <div className="mt-4 space-y-3">
          {data.milestones.map(milestone => (
            <div
              key={milestone.id}
              className="rounded-[22px] border px-4 py-3"
              style={{
                background: milestone.achieved ? hexToRgba(foundationTheme.accent.primary, 0.06) : foundationTheme.surface.inset,
                borderColor: milestone.achieved ? hexToRgba(foundationTheme.accent.primary, 0.16) : foundationTheme.border.soft,
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary }}>
                    {milestone.title}
                  </div>
                  <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
                    {milestone.subtitle}
                  </div>
                </div>
                <div
                  className="rounded-full border px-2.5 py-1"
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                    ...getArcGlassPillStyle(
                      foundationTheme,
                      'light',
                      milestone.achieved ? { tint: foundationTheme.accent.primary, tintStrength: 0.03 } : undefined,
                    ),
                    color: milestone.achieved ? foundationTheme.accent.primary : foundationTheme.text.muted,
                    borderColor: milestone.achieved ? hexToRgba(foundationTheme.accent.primary, 0.18) : foundationTheme.border.soft,
                  }}
                >
                  {milestone.achieved ? 'Live' : 'Pending'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>
          Profile Settings
        </div>
        <div
          className="rounded-[28px] border p-4"
          style={{
            ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: foundationTheme.accent.primary, tintStrength: 0.024 }),
            borderColor: hexToRgba('#FFFFFF', 0.072),
          }}
        >
          <div
            className="rounded-[24px] border p-4"
            style={{
              ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.026 }),
              borderColor: hexToRgba('#FFFFFF', 0.07),
            }}
          >
            <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.text.primary }}>
              UI Controls
            </div>
            <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted }}>
              Choose which key modules stay visible across your private interface.
            </div>

            <div
              className="mt-4 rounded-[22px] border p-4"
              style={{
                ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.text.primary, tintStrength: 0.016 }),
                borderColor: hexToRgba('#FFFFFF', 0.065),
              }}
            >
              <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.text.primary }}>
                Home Screen
              </div>
              <div className="mt-2 space-y-3">
                <SettingsToggleRow
                  title="Live View"
                  description="Show or hide the live chart module on Home."
                  enabled={homeScreenLiveViewEnabled}
                  onToggle={onToggleHomeScreenLiveView}
                />
                <SettingsToggleRow
                  title="Trend View"
                  description="Show or hide the historical Trend View chart on Home once 24 hours of history has been collected."
                  enabled={homeScreenTrendViewEnabled}
                  onToggle={onToggleHomeScreenTrendView}
                />
              </div>
            </div>
          </div>

          {showAmoraControls ? (
            <div
              className="mt-3 rounded-[24px] border p-4"
              style={{
                ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.026 }),
                borderColor: hexToRgba('#FFFFFF', 0.07),
              }}
            >
              <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.text.primary }}>
                Amora Assistant
              </div>
              <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted }}>
                Guided explanations and insights throughout the app.
              </div>

              <div className="mt-4 space-y-3">
                <SettingsToggleRow
                  title="Amora Assistant"
                  description="Provides guided explanations and insights throughout the app."
                  enabled={amoraSettings.enabled}
                  onToggle={onToggleAmoraEnabled}
                />
                <SettingsToggleRow
                  title="Proactive Insights"
                  description="Show automatic explanations when changes or new states occur."
                  enabled={amoraSettings.proactiveInsights}
                  onToggle={onToggleProactiveInsights}
                />
                <div
                  className="rounded-[22px] border px-4 py-3"
                  style={{
                    ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.022 }),
                    borderColor: hexToRgba('#FFFFFF', 0.068),
                  }}
                >
                  <div style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary, fontSize: '0.84rem' }}>
                    Guidance Level
                  </div>
                  <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
                    Choose how often Amora offers context.
                  </div>
                  <div className="mt-3 flex items-center gap-1 rounded-full border p-1" style={{ ...getArcGlassPillStyle(foundationTheme, 'light'), borderColor: hexToRgba('#FFFFFF', 0.065) }}>
                    {guidanceLevels.map(level => {
                      const isActive = amoraSettings.guidanceLevel === level;
                      const label = level === 'minimal' ? 'Minimal' : level === 'standard' ? 'Standard' : 'Detailed';

                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => onGuidanceLevelChange(level)}
                          className="flex-1 rounded-full px-2.5 py-1.5 transition-all duration-300"
                          style={{
                            ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                            fontSize: '0.52rem',
                            color: isActive ? foundationTheme.text.primary : foundationTheme.text.secondary,
                            background: isActive ? hexToRgba('#FFFFFF', 0.085) : 'transparent',
                            boxShadow: isActive ? `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.045)}` : 'none',
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div
                  className="rounded-[22px] border px-4 py-3"
                  style={{
                    ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.022 }),
                    borderColor: hexToRgba('#FFFFFF', 0.068),
                  }}
                >
                  <div style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary, fontSize: '0.84rem' }}>
                    Partner-awareness guidance
                  </div>
                  <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
                    Keep Amora&apos;s softer guidance notes fully active, reduced, or off.
                  </div>
                  <div className="mt-3 flex items-center gap-1 rounded-full border p-1" style={{ ...getArcGlassPillStyle(foundationTheme, 'light'), borderColor: hexToRgba('#FFFFFF', 0.065) }}>
                    {partnerGuidanceModes.map(mode => {
                      const isActive = amoraSettings.partnerAwarenessGuidance === mode;
                      const label = mode === 'on' ? 'On' : mode === 'reduced' ? 'Reduced' : 'Off';

                      return (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => onPartnerAwarenessGuidanceChange(mode)}
                          className="flex-1 rounded-full px-2.5 py-1.5 transition-all duration-300"
                          style={{
                            ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                            fontSize: '0.52rem',
                            color: isActive ? foundationTheme.text.primary : foundationTheme.text.secondary,
                            background: isActive ? hexToRgba('#FFFFFF', 0.085) : 'transparent',
                            boxShadow: isActive ? `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.045)}` : 'none',
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onResetAmoraIntro}
                  className="w-full rounded-[22px] border px-4 py-3 text-left transition-all duration-300"
                  style={{
                    ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.022 }),
                    borderColor: hexToRgba('#FFFFFF', 0.068),
                  }}
                >
                  <div style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary, fontSize: '0.84rem' }}>
                    Show Amora intro again
                  </div>
                  <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
                Replays the one-time Amora icon reveal the next time you open Cinder HUB.
                  </div>
                </button>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => onNavigate('sessions')}
            className="mt-3 w-full rounded-[22px] border px-4 py-3 text-left transition-colors"
            style={{
              ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.024 }),
              borderColor: hexToRgba('#FFFFFF', 0.07),
              color: foundationTheme.text.primary,
            }}
          >
            <div className="text-sm font-bold">Open session archive</div>
            <div className="mt-1 text-[9px]" style={{ color: foundationTheme.text.secondary }}>
              Review your earliest captured sessions as the archive grows.
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenDeviceHub}
            className="mt-3 w-full rounded-[22px] border px-4 py-3 text-left transition-colors"
            style={{
              ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.024 }),
              borderColor: hexToRgba('#FFFFFF', 0.07),
              color: foundationTheme.text.primary,
            }}
          >
                <div className="text-sm font-bold">Cinder HUB</div>
            <div className="mt-1 text-[9px]" style={{ color: foundationTheme.text.secondary }}>
                Return to Cinder HUB and manage connected device slots.
            </div>
          </button>

          <button
            type="button"
            onClick={onResetData}
            className="mt-3 w-full rounded-[22px] border px-4 py-3 text-left transition-colors"
            style={{
              ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.signal.down, tintStrength: 0.026 }),
              borderColor: hexToRgba(foundationTheme.signal.down, 0.2),
              color: foundationTheme.text.primary,
            }}
          >
            <div className="text-sm font-bold">Reset Collected Data</div>
            <div className="mt-1 text-[9px]" style={{ color: foundationTheme.text.secondary }}>
              Clears collected LIVE sessions and returns the mock to its day-one state.
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
