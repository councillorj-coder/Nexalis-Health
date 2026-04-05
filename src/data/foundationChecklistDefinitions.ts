import type {
  FoundationChecklistDefinition,
  FoundationChecklistInfoDefinition,
  FoundationChecklistSectionDefinition,
} from './foundationChecklistTypes';

export const FOUNDATION_CHECKLIST_HEADER = {
  label: 'Foundation',
  title: 'Foundation Checklist',
  primarySubline: 'Build your first performance profile over your first 7 days.',
  secondarySupportLine: 'The more you wear and log, the sharper your Foundation becomes.',
};

export const FOUNDATION_CHECKLIST_SECTIONS: FoundationChecklistSectionDefinition[] = [
  {
    id: 'wear',
    title: 'Wear',
    intro: 'Build enough on-body time for the app to learn your normal.',
    sortOrder: 0,
    progressionStyle: 'ladder',
  },
  {
    id: 'baseline',
    title: 'Baseline',
    intro: 'Shape your flaccid-state profile through passive daily wear.',
    sortOrder: 1,
    progressionStyle: 'ladder',
  },
  {
    id: 'sessions',
    title: 'Sessions',
    intro: 'Give the system meaningful expansion reads.',
    sortOrder: 2,
    progressionStyle: 'ladder',
  },
  {
    id: 'sessionType',
    title: 'Session Type',
    intro: 'Teach the difference between still and active conditions.',
    sortOrder: 3,
    progressionStyle: 'parallel',
  },
  {
    id: 'sessionQuality',
    title: 'Session Quality',
    intro: 'Add early hold and stability depth.',
    sortOrder: 4,
    progressionStyle: 'parallel',
  },
  {
    id: 'finish',
    title: 'Finish',
    intro: 'Lock in your first Foundation profile.',
    sortOrder: 5,
    progressionStyle: 'finish',
  },
];

export const FOUNDATION_CHECKLIST_INFO_TERMS: FoundationChecklistInfoDefinition[] = [
  {
    id: 'foundation',
    title: 'Foundation',
    whatItMeans: 'Foundation is your first calibration phase.',
    whyItMatters:
      'Foundation gives the app enough early wear, baseline, and session data to build your first performance profile.',
  },
  {
    id: 'baseline',
    title: 'Baseline',
    whatItMeans: 'Baseline refers to your flaccid or resting state during normal wear.',
    whyItMatters:
      'As baseline time builds, the app gets better at understanding your average state and how it shifts across the day.',
  },
  {
    id: 'event',
    title: 'Event',
    whatItMeans: 'An event is an early detected erection or expansion state during startup.',
    whyItMatters:
      'Your first events give the app its first meaningful read on how your expansion behaves.',
  },
  {
    id: 'session',
    title: 'Session',
    whatItMeans: 'A session is a logged response period built from a meaningful event.',
    whyItMatters:
      'Sessions help shape your early response profile and show how your body performs under different conditions.',
  },
  {
    id: 'staticSession',
    title: 'Static Session',
    whatItMeans: 'A static session is a logged erection session with little movement.',
    whyItMatters:
      'Static sessions give the app a cleaner read on your response with less motion affecting the signal.',
  },
  {
    id: 'motionSession',
    title: 'Motion Session',
    whatItMeans: 'A motion session is a logged erection session with enough movement to be classified as active.',
    whyItMatters:
      'Motion sessions help the app understand how your response behaves under more dynamic conditions.',
  },
  {
    id: 'strongHold',
    title: 'Strong Hold',
    whatItMeans:
      'Strong Hold means the app recorded a session where your erection stayed elevated for a sustained period.',
    whyItMatters:
      'This helps define early stability and staying power in your performance profile.',
  },
];

export const FOUNDATION_CHECKLIST_DEFINITIONS: FoundationChecklistDefinition[] = [
  {
    id: 'first-wear',
    section: 'wear',
    title: 'First Wear',
    targetLabel: '1 total hour worn',
    explanationShort: 'Your first hour gives the system an initial on-body read and starts your Foundation.',
    explanationExpandedWhatItMeans:
      'This milestone marks your first measurable block of on-body time, giving the system its earliest real calibration signal.',
    explanationExpandedWhyItMatters:
      'That first hour starts your Foundation and gives the app a real starting point for how you wear.',
    metricType: 'totalWearHours',
    threshold: 1,
    sortOrder: 0,
    infoTermId: 'foundation',
  },
  {
    id: 'wear-building',
    section: 'wear',
    title: 'Wear Building',
    targetLabel: '8 total wear hours',
    explanationShort: 'More wear time helps the app understand your normal daily state with better accuracy.',
    explanationExpandedWhatItMeans:
      'This milestone reflects accumulating enough wear time for the app to see more of your normal on-body rhythm.',
    explanationExpandedWhyItMatters:
      'As wear time builds, the app can separate short-term noise from the patterns that actually belong to you.',
    metricType: 'totalWearHours',
    threshold: 8,
    sortOrder: 1,
  },
  {
    id: 'wear-locked',
    section: 'wear',
    title: 'Wear Locked',
    targetLabel: '20 total wear hours',
    explanationShort: 'At this point, your profile starts becoming more stable and more personally tuned.',
    explanationExpandedWhatItMeans:
      'This is the point where total wear depth starts to feel substantial instead of early.',
    explanationExpandedWhyItMatters:
      'More accumulated wear time gives the app a steadier sense of your daily profile and improves early reliability.',
    metricType: 'totalWearHours',
    threshold: 20,
    sortOrder: 2,
  },
  {
    id: 'full-wear-base',
    section: 'wear',
    title: 'Full Wear Base',
    targetLabel: '30 total wear hours',
    explanationShort: 'This creates the wear depth needed for a strong first Foundation profile.',
    explanationExpandedWhatItMeans:
      'This milestone represents the deeper wear base needed for a durable first-pass Foundation.',
    explanationExpandedWhyItMatters:
      'With enough wear depth in place, the app can support a stronger starting profile instead of leaning on light early reads.',
    metricType: 'totalWearHours',
    threshold: 30,
    sortOrder: 3,
    infoTermId: 'foundation',
  },
  {
    id: 'baseline-started',
    section: 'baseline',
    title: 'Baseline Started',
    targetLabel: '2 total baseline hours',
    explanationShort: 'Baseline tracks your normal resting state during everyday wear.',
    explanationExpandedWhatItMeans:
      'This milestone begins your baseline lane by collecting enough passive resting-state time to establish an early reference.',
    explanationExpandedWhyItMatters:
      'Without baseline depth, the app has a harder time understanding what your normal flaccid state looks like.',
    metricType: 'totalBaselineHours',
    threshold: 2,
    sortOrder: 4,
    infoTermId: 'baseline',
  },
  {
    id: 'baseline-building',
    section: 'baseline',
    title: 'Baseline Building',
    targetLabel: '6 total baseline hours',
    explanationShort: 'More baseline time helps the app learn what your normal range really looks like.',
    explanationExpandedWhatItMeans:
      'This milestone expands the app\'s view of your resting state through more calm, passive wear time.',
    explanationExpandedWhyItMatters:
      'As baseline time grows, the app gets a more reliable read on where your normal state sits across the day.',
    metricType: 'totalBaselineHours',
    threshold: 6,
    sortOrder: 5,
    infoTermId: 'baseline',
  },
  {
    id: 'baseline-locked',
    section: 'baseline',
    title: 'Baseline Locked',
    targetLabel: '12 total baseline hours',
    explanationShort: 'This gives the system enough baseline depth to form a more reliable starting read.',
    explanationExpandedWhatItMeans:
      'This milestone locks in a deeper baseline foundation by giving the app enough resting-state depth to trust the pattern more.',
    explanationExpandedWhyItMatters:
      'A stronger baseline helps the app separate your normal flaccid state from true shifts in readiness.',
    metricType: 'totalBaselineHours',
    threshold: 12,
    sortOrder: 6,
    infoTermId: 'baseline',
  },
  {
    id: 'first-event-logged',
    section: 'sessions',
    title: 'First Event Logged',
    targetLabel: '1 qualified event',
    explanationShort: 'Your first event gives the app its first real look at expansion behavior.',
    explanationExpandedWhatItMeans:
      'This is the earliest meaningful expansion read the app can use during startup.',
    explanationExpandedWhyItMatters:
      'That first event gives the system its first real signal for how your expansion begins and behaves.',
    metricType: 'qualifiedEventCount',
    threshold: 1,
    sortOrder: 7,
    infoTermId: 'event',
  },
  {
    id: 'session-building',
    section: 'sessions',
    title: 'Session Building',
    targetLabel: '2 total qualified sessions',
    explanationShort:
      'Additional sessions help the system compare your response patterns instead of relying on a single read.',
    explanationExpandedWhatItMeans:
      'This milestone adds more than one meaningful response period so the app can begin comparing your performance across sessions.',
    explanationExpandedWhyItMatters:
      'Multiple sessions reduce the risk of overfitting your profile to a single early read.',
    metricType: 'qualifiedSessionCount',
    threshold: 2,
    sortOrder: 8,
    infoTermId: 'session',
  },
  {
    id: 'session-range',
    section: 'sessions',
    title: 'Session Range',
    targetLabel: '3 total qualified sessions',
    explanationShort: 'This adds enough session depth to begin shaping a true early session profile.',
    explanationExpandedWhatItMeans:
      'This milestone gives the app enough qualified session depth to start building a real early response profile.',
    explanationExpandedWhyItMatters:
      'With enough session range, the app can begin seeing how your performance repeats instead of treating every session as isolated.',
    metricType: 'qualifiedSessionCount',
    threshold: 3,
    sortOrder: 9,
    infoTermId: 'session',
  },
  {
    id: 'static-session-logged',
    section: 'sessionType',
    title: 'Static Session Logged',
    targetLabel: '1 static session',
    explanationShort: 'A static session helps the app understand your response with minimal movement.',
    explanationExpandedWhatItMeans:
      'This milestone captures a still-condition session with little movement in the signal.',
    explanationExpandedWhyItMatters:
      'Static sessions give the app a cleaner early view of your response before more dynamic conditions are layered in.',
    metricType: 'staticSessionCount',
    threshold: 1,
    sortOrder: 10,
    infoTermId: 'staticSession',
  },
  {
    id: 'motion-session-logged',
    section: 'sessionType',
    title: 'Motion Session Logged',
    targetLabel: '1 motion session',
    explanationShort: 'A motion session helps the app understand performance under more active conditions.',
    explanationExpandedWhatItMeans:
      'This milestone captures a session with enough movement for the app to classify it as active.',
    explanationExpandedWhyItMatters:
      'Motion sessions expand your early profile by showing how your response behaves under more dynamic conditions.',
    metricType: 'motionSessionCount',
    threshold: 1,
    sortOrder: 11,
    infoTermId: 'motionSession',
  },
  {
    id: 'strong-hold',
    section: 'sessionQuality',
    title: 'Strong Hold',
    targetLabel: '1 session held for 5 continuous minutes',
    explanationShort: 'A strong hold helps define stability and staying power inside your early profile.',
    explanationExpandedWhatItMeans:
      'This milestone captures an early session where your erection stayed elevated for a sustained continuous period.',
    explanationExpandedWhyItMatters:
      'A strong hold adds early stability depth and helps the app understand staying power, not just initial rise.',
    metricType: 'strongHoldCount',
    threshold: 1,
    sortOrder: 12,
    infoTermId: 'strongHold',
  },
  {
    id: 'foundation-complete',
    section: 'finish',
    title: 'Foundation Complete',
    targetLabel: 'All Foundation targets reached',
    explanationShort: 'Your first performance profile is now locked in and ready to support deeper scoring and guidance.',
    explanationExpandedWhatItMeans:
      'This milestone means your wear, baseline, and session targets have all reached the depth needed for a true first profile.',
    explanationExpandedWhyItMatters:
      'Once Foundation is complete, the app can support stronger starting reads and deeper guidance with more confidence.',
    metricType: 'foundationAllTargetsComplete',
    threshold: 13,
    sortOrder: 13,
    infoTermId: 'foundation',
  },
];

