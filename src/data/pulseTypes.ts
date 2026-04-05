export type PulseCategory = 'accomplishment' | 'insight' | 'guidance';

export type PulsePriority = 'low' | 'normal' | 'high' | 'veryHigh';

export type PulsePriorityMuteState = Record<PulsePriority, boolean>;

export type PulseAccentStyle = 'platinumBlue' | 'iceBlue' | 'indigo' | 'custom';

export type PulseIconType = 'dot' | 'diamond' | 'ring' | 'pulseLine' | 'foundation' | 'custom';

export type PulseActionType = 'open_detail' | 'navigate' | 'expand_inline' | 'none';

export type PulseSource =
  | 'foundation_checklist'
  | 'foundation_explanation'
  | 'edge_score'
  | 'session_capture'
  | 'baseline_engine'
  | 'insight_engine'
  | 'active_focus'
  | 'profile_status'
  | 'sync_system'
  | 'theme_unlock'
  | 'artifact_system'
  | string;

export type PulseActionPayload = Record<string, unknown>;

export interface PulseSummaryEntry {
  id: string;
  title: string;
  message: string;
  category: PulseCategory;
  timestamp: number;
  source: PulseSource;
}

export interface PulseDetailContent {
  whyItMatters?: string;
  relatedProgress?: string;
  actionHint?: string;
  actionLabel?: string;
  sourceLabel?: string;
}

export interface PulseItem {
  id: string;
  category: PulseCategory;
  priority: PulsePriority;
  title: string;
  message: string;
  timestamp: number;
  source: PulseSource;
  sourceContext?: string;
  accentStyle: PulseAccentStyle;
  iconType: PulseIconType;
  isDismissed: boolean;
  isRead: boolean;
  isExpanded: boolean;
  isPersistentInHistory: boolean;
  autoDismissMs: number;
  actionType?: PulseActionType;
  actionPayload?: PulseActionPayload;
  summaryGroupKey?: string;
  summaryEligible: boolean;
  dedupeKey?: string;
  throttleKey?: string;
  metadata?: Record<string, unknown>;
  detail?: PulseDetailContent;
  summaryCount?: number;
  summaryItems?: PulseSummaryEntry[];
}

export type PulseInput = Omit<
  PulseItem,
  'id' | 'timestamp' | 'isDismissed' | 'isRead' | 'isExpanded' | 'autoDismissMs'
> & {
  id?: string;
  timestamp?: number;
  autoDismissMs?: number;
};

export interface PulseController {
  activePulse: PulseItem | null;
  pulseQueue: PulseItem[];
  recentPulseHistory: PulseItem[];
  mutedPopupPriorities: PulsePriorityMuteState;
  pushPulse: (item: PulseInput) => string | null;
  backfillPulse: (item: PulseInput, options?: { markRead?: boolean }) => string | null;
  resetPulseState: () => void;
  dismissPulse: (id?: string) => void;
  markPulseRead: (id: string) => void;
  clearReadPulses: () => void;
  expandPulse: (id: string) => void;
  collapsePulse: (id: string) => void;
  clearPulseQueue: () => void;
  getRecentPulses: () => PulseItem[];
  suppressPulse: (dedupeKey: string) => void;
  summarizeQueuedPulses: () => void;
  setPriorityPopupMuted: (priority: PulsePriority, muted: boolean) => void;
  togglePriorityPopupMuted: (priority: PulsePriority) => void;
}
