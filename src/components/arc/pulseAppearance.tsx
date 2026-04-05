import type { CSSProperties } from 'react';
import type { PulseAccentStyle, PulseCategory, PulseIconType, PulseItem, PulsePriority } from '../../data/pulseTypes';
import { foundationTheme, getArcTypographyStyle, hexToRgba } from './arc-theme';

const PULSE_PRIORITY_STYLE_MAP: Record<
  PulsePriority,
  {
    label: string;
    accent: string;
    accentSoft: string;
    border: string;
    glow: string;
    chipText: string;
    chipBackground: string;
    chipBorder: string;
    historyDot: string;
    edgeStrength: number;
  }
> = {
  low: {
    label: 'Low',
    accent: '#98A2AC',
    accentSoft: '#707B86',
    border: '#A8B2BC',
    glow: '#87919B',
    chipText: '#C7D0D9',
    chipBackground: hexToRgba('#A1ABB6', 0.08),
    chipBorder: hexToRgba('#AEB8C3', 0.12),
    historyDot: '#9AA5AF',
    edgeStrength: 0.1,
  },
  normal: {
    label: 'Normal',
    accent: '#9FBCE3',
    accentSoft: '#7E96B7',
    border: '#AFC8EA',
    glow: '#9AB6DB',
    chipText: '#DCE9FA',
    chipBackground: hexToRgba('#9FBCE3', 0.1),
    chipBorder: hexToRgba('#B4CDED', 0.18),
    historyDot: '#A6C1E7',
    edgeStrength: 0.14,
  },
  high: {
    label: 'High',
    accent: '#62BF96',
    accentSoft: '#3F8E6C',
    border: '#7CCBA7',
    glow: '#57B487',
    chipText: '#D8F2E7',
    chipBackground: hexToRgba('#63C298', 0.1),
    chipBorder: hexToRgba('#7ED2AD', 0.19),
    historyDot: '#67C79C',
    edgeStrength: 0.18,
  },
  veryHigh: {
    label: 'Very High',
    accent: '#D7B469',
    accentSoft: '#AE8841',
    border: '#E0C07A',
    glow: '#CAA457',
    chipText: '#F4E5C2',
    chipBackground: hexToRgba('#D7B469', 0.12),
    chipBorder: hexToRgba('#E4C887', 0.22),
    historyDot: '#E0BD73',
    edgeStrength: 0.22,
  },
};

const PULSE_CATEGORY_STYLE_MAP: Record<
  PulseAccentStyle,
  {
    surfaceTint: string;
    surfaceGlow: string;
    chipText: string;
    chipBackground: string;
    chipBorder: string;
  }
> = {
  platinumBlue: {
    surfaceTint: '#DDEBFF',
    surfaceGlow: '#CFE3FF',
    chipText: '#CBDDF7',
    chipBackground: hexToRgba('#DDEBFF', 0.075),
    chipBorder: hexToRgba('#E8F2FF', 0.11),
  },
  iceBlue: {
    surfaceTint: '#C5E5FF',
    surfaceGlow: '#B2DFFF',
    chipText: '#C9E6FF',
    chipBackground: hexToRgba('#C5E5FF', 0.075),
    chipBorder: hexToRgba('#D9F0FF', 0.11),
  },
  indigo: {
    surfaceTint: '#BEC8FF',
    surfaceGlow: '#A5B4F8',
    chipText: '#D0D8FF',
    chipBackground: hexToRgba('#BEC8FF', 0.072),
    chipBorder: hexToRgba('#D7DEFF', 0.11),
  },
  custom: {
    surfaceTint: '#D8DFEA',
    surfaceGlow: '#C8D1DE',
    chipText: '#D8E0EA',
    chipBackground: hexToRgba('#D8DFEA', 0.072),
    chipBorder: hexToRgba('#E3E8EF', 0.11),
  },
};

export function getPulseCategoryLabel(category: PulseCategory) {
  switch (category) {
    case 'accomplishment':
      return 'Accomplishment';
    case 'insight':
      return 'Insight';
    default:
      return 'Guidance';
  }
}

export function getPulsePriorityLabel(priority: PulsePriority) {
  return PULSE_PRIORITY_STYLE_MAP[priority].label;
}

export function getPulsePalette(item: Pick<PulseItem, 'category' | 'accentStyle' | 'priority'>) {
  const priority = PULSE_PRIORITY_STYLE_MAP[item.priority];
  const category = PULSE_CATEGORY_STYLE_MAP[item.accentStyle];

  return {
    accent: priority.accent,
    accentSoft: priority.accentSoft,
    surface: `linear-gradient(180deg, ${hexToRgba(category.surfaceTint, 0.03)} 0%, ${hexToRgba(
      priority.accent,
      0.018 + priority.edgeStrength * 0.05,
    )} 100%)`,
    border: hexToRgba(priority.border, 0.09 + priority.edgeStrength * 0.18),
    glow: hexToRgba(priority.glow, 0.04 + priority.edgeStrength * 0.16),
    chip: priority.chipBackground,
    chipText: priority.chipText,
    chipBorder: priority.chipBorder,
    edge: `linear-gradient(90deg, ${hexToRgba(priority.accent, 0)} 0%, ${hexToRgba(
      priority.accent,
      0.78,
    )} 32%, ${hexToRgba(priority.accent, 0.18)} 100%)`,
    historyDot: priority.historyDot,
    categoryChip: category.chipBackground,
    categoryChipText: category.chipText,
    categoryChipBorder: category.chipBorder,
    categoryGlow: hexToRgba(category.surfaceGlow, 0.055),
  };
}

export function formatPulseTimestamp(timestamp: number) {
  const now = Date.now();
  const diffMs = Math.max(0, now - timestamp);
  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  if (diffMs < minuteMs) {
    return 'Now';
  }

  if (diffMs < hourMs) {
    return `${Math.round(diffMs / minuteMs)}m ago`;
  }

  if (diffMs < dayMs) {
    return `${Math.round(diffMs / hourMs)}h ago`;
  }

  return `${Math.round(diffMs / dayMs)}d ago`;
}

export function getPulseChipStyle(color: string): CSSProperties {
  return {
    ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
    color,
    fontSize: '0.44rem',
    letterSpacing: '0.09em',
  };
}

export function PulseGlyph({
  iconType,
  color,
  className = 'h-3.5 w-3.5',
}: {
  iconType: PulseIconType;
  color: string;
  className?: string;
}) {
  if (iconType === 'diamond') {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="none">
        <path d="M8 1.8l5 6.2L8 14.2 3 8 8 1.8z" stroke={color} strokeWidth="1.2" />
      </svg>
    );
  }

  if (iconType === 'ring') {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="5.2" stroke={color} strokeWidth="1.25" />
      </svg>
    );
  }

  if (iconType === 'pulseLine') {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="none">
        <path
          d="M1.5 8h3.1l1.25-2.3 2.1 5.1 1.6-3.05h4.95"
          stroke={color}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (iconType === 'foundation') {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="none">
        <path d="M8 2.1l4.7 2.55v4.55L8 13.9 3.3 9.2V4.65L8 2.1z" stroke={color} strokeWidth="1.15" />
        <path d="M8 4.2v7.4M4.55 5.65L8 7.5l3.45-1.85" stroke={color} strokeWidth="1.05" strokeLinecap="round" />
      </svg>
    );
  }

  if (iconType === 'custom') {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="none">
        <path d="M3 8h10" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.6" fill={color} />
    </svg>
  );
}
