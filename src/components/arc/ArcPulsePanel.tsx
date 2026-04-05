import React from 'react';
import ArcAtmosphere from './ArcAtmosphere';
import { foundationTheme, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';
import { getPulsePalette, PulseGlyph } from './pulseAppearance';
import type { PulseItem } from '../../data/pulseTypes';

interface ArcPulsePanelProps {
  visible: boolean;
  unreadCount: number;
  latestPulse: PulseItem | null;
}

export default function ArcPulsePanel({
  visible,
  unreadCount,
  latestPulse,
}: ArcPulsePanelProps) {
  const palette = latestPulse ? getPulsePalette(latestPulse) : null;
  const accent = palette?.accent ?? foundationTheme.text.highlight;
  const unreadLabel =
    unreadCount > 0
      ? `${unreadCount} unread signal${unreadCount === 1 ? '' : 's'}`
      : 'All caught up';

  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        left: 'calc(50% + 200px)',
        top: '72px',
        width: '260px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(-10px) scale(0.98)',
        transition: 'opacity 0.32s cubic-bezier(0.4,0,0.2,1), transform 0.32s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <div
        className="relative rounded-2xl p-5"
        style={{
          ...getArcGlassSurfaceStyle(foundationTheme, 'medium', {
            tint: '#C2D3E7',
            tintStrength: 0.028,
          }),
          border: `1px solid ${hexToRgba('#FFFFFF', 0.07)}`,
        }}
      >
        <ArcAtmosphere variant="modal" intensity={0.34} className="z-0 rounded-2xl" />
        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2">
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full border"
              style={{
                background: hexToRgba(accent, 0.08),
                borderColor: hexToRgba(accent, 0.12),
              }}
            >
              <PulseGlyph iconType={latestPulse?.iconType ?? 'ring'} color={accent} className="h-2.5 w-2.5" />
            </div>
            <h3
              style={{
                ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
                color: foundationTheme.text.primary,
              }}
            >
              Pulse Mailbox
            </h3>
          </div>

          <p
            style={{
              ...getArcTypographyStyle(foundationTheme, 'body'),
              color: foundationTheme.text.secondary,
            }}
          >
            Pulse gathers accomplishments, insights, and guidance into one quiet message layer you can open any time.
          </p>

          <div
            className="mt-4 rounded-[18px] border px-3 py-3"
            style={{
              background: hexToRgba('#FFFFFF', 0.02),
              borderColor: hexToRgba('#FFFFFF', 0.05),
            }}
          >
            <div
              style={{
                ...getArcTypographyStyle(foundationTheme, 'label'),
                color: foundationTheme.text.muted,
              }}
            >
              Mailbox state
            </div>
            <div
              className="mt-1"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
                color: unreadCount > 0 ? accent : foundationTheme.text.primary,
              }}
            >
              {unreadLabel}
            </div>
            <div
              className="mt-1.5"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'caption'),
                color: foundationTheme.text.secondary,
              }}
            >
              {latestPulse ? `Latest: ${latestPulse.title}` : 'Tap to open your recent Pulse history.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
