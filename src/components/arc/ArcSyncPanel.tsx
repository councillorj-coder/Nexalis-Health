import React from 'react';
import ArcAtmosphere from './ArcAtmosphere';
import { foundationTheme, getArcTypographyStyle } from './arc-theme';

interface ArcSyncPanelProps {
  visible: boolean;
}

export default function ArcSyncPanel({ visible }: ArcSyncPanelProps) {
  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        /* Positioned near the Sync text in the header */
        left: 'calc(50% - 140px)',
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
          <svg className="w-3.5 h-3.5" style={{ color: foundationTheme.accent.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <h3 style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary, fontSize: '0.75rem' }}>Sync Status</h3>
        </div>

        <p style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.secondary }}>
          This shows when your device and app last synced. Sync keeps recent sessions, trend data, unlocks, and account progress up to date across your device and private account.
        </p>

        <div className="mt-4 pt-3 border-t" style={{ borderColor: foundationTheme.border.soft }}>
          <p style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted, fontStyle: 'italic' }}>
            Updated automatically when connected.
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
