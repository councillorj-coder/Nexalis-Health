import React from 'react';
import ArcAtmosphere from './ArcAtmosphere';
import { foundationTheme, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';

interface ArcBatteryPanelProps {
  visible: boolean;
  batteryLevel: number;
  deviceConnected: boolean;
}

export default function ArcBatteryPanel({
  visible,
  batteryLevel,
  deviceConnected,
}: ArcBatteryPanelProps) {
  const statusTone = !deviceConnected
    ? hexToRgba('#9CA8B8', 0.94)
    : batteryLevel <= 10
      ? hexToRgba('#D0AEA8', 0.94)
      : batteryLevel <= 25
        ? hexToRgba('#D7D4CA', 0.94)
        : hexToRgba('#DEE8F4', 0.96);

  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        right: 'calc(50% + 200px)',
        top: '72px',
        width: '252px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(10px) scale(0.98)',
        transition: 'opacity 0.32s cubic-bezier(0.4,0,0.2,1), transform 0.32s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <div
        className="relative rounded-2xl p-5"
        style={{
          ...getArcGlassSurfaceStyle(foundationTheme, 'medium', {
            tint: '#C4D3E4',
            tintStrength: 0.028,
          }),
          border: `1px solid ${hexToRgba('#FFFFFF', 0.07)}`,
        }}
      >
        <ArcAtmosphere variant="modal" intensity={0.34} className="z-0 rounded-2xl" />
        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2">
            <div
              className="h-4 w-1 rounded-full"
              style={{ background: statusTone, boxShadow: `0 0 10px ${hexToRgba(statusTone, 0.16)}` }}
            />
            <h3
              style={{
                ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
                color: foundationTheme.text.primary,
              }}
            >
              Battery
            </h3>
          </div>

          <p
            style={{
              ...getArcTypographyStyle(foundationTheme, 'body'),
              color: foundationTheme.text.secondary,
            }}
          >
            Expands your device power quick view with charge state, remaining time, and the latest battery recommendation.
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
              Current reserve
            </div>
            <div
              className="mt-1"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
                color: statusTone,
              }}
            >
              {deviceConnected ? `${batteryLevel}%` : 'Unavailable'}
            </div>
            <div
              className="mt-1.5"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'caption'),
                color: foundationTheme.text.secondary,
              }}
            >
              {deviceConnected ? 'Tap to open the expanded battery detail view.' : 'Reconnect the device to restore live battery detail.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
