import type { ArcCurrentGoal } from './arc-app-data';
import type {
  FoundationChecklistEvaluation,
  FoundationChecklistEvaluatedItem,
  FoundationChecklistEvaluatedSection,
  FoundationChecklistSectionId,
} from './foundationChecklistTypes';

export interface ArcFoundationGoalState extends ArcCurrentGoal {
  source: 'foundationChecklist' | 'goalLibrary';
  completionPercent: number;
  completionRatio: number;
  completionSummary: string;
  foundationComplete: boolean;
  currentTaskTitle: string | null;
  currentTaskTargetLabel: string | null;
  currentTaskProgressLabel: string | null;
  currentTaskDescription: string | null;
  currentSectionId: FoundationChecklistSectionId | null;
  currentSectionTitle: string | null;
  currentSectionIntro: string | null;
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getCoreSections(evaluation: FoundationChecklistEvaluation) {
  return evaluation.sections.filter(section => section.definition.id !== 'finish');
}

function getCurrentFoundationTask(
  sections: FoundationChecklistEvaluatedSection[],
): {
  item: FoundationChecklistEvaluatedItem | null;
  section: FoundationChecklistEvaluatedSection | null;
} {
  for (const section of sections) {
    const activeItem =
      section.items.find(item => !item.completed && (item.completionState === 'in_progress' || item.completionState === 'active')) ??
      section.items.find(item => !item.completed);

    if (activeItem) {
      return {
        item: activeItem,
        section,
      };
    }
  }

  return {
    item: null,
    section: null,
  };
}

export function buildFoundationGoalState(
  baseGoal: ArcCurrentGoal,
  evaluation: FoundationChecklistEvaluation,
): ArcFoundationGoalState {
  const coreSections = getCoreSections(evaluation);
  const coreItems = coreSections.flatMap(section => section.items);
  const coreCompletedCount = coreItems.filter(item => item.completed).length;
  const coreTotalCount = coreItems.length;
  const { item: currentTask, section: currentSection } = getCurrentFoundationTask(coreSections);

  const progressiveCompletionRatio =
    currentTask && !currentTask.completed
      ? (coreCompletedCount + clampNumber(currentTask.completionRatio, 0, 1)) / Math.max(coreTotalCount, 1)
      : coreCompletedCount / Math.max(coreTotalCount, 1);

  if (evaluation.foundationComplete || !currentTask || !currentSection) {
    return {
      ...baseGoal,
      id: 'foundation-checklist',
      label: 'Foundation Checklist',
      description: 'Your first performance profile is locked in and ready to support deeper scoring and guidance.',
      category: 'broad',
      relatedModules: ['Foundation', 'Account Status', 'Current Goal'],
      activeFocusLabel: 'Foundation Complete',
      progressHint: `${coreTotalCount} / ${coreTotalCount} core targets complete`,
      source: 'foundationChecklist',
      completionPercent: 100,
      completionRatio: 1,
      completionSummary: `${coreTotalCount} / ${coreTotalCount} complete`,
      foundationComplete: true,
      currentTaskTitle: 'Foundation Complete',
      currentTaskTargetLabel: 'All Foundation targets reached',
      currentTaskProgressLabel: `${coreTotalCount} / ${coreTotalCount} targets`,
      currentTaskDescription: 'Your first Foundation profile is fully locked in.',
      currentSectionId: 'finish',
      currentSectionTitle: 'Complete',
      currentSectionIntro: 'Foundation is complete and ready to support broader scoring.',
    };
  }

  return {
    ...baseGoal,
    id: 'foundation-checklist',
    label: 'Foundation Checklist',
    description: currentTask.explanationShort,
    category: 'broad',
    relatedModules: ['Foundation', currentSection.definition.title, 'Account Status'],
    activeFocusLabel: currentTask.title,
    progressHint: `${currentSection.definition.title} • ${currentTask.progressDetail}`,
    source: 'foundationChecklist',
    completionPercent: Math.round(clampNumber(progressiveCompletionRatio, 0, 1) * 100),
    completionRatio: clampNumber(progressiveCompletionRatio, 0, 1),
    completionSummary: `${coreCompletedCount} / ${coreTotalCount} complete`,
    foundationComplete: false,
    currentTaskTitle: currentTask.title,
    currentTaskTargetLabel: currentTask.targetLabel,
    currentTaskProgressLabel: currentTask.progressDetail,
    currentTaskDescription: currentTask.explanationShort,
    currentSectionId: currentSection.definition.id,
    currentSectionTitle: currentSection.definition.title,
    currentSectionIntro: currentSection.definition.intro ?? null,
  };
}
