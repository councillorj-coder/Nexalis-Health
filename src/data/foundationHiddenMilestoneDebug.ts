import type { FoundationHiddenMilestoneEvaluation } from './foundationHiddenMilestoneTypes';

export function buildFoundationHiddenMilestoneDebugData(evaluation: FoundationHiddenMilestoneEvaluation) {
  return {
    summary: {
      completedCount: evaluation.completedCount,
      totalCount: evaluation.totalCount,
      directPulseCount: evaluation.pulseEligibleMilestones.directPulse.length,
      summaryEligibleCount: evaluation.pulseEligibleMilestones.summaryEligible.length,
      silentCount: evaluation.pulseEligibleMilestones.silent.length,
      priorityCounts: evaluation.priorityCounts,
    },
    insightLinks: Object.values(evaluation.insightLinks).sort((left, right) =>
      left.insightLink.localeCompare(right.insightLink),
    ),
    clusters: evaluation.clusters.map(cluster => ({
      id: cluster.definition.id,
      title: cluster.definition.title,
      description: cluster.definition.description,
      completedCount: cluster.items.filter(item => item.isCompleted).length,
      totalCount: cluster.items.length,
      items: cluster.items.map(item => ({
        id: item.id,
        title: item.title,
        progressValue: item.progressValue,
        threshold: item.threshold,
        completionRatio: item.completionRatio,
        isCompleted: item.isCompleted,
        visibleChecklistLink: item.visibleChecklistLink,
        insightLink: item.insightLink,
        pulseTitle: item.pulseTitle,
        pulseMessage: item.pulseMessage,
        pulseCategory: item.pulseCategory,
        pulsePriority: item.pulsePriority,
        pulseAccentPriority: item.pulseAccentPriority,
        summaryEligible: item.summaryEligible,
        directPulseEligible: item.directPulseEligible,
        dedupeKey: item.dedupeKey,
        throttleKey: item.throttleKey,
      })),
    })),
    visibleChecklistLinks: Object.values(evaluation.visibleChecklistLinks).sort((left, right) =>
      left.checklistId.localeCompare(right.checklistId),
    ),
    pulseGroups: {
      directPulse: evaluation.pulseEligibleMilestones.directPulse.map(item => item.id),
      summaryEligible: evaluation.pulseEligibleMilestones.summaryEligible.map(item => item.id),
      silent: evaluation.pulseEligibleMilestones.silent.map(item => item.id),
    },
  };
}

export type FoundationHiddenMilestoneDebugData = ReturnType<typeof buildFoundationHiddenMilestoneDebugData>;
