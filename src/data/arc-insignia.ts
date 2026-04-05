import type { AvatarTier, InsigniaCollectionItem } from './arc-types';

export type EmberSigilTier = 'ember1' | 'ember2' | 'ember3' | 'ember4' | 'ember5';

export interface ArcInsigniaProgressionItem extends InsigniaCollectionItem {
  family: 'foundational' | 'ember';
  numeral?: 'I' | 'II' | 'III' | 'IV' | 'V';
  requiredWearStreak?: number;
  summary: string;
  unlockCopy?: string;
}

export interface ArcInsigniaTierOption {
  tier: AvatarTier;
  title: string;
  tierLabel: string;
  quote: string;
  resonance: string;
  mysteryLine: string;
  isUnlocked: boolean;
  isActive: boolean;
}

export interface ArcInsigniaFamilyItem {
  familyId: 'foundational_crest' | 'ember_sigil';
  displayName: string;
  currentTitle: string;
  tier: AvatarTier;
  tierLabel: string;
  quote: string;
  resonance: string;
  mysteryLine: string;
  summary: string;
  isOwned: boolean;
  isActive: boolean;
  availableTiers: ArcInsigniaTierOption[];
}

type EmberSigilDefinition = Omit<ArcInsigniaProgressionItem, 'status'> & {
  family: 'ember';
  numeral: 'I' | 'II' | 'III' | 'IV' | 'V';
  requiredWearStreak: number;
  quote: string;
  resonance: string;
  mysteryLine: string;
  unlockCopy: string;
};

const FOUNDATIONAL_CREST: Omit<ArcInsigniaProgressionItem, 'status'> = {
  id: 'ic-foundational',
  name: 'Foundational Crest',
  tier: 'threshold',
  family: 'foundational',
  summary: 'Base mark retained in inventory.',
};

const EMBER_SIGIL_SERIES: EmberSigilDefinition[] = [
  {
    id: 'ic-ember-1',
    name: 'Ember Sigil I',
    tier: 'ember1',
    family: 'ember',
    numeral: 'I',
    requiredWearStreak: 4,
    unlockCondition: '4 day wear streak',
    summary: 'The first mark appears only after steadiness.',
    quote: 'The first mark appears only after steadiness.',
    resonance: 'Forming',
    mysteryLine: 'Continued steadiness shapes what comes next.',
    unlockCopy: 'A new mark has surfaced.',
  },
  {
    id: 'ic-ember-2',
    name: 'Ember Sigil II',
    tier: 'ember2',
    family: 'ember',
    numeral: 'II',
    requiredWearStreak: 8,
    unlockCondition: '8 day wear streak',
    summary: 'What stays lit begins to take shape.',
    quote: 'What stays lit begins to take shape.',
    resonance: 'Strengthening',
    mysteryLine: 'A deeper mark remains dormant. Consistency wakes it.',
    unlockCopy: 'The ember has taken new shape.',
  },
  {
    id: 'ic-ember-3',
    name: 'Ember Sigil III',
    tier: 'ember3',
    family: 'ember',
    numeral: 'III',
    requiredWearStreak: 13,
    unlockCondition: '13 day wear streak',
    summary: 'Controlled fire reveals stronger form.',
    quote: 'Controlled fire reveals stronger form.',
    resonance: 'Rising',
    mysteryLine: 'Another state remains sealed.',
    unlockCopy: 'A deeper form has revealed itself.',
  },
  {
    id: 'ic-ember-4',
    name: 'Ember Sigil IV',
    tier: 'ember4',
    family: 'ember',
    numeral: 'IV',
    requiredWearStreak: 19,
    unlockCondition: '19 day wear streak',
    summary: 'What endures under pressure begins to sharpen.',
    quote: 'What endures under pressure begins to sharpen.',
    resonance: 'Intensifying',
    mysteryLine: 'The next threshold has not yet yielded.',
    unlockCopy: 'A sealed state has opened.',
  },
  {
    id: 'ic-ember-5',
    name: 'Ember Sigil V',
    tier: 'ember5',
    family: 'ember',
    numeral: 'V',
    requiredWearStreak: 26,
    unlockCondition: '26 day wear streak',
    summary: 'Heat mastered becomes presence.',
    quote: 'Heat mastered becomes presence.',
    resonance: 'Fully Awakened',
    mysteryLine: 'This mark holds.',
    unlockCopy: 'A deeper form has revealed itself.',
  },
];

const EMBER_TIER_SET = new Set<AvatarTier>(EMBER_SIGIL_SERIES.map(item => item.tier));

export const EMBER_SIGIL_FAMILY_DESCRIPTION =
  'A thermal insignia line shaped through steadiness, controlled heat, and private continuity.';

export function isEmberSigilTier(tier: AvatarTier): tier is EmberSigilTier {
  return EMBER_TIER_SET.has(tier);
}

function getTierOption(
  tier: AvatarTier,
  wearStreakDays: number,
  activeTier: AvatarTier,
): ArcInsigniaTierOption {
  if (tier === 'threshold') {
    return {
      tier: 'threshold',
      title: 'Foundational Crest',
      tierLabel: 'Foundation',
      quote: 'The original mark remains as a fixed point.',
      resonance: 'Grounded',
      mysteryLine: 'Continued steadiness shapes what comes next.',
      isUnlocked: true,
      isActive: activeTier === 'threshold',
    };
  }

  const emberDefinition = EMBER_SIGIL_SERIES.find(item => item.tier === tier)!;
  return {
    tier,
    title: emberDefinition.name,
    tierLabel: emberDefinition.numeral,
    quote: emberDefinition.quote,
    resonance: emberDefinition.resonance,
    mysteryLine: emberDefinition.mysteryLine,
    isUnlocked: wearStreakDays >= emberDefinition.requiredWearStreak,
    isActive: activeTier === tier,
  };
}

export function getHighestUnlockedEmberTier(wearStreakDays: number): EmberSigilTier | null {
  const unlocked = EMBER_SIGIL_SERIES
    .filter(item => wearStreakDays >= item.requiredWearStreak)
    .slice(-1)[0];

  return (unlocked?.tier as EmberSigilTier | undefined) ?? null;
}

export function getActiveInsigniaTier(wearStreakDays: number): AvatarTier {
  return getHighestUnlockedEmberTier(wearStreakDays) ?? 'threshold';
}

export function getInsigniaInventoryItems(wearStreakDays: number): ArcInsigniaProgressionItem[] {
  const activeTier = getActiveInsigniaTier(wearStreakDays);

  return [
    {
      ...FOUNDATIONAL_CREST,
      status: activeTier === 'threshold' ? 'selected' : 'unlocked',
    },
    ...EMBER_SIGIL_SERIES.map(item => ({
      ...item,
      status:
        activeTier === item.tier
          ? ('selected' as const)
          : wearStreakDays >= item.requiredWearStreak
            ? ('unlocked' as const)
            : ('locked' as const),
    })),
  ];
}

export function getActiveInsigniaItem(wearStreakDays: number): ArcInsigniaProgressionItem {
  const items = getInsigniaInventoryItems(wearStreakDays);
  return items.find(item => item.status === 'selected') ?? items[0]!;
}

export function getNextInsigniaItem(wearStreakDays: number): ArcInsigniaProgressionItem | null {
  return (
    getInsigniaInventoryItems(wearStreakDays).find(
      item => item.family === 'ember' && item.status === 'locked',
    ) ?? null
  );
}

export function getInsigniaFamilies(
  wearStreakDays: number,
  activeTierOverride?: AvatarTier | null,
): ArcInsigniaFamilyItem[] {
  const activeTier = activeTierOverride ?? getActiveInsigniaTier(wearStreakDays);
  const foundationalOption = getTierOption('threshold', wearStreakDays, activeTier);
  const families: ArcInsigniaFamilyItem[] = [
    {
      familyId: 'foundational_crest',
      displayName: 'Foundational Crest',
      currentTitle: 'Foundational Crest',
      tier: 'threshold',
      tierLabel: foundationalOption.tierLabel,
      quote: foundationalOption.quote,
      resonance: foundationalOption.resonance,
      mysteryLine: foundationalOption.mysteryLine,
      summary: 'Base mark retained in inventory.',
      isOwned: true,
      isActive: activeTier === 'threshold',
      availableTiers: [foundationalOption],
    },
  ];

  const highestUnlockedEmberTier = getHighestUnlockedEmberTier(wearStreakDays);
  if (!highestUnlockedEmberTier) {
    return families;
  }

  const availableEmberTiers = EMBER_SIGIL_SERIES
    .filter(item => wearStreakDays >= item.requiredWearStreak)
    .map(item => getTierOption(item.tier, wearStreakDays, activeTier));
  const displayTier =
    availableEmberTiers.find(item => item.isActive) ??
    availableEmberTiers[availableEmberTiers.length - 1]!;

  families.push({
    familyId: 'ember_sigil',
    displayName: 'Ember Sigil',
    currentTitle: displayTier.title,
    tier: displayTier.tier,
    tierLabel: displayTier.tierLabel,
    quote: displayTier.quote,
    resonance: displayTier.resonance,
    mysteryLine: displayTier.mysteryLine,
    summary: 'Forged ember mark retained in inventory.',
    isOwned: true,
    isActive: isEmberSigilTier(activeTier),
    availableTiers: availableEmberTiers,
  });

  return families;
}
