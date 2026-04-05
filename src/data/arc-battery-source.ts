import {
  buildArcBatteryStateFromSimulation,
  type ArcBatteryDetailSnapshot,
  type ArcBatterySimulationInput,
} from './arc-battery-detail';
import { arcBatteryMockPresets, type ArcBatteryMockPresetKey } from './arc-battery-presets';

export const ARC_BATTERY_DEV_PRESET_KEY: ArcBatteryMockPresetKey | null = null;

type ResolveArcBatteryStateOptions = {
  simulationState: ArcBatterySimulationInput;
  liveState?: ArcBatteryDetailSnapshot | null;
  mockPresetKey?: ArcBatteryMockPresetKey | null;
};

export function adaptArcBatteryLiveState(liveState: ArcBatteryDetailSnapshot): ArcBatteryDetailSnapshot {
  return { ...liveState };
}

export function resolveArcBatteryState({
  simulationState,
  liveState,
  mockPresetKey,
}: ResolveArcBatteryStateOptions): ArcBatteryDetailSnapshot {
  const resolvedMockKey = mockPresetKey ?? ARC_BATTERY_DEV_PRESET_KEY;

  if (resolvedMockKey) {
    return { ...arcBatteryMockPresets[resolvedMockKey] };
  }

  if (liveState) {
    return adaptArcBatteryLiveState(liveState);
  }

  return buildArcBatteryStateFromSimulation(simulationState);
}
