import type { ReactNode } from 'react';
import { ArcLiveExpansionCard, ArcTrendExpansionCard, type ArcTrendHistoryPoint, type ArcTrendViewMode } from './ArcExpansionInsights';
import type { ArcAmoraGuidanceLevel } from './ArcAmora';
import type { ArcLiveTelemetry, ArcThresholdModel } from '../../data/arc-app-data';
import { foundationTheme, getArcGlassPillStyle, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';

type ToolStatus = 'available' | 'locked' | 'coming_online';
type ToolPreviewKind = 'signal' | 'trend' | 'session' | 'guide';
type ToolPreviewDensity = 'compact' | 'large';

export type ArcToolPlacement = 'home' | 'insights' | null;
export type ArcToolAssignments = Record<string, ArcToolPlacement | undefined>;

type ToolDefinition = {
  id: string;
  name: string;
  slotLabel: string;
  status: ToolStatus;
  previewKind: ToolPreviewKind;
  previewDensity: ToolPreviewDensity;
  previewLine: string;
};

type ToolCategory = {
  title: string;
  tools: ToolDefinition[];
};

export type ArcToolChartProps = {
  onOpenLiveDetail?: () => void;
  onOpenTrendDetail?: () => void;
  amoraEnabled?: boolean;
  proactiveInsightsEnabled?: boolean;
  amoraGuidanceLevel?: ArcAmoraGuidanceLevel;
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
};

export const MAX_TOOL_SLOTS = 10;

export const ARC_TOOL_CATEGORIES: ToolCategory[] = [
  {
    title: 'Live Tools',
    tools: [
      {
        id: 'live-signal-view',
        name: 'Live Signal View',
        slotLabel: 'Live Signal',
        status: 'available',
        previewKind: 'signal',
        previewDensity: 'large',
        previewLine: 'Live expansion, motion layering, and baseline context.',
      },
      {
        id: 'baseline-compare',
        name: 'Baseline Compare',
        slotLabel: 'Baseline',
        status: 'locked',
        previewKind: 'signal',
        previewDensity: 'compact',
        previewLine: 'Resting range and drift against your learned baseline.',
      },
    ],
  },
  {
    title: 'Trend Tools',
    tools: [
      {
        id: 'trend-overlay',
        name: 'Trend Overlay',
        slotLabel: 'Trend Overlay',
        status: 'available',
        previewKind: 'trend',
        previewDensity: 'large',
        previewLine: 'Long-range shape, variance, and chart layering.',
      },
      {
        id: 'range-compare',
        name: 'Range Compare',
        slotLabel: 'Range Compare',
        status: 'locked',
        previewKind: 'trend',
        previewDensity: 'compact',
        previewLine: 'Window-to-window range comparison and context shifts.',
      },
    ],
  },
  {
    title: 'Session Tools',
    tools: [
      {
        id: 'session-breakdown',
        name: 'Session Breakdown',
        slotLabel: 'Session Read',
        status: 'available',
        previewKind: 'session',
        previewDensity: 'large',
        previewLine: 'Build, hold, recovery, and session structure.',
      },
      {
        id: 'session-compare',
        name: 'Session Compare',
        slotLabel: 'Session Compare',
        status: 'locked',
        previewKind: 'session',
        previewDensity: 'compact',
        previewLine: 'Cross-session structure and repeatability review.',
      },
    ],
  },
  {
    title: 'General Tools',
    tools: [
      {
        id: 'score-guide',
        name: 'Score Guide',
        slotLabel: 'Score Guide',
        status: 'available',
        previewKind: 'guide',
        previewDensity: 'compact',
        previewLine: 'Score inputs, weighting, and interpretation rules.',
      },
      {
        id: 'metric-glossary',
        name: 'Metric Glossary',
        slotLabel: 'Glossary',
        status: 'coming_online',
        previewKind: 'guide',
        previewDensity: 'compact',
        previewLine: 'Definitions for system metrics and analysis terms.',
      },
    ],
  },
];

function getToolStatusLabel(status: ToolStatus) {
  switch (status) {
    case 'available':
      return 'Available';
    case 'coming_online':
      return 'Coming online';
    default:
      return 'Locked';
  }
}

function isPrimaryChartTool(tool: ToolDefinition | null) {
  return tool?.id === 'live-signal-view' || tool?.id === 'trend-overlay';
}

export function getArcAllTools() {
  return ARC_TOOL_CATEGORIES.flatMap(category => category.tools);
}

export function getArcSlottedToolsForPlacement(
  assignments: ArcToolAssignments,
  placement: Exclude<ArcToolPlacement, null>,
) {
  const selectedTools = getArcAllTools()
    .filter(tool => assignments[tool.id] === placement)
    .slice(0, MAX_TOOL_SLOTS);

  return Array.from({ length: MAX_TOOL_SLOTS }, (_, index) => selectedTools[index] ?? null);
}

function ToolPreviewVisual({ tool }: { tool: ToolDefinition }) {
  switch (tool.previewKind) {
    case 'signal':
      return (
        <div
          className="h-[48px] overflow-hidden rounded-[14px] border px-2 pb-2 pt-3"
          style={{
            background: hexToRgba('#FFFFFF', 0.018),
            borderColor: hexToRgba('#FFFFFF', 0.04),
          }}
        >
          <div className="flex h-full items-end gap-1">
            {[18, 26, 21, 34, 28, 44, 36, 52, 43, 48, 39, 46].map((height, index) => (
              <span
                key={`signal-preview-${index}`}
                className="flex-1 rounded-full"
                style={{
                  height: `${height}%`,
                  background: index > 7
                    ? hexToRgba(foundationTheme.text.primary, 0.42)
                    : hexToRgba(foundationTheme.text.secondary, 0.2),
                }}
              />
            ))}
          </div>
        </div>
      );
    case 'trend':
      return (
        <div
          className="rounded-[14px] border px-3 py-2"
          style={{
            background: hexToRgba('#FFFFFF', 0.018),
            borderColor: hexToRgba('#FFFFFF', 0.04),
          }}
        >
          <div className="flex items-center justify-between">
            {['24H', '7D', '30D'].map(range => (
              <span
                key={range}
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                  color: hexToRgba(foundationTheme.text.secondary, range === '7D' ? 0.82 : 0.48),
                  fontSize: '0.44rem',
                  letterSpacing: '0.08em',
                }}
              >
                {range}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-end gap-1.5">
            {[24, 28, 26, 34, 32, 42, 38].map((height, index) => (
              <span
                key={`trend-preview-${index}`}
                className="flex-1 rounded-full"
                style={{
                  height: `${height}px`,
                  background: index === 5
                    ? hexToRgba(foundationTheme.text.primary, 0.4)
                    : hexToRgba(foundationTheme.text.secondary, 0.18),
                }}
              />
            ))}
          </div>
        </div>
      );
    case 'session':
      return (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Build', value: 'Clean' },
            { label: 'Hold', value: 'Tracked' },
            { label: 'Recovery', value: 'Ready' },
          ].map(item => (
            <div
              key={item.label}
              className="rounded-[14px] border px-2.5 py-2"
              style={{
                background: hexToRgba('#FFFFFF', 0.018),
                borderColor: hexToRgba('#FFFFFF', 0.04),
              }}
            >
              <div
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'label'),
                  color: hexToRgba(foundationTheme.text.secondary, 0.48),
                  fontSize: '0.4rem',
                  letterSpacing: '0.09em',
                }}
              >
                {item.label}
              </div>
              <div
                className="mt-2"
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'body'),
                  color: hexToRgba(foundationTheme.text.primary, 0.84),
                  fontSize: '0.62rem',
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      );
    case 'guide':
    default:
      return (
        <div
          className="space-y-2 rounded-[14px] border px-3 py-2.5"
          style={{
            background: hexToRgba('#FFFFFF', 0.018),
            borderColor: hexToRgba('#FFFFFF', 0.04),
          }}
        >
          {['Scoring inputs', 'Reference ranges'].map(line => (
            <div key={line} className="flex items-center justify-between gap-3">
              <span
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'caption'),
                  color: hexToRgba(foundationTheme.text.secondary, 0.58),
                  fontSize: '0.54rem',
                }}
              >
                {line}
              </span>
              <span
                className="h-px flex-1 rounded-full"
                style={{ background: hexToRgba('#FFFFFF', 0.07) }}
              />
            </div>
          ))}
        </div>
      );
  }
}

function ToolSlotCard({
  slotNumber,
  tool,
  chartProps,
}: {
  slotNumber: number;
  tool: ToolDefinition | null;
  chartProps: ArcToolChartProps;
}) {
  const isFilled = tool != null;
  const isLarge = tool?.previewDensity === 'large';
  const isLiveChartTool = tool?.id === 'live-signal-view';
  const isTrendChartTool = tool?.id === 'trend-overlay';
  const isChartTool = isPrimaryChartTool(tool);

  if (tool && isLiveChartTool) {
    return (
      <ArcLiveExpansionCard
        onOpen={chartProps.onOpenLiveDetail}
        liveTelemetry={chartProps.liveTelemetry}
        thresholdModel={chartProps.thresholdModel}
        amoraEnabled={chartProps.amoraEnabled}
        proactiveInsightsEnabled={chartProps.proactiveInsightsEnabled}
        amoraGuidanceLevel={chartProps.amoraGuidanceLevel}
        onOpenLiveAmora={chartProps.onOpenLiveAmora}
        liveSyncState={chartProps.liveSyncState}
        liveSyncProgress={chartProps.liveSyncProgress}
      />
    );
  }

  if (tool && isTrendChartTool) {
    return (
      <ArcTrendExpansionCard
        onOpen={chartProps.onOpenTrendDetail}
        liveTelemetry={chartProps.liveTelemetry}
        trendHistory={chartProps.trendHistory}
        trendMode={chartProps.trendMode}
        thresholdModel={chartProps.thresholdModel}
        amoraEnabled={chartProps.amoraEnabled}
        proactiveInsightsEnabled={chartProps.proactiveInsightsEnabled}
        amoraGuidanceLevel={chartProps.amoraGuidanceLevel}
        onOpenTrendAmora={chartProps.onOpenTrendAmora}
      />
    );
  }

  return (
    <div
      className="rounded-[22px] border px-3 py-3 transition-all duration-300"
      style={{
        ...getArcGlassSurfaceStyle(foundationTheme, 'light', {
          tint: foundationTheme.accent.primary,
          tintStrength: isFilled ? 0.014 : 0.008,
        }),
        borderColor: isFilled ? hexToRgba('#FFFFFF', 0.052) : hexToRgba('#FFFFFF', 0.034),
        minHeight: isFilled ? (isChartTool ? '238px' : isLarge ? '142px' : '102px') : '56px',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'label'),
              color: hexToRgba(foundationTheme.text.secondary, isFilled ? 0.56 : 0.34),
              fontSize: '0.42rem',
              letterSpacing: '0.1em',
            }}
          >
            SLOT {String(slotNumber).padStart(2, '0')}
          </div>
          <div
            className="mt-1"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'body'),
              color: isFilled ? hexToRgba(foundationTheme.text.primary, 0.9) : hexToRgba(foundationTheme.text.secondary, 0.42),
              fontSize: isFilled ? '0.78rem' : '0.68rem',
            }}
          >
            {tool ? tool.name : 'Empty slot'}
          </div>
        </div>

        <div
          className="shrink-0 rounded-full border px-2 py-1"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
            color: isFilled ? hexToRgba(foundationTheme.text.secondary, 0.72) : hexToRgba(foundationTheme.text.secondary, 0.4),
            background: hexToRgba('#FFFFFF', isFilled ? 0.028 : 0.018),
            borderColor: hexToRgba('#FFFFFF', isFilled ? 0.044 : 0.03),
            fontSize: '0.44rem',
            letterSpacing: '0.06em',
          }}
        >
          {tool ? tool.slotLabel : 'Open'}
        </div>
      </div>

      {tool ? (
        <div className="mt-3 space-y-3">
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'caption'),
              color: hexToRgba(foundationTheme.text.secondary, 0.66),
              fontSize: '0.62rem',
              lineHeight: 1.25,
            }}
          >
            {tool.previewLine}
          </div>
          <ToolPreviewVisual tool={tool} />
        </div>
      ) : null}
    </div>
  );
}

export function ArcToolSlotRack({
  slots,
  chartProps,
}: {
  slots: Array<ToolDefinition | null>;
  chartProps: ArcToolChartProps;
}) {
  const filledSlots = slots.filter((tool): tool is ToolDefinition => tool != null);

  if (filledSlots.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2.5">
      {filledSlots.map((tool, index) => (
        <ToolSlotCard
          key={`tool-slot-${tool.id}-${index}`}
          slotNumber={index + 1}
          tool={tool}
          chartProps={chartProps}
        />
      ))}
    </div>
  );
}

export function ArcToolBoxLauncher({
  open,
  activeCount,
  onToggle,
}: {
  open: boolean;
  activeCount: number;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full border text-left transition-all duration-300 hover:border-white/[0.08] active:scale-[0.995]"
      style={{
        ...getArcGlassSurfaceStyle(foundationTheme, 'light', {
          tint: foundationTheme.accent.primary,
          tintStrength: 0.016,
        }),
        borderColor: hexToRgba('#FFFFFF', 0.05),
        borderRadius: open ? '22px' : '18px',
        padding: open ? '1rem' : '0.75rem 0.85rem',
      }}
      aria-expanded={open}
      aria-label="Open Tool Box"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex items-center justify-center border transition-all duration-300"
            style={{
              height: open ? '2.25rem' : '2rem',
              width: open ? '2.25rem' : '2rem',
              borderRadius: open ? '14px' : '12px',
              background: hexToRgba('#FFFFFF', 0.018),
              borderColor: hexToRgba('#FFFFFF', 0.05),
            }}
          >
            <div className="grid grid-cols-2 gap-1">
              {[0, 1, 2, 3].map(index => (
                <span
                  key={index}
                  className="h-[4px] w-[4px] rounded-[2px]"
                  style={{ background: hexToRgba(foundationTheme.text.primary, index === 0 ? 0.86 : 0.44) }}
                />
              ))}
            </div>
          </div>
          <div className="min-w-0">
            <div
              style={{
                ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
                color: foundationTheme.text.primary,
                fontSize: '0.9rem',
              }}
            >
              Tool Box
            </div>
            <div
              className="mt-1"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'caption'),
                color: hexToRgba(foundationTheme.text.secondary, 0.72),
                fontSize: open ? '0.68rem' : '0.58rem',
              }}
            >
              {open
                ? activeCount > 0
                  ? `${activeCount} tools assigned here`
                  : 'Assign tools to this page'
                : activeCount > 0
                  ? `${activeCount} active`
                  : 'Launcher'}
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-center rounded-full border transition-transform duration-300"
          style={{
            ...getArcGlassPillStyle(foundationTheme, 'light'),
            height: open ? '2rem' : '1.75rem',
            width: open ? '2rem' : '1.75rem',
            borderColor: hexToRgba('#FFFFFF', 0.045),
            color: hexToRgba(foundationTheme.text.secondary, 0.78),
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
    </button>
  );
}

function PlacementButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={event => {
        event.preventDefault();
        event.stopPropagation();
        if (!disabled) {
          onClick();
        }
      }}
      disabled={disabled}
      className="rounded-full border px-2.5 py-1 transition-all duration-300 disabled:cursor-default"
      style={{
        ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
        color: active
          ? foundationTheme.text.highlight
          : hexToRgba(foundationTheme.text.secondary, disabled ? 0.34 : 0.74),
        background: active ? hexToRgba('#FFFFFF', 0.1) : hexToRgba('#FFFFFF', 0.024),
        borderColor: active ? hexToRgba('#FFFFFF', 0.09) : hexToRgba('#FFFFFF', 0.04),
        fontSize: '0.44rem',
        letterSpacing: '0.05em',
        opacity: disabled ? 0.46 : 1,
      }}
    >
      {label}
    </button>
  );
}

function ToolRow({
  tool,
  placement,
  homeCount,
  insightsCount,
  onSetPlacement,
}: {
  tool: ToolDefinition;
  placement: ArcToolPlacement;
  homeCount: number;
  insightsCount: number;
  onSetPlacement: (toolId: string, placement: ArcToolPlacement) => void;
}) {
  const assignmentLocked = tool.status !== 'available';
  const homeDisabled = assignmentLocked || (placement !== 'home' && homeCount >= MAX_TOOL_SLOTS);
  const insightsDisabled = assignmentLocked || (placement !== 'insights' && insightsCount >= MAX_TOOL_SLOTS);

  return (
    <div
      className="flex items-center justify-between gap-3 py-3"
      style={{
        opacity: tool.status === 'locked' ? 0.48 : tool.status === 'coming_online' ? 0.62 : 1,
      }}
    >
      <div className="min-w-0">
        <div
          style={{
            ...getArcTypographyStyle(foundationTheme, 'body'),
            color: foundationTheme.text.primary,
            fontSize: '0.78rem',
          }}
        >
          {tool.name}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span
          className="rounded-full border px-2 py-1"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
            color: hexToRgba(foundationTheme.text.secondary, tool.status === 'available' ? 0.78 : 0.6),
            background: hexToRgba('#FFFFFF', 0.026),
            borderColor: hexToRgba('#FFFFFF', 0.04),
            fontSize: '0.46rem',
            letterSpacing: '0.05em',
          }}
        >
          {getToolStatusLabel(tool.status)}
        </span>
        <div className="flex items-center gap-1 rounded-full border p-1" style={{ borderColor: hexToRgba('#FFFFFF', 0.04), background: hexToRgba('#FFFFFF', 0.02) }}>
          <PlacementButton
            label="Home"
            active={placement === 'home'}
            disabled={homeDisabled}
            onClick={() => onSetPlacement(tool.id, placement === 'home' ? null : 'home')}
          />
          <PlacementButton
            label="Insights"
            active={placement === 'insights'}
            disabled={insightsDisabled}
            onClick={() => onSetPlacement(tool.id, placement === 'insights' ? null : 'insights')}
          />
        </div>
      </div>
    </div>
  );
}

function ToolCategorySection({
  category,
  toolAssignments,
  homeCount,
  insightsCount,
  onSetPlacement,
}: {
  category: ToolCategory;
  toolAssignments: ArcToolAssignments;
  homeCount: number;
  insightsCount: number;
  onSetPlacement: (toolId: string, placement: ArcToolPlacement) => void;
}) {
  return (
    <div className="pt-4 first:pt-0">
      <div
        style={{
          ...getArcTypographyStyle(foundationTheme, 'label'),
          color: hexToRgba(foundationTheme.text.secondary, 0.56),
          fontSize: '0.48rem',
          letterSpacing: '0.12em',
        }}
      >
        {category.title}
      </div>
      <div className="mt-2 divide-y" style={{ borderColor: hexToRgba('#FFFFFF', 0.03) }}>
        {category.tools.map(tool => (
          <ToolRow
            key={tool.id}
            tool={tool}
            placement={toolAssignments[tool.id] ?? null}
            homeCount={homeCount}
            insightsCount={insightsCount}
            onSetPlacement={onSetPlacement}
          />
        ))}
      </div>
    </div>
  );
}

function ToolBoxPanel({
  open,
  toolAssignments,
  onSetPlacement,
}: {
  open: boolean;
  toolAssignments: ArcToolAssignments;
  onSetPlacement: (toolId: string, placement: ArcToolPlacement) => void;
}) {
  const homeCount = Object.values(toolAssignments).filter(value => value === 'home').length;
  const insightsCount = Object.values(toolAssignments).filter(value => value === 'insights').length;

  return (
    <div
      className="overflow-hidden transition-all duration-300"
      style={{
        maxHeight: open ? '42rem' : '0rem',
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0px)' : 'translateY(-8px)',
      }}
      aria-hidden={!open}
    >
      <div
        className="mt-3 rounded-[24px] border px-4 py-4"
        style={{
          ...getArcGlassSurfaceStyle(foundationTheme, 'medium', {
            tint: foundationTheme.accent.primary,
            tintStrength: 0.016,
          }),
          borderColor: hexToRgba('#FFFFFF', 0.05),
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'sectionTitle'),
              color: hexToRgba(foundationTheme.text.primary, 0.92),
              fontSize: '0.66rem',
              letterSpacing: '0.08em',
            }}
          >
            Tool Box
          </div>
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
              color: hexToRgba(foundationTheme.text.secondary, 0.58),
              fontSize: '0.46rem',
              letterSpacing: '0.05em',
            }}
          >
            Home {homeCount}/{MAX_TOOL_SLOTS} • Insights {insightsCount}/{MAX_TOOL_SLOTS}
          </div>
        </div>
        <div className="mt-4 space-y-1">
          {ARC_TOOL_CATEGORIES.map(category => (
            <ToolCategorySection
              key={category.title}
              category={category}
              toolAssignments={toolAssignments}
              homeCount={homeCount}
              insightsCount={insightsCount}
              onSetPlacement={onSetPlacement}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ArcToolBoxOverlay({
  open,
  toolAssignments,
  onSetToolPlacement,
  onClose,
}: {
  open: boolean;
  toolAssignments: ArcToolAssignments;
  onSetToolPlacement: (toolId: string, placement: ArcToolPlacement) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="absolute inset-0 z-20 transition-all duration-300"
      style={{
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
      }}
      aria-hidden={!open}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label="Close Tool Box"
        style={{
          background: `linear-gradient(180deg, ${hexToRgba(foundationTheme.bg.app, 0.26)} 0%, ${hexToRgba(foundationTheme.bg.app, 0.74)} 22%, ${hexToRgba(foundationTheme.bg.app, 0.9)} 100%)`,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      />

      <div className="relative px-0 pt-4">
        <div className="flex justify-end pb-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-full border px-3 py-2 transition-all duration-300 hover:border-white/[0.08] active:scale-[0.985]"
            style={{
              ...getArcGlassPillStyle(foundationTheme, 'light'),
              borderColor: hexToRgba('#FFFFFF', 0.05),
              color: hexToRgba(foundationTheme.text.secondary, 0.82),
            }}
            aria-label="Close Tool Box"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 6l12 12M18 6L6 18" />
            </svg>
            <span
              style={{
                ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                fontSize: '0.5rem',
                letterSpacing: '0.07em',
              }}
            >
              Close
            </span>
          </button>
        </div>

        <ToolBoxPanel
          open={open}
          toolAssignments={toolAssignments}
          onSetPlacement={onSetToolPlacement}
        />
      </div>
    </div>
  );
}
