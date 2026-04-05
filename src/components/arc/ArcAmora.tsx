import { useEffect, useMemo, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { foundationTheme, getArcGlassPillStyle, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';
import type { ArcAmoraGuidanceMode, ArcAmoraGuidanceNote } from './amoraGuidanceLayer';

export type ArcAmoraGuidanceLevel = 'minimal' | 'standard' | 'detailed';

export type ArcAmoraTopicId =
  | 'home'
  | 'calibration-locked'
  | 'edge-score'
  | 'edge-shift'
  | 'live-signal'
  | 'trend-view'
  | 'event-archive'
  | 'first-session'
  | 'session-static'
  | 'session-motion'
  | 'strong-session'
  | 'soft-session'
  | 'pattern-detected'
  | 'improvement-detected'
  | 'personal-best'
  | 'nocturnal-insight'
  | 'recovery-insight'
  | 'settings';

export interface ArcAmoraSettings {
  enabled: boolean;
  proactiveInsights: boolean;
  guidanceLevel: ArcAmoraGuidanceLevel;
  partnerAwarenessGuidance: ArcAmoraGuidanceMode;
}

export interface ArcAmoraContent {
  topic: ArcAmoraTopicId;
  summary: string;
  detail?: string;
  eyebrow?: string;
  secondary?: string;
}

export interface ArcAmoraTourStep {
  id: string;
  title: string;
  summary: string;
  detail?: string;
}

export interface ArcAmoraTourAnchorRect {
  top: number;
  left: number;
  width: number;
  height: number;
  containerWidth: number;
  containerHeight: number;
}

const AMORA_PANEL_INTRO_MESSAGES = [
  'I’m here. What would you like to understand?',
  'Let’s make sense of what you’re seeing.',
  'Your private guide is ready. Ask me anything.',
  'I can help explain your scores, signals, and trends.',
  'I’m here when you want clarity.',
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const AMORA_ROTATING_MESSAGES = [
  "I'm here. What would you like to understand?",
  "Let's make sense of what you're seeing.",
  'Your private guide is ready. Ask me anything.',
  'I can help explain your scores, signals, and trends.',
  "I'm here when you want clarity.",
] as const;

function getAmoraUsername(username?: string) {
  return username?.trim() ?? '';
}

function withAmoraUsername(lead: string, username?: string) {
  const nextUsername = getAmoraUsername(username);
  return nextUsername ? `${lead}, ${nextUsername}.` : `${lead}.`;
}

export function resolveAmoraContent(
  topic: ArcAmoraTopicId,
  options?: {
    username?: string;
    calibrationComplete?: boolean;
    insightLine?: string;
    direction?: 'up' | 'down' | 'flat';
  },
): ArcAmoraContent {
  const username = getAmoraUsername(options?.username);
  const calibrationComplete = options?.calibrationComplete ?? false;

  if (topic === 'home') {
    return {
      topic,
      eyebrow: 'Amora',
      summary: calibrationComplete
        ? withAmoraUsername('Calibration is complete', username)
        : username
          ? `Welcome back, ${username}.`
          : 'Welcome back.',
      detail: calibrationComplete
        ? 'EDGE Score is now live, and deeper comparison features are online. Personal bests, stronger pattern reads, and more meaningful trend interpretation all have enough history to work from.'
        : 'Right now I can help explain your live signal, early trends, sessions, and calibration progress. EDGE Score, personal bests, and deeper comparison features unlock once calibration reaches 100%.',
      secondary: calibrationComplete
        ? 'If you want, I can walk you through what changed now that calibration is complete.'
        : 'If you want, I can walk you through what is already active and what comes online next.',
    };
  }

  if (topic === 'calibration-locked') {
    return {
      topic,
      eyebrow: 'Calibration',
      summary: 'Learning your baseline.',
      detail:
        `${withAmoraUsername("I'm learning how your system builds, holds, and settles", username)} That gives EDGE Score a real starting point instead of a generic average. EDGE Score unlocks once calibration reaches 100%.`,
      secondary: 'Nothing here is random. Every signal helps sharpen the pattern.',
    };
  }

  if (topic === 'edge-score') {
    return {
      topic,
      eyebrow: 'EDGE Score',
      summary: 'EDGE Score reflects your current performance capability.',
      detail:
        "I look at how you build, how long you hold, and how stable your response stays over time. That keeps the score tied to pattern, not a single moment.",
      secondary:
        options?.insightLine === 'Stronger hold. Faster rise.'
          ? 'Your recent sessions are showing stronger hold and faster rise. If that stays consistent, the score will keep strengthening.'
          : undefined,
    };
  }

  if (topic === 'edge-shift') {
    return {
      topic,
      eyebrow: 'Score change',
      summary:
        options?.direction === 'down'
          ? withAmoraUsername('This stretch looks a bit less stable than your baseline', username)
          : options?.direction === 'up'
            ? withAmoraUsername("You're improving", username)
            : username
              ? `Your recent pattern is holding steady, ${username}.`
              : 'Your recent pattern is holding steady.',
      detail:
        options?.direction === 'down'
          ? "Your build and hold did not fully align this time. That can come from recovery, stress, timing, or normal variation in your system. I'll keep tracking to see whether this is isolated or part of a pattern."
          : options?.direction === 'up'
            ? "Recent sessions are showing steadier hold and cleaner recovery. That usually means your system is responding more efficiently. I'll keep watching to see whether the trend holds."
            : "Nothing major has shifted. I'm watching for stronger consistency, cleaner recovery, or early signs of drift.",
    };
  }

  if (topic === 'live-signal') {
    return {
      topic,
      eyebrow: 'Live',
      summary: 'Live signal shows how your current response is moving against baseline.',
      detail:
        'I watch where the signal is sitting now, how quickly it rises, and how cleanly it settles. That makes it easier to tell whether a shift is brief or starting to repeat.',
      secondary: 'Short changes matter less than repeatable movement over time.',
    };
  }

  if (topic === 'trend-view') {
    return {
      topic,
      eyebrow: 'Trend View',
      summary: 'Trends show how your performance changes over time.',
      detail:
        'This is where stronger days, steadier sessions, and changes in recovery start to separate from noise. The more history you collect, the clearer those patterns become.',
      secondary: 'If you want a quick read on your recent sessions, I can walk you through what changed.',
    };
  }

  if (topic === 'event-archive') {
    return {
      topic,
      eyebrow: 'Archive',
      summary: 'Each meaningful session is captured automatically.',
      detail:
        'This gives us a record of how you build, hold, and recover over time. As the archive grows, I can compare what feels consistent, what is improving, and what may be holding you back.',
      secondary: 'Over time your archive becomes a reference for repeatable results.',
    };
  }

  if (topic === 'first-session') {
    return {
      topic,
      eyebrow: 'First session',
      summary: withAmoraUsername("That's your first recorded session", username),
      detail:
        "I'm starting to map how your body builds, holds, and recovers. Right now I'm just observing, no assumptions yet. As more sessions come in, I'll start connecting patterns and show you what stays consistent, what improves, and what may be holding you back.",
    };
  }

  if (topic === 'session-static') {
    return {
      topic,
      eyebrow: 'Static session',
      summary: withAmoraUsername('This was a steady session', username),
      detail:
        'Your build was controlled, and once you reached peak you held it without much drop off. That usually points to steadier response through the hold.',
      secondary: "What matters now is consistency. I'm watching how often you can repeat this level without much variation.",
    };
  }

  if (topic === 'session-motion') {
    return {
      topic,
      eyebrow: 'Motion session',
      summary: withAmoraUsername('This was an active session', username),
      detail:
        "Your movement, rhythm, and stability all factored into how performance held up. I'm tracking how well your body maintains strength under motion, not just at peak but throughout the session.",
      secondary: 'Over time this becomes one of the clearest indicators of real performance.',
    };
  }

  if (topic === 'strong-session') {
    return {
      topic,
      eyebrow: 'Reference session',
      summary: withAmoraUsername("That's one of your stronger sessions", username),
      detail:
        'You built quickly, held with stability, and settled cleanly. When all three line up like this, your system is responding in a strong and efficient way.',
      secondary: "I'll keep this as a reference point and compare future sessions against it.",
    };
  }

  if (topic === 'soft-session') {
    return {
      topic,
      eyebrow: 'Session check',
      summary: withAmoraUsername('This session was a bit less stable than your baseline', username),
      detail:
        'Your build and hold did not fully align this time. That can happen because of recovery, stress, timing, or normal variation in your system.',
      secondary: "I'll keep tracking to see whether this is a one off or part of a pattern.",
    };
  }

  if (topic === 'pattern-detected') {
    return {
      topic,
      eyebrow: 'Pattern',
      summary: withAmoraUsername("I'm starting to see a pattern", username),
      detail:
        'Your strongest sessions tend to happen when the build is gradual and controlled. When the response spikes too quickly, stability tends to drop sooner.',
      secondary: "That's something I can keep tracking and refine over time.",
    };
  }

  if (topic === 'improvement-detected') {
    return {
      topic,
      eyebrow: 'Progress',
      summary: withAmoraUsername("You're improving", username),
      detail:
        'Your recent sessions are showing steadier stability and faster recovery. That usually means your system is adapting and responding more efficiently.',
      secondary: "I'll keep watching to see whether this trend holds.",
    };
  }

  if (topic === 'personal-best') {
    return {
      topic,
      eyebrow: 'Personal best',
      summary: withAmoraUsername('You just set a new personal best', username),
      detail:
        "This is your strongest recorded performance so far. I'll use it as your new benchmark, so future sessions can be compared against what your system does at its best.",
    };
  }

  if (topic === 'nocturnal-insight') {
    return {
      topic,
      eyebrow: 'Nocturnal',
      summary: withAmoraUsername('These are your nocturnal patterns', username),
      detail:
        'They happen without conscious input, which makes them one of the clearest ways to understand baseline function. I compare them with your daytime sessions to see how the whole pattern lines up.',
    };
  }

  if (topic === 'recovery-insight') {
    return {
      topic,
      eyebrow: 'Recovery',
      summary: withAmoraUsername('Your recovery time is improving', username),
      detail:
        "You're returning to baseline more efficiently after sessions. That usually points to stronger responsiveness and better overall balance in the pattern.",
      secondary: "I'm tracking how consistently that continues.",
    };
  }

  if (topic === 'settings') {
    return {
      topic,
      eyebrow: 'Settings',
      summary: withAmoraUsername("You're always in control here", username),
      detail:
        'You can adjust how often I appear, or turn me off completely at any time. I am here when you want clarity, nothing more.',
    };
  }

  switch (topic) {
    case 'calibration-locked':
      return {
        topic,
        eyebrow: 'Calibration',
        summary: 'Learning your baseline. Your score will unlock once calibration is complete.',
        detail:
          'During calibration, the system is learning your natural response patterns. This allows your EDGE Score to reflect your actual capability, not a generic average. Once calibration reaches 100%, your score will activate automatically.',
      };
    case 'edge-score':
      return {
        topic,
        eyebrow: 'EDGE Score',
        summary:
          'EDGE Score reflects your current performance capability. It is influenced by how stable, controlled, and consistent your response is over time.',
        detail:
          'Rather than measuring a single moment, EDGE looks at patterns. It weighs how well you build, how long you hold, and how stable your performance remains.',
        secondary:
          options?.insightLine === 'Stronger hold. Faster rise.'
            ? 'Your recent sessions show improved stability and faster response. This typically leads to more consistent performance over time.'
            : undefined,
      };
    case 'edge-shift':
      return {
        topic,
        eyebrow: 'Score change',
        summary:
          options?.direction === 'down'
            ? 'Recent response quality is softer than yesterday, so EDGE is easing slightly.'
            : options?.direction === 'up'
              ? 'Recent response quality is stronger than yesterday, so EDGE is moving higher.'
              : 'Recent response quality is holding close to yesterday, so EDGE is staying settled.',
        detail:
          'EDGE responds to recent build quality, hold stability, recovery behavior, and repeatability. It moves gradually so short-term changes do not overpower your longer pattern.',
      };
    case 'trend-view':
      return {
        topic,
        eyebrow: 'Trend View',
        summary:
          'Trends show how your performance changes over time. This helps you understand what is improving, what is consistent, and what affects your best sessions.',
        detail:
          'You may notice patterns such as stronger performance on certain days or after specific conditions. These patterns become more accurate as more data is collected.',
      };
    case 'event-archive':
      return {
        topic,
        eyebrow: 'Archive',
        summary:
          'Each session is automatically captured when meaningful activity is detected. You can label sessions to remember what worked best.',
        detail: 'Over time, your archive becomes a reference for repeatable results.',
      };
    case 'first-session':
      return {
        topic,
        eyebrow: 'First session',
        summary:
          'Your first captured session is now part of your archive. This begins the comparison layer that makes future insight more personal.',
        detail: 'Over time, your archive becomes a reference for repeatable results.',
      };
    default:
      return {
        topic,
        eyebrow: 'Amora',
        summary: 'I help explain scores, patterns, and changes in clear, simple language.',
        detail: 'Use Amora when you want a quieter explanation of what changed and why it matters.',
      };
  }
}

export function ArcAmoraAccessButton({
  onClick,
  quiet = false,
  anchorId,
  introReveal = false,
}: {
  onClick: () => void;
  quiet?: boolean;
  anchorId?: string;
  introReveal?: boolean;
}) {
  const containerSize = quiet ? '2.93rem' : '3.12rem';
  const crescentTone = quiet ? '#4B6790' : '#5A7EAE';
  const coreTone = quiet ? '#C7DDF7' : '#D8EAFF';
  const haloTone = quiet ? '#6D8FB8' : '#7FA4CF';
  const containerTint = quiet ? '#2F4764' : '#3B5C80';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open Amora"
      data-amora-anchor={anchorId}
      className="group relative flex items-center justify-center rounded-full border transition-all duration-300 active:scale-[0.985]"
      style={{
        ...getArcGlassPillStyle(foundationTheme, quiet ? 'light' : 'medium', {
          tint: containerTint,
          tintStrength: quiet ? 0.026 : 0.036,
        }),
        borderColor: introReveal
          ? hexToRgba('#C6DCF7', quiet ? 0.22 : 0.28)
          : hexToRgba('#84A6D1', quiet ? 0.12 : 0.16),
        height: containerSize,
        width: containerSize,
        color: quiet ? foundationTheme.text.secondary : foundationTheme.text.primary,
        boxShadow: introReveal
          ? `0 0 0 1px ${hexToRgba('#D7E9FF', 0.06)}`
          : `0 0 0 1px ${hexToRgba('#5C81AE', 0.03)}`,
        animation: introReveal ? 'amora-icon-intro-pulse 760ms cubic-bezier(0.22, 1, 0.36, 1) 1' : 'none',
      }}
    >
      <style>
        {`
          @keyframes amora-icon-intro-pulse {
            0% { opacity: 0.22; transform: scale(0.88); }
            55% { opacity: 1; transform: scale(1.02); }
            100% { opacity: 1; transform: scale(1); }
          }

          @keyframes amora-core-breathe {
            0%, 100% { opacity: 0.82; transform: scale(0.985); }
            50% { opacity: 1; transform: scale(1.035); }
          }
        `}
      </style>
      {introReveal ? (
        <div
          className="pointer-events-none absolute inset-[8%] rounded-full"
          style={{
            border: `1px solid ${hexToRgba('#A5C6EB', 0.22)}`,
            animation: 'amora-icon-intro-pulse 960ms cubic-bezier(0.22, 1, 0.36, 1) 1',
          }}
        />
      ) : null}
      <div
        className="pointer-events-none absolute inset-[20%] rounded-full blur-md transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100"
        style={{
          background: `radial-gradient(circle, ${hexToRgba(haloTone, 0.12)} 0%, ${hexToRgba(haloTone, 0.04)} 50%, transparent 76%)`,
          opacity: introReveal ? 0.95 : 0.22,
          animation: 'amora-core-breathe 3.4s ease-in-out infinite',
        }}
      />
      <div
        className="pointer-events-none absolute inset-[16%] rounded-full"
        style={{
          border: `1px solid ${hexToRgba('#8FB1DA', introReveal ? 0.16 : 0.09)}`,
          opacity: 0.74,
        }}
      />
      <svg
        className="relative z-10 h-[31px] w-[31px]"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M16.55 6.6c-1.22-.82-2.76-1.18-4.4-.95-3 .42-5.37 2.99-5.58 6.01-.16 2.28.92 4.42 2.82 5.75"
          stroke={hexToRgba(crescentTone, 0.88)}
          strokeWidth="2.05"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300 group-hover:opacity-100 group-active:opacity-100"
          style={{ opacity: 0.9 }}
        />
        <path
          d="M16.78 6.82c.82.54 1.48 1.3 1.92 2.18"
          stroke={hexToRgba(crescentTone, 0.52)}
          strokeWidth="1.08"
          strokeLinecap="round"
        />
        <circle
          cx="12.1"
          cy="12"
          r="3.2"
          fill={hexToRgba(coreTone, 0.06)}
        />
        <circle
          cx="12.1"
          cy="12"
          r="2.02"
          fill={hexToRgba(coreTone, 0.96)}
          style={{ animation: 'amora-core-breathe 3.4s ease-in-out infinite' }}
        />
        <circle
          cx="17.8"
          cy="9.2"
          r="0.62"
          fill={hexToRgba(crescentTone, 0.88)}
          className="transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100"
          style={{ opacity: 0.8 }}
        />
      </svg>
      <span className="sr-only">Amora</span>
    </button>
  );
}

export function ArcAmoraIconIntro({
  visible,
  anchorRect,
  onDismiss,
  onLearnMore,
}: {
  visible: boolean;
  anchorRect: ArcAmoraTourAnchorRect | null;
  onDismiss: () => void;
  onLearnMore?: () => void;
}) {
  const containerWidth = anchorRect?.containerWidth ?? 360;
  const bubbleWidth = Math.min(238, Math.max(212, containerWidth - 34));
  const anchorCenterX = anchorRect ? anchorRect.left + anchorRect.width / 2 : containerWidth - 32;
  const bubbleLeft = anchorRect
    ? clamp(anchorRect.left + anchorRect.width - bubbleWidth + 14, 16, Math.max(16, containerWidth - bubbleWidth - 16))
    : Math.max(16, containerWidth - bubbleWidth - 18);
  const bubbleTop = anchorRect ? anchorRect.top + anchorRect.height + 14 : 86;
  const pointerLeft = clamp(anchorCenterX - bubbleLeft, 26, bubbleWidth - 26);

  return (
    <>
      <div
        className="absolute inset-0 z-[54] transition-opacity duration-300"
        style={{
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          background: `linear-gradient(180deg, ${hexToRgba('#000000', 0.02)} 0%, ${hexToRgba('#000000', 0.08)} 100%)`,
        }}
        onClick={onDismiss}
      />

      <div
        className="absolute z-[55] transition-all duration-300"
        style={{
          opacity: visible ? 1 : 0,
          left: `${bubbleLeft}px`,
          top: `${bubbleTop}px`,
          width: `${bubbleWidth}px`,
          transform: visible ? 'translateY(0px)' : 'translateY(8px)',
          pointerEvents: visible ? 'auto' : 'none',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        onClick={event => event.stopPropagation()}
      >
        <div
          className="relative rounded-[24px] border px-4 pb-4 pt-3.5"
          style={{
            ...getArcGlassSurfaceStyle(foundationTheme, 'hero', { tint: foundationTheme.accent.primary, tintStrength: 0.024 }),
            borderColor: hexToRgba('#FFFFFF', 0.075),
            background: `linear-gradient(180deg, ${hexToRgba(foundationTheme.text.inverse, 0.58)} 0%, ${hexToRgba(foundationTheme.text.inverse, 0.74)} 100%)`,
            boxShadow: `0 18px 42px ${hexToRgba('#000000', 0.22)}`,
          }}
        >
          <div
            className="absolute h-3 w-3 rotate-45 border"
            style={{
              left: `${pointerLeft - 6}px`,
              top: '-6px',
              borderColor: hexToRgba('#FFFFFF', 0.06),
              background: hexToRgba(foundationTheme.text.inverse, 0.72),
              borderLeftColor: 'transparent',
              borderBottomColor: hexToRgba('#FFFFFF', 0.06),
              borderTopColor: hexToRgba('#FFFFFF', 0.06),
              borderRightColor: hexToRgba('#FFFFFF', 0.06),
            }}
          />

          <div style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary }}>
            Meet Amora
          </div>
          <div
            className="mt-2"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'body'),
              color: foundationTheme.text.secondary,
              fontSize: '0.72rem',
              lineHeight: 1.42,
            }}
          >
            Your private guide for understanding scores, trends, and progress.
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            {onLearnMore ? (
              <button
                type="button"
                onClick={onLearnMore}
                className="rounded-full border px-3 py-1.5 transition-all duration-300"
                style={{
                  ...getArcGlassPillStyle(foundationTheme, 'light'),
                  borderColor: hexToRgba('#FFFFFF', 0.065),
                  color: foundationTheme.text.secondary,
                }}
              >
                <span style={{ ...getArcTypographyStyle(foundationTheme, 'pillLabel'), fontSize: '0.54rem' }}>
                  Learn more
                </span>
              </button>
            ) : null}
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-full border px-3 py-1.5 transition-all duration-300"
              style={{
                ...getArcGlassPillStyle(foundationTheme, 'medium', { tint: foundationTheme.accent.primary, tintStrength: 0.03 }),
                borderColor: hexToRgba('#FFFFFF', 0.075),
                color: foundationTheme.text.primary,
              }}
            >
              <span style={{ ...getArcTypographyStyle(foundationTheme, 'pillLabel'), fontSize: '0.54rem' }}>
                Got it
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export type InlineAmoraInsightVariant = 'insight' | 'pattern' | 'read' | 'note';
export type InlineAmoraInsightDensity = 'compact' | 'regular';

function getInlineAmoraLabel(
  variant: InlineAmoraInsightVariant,
  explicitLabel?: string,
) {
  if (explicitLabel) {
    return explicitLabel;
  }

  switch (variant) {
    case 'pattern':
      return 'AMORA PATTERN';
    case 'read':
      return 'AMORA READ';
    case 'note':
      return 'AMORA NOTE';
    case 'insight':
    default:
      return 'AMORA INSIGHT';
  }
}

export function InlineAmoraInsight({
  label,
  message,
  ctaLabel,
  onTap,
  variant = 'insight',
  density = 'regular',
  className = '',
}: {
  label?: string;
  message: string;
  ctaLabel?: string;
  onTap?: () => void;
  variant?: InlineAmoraInsightVariant;
  density?: InlineAmoraInsightDensity;
  className?: string;
}) {
  const resolvedLabel = getInlineAmoraLabel(variant, label);
  const compact = density === 'compact';
  const interactive = Boolean(onTap);
  const handleActivate = (event: MouseEvent<HTMLDivElement>) => {
    if (!onTap) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    onTap();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onTap) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      onTap();
    }
  };
  const content = (
    <div
      className={`min-w-0 ${className}`}
      style={{
        borderRadius: compact ? 16 : 18,
        padding: compact ? '0.62rem 0.78rem 0.68rem' : '0.78rem 0.92rem 0.82rem',
        background: hexToRgba('#FFFFFF', compact ? 0.018 : 0.024),
        border: `1px solid ${hexToRgba('#FFFFFF', compact ? 0.038 : 0.045)}`,
        boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.018)}`,
      }}
    >
      <div
        style={{
          ...getArcTypographyStyle(foundationTheme, 'label'),
          color: hexToRgba(foundationTheme.text.secondary, 0.56),
          fontSize: compact ? '0.44rem' : '0.47rem',
          letterSpacing: '0.14em',
        }}
      >
        {resolvedLabel}
      </div>
      <div
        className="mt-1.5"
        style={{
          ...getArcTypographyStyle(foundationTheme, 'caption'),
          color: hexToRgba(foundationTheme.text.primary, compact ? 0.84 : 0.88),
          fontSize: compact ? '0.59rem' : '0.63rem',
          lineHeight: 1.42,
        }}
      >
        {message}
      </div>
      {interactive && ctaLabel ? (
        <div
          className="mt-2 flex items-center gap-1"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
            color: hexToRgba(foundationTheme.text.highlight, 0.68),
            fontSize: compact ? '0.48rem' : '0.5rem',
            letterSpacing: '0.045em',
          }}
        >
          <span>{ctaLabel}</span>
          <span style={{ opacity: 0.58 }}>›</span>
        </div>
      ) : null}
    </div>
  );

  if (!interactive) {
    return content;
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      className="w-full cursor-pointer text-left transition-all duration-300 hover:opacity-100 active:scale-[0.99]"
      style={{ opacity: 0.98 }}
    >
      {content}
    </div>
  );
}

export function ArcAmoraInlineHint({
  summary,
  onClick,
  subtle = false,
}: {
  summary: string;
  onClick?: () => void;
  subtle?: boolean;
}) {
  return (
    <InlineAmoraInsight
      variant="note"
      density={subtle ? 'compact' : 'regular'}
      message={summary}
      ctaLabel={onClick ? 'View interpretation' : undefined}
      onTap={onClick}
    />
  );
}

function AmoraGuidanceNoteCard({
  note,
  className = 'mt-3',
}: {
  note: ArcAmoraGuidanceNote;
  className?: string;
}) {
  return (
    <div
      className={`${className} rounded-[16px] border px-3 py-3`}
      style={{
        background: hexToRgba('#FFFFFF', 0.04),
        borderColor: hexToRgba('#FFFFFF', 0.06),
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          ...getArcTypographyStyle(foundationTheme, 'label'),
          color: hexToRgba(foundationTheme.text.primary, 0.66),
          fontSize: '0.48rem',
          letterSpacing: '0.08em',
        }}
      >
        {note.label}
      </div>
      <div
        className="mt-2 whitespace-pre-line"
        style={{
          ...getArcTypographyStyle(foundationTheme, 'caption'),
          color: hexToRgba(foundationTheme.text.primary, 0.92),
          fontSize: '0.66rem',
          lineHeight: 1.45,
        }}
      >
        {note.body}
      </div>
    </div>
  );
}

function getAmoraPrimaryActionLabel(topic: ArcAmoraTopicId) {
  switch (topic) {
    case 'edge-score':
    case 'edge-shift':
    case 'calibration-locked':
      return 'Compare to baseline';
    case 'trend-view':
    case 'pattern-detected':
    case 'improvement-detected':
      return 'See pattern';
    case 'session-static':
    case 'session-motion':
    case 'strong-session':
    case 'soft-session':
    case 'first-session':
    case 'personal-best':
    case 'recovery-insight':
    case 'nocturnal-insight':
      return 'Show recent change';
    default:
      return 'View interpretation';
  }
}

export function AmoraInterpretationSheet({
  open,
  label,
  title,
  body,
  guidanceNote,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
}: {
  open: boolean;
  label?: string;
  title: string;
  body: Array<string | undefined>;
  guidanceNote?: ArcAmoraGuidanceNote | null;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}) {
  const paragraphs = body.filter((item): item is string => Boolean(item?.trim()));
  const normalizedLabel = label?.trim().toLowerCase();
  const normalizedTitle = title.trim().toLowerCase();
  const showTitle = Boolean(title.trim()) && normalizedTitle !== normalizedLabel;

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-40 transition-opacity duration-300"
        style={{
          opacity: open ? 1 : 0,
          background: `linear-gradient(180deg, ${hexToRgba('#000000', 0.01)} 0%, ${hexToRgba('#000000', 0.04)} 54%, ${hexToRgba('#000000', 0.12)} 100%)`,
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 z-50 px-3 pb-3 transition-all duration-300"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(20px)',
          pointerEvents: open ? 'auto' : 'none',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div
          className="overflow-hidden rounded-[26px] border"
          style={{
            ...getArcGlassSurfaceStyle(foundationTheme, 'hero', { tint: foundationTheme.accent.primary, tintStrength: 0.016 }),
            borderColor: hexToRgba('#FFFFFF', 0.058),
            background: `linear-gradient(180deg, ${hexToRgba(foundationTheme.text.inverse, 0.42)} 0%, ${hexToRgba(foundationTheme.text.inverse, 0.6)} 100%)`,
            boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.022)}`,
          }}
        >
          <div className="flex justify-center pb-1 pt-2.5">
            <div className="h-1 w-10 rounded-full" style={{ background: hexToRgba('#FFFFFF', 0.12) }} />
          </div>
          <div className="px-4 pb-4 pt-3">
            {label ? (
              <div
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'label'),
                  color: hexToRgba(foundationTheme.text.secondary, 0.56),
                  fontSize: '0.46rem',
                  letterSpacing: '0.14em',
                }}
              >
                {label}
              </div>
            ) : null}
            {showTitle ? (
              <div
                className={label ? 'mt-2' : undefined}
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
                  color: foundationTheme.text.primary,
                  fontSize: '0.84rem',
                }}
              >
                {title}
              </div>
            ) : null}
            <div className={`${label || showTitle ? 'mt-3' : ''} space-y-2.5`}>
              {paragraphs.map((paragraph, index) => (
                <div
                  key={`${title}-${index}`}
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'caption'),
                    color: index === 0 ? hexToRgba(foundationTheme.text.primary, 0.92) : foundationTheme.text.secondary,
                    fontSize: '0.66rem',
                    lineHeight: 1.5,
                  }}
                >
                  {paragraph}
                </div>
              ))}
            </div>

            {guidanceNote ? <AmoraGuidanceNoteCard note={guidanceNote} /> : null}

            {(primaryActionLabel && onPrimaryAction) || (secondaryActionLabel && onSecondaryAction) ? (
              <div className="mt-4 flex items-center gap-2">
                {primaryActionLabel && onPrimaryAction ? (
                  <button
                    type="button"
                    onClick={onPrimaryAction}
                    className="rounded-full px-0 py-1 transition-opacity duration-300 hover:opacity-100"
                    style={{
                      ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                      color: hexToRgba(foundationTheme.text.highlight, 0.82),
                      fontSize: '0.56rem',
                      letterSpacing: '0.035em',
                    }}
                  >
                    {primaryActionLabel}
                  </button>
                ) : null}
                {secondaryActionLabel && onSecondaryAction ? (
                  <button
                    type="button"
                    onClick={onSecondaryAction}
                    className="rounded-full px-0 py-1 transition-opacity duration-300 hover:opacity-100"
                    style={{
                      ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                      color: hexToRgba(foundationTheme.text.secondary, 0.74),
                      fontSize: '0.56rem',
                      letterSpacing: '0.035em',
                    }}
                  >
                    {secondaryActionLabel}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export function AmoraMilestoneOverlay({
  visible,
  label,
  title,
  body,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  supplementalContent,
}: {
  visible: boolean;
  label: string;
  title: string;
  body: Array<string | ReactNode>;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  supplementalContent?: ReactNode;
}) {
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center px-5 transition-opacity duration-300"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        background: hexToRgba('#000000', 0.16),
        backdropFilter: visible ? 'blur(14px) saturate(106%)' : 'blur(0px)',
        WebkitBackdropFilter: visible ? 'blur(14px) saturate(106%)' : 'blur(0px)',
      }}
    >
      <div
        className="w-full max-w-[308px] rounded-[30px] border p-5"
        style={{
          ...getArcGlassSurfaceStyle(foundationTheme, 'hero', { tint: foundationTheme.accent.primary, tintStrength: 0.024 }),
          borderColor: hexToRgba('#FFFFFF', 0.07),
          transform: visible ? 'translateY(0px) scale(1)' : 'translateY(10px) scale(0.988)',
          transition: 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms cubic-bezier(0.22, 1, 0.36, 1)',
          boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.026)}`,
        }}
      >
        <div
          style={{
            ...getArcTypographyStyle(foundationTheme, 'label'),
            color: hexToRgba(foundationTheme.text.secondary, 0.62),
            fontSize: '0.48rem',
            letterSpacing: '0.12em',
          }}
        >
          {label}
        </div>
        <div
          className="mt-2"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
            color: foundationTheme.text.primary,
            fontSize: '0.98rem',
          }}
        >
          {title}
        </div>
        <div className="mt-3 space-y-2.5">
          {body.map((paragraph, index) => (
            <div
              key={`milestone-${index}`}
              style={{
                ...getArcTypographyStyle(foundationTheme, 'caption'),
                color: index === 0 ? hexToRgba(foundationTheme.text.primary, 0.9) : foundationTheme.text.secondary,
                fontSize: '0.7rem',
                lineHeight: 1.48,
              }}
            >
              {paragraph}
            </div>
          ))}
        </div>

        {supplementalContent}

        <div className="mt-4 flex items-center justify-end gap-3">
          {secondaryActionLabel && onSecondaryAction ? (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="rounded-full px-0 py-1 transition-opacity duration-300 hover:opacity-100"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                color: hexToRgba(foundationTheme.text.secondary, 0.76),
                fontSize: '0.58rem',
                letterSpacing: '0.035em',
              }}
            >
              {secondaryActionLabel}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onPrimaryAction}
            className="rounded-full px-0 py-1 transition-opacity duration-300 hover:opacity-100"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
              color: hexToRgba(foundationTheme.text.highlight, 0.84),
              fontSize: '0.58rem',
              letterSpacing: '0.035em',
            }}
          >
            {primaryActionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ArcAmoraSheet({
  open,
  content,
  guidanceNote,
  onClose,
  expanded,
  onToggleExpanded,
}: {
  open: boolean;
  content: ArcAmoraContent;
  guidanceNote?: ArcAmoraGuidanceNote | null;
  onClose: () => void;
  expanded: boolean;
  onToggleExpanded: () => void;
}) {
  const [displayedContent, setDisplayedContent] = useState(content);
  const [contentVisible, setContentVisible] = useState(open);

  useEffect(() => {
    if (!open) {
      setContentVisible(false);
      return;
    }

    if (content.topic === displayedContent.topic) {
      setContentVisible(true);
      return;
    }

    setContentVisible(false);
    const swapTimer = window.setTimeout(() => {
      setDisplayedContent(content);
      setContentVisible(true);
    }, 110);

    return () => window.clearTimeout(swapTimer);
  }, [content, displayedContent.topic, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setDisplayedContent(content);
    setContentVisible(true);
  }, [content, open]);

  const body = useMemo(() => {
    const paragraphs = [
      displayedContent.summary,
      displayedContent.detail,
      expanded ? displayedContent.secondary : undefined,
    ];
    return paragraphs;
  }, [displayedContent.detail, displayedContent.secondary, displayedContent.summary, expanded]);

  const showSupplementalAction = Boolean(displayedContent.secondary);

  return (
    <div
      style={{
        opacity: contentVisible ? 1 : 0,
        transform: contentVisible ? 'translateY(0px)' : 'translateY(5px)',
        transition: 'opacity 240ms cubic-bezier(0.22, 1, 0.36, 1), transform 240ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <AmoraInterpretationSheet
        open={open}
        label="AMORA INTERPRETATION"
        title={displayedContent.eyebrow ?? 'Overview'}
        body={body}
        guidanceNote={guidanceNote}
        primaryActionLabel={showSupplementalAction ? (expanded ? 'Show less' : getAmoraPrimaryActionLabel(displayedContent.topic)) : undefined}
        onPrimaryAction={showSupplementalAction ? onToggleExpanded : undefined}
        secondaryActionLabel="Close"
        onSecondaryAction={onClose}
      />
    </div>
  );
}

export function ArcAmoraIntroCard({
  visible,
  username,
  guidanceNote,
  onContinue,
  onSkip,
}: {
  visible: boolean;
  username?: string;
  guidanceNote?: ArcAmoraGuidanceNote | null;
  onContinue: () => void;
  onSkip: () => void;
}) {
  const introBody: Array<string | ReactNode> = [
    username ? `${username}, Amora is now part of your system.` : 'Amora is now part of your system.',
    'She tracks what is changing, explains what matters, and stays tied to your actual signal instead of guesswork.',
    'The interface stays yours. Private, controlled, and quiet until you want interpretation.',
  ];

  return (
    <AmoraMilestoneOverlay
      visible={visible}
      label="AMORA"
      title="Meet Amora"
      body={introBody}
      primaryActionLabel="Continue"
      onPrimaryAction={onContinue}
      secondaryActionLabel="Skip"
      onSecondaryAction={onSkip}
      supplementalContent={
        <>
          <div className="mt-3" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted }}>
            {'You can adjust how often Amora appears, or turn her off anytime in Settings.'}
          </div>
          {guidanceNote ? <AmoraGuidanceNoteCard note={guidanceNote} className="mt-4" /> : null}
        </>
      }
    />
  );
}

export function ArcAmoraTourOverlay({
  visible,
  step,
  stepIndex,
  totalSteps,
  anchorRect,
  onNext,
  onBack,
  onClose,
}: {
  visible: boolean;
  step: ArcAmoraTourStep;
  stepIndex: number;
  totalSteps: number;
  anchorRect: ArcAmoraTourAnchorRect | null;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
}) {
  const containerWidth = anchorRect?.containerWidth ?? 360;
  const containerHeight = anchorRect?.containerHeight ?? 820;
  const bubbleWidth = Math.min(232, Math.max(208, containerWidth - 32));
  const anchorCenterX = anchorRect ? anchorRect.left + anchorRect.width / 2 : containerWidth / 2;
  const placeAbove = anchorRect ? anchorRect.top > containerHeight * 0.46 : false;
  const bubbleLeft = clamp(anchorCenterX - bubbleWidth / 2, 16, Math.max(16, containerWidth - bubbleWidth - 16));
  const bubbleTop = anchorRect
    ? placeAbove
      ? Math.max(18, anchorRect.top - 150)
      : Math.min(containerHeight - 168, anchorRect.top + anchorRect.height + 16)
    : 88;
  const pointerLeft = clamp(anchorCenterX - bubbleLeft, 24, bubbleWidth - 24);
  const isLastStep = stepIndex === totalSteps - 1;

  return (
    <>
      <div
        className="absolute inset-0 z-[58] transition-opacity duration-300"
        style={{
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          background: `linear-gradient(180deg, ${hexToRgba('#000000', 0.04)} 0%, ${hexToRgba('#000000', 0.16)} 58%, ${hexToRgba('#000000', 0.26)} 100%)`,
        }}
      />

      {anchorRect ? (
        <>
          <div
            className="pointer-events-none absolute z-[59] rounded-[28px] transition-all duration-300"
            style={{
              left: `${anchorRect.left - 8}px`,
              top: `${anchorRect.top - 8}px`,
              width: `${anchorRect.width + 16}px`,
              height: `${anchorRect.height + 16}px`,
              border: `1px solid ${hexToRgba('#F4E7D9', 0.18)}`,
              background: hexToRgba('#FFFFFF', 0.015),
              boxShadow: `0 0 0 1px ${hexToRgba('#FFFFFF', 0.03)}, 0 18px 42px ${hexToRgba('#000000', 0.18)}`,
            }}
          />
          <div
            className="pointer-events-none absolute z-[59] rounded-[30px] blur-2xl transition-all duration-300"
            style={{
              left: `${anchorRect.left - 4}px`,
              top: `${anchorRect.top - 4}px`,
              width: `${anchorRect.width + 8}px`,
              height: `${anchorRect.height + 8}px`,
              background: hexToRgba(foundationTheme.accent.primary, 0.05),
            }}
          />
        </>
      ) : null}

      <div
        className="absolute z-[60] transition-all duration-300"
        style={{
          opacity: visible ? 1 : 0,
          left: `${bubbleLeft}px`,
          top: `${bubbleTop}px`,
          width: `${bubbleWidth}px`,
          transform: visible ? 'translateY(0px)' : 'translateY(10px)',
          pointerEvents: visible ? 'auto' : 'none',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div
          className="relative rounded-[26px] border px-4 pb-4 pt-3.5"
          style={{
            ...getArcGlassSurfaceStyle(foundationTheme, 'hero', { tint: foundationTheme.accent.primary, tintStrength: 0.024 }),
            borderColor: hexToRgba('#FFFFFF', 0.075),
            background: `linear-gradient(180deg, ${hexToRgba(foundationTheme.text.inverse, 0.58)} 0%, ${hexToRgba(foundationTheme.text.inverse, 0.74)} 100%)`,
            boxShadow: `0 18px 44px ${hexToRgba('#000000', 0.22)}`,
          }}
        >
          <div
            className="absolute h-3 w-3 rotate-45 border"
            style={{
              left: `${pointerLeft - 6}px`,
              top: placeAbove ? 'calc(100% - 6px)' : '-6px',
              borderColor: hexToRgba('#FFFFFF', 0.06),
              background: hexToRgba(foundationTheme.text.inverse, 0.72),
              borderLeftColor: placeAbove ? hexToRgba('#FFFFFF', 0.06) : 'transparent',
              borderTopColor: placeAbove ? hexToRgba('#FFFFFF', 0.06) : 'transparent',
              borderRightColor: placeAbove ? 'transparent' : hexToRgba('#FFFFFF', 0.06),
              borderBottomColor: placeAbove ? 'transparent' : hexToRgba('#FFFFFF', 0.06),
            }}
          />

          <div className="flex items-start justify-between gap-3">
            <div>
              <div
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                  color: hexToRgba(foundationTheme.accent.primary, 0.92),
                  fontSize: '0.48rem',
                  letterSpacing: '0.08em',
                }}
              >
                Amora
              </div>
              <div
                className="mt-1"
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'label'),
                  color: foundationTheme.text.muted,
                  fontSize: '0.5rem',
                  letterSpacing: '0.08em',
                }}
              >
                {stepIndex + 1} / {totalSteps}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full border transition-colors"
              style={{
                ...getArcGlassPillStyle(foundationTheme, 'light'),
                borderColor: hexToRgba('#FFFFFF', 0.065),
                color: foundationTheme.text.secondary,
              }}
              aria-label="Close Amora tour"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            className="mt-3"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
              color: foundationTheme.text.primary,
              fontSize: '0.9rem',
            }}
          >
            {step.title}
          </div>
          <div
            className="mt-2"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'body'),
              color: foundationTheme.text.secondary,
              fontSize: '0.72rem',
              lineHeight: 1.4,
            }}
          >
            {step.summary}
          </div>
          {step.detail ? (
            <div
              className="mt-2.5"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'caption'),
                color: foundationTheme.text.muted,
                lineHeight: 1.42,
              }}
            >
              {step.detail}
            </div>
          ) : null}

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBack}
              disabled={stepIndex === 0}
              className="rounded-full border px-3 py-1.5 transition-all duration-300 disabled:cursor-default"
              style={{
                ...getArcGlassPillStyle(foundationTheme, 'light'),
                borderColor: hexToRgba('#FFFFFF', 0.065),
                color: stepIndex === 0 ? foundationTheme.text.muted : foundationTheme.text.secondary,
                opacity: stepIndex === 0 ? 0.5 : 1,
              }}
            >
              <span style={{ ...getArcTypographyStyle(foundationTheme, 'pillLabel'), fontSize: '0.54rem' }}>
                Back
              </span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border px-3 py-1.5 transition-all duration-300"
                style={{
                  ...getArcGlassPillStyle(foundationTheme, 'light'),
                  borderColor: hexToRgba('#FFFFFF', 0.065),
                  color: foundationTheme.text.secondary,
                }}
              >
                <span style={{ ...getArcTypographyStyle(foundationTheme, 'pillLabel'), fontSize: '0.54rem' }}>
                  Skip
                </span>
              </button>
              <button
                type="button"
                onClick={onNext}
                className="rounded-full border px-3 py-1.5 transition-all duration-300"
                style={{
                  ...getArcGlassPillStyle(foundationTheme, 'medium', { tint: foundationTheme.accent.primary, tintStrength: 0.03 }),
                  borderColor: hexToRgba('#FFFFFF', 0.075),
                  color: foundationTheme.text.primary,
                }}
              >
                <span style={{ ...getArcTypographyStyle(foundationTheme, 'pillLabel'), fontSize: '0.54rem' }}>
                  {isLastStep ? 'Done' : 'Next'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
