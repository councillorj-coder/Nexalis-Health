import type { ArcAppDataSnapshot } from '../../data/arc-app-data';
import ArcScreenHeader from './ArcScreenHeader';
import { foundationTheme, getArcGlassSurfaceStyle, hexToRgba } from './arc-theme';

export default function ArcRecoveryScreen({
  onBack,
  data,
}: {
  onBack: () => void;
  data: ArcAppDataSnapshot;
}) {
  const d = data.dashboardMetrics;

  if (!data.featureAvailability.recoveryInsights) {
    return (
      <div className="space-y-4">
        <ArcScreenHeader title="Recovery" onBack={onBack} />
        <div className="rounded-[30px] border p-6" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'hero', { tint: foundationTheme.chart.waking, tintStrength: 0.034 }), borderColor: hexToRgba('#FFFFFF', 0.076) }}>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.chart.waking }}>
            Coming online
          </div>
          <div className="text-4xl font-black tracking-tighter">Recovery insight begins after early sessions</div>
          <div className="mt-3 text-xs leading-relaxed" style={{ color: foundationTheme.text.secondary }}>
            Recovery timing and rebound confidence depend on real capture history. This view unlocks once the system has early session data to compare.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ArcScreenHeader title="Recovery" onBack={onBack} />

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-1 rounded-3xl border p-5" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.chart.waking, tintStrength: 0.04 }), borderColor: hexToRgba(foundationTheme.chart.waking, 0.16) }}>
          <div className="mb-2 text-[9px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.chart.waking }}>Recovery Time</div>
          <div className="text-3xl font-black">{d.recovery.latest}</div>
          <div className="mt-1 text-[9px]" style={{ color: foundationTheme.text.muted }}>Best: {d.recovery.best}</div>
        </div>
        <div className="col-span-1 rounded-3xl border p-5" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.chart.nocturnal, tintStrength: 0.04 }), borderColor: hexToRgba(foundationTheme.chart.nocturnal, 0.16) }}>
          <div className="mb-2 text-[9px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.chart.nocturnal }}>Rebound Time</div>
          <div className="text-3xl font-black">{d.rebound.latest}</div>
          <div className="mt-1 text-[9px]" style={{ color: foundationTheme.text.muted }}>Full cycle</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border p-4" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.signal.up, tintStrength: 0.022 }), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
          <div className="mb-1 text-[9px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>Recovery Trend</div>
          <div className="text-sm font-black" style={{ color: foundationTheme.signal.up }}>{data.highlights.recoveryTrendLabel}</div>
        </div>
        <div className="rounded-2xl border p-4" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.signal.warning, tintStrength: 0.022 }), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
          <div className="mb-1 text-[9px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>Best Recovery</div>
          <div className="text-lg font-black" style={{ color: foundationTheme.signal.warning }}>{d.recovery.best}</div>
        </div>
        <div className="rounded-2xl border p-4" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.signal.warning, tintStrength: 0.022 }), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
          <div className="mb-1 text-[9px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>Best Rebound</div>
          <div className="text-lg font-black" style={{ color: foundationTheme.signal.warning }}>{data.highlights.bestRebound}</div>
        </div>
        <div className="rounded-2xl border p-4" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.022 }), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
          <div className="mb-1 text-[9px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>30-Day Avg</div>
          <div className="text-lg font-black">{data.highlights.recoveryThirtyDayAverage}</div>
        </div>
      </div>

      <div className="rounded-3xl border p-5" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: foundationTheme.chart.waking, tintStrength: 0.024 }), borderColor: hexToRgba('#FFFFFF', 0.072) }}>
        <div className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>Decline & Recovery Curve</div>
        <svg className="w-full h-24" viewBox="0 0 300 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="recovGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={foundationTheme.signal.down} stopOpacity="0.2" />
              <stop offset="50%" stopColor={foundationTheme.chart.waking} stopOpacity="0.2" />
              <stop offset="100%" stopColor={foundationTheme.signal.up} stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path d="M0,10 Q30,10 60,15 Q90,30 120,55 Q150,80 180,88 Q210,92 240,85 Q270,60 300,50" fill="url(#recovGrad)" />
          <path d="M0,10 Q30,10 60,15 Q90,30 120,55 Q150,80 180,88 Q210,92 240,85 Q270,60 300,50" stroke={hexToRgba(foundationTheme.chart.waking, 0.7)} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <line x1="0" y1="88" x2="300" y2="88" stroke={foundationTheme.chart.grid} strokeWidth="1" strokeDasharray="4 4" />
          <text x="4" y="7" fill={hexToRgba(foundationTheme.signal.down, 0.5)} fontSize="6" fontFamily="sans-serif">peak</text>
          <text x="170" y="97" fill={hexToRgba(foundationTheme.text.secondary, 0.35)} fontSize="6" fontFamily="sans-serif">baseline</text>
          <text x="260" y="45" fill={hexToRgba(foundationTheme.signal.up, 0.5)} fontSize="6" fontFamily="sans-serif">rebound</text>
        </svg>
      </div>
    </div>
  );
}
