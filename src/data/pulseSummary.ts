import { comparePulsePriority, resolvePulseAutoDismissMs } from './pulseThrottle';
import type { PulseInput, PulseItem, PulseSummaryEntry } from './pulseTypes';

export const PULSE_SUMMARY_WINDOW_MS = 8_000;

function toSummaryEntry(item: PulseItem): PulseSummaryEntry {
  return {
    id: item.id,
    title: item.title,
    message: item.message,
    category: item.category,
    timestamp: item.timestamp,
    source: item.source,
  };
}

function getSummaryCopy(item: PulseItem, count: number) {
  if (item.source === 'foundation_checklist') {
    if (item.category === 'accomplishment') {
      return {
        title: 'Foundation Progress',
        message: `${count} new milestones reached`,
      };
    }

    if (item.category === 'insight') {
      return {
        title: 'Foundation Insight',
        message: `${count} new learning signals available`,
      };
    }

    return {
      title: 'Foundation Guidance',
      message: `${count} new guidance updates ready`,
    };
  }

  if (item.category === 'accomplishment') {
    return {
      title: 'New Accomplishments',
      message: `${count} new accomplishments ready`,
    };
  }

  if (item.category === 'insight') {
    return {
      title: 'New Insights',
      message: `${count} new insights available`,
    };
  }

  return {
    title: 'New Guidance',
    message: `${count} new guidance updates ready`,
  };
}

export function canSummarizePulse(base: PulseItem, incoming: PulseItem, now: number) {
  return (
    base.summaryEligible &&
    incoming.summaryEligible &&
    base.summaryGroupKey != null &&
    base.summaryGroupKey === incoming.summaryGroupKey &&
    now - base.timestamp <= PULSE_SUMMARY_WINDOW_MS
  );
}

export function mergePulseIntoSummary(base: PulseItem, incoming: PulseItem, now: number): PulseItem {
  const summaryItems = [...(base.summaryItems ?? [toSummaryEntry(base)]), toSummaryEntry(incoming)];
  const count = summaryItems.length;
  const copy = getSummaryCopy(incoming, count);
  const dominantPriority =
    comparePulsePriority(base.priority, incoming.priority) > 0 ? incoming.priority : base.priority;

  return {
    ...base,
    title: copy.title,
    message: copy.message,
    timestamp: now,
    priority: dominantPriority,
    autoDismissMs: resolvePulseAutoDismissMs({
      category: base.category,
      priority: dominantPriority,
    }),
    summaryCount: count,
    summaryItems,
    detail: {
      ...base.detail,
      sourceLabel: base.detail?.sourceLabel ?? 'Pulse',
    },
  };
}

export function summarizePulseGroup(group: PulseItem[]) {
  const sorted = group.slice().sort((left, right) => left.timestamp - right.timestamp);
  const first = sorted[0];
  if (!first) {
    throw new Error('Cannot summarize an empty pulse group.');
  }
  return sorted.slice(1).reduce((summary, item) => mergePulseIntoSummary(summary, item, item.timestamp), first);
}

export function isPulseSummary(item: PulseItem) {
  return (item.summaryCount ?? 0) > 1 || (item.summaryItems?.length ?? 0) > 1;
}
