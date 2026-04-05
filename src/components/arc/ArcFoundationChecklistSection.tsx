import { useEffect, useMemo, useState } from 'react';
import type { ArcAppDataSnapshot } from '../../data/arc-app-data';
import {
  FOUNDATION_CHECKLIST_HEADER,
  FOUNDATION_CHECKLIST_INFO_TERMS,
} from '../../data/foundationChecklistDefinitions';
import { buildFoundationChecklistRuntimeFromSnapshot } from '../../data/foundationChecklistEvaluator';
import { buildFoundationHiddenMilestoneDebugData } from '../../data/foundationHiddenMilestoneDebug';
import type { FoundationChecklistInfoTermId } from '../../data/foundationChecklistTypes';
import { foundationTheme, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';
import ArcFoundationHiddenMilestoneDebugPanel from './ArcFoundationHiddenMilestoneDebugPanel';
import FoundationChecklistInfoSheet from './FoundationChecklistInfoSheet';
import FoundationChecklistSection from './FoundationChecklistSection';

function FoundationHeaderInfoButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300"
      style={{
        borderColor: hexToRgba('#BFD9F4', 0.16),
        background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.028)} 0%, ${hexToRgba('#FFFFFF', 0.008)} 100%), linear-gradient(135deg, ${hexToRgba('#8EBCE8', 0.085)} 0%, transparent 74%)`,
        color: hexToRgba('#E7F2FF', 0.92),
        boxShadow: `0 0 14px ${hexToRgba('#8EBCE8', 0.08)}`,
      }}
      aria-label="Open Foundation guide"
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
        <circle cx="10" cy="10" r="7.2" strokeWidth="1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M10 8.25v4.25" />
        <circle cx="10" cy="5.9" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    </button>
  );
}

export default function ArcFoundationChecklistSection({
  data,
}: {
  data: ArcAppDataSnapshot;
}) {
  const foundationHiddenDebugEnabled = import.meta.env.DEV;
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [activeInfoTermId, setActiveInfoTermId] = useState<FoundationChecklistInfoTermId | null>(null);

  const foundationRuntime = useMemo(() => buildFoundationChecklistRuntimeFromSnapshot(data), [data]);
  const evaluation = foundationRuntime.visible;
  const hiddenDebugData = useMemo(
    () => buildFoundationHiddenMilestoneDebugData(foundationRuntime.hidden),
    [foundationRuntime.hidden],
  );
  const visibleSections = useMemo(
    () => evaluation.sections.filter(section => section.definition.id !== 'finish'),
    [evaluation.sections],
  );
  const visibleCompletedCount = useMemo(
    () =>
      visibleSections.reduce(
        (total, section) => total + section.items.filter(item => item.completed).length,
        0,
      ),
    [visibleSections],
  );
  const visibleTotalCount = useMemo(
    () => visibleSections.reduce((total, section) => total + section.items.length, 0),
    [visibleSections],
  );
  const infoTermMap = useMemo(
    () =>
      FOUNDATION_CHECKLIST_INFO_TERMS.reduce<Record<string, (typeof FOUNDATION_CHECKLIST_INFO_TERMS)[number]>>(
        (map, item) => {
          map[item.id] = item;
          return map;
        },
        {},
      ),
    [],
  );

  const activeInfo = activeInfoTermId ? infoTermMap[activeInfoTermId] ?? null : null;
  const completionRatio = visibleTotalCount > 0 ? visibleCompletedCount / visibleTotalCount : 0;
  const completionPercent = Math.round(completionRatio * 100);

  useEffect(() => {
    setOpenSections(current => {
      let changed = false;
      const next = { ...current };

      visibleSections.forEach((section, index) => {
        if (next[section.definition.id] === undefined) {
          next[section.definition.id] = index === 0;
          changed = true;
        }
      });

      return changed ? next : current;
    });
  }, [visibleSections]);

  return (
    <div
      className="relative overflow-hidden rounded-[26px] border p-4"
      style={{
        ...getArcGlassSurfaceStyle(foundationTheme, 'medium', {
          tint: '#86B8E8',
          tintStrength: 0.016,
        }),
        borderColor: hexToRgba('#FFFFFF', 0.055),
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background: `radial-gradient(circle at 14% 16%, ${hexToRgba('#D5E9FF', 0.022)} 0%, transparent 52%), linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.01)} 0%, transparent 100%)`,
        }}
      />

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'sectionTitle'),
              color: hexToRgba(foundationTheme.text.secondary, 0.78),
              letterSpacing: '0.13em',
            }}
          >
            {FOUNDATION_CHECKLIST_HEADER.label}
          </div>
          <FoundationHeaderInfoButton onClick={() => setActiveInfoTermId('foundation')} />
        </div>

        <div
          className="mt-2"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'displayHero'),
            color: foundationTheme.text.highlight,
            fontSize: '1.34rem',
            lineHeight: 1,
          }}
        >
          {FOUNDATION_CHECKLIST_HEADER.title}
        </div>

        <div
          className="mt-2.5 max-w-[360px]"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'body'),
            color: foundationTheme.text.secondary,
            fontSize: '0.72rem',
            lineHeight: 1.22,
          }}
        >
          {FOUNDATION_CHECKLIST_HEADER.primarySubline}
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <div
            className="max-w-[360px]"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'caption'),
              color: foundationTheme.text.tertiary,
              fontSize: '0.6rem',
              lineHeight: 1.18,
            }}
          >
            {FOUNDATION_CHECKLIST_HEADER.secondarySupportLine}
          </div>
        </div>

        <div className="mt-2.5">
          <div
            className="rounded-[18px] border px-3.5 py-3"
            style={{
              ...getArcGlassSurfaceStyle(foundationTheme, 'light', {
                tint: '#86B8E8',
                tintStrength: 0.016,
              }),
              borderColor: hexToRgba('#D8EAFF', 0.06),
              boxShadow: `${String(
                getArcGlassSurfaceStyle(foundationTheme, 'light', {
                  tint: '#86B8E8',
                  tintStrength: 0.016,
                }).boxShadow ?? '',
              )}, 0 0 6px ${hexToRgba('#86B8E8', 0.012)}`,
            }}
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <div
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'label'),
                    color: hexToRgba('#D7E7FA', 0.72),
                    fontSize: '0.42rem',
                    letterSpacing: '0.11em',
                  }}
                >
                  FOUNDATION PROGRESS
                </div>
                <div
                  className="mt-1"
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
                    color: foundationTheme.text.secondary,
                    fontSize: '0.76rem',
                  }}
                >
                  {visibleCompletedCount} / {visibleTotalCount} complete
                </div>
              </div>

              <div
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'displayHero'),
                  color: foundationTheme.text.highlight,
                  fontSize: '1.24rem',
                  lineHeight: 0.9,
                }}
              >
                {completionPercent}%
              </div>
            </div>

            <div
              className="mt-2.5 h-[4px] w-full overflow-hidden rounded-full"
              style={{ background: hexToRgba('#0B1118', 0.72) }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(completionRatio === 0 ? 4 : 0, Math.round(completionRatio * 100))}%`,
                  background: `linear-gradient(90deg, ${hexToRgba('#7FB4EA', 0.96)} 0%, ${hexToRgba('#EAF4FF', 0.92)} 100%)`,
                  boxShadow: `0 0 5px ${hexToRgba('#8FC6FF', 0.045)}`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {evaluation.foundationComplete ? (
        <div
          className="mt-3 rounded-[18px] border px-3 py-2.5"
          style={{
            ...getArcGlassSurfaceStyle(foundationTheme, 'hero', {
              tint: foundationTheme.accent.primary,
              tintStrength: 0.015,
            }),
            borderColor: hexToRgba('#FFFFFF', 0.055),
            boxShadow: `${String(
              getArcGlassSurfaceStyle(foundationTheme, 'hero', {
                tint: foundationTheme.accent.primary,
                tintStrength: 0.015,
              }).boxShadow ?? '',
            )}, 0 0 6px ${hexToRgba(foundationTheme.accent.primary, 0.014)}`,
          }}
        >
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'sectionTitle'),
              color: hexToRgba(foundationTheme.text.secondary, 0.82),
              letterSpacing: '0.12em',
            }}
          >
            FOUNDATION COMPLETE
          </div>
          <div
            className="mt-2"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
              color: foundationTheme.text.primary,
              fontSize: '0.88rem',
            }}
          >
            Your first performance profile is locked in.
          </div>
          <div
            className="mt-2"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'body'),
              color: foundationTheme.text.secondary,
              fontSize: '0.68rem',
            }}
          >
            You now have enough wear, baseline, and session depth to power a stronger starting read.
          </div>
        </div>
      ) : null}

      <div className="mt-3.5 space-y-2">
        {visibleSections.map(section => (
          <FoundationChecklistSection
            key={section.definition.id}
            definition={section.definition}
            items={section.items}
            open={Boolean(openSections[section.definition.id])}
            onToggleOpen={() =>
              setOpenSections(current => ({
                ...current,
                [section.definition.id]: !current[section.definition.id],
              }))
            }
            expandedItemId={expandedItemId}
            onToggleItem={itemId => setExpandedItemId(current => (current === itemId ? null : itemId))}
            onOpenInfo={termId => setActiveInfoTermId(termId)}
          />
        ))}
      </div>

      <FoundationChecklistInfoSheet
        info={activeInfo}
        open={Boolean(activeInfo)}
        onClose={() => setActiveInfoTermId(null)}
      />

      {foundationHiddenDebugEnabled ? (
        <ArcFoundationHiddenMilestoneDebugPanel debugData={hiddenDebugData} />
      ) : null}
    </div>
  );
}
