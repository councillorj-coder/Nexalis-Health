import type { ArcAppDataSnapshot } from './arc-app-data';
import {
  FOUNDATION_CHECKLIST_DEFINITIONS,
  FOUNDATION_CHECKLIST_SECTIONS,
} from './foundationChecklistDefinitions';
import { evaluateFoundationHiddenMilestones } from './foundationHiddenMilestoneEvaluator';
import { getFoundationHiddenMilestonesForChecklistItem } from './foundationHiddenMilestoneChecklistMap';
import type {
  FoundationChecklistCompletionState,
  FoundationChecklistEvaluatedItem,
  FoundationChecklistEvaluation,
  FoundationChecklistMetrics,
  FoundationChecklistMetricType,
} from './foundationChecklistTypes';
import type { FoundationHiddenMilestoneEvaluation } from './foundationHiddenMilestoneTypes';

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundToSingleDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function formatHoursProgress(progressValue: number, threshold: number, metricLabel = 'hours') {
  return `${roundToSingleDecimal(progressValue).toFixed(1)} / ${threshold} ${metricLabel}`;
}

function formatCountProgress(progressValue: number, threshold: number, singular: string, plural: string) {
  const rounded = Math.floor(progressValue);
  const thresholdLabel = threshold === 1 ? singular : plural;
  return `${rounded} / ${threshold} ${thresholdLabel}`;
}

function formatProgressDetail(metricType: FoundationChecklistMetricType, progressValue: number, threshold: number) {
  switch (metricType) {
    case 'totalWearHours':
      return formatHoursProgress(progressValue, threshold, 'hours');
    case 'totalBaselineHours':
      return formatHoursProgress(progressValue, threshold, 'baseline hours');
    case 'qualifiedEventCount':
      return formatCountProgress(progressValue, threshold, 'event', 'events');
    case 'qualifiedSessionCount':
      return formatCountProgress(progressValue, threshold, 'session', 'sessions');
    case 'staticSessionCount':
      return formatCountProgress(progressValue, threshold, 'static session', 'static sessions');
    case 'motionSessionCount':
      return formatCountProgress(progressValue, threshold, 'motion session', 'motion sessions');
    case 'strongHoldCount':
      return formatCountProgress(progressValue, threshold, 'strong hold', 'strong holds');
    case 'foundationAllTargetsComplete':
      return `${Math.floor(progressValue)} / ${threshold} targets`;
    default:
      return `${Math.floor(progressValue)} / ${threshold}`;
  }
}

function getMetricValue(metrics: FoundationChecklistMetrics, metricType: FoundationChecklistMetricType) {
  return metrics[metricType];
}

export function buildFoundationChecklistMetricsFromHiddenEvaluation(
  hiddenEvaluation: FoundationHiddenMilestoneEvaluation,
): FoundationChecklistMetrics {
  const { metrics: hiddenMetrics } = hiddenEvaluation;

  return {
    totalWearHours: roundToSingleDecimal(hiddenMetrics.totalWearMinutes / 60),
    totalBaselineHours: roundToSingleDecimal(hiddenMetrics.baselineMinutes / 60),
    qualifiedEventCount: hiddenMetrics.qualifiedEventCount,
    qualifiedSessionCount: hiddenMetrics.qualifiedSessionCount,
    staticSessionCount: hiddenMetrics.staticSessionCount,
    motionSessionCount: hiddenMetrics.motionSessionCount,
    strongHoldCount: hiddenMetrics.holdMinutes >= 5 ? 1 : 0,
    foundationAllTargetsComplete: 0,
  };
}

function buildChecklistCompletionState(
  mode: 'ladder' | 'parallel' | 'finish',
  rawItems: Array<FoundationChecklistEvaluatedItem & { rawCompleted: boolean }>,
): FoundationChecklistEvaluatedItem[] {
  if (mode === 'parallel') {
    return rawItems.map(item => ({
      ...item,
      completionState: item.rawCompleted
        ? 'completed'
        : item.progressValue > 0
          ? 'in_progress'
          : 'active',
      completed: item.rawCompleted,
    }));
  }

  if (mode === 'finish') {
    return rawItems.map(item => ({
      ...item,
      completionState: item.rawCompleted
        ? 'completed'
        : item.progressValue > 0
          ? 'in_progress'
          : 'active',
      completed: item.rawCompleted,
    }));
  }

  let encounteredOpenMilestone = false;

  return rawItems.map(item => {
    let completionState: FoundationChecklistCompletionState;

    if (item.rawCompleted) {
      completionState = 'completed';
    } else if (!encounteredOpenMilestone) {
      completionState = item.progressValue > 0 ? 'in_progress' : 'active';
      encounteredOpenMilestone = true;
    } else {
      completionState = 'upcoming';
    }

    return {
      ...item,
      completionState,
      completed: item.rawCompleted,
    };
  });
}

export function buildFoundationChecklistMetricsFromSnapshot(data: ArcAppDataSnapshot): FoundationChecklistMetrics {
  const hiddenEvaluation = evaluateFoundationHiddenMilestones(data);
  return buildFoundationChecklistMetricsFromHiddenEvaluation(hiddenEvaluation);
}

export function evaluateFoundationChecklist(
  metricsInput: FoundationChecklistMetrics,
  hiddenEvaluation?: FoundationHiddenMilestoneEvaluation,
): FoundationChecklistEvaluation {
  const preliminaryItems = FOUNDATION_CHECKLIST_DEFINITIONS.map(definition => {
    const progressValue = getMetricValue(metricsInput, definition.metricType);
    const completionRatio =
      definition.metricType === 'foundationAllTargetsComplete'
        ? 0
        : clampNumber(progressValue / definition.threshold, 0, 1);

    return {
      ...definition,
      progressValue,
      completionRatio,
      progressDetail: formatProgressDetail(definition.metricType, progressValue, definition.threshold),
      rawCompleted: progressValue >= definition.threshold,
      completionState: 'upcoming' as FoundationChecklistCompletionState,
      completed: false,
      linkedHiddenMilestoneIds: [],
      hiddenMilestoneCompletedCount: 0,
      hiddenMilestoneTotalCount: 0,
    };
  });

  const completedTargetsBeforeFinish = preliminaryItems.filter(
    item => item.metricType !== 'foundationAllTargetsComplete' && item.rawCompleted,
  ).length;
  const metrics: FoundationChecklistMetrics = {
    ...metricsInput,
    foundationAllTargetsComplete: completedTargetsBeforeFinish,
  };

  const itemsById = preliminaryItems.map(item => {
    const progressValue =
      item.metricType === 'foundationAllTargetsComplete'
        ? metrics.foundationAllTargetsComplete
        : item.progressValue;
    const linkedHiddenMilestoneIds =
      hiddenEvaluation?.visibleChecklistLinks[item.id]?.milestoneIds ??
      getFoundationHiddenMilestonesForChecklistItem(item.id);
    const hiddenLinkSummary = hiddenEvaluation?.visibleChecklistLinks[item.id];

    return {
      ...item,
      progressValue,
      completionRatio: clampNumber(progressValue / item.threshold, 0, 1),
      progressDetail: formatProgressDetail(item.metricType, progressValue, item.threshold),
      rawCompleted: progressValue >= item.threshold,
      linkedHiddenMilestoneIds,
      hiddenMilestoneCompletedCount: hiddenLinkSummary?.completedCount ?? 0,
      hiddenMilestoneTotalCount: hiddenLinkSummary?.totalCount ?? linkedHiddenMilestoneIds.length,
    };
  });

  const sections = FOUNDATION_CHECKLIST_SECTIONS
    .slice()
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map(sectionDefinition => {
      const rawItems = itemsById
        .filter(item => item.section === sectionDefinition.id)
        .sort((left, right) => left.sortOrder - right.sortOrder);

      const items = buildChecklistCompletionState(sectionDefinition.progressionStyle, rawItems);

      return {
        definition: sectionDefinition,
        items,
      };
    });

  const allEvaluatedItems = sections.flatMap(section => section.items);
  const completedCount = allEvaluatedItems.filter(item => item.completed).length;

  return {
    sections,
    completedCount,
    totalCount: FOUNDATION_CHECKLIST_DEFINITIONS.length,
    foundationComplete: allEvaluatedItems.some(item => item.id === 'foundation-complete' && item.completed),
    metrics,
    hiddenLinkSummaryByItemId: Object.fromEntries(
      FOUNDATION_CHECKLIST_DEFINITIONS.map(definition => {
        const linkSummary = hiddenEvaluation?.visibleChecklistLinks[definition.id];
        const milestoneIds = linkSummary?.milestoneIds ?? getFoundationHiddenMilestonesForChecklistItem(definition.id);
        return [
          definition.id,
          {
            milestoneIds,
            completedCount: linkSummary?.completedCount ?? 0,
            totalCount: linkSummary?.totalCount ?? milestoneIds.length,
          },
        ];
      }),
    ),
  };
}

export function buildFoundationChecklistRuntimeFromSnapshot(data: ArcAppDataSnapshot) {
  const hidden = evaluateFoundationHiddenMilestones(data);
  const metrics = buildFoundationChecklistMetricsFromHiddenEvaluation(hidden);
  const visible = evaluateFoundationChecklist(metrics, hidden);

  return {
    hidden,
    metrics,
    visible,
  };
}
