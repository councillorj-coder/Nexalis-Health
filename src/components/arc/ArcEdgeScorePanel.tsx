import React from 'react';
import ArcAtmosphere from './ArcAtmosphere';
import { foundationTheme, getArcTypographyStyle, hexToRgba } from './arc-theme';

interface ArcEdgeScorePanelProps {
  visible: boolean;
}

export default function ArcEdgeScorePanel({ visible }: ArcEdgeScorePanelProps) {
  return (
    <div
      className="absolute z-50 pointer-events-auto"
      style={{
        left: 'calc(50% + 220px)',
        top: '160px',
        width: '280px',
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
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full border" style={{ borderColor: hexToRgba(foundationTheme.accent.primary, 0.3) }}>
              <div className="h-2 w-2 rounded-full" style={{ background: foundationTheme.accent.primary, boxShadow: `0 0 8px ${foundationTheme.accent.primary}` }} />
            </div>
            <h3 style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary }}>Edge Score</h3>
          </div>

          <p style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.secondary }}>
          Edge Score is Cinder&apos;s signature performance read, designed to turn recent physiology into one clear measure of readiness, quality, and reliability.
          </p>

          <div className="mt-3" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: hexToRgba(foundationTheme.text.secondary, 0.9) }}>
            It blends baseline readiness, erection quality, session strength, overnight support, and consistency into a score that stays responsive to what your recent profile is actually showing.
          </div>

          <div className="mt-5 border-t pt-4" style={{ borderColor: foundationTheme.border.soft }}>
            <p style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted, fontStyle: 'italic' }}>
              A premium composite read for understanding performance quality over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
