export type SessionType = 'motion' | 'static' | 'nocturnal';
export type TrendDirection = 'improving' | 'stable' | 'declining';
export type StatusLevel = 'strong' | 'steady' | 'variable' | 'elevated' | 'stable' | 'reduced';

export interface SessionMetrics {
  buildSpeed: string;
  stability: number;
  duration: string;
  recovery: string;
  rebound?: string;
  holdQuality?: string;
  peakQuality?: string;
}

export interface MotionMetrics {
  driveCount: number;
  cadence: string;
  rhythm: 'Consistent' | 'Variable' | 'Irregular';
  peakWindow: string;
  activeDuration: string;
  cadenceAvg?: string;
  cadencePeak?: string;
  rhythmConsistency?: number;
  motionDuration?: string;
  motionIntensity?: 'Low' | 'Moderate' | 'High';
  motionStability?: number;
  averageDriveInterval?: string;
}

export interface SessionAnalysis {
  buildEfficiencyScore?: number;
  peakIntegrityScore?: number;
  holdEfficiencyScore?: number;
  recoveryEfficiencyScore?: number;
  controlScore?: number;
  sessionQualityScore?: number;
  motionEfficiencyScore?: number;
  rhythmControlScore?: number;
  overnightRegularityScore?: number;
}

export interface Session {
  id: string;
  type: SessionType;
  date: string;
  time: string;
  capturedAt?: number;
  statusLabel: string;
  peakLevel?: number;
  metrics: SessionMetrics;
  motion?: MotionMetrics;
  nocturnalEvents?: number;
  strongestEvent?: string;
  overnightStability?: string;
  nocturnalQuality?: number;
  durationMs?: number;
  buildDurationMs?: number;
  recoveryDurationMs?: number;
  erectionWaveform?: number[];
  motionWaveform?: number[];
  analysis?: SessionAnalysis;
  insights: string[];
  isPersonalBest?: boolean;
  personalBestLabel?: string;
}

export interface DashboardMetrics {
  restingState: { status: StatusLevel; trend: string; baseline: string };
  buildSpeed: { latest: string; average: string; indicator: string };
  stability: { score: number; note: string };
  duration: { latest: string; average: string; direction: TrendDirection };
  recovery: { latest: string; best: string; trend: TrendDirection };
  rebound: { latest: string; relevant: boolean };
}

export interface LifetimeStats {
  archiveWindowDays: number;
  archiveStartLabel: string;
  archiveEndLabel: string;
  activeDays: number;
  sessionsPerActiveDay: string;
  totalSessions: number;
  totalMotionSessions: number;
  totalStaticSessions: number;
  totalNocturnalSessions: number;
  totalPersonalBestSessions: number;
  motionSessionShare: string;
  staticSessionShare: string;
  nocturnalSessionShare: string;
  totalActiveTime: string;
  totalMotionTime: string;
  totalStaticTime: string;
  totalNocturnalTime: string;
  averageSessionDuration: string;
  averageMotionDuration: string;
  averageStaticDuration: string;
  averageNocturnalDuration: string;
  longestSession: string;
  shortestSession: string;
  bestPeak: string;
  averagePeak: string;
  averageMotionPeak: string;
  averageStaticPeak: string;
  averageNocturnalPeak: string;
  peakSessionsAtOrAbovePeakLine: number;
  peakSessionsAtOrAboveRecordLine: number;
  fastestBuild: string;
  averageBuild: string;
  averageMotionBuild: string;
  averageStaticBuild: string;
  fastestRecovery: string;
  averageRecovery: string;
  fastestRebound: string;
  averageRebound: string;
  averageStability: string;
  bestStability: string;
  averageMotionStability: string;
  averageStaticStability: string;
  averageNocturnalStability: string;
  averageHoldScore: string;
  lifetimeDriveCount: string;
  averageDriveCount: string;
  bestDriveCount: string;
  averageCadence: string;
  peakCadence: string;
  averagePeakCadence: string;
  averageRhythmConsistency: string;
  averageMotionControl: string;
  averageDriveInterval: string;
  consistentMotionSessions: number;
  variableMotionSessions: number;
  irregularMotionSessions: number;
  rhythmTrend: TrendDirection;
  totalNocturnalEvents: number;
  averageNocturnalEvents: string;
  strongestNocturnalSet: string;
  averageNocturnalQuality: string;
  bestNocturnalQuality: string;
}

export interface PersonalRecord {
  label: string;
  value: string;
  date: string;
}

export interface Milestone {
  id: string;
  type: 'personal_best' | 'milestone' | 'streak' | 'theme_unlock';
  title: string;
  subtitle: string;
  achieved: boolean;
  date?: string;
}

export interface AppTheme {
  id: string;
  name: string;
  accent: string;
  bg: string;
  description?: string;
  unlocked: boolean;
}

export type AvatarTier = 
  | 'threshold' 
  | 'ember1'
  | 'ember2'
  | 'ember3'
  | 'ember4'
  | 'ember5'
  | 'hold' 
  | 'alloy' 
  | 'onset' 
  | 'deephold' 
  | 'rhythm' 
  | 'blackgold' 
  | 'endurance' 
  | 'nocturne' 
  | 'sovereign' 
  | 'obsidian';
export type SpecialtyMarker = 'stability' | 'build' | 'duration' | 'cadence' | 'consistency' | 'nocturnal';

export interface UserProfile {
  anonymousUsername: string;
  tier: AvatarTier;
  specialty?: SpecialtyMarker;
  progressPoints: number;
}

export interface InsigniaCollectionItem {
  id: string;
  name: string;
  tier: AvatarTier;
  status: 'selected' | 'unlocked' | 'locked';
  unlockCondition?: string;
}
