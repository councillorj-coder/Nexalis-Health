import type { AvatarTier } from '../../data/arc-types';

type EmberTier = 'ember1' | 'ember2' | 'ember3' | 'ember4' | 'ember5';
type LegacyTier = Exclude<AvatarTier, EmberTier>;

type LegacyInsigniaStyle = {
  fill: string;
  ringStroke: string;
  ringWidth: number;
  initialColor: string;
  innerRing?: boolean;
  innerRingColor: string;
  glowColor: string;
  glowOpacity: number;
  notch?: boolean;
  glyph: 'dot' | 'line' | 'bolt' | 'pulse' | 'nocturne' | 'elite' | 'threshold';
};

const EMBER_LEVEL_BY_TIER: Record<EmberTier, 1 | 2 | 3 | 4 | 5> = {
  ember1: 1,
  ember2: 2,
  ember3: 3,
  ember4: 4,
  ember5: 5,
};

const EMBER_ASSET_BY_TIER: Record<EmberTier, { kind: 'image' | 'video'; src: string }> = {
  ember1: { kind: 'image', src: '/insignia/ember-1.png' },
  ember2: { kind: 'image', src: '/insignia/ember-2.png' },
  ember3: { kind: 'image', src: '/insignia/ember-3.png' },
  ember4: { kind: 'image', src: '/insignia/ember-4.png' },
  ember5: { kind: 'video', src: '/insignia/ember-5-luxury.mp4' },
};

const LEGACY_TIER_STYLES: Record<LegacyTier, LegacyInsigniaStyle> = {
  threshold: {
    fill: '#141414',
    ringStroke: '#49423B',
    ringWidth: 1.5,
    initialColor: '#8B8278',
    innerRingColor: '#5F5750',
    glowColor: '#D7C4B0',
    glowOpacity: 0.05,
    glyph: 'threshold',
  },
  hold: {
    fill: '#0A1220',
    ringStroke: '#2D3A4F',
    ringWidth: 2,
    initialColor: '#5C9DFF',
    innerRing: true,
    innerRingColor: '#3A5A8F',
    glowColor: '#3B82F6',
    glowOpacity: 0.1,
    glyph: 'line',
  },
  alloy: {
    fill: '#1A1A1A',
    ringStroke: '#666666',
    ringWidth: 1.8,
    initialColor: '#C4956A',
    innerRing: true,
    innerRingColor: '#C4956A',
    glowColor: '#C4956A',
    glowOpacity: 0.15,
    glyph: 'dot',
  },
  onset: {
    fill: '#1F1206',
    ringStroke: '#8B4513',
    ringWidth: 2,
    initialColor: '#FF8C00',
    innerRing: true,
    innerRingColor: '#FFA500',
    glowColor: '#FF8C00',
    glowOpacity: 0.2,
    glyph: 'bolt',
  },
  deephold: {
    fill: '#051821',
    ringStroke: '#005F73',
    ringWidth: 2.2,
    initialColor: '#94D2BD',
    innerRing: true,
    innerRingColor: '#0A9396',
    glowColor: '#0A9396',
    glowOpacity: 0.25,
    glyph: 'line',
  },
  rhythm: {
    fill: '#150A20',
    ringStroke: '#4B0082',
    ringWidth: 2,
    initialColor: '#E0B0FF',
    innerRing: true,
    innerRingColor: '#BA55D3',
    glowColor: '#8A2BE2',
    glowOpacity: 0.2,
    glyph: 'pulse',
  },
  blackgold: {
    fill: '#0F0F0F',
    ringStroke: '#E5C100',
    ringWidth: 2.5,
    initialColor: '#E5C100',
    innerRing: true,
    innerRingColor: '#FFD700',
    glowColor: '#FFD700',
    glowOpacity: 0.3,
    notch: true,
    glyph: 'dot',
  },
  endurance: {
    fill: '#1A1A1A',
    ringStroke: '#E5E4E2',
    ringWidth: 2.5,
    initialColor: '#F5F5F5',
    innerRingColor: '#FFFFFF',
    glowColor: '#FFFFFF',
    glowOpacity: 0.2,
    notch: true,
    glyph: 'line',
  },
  nocturne: {
    fill: '#0B0014',
    ringStroke: '#480CA8',
    ringWidth: 2.5,
    initialColor: '#B5179E',
    innerRingColor: '#7209B7',
    glowColor: '#F72585',
    glowOpacity: 0.35,
    glyph: 'nocturne',
  },
  sovereign: {
    fill: 'url(#sov-grad)',
    ringStroke: '#C4956A',
    ringWidth: 3,
    initialColor: '#C4956A',
    innerRing: true,
    innerRingColor: '#D4AF37',
    glowColor: '#D4AF37',
    glowOpacity: 0.45,
    notch: true,
    glyph: 'elite',
  },
  obsidian: {
    fill: '#050505',
    ringStroke: '#333333',
    ringWidth: 3.5,
    initialColor: '#C4956A',
    innerRingColor: '#C4956A',
    glowColor: '#C4956A',
    glowOpacity: 0.6,
    notch: true,
    glyph: 'elite',
  },
};

function renderLegacyGlyph(
  glyph: LegacyInsigniaStyle['glyph'],
  color: string,
  cx: number,
  cy: number,
  scale: number,
) {
  switch (glyph) {
    case 'threshold':
      return <rect x={cx - 5 * scale} y={cy - 5 * scale} width={10 * scale} height={10 * scale} rx={2 * scale} fill="none" stroke={color} strokeWidth={2 * scale} />;
    case 'line':
      return <line x1={cx} y1={cy - 8 * scale} x2={cx} y2={cy + 8 * scale} stroke={color} strokeWidth={3 * scale} strokeLinecap="round" />;
    case 'bolt':
      return <path d={`M${cx + 2 * scale} ${cy - 10 * scale} L${cx - 6 * scale} ${cy + 2 * scale} L${cx - 1 * scale} ${cy + 2 * scale} L${cx - 4 * scale} ${cy + 10 * scale} L${cx + 6 * scale} ${cy - 2 * scale} L${cx + 1 * scale} ${cy - 2 * scale} Z`} fill={color} />;
    case 'pulse':
      return <path d={`M${cx - 10 * scale} ${cy} L${cx - 4 * scale} ${cy} L${cx - 1 * scale} ${cy - 7 * scale} L${cx + 3 * scale} ${cy + 7 * scale} L${cx + 6 * scale} ${cy} L${cx + 10 * scale} ${cy}`} fill="none" stroke={color} strokeWidth={2.5 * scale} strokeLinejoin="round" />;
    case 'nocturne':
      return <path d={`M${cx + 6 * scale} ${cy - 6 * scale} A8 8 0 1 0 ${cx + 6 * scale} ${cy + 6 * scale} A6 6 0 1 1 ${cx + 6 * scale} ${cy - 6 * scale}`} fill={color} />;
    case 'elite':
      return (
        <g transform={`translate(${cx - 8 * scale}, ${cy - 8 * scale}) scale(${scale * 0.4})`}>
          <path d="M20 2L38 20L20 38L2 20L20 2Z" fill="none" stroke={color} strokeWidth="3" />
          <path d="M20 8L32 20L20 32L8 20L20 8Z" fill={color} opacity="0.6" />
        </g>
      );
    case 'dot':
    default:
      return <circle cx={cx} cy={cy} r={4.5 * scale} fill={color} />;
  }
}

function EmberSigil({ tier, size }: { tier: EmberTier; size: number }) {
  const asset = EMBER_ASSET_BY_TIER[tier];

  return (
    <div
      className="flex-shrink-0"
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {asset.kind === 'video' ? (
        <div
          style={{
            width: '74%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '999px',
            WebkitMaskImage:
              'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.92) 28%, rgba(0,0,0,1) 44%, rgba(0,0,0,1) 56%, rgba(0,0,0,0.92) 72%, rgba(0,0,0,0) 100%)',
            maskImage:
              'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.92) 28%, rgba(0,0,0,1) 44%, rgba(0,0,0,1) 56%, rgba(0,0,0,0.92) 72%, rgba(0,0,0,0) 100%)',
            transform: 'scale(1.04)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <video
            src={asset.src}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            disablePictureInPicture
            style={{
              position: 'absolute',
              inset: '53% auto auto 50%',
              width: '116%',
              height: '116%',
              objectFit: 'contain',
              objectPosition: 'center center',
              display: 'block',
              transform: 'translate(-50%, -50%)',
              transformOrigin: 'center center',
              mixBlendMode: 'screen',
              filter: 'brightness(1.08) contrast(1.06)',
              opacity: 0.98,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        </div>
      ) : (
        <img
          src={asset.src}
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center center',
            display: 'block',
            transform: 'scaleX(1.14)',
            transformOrigin: 'center center',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      )}
    </div>
  );
}

interface ArcInsigniaProps {
  tier: AvatarTier;
  size?: number;
}

export default function ArcInsignia({ tier, size = 48 }: ArcInsigniaProps) {
  if (tier in EMBER_LEVEL_BY_TIER) {
    return <EmberSigil tier={tier as EmberTier} size={size} />;
  }

  const s = LEGACY_TIER_STYLES[(tier as LegacyTier) ?? 'threshold'] || LEGACY_TIER_STYLES.threshold;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 2;
  const ringR = size / 2 - 1;
  const innerRingR = outerR - 3.5;
  const scale = size / 48;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="arc-insignia flex-shrink-0"
      style={{ filter: s.glowOpacity > 0 ? `drop-shadow(0 0 ${4 + s.glowOpacity * 6}px ${s.glowColor})` : undefined }}
    >
      <defs>
        <radialGradient id="sig-grad" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#1E1E1E" />
          <stop offset="100%" stopColor="#0A0A0A" />
        </radialGradient>
        <radialGradient id="sov-grad" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#1C1610" />
          <stop offset="100%" stopColor="#0A0806" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={ringR} fill="none" stroke={s.ringStroke} strokeWidth={s.ringWidth} />
      <circle cx={cx} cy={cy} r={outerR} fill={s.fill} />

      {s.innerRing ? (
        <circle cx={cx} cy={cy} r={innerRingR} fill="none" stroke={s.innerRingColor} strokeWidth={0.6} opacity={0.5} />
      ) : null}

      {s.notch ? (
        <circle cx={cx} cy={3.5} r={1.8} fill={s.innerRingColor} opacity={0.85} />
      ) : null}

      {renderLegacyGlyph(s.glyph, s.initialColor, cx, cy, scale)}

      <style>{`
        .arc-insignia { animation: insignia-pulse 3s ease-in-out infinite; }
        @keyframes insignia-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.92; } }
      `}</style>
    </svg>
  );
}
