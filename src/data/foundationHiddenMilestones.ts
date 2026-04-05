import type {
  FoundationHiddenInsightLink,
  FoundationHiddenMilestoneClusterDefinition,
  FoundationHiddenMilestoneDefinition,
  FoundationHiddenMilestoneMetricType,
} from './foundationHiddenMilestoneTypes';

type HiddenPulseFamily =
  | 'wear-depth'
  | 'wear-range'
  | 'baseline-depth'
  | 'baseline-range'
  | 'baseline-clarity'
  | 'session-depth'
  | 'session-range'
  | 'session-quality'
  | 'hold-quality'
  | 'motion-range'
  | 'static-range';

type HiddenMilestoneSeed = {
  id: string;
  title: string;
  metricType: FoundationHiddenMilestoneMetricType;
  threshold: number;
  visibleChecklistLink: string;
  pulseFamily: HiddenPulseFamily;
  pulsePriority?: FoundationHiddenMilestoneDefinition['pulsePriority'];
  pulseTitle?: string;
  pulseMessage?: string;
  pulseCategory?: FoundationHiddenMilestoneDefinition['pulseCategory'];
  summaryEligible?: boolean;
  directPulseEligible?: boolean;
};

const FOUNDATION_HIDDEN_MILESTONE_EXPECTED_COUNTS = {
  wearDepth: 28,
  baselineDepth: 26,
  sessionCapture: 18,
  sessionQuality: 14,
  sessionVariety: 14,
} as const;

const CLUSTER_INSIGHT_LINKS: Record<
  FoundationHiddenMilestoneDefinition['cluster'],
  FoundationHiddenInsightLink
> = {
  wearDepth: 'wearDepthImproving',
  baselineDepth: 'baselineClarityImproving',
  sessionCapture: 'sessionRangeImproving',
  sessionQuality: 'sessionQualityImproving',
  sessionVariety: 'sessionVarietyImproving',
};

function resolveDefaultPulse(seed: HiddenMilestoneSeed) {
  switch (seed.pulseFamily) {
    case 'wear-range':
      return {
        pulseTitle: 'Wear range expanded',
        pulseMessage: 'The app is building a deeper view of your normal wear pattern.',
        pulseCategory: 'insight' as const,
      };
    case 'baseline-range':
      return {
        pulseTitle: 'Baseline range expanded',
        pulseMessage: 'More baseline time helps sharpen your starting read.',
        pulseCategory: 'insight' as const,
      };
    case 'baseline-clarity':
      return {
        pulseTitle: 'Baseline clarity improved',
        pulseMessage: 'Your Foundation just gained a cleaner resting reference.',
        pulseCategory: 'insight' as const,
      };
    case 'session-range':
      return {
        pulseTitle: 'Session range expanded',
        pulseMessage: 'Your profile is gaining more variety across session types.',
        pulseCategory: 'insight' as const,
      };
    case 'session-quality':
      return {
        pulseTitle: 'Session quality improved',
        pulseMessage: 'Your early profile just gained stronger quality detail.',
        pulseCategory: 'insight' as const,
      };
    case 'hold-quality':
      return {
        pulseTitle: 'Stronger hold detected',
        pulseMessage: 'The app just recorded more stability within a session.',
        pulseCategory: 'accomplishment' as const,
      };
    case 'motion-range':
      return {
        pulseTitle: 'Motion range improved',
        pulseMessage: 'Active movement is expanding your early performance read.',
        pulseCategory: 'insight' as const,
      };
    case 'static-range':
      return {
        pulseTitle: 'Still-state range expanded',
        pulseMessage: 'A cleaner static reference is refining your early profile.',
        pulseCategory: 'insight' as const,
      };
    case 'baseline-depth':
      return {
        pulseTitle: 'Baseline depth increased',
        pulseMessage: 'The app is gaining a clearer view of your resting range.',
        pulseCategory: 'accomplishment' as const,
      };
    case 'session-depth':
      return {
        pulseTitle: 'Session depth increased',
        pulseMessage: 'Your response profile just gained more early session data.',
        pulseCategory: 'accomplishment' as const,
      };
    case 'wear-depth':
    default:
      return {
        pulseTitle: 'Wear depth increased',
        pulseMessage: 'Your Foundation just gained more on-body time.',
        pulseCategory: 'accomplishment' as const,
      };
  }
}

function resolvePulseDelivery(priority: FoundationHiddenMilestoneDefinition['pulsePriority']) {
  if (priority === 'veryHigh') {
    return {
      summaryEligible: false,
      directPulseEligible: true,
    };
  }

  if (priority === 'high' || priority === 'normal') {
    return {
      summaryEligible: true,
      directPulseEligible: true,
    };
  }

  return {
    summaryEligible: true,
    directPulseEligible: true,
  };
}

function createClusterMilestones(
  cluster: FoundationHiddenMilestoneDefinition['cluster'],
  seeds: HiddenMilestoneSeed[],
  sortBase: number,
): FoundationHiddenMilestoneDefinition[] {
  return seeds.map((seed, index) => {
    const pulsePriority = seed.pulsePriority ?? 'low';
    const pulseDefaults = resolveDefaultPulse(seed);
    const pulseDelivery = resolvePulseDelivery(pulsePriority);

    return {
      id: seed.id,
      cluster,
      title: seed.title,
      metricType: seed.metricType,
      threshold: seed.threshold,
      isRepeatable: false,
      visibleChecklistLink: seed.visibleChecklistLink,
      insightLink: CLUSTER_INSIGHT_LINKS[cluster],
      pulseTitle: seed.pulseTitle ?? pulseDefaults.pulseTitle,
      pulseMessage: seed.pulseMessage ?? pulseDefaults.pulseMessage,
      pulseCategory: seed.pulseCategory ?? pulseDefaults.pulseCategory,
      pulsePriority,
      pulseAccentPriority: pulsePriority,
      summaryEligible: seed.summaryEligible ?? pulseDelivery.summaryEligible,
      directPulseEligible: seed.directPulseEligible ?? pulseDelivery.directPulseEligible,
      dedupeKey: `foundation-hidden:${seed.id}`,
      throttleKey: `foundation-hidden:${seed.id}`,
      sortOrder: sortBase + index,
    };
  });
}

const wearDepthMilestones = createClusterMilestones(
  'wearDepth',
  [
    { id: 'wear-total-5m', title: '5 minutes worn', metricType: 'totalWearMinutes', threshold: 5, visibleChecklistLink: 'first-wear', pulseFamily: 'wear-depth' },
    { id: 'wear-total-10m', title: '10 minutes worn', metricType: 'totalWearMinutes', threshold: 10, visibleChecklistLink: 'first-wear', pulseFamily: 'wear-depth' },
    { id: 'wear-total-15m', title: '15 minutes worn', metricType: 'totalWearMinutes', threshold: 15, visibleChecklistLink: 'first-wear', pulseFamily: 'wear-depth' },
    { id: 'wear-total-20m', title: '20 minutes worn', metricType: 'totalWearMinutes', threshold: 20, visibleChecklistLink: 'first-wear', pulseFamily: 'wear-depth' },
    { id: 'wear-total-30m', title: '30 minutes worn', metricType: 'totalWearMinutes', threshold: 30, visibleChecklistLink: 'first-wear', pulseFamily: 'wear-depth' },
    { id: 'wear-total-45m', title: '45 minutes worn', metricType: 'totalWearMinutes', threshold: 45, visibleChecklistLink: 'first-wear', pulseFamily: 'wear-depth' },
    { id: 'wear-total-60m', title: '60 minutes worn', metricType: 'totalWearMinutes', threshold: 60, visibleChecklistLink: 'first-wear', pulseFamily: 'wear-depth', pulsePriority: 'normal' },
    { id: 'wear-total-90m', title: '90 minutes worn', metricType: 'totalWearMinutes', threshold: 90, visibleChecklistLink: 'wear-building', pulseFamily: 'wear-depth' },
    { id: 'wear-total-120m', title: '2 total wear hours', metricType: 'totalWearMinutes', threshold: 120, visibleChecklistLink: 'wear-building', pulseFamily: 'wear-depth', pulsePriority: 'normal' },
    { id: 'wear-total-180m', title: '3 total wear hours', metricType: 'totalWearMinutes', threshold: 180, visibleChecklistLink: 'wear-building', pulseFamily: 'wear-depth' },
    { id: 'wear-total-240m', title: '4 total wear hours', metricType: 'totalWearMinutes', threshold: 240, visibleChecklistLink: 'wear-building', pulseFamily: 'wear-depth' },
    { id: 'wear-total-360m', title: '6 total wear hours', metricType: 'totalWearMinutes', threshold: 360, visibleChecklistLink: 'wear-building', pulseFamily: 'wear-depth' },
    { id: 'wear-total-480m', title: '8 total wear hours', metricType: 'totalWearMinutes', threshold: 480, visibleChecklistLink: 'wear-building', pulseFamily: 'wear-depth', pulsePriority: 'normal' },
    { id: 'wear-total-600m', title: '10 total wear hours', metricType: 'totalWearMinutes', threshold: 600, visibleChecklistLink: 'wear-locked', pulseFamily: 'wear-depth' },
    { id: 'wear-total-720m', title: '12 total wear hours', metricType: 'totalWearMinutes', threshold: 720, visibleChecklistLink: 'wear-locked', pulseFamily: 'wear-depth' },
    { id: 'wear-total-960m', title: '16 total wear hours', metricType: 'totalWearMinutes', threshold: 960, visibleChecklistLink: 'wear-locked', pulseFamily: 'wear-depth' },
    { id: 'wear-total-1200m', title: '20 total wear hours', metricType: 'totalWearMinutes', threshold: 1200, visibleChecklistLink: 'wear-locked', pulseFamily: 'wear-depth', pulsePriority: 'high' },
    { id: 'wear-total-1440m', title: '24 total wear hours', metricType: 'totalWearMinutes', threshold: 1440, visibleChecklistLink: 'full-wear-base', pulseFamily: 'wear-depth', pulsePriority: 'high' },
    { id: 'wear-total-1800m', title: '30 total wear hours', metricType: 'totalWearMinutes', threshold: 1800, visibleChecklistLink: 'full-wear-base', pulseFamily: 'wear-depth', pulsePriority: 'veryHigh', pulseTitle: 'Wear foundation secured', pulseMessage: 'Foundation now has exceptional wear depth to build from.' },
    { id: 'wear-continuous-20m', title: '20 min continuous wear', metricType: 'continuousWearMinutes', threshold: 20, visibleChecklistLink: 'first-wear', pulseFamily: 'wear-depth' },
    { id: 'wear-continuous-30m', title: '30 min continuous wear', metricType: 'continuousWearMinutes', threshold: 30, visibleChecklistLink: 'first-wear', pulseFamily: 'wear-depth' },
    { id: 'wear-continuous-45m', title: '45 min continuous wear', metricType: 'continuousWearMinutes', threshold: 45, visibleChecklistLink: 'wear-building', pulseFamily: 'wear-depth' },
    { id: 'wear-continuous-60m', title: '60 min continuous wear', metricType: 'continuousWearMinutes', threshold: 60, visibleChecklistLink: 'full-wear-base', pulseFamily: 'wear-range', pulsePriority: 'normal' },
    { id: 'wear-continuous-90m', title: '90 min continuous wear', metricType: 'continuousWearMinutes', threshold: 90, visibleChecklistLink: 'full-wear-base', pulseFamily: 'wear-range' },
    { id: 'wear-continuous-120m', title: '2 hr continuous wear', metricType: 'continuousWearMinutes', threshold: 120, visibleChecklistLink: 'full-wear-base', pulseFamily: 'wear-range' },
    { id: 'wear-first-morning-block', title: 'first morning wear block', metricType: 'morningWearBlockCount', threshold: 1, visibleChecklistLink: 'full-wear-base', pulseFamily: 'wear-range', pulsePriority: 'normal' },
    { id: 'wear-first-evening-block', title: 'first evening wear block', metricType: 'eveningWearBlockCount', threshold: 1, visibleChecklistLink: 'full-wear-base', pulseFamily: 'wear-range' },
    { id: 'wear-two-dayparts', title: 'first wear across two parts of the day', metricType: 'wearDistinctDaypartsCount', threshold: 2, visibleChecklistLink: 'full-wear-base', pulseFamily: 'wear-range', pulsePriority: 'normal' },
  ],
  0,
);

const baselineDepthMilestones = createClusterMilestones(
  'baselineDepth',
  [
    { id: 'baseline-total-5m', title: '5 min baseline', metricType: 'baselineMinutes', threshold: 5, visibleChecklistLink: 'baseline-started', pulseFamily: 'baseline-depth' },
    { id: 'baseline-total-10m', title: '10 min baseline', metricType: 'baselineMinutes', threshold: 10, visibleChecklistLink: 'baseline-started', pulseFamily: 'baseline-depth' },
    { id: 'baseline-total-15m', title: '15 min baseline', metricType: 'baselineMinutes', threshold: 15, visibleChecklistLink: 'baseline-started', pulseFamily: 'baseline-depth' },
    { id: 'baseline-total-20m', title: '20 min baseline', metricType: 'baselineMinutes', threshold: 20, visibleChecklistLink: 'baseline-started', pulseFamily: 'baseline-depth' },
    { id: 'baseline-total-30m', title: '30 min baseline', metricType: 'baselineMinutes', threshold: 30, visibleChecklistLink: 'baseline-started', pulseFamily: 'baseline-depth' },
    { id: 'baseline-total-45m', title: '45 min baseline', metricType: 'baselineMinutes', threshold: 45, visibleChecklistLink: 'baseline-started', pulseFamily: 'baseline-depth' },
    { id: 'baseline-total-60m', title: '60 min baseline', metricType: 'baselineMinutes', threshold: 60, visibleChecklistLink: 'baseline-started', pulseFamily: 'baseline-depth', pulsePriority: 'normal' },
    { id: 'baseline-total-90m', title: '90 min baseline', metricType: 'baselineMinutes', threshold: 90, visibleChecklistLink: 'baseline-started', pulseFamily: 'baseline-depth' },
    { id: 'baseline-total-120m', title: '2 hr baseline', metricType: 'baselineMinutes', threshold: 120, visibleChecklistLink: 'baseline-started', pulseFamily: 'baseline-depth', pulsePriority: 'normal' },
    { id: 'baseline-total-180m', title: '3 hr baseline', metricType: 'baselineMinutes', threshold: 180, visibleChecklistLink: 'baseline-building', pulseFamily: 'baseline-depth' },
    { id: 'baseline-total-240m', title: '4 hr baseline', metricType: 'baselineMinutes', threshold: 240, visibleChecklistLink: 'baseline-building', pulseFamily: 'baseline-depth' },
    { id: 'baseline-total-300m', title: '5 hr baseline', metricType: 'baselineMinutes', threshold: 300, visibleChecklistLink: 'baseline-building', pulseFamily: 'baseline-depth' },
    { id: 'baseline-total-360m', title: '6 hr baseline', metricType: 'baselineMinutes', threshold: 360, visibleChecklistLink: 'baseline-building', pulseFamily: 'baseline-depth', pulsePriority: 'normal' },
    { id: 'baseline-total-480m', title: '8 hr baseline', metricType: 'baselineMinutes', threshold: 480, visibleChecklistLink: 'baseline-locked', pulseFamily: 'baseline-depth' },
    { id: 'baseline-total-600m', title: '10 hr baseline', metricType: 'baselineMinutes', threshold: 600, visibleChecklistLink: 'baseline-locked', pulseFamily: 'baseline-depth' },
    { id: 'baseline-total-720m', title: '12 hr baseline', metricType: 'baselineMinutes', threshold: 720, visibleChecklistLink: 'baseline-locked', pulseFamily: 'baseline-depth', pulsePriority: 'high' },
    { id: 'baseline-first-morning', title: 'first morning baseline', metricType: 'morningBaselineCount', threshold: 1, visibleChecklistLink: 'baseline-started', pulseFamily: 'baseline-range' },
    { id: 'baseline-first-afternoon', title: 'first afternoon baseline', metricType: 'afternoonBaselineCount', threshold: 1, visibleChecklistLink: 'baseline-building', pulseFamily: 'baseline-range' },
    { id: 'baseline-first-evening', title: 'first evening baseline', metricType: 'eveningBaselineCount', threshold: 1, visibleChecklistLink: 'baseline-building', pulseFamily: 'baseline-range' },
    { id: 'baseline-two-dayparts', title: 'baseline in two dayparts', metricType: 'baselineDistinctDaypartsCount', threshold: 2, visibleChecklistLink: 'baseline-building', pulseFamily: 'baseline-range', pulsePriority: 'normal' },
    { id: 'baseline-three-dayparts', title: 'baseline in three dayparts', metricType: 'baselineDistinctDaypartsCount', threshold: 3, visibleChecklistLink: 'baseline-locked', pulseFamily: 'baseline-range' },
    { id: 'baseline-two-days', title: 'baseline on two separate days', metricType: 'baselineDistinctDays', threshold: 2, visibleChecklistLink: 'baseline-locked', pulseFamily: 'baseline-range' },
    { id: 'baseline-first-stable-block', title: 'first stable baseline block', metricType: 'stableBaselineBlockCount', threshold: 1, visibleChecklistLink: 'baseline-started', pulseFamily: 'baseline-clarity', pulsePriority: 'normal' },
    { id: 'baseline-second-stable-block', title: 'second stable baseline block', metricType: 'stableBaselineBlockCount', threshold: 2, visibleChecklistLink: 'baseline-building', pulseFamily: 'baseline-clarity', pulsePriority: 'normal' },
    { id: 'baseline-five-stable-blocks', title: 'five stable baseline blocks', metricType: 'stableBaselineBlockCount', threshold: 5, visibleChecklistLink: 'baseline-locked', pulseFamily: 'baseline-clarity' },
    { id: 'baseline-low-noise-threshold', title: 'low-noise baseline threshold reached', metricType: 'lowNoiseBaselineThresholdCount', threshold: 1, visibleChecklistLink: 'baseline-locked', pulseFamily: 'baseline-clarity' },
  ],
  100,
);

const sessionCaptureMilestones = createClusterMilestones(
  'sessionCapture',
  [
    { id: 'session-first-qualified-event', title: 'first qualified event', metricType: 'qualifiedEventCount', threshold: 1, visibleChecklistLink: 'first-event-logged', pulseFamily: 'session-depth', pulsePriority: 'normal', pulseTitle: 'First event logged', pulseMessage: 'The app has captured its first real expansion read.' },
    { id: 'session-second-qualified-event', title: 'second qualified event', metricType: 'qualifiedEventCount', threshold: 2, visibleChecklistLink: 'session-building', pulseFamily: 'session-depth' },
    { id: 'session-first-qualified-session', title: 'first qualified session', metricType: 'qualifiedSessionCount', threshold: 1, visibleChecklistLink: 'first-event-logged', pulseFamily: 'session-depth', pulsePriority: 'normal' },
    { id: 'session-second-qualified-session', title: 'second qualified session', metricType: 'qualifiedSessionCount', threshold: 2, visibleChecklistLink: 'session-building', pulseFamily: 'session-depth', pulsePriority: 'normal' },
    { id: 'session-third-qualified-session', title: 'third qualified session', metricType: 'qualifiedSessionCount', threshold: 3, visibleChecklistLink: 'session-range', pulseFamily: 'session-depth', pulsePriority: 'high' },
    { id: 'session-fourth-qualified-session', title: 'fourth qualified session', metricType: 'qualifiedSessionCount', threshold: 4, visibleChecklistLink: 'session-range', pulseFamily: 'session-depth' },
    { id: 'session-fifth-qualified-session', title: 'fifth qualified session', metricType: 'qualifiedSessionCount', threshold: 5, visibleChecklistLink: 'session-range', pulseFamily: 'session-depth', pulsePriority: 'high' },
    { id: 'session-first-morning', title: 'first morning session', metricType: 'morningSessionCount', threshold: 1, visibleChecklistLink: 'session-building', pulseFamily: 'session-range' },
    { id: 'session-first-evening', title: 'first evening session', metricType: 'eveningSessionCount', threshold: 1, visibleChecklistLink: 'session-range', pulseFamily: 'session-range' },
    { id: 'session-first-overnight-adjacent', title: 'first overnight-adjacent session', metricType: 'overnightAdjacentSessionCount', threshold: 1, visibleChecklistLink: 'session-range', pulseFamily: 'session-range' },
    { id: 'session-duration-2m', title: 'total session duration 2 min', metricType: 'sessionTotalDurationMinutes', threshold: 2, visibleChecklistLink: 'session-building', pulseFamily: 'session-depth' },
    { id: 'session-duration-5m', title: 'total session duration 5 min', metricType: 'sessionTotalDurationMinutes', threshold: 5, visibleChecklistLink: 'session-building', pulseFamily: 'session-depth' },
    { id: 'session-duration-10m', title: 'total session duration 10 min', metricType: 'sessionTotalDurationMinutes', threshold: 10, visibleChecklistLink: 'session-building', pulseFamily: 'session-depth', pulsePriority: 'normal' },
    { id: 'session-duration-15m', title: 'total session duration 15 min', metricType: 'sessionTotalDurationMinutes', threshold: 15, visibleChecklistLink: 'session-range', pulseFamily: 'session-depth' },
    { id: 'session-duration-20m', title: 'total session duration 20 min', metricType: 'sessionTotalDurationMinutes', threshold: 20, visibleChecklistLink: 'session-range', pulseFamily: 'session-depth' },
    { id: 'session-two-days', title: 'sessions on two separate days', metricType: 'sessionDistinctDays', threshold: 2, visibleChecklistLink: 'session-range', pulseFamily: 'session-range' },
    { id: 'session-two-within-24h', title: 'two sessions within 24-hour span', metricType: 'sessionsWithin24hSpanCount', threshold: 2, visibleChecklistLink: 'session-building', pulseFamily: 'session-range', pulsePriority: 'normal' },
    { id: 'session-three-within-foundation-window', title: 'three sessions within Foundation window', metricType: 'sessionWithinFoundationWindowCount', threshold: 3, visibleChecklistLink: 'session-range', pulseFamily: 'session-range' },
  ],
  200,
);

const sessionQualityMilestones = createClusterMilestones(
  'sessionQuality',
  [
    { id: 'quality-rise-detected', title: 'rise detected', metricType: 'riseDetectedCount', threshold: 1, visibleChecklistLink: 'first-event-logged', pulseFamily: 'session-quality' },
    { id: 'quality-peak-detected', title: 'peak detected', metricType: 'peakDetectedCount', threshold: 1, visibleChecklistLink: 'first-event-logged', pulseFamily: 'session-quality' },
    { id: 'quality-hold-detected', title: 'hold detected', metricType: 'holdDetectedCount', threshold: 1, visibleChecklistLink: 'strong-hold', pulseFamily: 'hold-quality' },
    { id: 'quality-decline-detected', title: 'decline detected', metricType: 'declineDetectedCount', threshold: 1, visibleChecklistLink: 'session-building', pulseFamily: 'session-quality' },
    { id: 'quality-full-cycle-captured', title: 'full cycle captured', metricType: 'fullCycleCapturedCount', threshold: 1, visibleChecklistLink: 'session-range', pulseFamily: 'session-quality', pulsePriority: 'normal' },
    { id: 'quality-hold-1m', title: '1 min hold', metricType: 'holdMinutes', threshold: 1, visibleChecklistLink: 'strong-hold', pulseFamily: 'hold-quality' },
    { id: 'quality-hold-2m', title: '2 min hold', metricType: 'holdMinutes', threshold: 2, visibleChecklistLink: 'strong-hold', pulseFamily: 'hold-quality' },
    { id: 'quality-hold-3m', title: '3 min hold', metricType: 'holdMinutes', threshold: 3, visibleChecklistLink: 'strong-hold', pulseFamily: 'hold-quality' },
    { id: 'quality-hold-5m', title: '5 min hold', metricType: 'holdMinutes', threshold: 5, visibleChecklistLink: 'strong-hold', pulseFamily: 'hold-quality', pulsePriority: 'high' },
    { id: 'quality-hold-7m', title: '7 min hold', metricType: 'holdMinutes', threshold: 7, visibleChecklistLink: 'strong-hold', pulseFamily: 'hold-quality' },
    { id: 'quality-first-high-confidence', title: 'first high-confidence session', metricType: 'highConfidenceSessionCount', threshold: 1, visibleChecklistLink: 'first-event-logged', pulseFamily: 'session-quality' },
    { id: 'quality-second-high-confidence', title: 'second high-confidence session', metricType: 'highConfidenceSessionCount', threshold: 2, visibleChecklistLink: 'session-range', pulseFamily: 'session-quality', pulsePriority: 'normal' },
    { id: 'quality-stable-hold-threshold-1', title: 'stable hold quality threshold 1', metricType: 'stableHoldQualityTier', threshold: 1, visibleChecklistLink: 'strong-hold', pulseFamily: 'session-quality', pulsePriority: 'normal' },
    { id: 'quality-peak-confidence-threshold', title: 'peak confidence threshold reached', metricType: 'peakConfidenceTier', threshold: 1, visibleChecklistLink: 'strong-hold', pulseFamily: 'session-quality' },
  ],
  300,
);

const sessionVarietyMilestones = createClusterMilestones(
  'sessionVariety',
  [
    { id: 'variety-first-static-session', title: 'first static session', metricType: 'staticSessionCount', threshold: 1, visibleChecklistLink: 'static-session-logged', pulseFamily: 'static-range', pulsePriority: 'normal' },
    { id: 'variety-second-static-session', title: 'second static session', metricType: 'staticSessionCount', threshold: 2, visibleChecklistLink: 'static-session-logged', pulseFamily: 'static-range' },
    { id: 'variety-first-motion-session', title: 'first motion session', metricType: 'motionSessionCount', threshold: 1, visibleChecklistLink: 'motion-session-logged', pulseFamily: 'motion-range', pulsePriority: 'normal' },
    { id: 'variety-second-motion-session', title: 'second motion session', metricType: 'motionSessionCount', threshold: 2, visibleChecklistLink: 'motion-session-logged', pulseFamily: 'motion-range' },
    { id: 'variety-both-session-types', title: 'both session types captured', metricType: 'sessionTypeDiversityTier', threshold: 1, visibleChecklistLink: 'motion-session-logged', pulseFamily: 'session-range', pulsePriority: 'high', pulseTitle: 'Both session types captured', pulseMessage: 'Your profile now spans both still-state and active response reads.' },
    { id: 'variety-static-separate-days', title: 'static sessions on separate days', metricType: 'staticSessionDistinctDays', threshold: 2, visibleChecklistLink: 'static-session-logged', pulseFamily: 'static-range' },
    { id: 'variety-motion-separate-days', title: 'motion sessions on separate days', metricType: 'motionSessionDistinctDays', threshold: 2, visibleChecklistLink: 'motion-session-logged', pulseFamily: 'motion-range' },
    { id: 'variety-diversity-threshold-1', title: 'session type diversity threshold 1', metricType: 'sessionTypeDiversityTier', threshold: 1, visibleChecklistLink: 'session-range', pulseFamily: 'session-range' },
    { id: 'variety-diversity-threshold-2', title: 'session type diversity threshold 2', metricType: 'sessionTypeDiversityTier', threshold: 2, visibleChecklistLink: 'session-range', pulseFamily: 'session-range' },
    { id: 'variety-session-two-dayparts', title: 'session in two dayparts', metricType: 'sessionDistinctDaypartsCount', threshold: 2, visibleChecklistLink: 'session-range', pulseFamily: 'session-range' },
    { id: 'variety-session-three-dayparts', title: 'session in three dayparts', metricType: 'sessionDistinctDaypartsCount', threshold: 3, visibleChecklistLink: 'session-range', pulseFamily: 'session-range' },
    { id: 'variety-evening-session-captured', title: 'evening session captured', metricType: 'eveningSessionCount', threshold: 1, visibleChecklistLink: 'session-range', pulseFamily: 'session-range' },
    { id: 'variety-stronger-movement-range', title: 'session with stronger movement range', metricType: 'strongerMovementRangeCount', threshold: 1, visibleChecklistLink: 'motion-session-logged', pulseFamily: 'motion-range' },
    { id: 'variety-minimal-movement-range', title: 'session with minimal movement range', metricType: 'minimalMovementRangeCount', threshold: 1, visibleChecklistLink: 'static-session-logged', pulseFamily: 'static-range' },
  ],
  400,
);

export const FOUNDATION_HIDDEN_MILESTONE_CLUSTERS: FoundationHiddenMilestoneClusterDefinition[] = [
  {
    id: 'wearDepth',
    title: 'Wear Depth',
    description: 'Granular on-body time, continuity, and daypart coverage milestones.',
    sortOrder: 0,
  },
  {
    id: 'baselineDepth',
    title: 'Baseline Depth',
    description: 'Resting-state depth, stability, and baseline clarity milestones.',
    sortOrder: 1,
  },
  {
    id: 'sessionCapture',
    title: 'Session Capture',
    description: 'Event count, session count, duration depth, and spread across the Foundation window.',
    sortOrder: 2,
  },
  {
    id: 'sessionQuality',
    title: 'Session Quality',
    description: 'Hold depth, cycle structure, confidence, and early stability milestones.',
    sortOrder: 3,
  },
  {
    id: 'sessionVariety',
    title: 'Session Variety',
    description: 'Static versus motion diversity, daypart spread, and movement-range variety.',
    sortOrder: 4,
  },
];

export const FOUNDATION_HIDDEN_MILESTONES: FoundationHiddenMilestoneDefinition[] = [
  ...wearDepthMilestones,
  ...baselineDepthMilestones,
  ...sessionCaptureMilestones,
  ...sessionQualityMilestones,
  ...sessionVarietyMilestones,
].sort((left, right) => left.sortOrder - right.sortOrder);

const foundationHiddenMilestoneClusterCounts = FOUNDATION_HIDDEN_MILESTONES.reduce<
  Record<FoundationHiddenMilestoneDefinition['cluster'], number>
>(
  (counts, milestone) => {
    counts[milestone.cluster] += 1;
    return counts;
  },
  {
    wearDepth: 0,
    baselineDepth: 0,
    sessionCapture: 0,
    sessionQuality: 0,
    sessionVariety: 0,
  },
);

for (const [cluster, expectedCount] of Object.entries(FOUNDATION_HIDDEN_MILESTONE_EXPECTED_COUNTS)) {
  const actualCount =
    foundationHiddenMilestoneClusterCounts[cluster as FoundationHiddenMilestoneDefinition['cluster']];
  if (actualCount !== expectedCount) {
    throw new Error(`Foundation hidden milestone count mismatch for ${cluster}: expected ${expectedCount}, received ${actualCount}.`);
  }
}

if (FOUNDATION_HIDDEN_MILESTONES.length !== 100) {
  throw new Error(`Foundation hidden milestone library must contain exactly 100 milestones. Received ${FOUNDATION_HIDDEN_MILESTONES.length}.`);
}
