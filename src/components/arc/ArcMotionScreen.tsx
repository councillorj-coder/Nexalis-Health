import type { ArcAppDataSnapshot } from '../../data/arc-app-data';
import ArcScreenHeader from './ArcScreenHeader';
import { foundationTheme, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';

export default function ArcMotionScreen({
  onBack,
  data,
}: {
  onBack: () => void;
  data: ArcAppDataSnapshot;
}) {
  const motionReady = data.featureAvailability.buildInsights;
  const latestMotion = data.latestMotionSession;

  return (
    <div className="space-y-4">
      <ArcScreenHeader title="Insights" onBack={onBack} />

      <div className="rounded-[30px] border p-6" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'hero', { tint: foundationTheme.accent.primary, tintStrength: 0.034 }), borderColor: hexToRgba('#FFFFFF', 0.076) }}>
        <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.accent.primary }}>
          Limited overview
        </div>
        <div className="mt-3" style={{ ...getArcTypographyStyle(foundationTheme, 'displayHero'), color: foundationTheme.text.highlight, fontSize: '2rem' }}>
          {motionReady ? 'Early session insight is forming' : 'More session detail unlocks after first capture'}
        </div>
        <div className="mt-3" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.secondary }}>
          {motionReady
            ? 'Your earliest captured session is now helping build initial understanding around build, hold, and recovery behavior.'
            : 'On day one, this area stays intentionally light. It begins opening up after your first captured session and gains confidence with continued use.'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[24px] border p-4" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.028 }), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
          <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted }}>
            Build insight
          </div>
          <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'heroValue'), color: motionReady ? foundationTheme.text.primary : foundationTheme.accent.primary }}>
            {motionReady ? latestMotion?.metrics.buildSpeed ?? 'Live' : 'Pending'}
          </div>
          <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
            {motionReady ? 'Using your earliest captured session' : 'Unlocks after first session capture'}
          </div>
        </div>
        <div className="rounded-[24px] border p-4" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.024 }), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
          <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted }}>
            Active modeling
          </div>
          <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'heroValue'), color: data.featureAvailability.activeInsights ? foundationTheme.text.primary : foundationTheme.accent.primary }}>
            {data.featureAvailability.activeInsights ? data.highlights.activeStateLabel : 'Pending'}
          </div>
          <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
            {data.featureAvailability.activeInsights ? data.highlights.activeStateSummary : 'Activates once early session behavior is captured'}
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border p-5" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: foundationTheme.accent.primary, tintStrength: 0.024 }), borderColor: hexToRgba('#FFFFFF', 0.072) }}>
        <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.text.muted }}>
          Coming online over time
        </div>
        <div className="mt-4 space-y-3">
          {[
            'Session build and hold interpretation after first capture',
            'Recovery confidence after additional sessions',
            'Broader comparison once baseline and archive depth are established',
          ].map(item => (
            <div key={item} className="flex items-start gap-2">
              <div className="mt-1.5 h-1.5 w-1.5 rounded-full" style={{ background: hexToRgba(foundationTheme.accent.primary, 0.9) }} />
              <div style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.secondary }}>
                {item}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
