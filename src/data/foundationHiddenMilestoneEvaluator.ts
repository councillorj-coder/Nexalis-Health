import type { ArcAppDataSnapshot } from './arc-app-data';
import type { Session } from './arc-types';
import { FOUNDATION_HIDDEN_MILESTONE_CLUSTERS, FOUNDATION_HIDDEN_MILESTONES } from './foundationHiddenMilestones';
import type {
  FoundationHiddenInsightLink,
  FoundationHiddenMilestoneEvaluation,
  FoundationHiddenMilestoneMetrics,
} from './foundationHiddenMilestoneTypes';

type FoundationDaypart = 'morning' | 'afternoon' | 'evening' | 'overnightAdjacent';

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundToSingleDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function parseDurationLabelToMs(durationLabel?: string) {
  if (!durationLabel) {
    return null;
  }

  const normalized = durationLabel.trim().toLowerCase();
  if (!normalized || normalized === 'n/a' || normalized === 'no data yet' || normalized === '--') {
    return null;
  }

  const hourMatch = normalized.match(/(\d+(?:\.\d+)?)\s*h/);
  const minuteMatch = normalized.match(/(\d+(?:\.\d+)?)\s*m/);
  const secondMatch = normalized.match(/(\d+(?:\.\d+)?)\s*s/);

  const hours = hourMatch ? Number(hourMatch[1]) : 0;
  const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;
  const seconds = secondMatch ? Number(secondMatch[1]) : 0;
  const totalMs = ((hours * 60 * 60) + (minutes * 60) + seconds) * 1000;

  return Number.isFinite(totalMs) && totalMs > 0 ? totalMs : null;
}

function resolveSessionDurationMs(session: Session) {
  if (typeof session.durationMs === 'number' && Number.isFinite(session.durationMs)) {
    return session.durationMs;
  }

  return parseDurationLabelToMs(session.metrics.duration);
}

function resolveBuildDurationMs(session: Session) {
  if (typeof session.buildDurationMs === 'number' && Number.isFinite(session.buildDurationMs)) {
    return session.buildDurationMs;
  }

  return parseDurationLabelToMs(session.metrics.buildSpeed);
}

function resolveRecoveryDurationMs(session: Session) {
  if (typeof session.recoveryDurationMs === 'number' && Number.isFinite(session.recoveryDurationMs)) {
    return session.recoveryDurationMs;
  }

  return parseDurationLabelToMs(session.metrics.recovery);
}

function sumSessionHours(sessions: Session[]) {
  const totalMs = sessions.reduce((sum, session) => sum + (resolveSessionDurationMs(session) ?? 0), 0);
  return totalMs / (60 * 60 * 1000);
}

function getSessionDateValue(session: Session) {
  if (typeof session.capturedAt === 'number' && Number.isFinite(session.capturedAt)) {
    return new Date(session.capturedAt);
  }

  const combined = session.time ? `${session.date} ${session.time}` : session.date;
  const parsed = new Date(combined);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  const fallback = new Date(session.date);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

function getSessionDayKey(session: Session) {
  const dateValue = getSessionDateValue(session);
  if (dateValue) {
    return `${dateValue.getFullYear()}-${dateValue.getMonth()}-${dateValue.getDate()}`;
  }

  return `${session.date}-${session.time}`;
}

function getDaypartFromHour(hour: number): FoundationDaypart {
  if (hour >= 5 && hour < 12) {
    return 'morning';
  }
  if (hour >= 12 && hour < 17) {
    return 'afternoon';
  }
  if (hour >= 17 && hour < 22) {
    return 'evening';
  }
  return 'overnightAdjacent';
}

function getSessionDaypart(session: Session): FoundationDaypart | null {
  const dateValue = getSessionDateValue(session);
  if (dateValue) {
    return getDaypartFromHour(dateValue.getHours());
  }

  const timeMatch = session.time?.match(/(\d{1,2})/);
  if (!timeMatch) {
    return null;
  }

  const hour = Number(timeMatch[1] ?? 0);
  return Number.isFinite(hour) ? getDaypartFromHour(hour) : null;
}

function getSessionTimestamp(session: Session) {
  const dateValue = getSessionDateValue(session);
  return dateValue ? dateValue.getTime() : null;
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  const mean = average(values);
  const variance = average(values.map(value => (value - mean) ** 2));
  return Math.sqrt(variance);
}

function scoreHoldQuality(label?: string) {
  switch ((label ?? '').toLowerCase()) {
    case 'locked in':
      return 96;
    case 'steady':
      return 88;
    case 'controlled':
      return 80;
    case 'developing':
      return 68;
    case 'brief':
      return 50;
    default:
      return 62;
  }
}

function scorePeakQuality(label?: string) {
  switch ((label ?? '').toLowerCase()) {
    case 'exceptional':
      return 98;
    case 'outstanding':
      return 92;
    case 'strong':
      return 86;
    case 'elevated':
      return 76;
    case 'qualified':
      return 66;
    case 'high support':
      return 90;
    case 'steady support':
      return 82;
    case 'moderate support':
      return 70;
    default:
      return 60;
  }
}

function estimateHoldMinutes(session: Session) {
  const durationMinutes = (resolveSessionDurationMs(session) ?? 0) / (60 * 1000);
  if (durationMinutes <= 0) {
    return 0;
  }

  const quality = scoreHoldQuality(session.metrics.holdQuality);
  const multiplier =
    quality >= 92
      ? 0.78
      : quality >= 84
        ? 0.64
        : quality >= 76
          ? 0.54
          : quality >= 64
            ? 0.42
            : 0.26;

  return roundToSingleDecimal(durationMinutes * multiplier);
}

function getMovementRangeType(session: Session): 'strong' | 'minimal' | 'moderate' {
  if (session.type === 'static') {
    return 'minimal';
  }

  const intensity = session.motion?.motionIntensity;
  const driveCount = session.motion?.driveCount ?? 0;
  const cadencePeakMatch = session.motion?.cadencePeak?.match(/(\d+(?:\.\d+)?)/);
  const cadencePeak = cadencePeakMatch ? Number(cadencePeakMatch[1]) : 0;

  if (intensity === 'High' || driveCount >= 16 || cadencePeak >= 60) {
    return 'strong';
  }

  if (intensity === 'Low' || driveCount <= 8) {
    return 'minimal';
  }

  return 'moderate';
}

function buildDaypartSetFromSessions(sessions: Session[]) {
  const dayparts = new Set<FoundationDaypart>();
  sessions.forEach(session => {
    const daypart = getSessionDaypart(session);
    if (daypart) {
      dayparts.add(daypart);
    }
  });
  return dayparts;
}

function addDaypartIfEligible(set: Set<FoundationDaypart>, daypart: FoundationDaypart, eligible: boolean) {
  if (eligible) {
    set.add(daypart);
  }
}

function getMaxSessionsWithin24Hours(sessions: Session[]) {
  const timestamps = sessions
    .map(getSessionTimestamp)
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value))
    .sort((left, right) => left - right);

  if (timestamps.length === 0) {
    return 0;
  }

  let maxCount = 1;
  let startIndex = 0;
  const windowMs = 24 * 60 * 60 * 1000;

  for (let endIndex = 0; endIndex < timestamps.length; endIndex += 1) {
    const endTimestamp = timestamps[endIndex];

    if (endTimestamp === undefined) {
      continue;
    }

    while (startIndex < endIndex && endTimestamp - (timestamps[startIndex] ?? endTimestamp) > windowMs) {
      startIndex += 1;
    }

    maxCount = Math.max(maxCount, endIndex - startIndex + 1);
  }

  return maxCount;
}

export function buildFoundationHiddenMilestoneMetrics(data: ArcAppDataSnapshot): FoundationHiddenMilestoneMetrics {
  const qualifyingSessions = data.sessions.filter(session => session.type !== 'nocturnal');
  const staticSessions = qualifyingSessions.filter(session => session.type === 'static');
  const motionSessions = qualifyingSessions.filter(session => session.type === 'motion');
  const nocturnalSessions = data.sessions.filter(session => session.type === 'nocturnal');
  const baselineTrack = data.calibrationTracks.find(track => track.key === 'baseline');
  const peakTrack = data.calibrationTracks.find(track => track.key === 'peak');
  const sessionHours = sumSessionHours(qualifyingSessions);
  const foundationClockWearMinutes = Math.round(
    clampNumber(data.foundationClockElapsedMinutes ?? 0, 0, 36 * 60),
  );
  const foundationClockBaselineMinutes = Math.round(foundationClockWearMinutes * (1.75 / 4.1));
  const foundationClockDistinctDays = clampNumber(
    Math.floor((data.foundationClockElapsedMinutes ?? 0) / (24 * 60)),
    0,
    7,
  );
  // `wearStreakDays` is a UI-facing streak that starts at 1 on day zero, so
  // hidden Foundation progress subtracts that bootstrap day to avoid awarding
  // milestones immediately after a data reset.
  const distinctWearDays = Math.max(
    baselineTrack?.current ?? 0,
    Math.max(0, Math.min(data.wearStreakDays, 7) - 1),
    foundationClockDistinctDays,
  );
  const totalBaselineHours = roundToSingleDecimal(
    clampNumber(
      Math.max(distinctWearDays * 1.75, foundationClockBaselineMinutes / 60),
      0,
      13.4,
    ),
  );
  const totalWearHours = roundToSingleDecimal(
    clampNumber(
      Math.max(
        totalBaselineHours,
        foundationClockWearMinutes / 60,
        distinctWearDays * 4.1 + qualifyingSessions.length * 0.65 + sessionHours * 0.55,
      ),
      0,
      36,
    ),
  );
  const totalWearMinutes = Math.round(totalWearHours * 60);
  const baselineMinutes = Math.round(totalBaselineHours * 60);
  const longestSessionMinutes = qualifyingSessions.reduce(
    (max, session) => Math.max(max, (resolveSessionDurationMs(session) ?? 0) / (60 * 1000)),
    0,
  );
  const hasWearEvidence =
    distinctWearDays > 0 ||
    qualifyingSessions.length > 0 ||
    totalWearHours > 0;
  const continuousWearMinutes = Math.round(
    clampNumber(
      hasWearEvidence
        ? Math.max(
            foundationClockWearMinutes,
            longestSessionMinutes > 0 ? longestSessionMinutes + 18 : 0,
            totalWearHours * 13 + distinctWearDays * 14,
          )
        : 0,
      0,
      260,
    ),
  );

  const qualifyingSessionDayparts = buildDaypartSetFromSessions(qualifyingSessions);
  const wearDayparts = new Set<FoundationDaypart>(qualifyingSessionDayparts);
  addDaypartIfEligible(wearDayparts, 'morning', totalWearMinutes >= 45);
  addDaypartIfEligible(wearDayparts, 'afternoon', totalWearMinutes >= 180);
  addDaypartIfEligible(wearDayparts, 'evening', totalWearMinutes >= 300);
  addDaypartIfEligible(
    wearDayparts,
    'overnightAdjacent',
    nocturnalSessions.length > 0 || totalWearMinutes >= 480 || data.wearStreakDays >= 2,
  );

  const baselineDayparts = new Set<FoundationDaypart>();
  addDaypartIfEligible(
    baselineDayparts,
    'morning',
    wearDayparts.has('morning') && baselineMinutes >= 15,
  );
  addDaypartIfEligible(
    baselineDayparts,
    'afternoon',
    (wearDayparts.has('afternoon') || wearDayparts.size >= 2) && baselineMinutes >= 90,
  );
  addDaypartIfEligible(
    baselineDayparts,
    'evening',
    (wearDayparts.has('evening') || wearDayparts.size >= 3) && baselineMinutes >= 180,
  );

  const sessionDayKeys = new Set(qualifyingSessions.map(getSessionDayKey));
  const baselineDistinctDays = clampNumber(
    Math.max(
      sessionDayKeys.size,
      baselineMinutes >= 120 ? 1 : 0,
      baselineMinutes >= 240 ? 2 : 0,
      baselineMinutes >= 480 ? 3 : 0,
    ),
    0,
    7,
  );

  const baselineNoise = standardDeviation(data.liveTelemetry?.history.slice(-28) ?? []);
  const stableBaselineBlockBase = clampNumber(
    Math.floor(baselineMinutes / 110),
    0,
    6,
  );
  const inferredLowNoiseBaseline =
    baselineMinutes >= 360 &&
    baselineDistinctDays >= 2 &&
    stableBaselineBlockBase >= 3;
  const lowNoiseBaselineThresholdCount =
    baselineMinutes >= 90 && ((baselineNoise > 0 && baselineNoise <= 1.95) || inferredLowNoiseBaseline) ? 1 : 0;
  const stableBaselineBlockCount = clampNumber(
    stableBaselineBlockBase + lowNoiseBaselineThresholdCount,
    0,
    6,
  );
  const baselineRepeatabilityTier =
    baselineMinutes >= 480 && baselineDistinctDays >= 3 && stableBaselineBlockCount >= 5 && lowNoiseBaselineThresholdCount > 0
      ? 2
      : baselineMinutes >= 240 && baselineDistinctDays >= 2 && stableBaselineBlockCount >= 2
        ? 1
        : 0;

  const qualifiedSessionCount = qualifyingSessions.length;
  const qualifiedEventCount = Math.max(peakTrack?.current ?? 0, qualifiedSessionCount > 0 ? 1 : 0);
  const sessionTotalDurationMinutes = roundToSingleDecimal(
    qualifyingSessions.reduce((sum, session) => sum + ((resolveSessionDurationMs(session) ?? 0) / (60 * 1000)), 0),
  );
  const sessionsWithin24hSpanCount = getMaxSessionsWithin24Hours(qualifyingSessions);
  const sessionWithinFoundationWindowCount = qualifiedSessionCount;
  const holdMinutes = qualifyingSessions.reduce((max, session) => Math.max(max, estimateHoldMinutes(session)), 0);

  const riseDetectedCount = qualifyingSessions.filter(
    session => (resolveBuildDurationMs(session) ?? 0) > 0 || (session.peakLevel ?? 0) > 0,
  ).length;
  const peakDetectedCount = qualifyingSessions.filter(session => (session.peakLevel ?? 0) >= 70).length;
  const holdDetectedCount = qualifyingSessions.filter(session => estimateHoldMinutes(session) >= 1).length;
  const declineDetectedCount = qualifyingSessions.filter(session => (resolveRecoveryDurationMs(session) ?? 0) > 0).length;
  const fullCycleCapturedCount = qualifyingSessions.filter(
    session =>
      (resolveBuildDurationMs(session) ?? 0) > 0 &&
      estimateHoldMinutes(session) >= 1 &&
      (resolveRecoveryDurationMs(session) ?? 0) > 0,
  ).length;
  const highConfidenceSessionCount = qualifyingSessions.filter(session => {
    const holdQualityScore = scoreHoldQuality(session.metrics.holdQuality);
    const peakQualityScore = scorePeakQuality(session.metrics.peakQuality);
    const sessionQualityScore = session.analysis?.sessionQualityScore ?? 0;
    return holdQualityScore >= 84 || peakQualityScore >= 84 || (session.peakLevel ?? 0) >= 92 || sessionQualityScore >= 82 || session.metrics.stability >= 84;
  }).length;

  const stableHoldQualityStrongSessions = qualifyingSessions.filter(session => {
    const holdQualityScore = scoreHoldQuality(session.metrics.holdQuality);
    return holdQualityScore >= 82 || session.metrics.stability >= 84;
  }).length;
  const stableHoldQualityEliteSessions = qualifyingSessions.filter(session => {
    const holdQualityScore = scoreHoldQuality(session.metrics.holdQuality);
    return holdQualityScore >= 90 || session.metrics.stability >= 90;
  }).length;
  const stableHoldQualityTier =
    stableHoldQualityEliteSessions >= 2 || stableHoldQualityStrongSessions >= 3
      ? 2
      : stableHoldQualityStrongSessions >= 1
        ? 1
        : 0;

  const peakConfidenceStrongSessions = qualifyingSessions.filter(session => {
    const peakQualityScore = scorePeakQuality(session.metrics.peakQuality);
    return peakQualityScore >= 80 || (session.peakLevel ?? 0) >= 88;
  }).length;
  const peakConfidenceTier =
    peakConfidenceStrongSessions >= 2 || qualifyingSessions.some(session => (session.peakLevel ?? 0) >= 96)
      ? 2
      : peakConfidenceStrongSessions >= 1
        ? 1
        : 0;

  const staticSessionDayKeys = new Set(staticSessions.map(getSessionDayKey));
  const motionSessionDayKeys = new Set(motionSessions.map(getSessionDayKey));
  const sessionDistinctDaypartsCount = buildDaypartSetFromSessions(qualifyingSessions).size;
  const strongerMovementRangeCount = motionSessions.filter(session => getMovementRangeType(session) === 'strong').length;
  const minimalMovementRangeCount = qualifyingSessions.filter(session => getMovementRangeType(session) === 'minimal').length;
  const sessionTypeDiversityTier =
    staticSessions.length >= 2 && motionSessions.length >= 2
      ? 2
      : staticSessions.length >= 1 && motionSessions.length >= 1
        ? 1
        : 0;

  return {
    totalWearMinutes,
    continuousWearMinutes,
    morningWearBlockCount: wearDayparts.has('morning') ? 1 : 0,
    eveningWearBlockCount: wearDayparts.has('evening') ? 1 : 0,
    overnightAdjacentWearBlockCount: wearDayparts.has('overnightAdjacent') ? 1 : 0,
    wearDistinctDaypartsCount: wearDayparts.size,
    baselineMinutes,
    morningBaselineCount: baselineDayparts.has('morning') ? 1 : 0,
    afternoonBaselineCount: baselineDayparts.has('afternoon') ? 1 : 0,
    eveningBaselineCount: baselineDayparts.has('evening') ? 1 : 0,
    baselineDistinctDaypartsCount: baselineDayparts.size,
    baselineDistinctDays,
    stableBaselineBlockCount,
    lowNoiseBaselineThresholdCount,
    baselineRepeatabilityTier,
    qualifiedEventCount,
    qualifiedSessionCount,
    morningSessionCount: qualifyingSessions.filter(session => getSessionDaypart(session) === 'morning').length,
    eveningSessionCount: qualifyingSessions.filter(session => getSessionDaypart(session) === 'evening').length,
    overnightAdjacentSessionCount: qualifyingSessions.filter(session => getSessionDaypart(session) === 'overnightAdjacent').length,
    sessionTotalDurationMinutes,
    sessionDistinctDays: sessionDayKeys.size,
    sessionsWithin24hSpanCount,
    sessionWithinFoundationWindowCount,
    holdMinutes,
    riseDetectedCount,
    peakDetectedCount,
    holdDetectedCount,
    declineDetectedCount,
    fullCycleCapturedCount,
    highConfidenceSessionCount,
    stableHoldQualityTier,
    peakConfidenceTier,
    staticSessionCount: staticSessions.length,
    motionSessionCount: motionSessions.length,
    staticSessionDistinctDays: staticSessionDayKeys.size,
    motionSessionDistinctDays: motionSessionDayKeys.size,
    sessionTypeDiversityTier,
    sessionDistinctDaypartsCount,
    strongerMovementRangeCount,
    minimalMovementRangeCount,
  };
}

export function evaluateFoundationHiddenMilestones(data: ArcAppDataSnapshot): FoundationHiddenMilestoneEvaluation {
  const metrics = buildFoundationHiddenMilestoneMetrics(data);

  const milestones = FOUNDATION_HIDDEN_MILESTONES.map(definition => {
    const progressValue = metrics[definition.metricType];
    const completionRatio = clampNumber(progressValue / definition.threshold, 0, 1);

    return {
      ...definition,
      progressValue,
      completionRatio,
      isCompleted: progressValue >= definition.threshold,
    };
  });

  const clusters = FOUNDATION_HIDDEN_MILESTONE_CLUSTERS
    .slice()
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map(definition => ({
      definition,
      items: milestones
        .filter(item => item.cluster === definition.id)
        .sort((left, right) => left.sortOrder - right.sortOrder),
    }));

  const visibleChecklistLinks = milestones.reduce<FoundationHiddenMilestoneEvaluation['visibleChecklistLinks']>(
    (map, milestone) => {
      const current = map[milestone.visibleChecklistLink] ?? {
        checklistId: milestone.visibleChecklistLink,
        milestoneIds: [],
        completedCount: 0,
        totalCount: 0,
      };

      current.milestoneIds.push(milestone.id);
      current.totalCount += 1;
      current.completedCount += milestone.isCompleted ? 1 : 0;
      map[milestone.visibleChecklistLink] = current;
      return map;
    },
    {},
  );

  visibleChecklistLinks['foundation-complete'] = {
    checklistId: 'foundation-complete',
    milestoneIds: milestones.map(milestone => milestone.id),
    completedCount: milestones.filter(milestone => milestone.isCompleted).length,
    totalCount: milestones.length,
  };

  const insightKeys: FoundationHiddenInsightLink[] = [
    'wearDepthImproving',
    'baselineClarityImproving',
    'sessionRangeImproving',
    'sessionQualityImproving',
    'sessionVarietyImproving',
  ];

  const insightLinks = insightKeys.reduce<FoundationHiddenMilestoneEvaluation['insightLinks']>((map, key) => {
    const linkedMilestones = milestones.filter(milestone => milestone.insightLink === key);
    map[key] = {
      insightLink: key,
      milestoneIds: linkedMilestones.map(milestone => milestone.id),
      completedCount: linkedMilestones.filter(milestone => milestone.isCompleted).length,
      totalCount: linkedMilestones.length,
    };
    return map;
  }, {} as FoundationHiddenMilestoneEvaluation['insightLinks']);

  const priorityCounts = milestones.reduce<FoundationHiddenMilestoneEvaluation['priorityCounts']>(
    (counts, milestone) => {
      counts[milestone.pulsePriority] += 1;
      return counts;
    },
    {
      low: 0,
      normal: 0,
      high: 0,
      veryHigh: 0,
    },
  );

  const pulseEligibleMilestones = milestones.reduce<FoundationHiddenMilestoneEvaluation['pulseEligibleMilestones']>(
    (groups, milestone) => {
      if (milestone.directPulseEligible) {
        groups.directPulse.push(milestone);
      }

      if (milestone.summaryEligible) {
        groups.summaryEligible.push(milestone);
      }

      if (!milestone.summaryEligible && !milestone.directPulseEligible) {
        groups.silent.push(milestone);
      }

      return groups;
    },
    {
      directPulse: [],
      summaryEligible: [],
      silent: [],
    },
  );

  return {
    metrics,
    milestones,
    clusters,
    completedCount: milestones.filter(milestone => milestone.isCompleted).length,
    totalCount: milestones.length,
    visibleChecklistLinks,
    insightLinks,
    priorityCounts,
    pulseEligibleMilestones,
  };
}
