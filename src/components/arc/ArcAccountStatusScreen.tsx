import { useState } from 'react';
import type { ArcAppDataSnapshot } from '../../data/arc-app-data';
import ArcScreenHeader from './ArcScreenHeader';
import ArcFoundationChecklistSection from './ArcFoundationChecklistSection';
import { foundationTheme, getArcGlassPillStyle, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';

const ACCOUNT_STATUS_LEVELS = [
  {
    label: 'Foundation',
    description: 'Initial baseline capture begins and the profile starts taking shape.',
  },
  {
    label: 'Signal',
    description: 'Early signal confidence forms as more response history is recorded.',
  },
  {
    label: 'Form',
    description: 'Your response shape becomes clearer across sessions and resting states.',
  },
  {
    label: 'Prime',
    description: 'Thresholds and early readiness patterns begin to stabilize.',
  },
  {
    label: 'Vector',
    description: 'Trend direction becomes more trustworthy as repeatability improves.',
  },
  {
    label: 'Apex',
    description: 'Stronger consistency and deeper profile maturity are established.',
  },
  {
    label: 'Sovereign',
    description: 'The account reflects a highly developed long-range performance profile.',
  },
  {
    label: 'Obsidian',
    description: 'Maximum profile maturity with the deepest long-term confidence.',
  },
] as const;

function getCurrentStageIndex(_progress: number) {
  return 0;
}

export default function ArcAccountStatusScreen({
  onBack,
  data,
}: {
  onBack: () => void;
  data: ArcAppDataSnapshot;
}) {
  const [statusProgressionOpen, setStatusProgressionOpen] = useState(false);
  const currentStageIndex = getCurrentStageIndex(data.calibration.progress);

  return (
    <div className="animate-in slide-in-from-bottom-4 space-y-5 pb-12 duration-700">
      <ArcScreenHeader title="ACCOUNT STATUS" onBack={onBack} />

      <ArcFoundationChecklistSection data={data} />

      <div
        className="rounded-[30px] border p-5"
        style={{
          ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: foundationTheme.text.primary, tintStrength: 0.02 }),
          borderColor: hexToRgba('#FFFFFF', 0.07),
        }}
      >
        <button
          type="button"
          onClick={() => setStatusProgressionOpen(current => !current)}
          className="w-full text-left"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <div
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'sectionTitle'),
                    color: foundationTheme.text.primary,
                    letterSpacing: '0.13em',
                  }}
                >
                  STATUS PROGRESSION
                </div>
                <div
                  className="rounded-full border px-2.5 py-1"
                  style={{
                    ...getArcGlassPillStyle(foundationTheme, 'light', {
                      tint: foundationTheme.text.secondary,
                      tintStrength: 0.018,
                    }),
                    ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                    borderColor: hexToRgba('#FFFFFF', 0.055),
                    color: foundationTheme.text.tertiary,
                  }}
                >
                  Hidden
                </div>
              </div>
              <div
                className="mt-2"
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'caption'),
                  color: foundationTheme.text.secondary,
                }}
              >
                Foundation is the active starting status for now. Higher levels remain locked until their progression paths are introduced.
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 pt-0.5">
              <div
                className="rounded-full border px-2.5 py-1"
                style={{
                  ...getArcGlassPillStyle(foundationTheme, 'light', {
                    tint: foundationTheme.text.primary,
                    tintStrength: 0.018,
                  }),
                  ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                  borderColor: hexToRgba('#FFFFFF', 0.055),
                  color: foundationTheme.text.secondary,
                }}
              >
                {statusProgressionOpen ? 'Collapse' : 'Expand'}
              </div>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full border transition-transform duration-300"
                style={{
                  borderColor: hexToRgba('#FFFFFF', 0.06),
                  background: hexToRgba('#FFFFFF', 0.014),
                  color: foundationTheme.text.secondary,
                  transform: statusProgressionOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M6 8.5l4 4 4-4" />
                </svg>
              </div>
            </div>
          </div>
        </button>

        {statusProgressionOpen ? (
          <div className="mt-5 space-y-3">
            {ACCOUNT_STATUS_LEVELS.map((level, index) => {
              const isCurrent = index === currentStageIndex;
              const isReached = false;
              const isLocked = index > currentStageIndex;
              const rowTint = isCurrent
                ? foundationTheme.accent.primary
                : isReached
                  ? foundationTheme.text.highlight
                  : foundationTheme.text.secondary;

              return (
                <div
                  key={level.label}
                  className="flex items-center gap-3 rounded-[24px] border px-4 py-3"
                  style={{
                    ...getArcGlassSurfaceStyle(
                      foundationTheme,
                      'light',
                      {
                        tint: rowTint,
                        tintStrength: isCurrent ? 0.06 : isReached ? 0.026 : 0.014,
                      },
                    ),
                    borderColor: isCurrent
                      ? hexToRgba(foundationTheme.accent.primary, 0.16)
                      : hexToRgba('#FFFFFF', isLocked ? 0.045 : 0.07),
                  }}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border"
                    style={{
                      borderColor: isCurrent
                        ? hexToRgba(foundationTheme.accent.primary, 0.24)
                        : hexToRgba('#FFFFFF', isLocked ? 0.06 : 0.1),
                      background: isCurrent
                        ? hexToRgba(foundationTheme.accent.primary, 0.08)
                        : isReached
                          ? hexToRgba(foundationTheme.text.highlight, 0.03)
                          : hexToRgba('#FFFFFF', 0.015),
                    }}
                  >
                    <span
                      style={{
                        ...getArcTypographyStyle(foundationTheme, 'label'),
                        color: isCurrent
                          ? foundationTheme.text.highlight
                          : isReached
                            ? foundationTheme.text.secondary
                            : foundationTheme.text.tertiary,
                      }}
                    >
                      {index + 1}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      style={{
                        ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
                        color: isLocked ? foundationTheme.text.secondary : foundationTheme.text.primary,
                        fontSize: '0.98rem',
                      }}
                    >
                      {level.label}
                    </div>
                    <div
                      className="mt-1"
                      style={{
                        ...getArcTypographyStyle(foundationTheme, 'caption'),
                        color: isLocked ? foundationTheme.text.tertiary : foundationTheme.text.secondary,
                      }}
                    >
                      {level.description}
                    </div>
                  </div>

                  <div
                    className="shrink-0 rounded-full border px-3 py-1"
                    style={{
                      ...getArcGlassPillStyle(
                        foundationTheme,
                        'light',
                        {
                          tint: isCurrent
                            ? foundationTheme.accent.primary
                            : isReached
                              ? foundationTheme.text.highlight
                              : foundationTheme.text.secondary,
                          tintStrength: isCurrent ? 0.06 : 0.02,
                        },
                      ),
                      ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                      color: isCurrent
                        ? foundationTheme.text.highlight
                        : isReached
                          ? foundationTheme.text.secondary
                          : foundationTheme.text.tertiary,
                      borderColor: isCurrent
                        ? hexToRgba(foundationTheme.accent.primary, 0.16)
                        : hexToRgba('#FFFFFF', 0.06),
                    }}
                  >
                    {isCurrent ? 'Current' : isReached ? 'Reached' : 'Locked'}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
