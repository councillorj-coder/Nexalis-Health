import ArcAtmosphere from './ArcAtmosphere';
import { foundationTheme, getArcTypographyStyle, hexToRgba } from './arc-theme';

interface ArcInsigniaPanelProps {
  visible: boolean;
}

export default function ArcInsigniaPanel({ visible }: ArcInsigniaPanelProps) {
  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        right: 'calc(50% + 220px)',
        top: '100px',
        width: '280px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(16px) scale(0.97)',
        transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <div
        className="relative rounded-2xl p-5"
        style={{
          background: foundationTheme.bg.tooltip,
          border: `1px solid ${foundationTheme.border.strong}`,
          boxShadow: foundationTheme.shadow.overlay,
          backdropFilter: 'blur(24px)',
        }}
      >
        <ArcAtmosphere variant="modal" intensity={0.4} className="z-0 rounded-2xl" />
        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2">
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full border"
              style={{ borderColor: hexToRgba(foundationTheme.accent.primary, 0.24) }}
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ background: foundationTheme.accent.primary }}
              />
            </div>
            <h3
              style={{
                ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
                color: foundationTheme.text.primary,
              }}
            >
              Insignia Inventory
            </h3>
          </div>

          <p
            style={{
              ...getArcTypographyStyle(foundationTheme, 'body'),
              color: foundationTheme.text.secondary,
            }}
          >
          Your insignia marks private system progression inside Cinder HUB. Open inventory to review your active crest, the Ember Sigil streak path, and the next thermal tier ahead.
          </p>

          <div className="mt-4 border-t pt-3" style={{ borderColor: foundationTheme.border.soft }}>
            <p
              style={{
                ...getArcTypographyStyle(foundationTheme, 'caption'),
                color: foundationTheme.text.muted,
                fontStyle: 'italic',
              }}
            >
              A private thermal insignia path forged through sustained wear continuity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
