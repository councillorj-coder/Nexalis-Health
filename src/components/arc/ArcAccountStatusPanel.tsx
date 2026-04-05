import React from 'react';
import ArcAtmosphere from './ArcAtmosphere';
import { foundationTheme, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';

interface ArcAccountStatusPanelProps {
  visible: boolean;
  statusLabel: string;
  calibrationProgress: number;
}

export default function ArcAccountStatusPanel({
  visible,
  statusLabel,
  calibrationProgress,
}: ArcAccountStatusPanelProps) {
  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
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
            <div className="h-4 w-1 rounded-full" style={{ background: foundationTheme.accent.primary }} />
            <h3 style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary }}>
              Account Status
            </h3>
          </div>

          <p className="mb-4" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.secondary }}>
          Account status reflects your standing inside Cinder. It stays separate from profile formation, current focus, and private identity.
          </p>

          <div
            className="mb-4 rounded-2xl border px-3 py-3"
            style={{
              ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.026 }),
              borderColor: hexToRgba('#FFFFFF', 0.07),
            }}
          >
            <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted }}>
              Current status
            </div>
            <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary }}>
              {statusLabel}
            </div>
            <div className="mt-1.5" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
              Foundation remains active for now while later status levels stay sealed. Profile formation is currently {Math.round(calibrationProgress * 100)}% complete.
            </div>
          </div>

          <div className="border-t pt-3" style={{ borderColor: foundationTheme.border.soft }}>
            <span style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted }}>
              Account status and private identity are tracked separately
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
