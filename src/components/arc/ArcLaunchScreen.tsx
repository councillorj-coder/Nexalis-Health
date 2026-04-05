import { useState, useEffect } from 'react';
import ArcAtmosphere from './ArcAtmosphere';
import { foundationTheme, getArcTypographyStyle, hexToRgba } from './arc-theme';

export default function ArcLaunchScreen({ onComplete }: { onComplete: () => void }) {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setOpacity(0), 1800);
    const completeTimer = setTimeout(onComplete, 2400);
    return () => { clearTimeout(fadeTimer); clearTimeout(completeTimer); };
  }, [onComplete]);

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        opacity,
        transition: 'opacity 0.6s ease-out',
        background: foundationTheme.bg.app,
      }}
    >
      <ArcAtmosphere variant="home" intensity={0.84} className="z-0" />

      <svg className="relative z-10 mb-8 h-12 w-48 opacity-40" viewBox="0 0 200 50" preserveAspectRatio="none">
        <path
          d="M0,25 Q25,10 50,25 T100,25 T150,25 T200,25"
          stroke={hexToRgba(foundationTheme.accent.primary, 0.56)}
          strokeWidth="1.5"
          fill="none"
        >
          <animate attributeName="d" values="M0,25 Q25,10 50,25 T100,25 T150,25 T200,25;M0,25 Q25,40 50,25 T100,25 T150,25 T200,25;M0,25 Q25,10 50,25 T100,25 T150,25 T200,25" dur="2s" repeatCount="indefinite" />
        </path>
      </svg>

      <div
        className="relative z-10"
        style={{
          ...getArcTypographyStyle(foundationTheme, 'screenTitle'),
          color: hexToRgba(foundationTheme.text.primary, 0.92),
          fontSize: '1.35rem',
          letterSpacing: '-0.05em',
        }}
      >
              Cinder <span style={{ color: foundationTheme.accent.primary }}>HUB</span>
      </div>

      <div className="relative z-10 mt-3" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: hexToRgba(foundationTheme.text.secondary, 0.8), fontSize: '0.72rem' }}>
        Private performance intelligence
      </div>

      <div className="relative z-10 mt-6 h-px w-12" style={{ background: `linear-gradient(90deg, transparent, ${foundationTheme.accent.primary}, transparent)` }} />
    </div>
  );
}
