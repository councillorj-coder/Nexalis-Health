import { useEffect, useMemo, useState, type KeyboardEvent, type ReactNode } from 'react';
import type { AvatarTier } from '../../data/arc-types';
import ArcInsignia from './ArcInsignia';
import { foundationTheme, getArcTypographyStyle, hexToRgba } from './arc-theme';

export type ArcOnboardingProfile = {
  anonymousUsername: string;
  tier: AvatarTier;
};

type OnboardingStep =
  | 'signInChoice'
  | 'accessType'
  | 'partnerCode'
  | 'gender'
  | 'privacy'
  | 'disclaimer'
  | 'account'
  | 'baselineComplete';

type EntryProvider = 'apple' | 'google' | 'email';
type AccessType = 'user' | 'visitor';
type GenderSelection = 'male' | 'female' | 'preferNotToSay';

const EMAIL_PROGRESS_STEPS: OnboardingStep[] = [
  'gender',
  'account',
  'privacy',
  'disclaimer',
  'baselineComplete',
];

const SOCIAL_PROGRESS_STEPS: OnboardingStep[] = [
  'gender',
  'privacy',
  'disclaimer',
  'baselineComplete',
];

const PRIVACY_INTEREST_SUGGESTIONS = ['Food', 'Travel', 'Music', 'Nature', 'Coffee', 'Design', 'Fitness', 'Film'];

const USERNAME_NEUTRAL_WORDS = [
  'quiet',
  'atlas',
  'velvet',
  'harbor',
  'signal',
  'crest',
  'drift',
  'linen',
  'ember',
  'grove',
  'thread',
  'current',
  'field',
  'alloy',
  'cinder',
  'north',
];

const USERNAME_INTEREST_THEMES = [
  {
    keywords: ['food', 'cook', 'bake', 'dessert', 'snack', 'kitchen', 'chef'],
    words: ['olive', 'cocoa', 'saffron', 'fig', 'basil', 'truffle'],
  },
  {
    keywords: ['coffee', 'tea', 'espresso', 'latte'],
    words: ['roast', 'mocha', 'cider', 'amber', 'brew', 'sable'],
  },
  {
    keywords: ['travel', 'trip', 'flight', 'adventure', 'explore'],
    words: ['atlas', 'harbor', 'route', 'summit', 'drift', 'vista'],
  },
  {
    keywords: ['music', 'song', 'audio', 'vinyl', 'concert'],
    words: ['tempo', 'chorus', 'echo', 'vinyl', 'cadence', 'lyric'],
  },
  {
    keywords: ['nature', 'outdoor', 'forest', 'garden', 'plant'],
    words: ['grove', 'fern', 'river', 'stone', 'cedar', 'meadow'],
  },
  {
    keywords: ['design', 'art', 'creative', 'draw', 'fashion'],
    words: ['canvas', 'ink', 'frame', 'linea', 'muse', 'studio'],
  },
  {
    keywords: ['fitness', 'health', 'training', 'gym', 'run'],
    words: ['stride', 'forge', 'lift', 'pulse', 'peak', 'motion'],
  },
  {
    keywords: ['film', 'movie', 'cinema', 'story'],
    words: ['scene', 'fable', 'frame', 'reel', 'lumen', 'novel'],
  },
];

const ONBOARDING_COLORS = {
  background: 'linear-gradient(180deg, rgba(252,250,247,0.98) 0%, rgba(245,240,232,0.98) 100%)',
  surface: 'rgba(255,255,255,0.94)',
  inset: 'rgba(247,242,234,0.96)',
  pill: 'rgba(252,249,244,0.96)',
  border: 'rgba(18,24,32,0.08)',
  borderStrong: 'rgba(18,24,32,0.14)',
  textPrimary: '#131922',
  textSecondary: '#566171',
  textMuted: '#7F8895',
  accent: '#87715D',
  accentSoft: 'rgba(135,113,93,0.12)',
  accentStrong: '#1B232D',
} as const;

const ENTRY_COLORS = {
  background: 'linear-gradient(180deg, rgba(252,250,247,0.99) 0%, rgba(246,241,234,0.99) 100%)',
  surface: 'rgba(255,255,255,0.95)',
  surfaceStrong: 'rgba(247,242,234,0.98)',
  border: 'rgba(18,24,32,0.08)',
  borderStrong: 'rgba(18,24,32,0.14)',
  textPrimary: '#131922',
  textSecondary: '#566171',
  textMuted: '#7F8895',
  accent: '#87715D',
  accentSoft: 'rgba(135,113,93,0.12)',
} as const;

function normalizeInterest(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ');
}

function toCompactHandle(value: string) {
  return normalizeInterest(value).replace(/\s+/g, '');
}

function formatInterestLabel(value: string) {
  return normalizeInterest(value)
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function pickRandomWord(pool: string[]) {
  return pool[Math.floor(Math.random() * pool.length)] ?? 'atlas';
}

function resolveInterestWords(interests: string[]) {
  const words = new Set<string>();

  interests.forEach(interest => {
    const normalized = normalizeInterest(interest);
    if (!normalized) {
      return;
    }

    USERNAME_INTEREST_THEMES.forEach(theme => {
      if (theme.keywords.some(keyword => normalized.includes(keyword))) {
        theme.words.forEach(word => words.add(word));
      }
    });

    const compact = toCompactHandle(normalized);
    if (compact.length >= 4 && compact.length <= 10) {
      words.add(compact);
    }
  });

  return Array.from(words);
}

function createGeneratedUsername(interests: string[]) {
  const themedWords = resolveInterestWords(interests);
  const firstPool = themedWords.length > 0 ? [...themedWords, ...USERNAME_NEUTRAL_WORDS] : USERNAME_NEUTRAL_WORDS;
  const secondPool = themedWords.length > 0 ? [...USERNAME_NEUTRAL_WORDS, ...themedWords] : USERNAME_NEUTRAL_WORDS;
  const first = pickRandomWord(firstPool);
  const secondCandidates = secondPool.filter(word => word !== first);
  const second = pickRandomWord(secondCandidates.length > 0 ? secondCandidates : USERNAME_NEUTRAL_WORDS);

  let candidate = `${first}${second}`;
  if (candidate.length < 8) {
    candidate += pickRandomWord(USERNAME_NEUTRAL_WORDS);
  }

  if (Math.random() < 0.24) {
    candidate += `${Math.floor(11 + Math.random() * 78)}`;
  }

  return candidate.slice(0, 20);
}

function PrimaryAction({
  label,
  onClick,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-full px-4 py-3 transition-all duration-300 disabled:cursor-default disabled:opacity-40"
      style={{
        ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
        background: `linear-gradient(180deg, ${hexToRgba(ONBOARDING_COLORS.accentStrong, 0.98)} 0%, ${hexToRgba(ONBOARDING_COLORS.accentStrong, 0.92)} 100%)`,
        border: `1px solid ${hexToRgba(ONBOARDING_COLORS.accentStrong, 0.32)}`,
        color: '#FAFBFD',
        boxShadow: `0 14px 28px ${hexToRgba('#000000', 0.12)}`,
      }}
    >
      {label}
    </button>
  );
}

function SecondaryAction({
  label,
  onClick,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-full border px-4 py-3 transition-colors duration-300 disabled:cursor-default disabled:opacity-45"
      style={{
        ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
        background: ONBOARDING_COLORS.surface,
        borderColor: ONBOARDING_COLORS.borderStrong,
        color: ONBOARDING_COLORS.textSecondary,
      }}
    >
      {label}
    </button>
  );
}

function AuthActionButton({
  label,
  onClick,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-[24px] border px-4 py-4 text-left transition-all duration-300 hover:translate-y-[-1px] disabled:cursor-default disabled:opacity-45"
      style={{
        ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
        background: ENTRY_COLORS.surface,
        borderColor: ENTRY_COLORS.borderStrong,
        color: ENTRY_COLORS.textPrimary,
        boxShadow: `0 12px 28px ${hexToRgba('#000000', 0.16)}`,
      }}
    >
      {label}
    </button>
  );
}

function AccessTypeCard({
  title,
  body,
  active,
  onClick,
}: {
  title: string;
  body: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[28px] border p-5 text-left transition-all duration-300"
      style={{
        background: active ? ENTRY_COLORS.surfaceStrong : ENTRY_COLORS.surface,
        borderColor: active ? ENTRY_COLORS.accent : ENTRY_COLORS.borderStrong,
        boxShadow: active ? `0 16px 32px ${hexToRgba('#000000', 0.18)}` : 'none',
      }}
    >
      <div className="flex items-center justify-between">
        <div style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: ENTRY_COLORS.textPrimary }}>
          {title}
        </div>
        <div
          className="flex h-5 w-5 items-center justify-center rounded-full border"
          style={{
            borderColor: active ? ENTRY_COLORS.accent : ENTRY_COLORS.borderStrong,
            background: active ? ENTRY_COLORS.accentSoft : 'transparent',
          }}
        >
          {active ? <div className="h-2 w-2 rounded-full" style={{ background: ENTRY_COLORS.accent }} /> : null}
        </div>
      </div>
      <div className="mt-2 max-w-[250px]" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: ENTRY_COLORS.textSecondary }}>
        {body}
      </div>
    </button>
  );
}

function SetupChoiceCard({
  title,
  body,
  active,
  onClick,
}: {
  title: string;
  body: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[28px] border p-5 text-left transition-all duration-300"
      style={{
        background: active ? ONBOARDING_COLORS.surface : ONBOARDING_COLORS.inset,
        borderColor: active ? ONBOARDING_COLORS.accent : ONBOARDING_COLORS.border,
        boxShadow: active ? `0 12px 24px ${hexToRgba('#000000', 0.08)}` : 'none',
      }}
    >
      <div className="flex items-center justify-between">
        <div style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: ONBOARDING_COLORS.textPrimary }}>
          {title}
        </div>
        <div
          className="flex h-5 w-5 items-center justify-center rounded-full border"
          style={{
            borderColor: active ? ONBOARDING_COLORS.accent : ONBOARDING_COLORS.borderStrong,
            background: active ? ONBOARDING_COLORS.accentSoft : 'transparent',
          }}
        >
          {active ? <div className="h-2 w-2 rounded-full" style={{ background: ONBOARDING_COLORS.accent }} /> : null}
        </div>
      </div>
      <div className="mt-2 max-w-[250px]" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: ONBOARDING_COLORS.textSecondary }}>
        {body}
      </div>
    </button>
  );
}

function TextInput({
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password';
  placeholder: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={event => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-[22px] border px-4 py-3 outline-none placeholder:opacity-70"
      style={{
        ...getArcTypographyStyle(foundationTheme, 'body'),
        background: ONBOARDING_COLORS.surface,
        borderColor: ONBOARDING_COLORS.borderStrong,
        color: ONBOARDING_COLORS.textPrimary,
      }}
    />
  );
}

function DetailBullet({ children }: { children: string }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="mt-1.5 h-1.5 w-1.5 rounded-full"
        style={{ background: ONBOARDING_COLORS.accent }}
      />
      <p style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: ONBOARDING_COLORS.textSecondary }}>
        {children}
      </p>
    </div>
  );
}

function OnboardingFrame({
  step,
  canGoBack,
  onBack,
  title,
  body,
  children,
  footer,
  progressSteps = EMAIL_PROGRESS_STEPS,
  showProgress = false,
}: {
  step: OnboardingStep;
  canGoBack: boolean;
  onBack: () => void;
  title: string;
  body: string;
  children?: ReactNode;
  footer: ReactNode;
  progressSteps?: OnboardingStep[];
  showProgress?: boolean;
}) {
  const currentStepNumber = progressSteps.indexOf(step) + 1;

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[32px] border px-5 pb-5 pt-4" style={{ background: ONBOARDING_COLORS.background, borderColor: ONBOARDING_COLORS.borderStrong }}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.82),_transparent_50%)]" />
      <div className="pointer-events-none absolute -top-20 right-[-72px] h-56 w-56 rounded-full blur-3xl" style={{ background: hexToRgba(ONBOARDING_COLORS.accent, 0.12) }} />
      <div className="pointer-events-none absolute bottom-[-84px] left-[-64px] h-52 w-52 rounded-full blur-3xl" style={{ background: hexToRgba(ONBOARDING_COLORS.accent, 0.08) }} />

      <div className="relative z-10 mb-6 flex items-center justify-between">
        <div className="w-10">
          {canGoBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-full border"
              style={{
                background: ONBOARDING_COLORS.surface,
                borderColor: ONBOARDING_COLORS.borderStrong,
                color: ONBOARDING_COLORS.textPrimary,
              }}
              aria-label="Go back"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : null}
        </div>

        {showProgress ? (
          <div className="rounded-full border px-3 py-1" style={{ ...getArcTypographyStyle(foundationTheme, 'label'), background: ONBOARDING_COLORS.pill, borderColor: ONBOARDING_COLORS.border, color: ONBOARDING_COLORS.textMuted }}>
            {currentStepNumber} of {progressSteps.length}
          </div>
        ) : (
          <div className="w-[72px]" />
        )}
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto pr-1" style={{ scrollbarWidth: 'none' }}>
          <h1 style={{ ...getArcTypographyStyle(foundationTheme, 'screenTitle'), color: ONBOARDING_COLORS.textPrimary, fontSize: '1.8rem' }}>
            {title}
          </h1>
          <p className="mt-3 max-w-[290px]" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: ONBOARDING_COLORS.textSecondary }}>
            {body}
          </p>

          <div className="mt-6 pb-2">{children}</div>
        </div>
      </div>

      <div className="relative z-10 mt-4 shrink-0 space-y-3">{footer}</div>
    </div>
  );
}

function EntryFrame({
  title,
  subtitle,
  children,
  footer,
  canGoBack = false,
  onBack,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  canGoBack?: boolean;
  onBack?: () => void;
}) {
  return (
    <div
      className="relative flex h-full flex-col overflow-hidden rounded-[32px] border px-5 pb-6 pt-5"
      style={{
        background: ENTRY_COLORS.background,
        borderColor: ENTRY_COLORS.border,
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(184,138,122,0.14),_transparent_40%)]" />
      <div className="pointer-events-none absolute -top-20 right-[-64px] h-56 w-56 rounded-full blur-3xl" style={{ background: hexToRgba(ENTRY_COLORS.accent, 0.12) }} />
      <div className="pointer-events-none absolute bottom-[-90px] left-[-48px] h-56 w-56 rounded-full blur-3xl" style={{ background: hexToRgba('#FFFFFF', 0.05) }} />

      <div className="relative z-10 mb-10 flex h-10 items-center justify-between">
        <div className="w-10">
          {canGoBack && onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-full border"
              style={{
                background: ENTRY_COLORS.surface,
                borderColor: ENTRY_COLORS.borderStrong,
                color: ENTRY_COLORS.textPrimary,
              }}
              aria-label="Go back"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : null}
        </div>

        <div
          className="rounded-full border px-3 py-1"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'label'),
            background: ENTRY_COLORS.surface,
            borderColor: ENTRY_COLORS.border,
            color: ENTRY_COLORS.textMuted,
          }}
        >
          Cinder HUB
        </div>
      </div>

      <div className="relative z-10 flex-1">
        <h1 style={{ ...getArcTypographyStyle(foundationTheme, 'screenTitle'), color: ENTRY_COLORS.textPrimary, fontSize: '1.9rem' }}>
          {title}
        </h1>
        <p className="mt-3 max-w-[286px]" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: ENTRY_COLORS.textSecondary }}>
          {subtitle}
        </p>

        <div className="mt-8 space-y-3">{children}</div>
      </div>

      {footer ? <div className="relative z-10 mt-8">{footer}</div> : null}
    </div>
  );
}

export default function ArcOnboardingFlow({
  onComplete,
  onSkipToDashboard,
}: {
  onComplete: (profile?: ArcOnboardingProfile) => void;
  onSkipToDashboard?: () => void;
}) {
  const [step, setStep] = useState<OnboardingStep>('signInChoice');
  const [entryProvider, setEntryProvider] = useState<EntryProvider | null>(null);
  const [accessType, setAccessType] = useState<AccessType>('user');
  const [genderSelection, setGenderSelection] = useState<GenderSelection>('male');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [partnerCode, setPartnerCode] = useState('');
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(false);
  const [acknowledgedDisclaimer, setAcknowledgedDisclaimer] = useState(false);
  const [username, setUsername] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [usernameGenerationCount, setUsernameGenerationCount] = useState(0);
  const canContinueAccount = email.trim().length > 3 && password.trim().length > 5;
  const canContinueUsername = usernameGenerationCount > 0 && username.trim().length >= 4;
  const canContinuePartnerCode = partnerCode.trim().length >= 5;
  const availableInterestSuggestions = useMemo(
    () =>
      PRIVACY_INTEREST_SUGGESTIONS.filter(suggestion => {
        const normalizedSuggestion = normalizeInterest(suggestion);
        return !selectedInterests.some(interest => normalizeInterest(interest) === normalizedSuggestion);
      }),
    [selectedInterests],
  );
  const progressSteps = entryProvider === 'email' ? EMAIL_PROGRESS_STEPS : SOCIAL_PROGRESS_STEPS;

  const addInterestReference = (rawValue: string) => {
    const normalizedValue = normalizeInterest(rawValue);
    if (!normalizedValue || selectedInterests.length >= 5) {
      return;
    }

    if (selectedInterests.some(interest => normalizeInterest(interest) === normalizedValue)) {
      setInterestInput('');
      return;
    }

    setSelectedInterests(current => [...current, normalizedValue]);
    setInterestInput('');
  };

  const removeInterestReference = (interestToRemove: string) => {
    setSelectedInterests(current =>
      current.filter(interest => normalizeInterest(interest) !== normalizeInterest(interestToRemove)),
    );
  };

  const handleInterestKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    addInterestReference(interestInput);
  };

  const generateUsername = () => {
    let nextUsername = createGeneratedUsername(selectedInterests);

    for (let attempt = 0; attempt < 6 && nextUsername === username; attempt += 1) {
      nextUsername = createGeneratedUsername(selectedInterests);
    }

    setUsername(nextUsername);
    setUsernameGenerationCount(count => count + 1);
  };

  const goBack = () => {
    switch (step) {
      case 'accessType':
        setStep('signInChoice');
        return;
      case 'partnerCode':
        setStep('accessType');
        return;
      case 'gender':
        setStep('accessType');
        return;
      case 'account':
        setStep('gender');
        return;
      case 'privacy':
        setStep(entryProvider === 'email' ? 'account' : 'gender');
        return;
      case 'disclaimer':
        setStep('privacy');
        return;
      default:
        return;
    }
  };

  if (step === 'signInChoice') {
    return (
      <EntryFrame
        title="Sign in to Cinder HUB"
        subtitle="Private access to your Nexalis account"
        footer={
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setIsAdultConfirmed(value => !value)}
              className="flex w-full items-start gap-3 rounded-[22px] border px-4 py-4 text-left"
              style={{
                background: ENTRY_COLORS.surface,
                borderColor: isAdultConfirmed ? ENTRY_COLORS.accent : ENTRY_COLORS.borderStrong,
              }}
            >
              <div
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border"
                style={{
                  background: isAdultConfirmed ? ENTRY_COLORS.accentSoft : 'transparent',
                  borderColor: isAdultConfirmed ? ENTRY_COLORS.accent : ENTRY_COLORS.borderStrong,
                  color: ENTRY_COLORS.textPrimary,
                }}
              >
                {isAdultConfirmed ? (
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 13l4 4L19 7" />
                  </svg>
                ) : null}
              </div>
              <span style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: ENTRY_COLORS.textSecondary }}>
                I am 18 or older
              </span>
            </button>

            <p className="px-2 text-center" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: ENTRY_COLORS.textMuted }}>
              By continuing, you agree to our Terms and Privacy Policy
            </p>
          </div>
        }
      >
        <AuthActionButton
          label="Continue with Apple"
          disabled={!isAdultConfirmed}
          onClick={() => {
            setEntryProvider('apple');
            setStep('accessType');
          }}
        />
        <AuthActionButton
          label="Continue with Google"
          disabled={!isAdultConfirmed}
          onClick={() => {
            setEntryProvider('google');
            setStep('accessType');
          }}
        />
        <AuthActionButton
          label="Continue with Email"
          disabled={!isAdultConfirmed}
          onClick={() => {
            setEntryProvider('email');
            setStep('accessType');
          }}
        />
        {onSkipToDashboard ? (
          <SecondaryAction
            label="Skip to Cinder HUB"
            disabled={!isAdultConfirmed}
            onClick={onSkipToDashboard}
          />
        ) : null}
      </EntryFrame>
    );
  }

  if (step === 'accessType') {
    return (
      <EntryFrame
        title="Choose access type"
        subtitle="Select how you want to continue into Cinder HUB."
        canGoBack
        onBack={goBack}
        footer={
          <PrimaryAction
            label="Continue"
            onClick={() => {
              if (accessType === 'visitor') {
                setStep('partnerCode');
                return;
              }

              setStep('gender');
            }}
          />
        }
      >
        <AccessTypeCard
          title="User"
          body="Continue into your private Nexalis setup and personal account flow."
          active={accessType === 'user'}
          onClick={() => setAccessType('user')}
        />
        <AccessTypeCard
          title="Visitor"
          body="Use a partner code to enter a limited shared access experience."
          active={accessType === 'visitor'}
          onClick={() => setAccessType('visitor')}
        />
      </EntryFrame>
    );
  }

  if (step === 'partnerCode') {
    return (
      <EntryFrame
        title="Enter partner code"
        subtitle="Visitor access uses a private code shared directly with you."
        canGoBack
        onBack={goBack}
        footer={
          <PrimaryAction
            label="Continue as Visitor"
            onClick={() =>
              onComplete({
                anonymousUsername: 'partnerview',
                tier: 'threshold',
              })
            }
            disabled={!canContinuePartnerCode}
          />
        }
      >
        <div className="rounded-[28px] border p-5" style={{ background: ENTRY_COLORS.surface, borderColor: ENTRY_COLORS.borderStrong }}>
          <input
            type="text"
            value={partnerCode}
            onChange={event => setPartnerCode(event.target.value.toUpperCase())}
            placeholder="Partner code"
            className="w-full rounded-[22px] border px-4 py-3 outline-none placeholder:opacity-70"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'body'),
              background: ENTRY_COLORS.surfaceStrong,
              borderColor: ENTRY_COLORS.borderStrong,
              color: ENTRY_COLORS.textPrimary,
            }}
          />
        </div>
      </EntryFrame>
    );
  }

  if (step === 'gender') {
    return (
      <OnboardingFrame
        step={step}
        canGoBack
        onBack={goBack}
        title="Select gender"
        body="This helps align setup with the intended experience. You can also choose not to share it."
        progressSteps={progressSteps}
        footer={
          <PrimaryAction
            label="Continue"
            onClick={() => {
              if (entryProvider === 'email') {
                setStep('account');
                return;
              }

              setStep('privacy');
            }}
          />
        }
      >
        <div className="space-y-3">
          <SetupChoiceCard
            title="Male"
            body="Continue with the current Cinder HUB setup path."
            active={genderSelection === 'male'}
            onClick={() => setGenderSelection('male')}
          />
          <SetupChoiceCard
            title="Female"
            body="Continue with the current Cinder HUB setup path."
            active={genderSelection === 'female'}
            onClick={() => setGenderSelection('female')}
          />
          <SetupChoiceCard
            title="Prefer not to say"
            body="Continue without storing a stated gender in setup."
            active={genderSelection === 'preferNotToSay'}
            onClick={() => setGenderSelection('preferNotToSay')}
          />
        </div>
      </OnboardingFrame>
    );
  }

  if (step === 'privacy') {
    return (
      <OnboardingFrame
        step={step}
        canGoBack
        onBack={goBack}
        title="Built for privacy"
        body="Generate a private in-app username and shape the suggestions with up to five interests if you want the output to feel more like you while staying anonymous."
        progressSteps={progressSteps}
        footer={<PrimaryAction label="Continue" onClick={() => setStep('disclaimer')} disabled={!canContinueUsername} />}
      >
        <div className="space-y-4 rounded-[28px] border p-5" style={{ background: ONBOARDING_COLORS.surface, borderColor: ONBOARDING_COLORS.borderStrong }}>
          <div className="space-y-3">
            <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: ONBOARDING_COLORS.textMuted }}>
              Privacy highlights
            </div>
            <DetailBullet>Anonymous username only inside the app</DetailBullet>
            <DetailBullet>Private sync across your devices</DetailBullet>
            <DetailBullet>No public profile or community feed</DetailBullet>
          </div>

          <div className="h-px" style={{ background: ONBOARDING_COLORS.border }} />

          <div className="space-y-4">
            <div>
              <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: ONBOARDING_COLORS.textMuted }}>
                Generated username
              </div>
              <div
                className="mt-2 rounded-[22px] border px-4 py-4"
                style={{
                  background: ONBOARDING_COLORS.inset,
                  borderColor: ONBOARDING_COLORS.border,
                  color: ONBOARDING_COLORS.textPrimary,
                  ...getArcTypographyStyle(foundationTheme, 'heroValue'),
                  fontSize: '1.25rem',
                }}
              >
                {username ? `@${username}` : 'Generate a private username'}
              </div>
              <p className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: ONBOARDING_COLORS.textMuted }}>
                You can regenerate as many times as you like before continuing.
              </p>
            </div>

            <div>
              <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: ONBOARDING_COLORS.textMuted }}>
                Interest references
              </div>
              <p className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: ONBOARDING_COLORS.textMuted }}>
                Add up to five interests to influence the name style.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={interestInput}
                onChange={event => setInterestInput(event.target.value)}
                onKeyDown={handleInterestKeyDown}
                placeholder="Add an interest"
                className="w-full rounded-[22px] border px-4 py-3 outline-none placeholder:opacity-70"
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'body'),
                  background: ONBOARDING_COLORS.inset,
                  borderColor: ONBOARDING_COLORS.borderStrong,
                  color: ONBOARDING_COLORS.textPrimary,
                }}
              />
              <button
                type="button"
                onClick={() => addInterestReference(interestInput)}
                disabled={selectedInterests.length >= 5 || normalizeInterest(interestInput).length === 0}
                className="shrink-0 rounded-full border px-4 py-3 transition-all duration-300 disabled:cursor-default disabled:opacity-40"
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                  background: ONBOARDING_COLORS.inset,
                  borderColor: ONBOARDING_COLORS.borderStrong,
                  color: ONBOARDING_COLORS.textPrimary,
                }}
              >
                Add
              </button>
            </div>

            {selectedInterests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedInterests.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => removeInterestReference(interest)}
                    className="rounded-full border px-3 py-2 transition-colors duration-300"
                    style={{
                      ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                      background: ONBOARDING_COLORS.inset,
                      borderColor: ONBOARDING_COLORS.borderStrong,
                      color: ONBOARDING_COLORS.textSecondary,
                    }}
                  >
                    {formatInterestLabel(interest)}
                    <span className="ml-2" style={{ color: ONBOARDING_COLORS.textMuted }}>
                      x
                    </span>
                  </button>
                ))}
              </div>
            ) : null}

            <button
              type="button"
              onClick={generateUsername}
              className="w-full rounded-full px-4 py-3 transition-all duration-300"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                background: hexToRgba(ONBOARDING_COLORS.accentStrong, 0.08),
                border: `1px solid ${hexToRgba(ONBOARDING_COLORS.accentStrong, 0.18)}`,
                color: ONBOARDING_COLORS.accentStrong,
              }}
            >
              {usernameGenerationCount > 0 ? 'Regenerate username' : 'Generate username'}
            </button>

            <div className="flex flex-wrap gap-2">
              {availableInterestSuggestions.map(suggestion => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => addInterestReference(suggestion)}
                  disabled={selectedInterests.length >= 5}
                  className="rounded-full border px-3 py-2 transition-colors duration-300 disabled:cursor-default disabled:opacity-40"
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                    background: ONBOARDING_COLORS.surface,
                    borderColor: ONBOARDING_COLORS.border,
                    color: ONBOARDING_COLORS.textSecondary,
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </OnboardingFrame>
    );
  }

  if (step === 'disclaimer') {
    return (
      <OnboardingFrame
        step={step}
        canGoBack
        onBack={goBack}
        title="Before you begin"
        body="Cinder HUB is designed for personal insight and long-term trend understanding. It does not diagnose, treat, or replace medical advice."
        progressSteps={progressSteps}
        footer={<PrimaryAction label="Agree and Continue" onClick={() => setStep('baselineComplete')} disabled={!acknowledgedDisclaimer} />}
      >
        <div className="space-y-4">
          <div className="rounded-[28px] border p-5" style={{ background: ONBOARDING_COLORS.inset, borderColor: ONBOARDING_COLORS.border }}>
            <div style={{ ...getArcTypographyStyle(foundationTheme, 'insightTitle'), color: ONBOARDING_COLORS.textPrimary }}>
              Personal insight only
            </div>
            <p className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: ONBOARDING_COLORS.textSecondary }}>
              Your baseline, signals, and summaries are there to help you understand your own patterns over time.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAcknowledgedDisclaimer(value => !value)}
            className="flex w-full items-start gap-3 rounded-[22px] border px-4 py-4 text-left"
            style={{
              background: ONBOARDING_COLORS.surface,
              borderColor: acknowledgedDisclaimer ? ONBOARDING_COLORS.accent : ONBOARDING_COLORS.borderStrong,
            }}
          >
            <div
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border"
              style={{
                background: acknowledgedDisclaimer ? ONBOARDING_COLORS.accentSoft : 'transparent',
                borderColor: acknowledgedDisclaimer ? ONBOARDING_COLORS.accent : ONBOARDING_COLORS.borderStrong,
                color: ONBOARDING_COLORS.textPrimary,
              }}
            >
              {acknowledgedDisclaimer ? (
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 13l4 4L19 7" />
                </svg>
              ) : null}
            </div>
            <span style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: ONBOARDING_COLORS.textSecondary }}>
              I understand that this experience is for private insight only and does not replace professional care.
            </span>
          </button>
        </div>
      </OnboardingFrame>
    );
  }

  if (step === 'account') {
    return (
      <OnboardingFrame
        step={step}
        canGoBack
        onBack={goBack}
        title="Create your account"
        body="Private access starts with your email and password. Used for login, sync, and recovery only."
        progressSteps={progressSteps}
        footer={
          <PrimaryAction
            label="Continue"
            onClick={() => setStep('privacy')}
            disabled={!canContinueAccount}
          />
        }
      >
        <div className="space-y-4">
          <div className="space-y-3 rounded-[28px] border p-5" style={{ background: ONBOARDING_COLORS.inset, borderColor: ONBOARDING_COLORS.border }}>
            <TextInput type="email" value={email} onChange={setEmail} placeholder="Email address" />
            <TextInput type="password" value={password} onChange={setPassword} placeholder="Password" />
          </div>

          <p style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: ONBOARDING_COLORS.textMuted }}>
            Used for login, sync, and recovery only
          </p>
        </div>
      </OnboardingFrame>
    );
  }

  return (
    <OnboardingFrame
      step="baselineComplete"
      canGoBack={false}
      onBack={goBack}
      title="Setup complete"
        body="Your private profile is ready. Continue to Cinder HUB to connect your first device and unlock your dashboard."
      progressSteps={progressSteps}
      footer={
        <PrimaryAction
          label="Continue to Cinder HUB"
          onClick={() =>
            onComplete({
              anonymousUsername: username,
              tier: 'threshold',
            })
          }
        />
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4 rounded-[28px] border p-5" style={{ background: ONBOARDING_COLORS.inset, borderColor: ONBOARDING_COLORS.border }}>
          <ArcInsignia tier="threshold" size={46} />
          <div>
            <div style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: ONBOARDING_COLORS.textPrimary }}>
              @{username}
            </div>
            <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: ONBOARDING_COLORS.textMuted }}>
              Foundation crest active by default
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border px-4 py-3" style={{ background: ONBOARDING_COLORS.surface, borderColor: ONBOARDING_COLORS.border }}>
          <div style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: ONBOARDING_COLORS.textSecondary }}>
            Device connection happens next in Cinder HUB. The dashboard unlocks as soon as your first device is connected.
          </div>
        </div>
      </div>
    </OnboardingFrame>
  );
}
