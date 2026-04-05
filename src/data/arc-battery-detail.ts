export type ArcBatteryStatus = 'Normal' | 'Low' | 'Critical' | 'Unavailable';

export type ArcChargeProtocolStatus = 'On track' | 'At risk' | 'Missed' | 'Complete for today';

export type ArcBatteryDetailSnapshot = {
  batteryPercent: number | null;
  deviceConnected: boolean;
  isCharging: boolean;
  isFullyCharged: boolean;
  timeRemainingText: string;
  timeToFullText: string;
  batteryStatus: ArcBatteryStatus;
  lastChargedText: string;
  recommendationText: string;
  protocolEnabled: boolean;
  protocolNextWindowText: string;
  protocolStatusText: ArcChargeProtocolStatus | '';
};

export type ArcBatterySimulationInput = {
  batteryPercent: number | null;
  deviceConnected: boolean;
  isCharging: boolean;
  nowTimestamp: number;
  lastChargedTimestamp?: number | null;
  protocolEnabled?: boolean;
  protocolNextWindowText?: string;
  protocolStatusText?: ArcChargeProtocolStatus;
};

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getBatteryStatus(percent: number | null, deviceConnected: boolean): ArcBatteryStatus {
  if (!deviceConnected || percent == null) {
    return 'Unavailable';
  }

  if (percent <= 10) {
    return 'Critical';
  }

  if (percent <= 25) {
    return 'Low';
  }

  return 'Normal';
}

function getEstimatedRemainingMinutes(percent: number) {
  if (percent >= 85) return 28 * 60;
  if (percent >= 65) return 24 * 60;
  if (percent >= 50) return 18 * 60;
  if (percent >= 35) return 12 * 60;
  if (percent >= 20) return 8 * 60;
  if (percent >= 12) return 4 * 60;
  if (percent >= 6) return 60;
  return 35;
}

function formatRemainingTime(minutes: number) {
  if (minutes < 50) {
    return 'Less than 1 hour remaining';
  }

  if (minutes < 90) {
    return 'About 1 hour remaining';
  }

  if (minutes >= 20 * 60) {
    const days = Math.max(1, Math.round(minutes / (24 * 60)));
    return `About ${days} day${days === 1 ? '' : 's'} remaining`;
  }

  const roundedHours = Math.max(1, Math.round(minutes / 60));
  return `About ${roundedHours} hour${roundedHours === 1 ? '' : 's'} remaining`;
}

function formatTimeToFull(minutes: number) {
  if (minutes < 60) {
    return `Full in ${Math.max(1, minutes)}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `Full in ${hours}h ${remainingMinutes}m`;
}

function formatLastChargedText(timestamp: number | null, nowTimestamp: number) {
  if (timestamp == null || !Number.isFinite(timestamp)) {
    return '--';
  }

  const timestampDate = new Date(timestamp);
  const nowDate = new Date(nowTimestamp);
  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const sameDay = timestampDate.toDateString() === nowDate.toDateString();
  const yesterday = new Date(nowDate);
  yesterday.setDate(nowDate.getDate() - 1);
  const isYesterday = timestampDate.toDateString() === yesterday.toDateString();

  if (sameDay) {
    return `Today, ${timeFormatter.format(timestampDate)}`;
  }

  if (isYesterday) {
    return `Yesterday, ${timeFormatter.format(timestampDate)}`;
  }

  return dateFormatter.format(timestampDate);
}

function getRecommendationText({
  status,
  isCharging,
  isFullyCharged,
  deviceConnected,
  batteryPercent,
  hourOfDay,
}: {
  status: ArcBatteryStatus;
  isCharging: boolean;
  isFullyCharged: boolean;
  deviceConnected: boolean;
  batteryPercent: number | null;
  hourOfDay: number;
}) {
  if (!deviceConnected) {
    return 'Reconnect your device to view current battery status';
  }

  if (isFullyCharged) {
    return 'Your device is ready for use';
  }

  if (isCharging) {
    return 'Charging now will keep your device ready for tomorrow';
  }

  if (status === 'Critical') {
    return 'Charge now to avoid interrupted use';
  }

  if (status === 'Low') {
    return hourOfDay >= 19 ? 'Charge before bed for uninterrupted overnight use' : 'A charge is recommended soon';
  }

  if ((batteryPercent ?? 0) >= 60) {
    return 'Battery should last through today';
  }

  return hourOfDay >= 19 ? 'Charge before bed for uninterrupted overnight use' : 'Battery should last through today';
}

function getProtocolStatus({
  providedStatus,
  isCharging,
  isFullyCharged,
  status,
}: {
  providedStatus?: ArcChargeProtocolStatus;
  isCharging: boolean;
  isFullyCharged: boolean;
  status: ArcBatteryStatus;
}) {
  if (providedStatus) {
    return providedStatus;
  }

  if (isFullyCharged) {
    return 'Complete for today';
  }

  if (isCharging) {
    return 'On track';
  }

  if (status === 'Critical') {
    return 'Missed';
  }

  if (status === 'Low') {
    return 'At risk';
  }

  return 'On track';
}

export function getArcBatteryPrimaryValueText(battery: ArcBatteryDetailSnapshot) {
  if (!battery.deviceConnected || battery.batteryPercent == null) {
    return 'Battery unavailable';
  }

  return `${battery.batteryPercent}%`;
}

export function getArcBatteryStateLineText(battery: ArcBatteryDetailSnapshot) {
  if (!battery.deviceConnected) {
    return 'Device not connected';
  }

  if (battery.isFullyCharged) {
    return 'Fully charged';
  }

  if (battery.isCharging) {
    return 'Charging now';
  }

  return 'Not charging';
}

export function getArcBatteryEstimateLineText(battery: ArcBatteryDetailSnapshot) {
  if (!battery.deviceConnected) {
    return '';
  }

  if (battery.isFullyCharged) {
    return 'Ready for use';
  }

  return battery.isCharging ? battery.timeToFullText : battery.timeRemainingText;
}

export function buildArcBatteryStateFromSimulation({
  batteryPercent,
  deviceConnected,
  isCharging,
  nowTimestamp,
  lastChargedTimestamp,
  protocolEnabled = false,
  protocolNextWindowText = '8 PM to 10 PM',
  protocolStatusText,
}: ArcBatterySimulationInput): ArcBatteryDetailSnapshot {
  const percent =
    batteryPercent == null ? null : clampNumber(Math.round(batteryPercent), 0, 100);
  const isFullyCharged = deviceConnected && percent != null && percent >= 99;
  const resolvedStatus = getBatteryStatus(percent, deviceConnected);
  const effectiveCharging = deviceConnected && !isFullyCharged && isCharging;
  const timeRemainingText =
    !deviceConnected || percent == null ? '' : formatRemainingTime(getEstimatedRemainingMinutes(percent));
  const timeToFullText =
    !deviceConnected || isFullyCharged || !effectiveCharging || percent == null
      ? ''
      : formatTimeToFull(Math.max(12, Math.round((100 - percent) * 1.25)));
  const resolvedLastChargedTimestamp =
    lastChargedTimestamp ??
    (percent == null
      ? null
      : effectiveCharging || isFullyCharged
        ? nowTimestamp - Math.max(18, Math.round((100 - percent) * 1.4)) * 60_000
        : nowTimestamp - Math.max(35, Math.round((100 - percent) * 18)) * 60_000);
  const nowDate = new Date(nowTimestamp);

  return {
    batteryPercent: percent,
    deviceConnected,
    isCharging: effectiveCharging,
    isFullyCharged,
    timeRemainingText: isFullyCharged ? 'Ready for use' : timeRemainingText,
    timeToFullText,
    batteryStatus: resolvedStatus,
    lastChargedText: formatLastChargedText(resolvedLastChargedTimestamp, nowTimestamp),
    recommendationText: getRecommendationText({
      status: resolvedStatus,
      isCharging: effectiveCharging,
      isFullyCharged,
      deviceConnected,
      batteryPercent: percent,
      hourOfDay: nowDate.getHours(),
    }),
    protocolEnabled,
    protocolNextWindowText: protocolEnabled ? protocolNextWindowText : '',
    protocolStatusText: protocolEnabled
      ? getProtocolStatus({
          providedStatus: protocolStatusText,
          isCharging: effectiveCharging,
          isFullyCharged,
          status: resolvedStatus,
        })
      : '',
  };
}

export const buildArcBatteryDetailSnapshot = buildArcBatteryStateFromSimulation;
