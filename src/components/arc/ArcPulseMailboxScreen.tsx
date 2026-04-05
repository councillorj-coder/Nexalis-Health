import { useEffect, useMemo, useState } from 'react';
import type { PulseCategory, PulsePriority } from '../../data/pulseTypes';
import ArcScreenHeader from './ArcScreenHeader';
import PulseExpandedView from './PulseExpandedView';
import { foundationTheme, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';
import {
  formatPulseTimestamp,
  getPulseCategoryLabel,
  getPulseChipStyle,
  getPulsePalette,
  getPulsePriorityLabel,
  PulseGlyph,
} from './pulseAppearance';
import { usePulse } from './pulseManager';

type PulseMailboxNavigate =
  | 'account-status'
  | 'current-goal'
  | 'edgescore-details'
  | 'live-detail'
  | 'trend-detail'
  | 'resting'
  | 'build'
  | 'active'
  | 'recovery'
  | 'motion'
  | 'nocturnal'
  | 'sessions'
  | 'insignia-inventory'
  | `session-detail:${string}`;

type PulseCategoryFilter = 'all' | PulseCategory;
type PulsePriorityFilter = 'all' | PulsePriority;

const PULSE_CATEGORY_FILTERS: Array<{ value: PulseCategoryFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'accomplishment', label: 'Accomplishment' },
  { value: 'insight', label: 'Insight' },
  { value: 'guidance', label: 'Guidance' },
];

const PULSE_PRIORITY_FILTERS: Array<{ value: PulsePriorityFilter; label: string }> = [
  { value: 'all', label: 'Any' },
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'veryHigh', label: 'Very High' },
];

const PULSE_PRIORITY_TOGGLES: PulsePriority[] = ['low', 'normal', 'high', 'veryHigh'];

function PulseMailboxFilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-2.5 py-[0.28rem] transition-all duration-200"
      style={{
        ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
        color: active ? foundationTheme.text.primary : hexToRgba(foundationTheme.text.secondary, 0.72),
        fontSize: '0.46rem',
        letterSpacing: '0.08em',
        background: active ? hexToRgba('#FFFFFF', 0.06) : hexToRgba('#FFFFFF', 0.018),
        borderColor: active ? hexToRgba('#FFFFFF', 0.12) : hexToRgba('#FFFFFF', 0.05),
        boxShadow: active ? `0 0 10px ${hexToRgba('#B7D0ED', 0.08)}` : 'none',
      }}
    >
      {label}
    </button>
  );
}

function PulseMailboxMuteChip({
  priority,
  muted,
  onClick,
}: {
  priority: PulsePriority;
  muted: boolean;
  onClick: () => void;
}) {
  const palette = getPulsePalette({
    category: 'guidance',
    accentStyle: 'indigo',
    priority,
  });

  return (
    <button
      type="button"
      onClick={onClick}
      className="min-w-[84px] rounded-[16px] border px-2.5 py-2 text-left transition-all duration-200"
      style={{
        background: muted ? hexToRgba('#FFFFFF', 0.018) : palette.chip,
        borderColor: muted ? hexToRgba('#FFFFFF', 0.05) : palette.chipBorder,
        boxShadow: muted ? 'none' : `0 0 10px ${hexToRgba(palette.accent, 0.08)}`,
      }}
    >
      <div
        style={{
          ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
          color: muted ? hexToRgba(foundationTheme.text.secondary, 0.82) : palette.chipText,
          fontSize: '0.48rem',
          letterSpacing: '0.08em',
        }}
      >
        {getPulsePriorityLabel(priority)}
      </div>
      <div
        className="mt-1"
        style={{
          ...getArcTypographyStyle(foundationTheme, 'caption'),
          color: muted ? hexToRgba(foundationTheme.text.muted, 0.78) : hexToRgba(palette.accent, 0.86),
          fontSize: '0.56rem',
          lineHeight: 1.15,
        }}
      >
        {muted ? 'Popup muted' : 'Popup live'}
      </div>
    </button>
  );
}

function PulseMailboxSection({
  title,
  subtitle,
  pulses,
  expandedId,
  onToggleExpand,
  onNavigate,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle: string;
  pulses: ReturnType<typeof usePulse>['recentPulseHistory'];
  expandedId: string | null;
  onToggleExpand: (pulseId: string) => void;
  onNavigate: (screen: PulseMailboxNavigate) => void;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div
      className="rounded-[24px] border px-4 py-4"
      style={{
        ...getArcGlassSurfaceStyle(foundationTheme, 'light', {
          tint: '#B7D0ED',
          tintStrength: 0.015,
        }),
        borderColor: hexToRgba('#FFFFFF', 0.05),
      }}
    >
      <div className="flex items-end justify-between gap-3">
        <div>
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
              color: foundationTheme.text.primary,
              fontSize: '0.9rem',
            }}
          >
            {title}
          </div>
          <div
            className="mt-1"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'caption'),
              color: foundationTheme.text.muted,
              fontSize: '0.62rem',
            }}
          >
            {subtitle}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onAction && actionLabel && pulses.length > 0 ? (
            <button
              type="button"
              onClick={onAction}
              className="rounded-full border px-2 py-[0.28rem] transition-colors duration-200"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                color: hexToRgba(foundationTheme.text.secondary, 0.8),
                fontSize: '0.46rem',
                letterSpacing: '0.08em',
                background: hexToRgba('#FFFFFF', 0.018),
                borderColor: hexToRgba('#FFFFFF', 0.05),
              }}
            >
              {actionLabel}
            </button>
          ) : null}
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
              color: hexToRgba(foundationTheme.text.secondary, 0.82),
              fontSize: '0.48rem',
              letterSpacing: '0.08em',
            }}
          >
            {pulses.length}
          </div>
        </div>
      </div>

      {pulses.length === 0 ? (
        <div
          className="mt-3 rounded-[18px] border px-3 py-3"
          style={{
            background: hexToRgba('#FFFFFF', 0.02),
            borderColor: hexToRgba('#FFFFFF', 0.045),
          }}
        >
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'caption'),
              color: foundationTheme.text.muted,
              fontSize: '0.62rem',
            }}
          >
            Nothing here yet.
          </div>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {pulses.map(pulse => {
            const palette = getPulsePalette(pulse);
            const expanded = expandedId === pulse.id;

            return (
              <div key={pulse.id}>
                <button
                  type="button"
                  onClick={() => onToggleExpand(pulse.id)}
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
                      <div style={getPulseChipStyle(hexToRgba(foundationTheme.text.muted, 0.76))}>
                        {formatPulseTimestamp(pulse.timestamp)}
                      </div>
                    </div>
                    {pulse.detail?.sourceLabel ? (
                      <div
                        className="mt-1"
                        style={{
                          ...getArcTypographyStyle(foundationTheme, 'caption'),
                          color: hexToRgba(foundationTheme.text.muted, 0.82),
                          fontSize: '0.56rem',
                          letterSpacing: '0.06em',
                          lineHeight: 1.2,
                        }}
                      >
                        {pulse.detail.sourceLabel}
                      </div>
                    ) : null}
                    <div
                      className="mt-1"
                      style={{
                        ...getArcTypographyStyle(foundationTheme, 'body'),
                        color: foundationTheme.text.primary,
                        fontSize: '0.76rem',
                      }}
                    >
                      {pulse.title}
                    </div>
                    <div
                      className="mt-0.5 overflow-hidden"
                      style={{
                        ...getArcTypographyStyle(foundationTheme, 'caption'),
                        color: foundationTheme.text.secondary,
                        fontSize: '0.62rem',
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
                    onClose={() => onToggleExpand(pulse.id)}
                    onAction={
                      pulse.actionType === 'navigate'
                        ? () => {
                            const target = pulse.actionPayload?.screen;
                            if (typeof target === 'string') {
                              onNavigate(target as PulseMailboxNavigate);
                            }
                          }
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

export default function ArcPulseMailboxScreen({
  onBack,
  onNavigate,
}: {
  onBack: () => void;
  onNavigate: (screen: PulseMailboxNavigate) => void;
}) {
  const {
    recentPulseHistory,
    mutedPopupPriorities,
    markPulseRead,
    clearReadPulses,
    togglePriorityPopupMuted,
  } = usePulse();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<PulseCategoryFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PulsePriorityFilter>('all');

  const filteredPulses = useMemo(
    () =>
      recentPulseHistory.filter(pulse => {
        const categoryMatch = categoryFilter === 'all' || pulse.category === categoryFilter;
        const priorityMatch = priorityFilter === 'all' || pulse.priority === priorityFilter;
        return categoryMatch && priorityMatch;
      }),
    [categoryFilter, priorityFilter, recentPulseHistory],
  );

  const unreadPulses = useMemo(
    () => filteredPulses.filter(pulse => !pulse.isRead),
    [filteredPulses],
  );
  const readPulses = useMemo(
    () => filteredPulses.filter(pulse => pulse.isRead),
    [filteredPulses],
  );

  useEffect(() => {
    if (expandedId && !filteredPulses.some(pulse => pulse.id === expandedId)) {
      setExpandedId(null);
    }
  }, [expandedId, filteredPulses]);

  const handleToggleExpand = (pulseId: string) => {
    setExpandedId(current => (current === pulseId ? null : pulseId));
    markPulseRead(pulseId);
  };

  const handleClearRead = () => {
    if (expandedId && readPulses.some(pulse => pulse.id === expandedId)) {
      setExpandedId(null);
    }
    clearReadPulses();
  };

  return (
    <div className="space-y-3">
      <ArcScreenHeader title="Pulse Mailbox" onBack={onBack} />

      <div
        className="rounded-[24px] border px-4 py-4"
        style={{
          ...getArcGlassSurfaceStyle(foundationTheme, 'light', {
            tint: '#BBD2ED',
            tintStrength: 0.018,
          }),
          borderColor: hexToRgba('#FFFFFF', 0.055),
        }}
      >
        <div
          style={{
            ...getArcTypographyStyle(foundationTheme, 'sectionTitle'),
            color: hexToRgba(foundationTheme.text.secondary, 0.74),
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
            fontSize: '0.98rem',
          }}
        >
          Recent signal history
        </div>
        <div
          className="mt-1.5"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'caption'),
            color: foundationTheme.text.muted,
            fontSize: '0.64rem',
            lineHeight: 1.28,
          }}
        >
          Pulse collects accomplishments, insights, and guidance without interrupting the flow of the app.
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div
            className="rounded-[16px] border px-3 py-2.5"
            style={{
              background: hexToRgba('#FFFFFF', 0.02),
              borderColor: hexToRgba('#FFFFFF', 0.045),
            }}
          >
            <div style={getPulseChipStyle(hexToRgba(foundationTheme.text.secondary, 0.76))}>UNREAD</div>
            <div
              className="mt-1"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'displayHero'),
                color: foundationTheme.text.primary,
                fontSize: '1.15rem',
                lineHeight: 0.92,
              }}
            >
              {unreadPulses.length}
            </div>
          </div>
          <div
            className="rounded-[16px] border px-3 py-2.5"
            style={{
              background: hexToRgba('#FFFFFF', 0.02),
              borderColor: hexToRgba('#FFFFFF', 0.045),
            }}
          >
            <div style={getPulseChipStyle(hexToRgba(foundationTheme.text.secondary, 0.76))}>READ</div>
            <div
              className="mt-1"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'displayHero'),
                color: foundationTheme.text.primary,
                fontSize: '1.15rem',
                lineHeight: 0.92,
              }}
            >
              {readPulses.length}
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-2.5">
          <div>
            <div style={getPulseChipStyle(hexToRgba(foundationTheme.text.secondary, 0.7))}>TYPE</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {PULSE_CATEGORY_FILTERS.map(filter => (
                <PulseMailboxFilterChip
                  key={filter.value}
                  label={filter.label}
                  active={categoryFilter === filter.value}
                  onClick={() => setCategoryFilter(filter.value)}
                />
              ))}
            </div>
          </div>

          <div>
            <div style={getPulseChipStyle(hexToRgba(foundationTheme.text.secondary, 0.7))}>PRIORITY</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {PULSE_PRIORITY_FILTERS.map(filter => (
                <PulseMailboxFilterChip
                  key={filter.value}
                  label={filter.label}
                  active={priorityFilter === filter.value}
                  onClick={() => setPriorityFilter(filter.value)}
                />
              ))}
            </div>
          </div>

          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'caption'),
              color: foundationTheme.text.muted,
              fontSize: '0.6rem',
            }}
          >
            Showing {filteredPulses.length} of {recentPulseHistory.length} pulses
          </div>

          <div>
            <div style={getPulseChipStyle(hexToRgba(foundationTheme.text.secondary, 0.7))}>POPUP MUTE</div>
            <div
              className="mt-1"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'caption'),
                color: hexToRgba(foundationTheme.text.muted, 0.82),
                fontSize: '0.58rem',
                lineHeight: 1.25,
              }}
            >
              Muting only affects live popup delivery. Every Pulse still lands here in the mailbox.
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {PULSE_PRIORITY_TOGGLES.map(priority => (
                <PulseMailboxMuteChip
                  key={priority}
                  priority={priority}
                  muted={mutedPopupPriorities[priority]}
                  onClick={() => togglePriorityPopupMuted(priority)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <PulseMailboxSection
        title="Unread"
        subtitle="Fresh signals you have not opened yet."
        pulses={unreadPulses}
        expandedId={expandedId}
        onToggleExpand={handleToggleExpand}
        onNavigate={onNavigate}
      />

      <PulseMailboxSection
        title="Read"
        subtitle="Signals you have already reviewed."
        pulses={readPulses}
        expandedId={expandedId}
        onToggleExpand={handleToggleExpand}
        onNavigate={onNavigate}
        actionLabel="Clear Read"
        onAction={handleClearRead}
      />
    </div>
  );
}
