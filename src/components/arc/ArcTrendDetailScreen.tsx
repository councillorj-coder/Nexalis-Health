import type { ArcLiveTelemetry, ArcThresholdModel } from '../../data/arc-app-data';
import { InlineAmoraInsight, type ArcAmoraGuidanceLevel } from './ArcAmora';
import ArcScreenHeader from './ArcScreenHeader';
import {
  ArcTrendExpansionDetail,
  type ArcTrendHistoryPoint,
  type ArcTrendViewMode,
} from './ArcExpansionInsights';

export default function ArcTrendDetailScreen({
  onBack,
  liveTelemetry,
  trendHistory,
  trendMode = 'accumulated',
  thresholdModel,
  amoraEnabled = true,
  proactiveInsightsEnabled = true,
  amoraGuidanceLevel = 'standard',
  onOpenAmora,
}: {
  onBack: () => void;
  liveTelemetry?: ArcLiveTelemetry | null;
  trendHistory?: ArcTrendHistoryPoint[];
  trendMode?: ArcTrendViewMode;
  thresholdModel?: ArcThresholdModel;
  amoraEnabled?: boolean;
  proactiveInsightsEnabled?: boolean;
  amoraGuidanceLevel?: ArcAmoraGuidanceLevel;
  onOpenAmora?: () => void;
}) {
  const hasMeaningfulHistory = (trendHistory?.length ?? 0) >= 12;
  const showAmoraInsight =
    amoraEnabled &&
    proactiveInsightsEnabled &&
    amoraGuidanceLevel !== 'minimal' &&
    !!onOpenAmora;
  const trendMessage = hasMeaningfulHistory
    ? 'Recent performance is becoming more repeatable, with less variation between sessions.'
    : 'Trend memory is still forming from your live signal.';

  return (
    <div className="-mx-5 flex h-full min-h-full flex-col">
      <div className="px-5">
        <ArcScreenHeader title="TREND VIEW" onBack={onBack} />
        {showAmoraInsight ? (
          <div className="mt-3">
            <InlineAmoraInsight
              variant="pattern"
              density="compact"
              message={trendMessage}
              ctaLabel="See pattern"
              onTap={onOpenAmora}
            />
          </div>
        ) : null}
      </div>

      <div className="flex-1 min-h-[620px] pt-1">
        <ArcTrendExpansionDetail
          liveTelemetry={liveTelemetry}
          trendHistory={trendHistory}
          trendMode={trendMode}
          thresholdModel={thresholdModel}
        />
      </div>
    </div>
  );
}
