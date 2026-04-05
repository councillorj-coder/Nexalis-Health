import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { addPulseToRecentHistory } from '../../data/pulseHistoryStore';
import {
  comparePulsePriority,
  getPulseDedupeWindowMs,
  getPulseThrottleWindowMs,
  isPulseStale,
  resolvePulseAutoDismissMs,
  shouldBypassVisibilityCooldown,
  PULSE_VISIBLE_COOLDOWN_MS,
} from '../../data/pulseThrottle';
import { canSummarizePulse, mergePulseIntoSummary, summarizePulseGroup } from '../../data/pulseSummary';
import type { PulseController, PulseInput, PulseItem, PulsePriority, PulsePriorityMuteState } from '../../data/pulseTypes';

const PulseContext = createContext<PulseController | null>(null);
const PULSE_MUTED_POPUP_PRIORITIES_STORAGE_KEY = 'arc-pulse-muted-popup-priorities-v1';

function createDefaultPulsePriorityMuteState(): PulsePriorityMuteState {
  return {
    low: false,
    normal: false,
    high: false,
    veryHigh: false,
  };
}

function readStoredPulsePriorityMuteState(): PulsePriorityMuteState {
  if (typeof window === 'undefined') {
    return createDefaultPulsePriorityMuteState();
  }

  try {
    const rawValue = window.localStorage.getItem(PULSE_MUTED_POPUP_PRIORITIES_STORAGE_KEY);
    if (!rawValue) {
      return createDefaultPulsePriorityMuteState();
    }

    const parsed = JSON.parse(rawValue) as Partial<PulsePriorityMuteState>;
    return {
      low: parsed.low === true,
      normal: parsed.normal === true,
      high: parsed.high === true,
      veryHigh: parsed.veryHigh === true,
    };
  } catch {
    return createDefaultPulsePriorityMuteState();
  }
}

function createPulseId() {
  return `pulse-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizePulseInput(input: PulseInput): PulseItem {
  const timestamp = input.timestamp ?? Date.now();
  return {
    ...input,
    id: input.id ?? createPulseId(),
    timestamp,
    accentStyle:
      input.accentStyle ??
      (input.category === 'accomplishment'
        ? 'platinumBlue'
        : input.category === 'insight'
          ? 'iceBlue'
          : 'indigo'),
    iconType:
      input.iconType ??
      (input.category === 'accomplishment'
        ? 'diamond'
        : input.category === 'insight'
          ? 'pulseLine'
          : 'ring'),
    actionType: input.actionType ?? 'none',
    isDismissed: false,
    isRead: false,
    isExpanded: false,
    isPersistentInHistory: input.isPersistentInHistory ?? true,
    autoDismissMs: input.autoDismissMs ?? resolvePulseAutoDismissMs(input),
  };
}

function sortPulseQueue(queue: PulseItem[]) {
  return queue
    .slice()
    .sort((left, right) => comparePulsePriority(left.priority, right.priority) || left.timestamp - right.timestamp);
}

function cleanPulseQueue(queue: PulseItem[], now: number) {
  return sortPulseQueue(queue.filter(item => !item.isDismissed && !isPulseStale(item, now)));
}

function shouldSuppressByDedupe(item: PulseItem, memory: Record<string, number>, now: number) {
  if (!item.dedupeKey) {
    return false;
  }

  const lastSeenAt = memory[item.dedupeKey];
  if (lastSeenAt == null) {
    return false;
  }

  const windowMs = getPulseDedupeWindowMs(item);
  return Number.isFinite(windowMs) ? now - lastSeenAt < windowMs : true;
}

function shouldSuppressByThrottle(item: PulseItem, memory: Record<string, number>, now: number) {
  if (!item.throttleKey) {
    return false;
  }

  const lastSeenAt = memory[item.throttleKey];
  if (lastSeenAt == null) {
    return false;
  }

  const windowMs = getPulseThrottleWindowMs(item);
  return windowMs > 0 && now - lastSeenAt < windowMs;
}

function updatePulseInCollection(collection: PulseItem[], ids: string[], patch: Partial<PulseItem>) {
  const targets = new Set(ids);
  return collection.map(item => (targets.has(item.id) ? { ...item, ...patch } : item));
}

function getPulseRelatedIds(item: PulseItem) {
  return [item.id, ...(item.summaryItems?.map(summaryItem => summaryItem.id) ?? [])];
}

function shouldInterruptActivePulse(activePulse: PulseItem, incomingPulse: PulseItem) {
  if (activePulse.isExpanded) {
    return false;
  }

  return comparePulsePriority(activePulse.priority, incomingPulse.priority) > 0;
}

export function PulseProvider({ value, children }: { value: PulseController; children: ReactNode }) {
  return <PulseContext.Provider value={value}>{children}</PulseContext.Provider>;
}

export function usePulse() {
  const context = useContext(PulseContext);
  if (!context) {
    throw new Error('usePulse must be used within a PulseProvider.');
  }
  return context;
}

export function usePulseController(): PulseController {
  const [activePulse, setActivePulse] = useState<PulseItem | null>(null);
  const [pulseQueue, setPulseQueue] = useState<PulseItem[]>([]);
  const [recentPulseHistory, setRecentPulseHistory] = useState<PulseItem[]>([]);
  const [mutedPopupPriorities, setMutedPopupPriorities] = useState<PulsePriorityMuteState>(() =>
    readStoredPulsePriorityMuteState(),
  );

  const activePulseRef = useRef<PulseItem | null>(null);
  const pulseQueueRef = useRef<PulseItem[]>([]);
  const recentPulseHistoryRef = useRef<PulseItem[]>([]);
  const visibleCooldownUntilRef = useRef(0);
  const dedupeMemoryRef = useRef<Record<string, number>>({});
  const throttleMemoryRef = useRef<Record<string, number>>({});
  const promotionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    activePulseRef.current = activePulse;
  }, [activePulse]);

  useEffect(() => {
    pulseQueueRef.current = pulseQueue;
  }, [pulseQueue]);

  useEffect(() => {
    recentPulseHistoryRef.current = recentPulseHistory;
  }, [recentPulseHistory]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(
        PULSE_MUTED_POPUP_PRIORITIES_STORAGE_KEY,
        JSON.stringify(mutedPopupPriorities),
      );
    } catch {
      // Ignore local storage write failures and keep the in-memory mute state.
    }
  }, [mutedPopupPriorities]);

  const promoteNextPulse = useCallback(() => {
    if (activePulseRef.current) {
      return;
    }

    const now = Date.now();
    const cleanedQueue = cleanPulseQueue(pulseQueueRef.current, now);
    if (cleanedQueue.length !== pulseQueueRef.current.length) {
      pulseQueueRef.current = cleanedQueue;
      setPulseQueue(cleanedQueue);
    }

    const nextPulse = cleanedQueue[0];
    if (!nextPulse) {
      return;
    }

    if (!shouldBypassVisibilityCooldown(nextPulse) && now < visibleCooldownUntilRef.current) {
      return;
    }

    const remainingQueue = cleanedQueue.slice(1);
    pulseQueueRef.current = remainingQueue;
    setPulseQueue(remainingQueue);
    activePulseRef.current = nextPulse;
    setActivePulse(nextPulse);

    if (!shouldBypassVisibilityCooldown(nextPulse)) {
      visibleCooldownUntilRef.current = now + PULSE_VISIBLE_COOLDOWN_MS;
    }
  }, []);

  useEffect(() => {
    if (promotionTimerRef.current != null) {
      window.clearTimeout(promotionTimerRef.current);
      promotionTimerRef.current = null;
    }

    if (activePulse || pulseQueue.length === 0) {
      return undefined;
    }

    const nextPulse = cleanPulseQueue(pulseQueue, Date.now())[0];
    if (!nextPulse) {
      return undefined;
    }

    const delayMs = shouldBypassVisibilityCooldown(nextPulse)
      ? 0
      : Math.max(0, visibleCooldownUntilRef.current - Date.now());

    promotionTimerRef.current = window.setTimeout(() => {
      promoteNextPulse();
    }, delayMs);

    return () => {
      if (promotionTimerRef.current != null) {
        window.clearTimeout(promotionTimerRef.current);
        promotionTimerRef.current = null;
      }
    };
  }, [activePulse, pulseQueue, promoteNextPulse]);

  useEffect(() => {
    if (!activePulse || activePulse.isExpanded) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setRecentPulseHistory(current =>
        updatePulseInCollection(current, getPulseRelatedIds(activePulse), {
          isDismissed: true,
          isRead: true,
        }),
      );
      activePulseRef.current = null;
      setActivePulse(null);
    }, activePulse.autoDismissMs);

    return () => window.clearTimeout(timer);
  }, [activePulse]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && activePulseRef.current && !activePulseRef.current.isExpanded) {
        const pulse = activePulseRef.current;
        setRecentPulseHistory(current =>
          updatePulseInCollection(current, getPulseRelatedIds(pulse), {
            isDismissed: true,
            isRead: true,
          }),
        );
        activePulseRef.current = null;
        setActivePulse(null);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const active = activePulseRef.current;
    const mutedQueueItems = pulseQueueRef.current.filter(item => mutedPopupPriorities[item.priority]);
    const relatedIds = [
      ...(active && mutedPopupPriorities[active.priority] ? getPulseRelatedIds(active) : []),
      ...mutedQueueItems.flatMap(getPulseRelatedIds),
    ];

    if (relatedIds.length > 0) {
      setRecentPulseHistory(current =>
        updatePulseInCollection(current, relatedIds, {
          isDismissed: true,
        }),
      );
    }

    if (active && mutedPopupPriorities[active.priority]) {
      activePulseRef.current = null;
      setActivePulse(null);
    }

    if (mutedQueueItems.length > 0) {
      const nextQueue = pulseQueueRef.current.filter(item => !mutedPopupPriorities[item.priority]);
      pulseQueueRef.current = nextQueue;
      setPulseQueue(nextQueue);
    }
  }, [mutedPopupPriorities]);

  const pushPulse = useCallback((input: PulseInput) => {
    const pulse = normalizePulseInput(input);
    const now = pulse.timestamp;
    const popupMuted = mutedPopupPriorities[pulse.priority];

    if (
      shouldSuppressByDedupe(pulse, dedupeMemoryRef.current, now) ||
      shouldSuppressByThrottle(pulse, throttleMemoryRef.current, now)
    ) {
      return null;
    }

    if (pulse.dedupeKey) {
      dedupeMemoryRef.current[pulse.dedupeKey] = now;
    }
    if (pulse.throttleKey) {
      throttleMemoryRef.current[pulse.throttleKey] = now;
    }

    if (pulse.isPersistentInHistory) {
      setRecentPulseHistory(current =>
        addPulseToRecentHistory(
          current,
          popupMuted
            ? {
                ...pulse,
                isDismissed: true,
              }
            : pulse,
        ),
      );
    }

    if (popupMuted) {
      return pulse.id;
    }

    const currentActive = activePulseRef.current;
    const currentQueue = pulseQueueRef.current;

    if (currentActive && !currentActive.isExpanded && canSummarizePulse(currentActive, pulse, now)) {
      const mergedActive = mergePulseIntoSummary(currentActive, pulse, now);
      activePulseRef.current = mergedActive;
      setActivePulse(mergedActive);
      return pulse.id;
    }

    const queueSummaryIndex = currentQueue.findIndex(queuedPulse => canSummarizePulse(queuedPulse, pulse, now));
    if (queueSummaryIndex >= 0) {
      const updatedQueue = currentQueue.slice();
      const summaryTarget = updatedQueue[queueSummaryIndex];
      if (!summaryTarget) {
        return pulse.id;
      }

      updatedQueue[queueSummaryIndex] = mergePulseIntoSummary(summaryTarget, pulse, now);
      const cleanedQueue = cleanPulseQueue(updatedQueue, now);
      pulseQueueRef.current = cleanedQueue;
      setPulseQueue(cleanedQueue);
      return pulse.id;
    }

    if (currentActive && shouldInterruptActivePulse(currentActive, pulse)) {
      const nextQueue = cleanPulseQueue([...currentQueue, currentActive], now);
      pulseQueueRef.current = nextQueue;
      setPulseQueue(nextQueue);
      activePulseRef.current = pulse;
      setActivePulse(pulse);
      return pulse.id;
    }

    const nextQueue = cleanPulseQueue([...currentQueue, pulse], now);
    pulseQueueRef.current = nextQueue;
    setPulseQueue(nextQueue);
    return pulse.id;
  }, [mutedPopupPriorities]);

  const backfillPulse = useCallback((input: PulseInput, options?: { markRead?: boolean }) => {
    const pulse = normalizePulseInput(input);
    const now = pulse.timestamp;

    if (
      shouldSuppressByDedupe(pulse, dedupeMemoryRef.current, now) ||
      shouldSuppressByThrottle(pulse, throttleMemoryRef.current, now)
    ) {
      return null;
    }

    if (pulse.dedupeKey) {
      dedupeMemoryRef.current[pulse.dedupeKey] = now;
    }
    if (pulse.throttleKey) {
      throttleMemoryRef.current[pulse.throttleKey] = now;
    }

    const backfilledPulse: PulseItem = {
      ...pulse,
      isDismissed: options?.markRead ?? true,
      isRead: options?.markRead ?? true,
    };

    if (backfilledPulse.isPersistentInHistory) {
      setRecentPulseHistory(current => addPulseToRecentHistory(current, backfilledPulse));
    }

    return backfilledPulse.id;
  }, []);

  const resetPulseState = useCallback(() => {
    activePulseRef.current = null;
    pulseQueueRef.current = [];
    recentPulseHistoryRef.current = [];
    visibleCooldownUntilRef.current = 0;
    dedupeMemoryRef.current = {};
    throttleMemoryRef.current = {};

    setActivePulse(null);
    setPulseQueue([]);
    setRecentPulseHistory([]);
  }, []);

  const dismissPulse = useCallback((id?: string) => {
    const targetId = id ?? activePulseRef.current?.id;
    if (!targetId) {
      return;
    }

    const active = activePulseRef.current;
    if (active && active.id === targetId) {
      setRecentPulseHistory(current =>
        updatePulseInCollection(current, getPulseRelatedIds(active), {
          isDismissed: true,
          isRead: true,
        }),
      );
      activePulseRef.current = null;
      setActivePulse(null);
      return;
    }

    const nextQueue = pulseQueueRef.current.filter(item => item.id !== targetId);
    pulseQueueRef.current = nextQueue;
    setPulseQueue(nextQueue);
    setRecentPulseHistory(current =>
      updatePulseInCollection(current, [targetId], {
        isDismissed: true,
        isRead: true,
      }),
    );
  }, []);

  const markPulseRead = useCallback((id: string) => {
    const active = activePulseRef.current;
    if (active && active.id === id) {
      const nextActive = { ...active, isRead: true };
      activePulseRef.current = nextActive;
      setActivePulse(nextActive);
      setRecentPulseHistory(current => updatePulseInCollection(current, getPulseRelatedIds(active), { isRead: true }));
      return;
    }

    setRecentPulseHistory(current => updatePulseInCollection(current, [id], { isRead: true }));
  }, []);

  const clearReadPulses = useCallback(() => {
    setRecentPulseHistory(current => current.filter(pulse => !pulse.isRead));
  }, []);

  const expandPulse = useCallback((id: string) => {
    const active = activePulseRef.current;
    if (!active || active.id !== id) {
      return;
    }

    const nextActive = { ...active, isExpanded: true, isRead: true };
    activePulseRef.current = nextActive;
    setActivePulse(nextActive);
    setRecentPulseHistory(current => updatePulseInCollection(current, getPulseRelatedIds(active), { isRead: true }));
  }, []);

  const collapsePulse = useCallback((id: string) => {
    const active = activePulseRef.current;
    if (!active || active.id !== id) {
      return;
    }

    const nextActive = { ...active, isExpanded: false };
    activePulseRef.current = nextActive;
    setActivePulse(nextActive);
  }, []);

  const clearPulseQueue = useCallback(() => {
    pulseQueueRef.current = [];
    setPulseQueue([]);
  }, []);

  const getRecentPulses = useCallback(() => recentPulseHistoryRef.current, []);

  const suppressPulse = useCallback((dedupeKey: string) => {
    dedupeMemoryRef.current[dedupeKey] = Date.now();
  }, []);

  const summarizeQueuedPulses = useCallback(() => {
    const grouped = new Map<string, PulseItem[]>();
    const passthrough: PulseItem[] = [];

    pulseQueueRef.current.forEach(item => {
      if (!item.summaryEligible || !item.summaryGroupKey) {
        passthrough.push(item);
        return;
      }

      const group = grouped.get(item.summaryGroupKey) ?? [];
      group.push(item);
      grouped.set(item.summaryGroupKey, group);
    });

    const nextQueue = cleanPulseQueue(
      [
        ...passthrough,
        ...Array.from(grouped.values())
          .map(group => {
            const first = group[0];
            if (!first) {
              return null;
            }

            return group.length > 1 ? summarizePulseGroup(group) : first;
          })
          .filter((item): item is PulseItem => item != null),
      ],
      Date.now(),
    );

    pulseQueueRef.current = nextQueue;
    setPulseQueue(nextQueue);
  }, []);

  const setPriorityPopupMuted = useCallback((priority: PulsePriority, muted: boolean) => {
    setMutedPopupPriorities(current => {
      if (current[priority] === muted) {
        return current;
      }

      return {
        ...current,
        [priority]: muted,
      };
    });
  }, []);

  const togglePriorityPopupMuted = useCallback((priority: PulsePriority) => {
    setMutedPopupPriorities(current => ({
      ...current,
      [priority]: !current[priority],
    }));
  }, []);

  return useMemo(
    () => ({
      activePulse,
      pulseQueue,
      recentPulseHistory,
      mutedPopupPriorities,
      pushPulse,
      backfillPulse,
      resetPulseState,
      dismissPulse,
      markPulseRead,
      clearReadPulses,
      expandPulse,
      collapsePulse,
      clearPulseQueue,
      getRecentPulses,
      suppressPulse,
      summarizeQueuedPulses,
      setPriorityPopupMuted,
      togglePriorityPopupMuted,
    }),
    [
      activePulse,
      pulseQueue,
      recentPulseHistory,
      mutedPopupPriorities,
      pushPulse,
      backfillPulse,
      resetPulseState,
      dismissPulse,
      markPulseRead,
      clearReadPulses,
      expandPulse,
      collapsePulse,
      clearPulseQueue,
      getRecentPulses,
      suppressPulse,
      summarizeQueuedPulses,
      setPriorityPopupMuted,
      togglePriorityPopupMuted,
    ],
  );
}
