import {
  motionCadenceIntensity as baseMotionCadenceIntensity,
  personalRecords as basePersonalRecords,
  userProfile as baseUserProfile,
} from './arc-mock-data';
import { getActiveInsigniaTier } from './arc-insignia';
import type {
  DashboardMetrics,
  LifetimeStats,
  Milestone,
  PersonalRecord,
  Session,
  StatusLevel,
  TrendDirection,
  UserProfile,
} from './arc-types';

const RESTING_BASELINE = 22;
const RESTING_ELEVATED = 26;
const NOCTURNAL_APPROX_EVENT_MINUTES = 9.5;

export type ArcLiveLinePhase = 'default' | 'nocturnalRise' | 'nocturnalHold' | 'nocturnalDecline';

export type ArcLiveTelemetryPhase =
  | 'idle'
  | 'restingHold'
  | 'earlyRise'
  | 'activeEntry'
  | 'activeRise'
  | 'plateau'
  | 'decline'
  | 'recovery'
  | 'nocturnalRise'
  | 'nocturnalHold'
  | 'nocturnalDecline';

export type ArcLiveTelemetryState =
  | 'reduced'
  | 'baseline'
  | 'elevated'
  | 'entering'
  | 'active'
  | 'peak'
  | 'returning';

export type ArcLiveTelemetryTrend = 'up' | 'hold' | 'down';

export interface ArcLiveTelemetry {
  currentValue: number;
  history: number[];
  historyLinePhases: ArcLiveLinePhase[];
  phase: ArcLiveTelemetryPhase;
  linePhase: ArcLiveLinePhase;
  stateKey: ArcLiveTelemetryState;
  trend: ArcLiveTelemetryTrend;
  isSimulating: boolean;
  isNocturnalActive: boolean;
  updatedAt: number;
}

export interface ArcSparklineSet {
  restingState: number[];
  buildSpeed: number[];
  stability: number[];
  duration: number[];
  recovery: number[];
  nocturnal: number[];
}

export interface ArcAppHighlights {
  buildSpeedSevenDayAverage: string;
  buildSpeedPersonalBest: string;
  buildTrendLabel: string;
  restingVariability7d: string;
  restingVariability30d: string;
  restingBestStability: string;
  activeStateLabel: string;
  activeStateSummary: string;
  holdVariability: string;
  recoveryTrendLabel: string;
  bestRebound: string;
  recoveryThirtyDayAverage: string;
  nocturnalTotalActive: string;
  nocturnalTrendLabel: string;
  liveStatusSummary: string;
}

export type ArcCalibrationStage = 'initial' | 'learning' | 'established';

export interface ArcCalibrationStatus {
  stage: ArcCalibrationStage;
  progress: number;
  title: string;
  summary: string;
  detail: string;
  nextUnlock: string;
  progressLabel: string;
}

export type ArcCalibrationTrackKey = 'peak' | 'baseline' | 'nocturnal';

export interface ArcCalibrationTrack {
  key: ArcCalibrationTrackKey;
  title: string;
  targetLabel: string;
  supportingCopy: string;
  current: number;
  target: number;
  progress: number;
  progressLabel: string;
  statusTitle: string;
  completionLine: string;
  established: boolean;
  referenceValue?: number | null;
}

export interface ArcThresholdModel {
  reduced: number;
  baseline: number;
  elevated: number;
  activeEntry: number;
  peak: number;
  record: number;
  baselineReady: boolean;
  peakReady: boolean;
  nocturnalReady: boolean;
  baselineAverage: number;
  peakAverage: number | null;
}

export interface ArcFeatureAvailability {
  edgeScore: boolean;
  buildInsights: boolean;
  activeInsights: boolean;
  recoveryInsights: boolean;
  sessionArchive: boolean;
  lifetime: boolean;
  milestones: boolean;
  nocturnal: boolean;
  personalBests: boolean;
  advancedLive: boolean;
}

export type ArcGoalCategory = 'broad' | 'specific';

export interface ArcGoalDefinition {
  id: string;
  label: string;
  category: ArcGoalCategory;
  description: string;
  relatedModules: string[];
  accentColor: string;
  parentGoalId?: string;
}

export interface ArcCurrentGoal {
  id: string;
  label: string;
  category: ArcGoalCategory;
  description: string;
  relatedModules: string[];
  accentColor?: string;
  activeFocusLabel?: string | null;
  progressHint: string;
}

export type ArcEdgeScoreState =
  | 'building'
  | 'early_calibrated'
  | 'live'
  | 'strengthening'
  | 'stable'
  | 'reduced'
  | 'volatile';

export type ArcEdgeTrendDirection = 'rising' | 'stable' | 'falling';

export interface ArcEdgePersonalProfileSnapshot {
  baselineMean: number;
  baselineLow: number;
  baselineHigh: number;
  averageMaxExpansion: number;
  averageHoldQuality: number;
  averageRecoveryQuality: number;
  calibrationConfidence: number;
}

export interface ArcEdgeBaselineReadinessBreakdown {
  averageBaselineFullnessScore: number;
  baselineStabilityScore: number;
  reducedBaselinePenaltyScore: number;
  elevatedBaselineSupportScore: number;
  baselineVolatilityQualityScore: number;
}

export interface ArcEdgeBaselineReadinessRawValues {
  averageBaselineFullness: string;
  baselineStability: string;
  reducedBaselineFrequency: string;
  elevatedBaselineSupport: string;
  baselineVolatilityQuality: string;
}

export interface ArcEdgeErectionQualityBreakdown {
  peakFullnessScore: number;
  peakConsistencyScore: number;
  holdQualityScore: number;
  stabilityScore: number;
  durationQualityScore: number;
  buildQualityScore: number;
  recoveryQualityScore: number;
  reboundQualityScore: number;
}

export interface ArcEdgeErectionQualityRawValues {
  peakFullness: string;
  peakConsistency: string;
  holdQuality: string;
  stability: string;
  durationQuality: string;
  buildQuality: string;
  recoveryQuality: string;
  reboundQuality: string;
}

export interface ArcEdgeSessionPerformanceBreakdown {
  motionSessionQualityScore: number;
  motionHoldQualityScore: number;
  motionPeakQualityScore: number;
  motionDurationScore: number;
  motionStaticRatioScore: number;
  driveCountQualityScore: number;
  cadenceQualityScore: number;
  rhythmConsistencyScore: number;
  motionControlScore: number;
}

export interface ArcEdgeSessionPerformanceRawValues {
  motionSessionQuality: string;
  motionHoldQuality: string;
  motionPeakQuality: string;
  motionDuration: string;
  motionStaticRatio: string;
  driveCount: string;
  cadence: string;
  rhythmConsistency: string;
  motionControl: string;
}

export interface ArcEdgeOvernightSupportBreakdown {
  averageNocturnalFullnessScore: number;
  averageNocturnalDurationScore: number;
  eventFrequencyScore: number;
  nocturnalConsistencyScore: number;
  strongestSetSupportScore: number;
}

export interface ArcEdgeOvernightSupportRawValues {
  averageNocturnalFullness: string;
  averageNocturnalDuration: string;
  eventFrequency: string;
  nocturnalConsistency: string;
  strongestSetSupport: string;
}

export interface ArcEdgeConsistencyReliabilityBreakdown {
  peakConsistencyScore: number;
  holdConsistencyScore: number;
  activeDayDensityScore: number;
  archiveMaturityScore: number;
  patternReliabilityScore: number;
}

export interface ArcEdgeConsistencyReliabilityRawValues {
  peakConsistency: string;
  holdConsistency: string;
  activeDayDensity: string;
  archiveMaturity: string;
  patternReliability: string;
}

export interface ArcEdgeConfidenceBreakdown {
  baselineCoverageConfidence: number;
  qualifiedSessionConfidence: number;
  nocturnalCoverageConfidence: number;
  activeDayConfidence: number;
  overallModelConfidence: number;
}

export interface ArcEdgeRecentSwing {
  id: string;
  label: string;
  pillarLabel: string;
  delta: number;
  impact: number;
  direction: 'up' | 'down';
}

export interface ArcEdgeScoreModel {
  unlocked: boolean;
  unlockProgress: number;
  unlockPercentage: number;
  value: number | null;
  dayDelta: number | null;
  state: ArcEdgeScoreState;
  status: string;
  trendDirection: ArcEdgeTrendDirection;
  confidence: number;
  confidenceLabel: string;
  maturityLabel: string;
  baselineReadiness: number;
  erectionQuality: number;
  sessionPerformance: number;
  overnightSupport: number;
  consistencyReliability: number;
  readiness: number;
  performance: number;
  stability: number;
  profile: ArcEdgePersonalProfileSnapshot;
  baselineReadinessBreakdown: ArcEdgeBaselineReadinessBreakdown;
  baselineReadinessRawValues: ArcEdgeBaselineReadinessRawValues;
  erectionQualityBreakdown: ArcEdgeErectionQualityBreakdown;
  erectionQualityRawValues: ArcEdgeErectionQualityRawValues;
  sessionPerformanceBreakdown: ArcEdgeSessionPerformanceBreakdown;
  sessionPerformanceRawValues: ArcEdgeSessionPerformanceRawValues;
  overnightSupportBreakdown: ArcEdgeOvernightSupportBreakdown;
  overnightSupportRawValues: ArcEdgeOvernightSupportRawValues;
  consistencyReliabilityBreakdown: ArcEdgeConsistencyReliabilityBreakdown;
  consistencyReliabilityRawValues: ArcEdgeConsistencyReliabilityRawValues;
  confidenceBreakdown: ArcEdgeConfidenceBreakdown;
  recentImpactSwings: ArcEdgeRecentSwing[];
  recentImpactCatalog: ArcEdgeRecentSwing[];
  primaryLine: string;
  secondaryLine: string;
  ctaLabel: string;
  detailBody: string;
  methodologyLine: string;
}

export interface ArcAppDataSnapshot {
  sessions: Session[];
  dashboardMetrics: DashboardMetrics;
  lifetimeStats: LifetimeStats;
  personalRecords: PersonalRecord[];
  milestones: Milestone[];
  sparklines: ArcSparklineSet;
  userProfile: UserProfile;
  motionCadenceIntensity: number[];
  liveTelemetry: ArcLiveTelemetry | null;
  latestMotionSession: Session | null;
  latestStaticSession: Session | null;
  latestNocturnalSession: Session | null;
  recordedSessionCount: number;
  highlights: ArcAppHighlights;
  calibration: ArcCalibrationStatus;
  calibrationTracks: ArcCalibrationTrack[];
  thresholdModel: ArcThresholdModel;
  featureAvailability: ArcFeatureAvailability;
  edgeScore: ArcEdgeScoreModel;
  wearStreakDays: number;
  foundationClockElapsedMinutes: number;
  goalLibrary: ArcGoalDefinition[];
  currentGoal: ArcCurrentGoal;
}

export interface ArcAutonomousPeakEvent {
  id?: string;
  timestamp: number;
  peakLevel: number;
}

export type ArcUserProfileOverride = Partial<Pick<UserProfile, 'anonymousUsername' | 'tier' | 'specialty'>>;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function parseDurationToSeconds(label?: string): number | null {
  if (!label || label === '--') {
    return null;
  }

  const hoursMatch = label.match(/(\d+(?:\.\d+)?)h/i);
  const minutesMatch = label.match(/(\d+(?:\.\d+)?)m/i);
  const secondsMatch = label.match(/(\d+(?:\.\d+)?)s/i);

  if (!hoursMatch && !minutesMatch && !secondsMatch) {
    return null;
  }

  const hours = hoursMatch ? parseFloat(hoursMatch[1] ?? '0') : 0;
  const minutes = minutesMatch ? parseFloat(minutesMatch[1] ?? '0') : 0;
  const seconds = secondsMatch ? parseFloat(secondsMatch[1] ?? '0') : 0;

  return Math.round(hours * 3600 + minutes * 60 + seconds);
}

function formatMinuteSecondLabel(totalSeconds: number): string {
  const rounded = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(rounded / 60);
  const seconds = rounded % 60;

  if (seconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
}

function formatHourMinuteLabel(totalSeconds: number): string {
  const rounded = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);

  if (hours <= 0) {
    return `${Math.max(1, minutes)}m`;
  }

  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}

function formatEdgeMetricNumber(value: number | null, maximumFractionDigits = 1) {
  if (value == null || !Number.isFinite(value)) {
    return '--';
  }

  return value
    .toFixed(maximumFractionDigits)
    .replace(/\.0+$/, '')
    .replace(/(\.\d*[1-9])0+$/, '$1');
}

function formatEdgeMetricPercent(value: number | null, maximumFractionDigits = 0) {
  return `${formatEdgeMetricNumber(value, maximumFractionDigits)}%`;
}

function formatEdgeMetricShare(value: number | null, maximumFractionDigits = 0) {
  if (value == null || !Number.isFinite(value)) {
    return '--';
  }

  return `${formatEdgeMetricNumber(value * 100, maximumFractionDigits)}%`;
}

function formatEdgeMetricVariance(value: number | null, maximumFractionDigits = 1) {
  if (value == null || !Number.isFinite(value)) {
    return '--';
  }

  return `±${formatEdgeMetricNumber(value, maximumFractionDigits)} pts`;
}

function formatEdgeMetricDuration(value: number | null) {
  if (value == null || !Number.isFinite(value) || value <= 0) {
    return '--';
  }

  return value >= 3600 ? formatHourMinuteLabel(value) : formatMinuteSecondLabel(value);
}

function formatEdgeMotionStaticRatio(value: number | null) {
  if (value == null || !Number.isFinite(value)) {
    return '--';
  }

  if (value >= 0.995) {
    return 'All motion';
  }

  const staticShare = Math.max(1 - value, 0.01);
  return `${formatEdgeMetricNumber(value / staticShare, 1)}:1`;
}

function formatMinutesDecimal(totalSeconds: number): string {
  const minutes = Math.max(0, totalSeconds / 60);
  return minutes >= 10 ? `${Math.round(minutes)}m` : `${minutes.toFixed(1)}m`;
}

function formatSessionLengthLabel(totalSeconds: number): string {
  if (totalSeconds >= 3600) {
    return formatHourMinuteLabel(totalSeconds);
  }

  return formatMinuteSecondLabel(totalSeconds);
}

function formatPercentLabel(value: number | null, decimals = 0): string {
  if (value == null || Number.isNaN(value)) {
    return '--';
  }

  return `${value.toFixed(decimals)}%`;
}

function formatFixedLabel(value: number | null, decimals = 1, suffix = ''): string {
  if (value == null || Number.isNaN(value)) {
    return '--';
  }

  return `${value.toFixed(decimals)}${suffix}`;
}

function formatIntegerLabel(value: number | null, suffix = ''): string {
  if (value == null || Number.isNaN(value)) {
    return '--';
  }

  return `${Math.round(value)}${suffix}`;
}

function formatArchiveDateLabel(session: Session | undefined): string {
  if (!session) {
    return '--';
  }

  if (typeof session.capturedAt === 'number') {
    return new Date(session.capturedAt).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
    });
  }

  return session.date;
}

function getSessionDayKey(session: Session): string {
  if (typeof session.capturedAt === 'number') {
    const capturedDate = new Date(session.capturedAt);
    return `${capturedDate.getFullYear()}-${capturedDate.getMonth()}-${capturedDate.getDate()}`;
  }

  return session.date;
}

function parseCadence(label?: string): number | null {
  if (!label) {
    return null;
  }

  const match = label.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1] ?? '0') : null;
}

function scoreSessionHoldQuality(label?: string): number {
  switch ((label ?? '').toLowerCase()) {
    case 'locked in':
      return 100;
    case 'steady':
      return 90;
    case 'controlled':
      return 78;
    case 'developing':
      return 64;
    case 'brief':
      return 50;
    default:
      return 58;
  }
}

function scoreSessionPeakQuality(label?: string): number {
  switch ((label ?? '').toLowerCase()) {
    case 'exceptional':
      return 100;
    case 'outstanding':
      return 94;
    case 'strong':
      return 86;
    case 'elevated':
      return 74;
    case 'qualified':
      return 64;
    case 'high support':
      return 92;
    case 'steady support':
      return 82;
    case 'moderate support':
      return 70;
    case 'light support':
      return 58;
    default:
      return 60;
  }
}

function getSessionDurationSeconds(session: Session): number {
  if (typeof session.durationMs === 'number') {
    return Math.max(0, Math.round(session.durationMs / 1000));
  }

  return parseDurationToSeconds(session.metrics.duration) ?? 0;
}

function getSessionRecoverySeconds(session: Session): number | null {
  if (typeof session.recoveryDurationMs === 'number') {
    return Math.max(0, Math.round(session.recoveryDurationMs / 1000));
  }

  return parseDurationToSeconds(session.metrics.recovery);
}

function computeMotionSessionBestScore(session: Session): number {
  const durationMinutes = clamp(getSessionDurationSeconds(session) / 60, 0, 24);
  const cadence = parseCadence(session.motion?.cadenceAvg ?? session.motion?.cadence) ?? 0;
  const cadencePeak = parseCadence(session.motion?.cadencePeak) ?? cadence;
  const driveCount = session.motion?.driveCount ?? 0;
  const rhythmConsistency = session.motion?.rhythmConsistency ?? 0;
  const motionStability = session.motion?.motionStability ?? rhythmConsistency;

  return (
    (session.peakLevel ?? 0) * 0.28 +
    session.metrics.stability * 0.22 +
    scoreSessionHoldQuality(session.metrics.holdQuality) * 0.16 +
    durationMinutes * 2.2 +
    driveCount * 0.06 +
    cadence * 0.36 +
    cadencePeak * 0.16 +
    rhythmConsistency * 0.08 +
    motionStability * 0.06
  );
}

function computeStaticSessionBestScore(session: Session): number {
  const durationMinutes = clamp(getSessionDurationSeconds(session) / 60, 0, 24);
  const recoverySeconds = getSessionRecoverySeconds(session);
  const recoveryBonus =
    recoverySeconds == null ? 0 : clamp(18 - recoverySeconds / 60, 0, 18);

  return (
    (session.peakLevel ?? 0) * 0.32 +
    session.metrics.stability * 0.26 +
    scoreSessionHoldQuality(session.metrics.holdQuality) * 0.22 +
    scoreSessionPeakQuality(session.metrics.peakQuality) * 0.14 +
    durationMinutes * 2 +
    recoveryBonus
  );
}

function computeNocturnalSessionBestScore(session: Session): number {
  const durationMinutes = clamp(getSessionDurationSeconds(session) / 60, 0, 28);
  const nocturnalQuality = session.nocturnalQuality ?? scoreSessionPeakQuality(session.overnightStability);

  return (
    (session.peakLevel ?? 0) * 0.26 +
    session.metrics.stability * 0.24 +
    nocturnalQuality * 0.26 +
    scoreSessionHoldQuality(session.metrics.holdQuality) * 0.14 +
    durationMinutes * 1.8
  );
}

function compareChampionSessions(
  candidate: Session,
  current: Session,
  candidateScore: number,
  currentScore: number,
): boolean {
  if (candidateScore > currentScore) {
    return true;
  }

  if (candidateScore < currentScore) {
    return false;
  }

  const candidatePeak = candidate.peakLevel ?? 0;
  const currentPeak = current.peakLevel ?? 0;
  if (candidatePeak !== currentPeak) {
    return candidatePeak > currentPeak;
  }

  const candidateTimestamp = candidate.capturedAt ?? Number.POSITIVE_INFINITY;
  const currentTimestamp = current.capturedAt ?? Number.POSITIVE_INFINITY;
  return candidateTimestamp < currentTimestamp;
}

function pickPersonalBestSession(
  sessions: Session[],
  scorer: (session: Session) => number,
): Session | null {
  let bestSession: Session | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  sessions.forEach(session => {
    const score = scorer(session);
    if (!bestSession || compareChampionSessions(session, bestSession, score, bestScore)) {
      bestSession = session;
      bestScore = score;
    }
  });

  return bestSession;
}

function applyPersonalBestSessions(recordedSessions: Session[], enabled = true): Session[] {
  if (!enabled) {
    return recordedSessions.map(session => ({
      ...session,
      isPersonalBest: false,
      personalBestLabel: undefined,
    }));
  }

  const motionBest = pickPersonalBestSession(
    recordedSessions.filter(session => session.type === 'motion'),
    computeMotionSessionBestScore,
  );
  const staticBest = pickPersonalBestSession(
    recordedSessions.filter(session => session.type === 'static'),
    computeStaticSessionBestScore,
  );
  const nocturnalBest = pickPersonalBestSession(
    recordedSessions.filter(session => session.type === 'nocturnal'),
    computeNocturnalSessionBestScore,
  );

  const bestIdToLabel = new Map<string, string>();
  if (motionBest) {
    bestIdToLabel.set(motionBest.id, 'Best Motion');
  }
  if (staticBest) {
    bestIdToLabel.set(staticBest.id, 'Best Static');
  }
  if (nocturnalBest) {
    bestIdToLabel.set(nocturnalBest.id, 'Best Full Night');
  }

  return recordedSessions.map(session => {
    const personalBestLabel = bestIdToLabel.get(session.id);

    return {
      ...session,
      isPersonalBest: Boolean(personalBestLabel),
      personalBestLabel,
    };
  });
}

function buildLockedPersonalRecords(): PersonalRecord[] {
  return basePersonalRecords.map(record => ({
    label: record.label,
    value: 'Unlocks after calibration',
    date: 'Calibrating',
  }));
}

function average(numbers: number[]): number | null {
  if (numbers.length === 0) {
    return null;
  }

  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
}

function standardDeviation(numbers: number[]): number {
  if (numbers.length < 2) {
    return 0;
  }

  const mean = average(numbers) ?? 0;
  return Math.sqrt(numbers.reduce((sum, value) => sum + (value - mean) ** 2, 0) / numbers.length);
}

function numericTrend(
  latest: number | null,
  averageValue: number | null,
  tolerance: number,
  higherIsBetter: boolean,
): TrendDirection {
  if (latest == null || averageValue == null) {
    return 'stable';
  }

  const delta = latest - averageValue;

  if (Math.abs(delta) <= tolerance) {
    return 'stable';
  }

  if (higherIsBetter) {
    return delta > 0 ? 'improving' : 'declining';
  }

  return delta < 0 ? 'improving' : 'declining';
}

function describeBuildIndicator(latest: number | null, averageValue: number | null): string {
  const direction = numericTrend(latest, averageValue, 10, false);

  if (direction === 'improving') {
    return 'Faster than your current average';
  }

  if (direction === 'declining') {
    return 'Build slightly slower than average';
  }

  return 'Tracking close to your current average';
}

function getRestingStatus(telemetry: ArcLiveTelemetry | null): StatusLevel {
  if (!telemetry) {
    return 'stable';
  }

  if (telemetry.currentValue < RESTING_BASELINE - 2) {
    return 'reduced';
  }

  if (telemetry.currentValue >= RESTING_ELEVATED) {
    return 'elevated';
  }

  return 'stable';
}

function describeLiveStatus(telemetry: ArcLiveTelemetry | null): string {
  if (!telemetry) {
    return 'Live signal is active while your baseline is being built';
  }

  switch (telemetry.stateKey) {
    case 'reduced':
      return 'Live reading is resting below your early baseline range';
    case 'elevated':
      return 'Live reading is holding above your current resting range';
    case 'entering':
      return 'Live reading is climbing toward active state';
    case 'active':
      return 'Live reading is sustaining above active entry';
    case 'peak':
      return 'Live reading is holding near peak session range';
    case 'returning':
      return 'Live reading is tapering back toward baseline';
    default:
      return 'Live reading is holding close to your current baseline range';
  }
}

function describeBaselineRange(telemetry: ArcLiveTelemetry | null): string {
  if (!telemetry) {
    return 'Resting reference forming';
  }

  const delta = telemetry.currentValue - RESTING_BASELINE;
  const absoluteDelta = Math.abs(delta).toFixed(1);

  if (delta >= 0) {
    return `${absoluteDelta}% above baseline`;
  }

  return `${absoluteDelta}% below baseline`;
}

function toBandVariability(values: number[], lowCutoff: number, mediumCutoff: number): string {
  if (values.length < 2) {
    return 'Low';
  }

  const mean = average(values) ?? 0;
  const deviation = Math.sqrt(
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length,
  );

  if (deviation <= lowCutoff) {
    return 'Low';
  }

  if (deviation <= mediumCutoff) {
    return 'Moderate';
  }

  return 'Variable';
}

function extendSeries(fallback: number[], incoming: number[], count = 7): number[] {
  if (incoming.length >= count) {
    return incoming.slice(-count);
  }

  return [...fallback.slice(0, Math.max(0, count - incoming.length)), ...incoming].slice(-count);
}

function downsample(values: number[], count: number): number[] {
  if (values.length === 0) {
    return [];
  }

  if (values.length <= count) {
    return values.slice();
  }

  return Array.from({ length: count }, (_, index) => {
    const progress = index / Math.max(1, count - 1);
    return values[Math.round(progress * (values.length - 1))] ?? values[values.length - 1] ?? 0;
  });
}

function buildMotionCadenceIntensity(session: Session | null): number[] {
  if (!session?.motion) {
    return baseMotionCadenceIntensity;
  }

  const cadence = parseCadence(session.motion.cadence) ?? 30;
  const driveCount = session.motion.driveCount;
  const rhythmModifier =
    session.motion.rhythm === 'Consistent'
      ? 0.05
      : session.motion.rhythm === 'Variable'
        ? -0.02
        : -0.06;

  return baseMotionCadenceIntensity.map((value, index, source) => {
    const position = index / Math.max(1, source.length - 1);
    const arch = Math.sin(position * Math.PI);
    const cadenceInfluence = (cadence - 29) * 0.007;
    const driveInfluence = clamp((driveCount - 140) / 420, -0.08, 0.1);
    return clamp(value * 0.58 + arch * 0.28 + cadenceInfluence + driveInfluence + rhythmModifier, 0.18, 0.92);
  });
}

function buildPersonalRecords(sessionPool: Session[], recordsUnlocked = true): PersonalRecord[] {
  if (!recordsUnlocked) {
    return buildLockedPersonalRecords();
  }

  const recordMap = new Map(
    basePersonalRecords.map(record => [
      record.label,
      {
        label: record.label,
        value: 'Not enough data',
        date: 'Builds with use',
      },
    ]),
  );

  const updateRecord = (
    label: string,
    session: Session | null,
    numericValue: number | null,
    compare: (next: number, current: number) => boolean,
    format: (value: number) => string,
  ) => {
    if (!session || numericValue == null) {
      return;
    }

    const current = recordMap.get(label);
    const currentNumeric = current ? parseDurationToSeconds(current.value) ?? parseCadence(current.value) : null;

    if (currentNumeric == null || compare(numericValue, currentNumeric)) {
      recordMap.set(label, {
        label,
        value: format(numericValue),
        date: session.date,
      });
    }
  };

  const scoredSessions = sessionPool.filter(session => session.type !== 'nocturnal');
  const motionSessions = sessionPool.filter(session => session.type === 'motion');
  const nocturnalSessions = sessionPool.filter(session => session.type === 'nocturnal');

  const fastestBuildSession = [...scoredSessions]
    .map(session => ({ session, value: parseDurationToSeconds(session.metrics.buildSpeed) }))
    .filter(item => item.value != null)
    .sort((left, right) => (left.value ?? 0) - (right.value ?? 0))[0];
  updateRecord(
    'Fastest Build',
    fastestBuildSession?.session ?? null,
    fastestBuildSession?.value ?? null,
    (next, current) => next < current,
    value => formatMinuteSecondLabel(value),
  );

  const strongestStabilitySession = [...scoredSessions]
    .sort((left, right) => right.metrics.stability - left.metrics.stability)[0];
  updateRecord(
    'Strongest Stability',
    strongestStabilitySession ?? null,
    strongestStabilitySession?.metrics.stability ?? null,
    (next, current) => next > current,
    value => String(Math.round(value)),
  );

  const longestDurationSession = [...scoredSessions]
    .map(session => ({ session, value: parseDurationToSeconds(session.metrics.duration) }))
    .filter(item => item.value != null)
    .sort((left, right) => (right.value ?? 0) - (left.value ?? 0))[0];
  updateRecord(
    'Longest Duration',
    longestDurationSession?.session ?? null,
    longestDurationSession?.value ?? null,
    (next, current) => next > current,
    value => formatMinuteSecondLabel(value),
  );

  const fastestRecoverySession = [...scoredSessions]
    .map(session => ({ session, value: parseDurationToSeconds(session.metrics.recovery) }))
    .filter(item => item.value != null)
    .sort((left, right) => (left.value ?? 0) - (right.value ?? 0))[0];
  updateRecord(
    'Fastest Recovery',
    fastestRecoverySession?.session ?? null,
    fastestRecoverySession?.value ?? null,
    (next, current) => next < current,
    value => formatMinutesDecimal(value),
  );

  const fastestReboundSession = [...scoredSessions]
    .map(session => ({ session, value: parseDurationToSeconds(session.metrics.rebound) }))
    .filter(item => item.value != null)
    .sort((left, right) => (left.value ?? 0) - (right.value ?? 0))[0];
  updateRecord(
    'Fastest Rebound',
    fastestReboundSession?.session ?? null,
    fastestReboundSession?.value ?? null,
    (next, current) => next < current,
    value => formatMinutesDecimal(value),
  );

  const highestCadenceSession = [...motionSessions]
    .map(session => ({ session, value: parseCadence(session.motion?.cadence) }))
    .filter(item => item.value != null)
    .sort((left, right) => (right.value ?? 0) - (left.value ?? 0))[0];
  updateRecord(
    'Highest Cadence',
    highestCadenceSession?.session ?? null,
    highestCadenceSession?.value ?? null,
    (next, current) => next > current,
    value => `${Math.round(value)}/min`,
  );

  const highestDriveSession = [...motionSessions]
    .sort((left, right) => (right.motion?.driveCount ?? 0) - (left.motion?.driveCount ?? 0))[0];
  updateRecord(
    'Highest Drive Count',
    highestDriveSession ?? null,
    highestDriveSession?.motion?.driveCount ?? null,
    (next, current) => next > current,
    value => String(Math.round(value)),
  );

  const bestNocturnalSession = [...nocturnalSessions]
    .sort((left, right) => (right.nocturnalEvents ?? 0) - (left.nocturnalEvents ?? 0))[0];
  updateRecord(
    'Best Nocturnal Set',
    bestNocturnalSession ?? null,
    bestNocturnalSession?.nocturnalEvents ?? null,
    (next, current) => next > current,
    value => `${Math.round(value)} events`,
  );

  return basePersonalRecords.map(record => recordMap.get(record.label) ?? {
    label: record.label,
    value: 'Not enough data',
    date: 'Builds with use',
  });
}

function formatCaptureNightKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function countRecordedNocturnalNights(
  trendHistory: Array<{ timestamp: number; linePhase?: ArcLiveLinePhase }> = [],
  liveTelemetry: ArcLiveTelemetry | null,
  simulatedDate?: Date,
) {
  const overnightSampleCounts = new Map<string, number>();
  const overnightWindowEndMinutes = 8 * 60;
  const minimumSamplesForRecordedNight = 9;

  const registerTimestamp = (timestamp: number) => {
    const sampleDate = new Date(timestamp);
    const minuteOfDay = sampleDate.getHours() * 60 + sampleDate.getMinutes();

    if (minuteOfDay >= overnightWindowEndMinutes) {
      return;
    }

    const nightKey = formatCaptureNightKey(sampleDate);
    overnightSampleCounts.set(nightKey, (overnightSampleCounts.get(nightKey) ?? 0) + 1);
  };

  trendHistory.forEach(point => registerTimestamp(point.timestamp));

  if (liveTelemetry && simulatedDate) {
    registerTimestamp(simulatedDate.getTime());
  }

  return Array.from(overnightSampleCounts.values()).filter(sampleCount => sampleCount >= minimumSamplesForRecordedNight).length;
}

function buildCalibrationTracks(
  recordedSessions: Session[],
  liveTelemetry: ArcLiveTelemetry | null,
  appOpenSimulatedMinutes = 0,
  trendHistory: Array<{ timestamp: number; linePhase?: ArcLiveLinePhase }> = [],
  simulatedDate?: Date,
  autonomousPeakEvents: ArcAutonomousPeakEvent[] = [],
): ArcCalibrationTrack[] {
  const capturedSessionPeaks = recordedSessions.filter(session => session.type !== 'nocturnal');
  const peakEventsCaptured = clamp(capturedSessionPeaks.length + autonomousPeakEvents.length, 0, 10);
  const baselineDaysCaptured = clamp(Math.floor(appOpenSimulatedMinutes / (24 * 60)), 0, 7);
  const nocturnalSessionCount = new Set(
    recordedSessions
      .filter(session => session.type === 'nocturnal')
      .map(session => session.date),
  ).size;
  const nocturnalRecordedNightCount = countRecordedNocturnalNights(trendHistory, liveTelemetry, simulatedDate);
  const nocturnalNightsCaptured = clamp(Math.max(nocturnalSessionCount, nocturnalRecordedNightCount), 0, 7);
  const baselineAverage = clamp(
    Number(((liveTelemetry?.history.length ? average(liveTelemetry.history.slice(-28)) : RESTING_BASELINE) ?? RESTING_BASELINE).toFixed(1)),
    20.4,
    23.8,
  );
  const peakMarks = capturedSessionPeaks
    .filter((session): session is Session & { peakLevel: number } => typeof session.peakLevel === 'number')
    .map(session => session.peakLevel)
    .concat(autonomousPeakEvents.map(event => event.peakLevel));
  const peakAverage = peakMarks.length > 0 ? Number((average(peakMarks) ?? 100).toFixed(1)) : null;

  return [
    {
      key: 'peak',
      title: 'Peak Reference',
      targetLabel: '10 qualified events',
      supportingCopy: 'The strongest held mark from each qualified event is used to shape your personal peak reference.',
      current: peakEventsCaptured,
      target: 10,
      progress: peakEventsCaptured / 10,
      progressLabel: `${peakEventsCaptured} / 10 events captured`,
      statusTitle: peakEventsCaptured >= 10 ? 'Peak Reference Established' : 'Building Peak Reference',
      completionLine:
        peakEventsCaptured >= 10
          ? 'Peak reference established'
          : peakAverage != null
            ? `Current peak average ${peakAverage.toFixed(1)}%`
            : 'Collecting your first peak marks',
      established: peakEventsCaptured >= 10,
      referenceValue: peakAverage,
    },
    {
      key: 'baseline',
      title: 'Resting Baseline',
      targetLabel: '7 days of resting coverage',
      supportingCopy: 'Your resting expansion average defines your personal baseline. Lower reads classify as Reduced. Higher reads classify as Elevated.',
      current: baselineDaysCaptured,
      target: 7,
      progress: baselineDaysCaptured / 7,
      progressLabel:
        baselineDaysCaptured >= 7
          ? '7 / 7 complete'
          : baselineDaysCaptured === 0
            ? '0 / 7 complete'
            : `Day ${baselineDaysCaptured} of 7`,
      statusTitle: baselineDaysCaptured >= 7 ? 'Resting Baseline Established' : 'Building Resting Baseline',
      completionLine:
        baselineDaysCaptured >= 7
          ? 'Resting baseline established'
          : baselineDaysCaptured === 0
            ? 'First full day still in progress'
            : `Current baseline estimate ${baselineAverage.toFixed(1)}%`,
      established: baselineDaysCaptured >= 7,
      referenceValue: baselineAverage,
    },
    {
      key: 'nocturnal',
      title: 'Overnight Profile',
      targetLabel: '7 nights captured',
      supportingCopy: 'Overnight activity is used to build your overnight profile and improve future insight accuracy.',
      current: nocturnalNightsCaptured,
      target: 7,
      progress: nocturnalNightsCaptured / 7,
      progressLabel:
        nocturnalNightsCaptured >= 7
          ? '7 / 7 complete'
          : `${nocturnalNightsCaptured} / 7 nights captured`,
      statusTitle: nocturnalNightsCaptured >= 7 ? 'Overnight Profile Established' : 'Building Overnight Profile',
      completionLine:
        nocturnalNightsCaptured >= 7
          ? 'Overnight profile established'
          : 'Overnight intelligence unlocks with early nights',
      established: nocturnalNightsCaptured >= 7,
      referenceValue: nocturnalNightsCaptured,
    },
  ];
}

function buildThresholdModel(calibrationTracks: ArcCalibrationTrack[]): ArcThresholdModel {
  const peakTrack = calibrationTracks.find(track => track.key === 'peak');
  const baselineTrack = calibrationTracks.find(track => track.key === 'baseline');
  const nocturnalTrack = calibrationTracks.find(track => track.key === 'nocturnal');
  const baselineAverage = Number((baselineTrack?.referenceValue ?? RESTING_BASELINE).toFixed(1));
  const peakAverage = peakTrack?.referenceValue != null ? Number(peakTrack.referenceValue.toFixed(1)) : null;
  const peakValue = clamp(peakAverage ?? 100, 92, 102);
  const baselineValue = clamp(baselineAverage, 21.2, 23.8);
  const reducedValue = clamp(baselineValue - 2.5, 19.2, 21.1);
  const elevatedValue = clamp(baselineValue + 3.8, 26, 35);
  const activeEntryValue = clamp(peakValue * 0.65, 60, 72);

  return {
    reduced: Number(reducedValue.toFixed(1)),
    baseline: Number(baselineValue.toFixed(1)),
    elevated: Number(elevatedValue.toFixed(1)),
    activeEntry: Number(activeEntryValue.toFixed(1)),
    peak: Number(peakValue.toFixed(1)),
    record: Number(clamp(peakValue + 7, peakValue + 4, 110).toFixed(1)),
    baselineReady: Boolean(baselineTrack?.established),
    peakReady: Boolean(peakTrack?.established),
    nocturnalReady: Boolean(nocturnalTrack?.established),
    baselineAverage: Number(baselineValue.toFixed(1)),
    peakAverage: peakAverage != null ? Number(peakAverage.toFixed(1)) : null,
  };
}

function buildCalibrationStatus(calibrationTracks: ArcCalibrationTrack[]): ArcCalibrationStatus {
  const peakTrack = calibrationTracks.find(track => track.key === 'peak')!;
  const baselineTrack = calibrationTracks.find(track => track.key === 'baseline')!;
  const nocturnalTrack = calibrationTracks.find(track => track.key === 'nocturnal')!;
  const progress = clamp((peakTrack.progress + baselineTrack.progress + nocturnalTrack.progress) / 3, 0, 1);

  if (peakTrack.established && baselineTrack.established && nocturnalTrack.established) {
    return {
      stage: 'established',
      progress: 1,
      title: 'Profile established',
      summary: 'Your personal references are established and deeper intelligence is now available.',
      detail: 'Peak reference, resting baseline, and overnight profile are now in place. The system can use those references to unlock broader comparison, readiness, and longer-range insight.',
      nextUnlock: 'Edge Score, lifetime comparisons, and overnight intelligence are now live.',
      progressLabel: 'Profile established',
    };
  }

  if (peakTrack.current > 0 || baselineTrack.current > 0 || nocturnalTrack.current > 0) {
    return {
      stage: 'learning',
      progress,
      title: 'Profile forming',
      summary: 'Cinder is learning your peak range, resting baseline, and overnight profile together.',
      detail: 'Each early capture makes the system more personal, precise, and believable. Confidence grows as those three profile layers settle into place.',
      nextUnlock:
        peakTrack.current === 0
          ? 'Your first captured event begins building your peak reference.'
          : !baselineTrack.established
            ? 'More resting-state time is needed before Reduced, Baseline, and Elevated states are fully trusted.'
            : 'Keep collecting qualified events and overnight coverage to deepen the profile.',
      progressLabel: 'Profile forming',
    };
  }

  return {
    stage: 'initial',
    progress,
    title: 'Starting profile formation',
    summary: 'Your device is beginning to learn your peak range, resting baseline, and overnight profile.',
    detail: 'Live signal is available now. More precise thresholds and deeper intelligence unlock as profile formation progresses.',
    nextUnlock: 'Capture your first event to begin building your personal peak reference.',
    progressLabel: 'Profile forming',
  };
}

function buildFeatureAvailability(calibrationTracks: ArcCalibrationTrack[], totalSessions: number): ArcFeatureAvailability {
  const peakTrack = calibrationTracks.find(track => track.key === 'peak')!;
  const baselineTrack = calibrationTracks.find(track => track.key === 'baseline')!;
  const nocturnalTrack = calibrationTracks.find(track => track.key === 'nocturnal')!;
  const recordsUnlocked = baselineTrack.established && peakTrack.established && nocturnalTrack.established;

  return {
    edgeScore: recordsUnlocked,
    buildInsights: peakTrack.current >= 1,
    activeInsights: peakTrack.current >= 1,
    recoveryInsights: peakTrack.current >= 1,
    sessionArchive: totalSessions >= 1,
    lifetime: baselineTrack.current >= 4 && peakTrack.current >= 2,
    milestones: true,
    nocturnal: nocturnalTrack.established,
    personalBests: recordsUnlocked,
    advancedLive: baselineTrack.current >= 3,
  };
}

interface ArcEdgePersonalProfile {
  baselineMean: number;
  baselineLow: number;
  baselineHigh: number;
  elevatedRestingHigh: number;
  activeEntry: number;
  averageMaxExpansion: number;
  averageHoldQuality: number;
  averageRecoveryQuality: number;
  averageBuildSeconds: number;
  averageDurationSeconds: number;
  averageRecoverySeconds: number;
  averageReboundSeconds: number;
  calibrationConfidence: number;
}

interface ArcEdgeInputs {
  currentBaseline: number;
  baselineStability: number;
  recentDrift: number;
  currentStateBias: number;
  recentBuildSpeed: number;
  recentPeakQuality: number;
  recentHoldQuality: number;
  recentHoldDuration: number;
  recentRecoveryQuality: number;
  recentReboundQuality: number;
  recentConsistency: number;
  recentVolatility: number;
  nocturnalSupport: number;
  baselineConfidence: number;
  eventConfidence: number;
  nocturnalConfidence: number;
  longitudinalCoverageConfidence: number;
  imuContextSupport: number;
  modelConfidence: number;
}

interface ArcEdgeSessionSnapshot {
  total: number;
  build: number;
  peak: number;
  hold: number;
  duration: number;
  recovery: number;
  rebound: number;
  motionSupport: number;
}

function remapClamped(
  value: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number,
) {
  if (inputMin === inputMax) {
    return (outputMin + outputMax) / 2;
  }

  const progress = clamp((value - inputMin) / (inputMax - inputMin), 0, 1);
  return outputMin + (outputMax - outputMin) * progress;
}

function scoreHigherBetter(
  value: number | null,
  low: number,
  high: number,
  floor = 44,
  ceiling = 96,
) {
  if (value == null || !Number.isFinite(value)) {
    return (floor + ceiling) / 2;
  }

  return remapClamped(value, low, high, floor, ceiling);
}

function scoreLowerBetter(
  value: number | null,
  good: number,
  bad: number,
  floor = 44,
  ceiling = 94,
) {
  if (value == null || !Number.isFinite(value)) {
    return (floor + ceiling) / 2;
  }

  return remapClamped(value, good, bad, ceiling, floor);
}

function averageOr(numbers: number[], fallback: number) {
  return average(numbers) ?? fallback;
}

function getDistinctTimelineDayCount(
  trendHistory: Array<{ timestamp: number }>,
  simulatedDate?: Date,
) {
  const dayKeys = new Set(trendHistory.map(point => formatCaptureNightKey(new Date(point.timestamp))));

  if (simulatedDate) {
    dayKeys.add(formatCaptureNightKey(simulatedDate));
  }

  return dayKeys.size;
}

function getNocturnalNightPeaks(
  trendHistory: Array<{ timestamp: number; value: number; linePhase?: ArcLiveLinePhase }>,
) {
  const nocturnalPeakMap = new Map<string, number>();

  trendHistory.forEach(point => {
    if (!point.linePhase || point.linePhase === 'default') {
      return;
    }

    const nightKey = formatCaptureNightKey(new Date(point.timestamp));
    const previousPeak = nocturnalPeakMap.get(nightKey) ?? 0;
    nocturnalPeakMap.set(nightKey, Math.max(previousPeak, point.value));
  });

  return Array.from(nocturnalPeakMap.values());
}

function buildDailyRestingMeans(
  trendHistory: Array<{ timestamp: number; value: number; linePhase?: ArcLiveLinePhase }>,
  activeEntry: number,
  liveTelemetry: ArcLiveTelemetry | null,
  simulatedDate?: Date,
) {
  const grouped = new Map<string, number[]>();

  trendHistory.forEach(point => {
    if ((point.linePhase ?? 'default') !== 'default' || point.value >= activeEntry) {
      return;
    }

    const dayKey = formatCaptureNightKey(new Date(point.timestamp));
    const existing = grouped.get(dayKey) ?? [];
    existing.push(point.value);
    grouped.set(dayKey, existing);
  });

  if (simulatedDate && liveTelemetry?.history.length) {
    const dayKey = formatCaptureNightKey(simulatedDate);
    const liveRestingValues = liveTelemetry.history.filter((value, index) => {
      const linePhase = liveTelemetry.historyLinePhases[index] ?? 'default';
      return linePhase === 'default' && value < activeEntry;
    });

    if (liveRestingValues.length > 0) {
      const existing = grouped.get(dayKey) ?? [];
      grouped.set(dayKey, [...existing, ...liveRestingValues.slice(-48)]);
    }
  }

  return Array.from(grouped.values())
    .map(values => average(values))
    .filter((value): value is number => value != null);
}

interface ArcTimedValueSample {
  timestamp: number;
  value: number;
  weightMultiplier?: number;
}

interface EdgeWeightedBucket {
  startDaysAgo: number;
  endDaysAgo: number;
  weight: number;
}

interface EdgeBucketedValues<T> {
  bucket: EdgeWeightedBucket;
  values: T[];
}

const EDGE_RECENCY_BUCKETS: EdgeWeightedBucket[] = [
  { startDaysAgo: 0, endDaysAgo: 7, weight: 0.5 },
  { startDaysAgo: 8, endDaysAgo: 14, weight: 0.3 },
  { startDaysAgo: 15, endDaysAgo: 30, weight: 0.2 },
];

function getEdgeAgeDays(timestamp: number, nowTimestamp: number) {
  const elapsedMs = nowTimestamp - timestamp;

  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) {
    return null;
  }

  return Math.floor(elapsedMs / (24 * 60 * 60 * 1000));
}

function getBucketedValues<T extends { timestamp: number }>(
  values: T[],
  nowTimestamp: number,
  buckets: EdgeWeightedBucket[] = EDGE_RECENCY_BUCKETS,
): EdgeBucketedValues<T>[] {
  return buckets.map(bucket => ({
    bucket,
    values: values.filter(entry => {
      const ageDays = getEdgeAgeDays(entry.timestamp, nowTimestamp);

      return ageDays != null && ageDays >= bucket.startDaysAgo && ageDays <= bucket.endDaysAgo;
    }),
  }));
}

function averageBucketValues(values: Array<{ value: number }>) {
  const numericValues = values
    .map(entry => entry.value)
    .filter(value => Number.isFinite(value));

  return numericValues.length > 0 ? average(numericValues) : null;
}

function weightedAverageFromBuckets(
  bucketedValues: Array<{ bucket: EdgeWeightedBucket; values: Array<{ value: number }> }>,
  fallback = 0,
) {
  let weightedSum = 0;
  let usedWeight = 0;

  bucketedValues.forEach(({ bucket, values }) => {
    const bucketAverage = averageBucketValues(values);

    if (bucketAverage == null) {
      return;
    }

    weightedSum += bucketAverage * bucket.weight;
    usedWeight += bucket.weight;
  });

  return usedWeight > 0 ? weightedSum / usedWeight : fallback;
}

function weightedDerivedValueFromBuckets<T>(
  bucketedValues: EdgeBucketedValues<T>[],
  derive: (values: T[]) => number | null,
  fallback = 0,
) {
  let weightedSum = 0;
  let usedWeight = 0;

  bucketedValues.forEach(({ bucket, values }) => {
    if (!values.length) {
      return;
    }

    const derivedValue = derive(values);

    if (derivedValue == null || !Number.isFinite(derivedValue)) {
      return;
    }

    weightedSum += derivedValue * bucket.weight;
    usedWeight += bucket.weight;
  });

  return usedWeight > 0 ? weightedSum / usedWeight : fallback;
}

function buildDailyRestingSamples(
  trendHistory: Array<{ timestamp: number; value: number; linePhase?: ArcLiveLinePhase }>,
  activeEntry: number,
  liveTelemetry: ArcLiveTelemetry | null,
  simulatedDate?: Date,
) {
  const grouped = new Map<string, { timestamp: number; values: number[] }>();

  trendHistory.forEach(point => {
    if ((point.linePhase ?? 'default') !== 'default' || point.value >= activeEntry) {
      return;
    }

    const dayKey = formatCaptureNightKey(new Date(point.timestamp));
    const existing = grouped.get(dayKey) ?? { timestamp: point.timestamp, values: [] };
    existing.timestamp = Math.max(existing.timestamp, point.timestamp);
    existing.values.push(point.value);
    grouped.set(dayKey, existing);
  });

  if (simulatedDate && liveTelemetry?.history.length) {
    const dayKey = formatCaptureNightKey(simulatedDate);
    const liveRestingValues = liveTelemetry.history.filter((value, index) => {
      const linePhase = liveTelemetry.historyLinePhases[index] ?? 'default';
      return linePhase === 'default' && value < activeEntry;
    });

    if (liveRestingValues.length > 0) {
      const existing = grouped.get(dayKey) ?? { timestamp: simulatedDate.getTime(), values: [] };
      existing.timestamp = Math.max(existing.timestamp, simulatedDate.getTime());
      existing.values.push(...liveRestingValues.slice(-48));
      grouped.set(dayKey, existing);
    }
  }

  return Array.from(grouped.values())
    .map(sample => ({
      timestamp: sample.timestamp,
      value: average(sample.values) ?? 0,
    }))
    .filter(sample => Number.isFinite(sample.value))
    .sort((left, right) => right.timestamp - left.timestamp);
}

function getEdgeRecencyBucketWeight(timestamp: number, nowTimestamp: number) {
  if (!Number.isFinite(timestamp)) {
    return 0;
  }

  const elapsedMs = nowTimestamp - timestamp;

  if (elapsedMs < 0 || elapsedMs > 30 * 24 * 60 * 60 * 1000) {
    return 0;
  }

  if (elapsedMs <= 7 * 24 * 60 * 60 * 1000) {
    return 0.5;
  }

  if (elapsedMs <= 14 * 24 * 60 * 60 * 1000) {
    return 0.3;
  }

  return 0.2;
}

function getTimedSampleWeight(sample: ArcTimedValueSample, nowTimestamp: number) {
  return getEdgeRecencyBucketWeight(sample.timestamp, nowTimestamp) * (sample.weightMultiplier ?? 1);
}

function getTimedWeightedAverage(samples: ArcTimedValueSample[], nowTimestamp: number) {
  let totalWeight = 0;
  let weightedTotal = 0;

  samples.forEach(sample => {
    const weight = getTimedSampleWeight(sample, nowTimestamp);

    if (weight <= 0 || !Number.isFinite(sample.value)) {
      return;
    }

    totalWeight += weight;
    weightedTotal += sample.value * weight;
  });

  return totalWeight > 0 ? weightedTotal / totalWeight : null;
}

function getTimedWeightedStandardDeviation(samples: ArcTimedValueSample[], nowTimestamp: number) {
  const mean = getTimedWeightedAverage(samples, nowTimestamp);

  if (mean == null) {
    return 0;
  }

  let totalWeight = 0;
  let weightedVariance = 0;

  samples.forEach(sample => {
    const weight = getTimedSampleWeight(sample, nowTimestamp);

    if (weight <= 0 || !Number.isFinite(sample.value)) {
      return;
    }

    totalWeight += weight;
    weightedVariance += Math.pow(sample.value - mean, 2) * weight;
  });

  return totalWeight > 0 ? Math.sqrt(weightedVariance / totalWeight) : 0;
}

function getTimedWeightedShare(
  samples: ArcTimedValueSample[],
  nowTimestamp: number,
  predicate: (value: number) => boolean,
) {
  let totalWeight = 0;
  let matchingWeight = 0;

  samples.forEach(sample => {
    const weight = getTimedSampleWeight(sample, nowTimestamp);

    if (weight <= 0 || !Number.isFinite(sample.value)) {
      return;
    }

    totalWeight += weight;

    if (predicate(sample.value)) {
      matchingWeight += weight;
    }
  });

  return totalWeight > 0 ? matchingWeight / totalWeight : null;
}

function getTimedWeightedMax(samples: ArcTimedValueSample[], nowTimestamp: number) {
  let maxValue: number | null = null;

  samples.forEach(sample => {
    if (getTimedSampleWeight(sample, nowTimestamp) <= 0 || !Number.isFinite(sample.value)) {
      return;
    }

    maxValue = maxValue == null ? sample.value : Math.max(maxValue, sample.value);
  });

  return maxValue;
}

function scorePlateauRange(
  value: number | null,
  idealLow: number,
  idealHigh: number,
  hardLow: number,
  hardHigh: number,
  floor = 44,
  ceiling = 94,
) {
  if (value == null || !Number.isFinite(value)) {
    return (floor + ceiling) / 2;
  }

  if (value < idealLow) {
    return remapClamped(value, hardLow, idealLow, floor, ceiling);
  }

  if (value <= idealHigh) {
    return ceiling;
  }

  return remapClamped(value, idealHigh, hardHigh, ceiling, floor);
}

function curveEdgeCompositeScore(rawScore: number) {
  if (rawScore <= 35) {
    return remapClamped(rawScore, 18, 35, 12, 34);
  }

  if (rawScore <= 50) {
    return remapClamped(rawScore, 35, 50, 35, 50);
  }

  if (rawScore <= 65) {
    return remapClamped(rawScore, 50, 65, 50, 64);
  }

  if (rawScore <= 80) {
    return remapClamped(rawScore, 65, 80, 65, 79);
  }

  if (rawScore <= 90) {
    return remapClamped(rawScore, 80, 90, 80, 89);
  }

  return remapClamped(rawScore, 90, 98, 90, 100);
}

function moderateEdgeCompositeScore(score: number, confidence: number, maturityLabel: string) {
  const moderationCenter = 56;
  const expressionFactor = 0.52 + clamp(confidence, 0, 100) / 100 * 0.48;
  let moderated = moderationCenter + (score - moderationCenter) * expressionFactor;

  if (maturityLabel === 'Building') {
    moderated = Math.min(moderated, 78);
  } else if (maturityLabel === 'Early calibrated') {
    moderated = Math.min(moderated, 89);
  }

  return clamp(moderated, 0, 100);
}

function getEdgeSessionMotionSupport(session: Session) {
  if (!session.motion) {
    return 72;
  }

  const cadence = parseCadence(session.motion.cadence) ?? 30;
  const cadenceScore = scoreHigherBetter(cadence, 24, 42, 60, 92);
  const driveScore = scoreHigherBetter(session.motion.driveCount, 90, 260, 58, 90);
  const rhythmScore =
    session.motion.rhythm === 'Consistent'
      ? 92
      : session.motion.rhythm === 'Variable'
        ? 79
        : 64;

  return clamp(rhythmScore * 0.5 + cadenceScore * 0.24 + driveScore * 0.26, 56, 94);
}

function buildEdgePersonalProfile({
  calibration,
  thresholdModel,
  buildSamples,
  durationSamples,
  recoverySamples,
  reboundSamples,
  stabilitySamples,
  peakMarks,
}: {
  calibration: ArcCalibrationStatus;
  thresholdModel: ArcThresholdModel;
  buildSamples: number[];
  durationSamples: number[];
  recoverySamples: number[];
  reboundSamples: number[];
  stabilitySamples: number[];
  peakMarks: number[];
}): ArcEdgePersonalProfile {
  const averageMaxExpansion = clamp(
    averageOr(peakMarks, thresholdModel.peakAverage ?? thresholdModel.peak),
    88,
    108,
  );
  const baselineMean = clamp(thresholdModel.baselineAverage, 20, 25);
  const baselineLow = clamp(thresholdModel.reduced, 14, 21);
  const baselineHigh = clamp(thresholdModel.baseline, 21, 25.5);
  const elevatedRestingHigh = clamp(Math.min(thresholdModel.activeEntry - 8, 38), 30, 38);
  const averageRecoverySeconds = averageOr(recoverySamples, 280);
  const averageBuildSeconds = averageOr(buildSamples, 165);
  const averageDurationSeconds = averageOr(durationSamples, 380);
  const averageReboundSeconds = averageOr(reboundSamples, 215);

  return {
    baselineMean,
    baselineLow,
    baselineHigh,
    elevatedRestingHigh,
    activeEntry: thresholdModel.activeEntry,
    averageMaxExpansion,
    averageHoldQuality: clamp(averageOr(stabilitySamples, 68), 42, 92),
    averageRecoveryQuality: scoreLowerBetter(averageRecoverySeconds, 150, 460, 48, 92),
    averageBuildSeconds,
    averageDurationSeconds,
    averageRecoverySeconds,
    averageReboundSeconds,
    calibrationConfidence: clamp(calibration.progress * 100, 0, 100),
  };
}

const SESSION_MONTH_LOOKUP: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

function resolveSessionTimestamp(session: Session, anchorDate?: Date): number | null {
  const dateMatch = session.date.match(/^([A-Za-z]+)\s+(\d{1,2})$/);
  const timeMatch = session.time.match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);

  if (!dateMatch || !timeMatch) {
    return null;
  }

  const monthKey = dateMatch[1]!.slice(0, 3).toLowerCase();
  const monthIndex = SESSION_MONTH_LOOKUP[monthKey];

  if (monthIndex == null) {
    return null;
  }

  const day = Number(dateMatch[2]);
  const hour12 = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  const meridiem = timeMatch[3]!.toUpperCase();
  const normalizedHour = meridiem === 'PM' ? (hour12 % 12) + 12 : hour12 % 12;
  const anchor = anchorDate ?? new Date();
  let year = anchor.getFullYear();
  let resolved = new Date(year, monthIndex, day, normalizedHour, minute, 0, 0);

  if (resolved.getTime() - anchor.getTime() > 36 * 60 * 60 * 1000) {
    resolved = new Date(year - 1, monthIndex, day, normalizedHour, minute, 0, 0);
  }

  return resolved.getTime();
}

function buildEdgeSessionSnapshot(session: Session, profile: ArcEdgePersonalProfile): ArcEdgeSessionSnapshot {
  const buildSeconds = parseDurationToSeconds(session.metrics.buildSpeed);
  const durationSeconds = parseDurationToSeconds(session.metrics.duration);
  const recoverySeconds = parseDurationToSeconds(session.metrics.recovery);
  const reboundSeconds = parseDurationToSeconds(session.metrics.rebound);
  const buildEfficiencyScore = session.analysis?.buildEfficiencyScore ?? null;
  const peakIntegrityScore = session.analysis?.peakIntegrityScore ?? null;
  const holdEfficiencyScore = session.analysis?.holdEfficiencyScore ?? null;
  const recoveryEfficiencyScore = session.analysis?.recoveryEfficiencyScore ?? null;
  const sessionQualityScore = session.analysis?.sessionQualityScore ?? null;
  const peakLevel = session.peakLevel ?? profile.averageMaxExpansion * 0.92;
  const peakRatio = peakLevel / Math.max(profile.averageMaxExpansion, 1);
  const motionSupport = getEdgeSessionMotionSupport(session);

  const buildBase = scoreLowerBetter(
    buildSeconds,
    Math.max(55, profile.averageBuildSeconds * 0.78),
    Math.max(105, profile.averageBuildSeconds * 1.28),
    48,
    95,
  );
  const build = clamp(buildBase * 0.8 + (buildEfficiencyScore ?? buildBase) * 0.2, 48, 96);
  const peakBase = scoreHigherBetter(peakRatio, 0.84, 1.06, 48, 99);
  const peak = clamp(peakBase * 0.82 + (peakIntegrityScore ?? peakBase) * 0.18, 48, 99);
  const holdBase = clamp(
    scoreHigherBetter(
      session.metrics.stability,
      Math.max(42, profile.averageHoldQuality - 12),
      Math.min(96, profile.averageHoldQuality + 9),
      48,
      95,
    ) * 0.62 +
      clamp(48 + session.metrics.stability * 0.47, 48, 96) * 0.38,
    48,
    96,
  );
  const hold = clamp(
    holdBase * 0.76 +
      (holdEfficiencyScore ?? holdBase) * 0.16 +
      (session.analysis?.controlScore ?? holdBase) * 0.08,
    48,
    97,
  );
  const durationBase = clamp(
    scoreHigherBetter(
      durationSeconds,
      Math.max(150, profile.averageDurationSeconds * 0.72),
      Math.max(360, profile.averageDurationSeconds * 1.22),
      48,
      94,
    ) * 0.7 +
      scoreHigherBetter(durationSeconds, 180, 720, 50, 92) * 0.3,
    48,
    94,
  );
  const duration = clamp(
    durationBase * 0.86 + (sessionQualityScore ?? durationBase) * 0.14,
    48,
    95,
  );
  const recoveryBase = clamp(
    scoreLowerBetter(
      recoverySeconds,
      Math.max(120, profile.averageRecoverySeconds * 0.8),
      Math.max(220, profile.averageRecoverySeconds * 1.28),
      48,
      94,
    ) * 0.62 +
      scoreLowerBetter(recoverySeconds, 150, 460, 50, 92) * 0.38,
    48,
    94,
  );
  const recovery = clamp(
    recoveryBase * 0.8 + (recoveryEfficiencyScore ?? recoveryBase) * 0.2,
    48,
    95,
  );
  const rebound =
    reboundSeconds == null
      ? 72
      : clamp(
          scoreLowerBetter(
            reboundSeconds,
            Math.max(90, profile.averageReboundSeconds * 0.78),
            Math.max(180, profile.averageReboundSeconds * 1.3),
            48,
            94,
          ) * 0.6 +
            scoreLowerBetter(reboundSeconds, 100, 340, 50, 92) * 0.4,
          48,
          94,
        );

  return {
    build,
    peak,
    hold,
    duration,
    recovery,
    rebound,
    motionSupport,
    total: clamp(
      build * 0.16 +
        peak * 0.31 +
        hold * 0.2 +
        duration * 0.12 +
        recovery * 0.13 +
        rebound * 0.04 +
        motionSupport * 0.04 +
        (sessionQualityScore ?? hold) * 0.02,
      46,
      98,
    ),
  };
}

function computeEdgeReadiness(inputs: ArcEdgeInputs, profile: ArcEdgePersonalProfile) {
  const baselinePositionScore =
    inputs.currentBaseline < profile.baselineLow
      ? scoreHigherBetter(inputs.currentBaseline, 12, profile.baselineLow, 40, 72)
      : inputs.currentBaseline <= profile.baselineHigh
        ? scoreHigherBetter(inputs.currentBaseline, profile.baselineLow, profile.baselineHigh, 74, 84)
        : inputs.currentBaseline <= profile.elevatedRestingHigh
          ? scoreHigherBetter(inputs.currentBaseline, profile.baselineHigh, profile.elevatedRestingHigh, 84, 91)
          : scoreHigherBetter(inputs.currentBaseline, profile.elevatedRestingHigh, profile.activeEntry, 78, 88);
  const baselineStabilityScore = scoreLowerBetter(inputs.baselineStability, 1.4, 5.8, 48, 93);
  const recentDriftScore = clamp(74 + inputs.recentDrift * 4.2, 48, 92);
  const score = clamp(
    baselinePositionScore * 0.34 +
      baselineStabilityScore * 0.28 +
      recentDriftScore * 0.18 +
      inputs.currentStateBias * 0.2,
    40,
    95,
  );

  return {
    score,
    breakdown: {
      baselinePositionScore: Math.round(baselinePositionScore),
      baselineStabilityScore: Math.round(baselineStabilityScore),
      recentDriftScore: Math.round(recentDriftScore),
      currentStateBiasScore: Math.round(inputs.currentStateBias),
    },
  };
}

function computeEdgePerformance(inputs: ArcEdgeInputs) {
  const performanceCore =
    inputs.recentBuildSpeed * 0.16 +
    inputs.recentPeakQuality * 0.3 +
    inputs.recentHoldQuality * 0.18 +
    inputs.recentHoldDuration * 0.12 +
    inputs.recentRecoveryQuality * 0.12 +
    inputs.recentReboundQuality * 0.05 +
    inputs.imuContextSupport * 0.07;
  const score = clamp(performanceCore * 0.88 + inputs.nocturnalSupport * 0.12, 44, 97);

  return {
    score,
    breakdown: {
      buildSpeedScore: Math.round(inputs.recentBuildSpeed),
      peakFullnessScore: Math.round(inputs.recentPeakQuality),
      holdQualityScore: Math.round(inputs.recentHoldQuality),
      holdDurationScore: Math.round(inputs.recentHoldDuration),
      recoveryQualityScore: Math.round(inputs.recentRecoveryQuality),
      reboundQualityScore: Math.round(inputs.recentReboundQuality),
    },
  };
}

function computeEdgeStability(inputs: ArcEdgeInputs) {
  const eventConsistencyScore = scoreLowerBetter(inputs.recentConsistency, 3.5, 15.5, 48, 95);
  const dailyBaselineConsistencyScore = scoreLowerBetter(inputs.recentVolatility, 1.1, 4.8, 48, 94);
  const performanceRepeatabilityScore = clamp(50 + inputs.recentPeakQuality * 0.42 + inputs.recentHoldQuality * 0.18 - inputs.recentConsistency * 1.3, 46, 95);
  const volatilityControlScore = clamp(
    scoreLowerBetter(inputs.baselineStability, 1.5, 5.6, 48, 92) * 0.55 +
      scoreHigherBetter(inputs.recentRecoveryQuality, 58, 92, 48, 92) * 0.45,
    48,
    92,
  );
  const score = clamp(
    eventConsistencyScore * 0.32 +
      dailyBaselineConsistencyScore * 0.24 +
      performanceRepeatabilityScore * 0.28 +
      volatilityControlScore * 0.16,
    42,
    96,
  );

  return {
    score,
    breakdown: {
      eventConsistencyScore: Math.round(eventConsistencyScore),
      dailyBaselineConsistencyScore: Math.round(dailyBaselineConsistencyScore),
      performanceRepeatabilityScore: Math.round(performanceRepeatabilityScore),
      volatilityControlScore: Math.round(volatilityControlScore),
    },
  };
}

function computeEdgeConfidence(profile: ArcEdgePersonalProfile, inputs: ArcEdgeInputs) {
  const overallModelConfidence =
    inputs.baselineConfidence * 0.3 +
    inputs.eventConfidence * 0.3 +
    inputs.nocturnalConfidence * 0.18 +
    inputs.longitudinalCoverageConfidence * 0.22;
  const score = clamp(overallModelConfidence * 0.84 + profile.calibrationConfidence * 0.16, 18, 100);

  return {
    score,
    breakdown: {
      baselineConfidence: Math.round(inputs.baselineConfidence),
      eventConfidence: Math.round(inputs.eventConfidence),
      nocturnalConfidence: Math.round(inputs.nocturnalConfidence),
      longitudinalCoverageConfidence: Math.round(inputs.longitudinalCoverageConfidence),
      overallModelConfidence: Math.round(overallModelConfidence),
    },
  };
}

function getEdgeConfidenceLabel(confidence: number) {
  if (confidence >= 86) {
    return 'High confidence';
  }

  if (confidence >= 72) {
    return 'Strong confidence';
  }

  if (confidence >= 58) {
    return 'Growing confidence';
  }

  return 'Foundational confidence';
}

function getEdgeTrendDirection({
  recentPerformanceScores,
  recentPeakLevels,
  recentDrift,
  averageMaxExpansion,
}: {
  recentPerformanceScores: number[];
  recentPeakLevels: number[];
  recentDrift: number;
  averageMaxExpansion: number;
}): ArcEdgeTrendDirection {
  const currentPerformanceWindow = average(recentPerformanceScores.slice(0, 4));
  const priorPerformanceWindow = average(recentPerformanceScores.slice(4, 8));
  const performanceDelta =
    currentPerformanceWindow != null && priorPerformanceWindow != null
      ? currentPerformanceWindow - priorPerformanceWindow
      : 0;
  const currentPeakWindow = average(recentPeakLevels.slice(0, 4));
  const priorPeakWindow = average(recentPeakLevels.slice(4, 8));
  const peakDelta =
    currentPeakWindow != null && priorPeakWindow != null
      ? ((currentPeakWindow - priorPeakWindow) / Math.max(averageMaxExpansion, 1)) * 30
      : 0;
  const compositeDelta = performanceDelta * 0.68 + peakDelta * 0.14 + recentDrift * 3.2 * 0.18;

  if (compositeDelta >= 3.5) {
    return 'rising';
  }

  if (compositeDelta <= -3.5) {
    return 'falling';
  }

  return 'stable';
}

function getEdgeState({
  unlocked,
  unlockProgress,
  readiness,
  performance,
  stability,
  confidence,
  trendDirection,
}: {
  unlocked: boolean;
  unlockProgress: number;
  readiness: number;
  performance: number;
  stability: number;
  confidence: number;
  trendDirection: ArcEdgeTrendDirection;
}): ArcEdgeScoreState {
  if (!unlocked) {
    return unlockProgress >= 0.72 ? 'early_calibrated' : 'building';
  }

  if (confidence < 70) {
    return 'early_calibrated';
  }

  if (readiness < 58 || performance < 58) {
    return 'reduced';
  }

  if (stability < 61) {
    return 'volatile';
  }

  if (confidence >= 82 && readiness >= 78 && performance >= 78 && stability >= 77) {
    return 'stable';
  }

  if (trendDirection === 'rising' && readiness >= 72 && performance >= 74) {
    return 'strengthening';
  }

  return 'live';
}

function computeEdgeScoreSnapshot({
  calibrationTracks,
  thresholdModel,
  scoredSessions,
  motionSessions,
  liveTelemetry,
  trendHistory,
  autonomousPeakEvents,
  wearStreakDays,
  simulatedDate,
  profile,
}: {
  calibrationTracks: ArcCalibrationTrack[];
  thresholdModel: ArcThresholdModel;
  scoredSessions: Session[];
  motionSessions: Session[];
  liveTelemetry: ArcLiveTelemetry | null;
  trendHistory: Array<{ timestamp: number; value: number; linePhase?: ArcLiveLinePhase }>;
  autonomousPeakEvents: ArcAutonomousPeakEvent[];
  wearStreakDays: number;
  simulatedDate?: Date;
  profile: ArcEdgePersonalProfile;
}) {
  const sortedTrendHistory = [...trendHistory].sort((left, right) => left.timestamp - right.timestamp);
  const nowTimestamp =
    simulatedDate?.getTime() ?? sortedTrendHistory[sortedTrendHistory.length - 1]?.timestamp ?? Date.now();
  const restingTrendPoints = sortedTrendHistory.filter(
    point => (point.linePhase ?? 'default') === 'default' && point.value < thresholdModel.activeEntry,
  );
  const liveRestingValues =
    liveTelemetry?.history.filter((value, index) => {
      const linePhase = liveTelemetry.historyLinePhases[index] ?? 'default';
      return linePhase === 'default' && value < thresholdModel.activeEntry;
    }) ?? [];
  const restingSamples = restingTrendPoints.map(point => point.value).concat(liveRestingValues.slice(-64));
  const recentRestingSamples = restingTrendPoints
    .filter(point => point.timestamp >= nowTimestamp - 4 * 60 * 60 * 1000)
    .map(point => point.value)
    .concat(liveRestingValues.slice(-24));
  const priorRestingSamples = restingTrendPoints
    .filter(
      point =>
        point.timestamp >= nowTimestamp - 8 * 60 * 60 * 1000 &&
        point.timestamp < nowTimestamp - 4 * 60 * 60 * 1000,
    )
    .map(point => point.value);
  const currentBaseline =
    average(recentRestingSamples.slice(-24)) ?? average(restingSamples.slice(-32)) ?? profile.baselineMean;
  const baselineStability = standardDeviation(
    recentRestingSamples.length > 0 ? recentRestingSamples : restingSamples.slice(-60),
  );
  const recentDrift =
    currentBaseline -
    (average(priorRestingSamples.slice(-24)) ?? average(restingSamples.slice(-64)) ?? profile.baselineMean);
  const liveCurrentValue = liveTelemetry?.currentValue ?? currentBaseline;
  const currentStateBias =
    liveCurrentValue < profile.baselineLow - 1
      ? 52
      : liveCurrentValue < profile.baselineLow
        ? 60
        : liveCurrentValue <= profile.baselineHigh
          ? 78
          : liveCurrentValue <= profile.elevatedRestingHigh
            ? 86
            : liveCurrentValue < profile.activeEntry
              ? 82
              : 80;

  const recentScoredSessions = scoredSessions.slice(0, 12);
  const sessionSnapshots = recentScoredSessions.map(session => buildEdgeSessionSnapshot(session, profile));
  const recentPerformanceScores = sessionSnapshots.map(snapshot => snapshot.total);
  const recentMotionSupport =
    average(sessionSnapshots.map(snapshot => snapshot.motionSupport)) ??
    average(motionSessions.slice(0, 6).map(getEdgeSessionMotionSupport)) ??
    72;
  const recentBuildSpeed = average(sessionSnapshots.map(snapshot => snapshot.build)) ?? 72;
  const recentHoldQuality = average(sessionSnapshots.map(snapshot => snapshot.hold)) ?? 72;
  const recentHoldDuration = average(sessionSnapshots.map(snapshot => snapshot.duration)) ?? 72;
  const recentRecoveryQuality = average(sessionSnapshots.map(snapshot => snapshot.recovery)) ?? 72;
  const recentReboundQuality = average(sessionSnapshots.map(snapshot => snapshot.rebound)) ?? 72;

  const recentAutonomousPeaks = [...autonomousPeakEvents]
    .sort((left, right) => right.timestamp - left.timestamp)
    .slice(0, 6)
    .map(event => event.peakLevel);
  const recentPeakLevels = recentScoredSessions
    .filter((session): session is Session & { peakLevel: number } => typeof session.peakLevel === 'number')
    .map(session => session.peakLevel)
    .concat(recentAutonomousPeaks);
  const recentPeakQuality =
    average(
      recentPeakLevels.map(peakLevel =>
        scoreHigherBetter(peakLevel / Math.max(profile.averageMaxExpansion, 1), 0.84, 1.06, 48, 99),
      ),
    ) ?? 72;

  const nocturnalTrack = calibrationTracks.find(track => track.key === 'nocturnal');
  const nocturnalNightPeaks = getNocturnalNightPeaks(sortedTrendHistory);
  const nocturnalAverage = average(nocturnalNightPeaks) ?? profile.averageMaxExpansion * 0.72;
  const nocturnalSupport = clamp(
    scoreHigherBetter(nocturnalAverage / Math.max(profile.averageMaxExpansion, 1), 0.52, 0.86, 50, 92) * 0.42 +
      scoreHigherBetter(nocturnalNightPeaks.length, 2, 10, 50, 95) * 0.34 +
      scoreLowerBetter(standardDeviation(nocturnalNightPeaks), 4, 16, 48, 92) * 0.24,
    48,
    93,
  );

  const dailyRestingMeans = buildDailyRestingMeans(
    sortedTrendHistory,
    thresholdModel.activeEntry,
    liveTelemetry,
    simulatedDate,
  );
  const recentConsistency = standardDeviation(recentPerformanceScores);
  const recentVolatility = standardDeviation(dailyRestingMeans);
  const distinctTimelineDays = getDistinctTimelineDayCount(sortedTrendHistory, simulatedDate);
  const baselineTrack = calibrationTracks.find(track => track.key === 'baseline');
  const peakTrack = calibrationTracks.find(track => track.key === 'peak');

  const inputs: ArcEdgeInputs = {
    currentBaseline,
    baselineStability,
    recentDrift,
    currentStateBias,
    recentBuildSpeed,
    recentPeakQuality,
    recentHoldQuality,
    recentHoldDuration,
    recentRecoveryQuality,
    recentReboundQuality,
    recentConsistency,
    recentVolatility,
    nocturnalSupport,
    baselineConfidence: clamp(
      (baselineTrack?.progress ?? 0) * 100 * 0.72 +
        scoreHigherBetter(restingSamples.length, 40, 420, 35, 100) * 0.28,
      18,
      100,
    ),
    eventConfidence: clamp(
      (peakTrack?.progress ?? 0) * 100 * 0.56 +
        scoreHigherBetter(scoredSessions.length + autonomousPeakEvents.length, 3, 16, 35, 100) * 0.24 +
        recentMotionSupport * 0.2,
      18,
      100,
    ),
    nocturnalConfidence: clamp(
      (nocturnalTrack?.progress ?? 0) * 100 * 0.6 +
        scoreHigherBetter(nocturnalNightPeaks.length, 2, 10, 35, 100) * 0.4,
      16,
      100,
    ),
    longitudinalCoverageConfidence: clamp(
      scoreHigherBetter(wearStreakDays, 1, 30, 35, 96) * 0.55 +
        scoreHigherBetter(distinctTimelineDays, 1, 30, 35, 100) * 0.45,
      24,
      100,
    ),
    imuContextSupport: recentMotionSupport,
    modelConfidence: 0,
  };

  const readinessResult = computeEdgeReadiness(inputs, profile);
  const performanceResult = computeEdgePerformance(inputs);
  const stabilityResult = computeEdgeStability(inputs);
  const confidenceResult = computeEdgeConfidence(profile, inputs);
  const readiness = Math.round(readinessResult.score);
  const performance = Math.round(performanceResult.score);
  const stability = Math.round(stabilityResult.score);
  const confidence = Math.round(confidenceResult.score);
  inputs.modelConfidence = confidence;

  return {
    readinessResult,
    performanceResult,
    stabilityResult,
    confidenceResult,
    readiness,
    performance,
    stability,
    confidence,
    trendDirection: getEdgeTrendDirection({
      recentPerformanceScores,
      recentPeakLevels,
      recentDrift,
      averageMaxExpansion: profile.averageMaxExpansion,
    }),
    visibleScore: Math.round(clamp(readiness * 0.3 + performance * 0.35 + stability * 0.2 + confidence * 0.15, 42, 99)),
  };
}

function getEdgeScoreCopy(state: ArcEdgeScoreState, unlocked: boolean) {
  if (!unlocked) {
    return {
      status: 'Still building',
      primaryLine: 'Your Edge Score is taking shape',
      secondaryLine: 'More history sharpens your score',
      ctaLabel: 'View progress',
      detailBody:
        'Edge is learning from your ring’s real expansion behavior over time: resting baseline, peaks, holds, recovery shape, and overnight support. More validated history makes the score more believable.',
    };
  }

  switch (state) {
    case 'early_calibrated':
      return {
        status: 'Early calibrated',
        primaryLine: 'Your score is now live',
        secondaryLine: 'More history keeps refining the score',
        ctaLabel: 'View score',
        detailBody:
          'Edge is live, but still tightening its model of your baseline, upper-end expansion, hold quality, recovery behavior, and overnight support. The score is meaningful now and strengthens with more history.',
      };
    case 'strengthening':
      return {
        status: 'Strengthening',
        primaryLine: 'Recent performance is lifting your score',
        secondaryLine: 'Build, peak, and hold quality are trending above your usual range',
        ctaLabel: 'View score',
        detailBody:
          'Recent ring expansion behavior is outperforming your learned profile. Stronger build quality, steadier holds, and better recent support are pulling Edge upward.',
      };
    case 'stable':
      return {
        status: 'Stable',
        primaryLine: 'Your profile looks strong and consistent',
        secondaryLine: 'Baseline, peaks, holds, and recovery are tracking in a dependable range',
        ctaLabel: 'View score',
        detailBody:
          'Your recent profile is repeatable and well-supported. Edge is seeing reliable baseline behavior, confident upper-end events, steadier holds, and cleaner recovery patterns.',
      };
    case 'reduced':
      return {
        status: 'Reduced',
        primaryLine: 'Recent performance is below your usual range',
        secondaryLine: 'Baseline or recent event quality is sitting under your learned profile',
        ctaLabel: 'View score',
        detailBody:
          'Edge is comparing recent expansion behavior against your own learned profile and seeing softer baseline or event quality than usual. The score can recover as stronger, cleaner sessions return.',
      };
    case 'volatile':
      return {
        status: 'Volatile',
        primaryLine: 'Your profile is active, but less settled',
        secondaryLine: 'Recent performance is less repeatable than your usual pattern',
        ctaLabel: 'View score',
        detailBody:
          'Edge is seeing meaningful signal, but the recent pattern is less consistent. Peaks, holds, or recovery quality are varying more than your established profile would normally suggest.',
      };
    default:
      return {
        status: 'Live',
        primaryLine: 'Your Edge Score is now live',
        secondaryLine: 'Built from baseline, peaks, holds, recovery, and overnight support',
        ctaLabel: 'View score',
        detailBody:
          'Edge is built from real Hall-effect expansion behavior at the base ring over time: resting baseline position, rise quality, peak quality, hold quality, recovery shape, and overnight support. Motion is used only to improve session confidence and filtering.',
      };
  }
}

function buildEdgeScoreModelLegacy({
  calibration,
  calibrationTracks,
  thresholdModel,
  featureAvailability,
  scoredSessions,
  motionSessions,
  buildSamples,
  durationSamples,
  recoverySamples,
  reboundSamples,
  stabilitySamples,
  liveTelemetry,
  trendHistory,
  autonomousPeakEvents,
  wearStreakDays,
  simulatedDate,
}: {
  calibration: ArcCalibrationStatus;
  calibrationTracks: ArcCalibrationTrack[];
  thresholdModel: ArcThresholdModel;
  featureAvailability: ArcFeatureAvailability;
  scoredSessions: Session[];
  motionSessions: Session[];
  buildSamples: number[];
  durationSamples: number[];
  recoverySamples: number[];
  reboundSamples: number[];
  stabilitySamples: number[];
  liveTelemetry: ArcLiveTelemetry | null;
  trendHistory: Array<{ timestamp: number; value: number; linePhase?: ArcLiveLinePhase }>;
  autonomousPeakEvents: ArcAutonomousPeakEvent[];
  wearStreakDays: number;
  simulatedDate?: Date;
}): any {
  const unlockProgress = clamp(calibration.progress, 0, 1);
  const unlockPercentage = Math.round(unlockProgress * 100);
  const unlocked = featureAvailability.edgeScore && unlockProgress >= 1;

  const peakMarks = scoredSessions
    .filter((session): session is Session & { peakLevel: number } => typeof session.peakLevel === 'number')
    .map(session => session.peakLevel)
    .concat(autonomousPeakEvents.map(event => event.peakLevel));
  const profile = buildEdgePersonalProfile({
    calibration,
    thresholdModel,
    buildSamples,
    durationSamples,
    recoverySamples,
    reboundSamples,
    stabilitySamples,
    peakMarks,
  });

  const sortedTrendHistory = [...trendHistory].sort((left, right) => left.timestamp - right.timestamp);
  const nowTimestamp =
    simulatedDate?.getTime() ?? sortedTrendHistory[sortedTrendHistory.length - 1]?.timestamp ?? Date.now();
  const currentSnapshot = computeEdgeScoreSnapshot({
    calibrationTracks,
    thresholdModel,
    scoredSessions,
    motionSessions,
    liveTelemetry,
    trendHistory: sortedTrendHistory,
    autonomousPeakEvents,
    wearStreakDays,
    simulatedDate,
    profile,
  });
  const dayAgoTimestamp = nowTimestamp - 24 * 60 * 60 * 1000;
  const priorScoredSessions = scoredSessions.filter(session => {
    const timestamp = resolveSessionTimestamp(session, simulatedDate);
    return timestamp != null && timestamp <= dayAgoTimestamp;
  });
  const priorMotionSessions = motionSessions.filter(session => {
    const timestamp = resolveSessionTimestamp(session, simulatedDate);
    return timestamp != null && timestamp <= dayAgoTimestamp;
  });
  const priorTrendHistory = sortedTrendHistory.filter(point => point.timestamp <= dayAgoTimestamp);
  const priorAutonomousPeakEvents = autonomousPeakEvents.filter(event => event.timestamp <= dayAgoTimestamp);
  const priorSnapshot =
    priorTrendHistory.length > 0 || priorScoredSessions.length > 0 || priorAutonomousPeakEvents.length > 0
      ? computeEdgeScoreSnapshot({
          calibrationTracks,
          thresholdModel,
          scoredSessions: priorScoredSessions,
          motionSessions: priorMotionSessions,
          liveTelemetry: null,
          trendHistory: priorTrendHistory,
          autonomousPeakEvents: priorAutonomousPeakEvents,
          wearStreakDays,
          simulatedDate: new Date(dayAgoTimestamp),
          profile,
        })
      : null;

  const readinessResult = currentSnapshot.readinessResult;
  const performanceResult = currentSnapshot.performanceResult;
  const stabilityResult = currentSnapshot.stabilityResult;
  const confidenceResult = currentSnapshot.confidenceResult;
  const readiness = currentSnapshot.readiness;
  const performance = currentSnapshot.performance;
  const stability = currentSnapshot.stability;
  const confidence = currentSnapshot.confidence;
  const trendDirection = currentSnapshot.trendDirection;
  const state = getEdgeState({
    unlocked,
    unlockProgress,
    readiness,
    performance,
    stability,
    confidence,
    trendDirection,
  });
  const copy = getEdgeScoreCopy(state, unlocked);
  const value = unlocked ? currentSnapshot.visibleScore : null;
  const dayDelta = unlocked && value != null && priorSnapshot ? value - priorSnapshot.visibleScore : null;

  return {
    unlocked,
    unlockProgress,
    unlockPercentage,
    value,
    dayDelta,
    state,
    status: copy.status,
    trendDirection,
    confidence,
    confidenceLabel: getEdgeConfidenceLabel(confidence),
    readiness,
    performance,
    stability,
    profile: {
      baselineMean: Number(profile.baselineMean.toFixed(1)),
      baselineLow: Number(profile.baselineLow.toFixed(1)),
      baselineHigh: Number(profile.baselineHigh.toFixed(1)),
      averageMaxExpansion: Number(profile.averageMaxExpansion.toFixed(1)),
      averageHoldQuality: Number(profile.averageHoldQuality.toFixed(1)),
      averageRecoveryQuality: Number(profile.averageRecoveryQuality.toFixed(1)),
      calibrationConfidence: Number(profile.calibrationConfidence.toFixed(1)),
    },
    readinessBreakdown: readinessResult.breakdown,
    performanceBreakdown: performanceResult.breakdown,
    stabilityBreakdown: stabilityResult.breakdown,
    confidenceBreakdown: confidenceResult.breakdown,
    primaryLine: copy.primaryLine,
    secondaryLine: copy.secondaryLine,
    ctaLabel: copy.ctaLabel,
    detailBody: copy.detailBody.replace(/â€™/g, "'"),
    methodologyLine:
      'Primary signal: Hall-effect base-ring expansion and gap-change dynamics. Support signal: 9-axis motion context for filtering, artifact rejection, and session confidence.',
  };
}

function getEdgeModelConfidenceLabel(confidence: number) {
  if (confidence >= 88) {
    return 'Established confidence';
  }

  if (confidence >= 74) {
    return 'Strong confidence';
  }

  if (confidence >= 58) {
    return 'Growing confidence';
  }

  return 'Provisional confidence';
}

interface ArcTimedSessionRecord {
  session: Session;
  timestamp: number;
  snapshot: ArcEdgeSessionSnapshot;
}

interface ArcEdgePillarResult<TBreakdown> {
  score: number;
  breakdown: TBreakdown;
}

interface ArcModernEdgeScoreSnapshot {
  baselineReadinessResult: ArcEdgePillarResult<ArcEdgeBaselineReadinessBreakdown>;
  baselineReadinessRawValues: ArcEdgeBaselineReadinessRawValues;
  erectionQualityResult: ArcEdgePillarResult<ArcEdgeErectionQualityBreakdown>;
  erectionQualityRawValues: ArcEdgeErectionQualityRawValues;
  sessionPerformanceResult: ArcEdgePillarResult<ArcEdgeSessionPerformanceBreakdown>;
  sessionPerformanceRawValues: ArcEdgeSessionPerformanceRawValues;
  overnightSupportResult: ArcEdgePillarResult<ArcEdgeOvernightSupportBreakdown>;
  overnightSupportRawValues: ArcEdgeOvernightSupportRawValues;
  consistencyReliabilityResult: ArcEdgePillarResult<ArcEdgeConsistencyReliabilityBreakdown>;
  consistencyReliabilityRawValues: ArcEdgeConsistencyReliabilityRawValues;
  confidenceResult: ArcEdgePillarResult<ArcEdgeConfidenceBreakdown>;
  baselineReadiness: number;
  erectionQuality: number;
  sessionPerformance: number;
  overnightSupport: number;
  consistencyReliability: number;
  confidence: number;
  maturityLabel: string;
  visibleScore: number;
  trustProgress: number;
}

function getEdgeSessionTimestamp(session: Session, anchorDate?: Date) {
  if (typeof session.capturedAt === 'number') {
    return session.capturedAt;
  }

  return resolveSessionTimestamp(session, anchorDate);
}

function buildTimedSessionRecords(
  sessions: Session[],
  profile: ArcEdgePersonalProfile,
  nowTimestamp: number,
  anchorDate?: Date,
) {
  return sessions
    .map(session => {
      const timestamp = getEdgeSessionTimestamp(session, anchorDate);

      if (timestamp == null || getEdgeRecencyBucketWeight(timestamp, nowTimestamp) <= 0) {
        return null;
      }

      return {
        session,
        timestamp,
        snapshot: buildEdgeSessionSnapshot(session, profile),
      } satisfies ArcTimedSessionRecord;
    })
    .filter((record): record is ArcTimedSessionRecord => record != null)
    .sort((left, right) => right.timestamp - left.timestamp);
}

function getTimedSampleCount(samples: ArcTimedValueSample[], nowTimestamp: number) {
  return samples.filter(sample => getTimedSampleWeight(sample, nowTimestamp) > 0).length;
}

function getTimedUniqueDayCount(timestamps: number[]) {
  return new Set(timestamps.map(timestamp => formatCaptureNightKey(new Date(timestamp)))).size;
}

function getMotionRhythmControlScore(session: Session) {
  if (!session.motion) {
    return clamp(
      session.analysis?.controlScore != null
        ? session.analysis.controlScore
        : 48,
      48,
      95,
    );
  }

  const rhythmBase =
    session.motion.rhythm === 'Consistent'
      ? 90
      : session.motion.rhythm === 'Variable'
        ? 74
        : 58;
  const rhythmConsistency = session.motion.rhythmConsistency ?? rhythmBase;
  const motionStability = session.motion.motionStability ?? rhythmConsistency;
  const analysisRhythmControl = session.analysis?.rhythmControlScore ?? null;
  const analysisControl = session.analysis?.controlScore ?? null;

  return clamp(
    rhythmBase * 0.18 +
      rhythmConsistency * 0.28 +
      motionStability * 0.28 +
      (analysisRhythmControl ?? rhythmConsistency) * 0.14 +
      (analysisControl ?? motionStability) * 0.12,
    48,
    95,
  );
}

function getEdgePerformanceBand(score: number | null) {
  if (score == null) {
    return {
      label: 'Building',
      interpretation: 'Provisional score forming',
    };
  }

  if (score >= 100) {
    return {
      label: 'Unicorn',
      interpretation: 'Unicorn',
    };
  }

  if (score >= 93) {
    return {
      label: 'Apex',
      interpretation: 'Apex',
    };
  }

  if (score >= 85) {
    return {
      label: 'Elite',
      interpretation: 'Elite',
    };
  }

  if (score >= 75) {
    return {
      label: 'Advanced',
      interpretation: 'Advanced',
    };
  }

  if (score >= 65) {
    return {
      label: 'Strong',
      interpretation: 'Strong',
    };
  }

  if (score >= 50) {
    return {
      label: 'Balanced',
      interpretation: 'Balanced',
    };
  }

  if (score >= 35) {
    return {
      label: 'Developing',
      interpretation: 'Developing',
    };
  }

  if (score >= 20) {
    return {
      label: 'Limited',
      interpretation: 'Limited',
    };
  }

  return {
    label: 'Very Low',
    interpretation: 'Very Low',
  };
}

function getEdgeTrendDirectionFromScores(currentScore: number | null, priorScore: number | null): ArcEdgeTrendDirection {
  if (currentScore == null || priorScore == null) {
    return 'stable';
  }

  const delta = currentScore - priorScore;

  if (delta >= 2) {
    return 'rising';
  }

  if (delta <= -2) {
    return 'falling';
  }

  return 'stable';
}

function getModernEdgeState({
  unlocked,
  maturityLabel,
  score,
  baselineReadiness,
  erectionQuality,
  sessionPerformance,
  consistencyReliability,
  confidence,
  trendDirection,
}: {
  unlocked: boolean;
  maturityLabel: string;
  score: number | null;
  baselineReadiness: number;
  erectionQuality: number;
  sessionPerformance: number;
  consistencyReliability: number;
  confidence: number;
  trendDirection: ArcEdgeTrendDirection;
}): ArcEdgeScoreState {
  if (!unlocked || score == null) {
    return 'building';
  }

  if (maturityLabel === 'Building') {
    return 'building';
  }

  if (maturityLabel === 'Early calibrated' && confidence < 76) {
    return 'early_calibrated';
  }

  if (score < 50 || baselineReadiness < 54 || erectionQuality < 56) {
    return 'reduced';
  }

  if (consistencyReliability < 58 || sessionPerformance < 52) {
    return 'volatile';
  }

  if (score >= 85 && consistencyReliability >= 78 && confidence >= 80) {
    return 'stable';
  }

  if (trendDirection === 'rising' && score >= 65) {
    return 'strengthening';
  }

  if (maturityLabel === 'Early calibrated') {
    return 'early_calibrated';
  }

  return 'live';
}

function computeModernEdgeScoreSnapshot({
  calibration,
  calibrationTracks,
  thresholdModel,
  scoredSessions,
  motionSessions,
  nocturnalSessions,
  liveTelemetry,
  trendHistory,
  autonomousPeakEvents,
  simulatedDate,
  profile,
}: {
  calibration: ArcCalibrationStatus;
  calibrationTracks: ArcCalibrationTrack[];
  thresholdModel: ArcThresholdModel;
  scoredSessions: Session[];
  motionSessions: Session[];
  nocturnalSessions: Session[];
  liveTelemetry: ArcLiveTelemetry | null;
  trendHistory: Array<{ timestamp: number; value: number; linePhase?: ArcLiveLinePhase }>;
  autonomousPeakEvents: ArcAutonomousPeakEvent[];
  simulatedDate?: Date;
  profile: ArcEdgePersonalProfile;
}): ArcModernEdgeScoreSnapshot {
  const sortedTrendHistory = [...trendHistory].sort((left, right) => left.timestamp - right.timestamp);
  const nowTimestamp =
    simulatedDate?.getTime() ?? sortedTrendHistory[sortedTrendHistory.length - 1]?.timestamp ?? Date.now();
  const baselineTrack = calibrationTracks.find(track => track.key === 'baseline');
  const peakTrack = calibrationTracks.find(track => track.key === 'peak');
  const nocturnalTrack = calibrationTracks.find(track => track.key === 'nocturnal');

  const restingSamples = buildDailyRestingSamples(
    sortedTrendHistory,
    thresholdModel.activeEntry,
    liveTelemetry,
    simulatedDate,
  );
  const timedSessionRecords = buildTimedSessionRecords(scoredSessions, profile, nowTimestamp, simulatedDate);
  const timedMotionRecords = buildTimedSessionRecords(motionSessions, profile, nowTimestamp, simulatedDate);
  const timedNocturnalRecords = buildTimedSessionRecords(nocturnalSessions, profile, nowTimestamp, simulatedDate);
  const autonomousPeakSamples = autonomousPeakEvents
    .map(event => ({
      timestamp: event.timestamp,
      value: scoreHigherBetter(event.peakLevel / Math.max(profile.averageMaxExpansion, 1), 0.82, 1.05, 46, 98),
    }))
    .filter(sample => getEdgeAgeDays(sample.timestamp, nowTimestamp) != null);

  const bucketedRestingSamples = getBucketedValues(restingSamples, nowTimestamp);
  const bucketedSessionRecords = getBucketedValues(timedSessionRecords, nowTimestamp);
  const bucketedMotionRecords = getBucketedValues(timedMotionRecords, nowTimestamp);
  const bucketedNocturnalRecords = getBucketedValues(timedNocturnalRecords, nowTimestamp);
  const rawPeakLevelSamples = [
    ...timedSessionRecords.map(record => ({
      timestamp: record.timestamp,
      value: record.session.peakLevel ?? profile.averageMaxExpansion * 0.92,
    })),
    ...autonomousPeakEvents.map(event => ({
      timestamp: event.timestamp,
      value: event.peakLevel,
    })),
  ];
  const corePeakLevelSamples = timedSessionRecords.map(record => ({
    timestamp: record.timestamp,
    value: record.session.peakLevel ?? profile.averageMaxExpansion * 0.92,
  }));
  const holdQualityIndexSamples = timedSessionRecords.map(record => ({
    timestamp: record.timestamp,
    value: clamp(
      record.session.analysis?.holdEfficiencyScore ?? scoreSessionHoldQuality(record.session.metrics.holdQuality),
      48,
      97,
    ),
  }));
  const holdStabilitySamples = timedSessionRecords.map(record => ({
    timestamp: record.timestamp,
    value: clamp(record.session.metrics.stability, 0, 100),
  }));
  const buildTimeSamples = timedSessionRecords
    .map(record => ({
      timestamp: record.timestamp,
      value: parseDurationToSeconds(record.session.metrics.buildSpeed),
    }))
    .filter((sample): sample is { timestamp: number; value: number } => sample.value != null && Number.isFinite(sample.value));
  const recoveryTimeSamples = timedSessionRecords
    .map(record => ({
      timestamp: record.timestamp,
      value: getSessionRecoverySeconds(record.session),
    }))
    .filter((sample): sample is { timestamp: number; value: number } => sample.value != null && Number.isFinite(sample.value));
  const reboundTimeSamples = timedSessionRecords
    .map(record => ({
      timestamp: record.timestamp,
      value: parseDurationToSeconds(record.session.metrics.rebound),
    }))
    .filter((sample): sample is { timestamp: number; value: number } => sample.value != null && Number.isFinite(sample.value));
  const motionQualitySamples = timedMotionRecords.map(record => ({
    timestamp: record.timestamp,
    value: clamp(record.session.analysis?.sessionQualityScore ?? record.snapshot.total, 46, 98),
  }));
  const motionPeakSamples = timedMotionRecords.map(record => ({
    timestamp: record.timestamp,
    value: record.session.peakLevel ?? profile.averageMaxExpansion * 0.92,
  }));
  const motionHoldSamples = timedMotionRecords.map(record => ({
    timestamp: record.timestamp,
    value: clamp(
      record.session.analysis?.holdEfficiencyScore ?? scoreSessionHoldQuality(record.session.metrics.holdQuality),
      48,
      97,
    ),
  }));
  const motionDurationSamples = timedMotionRecords.map(record => ({
    timestamp: record.timestamp,
    value: getSessionDurationSeconds(record.session),
  }));
  const driveCountSamples = timedMotionRecords
    .map(record => ({
      timestamp: record.timestamp,
      value: record.session.motion?.driveCount ?? null,
    }))
    .filter((sample): sample is { timestamp: number; value: number } => sample.value != null && Number.isFinite(sample.value));
  const cadenceMetricSamples = timedMotionRecords
    .map(record => ({
      timestamp: record.timestamp,
      value: parseCadence(record.session.motion?.cadenceAvg ?? record.session.motion?.cadence),
    }))
    .filter((sample): sample is { timestamp: number; value: number } => sample.value != null && Number.isFinite(sample.value));
  const rhythmConsistencyMetricSamples = timedMotionRecords
    .map(record => ({
      timestamp: record.timestamp,
      value: record.session.motion?.rhythmConsistency ?? null,
    }))
    .filter((sample): sample is { timestamp: number; value: number } => sample.value != null && Number.isFinite(sample.value));
  const motionControlSamples = timedMotionRecords.map(record => ({
    timestamp: record.timestamp,
    value: getMotionRhythmControlScore(record.session),
  }));
  const nocturnalFullnessSamples = timedNocturnalRecords.map(record => ({
    timestamp: record.timestamp,
    value: clamp(record.session.nocturnalQuality ?? record.session.peakLevel ?? 0, 0, 100),
  }));
  const nocturnalDurationMetricSamples = timedNocturnalRecords.map(record => ({
    timestamp: record.timestamp,
    value: getSessionDurationSeconds(record.session),
  }));
  const nocturnalEventSamples = timedNocturnalRecords.map(record => ({
    timestamp: record.timestamp,
    value: record.session.nocturnalEvents ?? 1,
  }));

  const baselineCoverageDays = bucketedRestingSamples.reduce((sum, group) => sum + group.values.length, 0);
  const qualifiedSessionCount = timedSessionRecords.length;
  const motionSessionCount = timedMotionRecords.length;
  const nocturnalNightCount = getTimedUniqueDayCount(timedNocturnalRecords.map(record => record.timestamp));
  const activeDayCount = getTimedUniqueDayCount(timedSessionRecords.map(record => record.timestamp));

  const weightedMotionRatio = (() => {
    let weightedSum = 0;
    let usedWeight = 0;

    bucketedSessionRecords.forEach((bucketGroup, index) => {
      const totalSessions = bucketGroup.values.length;

      if (totalSessions <= 0) {
        return;
      }

      const ratio = (bucketedMotionRecords[index]?.values.length ?? 0) / totalSessions;
      weightedSum += ratio * bucketGroup.bucket.weight;
      usedWeight += bucketGroup.bucket.weight;
    });

    return usedWeight > 0 ? weightedSum / usedWeight : null;
  })();

  const weightedActiveDayDensity = (() => {
    let weightedSum = 0;
    let usedWeight = 0;

    EDGE_RECENCY_BUCKETS.forEach(bucket => {
      const dayKeys = new Set(
        timedSessionRecords
          .filter(record => {
            const ageDays = getEdgeAgeDays(record.timestamp, nowTimestamp);
            return ageDays != null && ageDays >= bucket.startDaysAgo && ageDays <= bucket.endDaysAgo;
          })
          .map(record => formatCaptureNightKey(new Date(record.timestamp))),
      );
      const bucketDaySpan = bucket.endDaysAgo - bucket.startDaysAgo + 1;
      const density = bucketDaySpan > 0 ? dayKeys.size / bucketDaySpan : 0;

      weightedSum += density * bucket.weight;
      usedWeight += bucket.weight;
    });

    return usedWeight > 0 ? weightedSum / usedWeight : 0;
  })();

  const averageBaselineFullness = weightedAverageFromBuckets(bucketedRestingSamples, profile.baselineMean);
  const baselineStability =
    baselineCoverageDays >= 3
      ? weightedDerivedValueFromBuckets(
          bucketedRestingSamples,
          values => {
            if (values.length < 2) {
              return null;
            }

            return standardDeviation(values.map(entry => entry.value));
          },
          0,
        )
      : null;
  const reducedBaselineShare = weightedDerivedValueFromBuckets(
    bucketedRestingSamples,
    values => average(values.map(value => (value.value < profile.baselineLow ? 1 : 0))),
    0,
  );
  const elevatedBaselineShare = weightedDerivedValueFromBuckets(
    bucketedRestingSamples,
    values =>
      average(values.map(value => (value.value >= profile.baselineHigh && value.value < profile.activeEntry ? 1 : 0))),
    0,
  );
  const baselineVolatilityRaw = weightedDerivedValueFromBuckets(
    bucketedRestingSamples,
    values => {
      if (values.length < 2) {
        return null;
      }

      const sortedValues = [...values].sort((left, right) => left.timestamp - right.timestamp);
      const deltas = sortedValues.slice(1).map((entry, index) => Math.abs(entry.value - sortedValues[index]!.value));
      return average(deltas);
    },
    0,
  );

  const averageBaselineFullnessScore = scorePlateauRange(
    averageBaselineFullness,
    profile.baselineLow + 0.8,
    Math.min(profile.baselineHigh + 1.2, profile.elevatedRestingHigh),
    Math.max(12, profile.baselineLow - 4.5),
    profile.activeEntry - 0.5,
    44,
    92,
  );
  const baselineStabilityScore =
    baselineCoverageDays >= 3 ? scoreLowerBetter(baselineStability, 1.2, 5.4, 46, 94) : 56;
  const reducedBaselinePenaltyScore = scoreLowerBetter(reducedBaselineShare, 0.03, 0.26, 44, 92);
  const elevatedBaselineSupportScore = scorePlateauRange(elevatedBaselineShare, 0.08, 0.24, 0, 0.44, 48, 90);
  const baselineVolatilityQualityScore = scoreLowerBetter(baselineVolatilityRaw, 0.4, 3.2, 46, 92);
  const baselineReadinessScore = clamp(
    averageBaselineFullnessScore * 0.25 +
      baselineStabilityScore * 0.25 +
      reducedBaselinePenaltyScore * 0.2 +
      elevatedBaselineSupportScore * 0.1 +
      baselineVolatilityQualityScore * 0.2,
    40,
    95,
  );

  const peakSamples = timedSessionRecords.map(record => ({
    timestamp: record.timestamp,
    value: record.snapshot.peak,
  }));
  const holdSamples = timedSessionRecords.map(record => ({
    timestamp: record.timestamp,
    value: record.snapshot.hold,
  }));
  const stabilityQualitySamples = timedSessionRecords.map(record => ({
    timestamp: record.timestamp,
    value: scoreHigherBetter(record.session.metrics.stability, 48, 90, 44, 95),
  }));
  const durationQualitySamples = timedSessionRecords.map(record => ({
    timestamp: record.timestamp,
    value: record.snapshot.duration,
  }));
  const buildQualitySamples = timedSessionRecords.map(record => ({
    timestamp: record.timestamp,
    value: record.snapshot.build,
  }));
  const recoveryQualitySamples = timedSessionRecords.map(record => ({
    timestamp: record.timestamp,
    value: record.snapshot.recovery,
  }));
  const reboundQualitySamples = timedSessionRecords.map(record => ({
    timestamp: record.timestamp,
    value: record.snapshot.rebound,
  }));
  const bucketedPeakSamples = getBucketedValues([...peakSamples, ...autonomousPeakSamples], nowTimestamp);
  const bucketedCorePeakSamples = getBucketedValues(peakSamples, nowTimestamp);
  const bucketedHoldSamples = getBucketedValues(holdSamples, nowTimestamp);
  const bucketedStabilityQualitySamples = getBucketedValues(stabilityQualitySamples, nowTimestamp);
  const bucketedDurationQualitySamples = getBucketedValues(durationQualitySamples, nowTimestamp);
  const bucketedBuildQualitySamples = getBucketedValues(buildQualitySamples, nowTimestamp);
  const bucketedRecoveryQualitySamples = getBucketedValues(recoveryQualitySamples, nowTimestamp);
  const bucketedReboundQualitySamples = getBucketedValues(reboundQualitySamples, nowTimestamp);

  const peakFullnessScore = weightedAverageFromBuckets(bucketedPeakSamples, 54);
  const peakConsistencyScore =
    qualifiedSessionCount >= 3
      ? scoreLowerBetter(
          weightedDerivedValueFromBuckets(
            bucketedCorePeakSamples,
            values => {
              if (values.length < 2) {
                return null;
              }

              return standardDeviation(values.map(entry => entry.value));
            },
            0,
          ),
          4,
          16,
          44,
          92,
        )
      : 56;
  const holdQualityScore = weightedAverageFromBuckets(bucketedHoldSamples, 54);
  const stabilityScore = weightedAverageFromBuckets(bucketedStabilityQualitySamples, 54);
  const durationQualityScore = weightedAverageFromBuckets(bucketedDurationQualitySamples, 54);
  const buildQualityScore = weightedAverageFromBuckets(bucketedBuildQualitySamples, 54);
  const recoveryQualityScore = weightedAverageFromBuckets(bucketedRecoveryQualitySamples, 54);
  const reboundQualityScore = weightedAverageFromBuckets(bucketedReboundQualitySamples, 60);
  const erectionQualityScore = clamp(
    peakFullnessScore * 0.2 +
      peakConsistencyScore * 0.1 +
      holdQualityScore * 0.22 +
      durationQualityScore * 0.14 +
      buildQualityScore * 0.1 +
      recoveryQualityScore * 0.08 +
      reboundQualityScore * 0.06 +
      stabilityScore * 0.1,
    40,
    98,
  );

  const motionSessionQualityScore = weightedAverageFromBuckets(
    getBucketedValues(
      timedMotionRecords.map(record => ({
        timestamp: record.timestamp,
        value: record.snapshot.total,
      })),
      nowTimestamp,
    ),
    46,
  );
  const motionHoldQualityScore = weightedAverageFromBuckets(
    getBucketedValues(
      timedMotionRecords.map(record => ({
        timestamp: record.timestamp,
        value: record.snapshot.hold,
      })),
      nowTimestamp,
    ),
    46,
  );
  const motionPeakQualityScore = weightedAverageFromBuckets(
    getBucketedValues(
      timedMotionRecords.map(record => ({
        timestamp: record.timestamp,
        value: record.snapshot.peak,
      })),
      nowTimestamp,
    ),
    46,
  );
  const motionDurationScore = weightedAverageFromBuckets(
    getBucketedValues(
      timedMotionRecords.map(record => ({
        timestamp: record.timestamp,
        value: record.snapshot.duration,
      })),
      nowTimestamp,
    ),
    46,
  );
  const motionStaticRatioScore =
    weightedMotionRatio != null ? scorePlateauRange(weightedMotionRatio, 0.34, 0.72, 0.08, 0.92, 42, 88) : 44;
  const driveCountQualityScore = weightedAverageFromBuckets(
    getBucketedValues(
      timedMotionRecords.map(record => ({
        timestamp: record.timestamp,
        value: scorePlateauRange(record.session.motion?.driveCount ?? null, 55, 160, 18, 260, 44, 92),
      })),
      nowTimestamp,
    ),
    44,
  );
  const cadenceQualityScore = weightedAverageFromBuckets(
    getBucketedValues(
      timedMotionRecords.map(record => ({
        timestamp: record.timestamp,
        value: scorePlateauRange(
          parseCadence(record.session.motion?.cadenceAvg ?? record.session.motion?.cadence),
          22,
          38,
          12,
          52,
          44,
          92,
        ),
      })),
      nowTimestamp,
    ),
    44,
  );
  const rhythmConsistencyScore = weightedAverageFromBuckets(
    getBucketedValues(
      timedMotionRecords.map(record => ({
        timestamp: record.timestamp,
        value: clamp(record.session.motion?.rhythmConsistency ?? 62, 42, 95),
      })),
      nowTimestamp,
    ),
    46,
  );
  const motionControlScore = weightedAverageFromBuckets(
    getBucketedValues(
      timedMotionRecords.map(record => ({
        timestamp: record.timestamp,
        value: getMotionRhythmControlScore(record.session),
      })),
      nowTimestamp,
    ),
    46,
  );
  const sessionPerformanceScore = clamp(
    motionSessionQualityScore * 0.18 +
      motionPeakQualityScore * 0.15 +
      motionHoldQualityScore * 0.15 +
      motionDurationScore * 0.12 +
      motionStaticRatioScore * 0.1 +
      driveCountQualityScore * 0.1 +
      cadenceQualityScore * 0.08 +
      rhythmConsistencyScore * 0.06 +
      motionControlScore * 0.06,
    38,
    97,
  );

  const nocturnalFullnessScore = weightedAverageFromBuckets(
    getBucketedValues(
      timedNocturnalRecords.map(record => ({
        timestamp: record.timestamp,
        value: clamp(
          (record.session.nocturnalQuality != null
            ? clamp(record.session.nocturnalQuality, 48, 96)
            : scoreHigherBetter(
                (record.session.peakLevel ?? profile.averageMaxExpansion * 0.72) / Math.max(profile.averageMaxExpansion, 1),
                0.56,
                0.9,
                48,
                92,
              )) * 0.72 +
            (record.session.analysis?.sessionQualityScore ?? record.session.analysis?.peakIntegrityScore ?? 68) * 0.28,
          48,
          97,
        ),
      })),
      nowTimestamp,
    ),
    58,
  );
  const nocturnalDurationScore = weightedAverageFromBuckets(
    getBucketedValues(
      timedNocturnalRecords.map(record => ({
        timestamp: record.timestamp,
        value: scoreHigherBetter(getSessionDurationSeconds(record.session), 420, 1500, 48, 91),
      })),
      nowTimestamp,
    ),
    58,
  );
  const eventFrequencyScore = weightedAverageFromBuckets(
    getBucketedValues(
      timedNocturnalRecords.map(record => ({
        timestamp: record.timestamp,
        value: scorePlateauRange(record.session.nocturnalEvents ?? 1, 1.2, 3.5, 0.2, 5.5, 50, 88),
      })),
      nowTimestamp,
    ),
    58,
  );
  const nocturnalConsistencyScore =
    timedNocturnalRecords.length >= 2
      ? scoreLowerBetter(
          weightedDerivedValueFromBuckets(
            bucketedNocturnalRecords,
            values => {
              if (values.length < 2) {
                return null;
              }

              return standardDeviation(
                values.map(record =>
                  (record.session.nocturnalQuality ?? record.session.peakLevel ?? 0) * 0.72 +
                  (record.session.analysis?.overnightRegularityScore ?? record.session.analysis?.sessionQualityScore ?? 68) * 0.28,
                ),
              );
            },
            0,
          ),
          4,
          16,
          50,
          90,
        )
      : 58;
  const strongestSetSupportScore = weightedDerivedValueFromBuckets(
    bucketedNocturnalRecords,
    values =>
      values.length > 0
        ? Math.max(
            ...values.map(record =>
              clamp(
                (record.session.nocturnalQuality ?? scoreSessionPeakQuality(record.session.overnightStability)) * 0.74 +
                  (record.session.analysis?.overnightRegularityScore ?? record.session.analysis?.sessionQualityScore ?? 68) * 0.26,
                48,
                98,
              ),
            ),
          )
        : null,
    58,
  );
  const overnightSupportScore = clamp(
    nocturnalFullnessScore * 0.3 +
      nocturnalDurationScore * 0.25 +
      eventFrequencyScore * 0.2 +
      nocturnalConsistencyScore * 0.15 +
      strongestSetSupportScore * 0.1,
    46,
    94,
  );

  const holdConsistencyScore =
    qualifiedSessionCount >= 3
      ? scoreLowerBetter(
          weightedDerivedValueFromBuckets(
            bucketedHoldSamples,
            values => {
              if (values.length < 2) {
                return null;
              }

              return standardDeviation(values.map(entry => entry.value));
            },
            0,
          ),
          4,
          16,
          44,
          92,
        )
      : 56;
  const activeDayDensityScore = scorePlateauRange(weightedActiveDayDensity, 0.24, 0.62, 0.06, 0.88, 44, 92);
  const archiveMaturityRaw = (() => {
    let weightedSum = 0;
    let usedWeight = 0;

    EDGE_RECENCY_BUCKETS.forEach((bucket, index) => {
      const bucketDaySpan = bucket.endDaysAgo - bucket.startDaysAgo + 1;
      const bucketBaselineDays = bucketedRestingSamples[index]?.values.length ?? 0;
      const bucketActiveDays = new Set(
        (bucketedSessionRecords[index]?.values ?? []).map(record => formatCaptureNightKey(new Date(record.timestamp))),
      ).size;
      const bucketSessionCount = bucketedSessionRecords[index]?.values.length ?? 0;
      const sessionTarget = Math.max(1, Math.round(bucketDaySpan * 0.35));
      const maturity =
        Math.min(1, bucketBaselineDays / bucketDaySpan) * 0.35 +
        Math.min(1, bucketActiveDays / bucketDaySpan) * 0.35 +
        Math.min(1, bucketSessionCount / sessionTarget) * 0.3;

      weightedSum += maturity * bucket.weight;
      usedWeight += bucket.weight;
    });

    return usedWeight > 0 ? weightedSum / usedWeight : 0;
  })();
  const archiveMaturityScore = remapClamped(archiveMaturityRaw, 0.18, 1, 42, 94);
  const weightedPatternVariance = weightedDerivedValueFromBuckets(
    getBucketedValues(
      timedSessionRecords.map(record => ({
        timestamp: record.timestamp,
        value: record.snapshot.total,
      })),
      nowTimestamp,
    ),
    values => {
      if (values.length < 2) {
        return null;
      }

      return standardDeviation(values.map(entry => entry.value));
    },
    0,
  );
  const patternReliabilityScore = clamp(
    scoreLowerBetter(weightedPatternVariance, 4, 14, 44, 92) * 0.5 +
      peakConsistencyScore * 0.25 +
      holdConsistencyScore * 0.25,
    44,
    92,
  );
  const consistencyReliabilityScore = clamp(
    peakConsistencyScore * 0.25 +
      holdConsistencyScore * 0.25 +
      activeDayDensityScore * 0.15 +
      archiveMaturityScore * 0.15 +
      patternReliabilityScore * 0.2,
    42,
    94,
  );

  const baselineCoverageConfidence = clamp(
    scoreHigherBetter(baselineCoverageDays, 1, 10, 22, 100) * 0.74 +
      (baselineTrack?.progress ?? 0) * 100 * 0.26,
    18,
    100,
  );
  const qualifiedSessionConfidence = clamp(
    scoreHigherBetter(qualifiedSessionCount, 1, 8, 24, 100) * 0.76 +
      (peakTrack?.progress ?? 0) * 100 * 0.24,
    18,
    100,
  );
  const nocturnalCoverageConfidence = clamp(
    scoreHigherBetter(nocturnalNightCount, 1, 5, 20, 100) * 0.78 +
      (nocturnalTrack?.progress ?? 0) * 100 * 0.22,
    16,
    100,
  );
  const activeDayConfidence = clamp(
    scoreHigherBetter(activeDayCount, 1, 10, 24, 100) * 0.78 +
      scoreHigherBetter(getDistinctTimelineDayCount(sortedTrendHistory, simulatedDate), 1, 30, 30, 100) * 0.22,
    18,
    100,
  );
  const overallModelConfidence =
    baselineCoverageConfidence * 0.28 +
    qualifiedSessionConfidence * 0.28 +
    nocturnalCoverageConfidence * 0.18 +
    activeDayConfidence * 0.26;
  const confidenceScore = clamp(overallModelConfidence * 0.86 + calibration.progress * 100 * 0.14, 18, 100);
  const peakFullnessRaw =
    rawPeakLevelSamples.length > 0 ? weightedAverageFromBuckets(getBucketedValues(rawPeakLevelSamples, nowTimestamp), 0) : null;
  const peakConsistencyRaw =
    qualifiedSessionCount >= 3
      ? weightedDerivedValueFromBuckets(
          getBucketedValues(corePeakLevelSamples, nowTimestamp),
          values => {
            if (values.length < 2) {
              return null;
            }

            return standardDeviation(values.map(entry => entry.value));
          },
          0,
        )
      : null;
  const holdQualityRaw =
    holdQualityIndexSamples.length > 0 ? weightedAverageFromBuckets(getBucketedValues(holdQualityIndexSamples, nowTimestamp), 0) : null;
  const holdStabilityRaw =
    holdStabilitySamples.length > 0 ? weightedAverageFromBuckets(getBucketedValues(holdStabilitySamples, nowTimestamp), 0) : null;
  const holdDurationRaw =
    timedSessionRecords.length > 0
      ? weightedAverageFromBuckets(
          getBucketedValues(
            timedSessionRecords.map(record => ({
              timestamp: record.timestamp,
              value: getSessionDurationSeconds(record.session),
            })),
            nowTimestamp,
          ),
          0,
        )
      : null;
  const buildQualityRaw =
    buildTimeSamples.length > 0 ? weightedAverageFromBuckets(getBucketedValues(buildTimeSamples, nowTimestamp), 0) : null;
  const recoveryQualityRaw =
    recoveryTimeSamples.length > 0 ? weightedAverageFromBuckets(getBucketedValues(recoveryTimeSamples, nowTimestamp), 0) : null;
  const reboundQualityRaw =
    reboundTimeSamples.length > 0 ? weightedAverageFromBuckets(getBucketedValues(reboundTimeSamples, nowTimestamp), 0) : null;
  const motionSessionQualityRaw =
    motionQualitySamples.length > 0 ? weightedAverageFromBuckets(getBucketedValues(motionQualitySamples, nowTimestamp), 0) : null;
  const motionPeakRaw =
    motionPeakSamples.length > 0 ? weightedAverageFromBuckets(getBucketedValues(motionPeakSamples, nowTimestamp), 0) : null;
  const motionHoldRaw =
    motionHoldSamples.length > 0 ? weightedAverageFromBuckets(getBucketedValues(motionHoldSamples, nowTimestamp), 0) : null;
  const motionDurationRaw =
    motionDurationSamples.length > 0 ? weightedAverageFromBuckets(getBucketedValues(motionDurationSamples, nowTimestamp), 0) : null;
  const driveCountRaw =
    driveCountSamples.length > 0 ? weightedAverageFromBuckets(getBucketedValues(driveCountSamples, nowTimestamp), 0) : null;
  const cadenceRaw =
    cadenceMetricSamples.length > 0 ? weightedAverageFromBuckets(getBucketedValues(cadenceMetricSamples, nowTimestamp), 0) : null;
  const rhythmConsistencyRaw =
    rhythmConsistencyMetricSamples.length > 0
      ? weightedAverageFromBuckets(getBucketedValues(rhythmConsistencyMetricSamples, nowTimestamp), 0)
      : null;
  const motionControlRaw =
    motionControlSamples.length > 0 ? weightedAverageFromBuckets(getBucketedValues(motionControlSamples, nowTimestamp), 0) : null;
  const nocturnalFullnessRaw =
    nocturnalFullnessSamples.length > 0 ? weightedAverageFromBuckets(getBucketedValues(nocturnalFullnessSamples, nowTimestamp), 0) : null;
  const nocturnalDurationRaw =
    nocturnalDurationMetricSamples.length > 0
      ? weightedAverageFromBuckets(getBucketedValues(nocturnalDurationMetricSamples, nowTimestamp), 0)
      : null;
  const eventFrequencyRaw =
    nocturnalEventSamples.length > 0 ? weightedAverageFromBuckets(getBucketedValues(nocturnalEventSamples, nowTimestamp), 0) : null;
  const nocturnalConsistencyRaw =
    timedNocturnalRecords.length >= 2
      ? weightedDerivedValueFromBuckets(
          getBucketedValues(nocturnalFullnessSamples, nowTimestamp),
          values => {
            if (values.length < 2) {
              return null;
            }

            return standardDeviation(values.map(entry => entry.value));
          },
          0,
        )
      : null;
  const strongestSetRaw =
    timedNocturnalRecords.length > 0
      ? weightedDerivedValueFromBuckets(
          bucketedNocturnalRecords,
          values =>
            values.length > 0
              ? Math.max(
                  ...values.map(record => clamp(record.session.nocturnalQuality ?? record.session.peakLevel ?? 0, 0, 100)),
                )
              : null,
          0,
        )
      : null;
  const holdConsistencyRaw =
    qualifiedSessionCount >= 3
      ? weightedDerivedValueFromBuckets(
          bucketedHoldSamples,
          values => {
            if (values.length < 2) {
              return null;
            }

            return standardDeviation(values.map(entry => entry.value));
          },
          0,
        )
      : null;
  const baselineReadinessRawValues: ArcEdgeBaselineReadinessRawValues = {
    averageBaselineFullness:
      baselineCoverageDays > 0
        ? `${formatEdgeMetricPercent(averageBaselineFullness)} weighted resting fullness`
        : 'Building baseline window',
    baselineStability:
      baselineCoverageDays >= 3
        ? `${formatEdgeMetricVariance(baselineStability)} resting drift`
        : 'Need 3 resting days',
    reducedBaselineFrequency:
      baselineCoverageDays > 0
        ? `${formatEdgeMetricShare(reducedBaselineShare)} reduced resting reads`
        : 'Awaiting resting reads',
    elevatedBaselineSupport:
      baselineCoverageDays > 0
        ? `${formatEdgeMetricShare(elevatedBaselineShare)} elevated support`
        : 'Awaiting resting reads',
    baselineVolatilityQuality:
      baselineCoverageDays >= 2
        ? `${formatEdgeMetricNumber(baselineVolatilityRaw)} pt average drift`
        : 'Need 2 resting reads',
  };
  const erectionQualityRawValues: ArcEdgeErectionQualityRawValues = {
    peakFullness:
      peakFullnessRaw != null
        ? `${formatEdgeMetricPercent(peakFullnessRaw)} average peak fullness`
        : 'Awaiting qualified events',
    peakConsistency:
      peakConsistencyRaw != null
        ? `${formatEdgeMetricVariance(peakConsistencyRaw)} peak variance`
        : 'Need 3 qualified events',
    holdQuality:
      holdQualityRaw != null
        ? `${formatEdgeMetricPercent(holdQualityRaw)} weighted hold quality`
        : 'Awaiting qualified events',
    stability:
      holdStabilityRaw != null
        ? `${formatEdgeMetricPercent(holdStabilityRaw)} stability average`
        : 'Awaiting qualified events',
    durationQuality:
      holdDurationRaw != null
        ? `${formatEdgeMetricDuration(holdDurationRaw)} average duration`
        : 'Awaiting qualified events',
    buildQuality:
      buildQualityRaw != null
        ? `${formatEdgeMetricDuration(buildQualityRaw)} average build`
        : 'Awaiting qualified events',
    recoveryQuality:
      recoveryQualityRaw != null
        ? `${formatEdgeMetricDuration(recoveryQualityRaw)} average recovery`
        : 'Awaiting qualified events',
    reboundQuality:
      reboundQualityRaw != null
        ? `${formatEdgeMetricDuration(reboundQualityRaw)} rebound window`
        : 'Rebound still limited',
  };
  const sessionPerformanceRawValues: ArcEdgeSessionPerformanceRawValues = {
    motionSessionQuality:
      motionSessionQualityRaw != null
        ? `${formatEdgeMetricPercent(motionSessionQualityRaw)} weighted motion quality`
        : 'Awaiting motion sessions',
    motionHoldQuality:
      motionHoldRaw != null
        ? `${formatEdgeMetricPercent(motionHoldRaw)} motion hold quality`
        : 'Awaiting motion sessions',
    motionPeakQuality:
      motionPeakRaw != null
        ? `${formatEdgeMetricPercent(motionPeakRaw)} average motion peak`
        : 'Awaiting motion sessions',
    motionDuration:
      motionDurationRaw != null
        ? `${formatEdgeMetricDuration(motionDurationRaw)} average motion session`
        : 'Awaiting motion sessions',
    motionStaticRatio:
      weightedMotionRatio != null
        ? `${formatEdgeMotionStaticRatio(weightedMotionRatio)} motion / static`
        : 'No motion/static mix yet',
    driveCount:
      driveCountRaw != null
        ? `${formatEdgeMetricNumber(driveCountRaw, 0)} average drives`
        : 'Awaiting motion sessions',
    cadence:
      cadenceRaw != null
        ? `${formatEdgeMetricNumber(cadenceRaw)} / min average`
        : 'Awaiting motion sessions',
    rhythmConsistency:
      rhythmConsistencyRaw != null
        ? `${formatEdgeMetricPercent(rhythmConsistencyRaw)} rhythm consistency`
        : 'Awaiting motion sessions',
    motionControl:
      motionControlRaw != null
        ? `${formatEdgeMetricPercent(motionControlRaw)} control index`
        : 'Awaiting motion sessions',
  };
  const overnightSupportRawValues: ArcEdgeOvernightSupportRawValues = {
    averageNocturnalFullness:
      nocturnalFullnessRaw != null
        ? `${formatEdgeMetricPercent(nocturnalFullnessRaw)} average nocturnal fullness`
        : 'Awaiting nocturnal capture',
    averageNocturnalDuration:
      nocturnalDurationRaw != null
        ? `${formatEdgeMetricDuration(nocturnalDurationRaw)} average nightly duration`
        : 'Awaiting nocturnal capture',
    eventFrequency:
      eventFrequencyRaw != null
        ? `${formatEdgeMetricNumber(eventFrequencyRaw)} events per night`
        : 'Awaiting nocturnal capture',
    nocturnalConsistency:
      nocturnalConsistencyRaw != null
        ? `${formatEdgeMetricVariance(nocturnalConsistencyRaw)} nightly variance`
        : 'Need 2 nocturnal nights',
    strongestSetSupport:
      strongestSetRaw != null
        ? `${formatEdgeMetricPercent(strongestSetRaw)} strongest overnight set`
        : 'Awaiting nocturnal capture',
  };
  const consistencyReliabilityRawValues: ArcEdgeConsistencyReliabilityRawValues = {
    peakConsistency:
      peakConsistencyRaw != null
        ? `${formatEdgeMetricVariance(peakConsistencyRaw)} peak variance`
        : 'Need 3 qualified events',
    holdConsistency:
      holdConsistencyRaw != null
        ? `${formatEdgeMetricVariance(holdConsistencyRaw)} hold variance`
        : 'Need 3 qualified events',
    activeDayDensity:
      activeDayCount > 0
        ? `${formatEdgeMetricShare(weightedActiveDayDensity)} active-day density`
        : 'No active days yet',
    archiveMaturity:
      archiveMaturityRaw > 0
        ? `${formatEdgeMetricShare(archiveMaturityRaw)} weighted coverage`
        : 'Coverage still building',
    patternReliability:
      qualifiedSessionCount >= 2
        ? `${formatEdgeMetricVariance(weightedPatternVariance)} pattern variance`
        : 'Profile still stabilizing',
  };

  const maturityLabel =
    activeDayCount >= 10 &&
    qualifiedSessionCount >= 8 &&
    nocturnalNightCount >= 5 &&
    baselineCoverageDays >= 10
      ? 'Established'
      : activeDayCount >= 4 && qualifiedSessionCount >= 3 && baselineCoverageDays >= 4
        ? 'Early calibrated'
        : 'Building';

  const rawComposite =
    baselineReadinessScore * 0.1 +
    erectionQualityScore * 0.3 +
    sessionPerformanceScore * 0.25 +
    overnightSupportScore * 0.15 +
    consistencyReliabilityScore * 0.2;
  const curvedComposite = curveEdgeCompositeScore(rawComposite);
  const visibleScore = Math.round(moderateEdgeCompositeScore(curvedComposite, confidenceScore, maturityLabel));
  const trustProgress = clamp(
    Math.min(1, activeDayCount / 10) * 0.25 +
      Math.min(1, qualifiedSessionCount / 8) * 0.3 +
      Math.min(1, nocturnalNightCount / 5) * 0.2 +
      Math.min(1, baselineCoverageDays / 10) * 0.25,
    0,
    1,
  );

  return {
    baselineReadinessResult: {
      score: baselineReadinessScore,
      breakdown: {
        averageBaselineFullnessScore: Math.round(averageBaselineFullnessScore),
        baselineStabilityScore: Math.round(baselineStabilityScore),
        reducedBaselinePenaltyScore: Math.round(reducedBaselinePenaltyScore),
        elevatedBaselineSupportScore: Math.round(elevatedBaselineSupportScore),
        baselineVolatilityQualityScore: Math.round(baselineVolatilityQualityScore),
      },
    },
    baselineReadinessRawValues,
    erectionQualityResult: {
      score: erectionQualityScore,
      breakdown: {
        peakFullnessScore: Math.round(peakFullnessScore),
        peakConsistencyScore: Math.round(peakConsistencyScore),
        holdQualityScore: Math.round(holdQualityScore),
        stabilityScore: Math.round(stabilityScore),
        durationQualityScore: Math.round(durationQualityScore),
        buildQualityScore: Math.round(buildQualityScore),
        recoveryQualityScore: Math.round(recoveryQualityScore),
        reboundQualityScore: Math.round(reboundQualityScore),
      },
    },
    erectionQualityRawValues,
    sessionPerformanceResult: {
      score: sessionPerformanceScore,
      breakdown: {
        motionSessionQualityScore: Math.round(motionSessionQualityScore),
        motionHoldQualityScore: Math.round(motionHoldQualityScore),
        motionPeakQualityScore: Math.round(motionPeakQualityScore),
        motionDurationScore: Math.round(motionDurationScore),
        motionStaticRatioScore: Math.round(motionStaticRatioScore),
        driveCountQualityScore: Math.round(driveCountQualityScore),
        cadenceQualityScore: Math.round(cadenceQualityScore),
        rhythmConsistencyScore: Math.round(rhythmConsistencyScore),
        motionControlScore: Math.round(motionControlScore),
      },
    },
    sessionPerformanceRawValues,
    overnightSupportResult: {
      score: overnightSupportScore,
      breakdown: {
        averageNocturnalFullnessScore: Math.round(nocturnalFullnessScore),
        averageNocturnalDurationScore: Math.round(nocturnalDurationScore),
        eventFrequencyScore: Math.round(eventFrequencyScore),
        nocturnalConsistencyScore: Math.round(nocturnalConsistencyScore),
        strongestSetSupportScore: Math.round(strongestSetSupportScore),
      },
    },
    overnightSupportRawValues,
    consistencyReliabilityResult: {
      score: consistencyReliabilityScore,
      breakdown: {
        peakConsistencyScore: Math.round(peakConsistencyScore),
        holdConsistencyScore: Math.round(holdConsistencyScore),
        activeDayDensityScore: Math.round(activeDayDensityScore),
        archiveMaturityScore: Math.round(archiveMaturityScore),
        patternReliabilityScore: Math.round(patternReliabilityScore),
      },
    },
    consistencyReliabilityRawValues,
    confidenceResult: {
      score: confidenceScore,
      breakdown: {
        baselineCoverageConfidence: Math.round(baselineCoverageConfidence),
        qualifiedSessionConfidence: Math.round(qualifiedSessionConfidence),
        nocturnalCoverageConfidence: Math.round(nocturnalCoverageConfidence),
        activeDayConfidence: Math.round(activeDayConfidence),
        overallModelConfidence: Math.round(overallModelConfidence),
      },
    },
    baselineReadiness: Math.round(baselineReadinessScore),
    erectionQuality: Math.round(erectionQualityScore),
    sessionPerformance: Math.round(sessionPerformanceScore),
    overnightSupport: Math.round(overnightSupportScore),
    consistencyReliability: Math.round(consistencyReliabilityScore),
    confidence: Math.round(confidenceScore),
    maturityLabel,
    visibleScore,
    trustProgress,
  };
}

function getModernEdgeScoreCopy({
  state,
  unlocked,
  score,
  maturityLabel,
}: {
  state: ArcEdgeScoreState;
  unlocked: boolean;
  score: number | null;
  maturityLabel: string;
}) {
  const band = getEdgePerformanceBand(score);

  if (!unlocked || score == null) {
    return {
      status: 'Building',
      primaryLine: 'Your provisional Edge Score is still forming',
      secondaryLine: 'The model stays conservative until baseline, sessions, and nights build out',
      ctaLabel: 'View score',
      detailBody:
        'EDGE uses a rolling 30-day model with five pillars: Baseline Readiness, Erection Quality, Session Performance, Overnight Support, and Consistency. Early scores can show up before the profile is fully trusted, but they stay moderated.',
    };
  }

  if (maturityLabel === 'Building') {
    return {
      status: 'Building',
      primaryLine: 'Your score is visible, but still provisional',
      secondaryLine: 'Early reads are useful now, but stronger coverage is still widening trust',
      ctaLabel: 'View score',
      detailBody:
        'EDGE is already reading your recent profile, but it is still in its most conservative phase. More active days, qualified sessions, nocturnal nights, and baseline coverage allow the score to express its full range.',
    };
  }

  if (maturityLabel === 'Early calibrated') {
    return {
      status: 'Early calibrated',
      primaryLine: 'Your score is useful and still maturing',
      secondaryLine: `${band.interpretation} with confidence still building across your 30-day profile`,
      ctaLabel: 'View score',
      detailBody:
        'EDGE is now meaningful, but still not fully established. The score blends five pillars across the last 30 days, with the most recent 7 days carrying the most weight and older data contributing less.',
    };
  }

  switch (state) {
    case 'stable':
      return {
        status: band.label,
        primaryLine: 'Your profile looks established and dependable',
        secondaryLine: `${band.interpretation} with repeatable hold, support, and control`,
        ctaLabel: 'View score',
        detailBody:
          'EDGE is seeing strong support across all five pillars. Baseline readiness, erection quality, usable sessions, overnight support, and reliability are all reinforcing each other.',
      };
    case 'strengthening':
      return {
        status: band.label,
        primaryLine: 'Recent performance is lifting your score',
        secondaryLine: `${band.interpretation} with recent sessions contributing more weight`,
        ctaLabel: 'View score',
        detailBody:
          'Because EDGE weights the last 7 days most heavily, better recent sessions can move the score meaningfully. Right now the most recent layer is helping more than the older one.',
      };
    case 'reduced':
      return {
        status: band.label,
        primaryLine: 'Recent performance is landing below your stronger range',
        secondaryLine: 'One or more pillars are softer than your usual standard',
        ctaLabel: 'View score',
        detailBody:
          'EDGE is not reacting to one isolated moment. The lower read means baseline readiness, erection quality, session behavior, or consistency have softened enough to pull the 30-day model down.',
      };
    case 'volatile':
      return {
        status: band.label,
        primaryLine: 'Your profile is active, but less dependable',
        secondaryLine: 'Recent quality is there, but the pattern is less reliable',
        ctaLabel: 'View score',
        detailBody:
          'This score is being held back less by raw capacity and more by repeatability. Peaks, hold quality, or usable sessions are varying enough that reliability is limiting the composite.',
      };
    default:
      return {
        status: band.label,
        primaryLine:
          score >= 100
            ? 'Your profile is in true unicorn territory'
            : score >= 93
              ? 'Your profile is operating in apex range'
              : score >= 85
                ? 'Your profile is reading as elite'
                : score >= 75
                  ? 'Your profile is reading as advanced'
                  : score >= 65
                    ? 'Your profile is reading as strong'
                    : score >= 50
                      ? 'Your profile is landing in a balanced range'
                      : score >= 35
                        ? 'Your profile is still developing'
                        : score >= 20
                          ? 'Recent performance is reading as limited'
                          : 'Recent performance is very low',
        secondaryLine:
          score >= 100
            ? 'All five pillars are aligning in a true unicorn-tier outcome'
            : score >= 93
              ? 'The profile is operating at the very top of the current model'
              : score >= 85
                ? 'All five pillars are working together in elite range'
                : score >= 75
                  ? 'The score is being supported by clearly advanced recent performance'
                  : score >= 65
                    ? 'Usable sessions and erection quality are reading strong'
                    : score >= 50
                      ? 'The score is balanced, but not yet reading as distinctly strong'
                      : score >= 35
                        ? 'The 30-day profile is still building toward a more balanced read'
                        : score >= 20
                          ? 'The 30-day profile is not yet supporting a stronger read'
                          : 'The current 30-day profile is landing in a very low range',
        ctaLabel: 'View score',
        detailBody:
          'EDGE is a five-pillar performance index, not a single-moment stat. It blends baseline readiness, erection quality, session performance, overnight support, and reliability into one 30-day score.',
      };
  }
}

function buildRecentEdgeImpactSwings(
  currentSnapshot: ArcModernEdgeScoreSnapshot,
  priorSnapshot: ArcModernEdgeScoreSnapshot | null,
): ArcEdgeRecentSwing[] {
  if (!priorSnapshot) {
    return [];
  }

  const descriptors = [
    {
      id: 'baseline-mean',
      label: 'Baseline Mean',
      pillarLabel: 'Baseline',
      pillarWeight: 0.1,
      subscoreWeight: 0.25,
      current: currentSnapshot.baselineReadinessResult.breakdown.averageBaselineFullnessScore,
      prior: priorSnapshot.baselineReadinessResult.breakdown.averageBaselineFullnessScore,
    },
    {
      id: 'baseline-stability',
      label: 'Baseline Stability',
      pillarLabel: 'Baseline',
      pillarWeight: 0.1,
      subscoreWeight: 0.25,
      current: currentSnapshot.baselineReadinessResult.breakdown.baselineStabilityScore,
      prior: priorSnapshot.baselineReadinessResult.breakdown.baselineStabilityScore,
    },
    {
      id: 'reduced-baseline',
      label: 'Reduced Baseline',
      pillarLabel: 'Baseline',
      pillarWeight: 0.1,
      subscoreWeight: 0.2,
      current: currentSnapshot.baselineReadinessResult.breakdown.reducedBaselinePenaltyScore,
      prior: priorSnapshot.baselineReadinessResult.breakdown.reducedBaselinePenaltyScore,
    },
    {
      id: 'elevated-support',
      label: 'Elevated Support',
      pillarLabel: 'Baseline',
      pillarWeight: 0.1,
      subscoreWeight: 0.1,
      current: currentSnapshot.baselineReadinessResult.breakdown.elevatedBaselineSupportScore,
      prior: priorSnapshot.baselineReadinessResult.breakdown.elevatedBaselineSupportScore,
    },
    {
      id: 'baseline-volatility',
      label: 'Volatility Quality',
      pillarLabel: 'Baseline',
      pillarWeight: 0.1,
      subscoreWeight: 0.2,
      current: currentSnapshot.baselineReadinessResult.breakdown.baselineVolatilityQualityScore,
      prior: priorSnapshot.baselineReadinessResult.breakdown.baselineVolatilityQualityScore,
    },
    {
      id: 'peak-fullness',
      label: 'Peak Fullness',
      pillarLabel: 'Erection',
      pillarWeight: 0.3,
      subscoreWeight: 0.2,
      current: currentSnapshot.erectionQualityResult.breakdown.peakFullnessScore,
      prior: priorSnapshot.erectionQualityResult.breakdown.peakFullnessScore,
    },
    {
      id: 'peak-consistency',
      label: 'Peak Consistency',
      pillarLabel: 'Erection',
      pillarWeight: 0.3,
      subscoreWeight: 0.1,
      current: currentSnapshot.erectionQualityResult.breakdown.peakConsistencyScore,
      prior: priorSnapshot.erectionQualityResult.breakdown.peakConsistencyScore,
    },
    {
      id: 'hold-quality',
      label: 'Hold Quality',
      pillarLabel: 'Erection',
      pillarWeight: 0.3,
      subscoreWeight: 0.22,
      current: currentSnapshot.erectionQualityResult.breakdown.holdQualityScore,
      prior: priorSnapshot.erectionQualityResult.breakdown.holdQualityScore,
    },
    {
      id: 'hold-stability',
      label: 'Hold Stability',
      pillarLabel: 'Erection',
      pillarWeight: 0.3,
      subscoreWeight: 0.1,
      current: currentSnapshot.erectionQualityResult.breakdown.stabilityScore,
      prior: priorSnapshot.erectionQualityResult.breakdown.stabilityScore,
    },
    {
      id: 'hold-duration',
      label: 'Hold Duration',
      pillarLabel: 'Erection',
      pillarWeight: 0.3,
      subscoreWeight: 0.14,
      current: currentSnapshot.erectionQualityResult.breakdown.durationQualityScore,
      prior: priorSnapshot.erectionQualityResult.breakdown.durationQualityScore,
    },
    {
      id: 'build-quality',
      label: 'Build Quality',
      pillarLabel: 'Erection',
      pillarWeight: 0.3,
      subscoreWeight: 0.1,
      current: currentSnapshot.erectionQualityResult.breakdown.buildQualityScore,
      prior: priorSnapshot.erectionQualityResult.breakdown.buildQualityScore,
    },
    {
      id: 'recovery-quality',
      label: 'Recovery Quality',
      pillarLabel: 'Erection',
      pillarWeight: 0.3,
      subscoreWeight: 0.08,
      current: currentSnapshot.erectionQualityResult.breakdown.recoveryQualityScore,
      prior: priorSnapshot.erectionQualityResult.breakdown.recoveryQualityScore,
    },
    {
      id: 'rebound-quality',
      label: 'Rebound Quality',
      pillarLabel: 'Erection',
      pillarWeight: 0.3,
      subscoreWeight: 0.06,
      current: currentSnapshot.erectionQualityResult.breakdown.reboundQualityScore,
      prior: priorSnapshot.erectionQualityResult.breakdown.reboundQualityScore,
    },
    {
      id: 'motion-session-quality',
      label: 'Motion Session Quality',
      pillarLabel: 'Session',
      pillarWeight: 0.25,
      subscoreWeight: 0.18,
      current: currentSnapshot.sessionPerformanceResult.breakdown.motionSessionQualityScore,
      prior: priorSnapshot.sessionPerformanceResult.breakdown.motionSessionQualityScore,
    },
    {
      id: 'motion-peak',
      label: 'Motion Peak',
      pillarLabel: 'Session',
      pillarWeight: 0.25,
      subscoreWeight: 0.15,
      current: currentSnapshot.sessionPerformanceResult.breakdown.motionPeakQualityScore,
      prior: priorSnapshot.sessionPerformanceResult.breakdown.motionPeakQualityScore,
    },
    {
      id: 'motion-hold',
      label: 'Motion Hold',
      pillarLabel: 'Session',
      pillarWeight: 0.25,
      subscoreWeight: 0.15,
      current: currentSnapshot.sessionPerformanceResult.breakdown.motionHoldQualityScore,
      prior: priorSnapshot.sessionPerformanceResult.breakdown.motionHoldQualityScore,
    },
    {
      id: 'motion-duration',
      label: 'Motion Duration',
      pillarLabel: 'Session',
      pillarWeight: 0.25,
      subscoreWeight: 0.12,
      current: currentSnapshot.sessionPerformanceResult.breakdown.motionDurationScore,
      prior: priorSnapshot.sessionPerformanceResult.breakdown.motionDurationScore,
    },
    {
      id: 'motion-static-ratio',
      label: 'Motion / Static Ratio',
      pillarLabel: 'Session',
      pillarWeight: 0.25,
      subscoreWeight: 0.1,
      current: currentSnapshot.sessionPerformanceResult.breakdown.motionStaticRatioScore,
      prior: priorSnapshot.sessionPerformanceResult.breakdown.motionStaticRatioScore,
    },
    {
      id: 'drive-count',
      label: 'Drive Count',
      pillarLabel: 'Session',
      pillarWeight: 0.25,
      subscoreWeight: 0.1,
      current: currentSnapshot.sessionPerformanceResult.breakdown.driveCountQualityScore,
      prior: priorSnapshot.sessionPerformanceResult.breakdown.driveCountQualityScore,
    },
    {
      id: 'cadence',
      label: 'Cadence',
      pillarLabel: 'Session',
      pillarWeight: 0.25,
      subscoreWeight: 0.08,
      current: currentSnapshot.sessionPerformanceResult.breakdown.cadenceQualityScore,
      prior: priorSnapshot.sessionPerformanceResult.breakdown.cadenceQualityScore,
    },
    {
      id: 'rhythm-consistency',
      label: 'Rhythm Consistency',
      pillarLabel: 'Session',
      pillarWeight: 0.25,
      subscoreWeight: 0.06,
      current: currentSnapshot.sessionPerformanceResult.breakdown.rhythmConsistencyScore,
      prior: priorSnapshot.sessionPerformanceResult.breakdown.rhythmConsistencyScore,
    },
    {
      id: 'motion-control',
      label: 'Motion Control',
      pillarLabel: 'Session',
      pillarWeight: 0.25,
      subscoreWeight: 0.06,
      current: currentSnapshot.sessionPerformanceResult.breakdown.motionControlScore,
      prior: priorSnapshot.sessionPerformanceResult.breakdown.motionControlScore,
    },
    {
      id: 'nocturnal-fullness',
      label: 'Nocturnal Fullness',
      pillarLabel: 'Overnight',
      pillarWeight: 0.15,
      subscoreWeight: 0.3,
      current: currentSnapshot.overnightSupportResult.breakdown.averageNocturnalFullnessScore,
      prior: priorSnapshot.overnightSupportResult.breakdown.averageNocturnalFullnessScore,
    },
    {
      id: 'nocturnal-duration',
      label: 'Nocturnal Duration',
      pillarLabel: 'Overnight',
      pillarWeight: 0.15,
      subscoreWeight: 0.25,
      current: currentSnapshot.overnightSupportResult.breakdown.averageNocturnalDurationScore,
      prior: priorSnapshot.overnightSupportResult.breakdown.averageNocturnalDurationScore,
    },
    {
      id: 'events-per-night',
      label: 'Events Per Night',
      pillarLabel: 'Overnight',
      pillarWeight: 0.15,
      subscoreWeight: 0.2,
      current: currentSnapshot.overnightSupportResult.breakdown.eventFrequencyScore,
      prior: priorSnapshot.overnightSupportResult.breakdown.eventFrequencyScore,
    },
    {
      id: 'overnight-consistency',
      label: 'Overnight Consistency',
      pillarLabel: 'Overnight',
      pillarWeight: 0.15,
      subscoreWeight: 0.15,
      current: currentSnapshot.overnightSupportResult.breakdown.nocturnalConsistencyScore,
      prior: priorSnapshot.overnightSupportResult.breakdown.nocturnalConsistencyScore,
    },
    {
      id: 'strongest-set',
      label: 'Strongest Set',
      pillarLabel: 'Overnight',
      pillarWeight: 0.15,
      subscoreWeight: 0.1,
      current: currentSnapshot.overnightSupportResult.breakdown.strongestSetSupportScore,
      prior: priorSnapshot.overnightSupportResult.breakdown.strongestSetSupportScore,
    },
    {
      id: 'reliability-peak-consistency',
      label: 'Peak Consistency',
      pillarLabel: 'Consistency',
      pillarWeight: 0.2,
      subscoreWeight: 0.25,
      current: currentSnapshot.consistencyReliabilityResult.breakdown.peakConsistencyScore,
      prior: priorSnapshot.consistencyReliabilityResult.breakdown.peakConsistencyScore,
    },
    {
      id: 'reliability-hold-consistency',
      label: 'Hold Consistency',
      pillarLabel: 'Consistency',
      pillarWeight: 0.2,
      subscoreWeight: 0.25,
      current: currentSnapshot.consistencyReliabilityResult.breakdown.holdConsistencyScore,
      prior: priorSnapshot.consistencyReliabilityResult.breakdown.holdConsistencyScore,
    },
    {
      id: 'active-day-density',
      label: 'Active Day Density',
      pillarLabel: 'Consistency',
      pillarWeight: 0.2,
      subscoreWeight: 0.15,
      current: currentSnapshot.consistencyReliabilityResult.breakdown.activeDayDensityScore,
      prior: priorSnapshot.consistencyReliabilityResult.breakdown.activeDayDensityScore,
    },
    {
      id: 'archive-maturity',
      label: 'Archive Maturity',
      pillarLabel: 'Consistency',
      pillarWeight: 0.2,
      subscoreWeight: 0.15,
      current: currentSnapshot.consistencyReliabilityResult.breakdown.archiveMaturityScore,
      prior: priorSnapshot.consistencyReliabilityResult.breakdown.archiveMaturityScore,
    },
    {
      id: 'pattern-reliability',
      label: 'Pattern Reliability',
      pillarLabel: 'Consistency',
      pillarWeight: 0.2,
      subscoreWeight: 0.2,
      current: currentSnapshot.consistencyReliabilityResult.breakdown.patternReliabilityScore,
      prior: priorSnapshot.consistencyReliabilityResult.breakdown.patternReliabilityScore,
    },
  ] as const;

  return descriptors
    .map(descriptor => {
      const delta = descriptor.current - descriptor.prior;
      const impact = delta * descriptor.pillarWeight * descriptor.subscoreWeight;

      return {
        id: descriptor.id,
        label: descriptor.label,
        pillarLabel: descriptor.pillarLabel,
        delta,
        impact,
        direction: delta >= 0 ? 'up' : 'down',
      } satisfies ArcEdgeRecentSwing;
    })
    .filter(swing => swing.delta !== 0)
    .sort((left, right) => Math.abs(right.impact) - Math.abs(left.impact) || Math.abs(right.delta) - Math.abs(left.delta));
}

function buildEdgeScoreModel({
  calibration,
  calibrationTracks,
  thresholdModel,
  featureAvailability: _featureAvailability,
  scoredSessions,
  motionSessions,
  nocturnalSessions,
  buildSamples,
  durationSamples,
  recoverySamples,
  reboundSamples,
  stabilitySamples,
  liveTelemetry,
  trendHistory,
  autonomousPeakEvents,
  wearStreakDays: _wearStreakDays,
  simulatedDate,
}: {
  calibration: ArcCalibrationStatus;
  calibrationTracks: ArcCalibrationTrack[];
  thresholdModel: ArcThresholdModel;
  featureAvailability: ArcFeatureAvailability;
  scoredSessions: Session[];
  motionSessions: Session[];
  nocturnalSessions: Session[];
  buildSamples: number[];
  durationSamples: number[];
  recoverySamples: number[];
  reboundSamples: number[];
  stabilitySamples: number[];
  liveTelemetry: ArcLiveTelemetry | null;
  trendHistory: Array<{ timestamp: number; value: number; linePhase?: ArcLiveLinePhase }>;
  autonomousPeakEvents: ArcAutonomousPeakEvent[];
  wearStreakDays: number;
  simulatedDate?: Date;
}): ArcEdgeScoreModel {
  const peakMarks = scoredSessions
    .filter((session): session is Session & { peakLevel: number } => typeof session.peakLevel === 'number')
    .map(session => session.peakLevel)
    .concat(autonomousPeakEvents.map(event => event.peakLevel));
  const profile = buildEdgePersonalProfile({
    calibration,
    thresholdModel,
    buildSamples,
    durationSamples,
    recoverySamples,
    reboundSamples,
    stabilitySamples,
    peakMarks,
  });

  const sortedTrendHistory = [...trendHistory].sort((left, right) => left.timestamp - right.timestamp);
  const nowTimestamp =
    simulatedDate?.getTime() ?? sortedTrendHistory[sortedTrendHistory.length - 1]?.timestamp ?? Date.now();
  const currentSnapshot = computeModernEdgeScoreSnapshot({
    calibration,
    calibrationTracks,
    thresholdModel,
    scoredSessions,
    motionSessions,
    nocturnalSessions,
    liveTelemetry,
    trendHistory: sortedTrendHistory,
    autonomousPeakEvents,
    simulatedDate,
    profile,
  });

  const hasMeaningfulData =
    currentSnapshot.trustProgress > 0.08 ||
    scoredSessions.length > 0 ||
    nocturnalSessions.length > 0 ||
    autonomousPeakEvents.length > 0;
  const unlockProgress = clamp(currentSnapshot.trustProgress * 0.72 + calibration.progress * 0.28, 0, 1);
  const unlockPercentage = Math.round(unlockProgress * 100);
  const unlocked = hasMeaningfulData;
  const value = unlocked ? currentSnapshot.visibleScore : null;

  const dayAgoTimestamp = nowTimestamp - 24 * 60 * 60 * 1000;
  const priorScoredSessions = scoredSessions.filter(session => {
    const timestamp = getEdgeSessionTimestamp(session, simulatedDate);
    return timestamp != null && timestamp <= dayAgoTimestamp;
  });
  const priorMotionSessions = motionSessions.filter(session => {
    const timestamp = getEdgeSessionTimestamp(session, simulatedDate);
    return timestamp != null && timestamp <= dayAgoTimestamp;
  });
  const priorNocturnalSessions = nocturnalSessions.filter(session => {
    const timestamp = getEdgeSessionTimestamp(session, simulatedDate);
    return timestamp != null && timestamp <= dayAgoTimestamp;
  });
  const priorTrendHistory = sortedTrendHistory.filter(point => point.timestamp <= dayAgoTimestamp);
  const priorAutonomousPeakEvents = autonomousPeakEvents.filter(event => event.timestamp <= dayAgoTimestamp);
  const priorSnapshot =
    priorTrendHistory.length > 0 ||
    priorScoredSessions.length > 0 ||
    priorNocturnalSessions.length > 0 ||
    priorAutonomousPeakEvents.length > 0
      ? computeModernEdgeScoreSnapshot({
          calibration,
          calibrationTracks,
          thresholdModel,
          scoredSessions: priorScoredSessions,
          motionSessions: priorMotionSessions,
          nocturnalSessions: priorNocturnalSessions,
          liveTelemetry: null,
          trendHistory: priorTrendHistory,
          autonomousPeakEvents: priorAutonomousPeakEvents,
          simulatedDate: new Date(dayAgoTimestamp),
          profile,
        })
      : null;

  const dayDelta = unlocked && value != null && priorSnapshot ? value - priorSnapshot.visibleScore : null;
  const recentImpactCatalog = unlocked ? buildRecentEdgeImpactSwings(currentSnapshot, priorSnapshot) : [];
  const recentImpactSwings = recentImpactCatalog.slice(0, 3);
  const trendDirection = getEdgeTrendDirectionFromScores(value, priorSnapshot?.visibleScore ?? null);
  const state = getModernEdgeState({
    unlocked,
    maturityLabel: currentSnapshot.maturityLabel,
    score: value,
    baselineReadiness: currentSnapshot.baselineReadiness,
    erectionQuality: currentSnapshot.erectionQuality,
    sessionPerformance: currentSnapshot.sessionPerformance,
    consistencyReliability: currentSnapshot.consistencyReliability,
    confidence: currentSnapshot.confidence,
    trendDirection,
  });
  const copy = getModernEdgeScoreCopy({
    state,
    unlocked,
    score: value,
    maturityLabel: currentSnapshot.maturityLabel,
  });
  const readiness = Math.round(
    clamp(
      currentSnapshot.baselineReadiness * 0.52 +
        currentSnapshot.overnightSupport * 0.18 +
        currentSnapshot.consistencyReliability * 0.3,
      0,
      100,
    ),
  );
  const performance = Math.round(
    clamp(currentSnapshot.erectionQuality * 0.58 + currentSnapshot.sessionPerformance * 0.42, 0, 100),
  );
  const stability = Math.round(
    clamp(currentSnapshot.consistencyReliability * 0.62 + currentSnapshot.overnightSupport * 0.38, 0, 100),
  );

  return {
    unlocked,
    unlockProgress,
    unlockPercentage,
    value,
    dayDelta,
    state,
    status: copy.status,
    trendDirection,
    confidence: currentSnapshot.confidence,
    confidenceLabel: getEdgeModelConfidenceLabel(currentSnapshot.confidence),
    maturityLabel: currentSnapshot.maturityLabel,
    baselineReadiness: currentSnapshot.baselineReadiness,
    erectionQuality: currentSnapshot.erectionQuality,
    sessionPerformance: currentSnapshot.sessionPerformance,
    overnightSupport: currentSnapshot.overnightSupport,
    consistencyReliability: currentSnapshot.consistencyReliability,
    readiness,
    performance,
    stability,
    profile: {
      baselineMean: Number(profile.baselineMean.toFixed(1)),
      baselineLow: Number(profile.baselineLow.toFixed(1)),
      baselineHigh: Number(profile.baselineHigh.toFixed(1)),
      averageMaxExpansion: Number(profile.averageMaxExpansion.toFixed(1)),
      averageHoldQuality: Number(profile.averageHoldQuality.toFixed(1)),
      averageRecoveryQuality: Number(profile.averageRecoveryQuality.toFixed(1)),
      calibrationConfidence: Number(profile.calibrationConfidence.toFixed(1)),
    },
    baselineReadinessBreakdown: currentSnapshot.baselineReadinessResult.breakdown,
    baselineReadinessRawValues: currentSnapshot.baselineReadinessRawValues,
    erectionQualityBreakdown: currentSnapshot.erectionQualityResult.breakdown,
    erectionQualityRawValues: currentSnapshot.erectionQualityRawValues,
    sessionPerformanceBreakdown: currentSnapshot.sessionPerformanceResult.breakdown,
    sessionPerformanceRawValues: currentSnapshot.sessionPerformanceRawValues,
    overnightSupportBreakdown: currentSnapshot.overnightSupportResult.breakdown,
    overnightSupportRawValues: currentSnapshot.overnightSupportRawValues,
    consistencyReliabilityBreakdown: currentSnapshot.consistencyReliabilityResult.breakdown,
    consistencyReliabilityRawValues: currentSnapshot.consistencyReliabilityRawValues,
    confidenceBreakdown: currentSnapshot.confidenceResult.breakdown,
    recentImpactSwings,
    recentImpactCatalog,
    primaryLine: copy.primaryLine,
    secondaryLine: copy.secondaryLine,
    ctaLabel: copy.ctaLabel,
    detailBody: copy.detailBody,
    methodologyLine:
      'Five pillars weighted into EDGE: Baseline Readiness 10%, Erection Quality 30%, Session Performance 25%, Overnight Support 15%, Discipline & Diligence 20%. Last 7 days carry the most weight, then days 8 to 14, then days 15 to 30.',
  };
}

function buildMilestones(totalSessions: number, calibration: ArcCalibrationStatus): Milestone[] {
  return [
    {
      id: 'm1',
      type: 'milestone',
      title: 'First session captured',
      subtitle: totalSessions >= 1 ? 'Your signal archive has started' : 'Unlocks after your first captured session',
      achieved: totalSessions >= 1,
      date: totalSessions >= 1 ? 'Today' : undefined,
    },
    {
      id: 'm2',
      type: 'milestone',
      title: 'Baseline learning',
      subtitle:
        totalSessions >= 2
          ? 'Signal understanding is improving with each capture'
          : calibration.progressLabel,
      achieved: totalSessions >= 2,
      date: totalSessions >= 2 ? 'Today' : undefined,
    },
    {
      id: 'm3',
      type: 'streak',
      title: 'Edge Score readiness',
      subtitle:
        totalSessions >= 4
          ? 'Baseline confidence is ready for a more precise Edge Score'
          : 'Unlocks once enough early signal history is collected',
      achieved: totalSessions >= 4,
      date: totalSessions >= 4 ? 'Today' : undefined,
    },
  ];
}

function getSessionPool(recordedSessions: Session[], personalBestsEnabled = true): Session[] {
  return applyPersonalBestSessions(recordedSessions, personalBestsEnabled).sort((left, right) => {
    const leftTimestamp = left.capturedAt ?? 0;
    const rightTimestamp = right.capturedAt ?? 0;
    return rightTimestamp - leftTimestamp;
  });
}

function buildPlaceholderSeries(center: number, variation: number): number[] {
  return Array.from({ length: 7 }, (_, index) =>
    Number((center + Math.sin(index * 0.82) * variation + Math.cos(index * 0.44) * variation * 0.36).toFixed(1)),
  );
}

const GOAL_LIBRARY_ACCENT_COLORS = {
  edgeScore: '#FF3B3B',
  erectionQuality: '#00C27A',
  sessionQuality: '#FF4FA3',
  discipline: '#6A4DFF',
  overnightSupport: '#3A7BFF',
  baselineSteadiness: '#FF9F3A',
} as const;

function buildGoalLibrary(): ArcGoalDefinition[] {
  return [
    {
      id: 'edge-score',
      label: 'Edge Score',
      category: 'broad',
      description: 'The flagship five-pillar score that blends recent performance into one clear read.',
      relatedModules: ['Edge', 'Trend', 'Profile', 'Sessions'],
      accentColor: GOAL_LIBRARY_ACCENT_COLORS.edgeScore,
    },
    {
      id: 'erection-quality',
      label: 'Erection Quality',
      category: 'broad',
      description: 'Focuses on stronger build quality, steadier holds, and more reliable expansion behavior.',
      relatedModules: ['Active', 'Build', 'Sessions', 'Edge'],
      accentColor: GOAL_LIBRARY_ACCENT_COLORS.erectionQuality,
    },
    {
      id: 'session-quality',
      label: 'Session Quality',
      category: 'broad',
      description: 'Tracks the quality of qualified sessions, motion performance, and usable response strength.',
      relatedModules: ['Sessions', 'Motion', 'Active', 'Edge'],
      accentColor: GOAL_LIBRARY_ACCENT_COLORS.sessionQuality,
    },
    {
      id: 'discipline',
      label: 'Discipline',
      category: 'broad',
      description: 'Centers on repeatability, streak continuity, pattern trust, and recovery-aware usage.',
      relatedModules: ['Wear Streak', 'Recovery', 'Profile'],
      accentColor: GOAL_LIBRARY_ACCENT_COLORS.discipline,
    },
    {
      id: 'overnight-support',
      label: 'Overnight Support',
      category: 'broad',
      description: 'Builds a stronger overnight profile through nocturnal capture depth and repeatability.',
      relatedModules: ['Nocturnal', 'Recovery', 'Trend', 'Edge'],
      accentColor: GOAL_LIBRARY_ACCENT_COLORS.overnightSupport,
    },
    {
      id: 'baseline-steadiness',
      label: 'Baseline Steadiness',
      category: 'broad',
      description: 'Represents resting-state stability, baseline clarity, and low-state confidence through the day.',
      relatedModules: ['Resting', 'Live', 'Profile', 'Edge'],
      accentColor: GOAL_LIBRARY_ACCENT_COLORS.baselineSteadiness,
    },
  ];
}

function getGoalById(goalLibrary: ArcGoalDefinition[], goalId: string) {
  return goalLibrary.find(goal => goal.id === goalId) ?? null;
}

function buildCurrentGoal(
  goalLibrary: ArcGoalDefinition[],
  calibrationTracks: ArcCalibrationTrack[],
  featureAvailability: ArcFeatureAvailability,
): ArcCurrentGoal {
  const baselineTrack = calibrationTracks.find(track => track.key === 'baseline')!;
  const peakTrack = calibrationTracks.find(track => track.key === 'peak')!;
  const nocturnalTrack = calibrationTracks.find(track => track.key === 'nocturnal')!;

  const makeCurrentGoal = (goalId: string, activeFocusLabel: string | null, progressHint: string): ArcCurrentGoal => {
    const primaryGoal = getGoalById(goalLibrary, goalId)!;

    return {
      id: primaryGoal.id,
      label: primaryGoal.label,
      category: primaryGoal.category,
      description: primaryGoal.description,
      relatedModules: primaryGoal.relatedModules,
      accentColor: primaryGoal.accentColor,
      activeFocusLabel,
      progressHint,
    };
  };

  if (!baselineTrack.established) {
    return makeCurrentGoal(
      'baseline-steadiness',
      'Establish resting reference',
      `${baselineTrack.progressLabel} recorded toward your resting-state reference`,
    );
  }

  if (!peakTrack.established) {
    return makeCurrentGoal(
      'erection-quality',
      'Establish peak reference',
      `${peakTrack.progressLabel} captured toward your personal 100% line`,
    );
  }

  if (!nocturnalTrack.established) {
    return makeCurrentGoal(
      'overnight-support',
      'Build overnight profile',
      `${nocturnalTrack.progressLabel} building your overnight profile`,
    );
  }

  if (!featureAvailability.edgeScore) {
    return makeCurrentGoal(
      'edge-score',
      'Raise EDGE confidence',
      'Edge is refining as deeper profile confidence comes online',
    );
  }

  return makeCurrentGoal(
    'edge-score',
    'Edge Score',
    'Session quality, discipline, baseline steadiness, and overnight support are all contributing',
  );
}

export function buildArcAppData(
  recordedSessions: Session[],
  liveTelemetry: ArcLiveTelemetry | null,
  userProfileOverride?: ArcUserProfileOverride | null,
  appOpenSimulatedMinutes = 0,
  foundationClockElapsedMinutes = appOpenSimulatedMinutes,
  trendHistory: Array<{ timestamp: number; value: number; linePhase?: ArcLiveLinePhase }> = [],
  simulatedDate?: Date,
  autonomousPeakEvents: ArcAutonomousPeakEvent[] = [],
  lifetimeRecordedSessions: Session[] = recordedSessions,
): ArcAppDataSnapshot {
  const calibrationTracks = buildCalibrationTracks(
    recordedSessions,
    liveTelemetry,
    appOpenSimulatedMinutes,
    trendHistory,
    simulatedDate,
    autonomousPeakEvents,
  );
  const thresholdModel = buildThresholdModel(calibrationTracks);
  const calibration = buildCalibrationStatus(calibrationTracks);
  const recordsUnlocked = calibration.progress >= 1;
  const sessionPool = getSessionPool(recordedSessions, recordsUnlocked);
  const lifetimeSessionPool = getSessionPool(lifetimeRecordedSessions, true);
  const totalSessions = sessionPool.length;
  const latestMotionSession = sessionPool.find(session => session.type === 'motion') ?? null;
  const latestStaticSession = sessionPool.find(session => session.type === 'static') ?? null;
  const latestNocturnalSession = sessionPool.find(session => session.type === 'nocturnal') ?? null;
  const featureAvailability = buildFeatureAvailability(calibrationTracks, totalSessions);
  const wearStreakDays = 1 + Math.floor(appOpenSimulatedMinutes / (24 * 60));
  const goalLibrary = buildGoalLibrary();
  const currentGoal = buildCurrentGoal(goalLibrary, calibrationTracks, featureAvailability);

  const scoredSessions = sessionPool.filter(session => session.type !== 'nocturnal');
  const motionSessions = sessionPool.filter(session => session.type === 'motion');
  const staticSessions = sessionPool.filter(session => session.type === 'static');
  const nocturnalSessions = sessionPool.filter(session => session.type === 'nocturnal');
  const lifetimeMotionSessions = lifetimeSessionPool.filter(session => session.type === 'motion');
  const lifetimeStaticSessions = lifetimeSessionPool.filter(session => session.type === 'static');
  const lifetimeNocturnalSessions = lifetimeSessionPool.filter(session => session.type === 'nocturnal');
  const buildSamples = scoredSessions
    .map(session => parseDurationToSeconds(session.metrics.buildSpeed))
    .filter((value): value is number => value != null);
  const stabilitySamples = scoredSessions
    .map(session => session.metrics.stability)
    .filter((value): value is number => Number.isFinite(value));
  const durationSamples = scoredSessions
    .map(session => parseDurationToSeconds(session.metrics.duration))
    .filter((value): value is number => value != null);
  const recoverySamples = scoredSessions
    .map(session => parseDurationToSeconds(session.metrics.recovery))
    .filter((value): value is number => value != null);
  const reboundSamples = scoredSessions
    .map(session => parseDurationToSeconds(session.metrics.rebound))
    .filter((value): value is number => value != null);
  const cadenceSamples = motionSessions
    .map(session => parseCadence(session.motion?.cadence))
    .filter((value): value is number => value != null);
  const nocturnalSamples = nocturnalSessions.map(session => session.nocturnalEvents ?? 0);
  const buildSamplesAll = lifetimeSessionPool
    .map(session => parseDurationToSeconds(session.metrics.buildSpeed))
    .filter((value): value is number => value != null);
  const motionBuildSamples = lifetimeMotionSessions
    .map(session => parseDurationToSeconds(session.metrics.buildSpeed))
    .filter((value): value is number => value != null);
  const staticBuildSamples = lifetimeStaticSessions
    .map(session => parseDurationToSeconds(session.metrics.buildSpeed))
    .filter((value): value is number => value != null);
  const recoverySamplesAll = lifetimeSessionPool
    .map(session => parseDurationToSeconds(session.metrics.recovery))
    .filter((value): value is number => value != null);
  const reboundSamplesAll = lifetimeSessionPool
    .map(session => parseDurationToSeconds(session.metrics.rebound))
    .filter((value): value is number => value != null);
  const sessionDurationSamples = lifetimeSessionPool
    .map(session => parseDurationToSeconds(session.metrics.duration))
    .filter((value): value is number => value != null);
  const motionDurationSamples = lifetimeMotionSessions
    .map(session => parseDurationToSeconds(session.metrics.duration))
    .filter((value): value is number => value != null);
  const staticDurationSamples = lifetimeStaticSessions
    .map(session => parseDurationToSeconds(session.metrics.duration))
    .filter((value): value is number => value != null);
  const nocturnalDurationSamples = lifetimeNocturnalSessions
    .map(session => parseDurationToSeconds(session.metrics.duration))
    .filter((value): value is number => value != null);
  const peakSamples = lifetimeSessionPool
    .map(session => session.peakLevel)
    .filter((value): value is number => value != null);
  const motionPeakSamples = lifetimeMotionSessions
    .map(session => session.peakLevel)
    .filter((value): value is number => value != null);
  const staticPeakSamples = lifetimeStaticSessions
    .map(session => session.peakLevel)
    .filter((value): value is number => value != null);
  const nocturnalPeakSamples = lifetimeNocturnalSessions
    .map(session => session.peakLevel)
    .filter((value): value is number => value != null);
  const allStabilitySamples = lifetimeSessionPool
    .map(session => session.metrics.stability)
    .filter((value): value is number => Number.isFinite(value));
  const motionStabilitySamples = lifetimeMotionSessions
    .map(session => session.metrics.stability)
    .filter((value): value is number => Number.isFinite(value));
  const staticStabilitySamples = lifetimeStaticSessions
    .map(session => session.metrics.stability)
    .filter((value): value is number => Number.isFinite(value));
  const nocturnalStabilitySamples = lifetimeNocturnalSessions
    .map(session => session.metrics.stability)
    .filter((value): value is number => Number.isFinite(value));
  const holdScoreSamples = lifetimeSessionPool
    .map(session => scoreSessionHoldQuality(session.metrics.holdQuality))
    .filter((value): value is number => Number.isFinite(value));
  const driveCountSamples = lifetimeMotionSessions
    .map(session => session.motion?.driveCount)
    .filter((value): value is number => value != null);
  const cadenceAverageSamples = lifetimeMotionSessions
    .map(session => parseCadence(session.motion?.cadenceAvg ?? session.motion?.cadence))
    .filter((value): value is number => value != null);
  const cadencePeakSamples = lifetimeMotionSessions
    .map(session => parseCadence(session.motion?.cadencePeak))
    .filter((value): value is number => value != null);
  const rhythmConsistencySamples = lifetimeMotionSessions
    .map(session => session.motion?.rhythmConsistency)
    .filter((value): value is number => value != null);
  const motionStabilityMetricSamples = lifetimeMotionSessions
    .map(session => session.motion?.motionStability)
    .filter((value): value is number => value != null);
  const driveIntervalSamples = lifetimeMotionSessions
    .map(session => parseDurationToSeconds(session.motion?.averageDriveInterval))
    .filter((value): value is number => value != null);
  const nocturnalQualitySamples = lifetimeNocturnalSessions
    .map(session => session.nocturnalQuality ?? scoreSessionPeakQuality(session.overnightStability))
    .filter((value): value is number => Number.isFinite(value));

  const latestBuildSeconds = parseDurationToSeconds(latestMotionSession?.metrics.buildSpeed) ?? null;
  const averageBuildSeconds = average(buildSamples);
  const latestDurationSeconds = parseDurationToSeconds(latestMotionSession?.metrics.duration) ?? null;
  const averageDurationSeconds = average(durationSamples);
  const latestRecoverySeconds = parseDurationToSeconds(latestMotionSession?.metrics.recovery) ?? null;
  const averageRecoverySeconds = average(recoverySamples);
  const bestRecoverySeconds = recoverySamples.length > 0 ? Math.min(...recoverySamples) : null;
  const latestReboundSeconds = parseDurationToSeconds(latestMotionSession?.metrics.rebound) ?? null;
  const bestReboundSeconds = reboundSamples.length > 0 ? Math.min(...reboundSamples) : null;
  const averageStability = Math.round(average(stabilitySamples) ?? 0);
  const averageCadence = average(cadenceSamples);
  const edgeScore = buildEdgeScoreModel({
    calibration,
    calibrationTracks,
    thresholdModel,
    featureAvailability,
    scoredSessions,
    motionSessions,
    nocturnalSessions,
    buildSamples,
    durationSamples,
    recoverySamples,
    reboundSamples,
    stabilitySamples,
    liveTelemetry,
    trendHistory,
    autonomousPeakEvents,
    wearStreakDays,
    simulatedDate,
  });
  const restHistory = liveTelemetry?.history.length ? downsample(liveTelemetry.history, 7) : [];
  const restingTrendSeries = restHistory.length > 0 ? extendSeries(buildPlaceholderSeries(thresholdModel.baseline, 0.6), restHistory, 7) : buildPlaceholderSeries(thresholdModel.baseline, 0.5);
  const buildTrendSeries =
    buildSamples.length > 0
      ? extendSeries(buildPlaceholderSeries(2.6, 0.16), downsample(buildSamples.map(value => Number((value / 60).toFixed(1))), 7), 7)
      : buildPlaceholderSeries(2.6, 0.1);
  const stabilityTrendSeries =
    stabilitySamples.length > 0
      ? extendSeries(buildPlaceholderSeries(32, 2.4), downsample(stabilitySamples, 7), 7)
      : buildPlaceholderSeries(32, 1.1);
  const durationTrendSeries =
    durationSamples.length > 0
      ? extendSeries(buildPlaceholderSeries(6.2, 0.4), downsample(durationSamples.map(value => Number((value / 60).toFixed(1))), 7), 7)
      : buildPlaceholderSeries(6.2, 0.22);
  const recoveryTrendSeries =
    recoverySamples.length > 0
      ? extendSeries(buildPlaceholderSeries(11.4, 0.45), downsample(recoverySamples.map(value => Number((value / 60).toFixed(1))), 7), 7)
      : buildPlaceholderSeries(11.4, 0.28);
  const nocturnalTrendSeries =
    nocturnalSamples.length > 0
      ? extendSeries(buildPlaceholderSeries(1.4, 0.3), downsample(nocturnalSamples, 7), 7)
      : buildPlaceholderSeries(1.4, 0.18);
  const activeStateLabel = latestMotionSession?.statusLabel.replace(' Session', '') ?? 'Learning';
  const nocturnalTotalMinutes = latestNocturnalSession
    ? Math.round((latestNocturnalSession.nocturnalEvents ?? 0) * NOCTURNAL_APPROX_EVENT_MINUTES)
    : 0;
  const newestSession = lifetimeSessionPool[0];
  const oldestSession = lifetimeSessionPool[lifetimeSessionPool.length - 1];
  const activeDays = new Set(lifetimeSessionPool.map(getSessionDayKey)).size;
  const lifetimeTotalSessions = lifetimeSessionPool.length;
  const totalMotionSessions = lifetimeMotionSessions.length;
  const totalStaticSessions = lifetimeStaticSessions.length;
  const totalNocturnalSessions = lifetimeNocturnalSessions.length;
  const totalPersonalBestSessions = lifetimeSessionPool.filter(session => session.isPersonalBest).length;
  const totalActiveTimeSeconds = lifetimeSessionPool.reduce(
    (sum, session) => sum + (parseDurationToSeconds(session.metrics.duration) ?? 0),
    0,
  );
  const totalMotionTimeSeconds = motionDurationSamples.reduce((sum, value) => sum + value, 0);
  const totalStaticTimeSeconds = staticDurationSamples.reduce((sum, value) => sum + value, 0);
  const totalNocturnalTimeSeconds = nocturnalDurationSamples.reduce((sum, value) => sum + value, 0);
  const averageSessionDurationSeconds =
    lifetimeTotalSessions > 0 ? Math.round(totalActiveTimeSeconds / lifetimeTotalSessions) : 0;
  const averageMotionDurationSeconds = Math.round(average(motionDurationSamples) ?? 0);
  const averageStaticDurationSeconds = Math.round(average(staticDurationSamples) ?? 0);
  const averageNocturnalDurationSeconds = Math.round(average(nocturnalDurationSamples) ?? 0);
  const longestSessionSeconds =
    sessionDurationSamples.length > 0 ? Math.max(...sessionDurationSamples) : 0;
  const shortestSessionSeconds =
    sessionDurationSamples.length > 0 ? Math.min(...sessionDurationSamples) : 0;
  const bestPeakLevel =
    peakSamples.length > 0 ? Math.max(...peakSamples) : 0;
  const averagePeakLevel = average(peakSamples);
  const averageMotionPeakLevel = average(motionPeakSamples);
  const averageStaticPeakLevel = average(staticPeakSamples);
  const averageNocturnalPeakLevel = average(nocturnalPeakSamples);
  const peakSessionsAtOrAbovePeakLine = lifetimeSessionPool.filter(session => (session.peakLevel ?? 0) >= thresholdModel.peak).length;
  const peakSessionsAtOrAboveRecordLine = lifetimeSessionPool.filter(session => (session.peakLevel ?? 0) >= thresholdModel.record).length;
  const fastestBuildAllSeconds = buildSamplesAll.length > 0 ? Math.min(...buildSamplesAll) : null;
  const averageBuildAllSeconds = average(buildSamplesAll);
  const averageMotionBuildSeconds = average(motionBuildSamples);
  const averageStaticBuildSeconds = average(staticBuildSamples);
  const fastestRecoveryAllSeconds = recoverySamplesAll.length > 0 ? Math.min(...recoverySamplesAll) : null;
  const averageRecoveryAllSeconds = average(recoverySamplesAll);
  const fastestReboundAllSeconds = reboundSamplesAll.length > 0 ? Math.min(...reboundSamplesAll) : null;
  const averageReboundAllSeconds = average(reboundSamplesAll);
  const averageAllStability = average(allStabilitySamples);
  const bestStabilityValue = allStabilitySamples.length > 0 ? Math.max(...allStabilitySamples) : null;
  const averageMotionStabilityValue = average(motionStabilitySamples);
  const averageStaticStabilityValue = average(staticStabilitySamples);
  const averageNocturnalStabilityValue = average(nocturnalStabilitySamples);
  const averageHoldScoreValue = average(holdScoreSamples);
  const lifetimeDriveCount = lifetimeSessionPool.reduce((sum, session) => sum + (session.motion?.driveCount ?? 0), 0);
  const averageDriveCount = average(driveCountSamples);
  const bestDriveCount = driveCountSamples.length > 0 ? Math.max(...driveCountSamples) : null;
  const weightedAverageCadence = cadenceAverageSamples.length > 0 ? `${Math.round(average(cadenceAverageSamples) ?? 0)}/min` : '--';
  const peakCadenceValue = cadencePeakSamples.length > 0 ? Math.max(...cadencePeakSamples) : null;
  const averagePeakCadenceValue = average(cadencePeakSamples);
  const averageRhythmConsistencyValue = average(rhythmConsistencySamples);
  const averageMotionStabilityMetricValue = average(motionStabilityMetricSamples);
  const averageDriveIntervalSeconds = average(driveIntervalSamples);
  const totalNocturnalEvents = nocturnalSamples.reduce((sum, value) => sum + value, 0);
  const averageNocturnalEvents = average(nocturnalSamples);
  const strongestNocturnalSet = nocturnalSamples.length > 0 ? Math.max(...nocturnalSamples) : null;
  const averageNocturnalQualityValue = average(nocturnalQualitySamples);
  const bestNocturnalQualityValue = nocturnalQualitySamples.length > 0 ? Math.max(...nocturnalQualitySamples) : null;
  const consistentMotionSessions = lifetimeMotionSessions.filter(session => session.motion?.rhythm === 'Consistent').length;
  const variableMotionSessions = lifetimeMotionSessions.filter(session => session.motion?.rhythm === 'Variable').length;
  const irregularMotionSessions = lifetimeMotionSessions.filter(session => session.motion?.rhythm === 'Irregular').length;
  const rhythmTrend =
    lifetimeMotionSessions.length === 0
      ? 'stable'
      : consistentMotionSessions / lifetimeMotionSessions.length > 0.58
        ? 'improving'
        : irregularMotionSessions / lifetimeMotionSessions.length > 0.2
          ? 'declining'
          : 'stable';
  const restingStatus =
    liveTelemetry == null
      ? 'stable'
      : liveTelemetry.currentValue < thresholdModel.reduced
        ? 'reduced'
        : liveTelemetry.currentValue >= thresholdModel.elevated
          ? 'elevated'
          : 'stable';
  const restingSummary =
    totalSessions === 0
      ? 'Live signal is active while your baseline is still being learned'
      : describeLiveStatus(liveTelemetry);
  const buildDirection = numericTrend(latestBuildSeconds, averageBuildSeconds, 10, false);
  const durationDirection = numericTrend(latestDurationSeconds, averageDurationSeconds, 45, true);
  const recoveryDirection = numericTrend(latestRecoverySeconds, averageRecoverySeconds, 25, false);
  const personalRecords = buildPersonalRecords(lifetimeRecordedSessions, true);
  const buildPersonalBest =
    buildPersonalRecords(recordedSessions, recordsUnlocked).find(record => record.label === 'Fastest Build')?.value ??
    'Not enough data';
  const latestBuildLabel = latestMotionSession?.metrics.buildSpeed ?? 'No data yet';
  const averageBuildLabel = averageBuildSeconds != null ? formatMinuteSecondLabel(averageBuildSeconds) : 'Not enough data';
  const latestDurationLabel = latestMotionSession?.metrics.duration ?? 'No data yet';
  const averageDurationLabel = averageDurationSeconds != null ? formatMinuteSecondLabel(averageDurationSeconds) : 'Not enough data';
  const latestRecoveryLabel = latestMotionSession?.metrics.recovery ?? 'No data yet';
  const bestRecoveryLabel = bestRecoverySeconds != null ? formatMinutesDecimal(bestRecoverySeconds) : 'Not enough data';
  const latestReboundLabel = latestMotionSession?.metrics.rebound ?? 'Not enough data';
  const bestReboundLabel = bestReboundSeconds != null ? formatMinutesDecimal(bestReboundSeconds) : 'Not enough data';
  const starterProgressPoints =
    totalSessions === 0
      ? 0
      : totalSessions === 1
        ? 6
        : Math.min(24, totalSessions * 6);
  const activeInsigniaTier = userProfileOverride?.tier ?? getActiveInsigniaTier(wearStreakDays);

  return {
    sessions: sessionPool,
    dashboardMetrics: {
      restingState: {
        status: restingStatus,
        trend: totalSessions === 0 ? calibration.progressLabel : restingSummary,
        baseline: thresholdModel.baselineReady ? describeBaselineRange(liveTelemetry) : `Baseline estimate ${thresholdModel.baseline.toFixed(1)}%`,
      },
      buildSpeed: {
        latest: latestBuildLabel,
        average: averageBuildLabel,
        indicator:
          latestMotionSession != null
            ? describeBuildIndicator(latestBuildSeconds, averageBuildSeconds)
            : 'Unlocks after your first captured session',
      },
      stability: {
        score: latestMotionSession?.metrics.stability ?? averageStability,
        note: liveTelemetry?.isSimulating
          ? 'Tracking live transition above resting state'
          : latestMotionSession?.statusLabel ?? 'Confidence builds with early signal history',
      },
      duration: {
        latest: latestDurationLabel,
        average: averageDurationLabel,
        direction: durationDirection,
      },
      recovery: {
        latest: latestRecoveryLabel,
        best: bestRecoveryLabel,
        trend: recoveryDirection,
      },
      rebound: {
        latest: latestReboundLabel,
        relevant: Boolean(latestMotionSession?.metrics.rebound),
      },
    },
    lifetimeStats: {
      archiveWindowDays:
        newestSession && oldestSession && typeof newestSession.capturedAt === 'number' && typeof oldestSession.capturedAt === 'number'
          ? Math.max(1, Math.round((newestSession.capturedAt - oldestSession.capturedAt) / (24 * 60 * 60 * 1000)) + 1)
          : lifetimeTotalSessions > 0
            ? 1
            : 0,
      archiveStartLabel: formatArchiveDateLabel(oldestSession),
      archiveEndLabel: formatArchiveDateLabel(newestSession),
      activeDays,
      sessionsPerActiveDay: activeDays > 0 ? formatFixedLabel(lifetimeTotalSessions / activeDays, 1) : '0.0',
      totalSessions: lifetimeTotalSessions,
      totalMotionSessions,
      totalStaticSessions,
      totalNocturnalSessions,
      totalPersonalBestSessions,
      motionSessionShare: lifetimeTotalSessions > 0 ? formatPercentLabel((totalMotionSessions / lifetimeTotalSessions) * 100) : '0%',
      staticSessionShare: lifetimeTotalSessions > 0 ? formatPercentLabel((totalStaticSessions / lifetimeTotalSessions) * 100) : '0%',
      nocturnalSessionShare: lifetimeTotalSessions > 0 ? formatPercentLabel((totalNocturnalSessions / lifetimeTotalSessions) * 100) : '0%',
      totalActiveTime: totalActiveTimeSeconds > 0 ? formatHourMinuteLabel(totalActiveTimeSeconds) : '0m',
      totalMotionTime: totalMotionTimeSeconds > 0 ? formatSessionLengthLabel(totalMotionTimeSeconds) : '0m',
      totalStaticTime: totalStaticTimeSeconds > 0 ? formatSessionLengthLabel(totalStaticTimeSeconds) : '0m',
      totalNocturnalTime: totalNocturnalTimeSeconds > 0 ? formatSessionLengthLabel(totalNocturnalTimeSeconds) : '0m',
      averageSessionDuration:
        averageSessionDurationSeconds > 0 ? formatSessionLengthLabel(averageSessionDurationSeconds) : '0m 00s',
      averageMotionDuration:
        averageMotionDurationSeconds > 0 ? formatSessionLengthLabel(averageMotionDurationSeconds) : '0m 00s',
      averageStaticDuration:
        averageStaticDurationSeconds > 0 ? formatSessionLengthLabel(averageStaticDurationSeconds) : '0m 00s',
      averageNocturnalDuration:
        averageNocturnalDurationSeconds > 0 ? formatSessionLengthLabel(averageNocturnalDurationSeconds) : '0m 00s',
      longestSession: longestSessionSeconds > 0 ? formatSessionLengthLabel(longestSessionSeconds) : '0m 00s',
      shortestSession: shortestSessionSeconds > 0 ? formatSessionLengthLabel(shortestSessionSeconds) : '0m 00s',
      bestPeak: bestPeakLevel > 0 ? `${Math.round(bestPeakLevel)}%` : '--',
      averagePeak: formatPercentLabel(averagePeakLevel, 1),
      averageMotionPeak: formatPercentLabel(averageMotionPeakLevel, 1),
      averageStaticPeak: formatPercentLabel(averageStaticPeakLevel, 1),
      averageNocturnalPeak: formatPercentLabel(averageNocturnalPeakLevel, 1),
      peakSessionsAtOrAbovePeakLine,
      peakSessionsAtOrAboveRecordLine,
      fastestBuild: fastestBuildAllSeconds != null ? formatSessionLengthLabel(fastestBuildAllSeconds) : 'Not enough data',
      averageBuild: averageBuildAllSeconds != null ? formatSessionLengthLabel(Math.round(averageBuildAllSeconds)) : 'Not enough data',
      averageMotionBuild: averageMotionBuildSeconds != null ? formatSessionLengthLabel(Math.round(averageMotionBuildSeconds)) : 'Not enough data',
      averageStaticBuild: averageStaticBuildSeconds != null ? formatSessionLengthLabel(Math.round(averageStaticBuildSeconds)) : 'Not enough data',
      fastestRecovery: fastestRecoveryAllSeconds != null ? formatSessionLengthLabel(fastestRecoveryAllSeconds) : 'Not enough data',
      averageRecovery: averageRecoveryAllSeconds != null ? formatSessionLengthLabel(Math.round(averageRecoveryAllSeconds)) : 'Not enough data',
      fastestRebound: fastestReboundAllSeconds != null ? formatSessionLengthLabel(fastestReboundAllSeconds) : 'Not enough data',
      averageRebound: averageReboundAllSeconds != null ? formatSessionLengthLabel(Math.round(averageReboundAllSeconds)) : 'Not enough data',
      averageStability: formatIntegerLabel(averageAllStability),
      bestStability: formatIntegerLabel(bestStabilityValue),
      averageMotionStability: formatIntegerLabel(averageMotionStabilityValue),
      averageStaticStability: formatIntegerLabel(averageStaticStabilityValue),
      averageNocturnalStability: formatIntegerLabel(averageNocturnalStabilityValue),
      averageHoldScore: formatIntegerLabel(averageHoldScoreValue),
      lifetimeDriveCount: lifetimeDriveCount.toLocaleString(),
      averageDriveCount: formatIntegerLabel(averageDriveCount),
      bestDriveCount: formatIntegerLabel(bestDriveCount),
      averageCadence: weightedAverageCadence,
      peakCadence: peakCadenceValue != null ? `${Math.round(peakCadenceValue)}/min` : '--',
      averagePeakCadence: averagePeakCadenceValue != null ? `${Math.round(averagePeakCadenceValue)}/min` : '--',
      averageRhythmConsistency: formatIntegerLabel(averageRhythmConsistencyValue),
      averageMotionControl: formatIntegerLabel(averageMotionStabilityMetricValue),
      averageDriveInterval: averageDriveIntervalSeconds != null ? formatSessionLengthLabel(Math.round(averageDriveIntervalSeconds)) : '--',
      consistentMotionSessions,
      variableMotionSessions,
      irregularMotionSessions,
      rhythmTrend,
      totalNocturnalEvents,
      averageNocturnalEvents: formatFixedLabel(averageNocturnalEvents, 1),
      strongestNocturnalSet: strongestNocturnalSet != null ? `${strongestNocturnalSet}` : '--',
      averageNocturnalQuality: formatIntegerLabel(averageNocturnalQualityValue),
      bestNocturnalQuality: formatIntegerLabel(bestNocturnalQualityValue),
    },
    personalRecords,
    milestones: buildMilestones(totalSessions, calibration),
    sparklines: {
      restingState: restingTrendSeries,
      buildSpeed: buildTrendSeries,
      stability: stabilityTrendSeries,
      duration: durationTrendSeries,
      recovery: recoveryTrendSeries,
      nocturnal: nocturnalTrendSeries,
    },
    userProfile: {
      ...baseUserProfile,
      tier: activeInsigniaTier,
      ...userProfileOverride,
      progressPoints: starterProgressPoints,
    },
    motionCadenceIntensity: buildMotionCadenceIntensity(latestMotionSession),
    liveTelemetry,
    latestMotionSession,
    latestStaticSession,
    latestNocturnalSession,
    recordedSessionCount: recordedSessions.length,
    highlights: {
      buildSpeedSevenDayAverage: averageBuildLabel,
      buildSpeedPersonalBest: recordsUnlocked ? buildPersonalBest : 'Unlocks after calibration',
      buildTrendLabel:
        totalSessions === 0
          ? 'Learning'
          : buildDirection === 'improving'
            ? 'Improving'
            : buildDirection === 'declining'
              ? 'Declining'
              : 'Stable',
      restingVariability7d: !thresholdModel.baselineReady ? 'Building' : toBandVariability(restingTrendSeries, 1.2, 2.4),
      restingVariability30d: featureAvailability.lifetime ? toBandVariability([...restingTrendSeries, ...restingTrendSeries], 1.4, 2.8) : 'Not enough data',
      restingBestStability: totalSessions === 0 ? 'Awaiting calibration' : `${Math.min(3 + recordedSessions.length, 7)} sessions`,
      activeStateLabel: featureAvailability.activeInsights ? activeStateLabel : 'Coming online',
      activeStateSummary:
        latestMotionSession?.statusLabel === 'Strong Session'
          ? 'Your first captured session is starting to shape active-state modeling'
          : latestMotionSession
            ? 'Active-state interpretation is beginning to take shape'
            : 'Active-state interpretation unlocks after your first captured session',
      holdVariability:
        latestMotionSession?.motion?.rhythm === 'Consistent'
          ? 'Low'
          : latestMotionSession?.motion?.rhythm === 'Variable'
            ? 'Moderate'
            : totalSessions === 0
              ? 'Not ready'
              : 'Low',
      recoveryTrendLabel:
        totalSessions === 0
          ? 'Recovery insight unlocks after early sessions'
          : recoveryDirection === 'improving'
            ? 'Faster than your current average'
            : recoveryDirection === 'declining'
              ? 'Recovering slower than recent average'
              : 'Recovery is tracking close to average',
      bestRebound: featureAvailability.recoveryInsights ? bestReboundLabel : 'Not enough data',
      recoveryThirtyDayAverage: featureAvailability.lifetime && averageRecoverySeconds != null ? formatMinutesDecimal(averageRecoverySeconds) : 'Not enough data',
      nocturnalTotalActive: latestNocturnalSession ? `${nocturnalTotalMinutes}m` : 'Awaiting overnight data',
      nocturnalTrendLabel:
        featureAvailability.nocturnal && latestNocturnalSession
          ? (latestNocturnalSession.nocturnalEvents ?? 0) >= 4
            ? 'Above baseline'
            : (latestNocturnalSession.nocturnalEvents ?? 0) >= 3
              ? 'Within range'
              : 'Below baseline'
          : 'Unlocks after early nights',
      liveStatusSummary: restingSummary,
    },
    calibration,
    calibrationTracks,
    thresholdModel,
    featureAvailability,
    edgeScore,
    wearStreakDays,
    foundationClockElapsedMinutes,
    goalLibrary,
    currentGoal,
  };
}
