import type { ArcAppDataSnapshot } from '../../data/arc-app-data';
import ArcScreenHeader from './ArcScreenHeader';
import { foundationTheme, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';

export default function ArcNocturnalScreen({
  onBack,
  data,
}: {
  onBack: () => void;
  data: ArcAppDataSnapshot;
}) {
  return (
    <div className="space-y-4">
      <ArcScreenHeader title="Nocturnal" onBack={onBack} />

      {!data.featureAvailability.nocturnal ? (
        <>
          <div
            className="rounded-[30px] border p-6"
            style={{
              ...getArcGlassSurfaceStyle(foundationTheme, 'hero', { tint: foundationTheme.chart.nocturnal, tintStrength: 0.036 }),
              borderColor: hexToRgba('#FFFFFF', 0.076),
            }}
          >
            <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.chart.nocturnal }}>
              Coming later
            </div>
            <div className="mt-3" style={{ ...getArcTypographyStyle(foundationTheme, 'displayHero'), color: foundationTheme.text.highlight, fontSize: '2rem' }}>
              Overnight intelligence is still offline
            </div>
            <div className="mt-3" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.secondary }}>
              Nocturnal insight unlocks only after enough overnight data has been collected. On day one, the system keeps this layer quiet until it has real signal history to work from.
            </div>
            <div className="mt-5 rounded-[22px] border px-4 py-3" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.chart.nocturnal, tintStrength: 0.028 }), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
              <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted }}>
                Unlock path
              </div>
              <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
                Sleep with the device over early nights to bring nocturnal quality, strongest event, and overnight comparison online.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[24px] border p-4" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.chart.nocturnal, tintStrength: 0.026 }), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
              <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted }}>
                Current status
              </div>
              <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'heroValue'), color: foundationTheme.accent.primary }}>
                Awaiting data
              </div>
              <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
                First overnight read has not been collected yet
              </div>
            </div>
            <div className="rounded-[24px] border p-4" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.024 }), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
              <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted }}>
                Unlocks with
              </div>
              <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'heroValue'), color: foundationTheme.text.primary }}>
                Early nights
              </div>
              <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
                Enough overnight history to establish a real baseline
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-[28px] border p-5" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: foundationTheme.chart.nocturnal, tintStrength: 0.03 }), borderColor: hexToRgba('#FFFFFF', 0.072) }}>
          <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.chart.nocturnal }}>
            Nocturnal signal
          </div>
          <div className="mt-3" style={{ ...getArcTypographyStyle(foundationTheme, 'heroValue'), color: foundationTheme.text.primary }}>
            {data.highlights.nocturnalTotalActive}
          </div>
          <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
            {data.highlights.nocturnalTrendLabel}
          </div>
        </div>
      )}
    </div>
  );
}
