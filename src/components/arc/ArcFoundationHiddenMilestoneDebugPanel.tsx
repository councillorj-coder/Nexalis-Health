import { useEffect, useState } from 'react';
import type { FoundationHiddenMilestoneDebugData } from '../../data/foundationHiddenMilestoneDebug';
import { foundationTheme, getArcGlassPillStyle, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';

function formatMetricValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function humanizeToken(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, character => character.toUpperCase());
}

function DebugMetaPill({
  label,
  tone,
}: {
  label: string;
  tone: string;
}) {
  return (
    <div
      className="rounded-full border px-2 py-[0.22rem]"
      style={{
        ...getArcGlassPillStyle(foundationTheme, 'light', {
          tint: tone,
          tintStrength: 0.015,
        }),
        ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
        borderColor: hexToRgba(tone, 0.12),
        color: hexToRgba('#F2F7FF', 0.88),
        fontSize: '0.48rem',
      }}
    >
      {label}
    </div>
  );
}

function getPriorityTone(priority: string) {
  switch (priority) {
    case 'veryHigh':
      return '#D7B56A';
    case 'high':
      return '#7EC796';
    case 'normal':
      return '#7DA9D7';
    case 'low':
    default:
      return '#7C8796';
  }
}

export default function ArcFoundationHiddenMilestoneDebugPanel({
  debugData,
}: {
  debugData: FoundationHiddenMilestoneDebugData;
}) {
  const [open, setOpen] = useState(false);
  const [openClusters, setOpenClusters] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOpenClusters(current => {
      let changed = false;
      const next = { ...current };

      debugData.clusters.forEach((cluster, index) => {
        if (next[cluster.id] === undefined) {
          next[cluster.id] = index === 0;
          changed = true;
        }
      });

      return changed ? next : current;
    });
  }, [debugData.clusters]);

  return (
    <section
      className="mt-3 overflow-hidden rounded-[18px] border"
      style={{
        ...getArcGlassSurfaceStyle(foundationTheme, 'light', {
          tint: '#7AAEE1',
          tintStrength: 0.012,
        }),
        borderColor: hexToRgba('#AFCBE8', 0.08),
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(current => !current)}
        className="flex w-full items-center justify-between gap-4 px-3 py-2.5 text-left"
      >
        <div className="min-w-0">
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'label'),
              color: hexToRgba('#CFE3F7', 0.72),
              fontSize: '0.44rem',
              letterSpacing: '0.11em',
            }}
          >
            INTERNAL FOUNDATION DEBUG
          </div>
          <div
            className="mt-1"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
              color: foundationTheme.text.primary,
              fontSize: '0.74rem',
            }}
          >
            Hidden Milestone Map
          </div>
          <div
            className="mt-1"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'caption'),
              color: foundationTheme.text.tertiary,
              fontSize: '0.56rem',
              lineHeight: 1.14,
            }}
          >
            {debugData.summary.completedCount} / {debugData.summary.totalCount} hidden milestones complete
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <DebugMetaPill
            label={`${debugData.summary.directPulseCount} direct`}
            tone="#97C9F9"
          />
          <DebugMetaPill
            label={`${debugData.summary.summaryEligibleCount} summary`}
            tone="#8FB3D9"
          />
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full border transition-transform duration-300"
            style={{
              borderColor: hexToRgba('#BCD5EC', 0.1),
              background: hexToRgba('#FFFFFF', 0.014),
              color: foundationTheme.text.secondary,
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M6 8.5l4 4 4-4" />
            </svg>
          </div>
        </div>
      </button>

      {open ? (
        <div
          className="space-y-2 border-t px-3 pb-3 pt-2.5"
          style={{ borderColor: hexToRgba('#FFFFFF', 0.05) }}
        >
          <div className="flex flex-wrap gap-1.5">
            <DebugMetaPill label={`${debugData.summary.silentCount} silent`} tone="#7A8EA4" />
            <DebugMetaPill label={`${debugData.summary.priorityCounts.low} low`} tone="#7C8796" />
            <DebugMetaPill label={`${debugData.summary.priorityCounts.normal} normal`} tone="#7DA9D7" />
            <DebugMetaPill label={`${debugData.summary.priorityCounts.high} high`} tone="#7EC796" />
            <DebugMetaPill label={`${debugData.summary.priorityCounts.veryHigh} very high`} tone="#D7B56A" />
            {debugData.insightLinks.map(insight => (
              <DebugMetaPill
                key={insight.insightLink}
                label={`${humanizeToken(insight.insightLink)} ${insight.completedCount}/${insight.totalCount}`}
                tone="#87BCE7"
              />
            ))}
          </div>

          <div
            className="rounded-[14px] border px-2.5 py-2"
            style={{
              borderColor: hexToRgba('#AFC8E5', 0.08),
              background: hexToRgba('#FFFFFF', 0.012),
            }}
          >
            <div
              style={{
                ...getArcTypographyStyle(foundationTheme, 'label'),
                color: hexToRgba('#CFE3F7', 0.72),
                fontSize: '0.44rem',
                letterSpacing: '0.11em',
              }}
            >
              VISIBLE CHECKLIST LINKS
            </div>
            <div className="mt-1.5 space-y-1">
              {debugData.visibleChecklistLinks.map(link => (
                <div
                  key={link.checklistId}
                  className="flex items-center justify-between gap-3"
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'caption'),
                    fontSize: '0.56rem',
                    lineHeight: 1.16,
                  }}
                >
                  <span style={{ color: foundationTheme.text.secondary }}>
                    {humanizeToken(link.checklistId)}
                  </span>
                  <span style={{ color: foundationTheme.text.highlight }}>
                    {link.completedCount} / {link.totalCount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            {debugData.clusters.map(cluster => (
              <div
                key={cluster.id}
                className="overflow-hidden rounded-[14px] border"
                style={{
                  borderColor: hexToRgba('#B1CAE6', 0.08),
                  background: hexToRgba('#FFFFFF', 0.01),
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenClusters(current => ({
                      ...current,
                      [cluster.id]: !current[cluster.id],
                    }))
                  }
                  className="flex w-full items-center justify-between gap-4 px-2.5 py-2 text-left"
                >
                  <div className="min-w-0">
                    <div
                      style={{
                        ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
                        color: foundationTheme.text.primary,
                        fontSize: '0.68rem',
                      }}
                    >
                      {cluster.title}
                    </div>
                    <div
                      className="mt-1"
                      style={{
                        ...getArcTypographyStyle(foundationTheme, 'caption'),
                        color: foundationTheme.text.tertiary,
                        fontSize: '0.54rem',
                        lineHeight: 1.14,
                      }}
                    >
                      {cluster.description}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <DebugMetaPill
                      label={`${cluster.completedCount} / ${cluster.totalCount}`}
                      tone="#86B6E0"
                    />
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded-full border transition-transform duration-300"
                      style={{
                        borderColor: hexToRgba('#BCD5EC', 0.1),
                        background: hexToRgba('#FFFFFF', 0.014),
                        color: foundationTheme.text.secondary,
                        transform: openClusters[cluster.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    >
                      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M6 8.5l4 4 4-4" />
                      </svg>
                    </div>
                  </div>
                </button>

                {openClusters[cluster.id] ? (
                  <div
                    className="space-y-1 border-t px-2.5 pb-2.5 pt-2"
                    style={{ borderColor: hexToRgba('#FFFFFF', 0.045) }}
                  >
                    {cluster.items.map(item => (
                      <div
                        key={item.id}
                        className="rounded-[12px] border px-2.5 py-2"
                        style={{
                          borderColor: hexToRgba('#B1CAE6', 0.06),
                          background: hexToRgba('#FFFFFF', 0.008),
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div
                              style={{
                                ...getArcTypographyStyle(foundationTheme, 'body'),
                                color: item.isCompleted
                                  ? hexToRgba('#F2F7FF', 0.92)
                                  : foundationTheme.text.secondary,
                                fontSize: '0.6rem',
                                lineHeight: 1.12,
                              }}
                            >
                              {item.title}
                            </div>
                            <div
                              className="mt-1"
                              style={{
                                ...getArcTypographyStyle(foundationTheme, 'caption'),
                                color: foundationTheme.text.tertiary,
                                fontSize: '0.52rem',
                                lineHeight: 1.14,
                              }}
                            >
                              {item.id}
                            </div>
                          </div>

                          <div
                            className="shrink-0"
                            style={{
                              ...getArcTypographyStyle(foundationTheme, 'caption'),
                              color: item.isCompleted
                                ? hexToRgba('#EAF4FF', 0.92)
                                : foundationTheme.text.secondary,
                              fontSize: '0.54rem',
                            }}
                          >
                            {formatMetricValue(item.progressValue)} / {formatMetricValue(item.threshold)}
                          </div>
                        </div>

                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          <DebugMetaPill
                            label={item.isCompleted ? 'Completed' : 'Open'}
                            tone={item.isCompleted ? '#C7DDF5' : '#7D8E9F'}
                          />
                          <DebugMetaPill
                            label={item.directPulseEligible ? 'Direct Pulse' : 'Summary First'}
                            tone={item.directPulseEligible ? '#97C9F9' : '#8FB3D9'}
                          />
                          <DebugMetaPill
                            label={humanizeToken(item.pulsePriority)}
                            tone={getPriorityTone(item.pulsePriority)}
                          />
                          <DebugMetaPill
                            label={`Checklist: ${humanizeToken(item.visibleChecklistLink)}`}
                            tone="#86B6E0"
                          />
                          {item.insightLink ? (
                            <DebugMetaPill
                              label={`Insight: ${humanizeToken(item.insightLink)}`}
                              tone="#87BCE7"
                            />
                          ) : null}
                        </div>

                        <div
                          className="mt-1.5"
                          style={{
                            ...getArcTypographyStyle(foundationTheme, 'caption'),
                            color: foundationTheme.text.secondary,
                            fontSize: '0.56rem',
                            lineHeight: 1.15,
                          }}
                        >
                          <span style={{ color: hexToRgba('#F0F6FF', 0.88) }}>{item.pulseTitle}</span>
                          {' · '}
                          <span style={{ color: foundationTheme.text.tertiary }}>{item.pulseMessage}</span>
                        </div>

                        <div
                          className="mt-1"
                          style={{
                            ...getArcTypographyStyle(foundationTheme, 'caption'),
                            color: foundationTheme.text.tertiary,
                            fontSize: '0.5rem',
                            lineHeight: 1.14,
                          }}
                        >
                          {humanizeToken(item.pulseCategory)} pulse
                          {' · '}
                          summary {item.summaryEligible ? 'on' : 'off'}
                          {' · '}
                          dedupe {item.dedupeKey}
                          {' · '}
                          throttle {item.throttleKey}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
