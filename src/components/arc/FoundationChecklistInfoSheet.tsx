import { createPortal } from 'react-dom';
import type { FoundationChecklistInfoDefinition } from '../../data/foundationChecklistTypes';
import { foundationTheme, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';

export default function FoundationChecklistInfoSheet({
  info,
  open,
  onClose,
}: {
  info: FoundationChecklistInfoDefinition | null;
  open: boolean;
  onClose: () => void;
}) {
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 transition-all duration-300"
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
        aria-label="Close Foundation guide"
        style={{
          background: `linear-gradient(180deg, ${hexToRgba('#020406', 0.16)} 0%, ${hexToRgba('#020406', 0.58)} 100%)`,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      />

      <div
        className="relative w-full max-w-[380px] rounded-[26px] border px-4 pb-4 pt-3.5"
        style={{
          ...getArcGlassSurfaceStyle(foundationTheme, 'medium', {
            tint: '#8EBCE8',
            tintStrength: 0.024,
          }),
          borderColor: hexToRgba('#BFD9F4', 0.11),
          boxShadow: `${String(
            getArcGlassSurfaceStyle(foundationTheme, 'medium', {
              tint: '#8EBCE8',
              tintStrength: 0.024,
            }).boxShadow ?? '',
          )}, 0 0 24px ${hexToRgba('#8EBCE8', 0.06)}`,
          transform: open ? 'translateY(0px) scale(1)' : 'translateY(12px) scale(0.985)',
          transition: 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div
              style={{
                ...getArcTypographyStyle(foundationTheme, 'sectionTitle'),
                color: hexToRgba(foundationTheme.text.secondary, 0.76),
                letterSpacing: '0.12em',
              }}
            >
              FOUNDATION GUIDE
            </div>
            <div
              className="mt-2"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
                color: foundationTheme.text.primary,
                fontSize: '1.02rem',
              }}
            >
              {info?.title ?? ''}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border"
            style={{
              borderColor: hexToRgba('#BFD9F4', 0.14),
              background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.028)} 0%, ${hexToRgba('#FFFFFF', 0.01)} 100%), linear-gradient(135deg, ${hexToRgba('#8EBCE8', 0.06)} 0%, transparent 74%)`,
              color: hexToRgba('#E7F2FF', 0.9),
            }}
            aria-label="Close"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div
            className="rounded-[20px] border px-4 py-3"
            style={{
              ...getArcGlassSurfaceStyle(foundationTheme, 'light', {
                tint: '#DCEBFA',
                tintStrength: 0.016,
              }),
              borderColor: hexToRgba('#DCEBFA', 0.08),
            }}
          >
            <div
              style={{
                ...getArcTypographyStyle(foundationTheme, 'label'),
                color: foundationTheme.text.tertiary,
                fontSize: '0.42rem',
                letterSpacing: '0.11em',
              }}
            >
              WHAT IT MEANS
            </div>
            <div
              className="mt-2"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'body'),
                color: foundationTheme.text.secondary,
                fontSize: '0.76rem',
              }}
            >
              {info?.whatItMeans ?? ''}
            </div>
          </div>

          <div
            className="rounded-[20px] border px-4 py-3"
            style={{
              ...getArcGlassSurfaceStyle(foundationTheme, 'light', {
                tint: '#8EBCE8',
                tintStrength: 0.02,
              }),
              borderColor: hexToRgba('#BFD9F4', 0.09),
            }}
          >
            <div
              style={{
                ...getArcTypographyStyle(foundationTheme, 'label'),
                color: foundationTheme.text.tertiary,
                fontSize: '0.42rem',
                letterSpacing: '0.11em',
              }}
            >
              WHY IT MATTERS
            </div>
            <div
              className="mt-2"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'body'),
                color: foundationTheme.text.secondary,
                fontSize: '0.76rem',
              }}
            >
              {info?.whyItMatters ?? ''}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
