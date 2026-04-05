import type { PulseCategory, PulsePriority } from './pulseTypes';

export type FoundationHiddenMilestoneCluster =
  | 'wearDepth'
  | 'baselineDepth'
  | 'sessionCapture'
  | 'sessionQuality'
  | 'sessionVariety';

export type FoundationHiddenMilestoneMetricType =
  | 'totalWearMinutes'
  | 'continuousWearMinutes'
  | 'morningWearBlockCount'
  | 'eveningWearBlockCount'
  | 'overnightAdjacentWearBlockCount'
  | 'wearDistinctDaypartsCount'
  | 'baselineMinutes'
  | 'morningBaselineCount'
  | 'afternoonBaselineCount'
  | 'eveningBaselineCount'
  | 'baselineDistinctDaypartsCount'
  | 'baselineDistinctDays'
  | 'stableBaselineBlockCount'
  | 'lowNoiseBaselineThresholdCount'
  | 'baselineRepeatabilityTier'
  | 'qualifiedEventCount'
  | 'qualifiedSessionCount'
  | 'morningSessionCount'
  | 'eveningSessionCount'
  | 'overnightAdjacentSessionCount'
  | 'sessionTotalDurationMinutes'
  | 'sessionDistinctDays'
  | 'sessionsWithin24hSpanCount'
  | 'sessionWithinFoundationWindowCount'
  | 'holdMinutes'
  | 'riseDetectedCount'
  | 'peakDetectedCount'
  | 'holdDetectedCount'
  | 'declineDetectedCount'
  | 'fullCycleCapturedCount'
  | 'highConfidenceSessionCount'
  | 'stableHoldQualityTier'
  | 'peakConfidenceTier'
  | 'staticSessionCount'
  | 'motionSessionCount'
  | 'staticSessionDistinctDays'
  | 'motionSessionDistinctDays'
  | 'sessionTypeDiversityTier'
  | 'sessionDistinctDaypartsCount'
  | 'strongerMovementRangeCount'
  | 'minimalMovementRangeCount';

export type FoundationHiddenInsightLink =
  | 'wearDepthImproving'
  | 'baselineClarityImproving'
  | 'sessionRangeImproving'
  | 'sessionQualityImproving'
  | 'sessionVarietyImproving';

export interface FoundationHiddenMilestoneClusterDefinition {
  id: FoundationHiddenMilestoneCluster;
  title: string;
  description: string;
  sortOrder: number;
}

export interface FoundationHiddenMilestoneDefinition {
  id: string;
  cluster: FoundationHiddenMilestoneCluster;
  title: string;
  metricType: FoundationHiddenMilestoneMetricType;
  threshold: number;
  isRepeatable: boolean;
  visibleChecklistLink: string;
  insightLink: FoundationHiddenInsightLink | null;
  pulseTitle: string;
  pulseMessage: string;
  pulseCategory: PulseCategory;
  pulsePriority: PulsePriority;
  pulseAccentPriority: PulsePriority;
  summaryEligible: boolean;
  directPulseEligible: boolean;
  dedupeKey: string;
  throttleKey: string;
  sortOrder: number;
}

export interface FoundationHiddenMilestoneMetrics {
  totalWearMinutes: number;
  continuousWearMinutes: number;
  morningWearBlockCount: number;
  eveningWearBlockCount: number;
  overnightAdjacentWearBlockCount: number;
  wearDistinctDaypartsCount: number;
  baselineMinutes: number;
  morningBaselineCount: number;
  afternoonBaselineCount: number;
  eveningBaselineCount: number;
  baselineDistinctDaypartsCount: number;
  baselineDistinctDays: number;
  stableBaselineBlockCount: number;
  lowNoiseBaselineThresholdCount: number;
  baselineRepeatabilityTier: number;
  qualifiedEventCount: number;
  qualifiedSessionCount: number;
  morningSessionCount: number;
  eveningSessionCount: number;
  overnightAdjacentSessionCount: number;
  sessionTotalDurationMinutes: number;
  sessionDistinctDays: number;
  sessionsWithin24hSpanCount: number;
  sessionWithinFoundationWindowCount: number;
  holdMinutes: number;
  riseDetectedCount: number;
  peakDetectedCount: number;
  holdDetectedCount: number;
  declineDetectedCount: number;
  fullCycleCapturedCount: number;
  highConfidenceSessionCount: number;
  stableHoldQualityTier: number;
  peakConfidenceTier: number;
  staticSessionCount: number;
  motionSessionCount: number;
  staticSessionDistinctDays: number;
  motionSessionDistinctDays: number;
  sessionTypeDiversityTier: number;
  sessionDistinctDaypartsCount: number;
  strongerMovementRangeCount: number;
  minimalMovementRangeCount: number;
}

export interface FoundationHiddenMilestoneEvaluatedItem extends FoundationHiddenMilestoneDefinition {
  progressValue: number;
  completionRatio: number;
  isCompleted: boolean;
}

export interface FoundationHiddenMilestoneEvaluatedCluster {
  definition: FoundationHiddenMilestoneClusterDefinition;
  items: FoundationHiddenMilestoneEvaluatedItem[];
}

export interface FoundationHiddenVisibleChecklistLinkSummary {
  checklistId: string;
  milestoneIds: string[];
  completedCount: number;
  totalCount: number;
}

export interface FoundationHiddenInsightSummary {
  insightLink: FoundationHiddenInsightLink;
  milestoneIds: string[];
  completedCount: number;
  totalCount: number;
}

export interface FoundationHiddenMilestoneEvaluation {
  metrics: FoundationHiddenMilestoneMetrics;
  milestones: FoundationHiddenMilestoneEvaluatedItem[];
  clusters: FoundationHiddenMilestoneEvaluatedCluster[];
  completedCount: number;
  totalCount: number;
  visibleChecklistLinks: Record<string, FoundationHiddenVisibleChecklistLinkSummary>;
  insightLinks: Record<FoundationHiddenInsightLink, FoundationHiddenInsightSummary>;
  priorityCounts: Record<PulsePriority, number>;
  pulseEligibleMilestones: {
    directPulse: FoundationHiddenMilestoneEvaluatedItem[];
    summaryEligible: FoundationHiddenMilestoneEvaluatedItem[];
    silent: FoundationHiddenMilestoneEvaluatedItem[];
  };
}
