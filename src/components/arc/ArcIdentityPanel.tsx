import React from 'react';
import ArcAtmosphere from './ArcAtmosphere';
import { foundationTheme, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';

interface ArcIdentityPanelProps {
  visible: boolean;
  anonymousUsername: string;
}

export default function ArcIdentityPanel({ visible, anonymousUsername }: ArcIdentityPanelProps) {
  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        /* Positioned to the left of the phone shell, near the top */
        right: 'calc(50% + 220px)',
        top: '80px',
        width: '280px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(10px) scale(0.98)',
        transition: 'opacity 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <div
        className="relative rounded-2xl p-5"
        style={{
          ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: foundationTheme.accent.primary, tintStrength: 0.035 }),
          border: `1px solid ${hexToRgba('#FFFFFF', 0.075)}`,
        }}
      >
        <ArcAtmosphere variant="modal" intensity={0.38} className="z-0 rounded-2xl" />
        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-4 w-1 rounded-full" style={{ background: foundationTheme.signal.up }} />
            <h3 style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary }}>Private Identity</h3>
          </div>

          <p className="mb-4" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.secondary }}>
          Your visible Cinder HUB identity stays private and system-generated. It is separate from the account used for login, sync, and recovery.
          </p>

          <div
            className="mb-4 rounded-2xl border px-3 py-3"
            style={{
              ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.026 }),
              borderColor: hexToRgba('#FFFFFF', 0.07),
            }}
          >
            <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted }}>
              Generated username
            </div>
            <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary }}>
              {anonymousUsername}
            </div>
            <div className="mt-1.5" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
            This handle is what the system uses inside Cinder HUB to preserve a private in-app identity.
            </div>
          </div>

          <div className="border-t pt-3" style={{ borderColor: foundationTheme.border.soft }}>
            <span style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted }}>
              Login credentials and private identity stay separate by design
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
