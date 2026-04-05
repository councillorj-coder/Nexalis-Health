import type {
  FoundationChecklistCompletionState,
  FoundationChecklistEvaluatedItem,
  FoundationChecklistInfoTermId,
} from '../../data/foundationChecklistTypes';
import { foundationTheme, getArcGlassPillStyle, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';

function getStateTone(state: FoundationChecklistCompletionState) {
  switch (state) {
    case 'completed':
      return '#EAF4FF';
    case 'in_progress':
      return '#85BDF0';
    case 'upcoming':
      return '#718399';
    case 'active':
    default:
      return '#9BCAFA';
  }
}

function getStateLabel(state: FoundationChecklistCompletionState) {
  switch (state) {
    case 'completed':
      return 'Completed';
    case 'in_progress':
      return 'In progress';
    case 'upcoming':
      return 'Upcoming';
    case 'active':
    default:
      return 'Active';
  }
}

function ChecklistStatePill({ state }: { state: FoundationChecklistCompletionState }) {
  const tone = getStateTone(state);
  const pillSurface = getArcGlassPillStyle(foundationTheme, 'light', {
    tint: tone,
    tintStrength: state === 'completed' ? 0.024 : state === 'upcoming' ? 0.01 : 0.034,
  });

  return (
    <div
      className="shrink-0 rounded-full border px-2.25 py-[0.24rem]"
      style={{
        ...pillSurface,
        background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', state === 'upcoming' ? 0.012 : 0.02)} 0%, ${hexToRgba('#FFFFFF', 0.007)} 100%), linear-gradient(135deg, ${hexToRgba(tone, state === 'upcoming' ? 0.016 : 0.036)} 0%, transparent 76%)`,
        ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
        borderColor: hexToRgba(state === 'completed' ? '#EAF4FF' : tone, state === 'upcoming' ? 0.08 : 0.14),
        color:
          state === 'completed'
            ? hexToRgba('#F4F8FF', 0.92)
            : state === 'upcoming'
              ? hexToRgba('#AAB8C9', 0.88)
              : hexToRgba('#F1F7FF', 0.96),
        boxShadow: `${String(pillSurface.boxShadow ?? '')}, 0 0 5px ${hexToRgba(tone, state === 'upcoming' ? 0 : 0.018)}`,
      }}
    >
      {getStateLabel(state)}
    </div>
  );
}

function getInfoTermLabel(termId: FoundationChecklistInfoTermId) {
  switch (termId) {
    case 'strongHold':
      return 'Strong Hold';
    case 'motionSession':
      return 'Motion Session';
    case 'staticSession':
      return 'Static Session';
    default:
      return termId.charAt(0).toUpperCase() + termId.slice(1);
  }
}

function RowInfoButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={event => {
        event.stopPropagation();
        onClick();
      }}
      className="flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300"
      style={{
        borderColor: hexToRgba('#BFD9F4', 0.16),
        background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.02)} 0%, ${hexToRgba('#FFFFFF', 0.007)} 100%), linear-gradient(135deg, ${hexToRgba('#8EBCE8', 0.05)} 0%, transparent 74%)`,
        color: hexToRgba('#EAF4FF', 0.9),
        boxShadow: `0 0 5px ${hexToRgba('#8EBCE8', 0.014)}`,
      }}
      aria-label="Open more information"
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
        <circle cx="10" cy="10" r="7.2" strokeWidth="1.45" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.55" d="M10 8.2v4.3" />
        <circle cx="10" cy="5.95" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    </button>
  );
}

export default function FoundationChecklistRow({
  item,
  sectionAccent,
  expanded,
  onToggleExpand,
  onOpenInfo,
}: {
  item: FoundationChecklistEvaluatedItem;
  sectionAccent: string;
  expanded: boolean;
  onToggleExpand: () => void;
  onOpenInfo?: (termId: FoundationChecklistInfoTermId) => void;
}) {
  const tone = getStateTone(item.completionState);
  const isCompleted = item.completionState === 'completed';
  const isUpcoming = item.completionState === 'upcoming';
  const progressWidth = Math.max(item.completed ? 100 : 4, Math.round(item.completionRatio * 100));
  const baseSurface = getArcGlassSurfaceStyle(foundationTheme, 'light', {
    tint: sectionAccent,
    tintStrength: isUpcoming ? 0.01 : isCompleted ? 0.016 : 0.022,
  });

  const progressFill = isCompleted
    ? `linear-gradient(90deg, ${hexToRgba('#E3ECF8', 0.95)} 0%, ${hexToRgba('#FFFFFF', 0.98)} 100%)`
    : isUpcoming
      ? `linear-gradient(90deg, ${hexToRgba('#627184', 0.55)} 0%, ${hexToRgba('#74869A', 0.38)} 100%)`
      : `linear-gradient(90deg, ${hexToRgba('#7AB3E8', 0.96)} 0%, ${hexToRgba('#E6F2FF', 0.88)} 100%)`;

  return (
    <div
      className="overflow-hidden rounded-[16px] border"
      style={{
        ...baseSurface,
        background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', isCompleted ? 0.018 : 0.016)} 0%, ${hexToRgba('#FFFFFF', 0.007)} 100%), linear-gradient(135deg, ${hexToRgba(sectionAccent, isUpcoming ? 0.014 : isCompleted ? 0.022 : 0.028)} 0%, transparent 76%)`,
        borderColor: isCompleted
          ? hexToRgba('#DDE8F6', 0.14)
          : isUpcoming
            ? hexToRgba('#7A8AA0', 0.12)
            : hexToRgba(tone, 0.13),
        boxShadow: `${String(baseSurface.boxShadow ?? '')}, 0 0 6px ${hexToRgba(isCompleted ? '#EAF4FF' : tone, isUpcoming ? 0 : 0.012)}`,
      }}
    >
      <div className="flex items-start gap-2.5 px-3 py-2.5">
        <button
          type="button"
          onClick={onToggleExpand}
          className="flex min-w-0 flex-1 items-start gap-2.5 text-left"
        >
          <div
            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
            style={{
              background:
                item.completionState === 'completed'
                  ? hexToRgba(foundationTheme.text.highlight, 0.72)
                  : item.completionState === 'upcoming'
                    ? hexToRgba(foundationTheme.text.secondary, 0.26)
                    : hexToRgba(foundationTheme.text.highlight, 0.92),
              boxShadow:
                item.completionState === 'upcoming'
                  ? 'none'
                  : `0 0 0 1px ${hexToRgba(tone, 0.14)}`,
            }}
          />

          <div className="min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
                    color: isCompleted
                      ? hexToRgba('#F3F8FF', 0.92)
                      : isUpcoming
                        ? hexToRgba(foundationTheme.text.secondary, 0.84)
                        : foundationTheme.text.primary,
                    fontSize: '0.78rem',
                    lineHeight: 1.12,
                  }}
                >
                  {item.title}
                </div>
              </div>
            </div>

            <div
              className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'caption'),
                fontSize: '0.58rem',
                lineHeight: 1.14,
              }}
            >
              <span style={{ color: hexToRgba('#D8E4F0', 0.82) }}>
                Target: {item.targetLabel}
              </span>
              <span style={{ color: isCompleted ? hexToRgba('#F4F8FF', 0.82) : isUpcoming ? hexToRgba('#9AABBE', 0.76) : hexToRgba('#DFF0FF', 0.88) }}>
                {item.progressDetail}
              </span>
            </div>

            <div
              className="mt-1"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'caption'),
                color: isUpcoming ? foundationTheme.text.tertiary : foundationTheme.text.secondary,
                fontSize: '0.58rem',
                lineHeight: 1.18,
              }}
            >
              {item.explanationShort}
            </div>

            <div
              className="mt-1.5 h-[4px] w-full overflow-hidden rounded-full"
              style={{
                background: isUpcoming
                  ? hexToRgba('#0C1218', 0.52)
                  : `linear-gradient(180deg, ${hexToRgba('#0B1016', 0.88)} 0%, ${hexToRgba('#111821', 0.62)} 100%)`,
                boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.035)}`,
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressWidth}%`,
                  background: progressFill,
                  boxShadow: isUpcoming ? 'none' : `0 0 5px ${hexToRgba(isCompleted ? '#EAF4FF' : '#87C2F5', 0.04)}`,
                }}
              />
            </div>
          </div>
        </button>

        <div className="flex shrink-0 items-center gap-2 pl-1">
          <ChecklistStatePill state={item.completionState} />
          {item.infoTermId && onOpenInfo ? (
            <RowInfoButton onClick={() => onOpenInfo(item.infoTermId!)} />
          ) : null}
          <button
            type="button"
            onClick={onToggleExpand}
            className="flex h-6 w-6 items-center justify-center rounded-full border transition-transform duration-300"
            style={{
              borderColor: hexToRgba('#FFFFFF', 0.05),
              background: hexToRgba('#FFFFFF', 0.014),
              color: hexToRgba(foundationTheme.text.secondary, 0.78),
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
            aria-label={expanded ? 'Collapse row details' : 'Expand row details'}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M6 8.5l4 4 4-4" />
            </svg>
          </button>
        </div>
      </div>

      {expanded ? (
        <div
          className="space-y-2 border-t px-3 pb-3 pt-2.5"
          style={{ borderColor: hexToRgba('#FFFFFF', 0.045) }}
        >
          <div className="grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <div
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'label'),
                  color: foundationTheme.text.tertiary,
                  fontSize: '0.42rem',
                  letterSpacing: '0.11em',
                }}
              >
                TARGET
              </div>
              <div
                className="mt-1.5"
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'body'),
                  color: foundationTheme.text.secondary,
                  fontSize: '0.66rem',
                }}
              >
                {item.targetLabel}
              </div>
            </div>

            <div className="space-y-1.5">
              <div
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'label'),
                  color: foundationTheme.text.tertiary,
                  fontSize: '0.42rem',
                  letterSpacing: '0.11em',
                }}
              >
                PROGRESS
              </div>
              <div
                className="mt-1.5"
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'body'),
                  color: foundationTheme.text.secondary,
                  fontSize: '0.66rem',
                }}
              >
                {item.progressDetail}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
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
              style={{
                ...getArcTypographyStyle(foundationTheme, 'caption'),
                color: foundationTheme.text.secondary,
                fontSize: '0.6rem',
                lineHeight: 1.18,
              }}
            >
              {item.explanationExpandedWhatItMeans}
            </div>
          </div>

          <div className="space-y-1.5">
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
              style={{
                ...getArcTypographyStyle(foundationTheme, 'caption'),
                color: foundationTheme.text.secondary,
                fontSize: '0.6rem',
                lineHeight: 1.18,
              }}
            >
              {item.explanationExpandedWhyItMatters}
            </div>
          </div>

          {item.infoTermId && onOpenInfo ? (
            <div className="flex justify-start">
              <button
                type="button"
                onClick={event => {
                  event.stopPropagation();
                  onOpenInfo(item.infoTermId!);
                }}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-300"
                style={{
                  ...getArcGlassPillStyle(foundationTheme, 'light', {
                    tint: '#8EBCE8',
                    tintStrength: 0.018,
                  }),
                  ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                  borderColor: hexToRgba('#BFD9F4', 0.1),
                  color: hexToRgba('#E8F3FF', 0.9),
                  boxShadow: `0 0 5px ${hexToRgba('#8EBCE8', 0.014)}`,
                }}
              >
                <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <circle cx="10" cy="10" r="7.2" strokeWidth="1.45" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.55" d="M10 8.2v4.3" />
                  <circle cx="10" cy="5.95" r="0.8" fill="currentColor" stroke="none" />
                </svg>
                More about {getInfoTermLabel(item.infoTermId)}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
