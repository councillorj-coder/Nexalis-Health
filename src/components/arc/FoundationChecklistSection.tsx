import type {
  FoundationChecklistEvaluatedItem,
  FoundationChecklistInfoTermId,
  FoundationChecklistSectionId,
  FoundationChecklistSectionDefinition,
} from '../../data/foundationChecklistTypes';
import { foundationTheme, getArcTypographyStyle, hexToRgba } from './arc-theme';
import FoundationChecklistRow from './FoundationChecklistRow';

function getSectionAccent(sectionId: FoundationChecklistSectionId) {
  switch (sectionId) {
    case 'wear':
      return '#8DA9C7';
    case 'baseline':
      return '#8FC9D8';
    case 'sessions':
      return '#729BE4';
    case 'sessionType':
      return '#7B82CB';
    case 'sessionQuality':
      return '#BDD4E6';
    case 'finish':
    default:
      return '#E5EDF8';
  }
}

export default function FoundationChecklistSection({
  definition,
  items,
  open,
  onToggleOpen,
  expandedItemId,
  onToggleItem,
  onOpenInfo,
}: {
  definition: FoundationChecklistSectionDefinition;
  items: FoundationChecklistEvaluatedItem[];
  open: boolean;
  onToggleOpen: () => void;
  expandedItemId: string | null;
  onToggleItem: (itemId: string) => void;
  onOpenInfo: (termId: FoundationChecklistInfoTermId) => void;
}) {
  const sectionAccent = getSectionAccent(definition.id);
  const completedCount = items.filter(item => item.completed).length;

  return (
    <section
      className="rounded-[18px] border px-3 py-2.5"
      style={{
        background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.012)} 0%, ${hexToRgba('#FFFFFF', 0.006)} 100%), linear-gradient(135deg, ${hexToRgba(sectionAccent, 0.028)} 0%, transparent 74%)`,
        borderColor: hexToRgba(sectionAccent, 0.09),
        boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.026)}, 0 8px 20px rgba(0,0,0,0.14)`,
      }}
    >
      <button
        type="button"
        onClick={onToggleOpen}
        className="w-full text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <div
              className="h-[2px] w-7 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${hexToRgba(sectionAccent, 0.96)} 0%, ${hexToRgba(sectionAccent, 0)} 100%)`,
                  boxShadow: `0 0 4px ${hexToRgba(sectionAccent, 0.04)}`,
              }}
            />
              <div
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'sectionTitle'),
                  color: foundationTheme.text.primary,
                  letterSpacing: '0.1em',
                  fontSize: '0.62rem',
                }}
              >
                {definition.title}
              </div>
            </div>
            {definition.intro ? (
              <div
                className="mt-1 max-w-[360px]"
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'caption'),
                  color: hexToRgba(foundationTheme.text.secondary, 0.9),
                  fontSize: '0.58rem',
                  lineHeight: 1.16,
                }}
              >
                {definition.intro}
              </div>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div
              className="rounded-full border px-2.5 py-1"
              style={{
                color: foundationTheme.text.secondary,
                borderColor: hexToRgba(sectionAccent, 0.14),
                background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', 0.02)} 0%, ${hexToRgba('#FFFFFF', 0.008)} 100%), linear-gradient(135deg, ${hexToRgba(sectionAccent, 0.04)} 0%, transparent 76%)`,
                ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
              }}
            >
              {completedCount} / {items.length}
            </div>
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full border transition-transform duration-300"
              style={{
                borderColor: hexToRgba(sectionAccent, 0.14),
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
        </div>
      </button>

      {open ? (
        <div className="mt-2 space-y-1.25">
          {items.map(item => (
            <FoundationChecklistRow
              key={item.id}
              item={item}
              sectionAccent={sectionAccent}
              expanded={expandedItemId === item.id}
              onToggleExpand={() => onToggleItem(item.id)}
              onOpenInfo={onOpenInfo}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
