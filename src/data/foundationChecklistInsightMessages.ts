export interface FoundationChecklistInsightMessage {
  title: string;
  primaryMessage: string;
  supportMessage?: string;
}

export const FOUNDATION_CHECKLIST_INSIGHT_MESSAGES: Record<string, FoundationChecklistInsightMessage> = {
  'baseline-started': {
    title: 'Baseline is building',
    primaryMessage: 'The app is learning your flaccid state during normal wear.',
  },
  'first-event-logged': {
    title: 'First event logged',
    primaryMessage: 'Your first erection event gives the app its first real look at expansion behavior.',
  },
  'static-session-logged': {
    title: 'Static session logged',
    primaryMessage: 'This session had minimal movement, giving the app a cleaner view of your response.',
  },
  'motion-session-logged': {
    title: 'Motion session logged',
    primaryMessage:
      'This session included enough movement to expand your early performance profile under active conditions.',
  },
  'strong-hold': {
    title: 'Strong hold captured',
    primaryMessage:
      'A sustained hold helps define stability and staying power in your early profile.',
  },
  'foundation-complete': {
    title: 'Foundation Complete',
    primaryMessage: 'Your first performance profile is locked in.',
    supportMessage:
      'You now have enough wear, baseline, and session depth to power a stronger starting read.',
  },
};

