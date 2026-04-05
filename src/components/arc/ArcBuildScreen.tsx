import type { ArcAppDataSnapshot } from '../../data/arc-app-data';
import ArcScreenHeader from './ArcScreenHeader';
import { foundationTheme, getArcGlassSurfaceStyle, hexToRgba } from './arc-theme';

export default function ArcBuildScreen({
  onBack,
  data,
}: {
  onBack: () => void;
  data: ArcAppDataSnapshot;
}) {
  const d = data.dashboardMetrics.buildSpeed;

  if (!data.featureAvailability.buildInsights) {
    return (
      <div className="space-y-4">
        <ArcScreenHeader title="Build Speed" onBack={onBack} />
        <div className="rounded-[30px] border p-6" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'hero', { tint: foundationTheme.accent.primary, tintStrength: 0.034 }), borderColor: hexToRgba('#FFFFFF', 0.076) }}>
          <div style={{ color: foundationTheme.accent.primary }} className="mb-2 text-[10px] font-bold uppercase tracking-widest">
            Coming online
          </div>
          <div className="text-4xl font-black tracking-tighter">Build insight unlocks after your first session</div>
          <div className="mt-3 text-xs leading-relaxed" style={{ color: foundationTheme.text.secondary }}>
            The system needs an early captured session before it can estimate build behavior with confidence. This area opens up as soon as that first session is recorded.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ArcScreenHeader title="Build Speed" onBack={onBack} />

      <div className="relative overflow-hidden rounded-3xl border p-6" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'hero', { tint: foundationTheme.accent.primary, tintStrength: 0.034 }), borderColor: hexToRgba('#FFFFFF', 0.076) }}>
        <div className="absolute top-0 right-0 h-28 w-28 rounded-full opacity-10" style={{ background: `radial-gradient(circle, ${foundationTheme.accent.primary} 0%, transparent 70%)` }} />
        <div className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.accent.primary }}>Build Speed</div>
        <div className="text-5xl font-black tracking-tighter">{d.latest}</div>
        <div className="mt-1 text-xs" style={{ color: foundationTheme.text.muted }}>{d.indicator}</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border p-4" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.022 }), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
          <div className="mb-1 text-[9px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>7-Day Average</div>
          <div className="text-lg font-black">{data.highlights.buildSpeedSevenDayAverage}</div>
        </div>
        <div className="rounded-2xl border p-4" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.022 }), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
          <div className="mb-1 text-[9px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>30-Day Average</div>
          <div className="text-lg font-black">{d.average}</div>
        </div>
        <div className="rounded-2xl border p-4" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.signal.warning, tintStrength: 0.024 }), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
          <div className="mb-1 text-[9px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>Personal Best</div>
          <div className="text-lg font-black" style={{ color: foundationTheme.signal.warning }}>{data.highlights.buildSpeedPersonalBest}</div>
        </div>
        <div className="rounded-2xl border p-4" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.signal.up, tintStrength: 0.024 }), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
          <div className="mb-1 text-[9px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>Trend</div>
          <div className="text-lg font-black" style={{ color: foundationTheme.signal.up }}>{data.highlights.buildTrendLabel}</div>
        </div>
      </div>

      <div className="rounded-3xl border p-5" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: foundationTheme.accent.primary, tintStrength: 0.024 }), borderColor: hexToRgba('#FFFFFF', 0.072) }}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>Activation Profile</div>
        </div>
        <svg className="w-full h-24" viewBox="0 0 300 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="buildRiseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={foundationTheme.accent.primary} stopOpacity="0.3" />
              <stop offset="100%" stopColor={foundationTheme.accent.primary} stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="35" x2="300" y2="35" stroke={foundationTheme.chart.grid} strokeWidth="1" strokeDasharray="4 4" />
          <text x="255" y="30" fill={hexToRgba(foundationTheme.text.secondary, 0.35)} fontSize="7" fontFamily="sans-serif">avg</text>
          <path d="M0,95 Q30,90 60,80 Q90,60 120,35 Q150,15 180,8 Q210,5 240,5 Q270,5 300,5" fill="url(#buildRiseGrad)" />
          <path d="M0,95 Q30,90 60,80 Q90,60 120,35 Q150,15 180,8 Q210,5 240,5 Q270,5 300,5" stroke={foundationTheme.accent.primary} strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="120" cy="35" r="3" fill={foundationTheme.accent.primary} />
          <text x="128" y="38" fill={foundationTheme.accent.primary} fontSize="7" fontFamily="sans-serif">threshold</text>
        </svg>
      </div>
    </div>
  );
}
