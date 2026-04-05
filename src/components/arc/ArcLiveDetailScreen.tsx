import { useEffect, useState } from 'react';
import ArcScreenHeader from './ArcScreenHeader';
import { type ArcAmoraGuidanceLevel } from './ArcAmora';
import { ArcLiveExpansionDetail, type ArcLiveSignalSnapshot } from './ArcExpansionInsights';
import type { Session } from '../../data/arc-types';
import type { ArcAppDataSnapshot } from '../../data/arc-app-data';
import { foundationTheme, getArcTypographyStyle, hexToRgba } from './arc-theme';

const LIVE_STATUS_LINES = [
  'Learning your baseline ranges',
  'Learning your peaks and trends',
  'Refining your live estimate',
  'Building your signal profile',
  'Calibrating your resting state',
  'Reading your active range',
  'Learning your response pattern',
];

export default function ArcLiveDetailScreen({
  onBack,
  liveSignal,
  onOpenSessionDetails,
  onSessionCaptured,
  data,
  onSimulationStateChange,
  amoraEnabled = true,
  proactiveInsightsEnabled = true,
  amoraGuidanceLevel = 'standard',
  onOpenAmora,
}: {
  onBack: () => void;
  liveSignal: ArcLiveSignalSnapshot;
  onOpenSessionDetails: (session: Session) => void;
  onSessionCaptured?: (session: Session) => void;
  data: ArcAppDataSnapshot;
  onSimulationStateChange?: (isSimulating: boolean) => void;
  amoraEnabled?: boolean;
  proactiveInsightsEnabled?: boolean;
  amoraGuidanceLevel?: ArcAmoraGuidanceLevel;
  onOpenAmora?: () => void;
}) {
  const [statusIndex, setStatusIndex] = useState(0);
  const [statusVisible, setStatusVisible] = useState(true);
  const [dotPhase, setDotPhase] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStatusVisible(false);
      window.setTimeout(() => {
        setStatusIndex(current => (current + 1) % LIVE_STATUS_LINES.length);
        setStatusVisible(true);
      }, 420);
    }, 7600);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setDotPhase(current => (current + 1) % 3);
    }, 420);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="-mx-5 flex h-full min-h-full flex-col">
      <div className="px-5">
        <ArcScreenHeader
          title="LIVE"
          onBack={onBack}
          trailing={
            <div className="max-w-[204px] text-right">
              <div className="flex items-center justify-end gap-1.5">
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map(index => {
                    const isActive = dotPhase === index;

                    return (
                      <span
                        key={index}
                        className="inline-flex h-[4px] w-[4px] rounded-full"
                        style={{
                          background: foundationTheme.accent.primary,
                          opacity: isActive ? 0.7 : 0.2,
                          transform: isActive ? 'scale(1)' : 'scale(0.88)',
                          boxShadow: isActive ? `0 0 5px ${hexToRgba(foundationTheme.accent.primary, 0.12)}` : 'none',
                          transition: 'opacity 220ms ease, transform 220ms ease, box-shadow 220ms ease',
                        }}
                      />
                    );
                  })}
                </div>
                <span
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'caption'),
                    color: foundationTheme.text.secondary,
                    fontSize: '0.68rem',
                    lineHeight: 1.28,
                    opacity: statusVisible ? 0.98 : 0.18,
                    transform: statusVisible ? 'translateY(0px)' : 'translateY(3px)',
                    transition: 'opacity 420ms ease, transform 420ms ease',
                    display: 'inline-block',
                  }}
                >
                  {LIVE_STATUS_LINES[statusIndex]}
                </span>
              </div>
            </div>
          }
        />
      </div>

      <div className="flex-1 min-h-[620px] pt-1">
        <ArcLiveExpansionDetail
          liveSignal={liveSignal}
          onOpenSessionDetails={onOpenSessionDetails}
          onSessionCaptured={onSessionCaptured}
          thresholdModel={data.thresholdModel}
          onSimulationStateChange={onSimulationStateChange}
          showInternalSimulateButton={false}
          amoraEnabled={amoraEnabled}
          proactiveInsightsEnabled={proactiveInsightsEnabled}
          amoraGuidanceLevel={amoraGuidanceLevel}
          onOpenLiveAmora={onOpenAmora}
          fullScreen
        />
      </div>
    </div>
  );
}
