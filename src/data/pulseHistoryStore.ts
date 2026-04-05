import type { PulseItem } from './pulseTypes';

export const MAX_RECENT_PULSES = 200;

export function addPulseToRecentHistory(history: PulseItem[], item: PulseItem, maxItems = MAX_RECENT_PULSES) {
  if (!item.isPersistentInHistory) {
    return history;
  }

  const next = [item, ...history.filter(existing => existing.id !== item.id)];
  return next.slice(0, maxItems);
}
