import { FOUNDATION_CHECKLIST_DEFINITIONS } from './foundationChecklistDefinitions';
import type { FoundationChecklistEvaluatedItem } from './foundationChecklistTypes';
import type { PulseInput } from './pulseTypes';

type FoundationPulseDescriptor = {
  title: string;
  message: string;
  whyItMatters: string;
};

const HIGH_PRIORITY_FOUNDATION_ACCOMPLISHMENTS = new Set([
  'wear-locked',
  'full-wear-base',
  'baseline-locked',
  'session-range',
  'strong-hold',
]);

const FOUNDATION_ACCOMPLISHMENT_COPY: Record<string, FoundationPulseDescriptor> = {
  'first-wear': {
    title: 'First Wear Complete',
    message: 'Your Foundation is officially underway.',
    whyItMatters: 'That first on-body hour gives Nexalis its first real calibration anchor for your starting profile.',
  },
  'wear-building': {
    title: 'Wear Building Complete',
    message: 'Your wear base is getting stronger.',
    whyItMatters: 'More wear depth helps the app separate short-term noise from the daily patterns that actually belong to you.',
  },
  'wear-locked': {
    title: 'Wear Locked',
    message: 'Your profile now has a more stable wear foundation.',
    whyItMatters: 'With this much wear depth in place, your early profile starts leaning on steadier personal context instead of lighter startup reads.',
  },
  'full-wear-base': {
    title: 'Full Wear Base',
    message: 'You now have the wear depth for a stronger starting profile.',
    whyItMatters: 'A fuller wear base gives Foundation the daily depth it needs to support stronger early interpretation.',
  },
  'baseline-started': {
    title: 'Baseline Started',
    message: 'The app has started learning your flaccid-state range.',
    whyItMatters: 'Baseline helps the app understand your normal resting state and how it shifts across everyday wear.',
  },
  'baseline-building': {
    title: 'Baseline Building',
    message: 'Your baseline read is becoming clearer.',
    whyItMatters: 'As more baseline time builds, your starting profile becomes more reliable and more personally tuned.',
  },
  'baseline-locked': {
    title: 'Baseline Locked',
    message: 'Your Foundation now has a more reliable baseline layer.',
    whyItMatters: 'A deeper baseline gives the app a stronger read on your normal flaccid range before it evaluates response shifts.',
  },
  'first-event-logged': {
    title: 'First Event Logged',
    message: 'Your first erection event gives the app its first real expansion read.',
    whyItMatters: 'Your first event gives the app its first clear look at expansion behavior and starts shaping your session profile.',
  },
  'session-building': {
    title: 'Session Building',
    message: 'Your response profile is starting to take shape.',
    whyItMatters: 'More than one meaningful session helps the app compare how your response behaves instead of relying on a single read.',
  },
  'session-range': {
    title: 'Session Range',
    message: 'Your early session profile just gained more range.',
    whyItMatters: 'More session range gives the app enough depth to start forming a repeatable early response profile.',
  },
  'static-session-logged': {
    title: 'Static Session Logged',
    message: 'This session added a cleaner still-state response read.',
    whyItMatters: 'Static sessions give the app a cleaner reference point with less movement affecting the read.',
  },
  'motion-session-logged': {
    title: 'Motion Session Logged',
    message: 'This session expanded your profile under active conditions.',
    whyItMatters: 'Motion sessions help the app understand how your response behaves under more active conditions.',
  },
  'strong-hold': {
    title: 'Strong Hold Captured',
    message: 'Your early profile just gained an important stability read.',
    whyItMatters: 'A strong hold adds early stability and staying-power context to your profile.',
  },
  'foundation-complete': {
    title: 'Foundation Complete',
    message: 'Your first performance profile is locked in.',
    whyItMatters: 'You now have enough wear, baseline, and session depth to support a stronger starting read.',
  },
};

const FOUNDATION_INSIGHT_COPY: Record<string, FoundationPulseDescriptor> = {
  'baseline-is-building': {
    title: 'Baseline is building',
    message: 'The app is getting a clearer view of your flaccid-state range.',
    whyItMatters: 'As baseline depth grows, Foundation gets a steadier read on your normal resting range across everyday wear.',
  },
  'wear-is-compounding': {
    title: 'Wear is compounding',
    message: 'More on-body time is sharpening your Foundation.',
    whyItMatters: 'Wear depth gives the system more personal context and improves the accuracy of your starting profile.',
  },
  'session-range-is-improving': {
    title: 'Session range is improving',
    message: 'Your early response profile is becoming more complete.',
    whyItMatters: 'More meaningful sessions help the app compare response patterns instead of treating every session as isolated.',
  },
  'foundation-is-stabilizing': {
    title: 'Foundation is stabilizing',
    message: 'Your first profile is gaining stronger depth and balance.',
    whyItMatters: 'As wear, baseline, and session lanes fill in together, your early profile becomes more personally tuned.',
  },
  'static-sessions-are-sharpening-your-read': {
    title: 'Static sessions are sharpening your read',
    message: 'Still-state sessions help refine the cleaner side of your response profile.',
    whyItMatters: 'Static conditions give the app a quieter signal to learn from, which improves the cleaner side of your early profile.',
  },
  'motion-sessions-are-expanding-your-profile': {
    title: 'Motion sessions are expanding your profile',
    message: 'Active sessions add more dynamic range to your early read.',
    whyItMatters: 'Motion sessions help the app understand how your response behaves when movement adds more variability to the signal.',
  },
};

const FOUNDATION_GUIDANCE_COPY: Record<string, FoundationPulseDescriptor> = {
  'more-baseline-time-will-strengthen-your-starting-read': {
    title: 'Next up',
    message: 'More baseline time will strengthen your starting read.',
    whyItMatters: 'Baseline is how the app learns your normal resting range, so more low-state time improves early reliability.',
  },
  'one-more-qualified-session-will-complete-session-range': {
    title: 'Helpful next step',
    message: 'One more qualified session will complete Session Range.',
    whyItMatters: 'A third meaningful session gives the app enough early depth to build a stronger response range.',
  },
  'a-motion-session-would-broaden-your-profile': {
    title: 'Profile tip',
    message: 'A motion session would broaden your early profile.',
    whyItMatters: 'Active sessions expand the app’s understanding of how your response behaves under more dynamic conditions.',
  },
  'more-wear-time-will-sharpen-your-foundation': {
    title: 'Foundation tip',
    message: 'More wear time will sharpen your Foundation.',
    whyItMatters: 'Wear depth gives the system more of your real daily rhythm to calibrate against.',
  },
  'a-strong-hold-will-add-stability-depth': {
    title: 'Session quality',
    message: 'A strong hold will add stability depth to your profile.',
    whyItMatters: 'A sustained hold gives the app a clearer read on early staying power and control.',
  },
};

function getFoundationDefinition(itemId: string) {
  return FOUNDATION_CHECKLIST_DEFINITIONS.find(definition => definition.id === itemId) ?? null;
}

export function createFoundationAccomplishmentPulse(item: FoundationChecklistEvaluatedItem): PulseInput | null {
  const copy = FOUNDATION_ACCOMPLISHMENT_COPY[item.id];
  if (!copy) {
    return null;
  }

  const priority =
    item.id === 'foundation-complete'
      ? 'veryHigh'
      : HIGH_PRIORITY_FOUNDATION_ACCOMPLISHMENTS.has(item.id)
        ? 'high'
        : 'normal';

  return {
    category: 'accomplishment',
    priority,
    title: copy.title,
    message: copy.message,
    source: 'foundation_checklist',
    sourceContext: item.id,
    accentStyle: 'platinumBlue',
    iconType: item.id === 'foundation-complete' ? 'foundation' : 'diamond',
    isPersistentInHistory: true,
    actionType: 'navigate',
    actionPayload: { screen: 'account-status', highlight: item.id },
    summaryGroupKey: 'foundation-accomplishments',
    summaryEligible: true,
    dedupeKey: `foundation-accomplishment:${item.id}`,
    throttleKey: 'foundation-accomplishment',
    detail: {
      sourceLabel: 'Foundation',
      whyItMatters: copy.whyItMatters,
      relatedProgress: item.progressDetail,
      actionHint: 'Open Foundation Checklist',
      actionLabel: 'View Foundation',
    },
    metadata: {
      itemId: item.id,
      metricType: item.metricType,
    },
  };
}

export function createFoundationInsightPulse(
  key: keyof typeof FOUNDATION_INSIGHT_COPY,
  relatedProgress?: string,
): PulseInput {
  const copy = FOUNDATION_INSIGHT_COPY[key]!;

  return {
    category: 'insight',
    priority: 'normal',
    title: copy.title,
    message: copy.message,
    source: 'foundation_checklist',
    sourceContext: key,
    accentStyle: 'iceBlue',
    iconType: 'pulseLine',
    isPersistentInHistory: true,
    actionType: 'navigate',
    actionPayload: { screen: 'account-status', highlight: 'foundation' },
    summaryGroupKey: 'foundation-insights',
    summaryEligible: true,
    dedupeKey: `foundation-insight:${key}`,
    throttleKey: 'foundation-insight',
    detail: {
      sourceLabel: 'Foundation',
      whyItMatters: copy.whyItMatters,
      relatedProgress,
      actionHint: 'Open Foundation Checklist',
      actionLabel: 'View Foundation',
    },
  };
}

export function createFoundationGuidancePulse(
  key: keyof typeof FOUNDATION_GUIDANCE_COPY,
  relatedProgress?: string,
): PulseInput {
  const copy = FOUNDATION_GUIDANCE_COPY[key]!;

  return {
    category: 'guidance',
    priority: 'low',
    title: copy.title,
    message: copy.message,
    source: 'foundation_checklist',
    sourceContext: key,
    accentStyle: 'indigo',
    iconType: 'ring',
    isPersistentInHistory: true,
    actionType: 'navigate',
    actionPayload: { screen: 'account-status', highlight: 'foundation' },
    summaryGroupKey: 'foundation-guidance',
    summaryEligible: true,
    dedupeKey: `foundation-guidance:${key}`,
    throttleKey: 'foundation-guidance',
    detail: {
      sourceLabel: 'Foundation',
      whyItMatters: copy.whyItMatters,
      relatedProgress,
      actionHint: 'Review Foundation Checklist',
      actionLabel: 'View Foundation',
    },
  };
}

export function getFoundationPulseProgressLabel(itemId: string, fallback?: string) {
  const definition = getFoundationDefinition(itemId);
  return fallback ?? definition?.targetLabel ?? undefined;
}
