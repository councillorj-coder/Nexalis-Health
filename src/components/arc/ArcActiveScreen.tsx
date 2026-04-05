import type { ArcAppDataSnapshot } from '../../data/arc-app-data';
import ArcScreenHeader from './ArcScreenHeader';
import { foundationTheme, getArcGlassSurfaceStyle, hexToRgba } from './arc-theme';

export default function ArcActiveScreen({
  onBack,
  data,
}: {
  onBack: () => void;
  data: ArcAppDataSnapshot;
}) {
  const d = data.dashboardMetrics;

  if (!data.featureAvailability.activeInsights) {
    return (
      <div className="space-y-4">
        <ArcScreenHeader title="Active State" onBack={onBack} />
        <div className="rounded-[30px] border p-6" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'hero', { tint: foundationTheme.accent.primary, tintStrength: 0.034 }), borderColor: hexToRgba('#FFFFFF', 0.076) }}>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.accent.primary }}>
            Coming online
          </div>
          <div className="text-4xl font-black tracking-tighter">Active-state modeling is waiting for first capture</div>
          <div className="mt-3 text-xs leading-relaxed" style={{ color: foundationTheme.text.secondary }}>
            On day one, the app keeps active-state interpretation quiet until it has real session data to learn from.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ArcScreenHeader title="Active State" onBack={onBack} />

      <div className="relative overflow-hidden rounded-3xl border p-6" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'hero', { tint: foundationTheme.accent.primary, tintStrength: 0.034 }), borderColor: hexToRgba('#FFFFFF', 0.076) }}>
        <div className="absolute top-0 right-0 h-28 w-28 rounded-full opacity-10" style={{ background: `radial-gradient(circle, ${foundationTheme.accent.primary} 0%, transparent 70%)` }} />
        <div className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.accent.primary }}>Activated State Status</div>
        <div className="text-4xl font-black tracking-tighter">{data.highlights.activeStateLabel}</div>
        <div className="mt-1 text-xs" style={{ color: foundationTheme.text.muted }}>{data.highlights.activeStateSummary}</div>
      </div>

      <div className="flex items-center gap-6 rounded-3xl border p-5" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: foundationTheme.accent.primary, tintStrength: 0.024 }), borderColor: hexToRgba('#FFFFFF', 0.072) }}>
        <svg width="80" height="80">
          <circle cx="40" cy="40" r="32" fill="none" stroke={foundationTheme.chart.grid} strokeWidth="6" />
          <circle
            cx="40"
            cy="40"
            r="32"
            fill="none"
            stroke={foundationTheme.accent.primary}
            strokeWidth="6"
            strokeDasharray={`${d.stability.score * 2.01} 201`}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
          />
          <text x="40" y="40" textAnchor="middle" dominantBaseline="central" fill={foundationTheme.text.highlight} fontSize="18" fontWeight="900" fontFamily="system-ui">{d.stability.score}</text>
        </svg>
        <div>
          <div className="mb-1 text-[9px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>Stability</div>
          <div className="text-sm font-bold">{d.stability.note}</div>
          <div className="mt-0.5 text-[10px]" style={{ color: foundationTheme.text.muted }}>Above personal average</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border p-4" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.022 }), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
          <div className="mb-1 text-[9px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>Duration</div>
          <div className="text-2xl font-black">{d.duration.latest}</div>
          <div className="mt-0.5 text-[9px]" style={{ color: foundationTheme.text.muted }}>avg {d.duration.average}</div>
        </div>
        <div className="rounded-2xl border p-4" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.022 }), borderColor: hexToRgba('#FFFFFF', 0.07) }}>
          <div className="mb-1 text-[9px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>Hold Variability</div>
          <div className="text-2xl font-black">{data.highlights.holdVariability}</div>
          <div className="mt-0.5 text-[9px]" style={{ color: foundationTheme.text.muted }}>Consistent plateau</div>
        </div>
      </div>

      <div className="rounded-3xl border p-5" style={{ ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: foundationTheme.accent.primary, tintStrength: 0.024 }), borderColor: hexToRgba('#FFFFFF', 0.072) }}>
        <div className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: foundationTheme.text.muted }}>Hold Consistency</div>
        <svg className="w-full h-20" viewBox="0 0 300 80" preserveAspectRatio="none">
          <defs>
            <linearGradient id="plateauGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={foundationTheme.accent.primary} stopOpacity="0.15" />
              <stop offset="100%" stopColor={foundationTheme.accent.primary} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,70 Q20,50 40,20 Q60,8 80,10 L120,8 L160,12 L200,9 L240,14 Q260,30 280,55 Q290,65 300,72" fill="url(#plateauGrad)" />
          <path d="M0,70 Q20,50 40,20 Q60,8 80,10 L120,8 L160,12 L200,9 L240,14 Q260,30 280,55 Q290,65 300,72" stroke={foundationTheme.accent.primary} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <rect x="60" y="4" width="182" height="3" rx="1.5" fill={hexToRgba(foundationTheme.accent.primary, 0.3)} />
          <text x="150" y="3" textAnchor="middle" fill={hexToRgba(foundationTheme.accent.primary, 0.6)} fontSize="6" fontFamily="sans-serif">{d.duration.latest} active</text>
        </svg>
      </div>
    </div>
  );
}
