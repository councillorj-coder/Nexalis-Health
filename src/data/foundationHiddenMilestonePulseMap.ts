import { FOUNDATION_HIDDEN_MILESTONES } from './foundationHiddenMilestones';
import type { FoundationHiddenMilestoneEvaluatedItem } from './foundationHiddenMilestoneTypes';
import type { PulseInput } from './pulseTypes';

function getAccentStyle(category: FoundationHiddenMilestoneEvaluatedItem['pulseCategory']): PulseInput['accentStyle'] {
  switch (category) {
    case 'insight':
      return 'iceBlue';
    case 'guidance':
      return 'indigo';
    case 'accomplishment':
    default:
      return 'platinumBlue';
  }
}

function getIconType(category: FoundationHiddenMilestoneEvaluatedItem['pulseCategory']): PulseInput['iconType'] {
  switch (category) {
    case 'insight':
      return 'pulseLine';
    case 'guidance':
      return 'ring';
    case 'accomplishment':
    default:
      return 'diamond';
  }
}

function formatRelatedProgress(milestone: FoundationHiddenMilestoneEvaluatedItem) {
  const progressValue = Number.isInteger(milestone.progressValue)
    ? String(milestone.progressValue)
    : milestone.progressValue.toFixed(1);
  const threshold = Number.isInteger(milestone.threshold)
    ? String(milestone.threshold)
    : milestone.threshold.toFixed(1);

  return `${progressValue} / ${threshold}`;
}

export const FOUNDATION_HIDDEN_MILESTONE_PULSE_MAP = Object.fromEntries(
  FOUNDATION_HIDDEN_MILESTONES.map(milestone => [
    milestone.id,
    {
      title: milestone.pulseTitle,
      message: milestone.pulseMessage,
      category: milestone.pulseCategory,
      priority: milestone.pulsePriority,
      accentPriority: milestone.pulseAccentPriority,
      summaryEligible: milestone.summaryEligible,
      directPulseEligible: milestone.directPulseEligible,
      dedupeKey: milestone.dedupeKey,
      throttleKey: milestone.throttleKey,
    },
  ]),
);

export function createFoundationHiddenMilestonePulse(
  milestone: FoundationHiddenMilestoneEvaluatedItem,
): PulseInput {
  return {
    category: milestone.pulseCategory,
    priority: milestone.pulsePriority,
    title: milestone.pulseTitle,
    message: milestone.pulseMessage,
    source: 'foundation_checklist',
    sourceContext: milestone.id,
    accentStyle: getAccentStyle(milestone.pulseCategory),
    iconType: getIconType(milestone.pulseCategory),
    isPersistentInHistory: true,
    actionType: 'navigate',
    actionPayload: {
      screen: 'account-status',
      highlight: milestone.visibleChecklistLink,
      hiddenMilestoneId: milestone.id,
    },
    summaryGroupKey: `foundation-hidden:${milestone.cluster}`,
    summaryEligible: milestone.summaryEligible,
    dedupeKey: milestone.dedupeKey,
    throttleKey: milestone.throttleKey,
    detail: {
      sourceLabel: milestone.title,
      whyItMatters: milestone.pulseMessage,
      relatedProgress: formatRelatedProgress(milestone),
      actionHint: 'Open Foundation Checklist',
      actionLabel: 'View Foundation',
    },
    metadata: {
      milestoneId: milestone.id,
      hiddenMilestoneTitle: milestone.title,
      cluster: milestone.cluster,
      visibleChecklistLink: milestone.visibleChecklistLink,
      pulseAccentPriority: milestone.pulseAccentPriority,
      directPulseEligible: milestone.directPulseEligible,
    },
  };
}
