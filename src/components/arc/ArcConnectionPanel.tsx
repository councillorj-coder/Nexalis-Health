import React from 'react';
import ArcAtmosphere from './ArcAtmosphere';
import { foundationTheme, getArcTypographyStyle, hexToRgba } from './arc-theme';

interface ArcConnectionPanelProps {
  visible: boolean;
}

export default function ArcConnectionPanel({ visible }: ArcConnectionPanelProps) {
  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        /* Positioned near the Connection pill in the header */
        left: 'calc(50% + 40px)',
        top: '110px',
        width: '240px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
        transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        className="relative rounded-2xl p-5"
        style={{
          background: foundationTheme.bg.tooltip,
          border: `1px solid ${foundationTheme.border.soft}`,
          boxShadow: foundationTheme.shadow.card,
          backdropFilter: 'blur(20px)',
        }}
      >
        <ArcAtmosphere variant="modal" intensity={0.38} className="z-0 rounded-2xl" />
        <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2 w-2 animate-pulse rounded-full" style={{ background: foundationTheme.signal.up, boxShadow: `0 0 8px ${hexToRgba(foundationTheme.signal.up, 0.5)}` }} />
          <h3 style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary, fontSize: '0.75rem' }}>Device Connected</h3>
        </div>

        <p style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.secondary }}>
          Your ring is currently connected to the app. Live connection allows recent data to sync, device status to update, and new session activity to be captured more reliably.
        </p>

        <div className="mt-4 pt-4 border-t" style={{ borderColor: foundationTheme.border.soft }}>
          <p style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted, fontStyle: 'italic' }}>
            Connection status updates automatically.
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
