import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';

const SIMULATION_START_DATE = new Date(2026, 2, 24, 7, 48, 0, 0);
const BASE_SIMULATED_MINUTES_PER_REAL_SECOND = 5;

function formatTimescaleLabel(multiplier: number) {
  return Number.isInteger(multiplier) ? `${multiplier}x` : `${multiplier.toFixed(1)}x`;
}

export type ArcSimulationClockState = {
  simulatedDate: Date;
  displayTime: string;
  weekdayLabel: string;
  dateLabel: string;
  mockDateTime: {
    date: string;
    time: string;
    timezone: string;
  };
  elapsedRealSeconds: number;
  elapsedSimulatedMinutes: number;
  timescaleMultiplier: number;
  timescaleLabel: string;
  simulatedMinutesPerRealSecond: number;
};

const ArcSimulationClockContext = createContext<ArcSimulationClockState | null>(null);

function formatSimulationTime(date: Date) {
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const meridiem = hours24 >= 12 ? 'PM' : 'AM';

  return `${hours12}:${minutes} ${meridiem}`;
}

function formatSimulationTime24(date: Date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function formatSimulationDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function useArcSimulationClockSource(
  isRunning: boolean,
  simulatedMinuteOffset = 0,
  timescaleMultiplier = 1,
  resetKey = 0,
): ArcSimulationClockState {
  const [realClockMs, setRealClockMs] = useState(() => Date.now());
  const normalizedTimescaleMultiplier =
    Number.isFinite(timescaleMultiplier) && timescaleMultiplier > 0 ? timescaleMultiplier : 1;
  const simulatedMinutesPerRealSecond = BASE_SIMULATED_MINUTES_PER_REAL_SECOND * normalizedTimescaleMultiplier;
  const [runtimeState, setRuntimeState] = useState(() => {
    const now = Date.now();

    return {
      accumulatedRealMs: 0,
      accumulatedSimulatedMinutes: 0,
      anchorMs: isRunning ? now : null,
      simulatedMinutesPerRealSecond,
    };
  });

  useEffect(() => {
    const intervalMs = Math.max(50, Math.min(500, Math.round(1000 / simulatedMinutesPerRealSecond)));
    const timer = window.setInterval(() => {
      setRealClockMs(Date.now());
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [simulatedMinutesPerRealSecond]);

  useEffect(() => {
    const now = Date.now();
    setRuntimeState({
      accumulatedRealMs: 0,
      accumulatedSimulatedMinutes: 0,
      anchorMs: isRunning ? now : null,
      simulatedMinutesPerRealSecond,
    });
    setRealClockMs(now);
  }, [isRunning, resetKey, simulatedMinutesPerRealSecond]);

  useEffect(() => {
    const now = Date.now();
    setRuntimeState(current => {
      const elapsedSinceAnchorMs =
        current.anchorMs == null
          ? 0
          : Math.max(0, now - current.anchorMs);

      return {
        accumulatedRealMs: current.accumulatedRealMs + elapsedSinceAnchorMs,
        accumulatedSimulatedMinutes:
          current.accumulatedSimulatedMinutes + elapsedSinceAnchorMs / 1000 * current.simulatedMinutesPerRealSecond,
        anchorMs: isRunning ? now : null,
        simulatedMinutesPerRealSecond,
      };
    });
    setRealClockMs(now);
  }, [isRunning, simulatedMinutesPerRealSecond]);

  return useMemo(() => {
    const elapsedCurrentRealMs =
      runtimeState.anchorMs == null
        ? 0
        : Math.max(0, realClockMs - runtimeState.anchorMs);
    const elapsedRealMs = runtimeState.accumulatedRealMs + elapsedCurrentRealMs;
    const elapsedCurrentSimulatedMinutes =
      elapsedCurrentRealMs / 1000 * runtimeState.simulatedMinutesPerRealSecond;
    const elapsedRealSeconds = elapsedRealMs / 1000;
    const elapsedSimulatedMinutes =
      simulatedMinuteOffset + runtimeState.accumulatedSimulatedMinutes + elapsedCurrentSimulatedMinutes;
    const simulatedDate = new Date(SIMULATION_START_DATE.getTime() + elapsedSimulatedMinutes * 60_000);

    return {
      simulatedDate,
      displayTime: formatSimulationTime(simulatedDate),
      weekdayLabel: simulatedDate.toLocaleDateString([], { weekday: 'long' }),
      dateLabel: simulatedDate.toLocaleDateString([], { month: 'long', day: 'numeric' }),
      mockDateTime: {
        date: formatSimulationDate(simulatedDate),
        time: formatSimulationTime24(simulatedDate),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'local',
      },
      elapsedRealSeconds,
      elapsedSimulatedMinutes,
      timescaleMultiplier: normalizedTimescaleMultiplier,
      timescaleLabel: formatTimescaleLabel(normalizedTimescaleMultiplier),
      simulatedMinutesPerRealSecond: runtimeState.simulatedMinutesPerRealSecond,
    };
  }, [normalizedTimescaleMultiplier, realClockMs, runtimeState, simulatedMinuteOffset]);
}

export function ArcSimulationClockProvider({
  value,
  children,
}: {
  value: ArcSimulationClockState;
  children: ReactNode;
}) {
  return (
    <ArcSimulationClockContext.Provider value={value}>
      {children}
    </ArcSimulationClockContext.Provider>
  );
}

export function useArcSimulationClock() {
  const context = useContext(ArcSimulationClockContext);

  if (!context) {
    throw new Error('useArcSimulationClock must be used within ArcSimulationClockProvider');
  }

  return context;
}
