export type FoundationChecklistSectionId =
  | 'wear'
  | 'baseline'
  | 'sessions'
  | 'sessionType'
  | 'sessionQuality'
  | 'finish';

export type FoundationChecklistProgressionStyle = 'ladder' | 'parallel' | 'finish';

export type FoundationChecklistMetricType =
  | 'totalWearHours'
  | 'totalBaselineHours'
  | 'qualifiedEventCount'
  | 'qualifiedSessionCount'
  | 'staticSessionCount'
  | 'motionSessionCount'
  | 'strongHoldCount'
  | 'foundationAllTargetsComplete';

export type FoundationChecklistCompletionState = 'active' | 'in_progress' | 'completed' | 'upcoming';

export type FoundationChecklistInfoTermId =
  | 'foundation'
  | 'baseline'
  | 'event'
  | 'session'
  | 'staticSession'
  | 'motionSession'
  | 'strongHold';

export interface FoundationChecklistSectionDefinition {
  id: FoundationChecklistSectionId;
  title: string;
  intro?: string;
  sortOrder: number;
  progressionStyle: FoundationChecklistProgressionStyle;
}

export interface FoundationChecklistInfoDefinition {
  id: FoundationChecklistInfoTermId;
  title: string;
  whatItMeans: string;
  whyItMatters: string;
}

export interface FoundationChecklistDefinition {
  id: string;
  section: FoundationChecklistSectionId;
  title: string;
  targetLabel: string;
  explanationShort: string;
  explanationExpandedWhatItMeans: string;
  explanationExpandedWhyItMatters: string;
  metricType: FoundationChecklistMetricType;
  threshold: number;
  sortOrder: number;
  infoTermId?: FoundationChecklistInfoTermId;
}

export interface FoundationChecklistMetrics {
  totalWearHours: number;
  totalBaselineHours: number;
  qualifiedEventCount: number;
  qualifiedSessionCount: number;
  staticSessionCount: number;
  motionSessionCount: number;
  strongHoldCount: number;
  foundationAllTargetsComplete: number;
}

export interface FoundationChecklistEvaluatedItem extends FoundationChecklistDefinition {
  progressValue: number;
  completionRatio: number;
  completionState: FoundationChecklistCompletionState;
  progressDetail: string;
  completed: boolean;
  linkedHiddenMilestoneIds: string[];
  hiddenMilestoneCompletedCount: number;
  hiddenMilestoneTotalCount: number;
}

export interface FoundationChecklistEvaluatedSection {
  definition: FoundationChecklistSectionDefinition;
  items: FoundationChecklistEvaluatedItem[];
}

export interface FoundationChecklistEvaluation {
  sections: FoundationChecklistEvaluatedSection[];
  completedCount: number;
  totalCount: number;
  foundationComplete: boolean;
  metrics: FoundationChecklistMetrics;
  hiddenLinkSummaryByItemId: Record<
    string,
    {
      milestoneIds: string[];
      completedCount: number;
      totalCount: number;
    }
  >;
}
