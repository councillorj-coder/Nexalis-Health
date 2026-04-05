import { useMemo, useState, type ReactNode } from 'react';
import ArcScreenHeader from './ArcScreenHeader';
import {
  ArcToolBoxLauncher,
  ArcToolBoxOverlay,
  ArcToolSlotRack,
  getArcSlottedToolsForPlacement,
  type ArcToolAssignments,
  type ArcToolChartProps,
  type ArcToolPlacement,
} from './ArcToolBox';

function InsightsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[620px] flex-col">
      <div className="w-full pt-4">
        {children}
      </div>
      <div className="flex-1" />
    </div>
  );
}

type ArcInsightsScreenProps = {
  onBack: () => void;
  toolAssignments: ArcToolAssignments;
  onSetToolPlacement: (toolId: string, placement: ArcToolPlacement) => void;
} & ArcToolChartProps;

export default function ArcInsightsScreen({
  onBack,
  toolAssignments,
  onSetToolPlacement,
  ...chartProps
}: ArcInsightsScreenProps) {
  const [toolBoxOpen, setToolBoxOpen] = useState(false);
  const insightsSlots = useMemo(
    () => getArcSlottedToolsForPlacement(toolAssignments, 'insights'),
    [toolAssignments],
  );
  const activeCount = insightsSlots.filter(Boolean).length;

  return (
    <div className="space-y-2">
      <ArcScreenHeader title="Insights" onBack={onBack} />
      <InsightsLayout>
        <div className="relative">
          <div className="sticky top-0 z-30 pb-3">
            <ArcToolBoxLauncher
              open={toolBoxOpen}
              activeCount={activeCount}
              onToggle={() => setToolBoxOpen(current => !current)}
            />
          </div>

          <ArcToolBoxOverlay
            open={toolBoxOpen}
            toolAssignments={toolAssignments}
            onSetToolPlacement={onSetToolPlacement}
            onClose={() => setToolBoxOpen(false)}
          />

          <div className="mt-1">
            <ArcToolSlotRack
              slots={insightsSlots}
              chartProps={chartProps}
            />
          </div>
        </div>
      </InsightsLayout>
    </div>
  );
}
