import type { Session } from '../../data/arc-types';

export type ArcAmoraGuidanceMode = 'on' | 'reduced' | 'off';

export type ArcAmoraGuidanceType =
  | 'onboarding'
  | 'motion_unlock'
  | 'personal_best'
  | 'high_intensity'
  | 'occasional_reminder';

export interface ArcAmoraGuidanceState {
  onboardingShown: boolean;
  motionUnlockShown: boolean;
  firstPersonalBestShown: boolean;
  lastShownAt: number | null;
  lastShownSessionIndex: number | null;
  shownCount: number;
}

export interface ArcAmoraGuidanceNote {
  type: ArcAmoraGuidanceType;
  label: string;
  body: string;
}

export const DEFAULT_AMORA_GUIDANCE_STATE: ArcAmoraGuidanceState = {
  onboardingShown: false,
  motionUnlockShown: false,
  firstPersonalBestShown: false,
  lastShownAt: null,
  lastShownSessionIndex: null,
  shownCount: 0,
};

export const AMORA_GUIDANCE_COOLDOWN = {
  minSessionsBetweenMessages: 6,
  minHoursBetweenMessages: 48,
} as const;

const AMORA_GUIDANCE_MESSAGES: Record<ArcAmoraGuidanceType, ArcAmoraGuidanceNote> = {
  onboarding: {
    type: 'onboarding',
    label: 'Amora note',
    body:
      'These insights are here to build awareness, not ego.\n\nYour partner\'s comfort, emotions, pace, and preferences matter more than any score or session metric.\n\nThe strongest performance is controlled, responsive, and mutual.',
  },
  motion_unlock: {
    type: 'motion_unlock',
    label: 'Amora note',
    body:
      'Motion data can show rhythm, pace, and control, but numbers never tell the full story.\n\nComfort, feedback, and partner preference matter more than intensity alone.',
  },
  personal_best: {
    type: 'personal_best',
    label: 'Amora note',
    body:
      'A personal best can reflect stronger physical performance, but real connection still depends on mutual comfort, emotional awareness, and respect for your partner\'s pace.',
  },
  high_intensity: {
    type: 'high_intensity',
    label: 'Amora note',
    body:
      'Strong output is only one part of a good experience.\n\nReal control includes staying aware of comfort, pacing, and the person with you.',
  },
  occasional_reminder: {
    type: 'occasional_reminder',
    label: 'Amora note',
    body:
      'Use performance insights to become more aware, not more forceful.\n\nThe best sessions stay responsive to comfort, emotion, and preference.',
  },
};

function cloneGuidanceNote(type: ArcAmoraGuidanceType): ArcAmoraGuidanceNote {
  const source = AMORA_GUIDANCE_MESSAGES[type];
  return { ...source };
}

function parseMetricNumber(value?: string | number | null) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const match = value.match(/-?\d+(\.\d+)?/);
  if (!match) {
    return null;
  }

  const parsed = Number.parseFloat(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function average(values: Array<number | null>) {
  const validValues = values.filter((value): value is number => value != null && Number.isFinite(value));
  if (validValues.length === 0) {
    return null;
  }

  return validValues.reduce((sum, value) => sum + value, 0) / validValues.length;
}

function isMotionTopic(topic: string) {
  return topic === 'first-session' || topic === 'session-motion' || topic === 'strong-session' || topic === 'event-archive';
}

function isReminderTopic(topic: string) {
  return topic === 'home' || topic === 'event-archive' || topic === 'session-motion' || topic === 'strong-session';
}

export function passesGuidanceCooldown(
  state: ArcAmoraGuidanceState,
  currentTime: number,
  sessionIndex: number,
) {
  const enoughTimePassed =
    state.lastShownAt == null ||
    currentTime - state.lastShownAt > AMORA_GUIDANCE_COOLDOWN.minHoursBetweenMessages * 60 * 60 * 1000;

  const enoughSessionsPassed =
    state.lastShownSessionIndex == null ||
    sessionIndex - state.lastShownSessionIndex >= AMORA_GUIDANCE_COOLDOWN.minSessionsBetweenMessages;

  return enoughTimePassed && enoughSessionsPassed;
}

export function markGuidanceShown(
  state: ArcAmoraGuidanceState,
  currentTime: number,
  sessionIndex: number,
  type: ArcAmoraGuidanceType,
): ArcAmoraGuidanceState {
  return {
    onboardingShown: state.onboardingShown || type === 'onboarding',
    motionUnlockShown: state.motionUnlockShown || type === 'motion_unlock',
    firstPersonalBestShown: state.firstPersonalBestShown || type === 'personal_best',
    lastShownAt: currentTime,
    lastShownSessionIndex: sessionIndex,
    shownCount: state.shownCount + 1,
  };
}

export function getOnboardingGuidanceNote(
  state: ArcAmoraGuidanceState,
): ArcAmoraGuidanceNote | null {
  if (state.onboardingShown) {
    return null;
  }

  return cloneGuidanceNote('onboarding');
}

export function isHighIntensityMotionSession(
  session: Session | null,
  motionSessions: Session[],
) {
  if (!session || session.type !== 'motion' || !session.motion) {
    return false;
  }

  const driveCount = session.motion.driveCount ?? 0;
  const cadencePeak = parseMetricNumber(session.motion.cadencePeak ?? session.motion.cadence);
  const comparisonSessions = motionSessions.filter(item => item.id !== session.id && item.motion);
  const baselineDriveCount = average(comparisonSessions.map(item => item.motion?.driveCount ?? null));
  const baselineCadencePeak = average(
    comparisonSessions.map(item => parseMetricNumber(item.motion?.cadencePeak ?? item.motion?.cadence)),
  );

  const driveThreshold = baselineDriveCount != null ? baselineDriveCount * 1.35 : 104;
  const cadenceThreshold = baselineCadencePeak != null ? baselineCadencePeak * 1.25 : 34;

  return driveCount >= driveThreshold || (cadencePeak != null && cadencePeak >= cadenceThreshold);
}

export function eligibleForOccasionalReminder({
  topic,
  motionSessionCount,
  currentTime,
  sessionIndex,
  guidanceState,
}: {
  topic: string;
  motionSessionCount: number;
  currentTime: number;
  sessionIndex: number;
  guidanceState: ArcAmoraGuidanceState;
}) {
  if (!isReminderTopic(topic) || motionSessionCount <= 8) {
    return false;
  }

  if (!passesGuidanceCooldown(guidanceState, currentTime, sessionIndex)) {
    return false;
  }

  return motionSessionCount % 6 === 0;
}

export function maybeComposeGuidanceMessage({
  topic,
  latestMotionSession,
  latestPersonalBestSession,
  motionSessions,
  motionSessionCount,
  guidanceState,
  guidanceMode,
  currentTime,
  sessionIndex,
}: {
  topic: string;
  latestMotionSession: Session | null;
  latestPersonalBestSession: Session | null;
  motionSessions: Session[];
  motionSessionCount: number;
  guidanceState: ArcAmoraGuidanceState;
  guidanceMode: ArcAmoraGuidanceMode;
  currentTime: number;
  sessionIndex: number;
}): ArcAmoraGuidanceNote | null {
  if (guidanceMode === 'off') {
    return null;
  }

  if (!guidanceState.motionUnlockShown && latestMotionSession && isMotionTopic(topic)) {
    return cloneGuidanceNote('motion_unlock');
  }

  if (!guidanceState.firstPersonalBestShown && latestPersonalBestSession && topic === 'personal-best') {
    return cloneGuidanceNote('personal_best');
  }

  if (
    guidanceMode === 'on' &&
    isMotionTopic(topic) &&
    isHighIntensityMotionSession(latestMotionSession, motionSessions) &&
    passesGuidanceCooldown(guidanceState, currentTime, sessionIndex)
  ) {
    return cloneGuidanceNote('high_intensity');
  }

  if (
    guidanceMode === 'on' &&
    eligibleForOccasionalReminder({
      topic,
      motionSessionCount,
      currentTime,
      sessionIndex,
      guidanceState,
    })
  ) {
    return cloneGuidanceNote('occasional_reminder');
  }

  return null;
}

export function getProactiveGuidanceTopic({
  latestMotionSession,
  latestPersonalBestSession,
  motionSessions,
  guidanceState,
  guidanceMode,
  currentTime,
  sessionIndex,
}: {
  latestMotionSession: Session | null;
  latestPersonalBestSession: Session | null;
  motionSessions: Session[];
  guidanceState: ArcAmoraGuidanceState;
  guidanceMode: ArcAmoraGuidanceMode;
  currentTime: number;
  sessionIndex: number;
}) {
  if (guidanceMode === 'off') {
    return null;
  }

  if (!guidanceState.motionUnlockShown && latestMotionSession) {
    return 'session-motion';
  }

  if (!guidanceState.firstPersonalBestShown && latestPersonalBestSession) {
    return 'personal-best';
  }

  if (
    guidanceMode === 'on' &&
    isHighIntensityMotionSession(latestMotionSession, motionSessions) &&
    passesGuidanceCooldown(guidanceState, currentTime, sessionIndex)
  ) {
    return 'strong-session';
  }

  return null;
}
