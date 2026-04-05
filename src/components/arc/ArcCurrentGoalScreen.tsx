import type { ArcAppDataSnapshot, ArcGoalDefinition } from '../../data/arc-app-data';
import type { ArcFoundationGoalState } from '../../data/foundationGoalState';
import ArcScreenHeader from './ArcScreenHeader';
import { foundationTheme, getArcGlassPillStyle, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';

function GoalRow({
  goal,
  active,
  selectionLocked,
}: {
  goal: ArcGoalDefinition;
  active: boolean;
  selectionLocked: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[20px] border px-4 py-[0.95rem]"
      style={{
        ...getArcGlassSurfaceStyle(
          foundationTheme,
          'light',
          {
            tint: foundationTheme.text.primary,
            tintStrength: active ? 0.014 : 0.008,
          },
        ),
        borderColor: active
          ? hexToRgba('#FFFFFF', 0.09)
          : hexToRgba('#FFFFFF', 0.055),
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
              color: foundationTheme.text.highlight,
              fontSize: '0.98rem',
            }}
          >
            {goal.label}
          </div>
          <div
            className="mt-2 h-[2px] rounded-full"
            style={{
              width: `${Math.min(Math.max(goal.label.length * 7.5, 30), 94)}px`,
              background: hexToRgba(goal.accentColor, active ? 0.28 : 0.16),
            }}
          />
          <div
            className="mt-[0.7rem]"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'caption'),
              color: foundationTheme.text.secondary,
            }}
          >
            {goal.description}
          </div>
        </div>

        <div
          className="shrink-0 rounded-full border px-3 py-1"
          style={{
            ...getArcGlassPillStyle(
              foundationTheme,
              'light',
              {
                tint: foundationTheme.text.primary,
                tintStrength: active ? 0.012 : selectionLocked ? 0.006 : 0.006,
              },
            ),
            ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
            borderColor: active
              ? hexToRgba(goal.accentColor, 0.08)
              : hexToRgba('#FFFFFF', 0.055),
            color: active ? hexToRgba('#FFFFFF', 0.88) : hexToRgba('#FFFFFF', 0.62),
          }}
        >
          {active ? 'Current' : selectionLocked ? 'Locked' : 'Selectable Soon'}
        </div>
      </div>
    </div>
  );
}

export default function ArcCurrentGoalScreen({
  onBack,
  data,
  goalState,
}: {
  onBack: () => void;
  data: ArcAppDataSnapshot;
  goalState: ArcFoundationGoalState;
}) {
  const currentGoal = goalState;
  const broadGoals = data.goalLibrary.filter(goal => goal.category === 'broad');
  const goalSelectionLocked = data.calibration.progress < 1;
  const currentGoalAccent = currentGoal.accentColor ?? foundationTheme.accent.primary;

  return (
    <div className="animate-in slide-in-from-bottom-4 space-y-5 pb-12 duration-700">
      <ArcScreenHeader title="CURRENT GOAL" onBack={onBack} />

      <div
        className="rounded-[26px] border p-5"
        style={{
          ...getArcGlassSurfaceStyle(foundationTheme, 'hero', { tint: foundationTheme.text.primary, tintStrength: 0.014 }),
          borderColor: hexToRgba('#FFFFFF', 0.07),
        }}
      >
        <div
          style={{
            ...getArcTypographyStyle(foundationTheme, 'sectionTitle'),
            color: hexToRgba(currentGoalAccent, 0.38),
            letterSpacing: '0.14em',
          }}
        >
          ACTIVE DIRECTION
        </div>
        <div
          className="mt-3"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'displayHero'),
            color: foundationTheme.text.highlight,
            fontSize: '1.9rem',
            lineHeight: 1,
          }}
        >
          {currentGoal.label}
        </div>
        <div
          className="mt-2 max-w-[240px]"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'body'),
            color: foundationTheme.text.secondary,
          }}
        >
          {currentGoal.description}
        </div>

        {currentGoal.activeFocusLabel ? (
          <div
            className="mt-4 rounded-[20px] border px-4 py-3"
            style={{
              ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.text.primary, tintStrength: 0.01 }),
              borderColor: hexToRgba('#FFFFFF', 0.055),
            }}
          >
            <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted }}>
              Current focus
            </div>
            <div
              className="mt-1"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
                color: foundationTheme.text.primary,
              }}
            >
              {currentGoal.currentTaskTitle ?? currentGoal.activeFocusLabel}
            </div>
            <div
              className="mt-1.5"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'caption'),
                color: foundationTheme.text.secondary,
              }}
            >
              {currentGoal.currentTaskDescription ?? currentGoal.progressHint}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted }}>
                  Target
                </div>
                <div
                  className="mt-1"
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'caption'),
                    color: foundationTheme.text.primary,
                  }}
                >
                  {currentGoal.currentTaskTargetLabel ?? 'In progress'}
                </div>
              </div>
              <div>
                <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted }}>
                  Progress
                </div>
                <div
                  className="mt-1"
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'caption'),
                    color: foundationTheme.text.primary,
                  }}
                >
                  {currentGoal.currentTaskProgressLabel ?? currentGoal.completionSummary}
                </div>
              </div>
            </div>
            <div
              className="mt-3 rounded-full border px-3 py-1.5"
              style={{
                ...getArcGlassPillStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.022 }),
                borderColor: hexToRgba('#FFFFFF', 0.06),
              }}
            >
              <span style={{ ...getArcTypographyStyle(foundationTheme, 'pillLabel'), color: foundationTheme.text.secondary }}>
                {currentGoal.currentSectionTitle ?? 'Foundation'} • {currentGoal.completionSummary}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <div
        className="rounded-[30px] border p-5"
        style={{
          ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: foundationTheme.text.primary, tintStrength: 0.02 }),
          borderColor: hexToRgba('#FFFFFF', 0.07),
        }}
      >
        <div
          style={{
            ...getArcTypographyStyle(foundationTheme, 'sectionTitle'),
            color: foundationTheme.text.primary,
            letterSpacing: '0.13em',
          }}
        >
          GOAL LIBRARY
        </div>
        <div
          className="mt-2"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'caption'),
            color: foundationTheme.text.secondary,
          }}
        >
          {goalSelectionLocked
            ? 'Goal selection stays locked until calibration reaches 100%.'
          : 'These goals will become selectable later and will tune how Cinder HUB emphasizes your experience.'}
        </div>

        <div className="mt-5 space-y-3">
          {broadGoals.map(goal => (
            <GoalRow
              key={goal.id}
              goal={goal}
              active={goal.id === data.currentGoal.id}
              selectionLocked={goalSelectionLocked}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
