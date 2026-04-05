import { FOUNDATION_HIDDEN_MILESTONES } from './foundationHiddenMilestones';

export const FOUNDATION_VISIBLE_CHECKLIST_HIDDEN_LINKS = FOUNDATION_HIDDEN_MILESTONES.reduce<Record<string, string[]>>(
  (map, milestone) => {
    const current = map[milestone.visibleChecklistLink] ?? [];
    current.push(milestone.id);
    map[milestone.visibleChecklistLink] = current;
    return map;
  },
  {},
);

FOUNDATION_VISIBLE_CHECKLIST_HIDDEN_LINKS['foundation-complete'] = FOUNDATION_HIDDEN_MILESTONES.map(
  milestone => milestone.id,
);

export function getFoundationHiddenMilestonesForChecklistItem(checklistId: string) {
  return FOUNDATION_VISIBLE_CHECKLIST_HIDDEN_LINKS[checklistId] ?? [];
}
