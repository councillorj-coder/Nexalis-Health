import React from 'react';
import ArcAtmosphere from './ArcAtmosphere';
import { foundationTheme, getArcTypographyStyle, hexToRgba } from './arc-theme';

interface ArcMomentumPanelProps {
  visible: boolean;
}

export default function ArcMomentumPanel({ visible }: ArcMomentumPanelProps) {
  return (
    <div
      className="absolute z-50 pointer-events-auto"
      style={{
        /* Positioned to the right of the phone shell */
        left: 'calc(50% + 220px)',
        top: '80px',
        width: '260px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(-16px) scale(0.97)',
        transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div
        className="relative rounded-2xl p-6"
        style={{
          background: foundationTheme.bg.tooltip,
          border: `1px solid ${foundationTheme.border.soft}`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 1px rgba(255,255,255,0.05), 0 0 40px ${hexToRgba(foundationTheme.accent.primary, 0.04)}`,
          backdropFilter: 'blur(24px)',
        }}
      >
        <ArcAtmosphere variant="modal" intensity={0.42} className="z-0 rounded-2xl" />
        <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <svg width="12" height="18" viewBox="0 0 12 18" fill="none" aria-hidden="true">
             <path
               d="M5.8 1.2c.55 0 .99.44.99.99v8.45c0 2.54-1.62 4.82-4.03 5.67l-.56.2-.19-.55a9.13 9.13 0 0 1-.49-2.95c0-1.91.59-3.77 1.67-5.34l1.83-2.63V2.19c0-.55.44-.99.78-.99Z"
               fill={foundationTheme.accent.primary}
             />
             <path
               d="M6.34 1.9c.92.34 1.59 1.22 1.59 2.27v6.14c0 2.04-.98 3.95-2.63 5.16.82-1.26 1.26-2.73 1.26-4.25V1.9h-.22Z"
               fill={hexToRgba('#ffffff', 0.18)}
             />
          </svg>
          <h3 style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary }}>Wear Streak</h3>
        </div>

        <p style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.secondary }}>
          Shows how many consecutive days the device has been worn. Longer streaks help improve calibration, baseline quality, and long-term insight accuracy.
        </p>

        <div className="mt-5 pt-4 border-t" style={{ borderColor: foundationTheme.border.soft }}>
          <p style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted, fontStyle: 'italic' }}>
            Consistency strengthens the system over time.
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
