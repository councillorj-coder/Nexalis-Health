import type { PulseItem } from '../../data/pulseTypes';
import { foundationTheme, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';
import { getPulseCategoryLabel, getPulseChipStyle, getPulsePalette, getPulsePriorityLabel } from './pulseAppearance';

export default function PulseExpandedView({
  pulse,
  onClose,
  onAction,
  compact = false,
}: {
  pulse: PulseItem;
  onClose: () => void;
  onAction?: () => void;
  compact?: boolean;
}) {
  const palette = getPulsePalette(pulse);

  return (
    <div
      className={`relative overflow-hidden rounded-[22px] border ${compact ? 'mt-2 px-3 py-3' : 'mt-2.5 px-3.5 py-3.5'}`}
      style={{
        ...getArcGlassSurfaceStyle(foundationTheme, 'medium', {
          tint: palette.categoryGlow,
          tintStrength: compact ? 0.024 : 0.03,
        }),
        borderColor: palette.border,
        boxShadow: `${String(
          getArcGlassSurfaceStyle(foundationTheme, 'medium', {
            tint: palette.categoryGlow,
            tintStrength: compact ? 0.024 : 0.03,
          }).boxShadow ?? '',
        )}, 0 0 10px ${palette.glow}`,
      }}
    >
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px" style={{ background: palette.edge }} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
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
            {pulse.detail?.sourceLabel ? (
              <span style={getPulseChipStyle(hexToRgba(foundationTheme.text.muted, 0.88))}>{pulse.detail.sourceLabel}</span>
            ) : null}
          </div>
          <div
            className="mt-1"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
              color: foundationTheme.text.primary,
              fontSize: compact ? '0.84rem' : '0.88rem',
            }}
          >
            {pulse.title}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors"
          style={{
            background: hexToRgba('#FFFFFF', 0.02),
            borderColor: hexToRgba(palette.accent, 0.12),
            color: foundationTheme.text.secondary,
          }}
          aria-label="Close pulse details"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>
      </div>

      <div
        className="mt-2"
        style={{
          ...getArcTypographyStyle(foundationTheme, 'body'),
          color: foundationTheme.text.secondary,
          fontSize: compact ? '0.7rem' : '0.72rem',
          lineHeight: 1.35,
        }}
      >
        {pulse.message}
      </div>

      {pulse.detail?.whyItMatters ? (
        <div className="mt-3">
          <div style={getPulseChipStyle(hexToRgba(palette.accentSoft, 0.8))}>WHY IT MATTERS</div>
          <div
            className="mt-1.5"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'caption'),
              color: foundationTheme.text.secondary,
              fontSize: compact ? '0.62rem' : '0.64rem',
              lineHeight: 1.3,
            }}
          >
            {pulse.detail.whyItMatters}
          </div>
        </div>
      ) : null}

      {pulse.detail?.relatedProgress ? (
        <div
          className="mt-3 rounded-[14px] border px-2.5 py-2"
          style={{
            background: hexToRgba('#FFFFFF', 0.018),
            borderColor: hexToRgba(palette.accent, 0.09),
          }}
        >
          <div style={getPulseChipStyle(hexToRgba(foundationTheme.text.muted, 0.86))}>RELATED PROGRESS</div>
          <div
            className="mt-1"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'body'),
              color: foundationTheme.text.secondary,
              fontSize: compact ? '0.68rem' : '0.7rem',
            }}
          >
            {pulse.detail.relatedProgress}
          </div>
        </div>
      ) : null}

      {(pulse.summaryItems?.length ?? 0) > 1 ? (
        <div className="mt-3">
          <div style={getPulseChipStyle(hexToRgba(foundationTheme.text.muted, 0.86))}>INCLUDED</div>
          <div className="mt-1.5 space-y-1.5">
            {pulse.summaryItems?.slice(0, 4).map(item => (
              <div
                key={item.id}
                className="rounded-[12px] border px-2.5 py-2"
                style={{
                  background: hexToRgba('#FFFFFF', 0.018),
                  borderColor: hexToRgba(palette.accent, 0.08),
                }}
              >
                <div
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'body'),
                    color: foundationTheme.text.primary,
                    fontSize: compact ? '0.66rem' : '0.68rem',
                  }}
                >
                  {item.title}
                </div>
                <div
                  className="mt-0.5"
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'caption'),
                    color: foundationTheme.text.muted,
                    fontSize: compact ? '0.58rem' : '0.6rem',
                    lineHeight: 1.28,
                  }}
                >
                  {item.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {(onAction || pulse.detail?.actionHint) ? (
        <div className="mt-3 flex items-center justify-between gap-3">
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'caption'),
              color: foundationTheme.text.muted,
              fontSize: compact ? '0.58rem' : '0.6rem',
            }}
          >
            {pulse.detail?.actionHint ?? 'Open related detail'}
          </div>
          {onAction ? (
            <button
              type="button"
              onClick={onAction}
              className="rounded-full border px-3 py-1.5 transition-all"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                color: palette.accent,
                background: palette.chip,
                borderColor: hexToRgba(palette.accent, 0.16),
              }}
            >
              {pulse.detail?.actionLabel ?? 'Open'}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
