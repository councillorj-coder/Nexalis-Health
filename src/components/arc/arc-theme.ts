import type { CSSProperties } from 'react';

export type ArcTypographyRoleName =
  | 'displayHero'
  | 'heroValue'
  | 'screenTitle'
  | 'sectionTitle'
  | 'cardTitle'
  | 'label'
  | 'body'
  | 'caption'
  | 'navLabel'
  | 'pillLabel'
  | 'insightTitle'
  | 'insightBody';
export type ArcAtmosphereVariantName = 'home' | 'live' | 'detail' | 'modal';

type ArcFontFamilyKey = 'primary' | 'display' | 'mono';
type ArcFontWeightKey = 'hero' | 'title' | 'body' | 'label';
type ArcLetterSpacingKey = 'hero' | 'title' | 'label';
type ArcTextTransformTokenKey = 'label' | 'section';
type ArcFontStyleTokenKey = 'hero' | 'body';
type ArcAtmosphereFieldPosition = {
  x: string;
  y: string;
  size: string;
};
type ArcAtmosphereVariantSettings = {
  baseOpacity: number;
  secondaryOpacity: number;
  gradientOpacity: number;
  focalScale: number;
  diffusionOpacity: number;
  auraPrimaryOpacity: number;
  auraSecondaryOpacity: number;
  auraHeroOpacity: number;
  auraSubtleOpacity: number;
  overlaySoftOpacity: number;
  overlayDeepOpacity: number;
  overlayVignetteOpacity: number;
  overlayNoiseOpacity: number;
  motionScale: number;
  positions: {
    primary: ArcAtmosphereFieldPosition;
    secondary: ArcAtmosphereFieldPosition;
    hero: ArcAtmosphereFieldPosition;
    subtle: ArcAtmosphereFieldPosition;
  };
};

type ArcTypographyRoleDefinition = {
  family: ArcFontFamilyKey;
  size: CSSProperties['fontSize'];
  lineHeight: CSSProperties['lineHeight'];
  weight: ArcFontWeightKey;
  letterSpacing?: ArcLetterSpacingKey | CSSProperties['letterSpacing'];
  textTransform?: ArcTextTransformTokenKey | CSSProperties['textTransform'];
  fontStyle?: ArcFontStyleTokenKey | CSSProperties['fontStyle'];
};

export type ArcThemeTokens = {
  name: string;
  description: string;
  bg: {
    app: string;
    primary: string;
    secondary: string;
    hero: string;
    overlay: string;
    modal: string;
    tooltip: string;
    nav: string;
  };
  surface: {
    card: string;
    cardSecondary: string;
    elevated: string;
    inset: string;
    pill: string;
    input: string;
    graph: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    inverse: string;
    highlight: string;
  };
  accent: {
    primary: string;
    secondary: string;
    soft: string;
    hero: string;
    glow: string;
  };
  signal: {
    up: string;
    down: string;
    hold: string;
    neutral: string;
    warning: string;
  };
  chart: {
    grid: string;
    baseline: string;
    nocturnal: string;
    waking: string;
    live: string;
    fill: string;
    reference: string;
    peak: string;
  };
  border: {
    soft: string;
    strong: string;
    accent: string;
    inset: string;
  };
  shadow: {
    card: string;
    overlay: string;
  };
  glow: {
    hero: string;
    accent: string;
    live: string;
  };
  atmosphere: {
    base: string;
    baseSecondary: string;
    gradientStart: string;
    gradientEnd: string;
    auraPrimary: string;
    auraSecondary: string;
    auraHero: string;
    auraSubtle: string;
    overlaySoft: string;
    overlayDeep: string;
    overlayVignette: string;
    overlayNoise: string;
    blurSoft: string;
    blurHero: string;
    diffusion: number;
    motionIntensity: number;
    motionSpeed: number;
    motionDrift: number;
    motionBreath: number;
    home: ArcAtmosphereVariantSettings;
    live: ArcAtmosphereVariantSettings;
    detail: ArcAtmosphereVariantSettings;
    modal: ArcAtmosphereVariantSettings;
  };
  typography: {
    fontFamily: {
      primary: string;
      display: string;
      mono: string;
    };
    fontWeight: {
      hero: CSSProperties['fontWeight'];
      title: CSSProperties['fontWeight'];
      body: CSSProperties['fontWeight'];
      label: CSSProperties['fontWeight'];
    };
    letterSpacing: {
      hero: CSSProperties['letterSpacing'];
      title: CSSProperties['letterSpacing'];
      label: CSSProperties['letterSpacing'];
    };
    textTransform: {
      label: CSSProperties['textTransform'];
      section: CSSProperties['textTransform'];
    };
    fontStyle: {
      hero: CSSProperties['fontStyle'];
      body: CSSProperties['fontStyle'];
    };
    roles: Record<ArcTypographyRoleName, ArcTypographyRoleDefinition>;
  };
};

export function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const expanded = normalized.length === 3
    ? normalized.split('').map(char => char + char).join('')
    : normalized;

  const value = Number.parseInt(expanded, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function hexToRgbTuple(hex: string): readonly [number, number, number] {
  const normalized = hex.replace('#', '');
  const expanded = normalized.length === 3
    ? normalized.split('').map(char => char + char).join('')
    : normalized;

  const value = Number.parseInt(expanded, 16);
  return [
    (value >> 16) & 255,
    (value >> 8) & 255,
    value & 255,
  ] as const;
}

function resolveLetterSpacing(
  theme: ArcThemeTokens,
  value?: ArcTypographyRoleDefinition['letterSpacing'],
) {
  if (!value) return undefined;

  if (value === 'hero' || value === 'title' || value === 'label') {
    return theme.typography.letterSpacing[value];
  }

  return value;
}

function resolveTextTransform(
  theme: ArcThemeTokens,
  value?: ArcTypographyRoleDefinition['textTransform'],
) {
  if (!value) return undefined;

  if (value === 'label' || value === 'section') {
    return theme.typography.textTransform[value as ArcTextTransformTokenKey];
  }

  return value;
}

function resolveFontStyle(
  theme: ArcThemeTokens,
  value?: ArcTypographyRoleDefinition['fontStyle'],
) {
  if (!value) return theme.typography.fontStyle.body;

  if (value === 'hero' || value === 'body') {
    return theme.typography.fontStyle[value as ArcFontStyleTokenKey];
  }

  return value;
}

export function getArcTypographyStyle(
  theme: ArcThemeTokens,
  role: ArcTypographyRoleName,
): CSSProperties {
  const definition = theme.typography.roles[role];

  return {
    fontFamily: theme.typography.fontFamily[definition.family],
    fontSize: definition.size,
    lineHeight: definition.lineHeight,
    fontWeight: theme.typography.fontWeight[definition.weight],
    letterSpacing: resolveLetterSpacing(theme, definition.letterSpacing),
    textTransform: resolveTextTransform(theme, definition.textTransform),
    fontStyle: resolveFontStyle(theme, definition.fontStyle),
  };
}

export type ArcGlassLevel = 'hero' | 'medium' | 'light';

export function getArcGlassSurfaceStyle(
  theme: ArcThemeTokens,
  level: ArcGlassLevel,
  options?: {
    tint?: string;
    tintStrength?: number;
  },
): CSSProperties {
  const config =
    level === 'hero'
      ? {
          top: 0.29,
          bottom: 0.39,
          border: 0.082,
          highlight: 0.051,
          innerAccent: 0.03,
          shadowY: 18,
          shadowBlur: 42,
          shadowAlpha: 0.28,
          blur: 18,
          tintStrength: 0.054,
        }
      : level === 'medium'
        ? {
            top: 0.26,
            bottom: 0.37,
            border: 0.072,
            highlight: 0.044,
            innerAccent: 0.025,
            shadowY: 15,
            shadowBlur: 34,
            shadowAlpha: 0.24,
            blur: 15,
            tintStrength: 0.04,
          }
        : {
            top: 0.24,
            bottom: 0.33,
            border: 0.064,
            highlight: 0.038,
            innerAccent: 0.02,
            shadowY: 10,
            shadowBlur: 24,
            shadowAlpha: 0.18,
            blur: 12,
            tintStrength: 0.034,
          };

  const tintStrength = (options?.tintStrength ?? config.tintStrength) * 0.8;
  const tintLayer = options?.tint
    ? `linear-gradient(135deg, ${hexToRgba(options.tint, tintStrength)} 0%, transparent 68%)`
    : 'linear-gradient(135deg, rgba(255,255,255,0.012) 0%, transparent 68%)';

  return {
    background: `linear-gradient(180deg, ${hexToRgba(theme.text.inverse, config.top)} 0%, ${hexToRgba(theme.text.inverse, config.bottom)} 100%), ${tintLayer}`,
    borderColor: hexToRgba('#FFFFFF', config.border),
    boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', config.highlight)}, inset 0 -16px 24px ${hexToRgba(theme.accent.secondary, 0.014)}, inset 0 0 0 1px ${hexToRgba(theme.accent.primary, config.innerAccent)}, 0 ${config.shadowY}px ${config.shadowBlur}px rgba(0, 0, 0, ${config.shadowAlpha})`,
    backdropFilter: `blur(${config.blur}px) saturate(118%)`,
  };
}

export function getArcGlassPillStyle(
  theme: ArcThemeTokens,
  level: 'medium' | 'light' = 'light',
  options?: {
    tint?: string;
    tintStrength?: number;
  },
): CSSProperties {
  const config =
    level === 'medium'
      ? {
          top: 0.23,
          bottom: 0.31,
          border: 0.078,
          highlight: 0.036,
          innerAccent: 0.024,
          shadowAlpha: 0.17,
          blur: 10,
          tintStrength: 0.045,
        }
      : {
          top: 0.21,
          bottom: 0.29,
          border: 0.07,
          highlight: 0.032,
          innerAccent: 0.018,
          shadowAlpha: 0.14,
          blur: 8,
          tintStrength: 0.035,
        };

  const tintStrength = (options?.tintStrength ?? config.tintStrength) * 0.8;
  const tintLayer = options?.tint
    ? `linear-gradient(135deg, ${hexToRgba(options.tint, tintStrength)} 0%, transparent 70%)`
    : 'linear-gradient(135deg, rgba(255,255,255,0.01) 0%, transparent 70%)';

  return {
    background: `linear-gradient(180deg, ${hexToRgba(theme.text.inverse, config.top)} 0%, ${hexToRgba(theme.text.inverse, config.bottom)} 100%), ${tintLayer}`,
    borderColor: hexToRgba('#FFFFFF', config.border),
    boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', config.highlight)}, inset 0 -8px 16px ${hexToRgba(theme.accent.secondary, 0.012)}, inset 0 0 0 1px ${hexToRgba(theme.accent.primary, config.innerAccent)}, 0 8px 18px rgba(0, 0, 0, ${config.shadowAlpha})`,
    backdropFilter: `blur(${config.blur}px) saturate(116%)`,
  };
}

export const foundationTheme: ArcThemeTokens = {
  name: 'Foundation',
  description: 'A clean graphite-black foundation with restrained warmth and minimal atmosphere.',
  bg: {
    app: 'linear-gradient(180deg, #07080A 0%, #0A0C10 48%, #0E1217 100%)',
    primary: 'linear-gradient(180deg, rgba(10,12,15,0.98) 0%, rgba(7,8,10,1) 100%)',
    secondary: 'linear-gradient(180deg, rgba(17,19,23,0.98) 0%, rgba(10,11,14,1) 100%)',
    hero: 'linear-gradient(160deg, rgba(20,23,28,0.96) 0%, rgba(11,13,16,1) 74%)',
    overlay: 'linear-gradient(to bottom, rgba(255,255,255,0.025) 0%, transparent 100%)',
    modal: 'linear-gradient(135deg, rgba(16,18,22,0.82) 0%, rgba(10,11,14,0.86) 100%)',
    tooltip: 'linear-gradient(135deg, rgba(17,20,24,0.8) 0%, rgba(11,12,15,0.84) 100%)',
    nav: 'linear-gradient(to top, rgba(8,10,12,1) 76%, rgba(8,10,12,0.97) 88%, rgba(8,10,12,0.9) 100%)',
  },
  surface: {
    card: 'linear-gradient(180deg, rgba(19,22,27,0.66) 0%, rgba(12,14,18,0.74) 100%)',
    cardSecondary: 'rgba(15,17,21,0.6)',
    elevated: 'linear-gradient(180deg, rgba(17,19,24,0.68) 0%, rgba(10,12,15,0.76) 100%)',
    inset: 'rgba(15,17,21,0.42)',
    pill: 'rgba(15,17,21,0.45)',
    input: 'rgba(15,17,21,0.48)',
    graph: 'rgba(15,17,21,0.24)',
  },
  text: {
    primary: '#EDF1F7',
    secondary: '#C1CAD6',
    tertiary: '#AEB8C4',
    muted: '#798594',
    inverse: '#07080A',
    highlight: '#F8FBFF',
  },
  accent: {
    primary: '#98A5B5',
    secondary: '#C9D2DE',
    soft: 'rgba(152,165,181,0.12)',
    hero: '#AAB7C7',
    glow: 'rgba(152,165,181,0.2)',
  },
  signal: {
    up: '#6FB790',
    down: '#C47C86',
    hold: '#98A5B5',
    neutral: '#8E99A8',
    warning: '#C1A16F',
  },
  chart: {
    grid: 'rgba(255,255,255,0.05)',
    baseline: '#98A5B5',
    nocturnal: '#607898',
    waking: '#7EA493',
    live: '#98A5B5',
    fill: 'rgba(152,165,181,0.1)',
    reference: '#C9D2DE',
    peak: '#C1A16F',
  },
  border: {
    soft: 'rgba(255,255,255,0.075)',
    strong: 'rgba(255,255,255,0.11)',
    accent: 'rgba(152,165,181,0.2)',
    inset: 'rgba(255,255,255,0.06)',
  },
  shadow: {
    card: '0 10px 24px rgba(0,0,0,0.24)',
    overlay: '0 20px 48px rgba(0,0,0,0.56)',
  },
  glow: {
    hero: 'radial-gradient(circle, rgba(152,165,181,0.06) 0%, transparent 62%)',
    accent: 'radial-gradient(circle, rgba(152,165,181,0.05) 0%, transparent 64%)',
    live: 'rgba(152,165,181,0.04)',
  },
  atmosphere: {
    base: 'linear-gradient(180deg, #07080A 0%, #0A0C10 48%, #0E1217 100%)',
    baseSecondary: 'none',
    gradientStart: '#07080A',
    gradientEnd: '#0E1217',
    auraPrimary: 'radial-gradient(circle, rgba(152,165,181,0.04) 0%, transparent 72%)',
    auraSecondary: 'radial-gradient(circle, rgba(96,120,152,0.035) 0%, transparent 74%)',
    auraHero: 'radial-gradient(circle, rgba(201,210,222,0.035) 0%, transparent 76%)',
    auraSubtle: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 72%)',
    overlaySoft: 'linear-gradient(180deg, rgba(255,255,255,0.015) 0%, rgba(255,255,255,0) 42%)',
    overlayDeep: 'linear-gradient(180deg, rgba(4,5,7,0) 0%, rgba(4,5,7,0.22) 100%)',
    overlayVignette: 'radial-gradient(circle at 50% 38%, rgba(0,0,0,0) 34%, rgba(0,0,0,0.28) 100%)',
    overlayNoise: 'none',
    blurSoft: '48px',
    blurHero: '88px',
    diffusion: 0.12,
    motionIntensity: 0.02,
    motionSpeed: 42,
    motionDrift: 2,
    motionBreath: 0.004,
    home: {
      baseOpacity: 1,
      secondaryOpacity: 0.14,
      gradientOpacity: 0.22,
      focalScale: 1,
      diffusionOpacity: 0.05,
      auraPrimaryOpacity: 0.04,
      auraSecondaryOpacity: 0.03,
      auraHeroOpacity: 0.03,
      auraSubtleOpacity: 0.02,
      overlaySoftOpacity: 0.08,
      overlayDeepOpacity: 0.08,
      overlayVignetteOpacity: 0.12,
      overlayNoiseOpacity: 0,
      motionScale: 0.14,
      positions: {
        primary: { x: '64%', y: '18%', size: '62%' },
        secondary: { x: '16%', y: '70%', size: '54%' },
        hero: { x: '52%', y: '30%', size: '76%' },
        subtle: { x: '74%', y: '82%', size: '40%' },
      },
    },
    live: {
      baseOpacity: 1,
      secondaryOpacity: 0.12,
      gradientOpacity: 0.18,
      focalScale: 1,
      diffusionOpacity: 0.04,
      auraPrimaryOpacity: 0.03,
      auraSecondaryOpacity: 0.03,
      auraHeroOpacity: 0.03,
      auraSubtleOpacity: 0.02,
      overlaySoftOpacity: 0.07,
      overlayDeepOpacity: 0.06,
      overlayVignetteOpacity: 0.1,
      overlayNoiseOpacity: 0,
      motionScale: 0.1,
      positions: {
        primary: { x: '70%', y: '34%', size: '54%' },
        secondary: { x: '22%', y: '74%', size: '48%' },
        hero: { x: '52%', y: '42%', size: '72%' },
        subtle: { x: '82%', y: '16%', size: '34%' },
      },
    },
    detail: {
      baseOpacity: 1,
      secondaryOpacity: 0.08,
      gradientOpacity: 0.14,
      focalScale: 1,
      diffusionOpacity: 0.03,
      auraPrimaryOpacity: 0.02,
      auraSecondaryOpacity: 0.02,
      auraHeroOpacity: 0.02,
      auraSubtleOpacity: 0.015,
      overlaySoftOpacity: 0.05,
      overlayDeepOpacity: 0.05,
      overlayVignetteOpacity: 0.08,
      overlayNoiseOpacity: 0,
      motionScale: 0.06,
      positions: {
        primary: { x: '62%', y: '16%', size: '56%' },
        secondary: { x: '18%', y: '76%', size: '44%' },
        hero: { x: '50%', y: '26%', size: '66%' },
        subtle: { x: '76%', y: '68%', size: '30%' },
      },
    },
    modal: {
      baseOpacity: 1,
      secondaryOpacity: 0.06,
      gradientOpacity: 0.1,
      focalScale: 1,
      diffusionOpacity: 0.02,
      auraPrimaryOpacity: 0.015,
      auraSecondaryOpacity: 0.015,
      auraHeroOpacity: 0.015,
      auraSubtleOpacity: 0.01,
      overlaySoftOpacity: 0.04,
      overlayDeepOpacity: 0.04,
      overlayVignetteOpacity: 0.06,
      overlayNoiseOpacity: 0,
      motionScale: 0.04,
      positions: {
        primary: { x: '68%', y: '16%', size: '54%' },
        secondary: { x: '14%', y: '78%', size: '40%' },
        hero: { x: '52%', y: '30%', size: '62%' },
        subtle: { x: '82%', y: '74%', size: '26%' },
      },
    },
  },
  typography: {
    fontFamily: {
      primary: '"SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      display: '"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      mono: '"SF Mono", "JetBrains Mono", "IBM Plex Mono", Menlo, monospace',
    },
    fontWeight: {
      hero: 780,
      title: 650,
      body: 500,
      label: 700,
    },
    letterSpacing: {
      hero: '-0.06em',
      title: '-0.02em',
      label: '0.18em',
    },
    textTransform: {
      label: 'uppercase',
      section: 'uppercase',
    },
    fontStyle: {
      hero: 'normal',
      body: 'normal',
    },
    roles: {
      displayHero: {
        family: 'display',
        size: '3.75rem',
        lineHeight: 0.92,
        weight: 'hero',
        letterSpacing: 'hero',
        fontStyle: 'hero',
      },
      heroValue: {
        family: 'display',
        size: '1.15rem',
        lineHeight: 1,
        weight: 'hero',
        letterSpacing: 'title',
        fontStyle: 'hero',
      },
      screenTitle: {
        family: 'display',
        size: '1.125rem',
        lineHeight: 1.1,
        weight: 'title',
        letterSpacing: 'title',
      },
      sectionTitle: {
        family: 'primary',
        size: '0.625rem',
        lineHeight: 1.25,
        weight: 'label',
        letterSpacing: 'label',
        textTransform: 'section',
      },
      cardTitle: {
        family: 'primary',
        size: '0.875rem',
        lineHeight: 1.2,
        weight: 'title',
        letterSpacing: 'title',
      },
      label: {
        family: 'primary',
        size: '0.625rem',
        lineHeight: 1.2,
        weight: 'label',
        letterSpacing: 'label',
        textTransform: 'label',
      },
      body: {
        family: 'primary',
        size: '0.75rem',
        lineHeight: 1.45,
        weight: 'body',
        fontStyle: 'body',
      },
      caption: {
        family: 'primary',
        size: '0.625rem',
        lineHeight: 1.4,
        weight: 'body',
        letterSpacing: 'title',
      },
      navLabel: {
        family: 'primary',
        size: '0.5rem',
        lineHeight: 1,
        weight: 'label',
        letterSpacing: 'label',
        textTransform: 'label',
      },
      pillLabel: {
        family: 'primary',
        size: '0.625rem',
        lineHeight: 1,
        weight: 'label',
        letterSpacing: 'label',
        textTransform: 'label',
      },
      insightTitle: {
        family: 'primary',
        size: '0.625rem',
        lineHeight: 1.2,
        weight: 'label',
        letterSpacing: 'label',
        textTransform: 'section',
      },
      insightBody: {
        family: 'primary',
        size: '0.6875rem',
        lineHeight: 1.5,
        weight: 'body',
        fontStyle: 'body',
      },
    },
  },
};
