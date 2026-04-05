import type { PulseCategory, PulseInput, PulseItem, PulsePriority } from './pulseTypes';

export const PULSE_VISIBLE_COOLDOWN_MS = 20_000;

const PRIORITY_ORDER: Record<PulsePriority, number> = {
  low: 0,
  normal: 1,
  high: 2,
  veryHigh: 3,
};

const CATEGORY_BASE_AUTO_DISMISS_MS: Record<PulseCategory, number> = {
  accomplishment: 4_000,
  insight: 4_500,
  guidance: 5_000,
};

const PRIORITY_AUTO_DISMISS_MODIFIER_MS: Record<PulsePriority, number> = {
  low: -500,
  normal: 0,
  high: 1_000,
  veryHigh: 2_000,
};

export function getPulsePriorityWeight(priority: PulsePriority) {
  return PRIORITY_ORDER[priority];
}

export function comparePulsePriority(left: PulsePriority, right: PulsePriority) {
  return getPulsePriorityWeight(right) - getPulsePriorityWeight(left);
}

export function resolvePulseAutoDismissMs(item: Pick<PulseInput, 'category' | 'priority'>) {
  return Math.max(
    2_800,
    CATEGORY_BASE_AUTO_DISMISS_MS[item.category] + PRIORITY_AUTO_DISMISS_MODIFIER_MS[item.priority],
  );
}

export function getPulseDedupeWindowMs(item: Pick<PulseInput, 'category' | 'priority'>) {
  if (item.category === 'accomplishment') {
    return Number.POSITIVE_INFINITY;
  }

  if (item.category === 'guidance') {
    return 15 * 60 * 1000;
  }

  if (item.category === 'insight' && item.priority === 'low') {
    return 10 * 60 * 1000;
  }

  return 6 * 60 * 1000;
}

export function getPulseThrottleWindowMs(item: Pick<PulseInput, 'priority'>) {
  if (item.priority === 'veryHigh' || item.priority === 'high') {
    return 0;
  }

  return PULSE_VISIBLE_COOLDOWN_MS;
}

export function getPulseStaleWindowMs(item: Pick<PulseItem, 'category' | 'priority'>) {
  if (item.category === 'accomplishment') {
    return Number.POSITIVE_INFINITY;
  }

  if (item.category === 'guidance' && item.priority !== 'veryHigh' && item.priority !== 'high') {
    return 10 * 60 * 1000;
  }

  if (item.category === 'insight' && item.priority === 'low') {
    return 15 * 60 * 1000;
  }

  return 20 * 60 * 1000;
}

export function shouldBypassVisibilityCooldown(item: Pick<PulseItem, 'priority'>) {
  return item.priority === 'high' || item.priority === 'veryHigh';
}

export function isPulseStale(item: PulseItem, now: number) {
  const windowMs = getPulseStaleWindowMs(item);
  return Number.isFinite(windowMs) ? now - item.timestamp > windowMs : false;
}
