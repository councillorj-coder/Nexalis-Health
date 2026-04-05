import type { ArcAppDataSnapshot } from '../../data/arc-app-data';
import ArcScreenHeader from './ArcScreenHeader';
import { foundationTheme, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';

function TrendGraph({ data, color = foundationTheme.chart.baseline }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 84;
  const width = 260;
  const points = data.map((value, index) => `${(index / (data.length - 1)) * width},${height - ((value - min) / range) * (height - 18) - 9}`);

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="mt-2">
      <polyline points={points.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ArcRestingScreen({
  onBack,
  data,
}: {
  onBack: () => void;
  data: ArcAppDataSnapshot;
}) {
  return (
    <div className="space-y-4">
      <ArcScreenHeader title="Resting State" onBack={onBack} />

      <div className="rounded-[30px] border p-6" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'hero', { tint: foundationTheme.chart.baseline, tintStrength: 0.036 }), borderColor: hexToRgba('#FFFFFF', 0.076) }}>
        <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.chart.baseline }}>
          Baseline Progress
        </div>
        <div className="mt-3" style={{ ...getArcTypographyStyle(foundationTheme, 'displayHero'), color: foundationTheme.text.highlight, fontSize: '2rem' }}>
          Learning your resting-state range
        </div>
        <div className="mt-3" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.secondary }}>
          LIVE is already reading your signal. The system is now using those early readings to understand where your normal resting band sits and how much it naturally moves.
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[22px] border p-4" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.chart.baseline, tintStrength: 0.028 }), borderColor: hexToRgba('#FFFFFF', 0.068) }}>
            <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted }}>
              Current state
            </div>
            <div className="mt-2 capitalize" style={{ ...getArcTypographyStyle(foundationTheme, 'heroValue'), color: foundationTheme.text.primary }}>
              {data.dashboardMetrics.restingState.status}
            </div>
            <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
              {data.dashboardMetrics.restingState.trend}
            </div>
          </div>
          <div className="rounded-[22px] border p-4" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.028 }), borderColor: hexToRgba('#FFFFFF', 0.068) }}>
            <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted }}>
              Baseline status
            </div>
            <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'heroValue'), color: foundationTheme.accent.primary }}>
              {Math.round(data.calibration.progress * 100)}%
            </div>
            <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
              {data.calibration.progressLabel}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border p-5" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: foundationTheme.chart.baseline, tintStrength: 0.03 }), borderColor: hexToRgba('#FFFFFF', 0.072) }}>
        <div className="flex items-center justify-between">
          <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.text.muted }}>
            Early resting trend
          </div>
          <div style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted }}>
            Live signal only
          </div>
        </div>
        <TrendGraph data={data.sparklines.restingState} />
        <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
          This early view is directional only. Resting-state confidence improves as more signal history is collected.
        </div>
      </div>

      <div className="rounded-[28px] border p-5" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: foundationTheme.accent.primary, tintStrength: 0.026 }), borderColor: hexToRgba('#FFFFFF', 0.072) }}>
        <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.text.muted }}>
          What the system is learning
        </div>
        <div className="mt-4 space-y-3">
          {[
            'Where your resting-state signal typically holds',
            'How much natural drift is normal for you',
            'When fuller or reduced resting states begin to matter',
          ].map(item => (
            <div key={item} className="flex items-start gap-2">
              <div className="mt-1.5 h-1.5 w-1.5 rounded-full" style={{ background: hexToRgba(foundationTheme.chart.baseline, 0.9) }} />
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
