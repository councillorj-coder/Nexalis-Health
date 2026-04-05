import type { CSSProperties } from 'react';

export type SessionLogoAssetMode = 'tint' | 'cutout';

export type SessionLogoAssetProps = {
  src: string;
  width: number;
  height: number;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  mode?: SessionLogoAssetMode;
  lineColor?: string;
  lineOpacity?: number;
  glowColor?: string;
  glowBlur?: number;
  glowStrength?: number;
  outlineColor?: string;
  outlineOpacity?: number;
  outlineScale?: number;
  cutoutTint?: string;
  backdropBlur?: number;
  contrast?: number;
  brightness?: number;
  transition?: string;
};

function buildMaskStyle(src: string): CSSProperties {
  return {
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
  };
}

export function SessionLogoAsset({
  src,
  width,
  height,
  scale = 1,
  offsetX = 0,
  offsetY = 0,
  mode = 'tint',
  lineColor = 'rgba(246,249,252,0.95)',
  lineOpacity = 1,
  glowColor = 'rgba(255,255,255,0.22)',
  glowBlur = 8,
  glowStrength = 1,
  outlineColor = 'rgba(255,255,255,0.18)',
  outlineOpacity = 0,
  outlineScale = 1.035,
  cutoutTint = 'rgba(255,255,255,0.06)',
  backdropBlur = 8,
  contrast = 1,
  brightness = 1,
  transition = 'transform 0.25s ease, filter 0.25s ease, opacity 0.25s ease',
}: SessionLogoAssetProps) {
  const baseMaskStyle = buildMaskStyle(src);
  const transformedStyle: CSSProperties = {
    transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
    transformOrigin: 'center center',
    transition,
  };

  const outlineStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    ...baseMaskStyle,
    background: outlineColor,
    opacity: outlineOpacity,
    transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale * outlineScale})`,
    transformOrigin: 'center center',
    transition,
  };

  const glowStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    ...baseMaskStyle,
    background: lineColor,
    opacity: Math.min(1, 0.28 * glowStrength),
    filter: `blur(${glowBlur}px)`,
    ...transformedStyle,
  };

  const coreStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    ...baseMaskStyle,
    background: mode === 'cutout' ? cutoutTint : lineColor,
    opacity: lineOpacity,
    filter: `brightness(${brightness}) contrast(${contrast})`,
    backdropFilter: mode === 'cutout' ? `blur(${backdropBlur}px) saturate(115%)` : undefined,
    WebkitBackdropFilter: mode === 'cutout' ? `blur(${backdropBlur}px) saturate(115%)` : undefined,
    ...transformedStyle,
  };

  return (
    <span
      className="pointer-events-none relative block shrink-0 overflow-visible"
      aria-hidden="true"
      style={{
        width,
        height,
      }}
    >
      {outlineOpacity > 0 ? <span style={outlineStyle} /> : null}
      {glowStrength > 0 ? <span style={glowStyle} /> : null}
      <span style={coreStyle} />
    </span>
  );
}
