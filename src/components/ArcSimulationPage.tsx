import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { Session } from '../data/arc-types';
import {
  buildArcAppData,
  type ArcAppDataSnapshot,
  type ArcLiveTelemetry,
  type ArcUserProfileOverride,
} from '../data/arc-app-data';
import {
  DEFAULT_EDGE_CARD_SHAPE_POINTS,
  buildCardShapeClipPath,
  insertCardShapePointAfter,
  parseCardShapePoints,
  serializeCardShapePoints,
} from '../data/arc-card-shape';
import {
  DEFAULT_EDGE_CARD_LAYOUT,
  parseEdgeCardLayout,
  serializeEdgeCardLayout,
  type ArcEdgeCardLayout,
} from '../data/arc-card-layout';
import { resolveArcBatteryState } from '../data/arc-battery-source';
import {
  createFoundationAccomplishmentPulse,
  createFoundationGuidancePulse,
  createFoundationInsightPulse,
} from '../data/pulseCopy';
import { buildFoundationChecklistRuntimeFromSnapshot } from '../data/foundationChecklistEvaluator';
import { buildFoundationGoalState } from '../data/foundationGoalState';
import { createFoundationHiddenMilestonePulse } from '../data/foundationHiddenMilestonePulseMap';
import type { PulseItem, PulsePriority } from '../data/pulseTypes';
import ArcLaunchScreen from './arc/ArcLaunchScreen';
import ArcHomeScreen from './arc/ArcHomeScreen';
import ArcInsigniaPanel from './arc/ArcInsigniaPanel';
import ArcInsigniaInventoryScreen from './arc/ArcInsigniaInventoryScreen';
import ArcIdentityPanel from './arc/ArcIdentityPanel';
import ArcAccountStatusPanel from './arc/ArcAccountStatusPanel';
import ArcAccountStatusScreen from './arc/ArcAccountStatusScreen';
import ArcCurrentGoalScreen from './arc/ArcCurrentGoalScreen';
import ArcGoalPanel from './arc/ArcGoalPanel';
import ArcMomentumPanel from './arc/ArcMomentumPanel';
import ArcBatteryPanel from './arc/ArcBatteryPanel';
import ArcPulsePanel from './arc/ArcPulsePanel';
import ArcEdgeScorePanel from './arc/ArcEdgeScorePanel';
import ArcSyncPanel from './arc/ArcSyncPanel';
import ArcConnectionPanel from './arc/ArcConnectionPanel';
import ArcSessionFeed from './arc/ArcSessionFeed';
import ArcSessionDetail from './arc/ArcSessionDetail';
import ArcRestingScreen from './arc/ArcRestingScreen';
import ArcBuildScreen from './arc/ArcBuildScreen';
import ArcActiveScreen from './arc/ArcActiveScreen';
import ArcRecoveryScreen from './arc/ArcRecoveryScreen';
import ArcMotionScreen from './arc/ArcMotionScreen';
import ArcNocturnalScreen from './arc/ArcNocturnalScreen';
import ArcInsightsScreen from './arc/ArcInsightsScreen';
import ArcLifetimeScreen from './arc/ArcLifetimeScreen';
import ArcMilestonesScreen from './arc/ArcMilestonesScreen';
import ArcBatteryDetailScreen from './arc/ArcBatteryDetailScreen';
import ArcPulseMailboxScreen from './arc/ArcPulseMailboxScreen';
import ArcEdgeScoreDetails from './arc/ArcEdgeScoreDetails';
import ArcLiveDetailScreen from './arc/ArcLiveDetailScreen';
import ArcTrendDetailScreen from './arc/ArcTrendDetailScreen';
import ArcOnboardingFlow, { type ArcOnboardingProfile } from './arc/ArcOnboardingFlow';
import PulseHost from './arc/PulseHost';
import {
  ArcAmoraAccessButton,
  ArcAmoraIntroCard,
  ArcAmoraSheet,
  ArcAmoraIconIntro,
  ArcAmoraTourOverlay,
  resolveAmoraContent,
  type ArcAmoraTourAnchorRect,
  type ArcAmoraTourStep,
  type ArcAmoraSettings,
  type ArcAmoraTopicId,
} from './arc/ArcAmora';
import {
  DEFAULT_AMORA_GUIDANCE_STATE,
  getOnboardingGuidanceNote,
  getProactiveGuidanceTopic,
  markGuidanceShown,
  maybeComposeGuidanceMessage,
  type ArcAmoraGuidanceNote,
} from './arc/amoraGuidanceLayer';
import ArcAtmosphere from './arc/ArcAtmosphere';
import {
  ArcSimulationClockProvider,
  useArcSimulationClock,
  useArcSimulationClockSource,
} from './arc/ArcSimulationClock';
import NexalisLogo from './NexalisLogo';
import {
  buildAutonomousSignalPoint,
  collectAutonomousDaytimeEventsBetween,
  collectAutonomousNocturnalEventsBetween,
  createAutonomousDaytimeSession,
  createAutonomousNocturnalSession,
  createCompletedSession,
  getArcPerformancePresets,
  useArcLiveTelemetry,
  useArcSharedLiveSignal,
  type ArcPerformancePresetId,
  type ArcAutonomousDaytimeEventSummary,
  type ArcAutonomousNocturnalEventSummary,
  type ArcLiveSignalSnapshot,
  type ArcTrendHistoryPoint,
  type ArcTrendViewMode,
} from './arc/ArcExpansionInsights';
import { MAX_TOOL_SLOTS, type ArcToolAssignments, type ArcToolPlacement } from './arc/ArcToolBox';
import { foundationTheme, getArcTypographyStyle, hexToRgba, type ArcAtmosphereVariantName } from './arc/arc-theme';
import { PulseProvider, usePulseController } from './arc/pulseManager';

type ArcTabId = 'home' | 'sessions' | 'insights' | 'profile';
type ArcPanel = 'insignia' | 'identity' | 'accountStatus' | 'goal' | 'momentum' | 'edgeScore' | 'sync' | 'connection' | 'battery' | 'pulse';
type ArcScreen =
  | 'home'
  | 'battery'
  | 'sessions'
  | 'insights'
  | 'pulse-mailbox'
  | 'account-status'
  | 'current-goal'
  | 'insignia-inventory'
  | 'edgescore-details'
  | 'live-detail'
  | 'trend-detail'
  | 'resting'
  | 'build'
  | 'active'
  | 'recovery'
  | 'motion'
  | 'nocturnal'
  | 'lifetime'
  | 'milestones'
  | `session-detail:${string}`;

const PROFILE_STAGES = ['Foundation', 'Signal', 'Form', 'Prime', 'Vector', 'Apex', 'Sovereign', 'Obsidian'] as const;

function getProfileStage(_progress: number) {
  return PROFILE_STAGES[0];
}

const tabs: Array<{ id: ArcTabId; label: string; icon: (active: boolean) => JSX.Element }> = [
  {
    id: 'home',
    label: 'Home',
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    id: 'sessions',
    label: 'Sessions',
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
];

const tabToScreen: Record<ArcTabId, ArcScreen> = {
  home: 'home',
  sessions: 'sessions',
  insights: 'insights',
  profile: 'milestones',
};

function getActiveTab(screen: ArcScreen): ArcTabId {
  if (screen === 'home' || screen === 'battery' || screen === 'pulse-mailbox' || screen === 'account-status' || screen === 'current-goal') return 'home';
  if (screen === 'sessions' || screen.startsWith('session-detail:')) return 'sessions';
  if (screen === 'lifetime') return 'profile';
  if (screen === 'milestones') return 'profile';
  return 'insights';
}

function getAtmosphereVariant(screen: ArcScreen): ArcAtmosphereVariantName {
  if (screen === 'home' || screen === 'battery' || screen === 'pulse-mailbox') return 'home';
  if (screen === 'live-detail' || screen === 'trend-detail') return 'live';
  return 'detail';
}

const PHONE_EDGE_ROSE_GOLD = '#B88A7A';
const FOUNDATION_MOTION_LOOP_URL = '/foundation-motion-loop.mp4';
const FOUNDATION_MOTION_LOOP_HANDOFF_SECONDS = 0.82;
const FOUNDATION_MOTION_LOOP_HANDOFF_MS = 760;
const FOUNDATION_MOTION_LOOP_VIDEO_BASE_OPACITY = 0.92;
const ARC_TOOL_ASSIGNMENTS_STORAGE_KEY = 'cinder.arcToolAssignments';
const EDGE_CARD_SHAPE_STORAGE_KEY = 'nexalis.edgeCardShape';
const EDGE_CARD_GLASS_OPACITY_STORAGE_KEY = 'nexalis.edgeCardGlassOpacity';
const EDGE_CARD_GLASS_BLUR_STORAGE_KEY = 'nexalis.edgeCardGlassBlur';
const EDGE_CARD_GLASS_TINT_STORAGE_KEY = 'nexalis.edgeCardGlassTint';
const EDGE_CARD_LAYOUT_STORAGE_KEY = 'nexalis.edgeCardLayout';
const TREND_HISTORY_SAMPLE_MINUTES = 10;
const MAX_TREND_HISTORY_POINTS = 5000;
const SIMULATED_DAY_MINUTES = 24 * 60;
const SIMULATED_MONTH_MINUTES = 30 * 24 * 60;
const SIMULATION_TIMESCALE_STORAGE_KEY = 'nexalis.simulationTimescale';
const SESSION_RETENTION_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const AMORA_WELCOME_INTRO_STORAGE_KEY = 'nexalis.amoraWelcomeIntroSeen';
const AMORA_ICON_INTRO_STORAGE_KEY = 'nexalis.amoraIconIntroSeen';
const AMORA_UNLOCK_REVEAL_STORAGE_KEY = 'nexalis.amoraUnlockRevealSeen';
type ArcHubConnectionState = 'idle' | 'connecting' | 'connected';
type ArcHubLinkedDevice = 'arc' | null;
type ArcDeviceBacklogPreset = '30m' | '4h' | '1d';
type ArcDeviceSyncState = 'up_to_date' | 'pending' | 'importing' | 'reconciled';
type ArcSimulationPanelFolderId = 'profile' | 'continuity' | 'timescale' | 'sync' | 'actions' | 'pulse' | 'shape';
type ArcSimulationTimescalePreset = number;
type ArcEdgeEditorTab = 'shape' | 'glass' | 'move';

const DEVICE_BACKLOG_PRESET_MINUTES: Record<ArcDeviceBacklogPreset, number> = {
  '30m': 30,
  '4h': 4 * 60,
  '1d': 24 * 60,
};
const REAL_TIME_SIMULATION_TIMESCALE = 1 / 300;
const SIMULATION_TIMESCALE_PRESETS: Array<{
  value: ArcSimulationTimescalePreset;
  label: string;
  description: string;
}> = [
  { value: REAL_TIME_SIMULATION_TIMESCALE, label: 'Real', description: '1 simulated minute every 60 real seconds.' },
  { value: 0.5, label: '0.5x', description: 'Slower drift' },
  { value: 1, label: '1x', description: 'Default pace' },
  { value: 2, label: '2x', description: 'Faster build' },
  { value: 4, label: '4x', description: 'Rapid review' },
  { value: 8, label: '8x', description: 'Fastest sweep' },
];
const DEVICE_MEMORY_CAPACITY_MINUTES = 72 * 60;
const SYNC_IMPORT_STEPS = 3;
const SYNC_IMPORT_STEP_MS = 220;
const SYNC_RECONCILED_VISIBLE_MS = 2600;

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatSimulationRateLabel(minutesPerSecond: number) {
  if (!Number.isFinite(minutesPerSecond) || minutesPerSecond <= 0) {
    return 'Paused';
  }

  if (minutesPerSecond < 0.1) {
    const secondsPerSimulatedMinute = Math.max(1, Math.round(1 / minutesPerSecond));
    return `1m / ${secondsPerSimulatedMinute} sec`;
  }

  const formatted = Number.isInteger(minutesPerSecond) ? minutesPerSecond.toFixed(0) : minutesPerSecond.toFixed(1);
  return `${formatted}m / sec`;
}

function ArcFoundationMotionBackground() {
  const videoRefs = [useRef<HTMLVideoElement | null>(null), useRef<HTMLVideoElement | null>(null)] as const;
  const animationFrameRef = useRef<number | null>(null);
  const handoffTimerRef = useRef<number | null>(null);
  const activeLayerRef = useRef<0 | 1>(0);
  const visibleLayerRef = useRef<0 | 1>(0);
  const transitioningRef = useRef(false);
  const [visibleLayer, setVisibleLayer] = useState<0 | 1>(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const primaryVideo = videoRefs[0].current;
    const secondaryVideo = videoRefs[1].current;
    if (!primaryVideo || !secondaryVideo) {
      return;
    }

    const videos = [primaryVideo, secondaryVideo] as const;

    const clearHandoffTimer = () => {
      if (handoffTimerRef.current != null) {
        window.clearTimeout(handoffTimerRef.current);
        handoffTimerRef.current = null;
      }
    };

    const resetVideo = (video: HTMLVideoElement, startAt = 0, shouldPause = false) => {
      try {
        video.currentTime = startAt;
      } catch {
        // Ignore seek timing issues while metadata is still resolving.
      }

      if (shouldPause) {
        video.pause();
      }
    };

    const playVideo = () => {
      const activeVideo = videos[visibleLayerRef.current];
      if (!activeVideo) {
        return;
      }
      const playAttempt = activeVideo.play();
      if (playAttempt && typeof playAttempt.catch === 'function') {
        playAttempt.catch(() => {});
      }
    };

    const playSpecificVideo = (video: HTMLVideoElement, startAt?: number) => {
      if (typeof startAt === 'number') {
        resetVideo(video, startAt);
      }
      const playAttempt = video.play();
      if (playAttempt && typeof playAttempt.catch === 'function') {
        playAttempt.catch(() => {});
      }
    };

    const settleOnLayer = (layer: 0 | 1) => {
      activeLayerRef.current = layer;
      visibleLayerRef.current = layer;
      transitioningRef.current = false;
      setVisibleLayer(layer);
      setIsTransitioning(false);
    };

    const startHandoff = () => {
      if (transitioningRef.current) {
        return;
      }

      const activeIndex = activeLayerRef.current;
      const nextIndex = (1 - activeIndex) as 0 | 1;
      const activeVideo = videos[activeIndex];
      const nextVideo = videos[nextIndex];

      transitioningRef.current = true;
      visibleLayerRef.current = nextIndex;
      setVisibleLayer(nextIndex);
      setIsTransitioning(true);
      playSpecificVideo(nextVideo, 0);

      clearHandoffTimer();
      handoffTimerRef.current = window.setTimeout(() => {
        activeVideo.pause();
        resetVideo(activeVideo, 0, true);
        settleOnLayer(nextIndex);
        playSpecificVideo(nextVideo);
      }, FOUNDATION_MOTION_LOOP_HANDOFF_MS);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        videos[0].pause();
        videos[1].pause();
        return;
      }

      if (transitioningRef.current) {
        clearHandoffTimer();
        const oldActiveVideo = videos[activeLayerRef.current];
        const resumedVideo = videos[visibleLayerRef.current];
        oldActiveVideo.pause();
        resetVideo(oldActiveVideo, 0, true);
        settleOnLayer(visibleLayerRef.current);
        playSpecificVideo(resumedVideo, resumedVideo.currentTime || 0);
        return;
      }

      playVideo();
    };

    const tick = () => {
      const activeVideo = videos[activeLayerRef.current];
      if (
        !document.hidden &&
        !transitioningRef.current &&
        Number.isFinite(activeVideo.duration) &&
        activeVideo.duration > FOUNDATION_MOTION_LOOP_HANDOFF_SECONDS
      ) {
        const remainingSeconds = activeVideo.duration - activeVideo.currentTime;
        if (remainingSeconds <= FOUNDATION_MOTION_LOOP_HANDOFF_SECONDS) {
          startHandoff();
        }
      }

      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    settleOnLayer(0);
    resetVideo(primaryVideo, 0, true);
    resetVideo(secondaryVideo, 0, true);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    primaryVideo.addEventListener('loadedmetadata', playVideo);
    primaryVideo.addEventListener('canplay', playVideo);
    playSpecificVideo(primaryVideo, 0);
    animationFrameRef.current = window.requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      primaryVideo.removeEventListener('loadedmetadata', playVideo);
      primaryVideo.removeEventListener('canplay', playVideo);
      if (animationFrameRef.current != null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      clearHandoffTimer();
      primaryVideo.pause();
      secondaryVideo.pause();
    };
  }, []);

  return (
    <>
      {videoRefs.map((videoRef, index) => (
        <video
          key={index}
          ref={videoRef}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          src={FOUNDATION_MOTION_LOOP_URL}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          disablePictureInPicture
          style={{
            opacity: visibleLayer === index ? FOUNDATION_MOTION_LOOP_VIDEO_BASE_OPACITY : 0,
            filter: 'brightness(0.82)',
            transform: 'scale(1.01)',
            transition: `opacity ${FOUNDATION_MOTION_LOOP_HANDOFF_MS}ms ease-in-out`,
            willChange: 'opacity',
          }}
        />
      ))}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          background: `
            linear-gradient(180deg,
              ${hexToRgba('#020408', 0.18)} 0%,
              ${hexToRgba('#020408', 0.08)} 24%,
              ${hexToRgba('#020408', 0.08)} 76%,
              ${hexToRgba('#020408', 0.16)} 100%)
          `,
          opacity: isTransitioning ? 1 : 0,
          transition: `opacity ${FOUNDATION_MOTION_LOOP_HANDOFF_MS}ms ease-in-out`,
        }}
      />
    </>
  );
}

function formatRelativeSyncAgeLabel(minutes: number | null) {
  if (minutes == null || !Number.isFinite(minutes)) {
    return 'Not yet synced';
  }

  if (minutes <= 0) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (minutes < 24 * 60) {
    const hours = Math.max(1, Math.round(minutes / 60));
    return `${hours}h ago`;
  }

  const days = Math.max(1, Math.round(minutes / (24 * 60)));
  return `${days}d ago`;
}

function formatBufferedCaptureLabel(minutes: number) {
  if (minutes <= 0) {
    return 'None';
  }

  if (minutes < 60) {
    return `${minutes}m captured`;
  }

  if (minutes < 24 * 60) {
    const hours = minutes / 60;
    return `${Number.isInteger(hours) ? hours.toFixed(0) : hours.toFixed(1)}h captured`;
  }

  const days = minutes / (24 * 60);
  return `${Number.isInteger(days) ? days.toFixed(0) : days.toFixed(1)}d captured`;
}

function ArcSimulationPanelFolder({
  label,
  summary,
  open,
  onToggle,
  children,
}: {
  label: string;
  summary: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section
      className="overflow-hidden rounded-[14px] border"
      style={{
        background: hexToRgba(foundationTheme.text.inverse, 0.1),
        borderColor: hexToRgba('#FFFFFF', 0.06),
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-2.5 py-2 text-left transition-all duration-200"
      >
        <div className="min-w-0">
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'sectionTitle'),
              color: foundationTheme.text.secondary,
              fontSize: '0.54rem',
              letterSpacing: '0.11em',
            }}
          >
            {label}
          </div>
          <div className="mt-0.5 truncate" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted }}>
            {summary}
          </div>
        </div>
        <div
          className="shrink-0"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
            color: foundationTheme.text.muted,
          }}
        >
          {open ? '-' : '+'}
        </div>
      </button>
      {open ? (
        <div
          className="px-2.5 pb-2.5 pt-2"
          style={{ borderTop: `1px solid ${hexToRgba('#FFFFFF', 0.05)}` }}
        >
          {children}
        </div>
      ) : null}
    </section>
  );
}

function ArcSimulationPanelLineItem({
  label,
  detail,
  value,
  onClick,
  active = false,
  disabled = false,
  tone = 'neutral',
}: {
  label: string;
  detail?: string;
  value?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  tone?: 'neutral' | 'accent' | 'baseline' | 'critical';
}) {
  const toneColor =
    tone === 'critical'
      ? foundationTheme.signal.down
      : tone === 'accent'
        ? foundationTheme.text.highlight
        : tone === 'baseline'
          ? foundationTheme.chart.baseline
          : foundationTheme.text.secondary;
  const activeBackground =
    tone === 'critical'
      ? hexToRgba(foundationTheme.signal.down, 0.1)
      : tone === 'accent'
        ? hexToRgba(foundationTheme.accent.primary, 0.1)
        : tone === 'baseline'
          ? hexToRgba(foundationTheme.chart.baseline, 0.1)
          : hexToRgba('#FFFFFF', 0.035);

  const content = (
    <>
      <div className="min-w-0">
        <div
          style={{
            ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
            color: disabled ? foundationTheme.text.muted : active ? toneColor : foundationTheme.text.secondary,
            lineHeight: 1.14,
          }}
        >
          {label}
        </div>
        {detail ? (
          <div
            className="mt-[2px]"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'caption'),
              color: foundationTheme.text.muted,
              lineHeight: 1.2,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {detail}
          </div>
        ) : null}
      </div>
      {value ? (
        <div
          className="shrink-0 self-center pl-2 text-right"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
            color: disabled ? foundationTheme.text.muted : active ? toneColor : foundationTheme.text.muted,
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>
      ) : null}
    </>
  );

  const sharedStyle: CSSProperties = {
    background: active ? activeBackground : hexToRgba('#FFFFFF', 0.02),
    borderColor: active ? hexToRgba(toneColor, 0.16) : hexToRgba('#FFFFFF', 0.04),
  };

  if (!onClick) {
    return (
      <div
        className="flex w-full items-start justify-between gap-3 rounded-[12px] border px-2.5 py-2.5"
        style={sharedStyle}
      >
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-start justify-between gap-3 rounded-[12px] border px-2.5 py-2.5 text-left transition-all duration-200 active:scale-[0.99] disabled:cursor-default"
      style={sharedStyle}
    >
      {content}
    </button>
  );
}

function ArcSimulationPanelChoiceButton({
  active,
  label,
  description,
  onClick,
  shape = 'tile',
}: {
  active: boolean;
  label: string;
  description?: string;
  onClick: () => void;
  shape?: 'tile' | 'segment';
}) {
  const isSegment = shape === 'segment';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`border text-left transition-all duration-300 active:scale-[0.99] ${isSegment ? 'rounded-full px-3 py-2.5 text-center' : 'rounded-[18px] px-3 py-2.5'}`}
      style={{
        background: active ? hexToRgba(foundationTheme.accent.primary, 0.16) : hexToRgba('#FFFFFF', 0.035),
        borderColor: active ? hexToRgba(foundationTheme.accent.primary, 0.22) : hexToRgba('#FFFFFF', 0.08),
      }}
      aria-pressed={active}
    >
      <div
        style={{
          ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
          color: active ? foundationTheme.text.highlight : foundationTheme.text.secondary,
        }}
      >
        {label}
      </div>
      {!isSegment && description ? (
        <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted, lineHeight: 1.22 }}>
          {description}
        </div>
      ) : null}
    </button>
  );
}

function ArcSimulationPanelActionButton({
  label,
  onClick,
  disabled = false,
  tone = 'neutral',
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: 'neutral' | 'accent' | 'baseline' | 'critical';
}) {
  const toneStyles =
    tone === 'critical'
      ? {
          background: hexToRgba(foundationTheme.signal.down, disabled ? 0.08 : 0.16),
          borderColor: hexToRgba(foundationTheme.signal.down, disabled ? 0.12 : 0.24),
          color: disabled ? foundationTheme.text.muted : foundationTheme.signal.down,
        }
      : tone === 'accent'
        ? {
            background: hexToRgba(foundationTheme.accent.primary, disabled ? 0.08 : 0.16),
            borderColor: hexToRgba(foundationTheme.accent.primary, disabled ? 0.12 : 0.22),
            color: disabled ? foundationTheme.text.muted : foundationTheme.text.highlight,
          }
        : tone === 'baseline'
          ? {
              background: hexToRgba(foundationTheme.chart.baseline, disabled ? 0.08 : 0.15),
              borderColor: hexToRgba(foundationTheme.chart.baseline, disabled ? 0.12 : 0.22),
              color: disabled ? foundationTheme.text.muted : foundationTheme.chart.baseline,
            }
          : {
              background: hexToRgba('#FFFFFF', disabled ? 0.035 : 0.06),
              borderColor: hexToRgba('#FFFFFF', disabled ? 0.06 : 0.08),
              color: disabled ? foundationTheme.text.muted : foundationTheme.text.primary,
            };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-[18px] border px-3.5 py-3 text-left transition-all duration-300 active:scale-[0.99] disabled:cursor-default"
      style={{
        ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
        ...toneStyles,
      }}
    >
      {label}
    </button>
  );
}

function extendTrendHistoryForElapsedWindow({
  existingHistory,
  startDate,
  endDate,
  currentValue,
  autonomousDaytimeEnabled = true,
  performancePreset = 'average',
}: {
  existingHistory: ArcTrendHistoryPoint[];
  startDate: Date;
  endDate: Date;
  currentValue: number;
  autonomousDaytimeEnabled?: boolean;
  performancePreset?: ArcPerformancePresetId;
}) {
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();
  const sampleMs = TREND_HISTORY_SAMPLE_MINUTES * 60_000;
  const tailBlendWindowMs = 6 * 60 * 60 * 1000;
  const nextHistory = existingHistory.filter(point => point.timestamp < startMs);

  for (let timestamp = startMs + sampleMs; timestamp < endMs; timestamp += sampleMs) {
    const tailProgress = clampNumber((timestamp - (endMs - tailBlendWindowMs)) / tailBlendWindowMs, 0, 1);
    const simulatedPoint = buildAutonomousSignalPoint(timestamp, { autonomousDaytimeEnabled, performancePreset });
    const blendedValue = simulatedPoint.value * (1 - tailProgress * 0.42) + currentValue * (tailProgress * 0.42);

    nextHistory.push({
      timestamp,
      value: Number(clampNumber(blendedValue, 0, 110).toFixed(1)),
      linePhase: simulatedPoint.linePhase,
    });
  }

  return nextHistory.slice(-MAX_TREND_HISTORY_POINTS);
}

function mergeTrendHistoryWindow(
  existingHistory: ArcTrendHistoryPoint[],
  importedPoints: ArcTrendHistoryPoint[],
  windowStartTimestamp: number,
) {
  const seededHistory = existingHistory.filter(point => point.timestamp < windowStartTimestamp);
  const seen = new Set(seededHistory.map(point => point.timestamp));
  const merged = [...seededHistory];

  importedPoints.forEach(point => {
    if (seen.has(point.timestamp)) {
      return;
    }

    seen.add(point.timestamp);
    merged.push(point);
  });

  return merged
    .sort((left, right) => left.timestamp - right.timestamp)
    .slice(-MAX_TREND_HISTORY_POINTS);
}

function mergeAutonomousDaytimeEvents(
  existingEvents: ArcAutonomousDaytimeEventSummary[],
  incomingEvents: ArcAutonomousDaytimeEventSummary[],
) {
  if (incomingEvents.length === 0) {
    return existingEvents;
  }

  const seen = new Set(existingEvents.map(event => event.id));
  const merged = [...existingEvents];

  incomingEvents.forEach(event => {
    if (seen.has(event.id)) {
      return;
    }

    seen.add(event.id);
    merged.push(event);
  });

  return merged.sort((left, right) => right.startTime - left.startTime);
}

function pruneRecordedSessionsToWindow(
  sessions: Session[],
  referenceTimestamp: number,
) {
  const cutoffTimestamp = referenceTimestamp - SESSION_RETENTION_WINDOW_MS;

  return sessions.filter(session => {
    if (typeof session.capturedAt !== 'number') {
      return true;
    }

    return session.capturedAt >= cutoffTimestamp && session.capturedAt <= referenceTimestamp;
  });
}

function upsertSessionById(
  sessions: Session[],
  session: Session,
) {
  return [session, ...sessions.filter(item => item.id !== session.id)];
}

type PhoneHomeIconKind =
  | 'nexalis'
  | 'mail'
  | 'calendar'
  | 'camera'
  | 'health'
  | 'maps'
  | 'notes'
  | 'music'
  | 'weather'
  | 'wallet'
  | 'photos'
  | 'settings'
  | 'messages'
  | 'browser'
  | 'phone'
  | 'journal';

type PhoneHomeApp = {
  id: string;
  label: string;
  secondaryLabel?: string;
  kind: PhoneHomeIconKind;
  background: string;
  foreground: string;
  accent?: string;
  interactive?: boolean;
};

const PHONE_HOME_APPS: PhoneHomeApp[] = [
  { id: 'mail', label: 'Mail', kind: 'mail', background: 'linear-gradient(180deg, #5EA8FF 0%, #1C73FF 100%)', foreground: '#FFFFFF' },
  { id: 'calendar', label: 'Calendar', kind: 'calendar', background: 'linear-gradient(180deg, #FFFFFF 0%, #F2F4F8 100%)', foreground: '#E14D4D', accent: '#D0D7E3' },
  { id: 'nexalis', label: 'Nexalis', secondaryLabel: 'Hub', kind: 'nexalis', background: 'linear-gradient(180deg, rgba(26,29,36,0.96) 0%, rgba(13,15,20,1) 100%)', foreground: '#F7FAFF', accent: '#B88A7A', interactive: true },
  { id: 'camera', label: 'Camera', kind: 'camera', background: 'linear-gradient(180deg, #5D6270 0%, #2C313B 100%)', foreground: '#FFFFFF', accent: '#CFD6E2' },
  { id: 'health', label: 'Health', kind: 'health', background: 'linear-gradient(180deg, #FF8DA7 0%, #FF5179 100%)', foreground: '#FFFFFF' },
  { id: 'maps', label: 'Maps', kind: 'maps', background: 'linear-gradient(180deg, #A4F39D 0%, #4CC17D 100%)', foreground: '#FFFFFF', accent: '#2B79FF' },
  { id: 'notes', label: 'Notes', kind: 'notes', background: 'linear-gradient(180deg, #FFE889 0%, #FFD24D 100%)', foreground: '#3E3216' },
  { id: 'music', label: 'Music', kind: 'music', background: 'linear-gradient(180deg, #FF6D9B 0%, #D93BEA 100%)', foreground: '#FFFFFF' },
  { id: 'weather', label: 'Weather', kind: 'weather', background: 'linear-gradient(180deg, #6DB8FF 0%, #4E8FFF 100%)', foreground: '#FFFFFF', accent: '#FFD45B' },
  { id: 'wallet', label: 'Wallet', kind: 'wallet', background: 'linear-gradient(180deg, #1D2530 0%, #10151C 100%)', foreground: '#FFFFFF', accent: '#5CD287' },
  { id: 'photos', label: 'Photos', kind: 'photos', background: 'linear-gradient(180deg, #FFFFFF 0%, #F6F7FB 100%)', foreground: '#6B7280' },
  { id: 'settings', label: 'Settings', kind: 'settings', background: 'linear-gradient(180deg, #D7DBE3 0%, #A9B1BE 100%)', foreground: '#2E3642' },
];

const PHONE_DOCK_APPS: PhoneHomeApp[] = [
  { id: 'phone', label: 'Phone', kind: 'phone', background: 'linear-gradient(180deg, #63D56D 0%, #27B84E 100%)', foreground: '#FFFFFF' },
  { id: 'messages', label: 'Messages', kind: 'messages', background: 'linear-gradient(180deg, #6EE66D 0%, #29C14A 100%)', foreground: '#FFFFFF' },
  { id: 'browser', label: 'Browser', kind: 'browser', background: 'linear-gradient(180deg, #58B4FF 0%, #2478FF 100%)', foreground: '#FFFFFF', accent: '#FF6C52' },
  { id: 'journal', label: 'Journal', kind: 'journal', background: 'linear-gradient(180deg, #B88A7A 0%, #8A5F54 100%)', foreground: '#FFFFFF' },
];

function PhoneHomeGlyph({
  kind,
  color,
  accent,
}: {
  kind: PhoneHomeIconKind;
  color: string;
  accent?: string;
}) {
  switch (kind) {
    case 'mail':
      return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
          <rect x="3.5" y="6" width="17" height="12" rx="3.2" />
          <path d="M5.5 8l6.5 5 6.5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'calendar':
      return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="5" width="16" height="15" rx="4" fill="#FFFFFF" />
          <rect x="4" y="5" width="16" height="4.5" rx="4" fill={color} />
          <text x="12" y="17" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1E2630">17</text>
        </svg>
      );
    case 'camera':
      return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7">
          <rect x="4.5" y="7" width="15" height="11" rx="3.2" />
          <path d="M8 7l1.4-2h5.2L16 7" />
          <circle cx="12" cy="12.5" r="3.2" />
        </svg>
      );
    case 'health':
      return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9">
          <path d="M12 19.5l-6.2-6.3a3.9 3.9 0 015.5-5.5L12 8.4l.7-.7a3.9 3.9 0 115.5 5.5L12 19.5z" fill={color} stroke="none" />
          <path d="M8 12h2l1.1-2.1L13 14l1.2-2H16" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'maps':
      return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
          <path d="M5 19l4-2 6 2 4-2V5l-4 2-6-2-4 2v12z" fill="#FFFFFF" opacity="0.85" />
          <path d="M12 8.5c-1.7 0-3 1.3-3 3 0 2.2 3 5.2 3 5.2s3-3 3-5.2c0-1.7-1.3-3-3-3z" fill={accent ?? color} />
          <circle cx="12" cy="11.5" r="1.2" fill="#FFFFFF" />
        </svg>
      );
    case 'notes':
      return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="4.5" width="14" height="15" rx="3.2" fill="#FFF9E8" />
          <rect x="5" y="4.5" width="14" height="4" rx="3.2" fill="#FFD34C" />
          <path d="M8 11h8M8 14h8M8 17h6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'music':
      return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
          <path d="M14.5 6v8.2a2.3 2.3 0 11-1.2-2V8.2l6-1.5v6.8a2.3 2.3 0 11-1.2-2V5.5L14.5 6z" fill={color} stroke="none" />
        </svg>
      );
    case 'weather':
      return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="9" r="3.5" fill={accent ?? '#FFD45B'} />
          <path d="M10.5 16.8h7a3 3 0 000-6 4.6 4.6 0 00-8.7 1.5A2.6 2.6 0 0010.5 16.8z" fill={color} />
        </svg>
      );
    case 'wallet':
      return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="7" width="16" height="11" rx="3" fill={color} />
          <rect x="6.5" y="9.5" width="11" height="2.4" rx="1.2" fill={accent ?? '#5CD287'} />
          <circle cx="16.5" cy="14.5" r="1.1" fill="#1B232D" />
        </svg>
      );
    case 'photos':
      return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="7" r="2.4" fill="#FF6565" />
          <circle cx="16.2" cy="9.1" r="2.4" fill="#FFAF4E" />
          <circle cx="16.2" cy="14.1" r="2.4" fill="#6CCB5F" />
          <circle cx="12" cy="17" r="2.4" fill="#4FAEFF" />
          <circle cx="7.8" cy="14.1" r="2.4" fill="#8D6CFF" />
          <circle cx="7.8" cy="9.1" r="2.4" fill="#F76FC1" />
          <circle cx="12" cy="12" r="2.1" fill="#FFFFFF" />
        </svg>
      );
    case 'settings':
      return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7">
          <circle cx="12" cy="12" r="3.1" />
          <path d="M12 5.2v2.1M12 16.7v2.1M18.8 12h-2.1M7.3 12H5.2M16.7 7.3l-1.5 1.5M8.8 15.2l-1.5 1.5M16.7 16.7l-1.5-1.5M8.8 8.8L7.3 7.3" strokeLinecap="round" />
        </svg>
      );
    case 'messages':
      return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
          <path d="M6.2 7.2h11.6a3 3 0 013 3v4.8a3 3 0 01-3 3H11l-4.6 3 .9-3H6.2a3 3 0 01-3-3v-4.8a3 3 0 013-3z" fill={color} />
        </svg>
      );
    case 'browser':
      return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" fill="#FFFFFF" />
          <path d="M12 6.4l1.9 5.4 5.6 1.1-7.5 4.7 2.1-5.1-5.6-1 3.5-.6z" fill={accent ?? '#FF6C52'} />
          <circle cx="12" cy="12" r="2.2" fill="#1E5EFF" opacity="0.9" />
        </svg>
      );
    case 'phone':
      return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <path d="M8.1 5.9l2.3 2.3-1.5 2.6a13.8 13.8 0 004.2 4.2l2.6-1.5 2.3 2.3-1.4 2.7a2.1 2.1 0 01-2.4 1.1A16.8 16.8 0 014.4 9.7a2.1 2.1 0 011.1-2.4l2.6-1.4z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'journal':
      return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7">
          <rect x="6.2" y="5" width="11.6" height="14" rx="2.4" fill="none" />
          <path d="M9.2 8.8h5.6M9.2 12h5.6M9.2 15.2h4.1" strokeLinecap="round" />
        </svg>
      );
    case 'nexalis':
      return (
        <NexalisLogo size={28} className="pointer-events-none" />
      );
    default:
      return null;
  }
}

function PhoneHomeAppTile({
  app,
  onOpen,
}: {
  app: PhoneHomeApp;
  onOpen?: () => void;
}) {
  const content = (
    <>
      <div
        className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[20px] border"
        style={{
          background: app.background,
          borderColor: hexToRgba('#FFFFFF', app.interactive ? 0.28 : 0.2),
          boxShadow: `0 10px 24px ${hexToRgba('#000000', 0.18)}`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-3 top-2 h-5 rounded-full blur-xl"
          style={{ background: hexToRgba('#FFFFFF', app.interactive ? 0.22 : 0.14) }}
        />
        <div className="relative z-10">
          <PhoneHomeGlyph kind={app.kind} color={app.foreground} accent={app.accent} />
        </div>
      </div>
      <div className="flex flex-col items-center leading-none">
        <span style={{ ...getArcTypographyStyle(foundationTheme, 'navLabel'), color: foundationTheme.text.highlight, fontSize: '0.5rem' }}>
          {app.label}
        </span>
        {app.secondaryLabel ? (
          <span style={{ ...getArcTypographyStyle(foundationTheme, 'navLabel'), color: hexToRgba(foundationTheme.text.secondary, 0.9), fontSize: '0.5rem' }}>
            {app.secondaryLabel}
          </span>
        ) : null}
      </div>
    </>
  );

  if (app.interactive) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="group flex flex-col items-center gap-2 text-center transition-transform duration-200 active:scale-95"
        aria-label={`Open ${app.label}${app.secondaryLabel ? ` ${app.secondaryLabel}` : ''} app`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 text-center opacity-95" aria-hidden="true">
      {content}
    </div>
  );
}

function ArcPhoneHomeScreen({ onOpenApp }: { onOpenApp: () => void }) {
  const simulationClock = useArcSimulationClock();

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[34px]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/sunsetmeadow-background.webp')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          filter: 'saturate(0.94) brightness(0.92)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${hexToRgba(foundationTheme.text.inverse, 0.08)} 0%, ${hexToRgba(foundationTheme.text.inverse, 0.2)} 56%, ${hexToRgba(foundationTheme.text.inverse, 0.34)} 100%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 18%, ${hexToRgba(foundationTheme.text.highlight, 0.12)} 0%, transparent 36%), radial-gradient(circle at 50% 100%, ${hexToRgba(foundationTheme.text.inverse, 0.18)} 0%, transparent 42%)`,
        }}
      />
      <div
        className="absolute -left-10 top-24 h-56 w-56 rounded-full blur-3xl"
        style={{ background: hexToRgba(foundationTheme.accent.primary, 0.08) }}
      />
      <div
        className="absolute -right-14 bottom-24 h-64 w-64 rounded-full blur-3xl"
        style={{ background: hexToRgba(foundationTheme.text.primary, 0.06) }}
      />

      <div className="relative z-10 flex flex-1 flex-col px-5 pb-8 pt-10">
        <div className="px-1 text-center">
          <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: hexToRgba(foundationTheme.text.primary, 0.78) }}>
            {simulationClock.weekdayLabel}
          </div>
          <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'displayHero'), color: foundationTheme.text.highlight, fontSize: '3rem', lineHeight: 1 }}>
            {simulationClock.displayTime}
          </div>
          <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: hexToRgba(foundationTheme.text.secondary, 0.84) }}>
            {simulationClock.dateLabel}
          </div>
        </div>

        <div className="mt-10 flex-1">
          <div className="grid grid-cols-4 gap-x-4 gap-y-6 px-1">
            {PHONE_HOME_APPS.map(app => (
              <PhoneHomeAppTile
                key={app.id}
                app={app}
                onOpen={app.interactive ? onOpenApp : undefined}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <div
              className="rounded-full px-3 py-1.5"
              style={{
                background: hexToRgba(foundationTheme.text.inverse, 0.22),
                backdropFilter: 'blur(14px)',
              }}
            >
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: hexToRgba(foundationTheme.text.highlight, 0.9) }} />
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: hexToRgba(foundationTheme.text.highlight, 0.34) }} />
              </div>
            </div>
          </div>
        </div>

        <div
          className="mx-auto mt-auto flex w-full max-w-[240px] items-center justify-center rounded-[28px] border px-4 py-4 backdrop-blur-xl"
          style={{
            background: hexToRgba(foundationTheme.surface.cardSecondary, 0.58),
            borderColor: foundationTheme.border.soft,
          }}
        >
          <div className="grid w-full grid-cols-4 gap-3">
            {PHONE_DOCK_APPS.map(app => (
              <div key={app.id} className="flex justify-center" aria-hidden="true">
                <div
                  className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-[18px] border"
                  style={{
                    background: app.background,
                    borderColor: hexToRgba('#FFFFFF', 0.2),
                    boxShadow: `0 8px 18px ${hexToRgba('#000000', 0.16)}`,
                  }}
                >
                  <PhoneHomeGlyph kind={app.kind} color={app.foreground} accent={app.accent} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArcDeviceHubScreen({
  linkedDevice,
  connectionState,
  calibration,
  onSyncArc,
  onEnterArcDashboard,
}: {
  linkedDevice: ArcHubLinkedDevice;
  connectionState: ArcHubConnectionState;
  calibration: ArcAppDataSnapshot['calibration'];
  onSyncArc: () => void;
  onEnterArcDashboard: () => void;
}) {
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const isConnecting = connectionState === 'connecting';
  const isConnected = connectionState === 'connected';
  const isArcLinked = linkedDevice === 'arc' && isConnected;

  useEffect(() => {
    if (isArcLinked) {
      setIsManagerOpen(false);
    }
  }, [isArcLinked]);

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden px-5 pb-6 pt-3"
      style={{
        background: 'linear-gradient(180deg, rgba(252,250,247,0.99) 0%, rgba(246,241,234,0.99) 100%)',
      }}
    >
      <div>
        <div
          className="inline-flex rounded-full border px-3 py-1"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'label'),
            background: 'rgba(255,255,255,0.84)',
            borderColor: 'rgba(21, 27, 36, 0.08)',
            color: '#7A8390',
          }}
        >
          Cinder
        </div>
        <h1
          className="mt-4"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'screenTitle'),
            color: '#131922',
            fontSize: '1.9rem',
          }}
        >
          Cinder HUB
        </h1>
        <p
          className="mt-3 max-w-[290px]"
          style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: '#616B79' }}
        >
          Connect your first device here. Once Cinder is synced, the first large slot becomes your dashboard entryway.
        </p>
      </div>

      <div className="mt-7 flex min-h-0 flex-1 gap-3">
        <div className="flex w-[78px] shrink-0 flex-col gap-3">
          {[0, 1, 2].map(slotIndex => {
            const isTopSlot = slotIndex === 0;
            const smallSlotIsFilled = isTopSlot && linkedDevice === 'arc';

            if (isTopSlot) {
              return (
                <button
                  key={slotIndex}
                  type="button"
                  onClick={() => setIsManagerOpen(true)}
                  className="flex h-[92px] items-center justify-center rounded-[24px] border transition-all duration-300"
                  style={{
                    background: smallSlotIsFilled ? 'rgba(184, 138, 122, 0.12)' : 'rgba(255, 255, 255, 0.78)',
                    borderColor: smallSlotIsFilled ? 'rgba(184, 138, 122, 0.22)' : 'rgba(21, 27, 36, 0.12)',
                    color: smallSlotIsFilled ? '#8A5F54' : '#98A1AE',
                  }}
                >
                  <div className="text-center">
                    <div style={{ ...getArcTypographyStyle(foundationTheme, 'pillLabel'), fontSize: smallSlotIsFilled ? '0.42rem' : undefined, letterSpacing: smallSlotIsFilled ? '0.05em' : undefined }}>
                {smallSlotIsFilled ? 'Cinder' : '+'}
                    </div>
                    <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), fontSize: '0.58rem' }}>
                      {smallSlotIsFilled ? 'Synced' : 'Device'}
                    </div>
                  </div>
                </button>
              );
            }

            return (
              <div
                key={slotIndex}
                className="flex h-[92px] items-center justify-center rounded-[24px] border border-dashed"
                style={{
                  background: 'rgba(255, 255, 255, 0.72)',
                  borderColor: 'rgba(21, 27, 36, 0.12)',
                  color: '#C0C7D2',
                }}
              >
                <div className="text-center">
                  <div style={{ ...getArcTypographyStyle(foundationTheme, 'pillLabel') }}>+</div>
                  <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), fontSize: '0.58rem', color: '#B2BAC6' }}>
                    Device
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="flex min-h-0 flex-1 flex-col rounded-[30px] border p-5"
          style={{
            background: '#FFFFFF',
            borderColor: 'rgba(21, 27, 36, 0.12)',
            boxShadow: '0 16px 28px rgba(16, 18, 24, 0.08)',
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: '#7A8390' }}>
                Your Cinder HUB
              </div>
              <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: '#616B79' }}>
                {isArcLinked
                  ? 'Cinder is now linked and ready to open in Cinder HUB.'
                  : 'This is where your connected devices become app entry points.'}
              </div>
            </div>

            <div
              className="rounded-full border px-3 py-1"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                background: isArcLinked ? 'rgba(84, 164, 120, 0.12)' : 'rgba(247, 242, 234, 0.96)',
                borderColor: isArcLinked ? 'rgba(84, 164, 120, 0.2)' : 'rgba(21, 27, 36, 0.08)',
                color: isArcLinked ? '#54A478' : '#7A8390',
              }}
            >
              {isArcLinked ? '1 linked' : 'Empty'}
            </div>
          </div>

          <div className="mt-5 flex min-h-0 flex-1">
            {isArcLinked ? (
              <button
                type="button"
                onClick={onEnterArcDashboard}
                className="flex w-full items-center justify-between rounded-[26px] border px-4 text-left transition-all duration-300"
                style={{
                  background: 'linear-gradient(180deg, rgba(252,250,247,0.98) 0%, rgba(247,242,234,0.98) 100%)',
                  borderColor: 'rgba(184, 138, 122, 0.18)',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="relative flex h-16 w-16 items-center justify-center rounded-[22px] border"
                    style={{
                      background: 'linear-gradient(180deg, rgba(26,29,36,0.96) 0%, rgba(13,15,20,1) 100%)',
                      borderColor: 'rgba(184, 138, 122, 0.26)',
                    }}
                  >
                    <div className="absolute h-9 w-9 rounded-full border" style={{ borderColor: 'rgba(184, 138, 122, 0.42)' }} />
                    <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: '#F7FAFF', fontSize: '0.4rem', letterSpacing: '0.08em' }}>Cinder</div>
                  </div>
                  <div>
                    <div style={{ ...getArcTypographyStyle(foundationTheme, 'displayHero'), color: '#131922', fontSize: '1.35rem' }}>
                      Cinder HUB
                    </div>
                    <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: '#6E7785' }}>
                      Open your connected Cinder experience and continue profile formation
                    </div>
                    <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: '#8A5F54' }}>
                      {calibration.title}
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-full border px-3 py-1"
                  style={{
                    ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                    background: 'rgba(184, 138, 122, 0.08)',
                    borderColor: 'rgba(184, 138, 122, 0.18)',
                    color: '#8A5F54',
                  }}
                >
                  Open
                </div>
              </button>
            ) : (
              <div
                className="flex w-full items-center justify-center rounded-[26px] border border-dashed px-5 text-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.72)',
                  borderColor: 'rgba(21, 27, 36, 0.12)',
                }}
              >
                <div>
                  <div style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: '#8F97A4' }}>
                    No device linked yet
                  </div>
                  <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: '#A1A9B5' }}>
                      Add a device from the first slot to create your Cinder HUB entryway.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-5">
        <div style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: '#7A8390' }}>
          Tap the first device slot to open Device Manager.
        </div>
      </div>

      {isManagerOpen ? (
        <div className="absolute inset-0 z-20 flex items-end bg-[rgba(19,25,34,0.18)]">
          <div
            className="w-full rounded-t-[34px] border px-5 pb-7 pt-4"
            style={{
              background: 'rgba(255,255,255,0.98)',
              borderColor: 'rgba(21, 27, 36, 0.08)',
              boxShadow: '0 -18px 40px rgba(14, 18, 24, 0.16)',
            }}
          >
            <div className="mx-auto h-1.5 w-12 rounded-full" style={{ background: 'rgba(21, 27, 36, 0.12)' }} />
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <div style={{ ...getArcTypographyStyle(foundationTheme, 'screenTitle'), color: '#131922', fontSize: '1.35rem' }}>
                  Device Manager
                </div>
                <div className="mt-2 max-w-[250px]" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: '#616B79' }}>
                  Available devices appear here when they can be linked into Hub.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsManagerOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border"
                style={{
                  background: 'rgba(247,242,234,0.92)',
                  borderColor: 'rgba(21, 27, 36, 0.08)',
                  color: '#5E6775',
                }}
                aria-label="Close device manager"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <button
              type="button"
              onClick={onSyncArc}
              disabled={isConnecting || isArcLinked}
              className="mt-5 flex w-full items-center justify-between rounded-[28px] border px-4 py-4 text-left transition-all duration-300 disabled:cursor-default disabled:opacity-60"
              style={{
                background: 'rgba(252,250,247,0.98)',
                borderColor: isArcLinked ? 'rgba(84, 164, 120, 0.2)' : 'rgba(21, 27, 36, 0.08)',
                color: '#131922',
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="relative flex h-14 w-14 items-center justify-center rounded-[20px] border"
                  style={{
                    background: 'linear-gradient(180deg, rgba(26,29,36,0.96) 0%, rgba(13,15,20,1) 100%)',
                    borderColor: 'rgba(184, 138, 122, 0.24)',
                  }}
                >
                  <div className="absolute h-8 w-8 rounded-full border" style={{ borderColor: 'rgba(184, 138, 122, 0.4)' }} />
                  <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: '#F7FAFF', fontSize: '0.4rem', letterSpacing: '0.08em' }}>Cinder</div>
                </div>
                <div>
                  <div style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: '#131922' }}>
                    Cinder
                  </div>
                  <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: '#6E7785' }}>
                    {isArcLinked
                      ? 'Synced to Cinder HUB'
                      : isConnecting
                        ? 'Syncing now'
                        : 'Available to sync'}
                  </div>
                </div>
              </div>

              <div
                className="rounded-full border px-3 py-1"
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                  background: isArcLinked ? 'rgba(84, 164, 120, 0.12)' : 'rgba(184, 138, 122, 0.08)',
                  borderColor: isArcLinked ? 'rgba(84, 164, 120, 0.2)' : 'rgba(184, 138, 122, 0.16)',
                  color: isArcLinked ? '#54A478' : '#8A5F54',
                }}
              >
                {isArcLinked ? 'Synced' : isConnecting ? 'Syncing' : 'Sync'}
              </div>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function ArcSimulationPage({ onBack }: { onBack: () => void }) {
  const [showLaunch, setShowLaunch] = useState(false);
  const [isAppOpen, setIsAppOpen] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);
  const [hasStartedDashboardClock, setHasStartedDashboardClock] = useState(false);
  const [hubLinkedDevice, setHubLinkedDevice] = useState<ArcHubLinkedDevice>(null);
  const [hubConnectionState, setHubConnectionState] = useState<ArcHubConnectionState>('idle');
  const [profileOverride, setProfileOverride] = useState<ArcUserProfileOverride | null>(null);
  const [screen, setScreen] = useState<ArcScreen>('home');
  const [toolAssignments, setToolAssignments] = useState<ArcToolAssignments>(() => {
    if (typeof window === 'undefined') {
      return {
        'live-signal-view': 'insights',
        'trend-overlay': 'insights',
      };
    }

    try {
      const storedValue = window.localStorage.getItem(ARC_TOOL_ASSIGNMENTS_STORAGE_KEY);
      if (!storedValue) {
        return {
          'live-signal-view': 'insights',
          'trend-overlay': 'insights',
        };
      }

      const parsed = JSON.parse(storedValue) as ArcToolAssignments;
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch {
      // Fall back to default assignments if local storage is unavailable or malformed.
    }

    return {
      'live-signal-view': 'insights',
      'trend-overlay': 'insights',
    };
  });
  const [screenHistory, setScreenHistory] = useState<ArcScreen[]>([]);
  const [hoveredPanel, setHoveredPanel] = useState<ArcPanel | null>(null);
  const [recordedSessions, setRecordedSessions] = useState<Session[]>([]);
  const [lifetimeRecordedSessions, setLifetimeRecordedSessions] = useState<Session[]>([]);
  const [trendHistory, setTrendHistory] = useState<ArcTrendHistoryPoint[]>([]);
  const [autonomousDaytimeEvents, setAutonomousDaytimeEvents] = useState<ArcAutonomousDaytimeEventSummary[]>([]);
  const [autonomousDaytimeEnabled, setAutonomousDaytimeEnabled] = useState(true);
  const [simulationPerformancePreset, setSimulationPerformancePreset] = useState<ArcPerformancePresetId>('average');
  const [simulationTimescale, setSimulationTimescale] = useState<ArcSimulationTimescalePreset>(() => {
    if (typeof window === 'undefined') {
      return 1;
    }

    try {
      const storedValue = Number(window.localStorage.getItem(SIMULATION_TIMESCALE_STORAGE_KEY));
      const matchedPreset = SIMULATION_TIMESCALE_PRESETS.find(option => option.value === storedValue);
      return matchedPreset?.value ?? 1;
    } catch {
      return 1;
    }
  });
  const [openSimulationPanelFolder, setOpenSimulationPanelFolder] = useState<ArcSimulationPanelFolderId | null>(null);
  const [edgeCardShapePoints, setEdgeCardShapePoints] = useState(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_EDGE_CARD_SHAPE_POINTS;
    }

    try {
      return parseCardShapePoints(window.localStorage.getItem(EDGE_CARD_SHAPE_STORAGE_KEY));
    } catch {
      return DEFAULT_EDGE_CARD_SHAPE_POINTS;
    }
  });
  const [edgeCardShapeDraftPoints, setEdgeCardShapeDraftPoints] = useState(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_EDGE_CARD_SHAPE_POINTS;
    }

    try {
      return parseCardShapePoints(window.localStorage.getItem(EDGE_CARD_SHAPE_STORAGE_KEY));
    } catch {
      return DEFAULT_EDGE_CARD_SHAPE_POINTS;
    }
  });
  const [edgeCardShapeEditorEnabled, setEdgeCardShapeEditorEnabled] = useState(false);
  const [edgeCardMoveEditorEnabled, setEdgeCardMoveEditorEnabled] = useState(false);
  const [activeEdgeEditorTab, setActiveEdgeEditorTab] = useState<ArcEdgeEditorTab>('shape');
  const [edgeCardShapeSelectedPointIndex, setEdgeCardShapeSelectedPointIndex] = useState<number | null>(null);
  const [edgeCardShapeCopyStatus, setEdgeCardShapeCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [edgeCardLayout, setEdgeCardLayout] = useState<ArcEdgeCardLayout>(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_EDGE_CARD_LAYOUT;
    }

    try {
      return parseEdgeCardLayout(window.localStorage.getItem(EDGE_CARD_LAYOUT_STORAGE_KEY));
    } catch {
      return DEFAULT_EDGE_CARD_LAYOUT;
    }
  });
  const [edgeCardGlassOpacity, setEdgeCardGlassOpacity] = useState(() => {
    if (typeof window === 'undefined') {
      return 1;
    }

    try {
      const storedValue = Number(window.localStorage.getItem(EDGE_CARD_GLASS_OPACITY_STORAGE_KEY));
      return Number.isFinite(storedValue) ? Math.min(1, Math.max(0, storedValue)) : 1;
    } catch {
      return 1;
    }
  });
  const [edgeCardGlassBlur, setEdgeCardGlassBlur] = useState(() => {
    if (typeof window === 'undefined') {
      return 1;
    }

    try {
      const storedValue = Number(window.localStorage.getItem(EDGE_CARD_GLASS_BLUR_STORAGE_KEY));
      return Number.isFinite(storedValue) ? Math.min(1, Math.max(0, storedValue)) : 1;
    } catch {
      return 1;
    }
  });
  const [edgeCardGlassTintOverride, setEdgeCardGlassTintOverride] = useState<string | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const storedValue = window.localStorage.getItem(EDGE_CARD_GLASS_TINT_STORAGE_KEY);
      return storedValue && /^#[0-9a-fA-F]{6}$/.test(storedValue) ? storedValue : null;
    } catch {
      return null;
    }
  });
  const [offlineCaptureEnabled, setOfflineCaptureEnabled] = useState(true);
  const [deviceBacklogPreset, setDeviceBacklogPreset] = useState<ArcDeviceBacklogPreset>('4h');
  const [pendingBufferedMinutes, setPendingBufferedMinutes] = useState(0);
  const [syncedCaptureMinutes, setSyncedCaptureMinutes] = useState(0);
  const [isImportingBufferedData, setIsImportingBufferedData] = useState(false);
  const [syncVisualProgress, setSyncVisualProgress] = useState(0);
  const [showReconciledSyncState, setShowReconciledSyncState] = useState(false);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<number | null>(null);
  const [lastDeviceContactTimestamp, setLastDeviceContactTimestamp] = useState<number | null>(null);
  const [frozenLiveTelemetry, setFrozenLiveTelemetry] = useState<ArcLiveTelemetry | null>(null);
  const [frozenLiveSignal, setFrozenLiveSignal] = useState<ArcLiveSignalSnapshot | null>(null);
  const [homeScreenLiveViewEnabled, setHomeScreenLiveViewEnabled] = useState(true);
  const [homeScreenTrendViewEnabled, setHomeScreenTrendViewEnabled] = useState(true);
  const [simulatedMinuteOffset, setSimulatedMinuteOffset] = useState(0);
  const [foundationClockOriginMinutes, setFoundationClockOriginMinutes] = useState(0);
  const [simulationClockResetKey, setSimulationClockResetKey] = useState(0);
  const [isLiveSimulationRunning, setIsLiveSimulationRunning] = useState(false);
  const [pulseReducedMotionPreview, setPulseReducedMotionPreview] = useState(false);
  const [amoraSettings, setAmoraSettings] = useState<ArcAmoraSettings>({
    enabled: true,
    proactiveInsights: true,
    guidanceLevel: 'standard',
    partnerAwarenessGuidance: 'on',
  });
  const [amoraTopic, setAmoraTopic] = useState<ArcAmoraTopicId>('home');
  const [isAmoraOpen, setIsAmoraOpen] = useState(false);
  const [isAmoraExpanded, setIsAmoraExpanded] = useState(false);
  const [amoraGuidanceState, setAmoraGuidanceState] = useState(DEFAULT_AMORA_GUIDANCE_STATE);
  const [activeAmoraGuidanceNote, setActiveAmoraGuidanceNote] = useState<ArcAmoraGuidanceNote | null>(null);
  const [activeAmoraGuidanceKey, setActiveAmoraGuidanceKey] = useState<string | null>(null);
  const [hasSeenAmoraIntro, setHasSeenAmoraIntro] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      return window.localStorage.getItem(AMORA_WELCOME_INTRO_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [hasSeenAmoraIconIntro, setHasSeenAmoraIconIntro] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      return window.localStorage.getItem(AMORA_ICON_INTRO_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [hasSeenAmoraUnlockReveal, setHasSeenAmoraUnlockReveal] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      return window.localStorage.getItem(AMORA_UNLOCK_REVEAL_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [hasSeenFirstEdgeExplanation, setHasSeenFirstEdgeExplanation] = useState(false);
  const [hasSeenFirstSessionExplanation, setHasSeenFirstSessionExplanation] = useState(false);
  const [isAmoraTourActive, setIsAmoraTourActive] = useState(false);
  const [amoraTourStepIndex, setAmoraTourStepIndex] = useState(0);
  const [amoraTourAnchorRect, setAmoraTourAnchorRect] = useState<ArcAmoraTourAnchorRect | null>(null);
  const [amoraIntroAnchorRect, setAmoraIntroAnchorRect] = useState<ArcAmoraTourAnchorRect | null>(null);
  const pulse = usePulseController();
  const trendViewMode: ArcTrendViewMode = 'accumulated';
  const lastTrendSampleBucketRef = useRef<number | null>(null);
  const lastAutonomousDaytimeCaptureRef = useRef<number | null>(null);
  const lastDeviceCaptureMinuteRef = useRef<number | null>(null);
  const wasAboveActiveEntryRef = useRef(false);
  const activeSessionPeakRef = useRef(0);
  const activeSessionStartedAtRef = useRef<Date | null>(null);
  const phoneShellRef = useRef<HTMLDivElement | null>(null);
  const phoneScrollRef = useRef<HTMLDivElement | null>(null);
  const lastAmoraUnlockedRef = useRef(false);
  const amoraTourStartTimerRef = useRef<number | null>(null);
  const syncTimerRefs = useRef<number[]>([]);
  const didHydrateFoundationPulsesRef = useRef(false);
  const previousFoundationCompletedIdsRef = useRef<Set<string>>(new Set());
  const previousFoundationHiddenCompletedIdsRef = useRef<Set<string>>(new Set());
  const foundationSignalFlagsRef = useRef<Record<string, boolean>>({});
  const simulationClock = useArcSimulationClockSource(
    hasStartedDashboardClock,
    simulatedMinuteOffset,
    simulationTimescale,
    simulationClockResetKey,
  );
  const simulatedTimestamp = simulationClock.simulatedDate.getTime();
  const performancePresets = useMemo(() => getArcPerformancePresets(), []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(SIMULATION_TIMESCALE_STORAGE_KEY, String(simulationTimescale));
    } catch {
      // Ignore local storage write failures and keep the in-memory timescale.
    }
  }, [simulationTimescale]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(EDGE_CARD_SHAPE_STORAGE_KEY, serializeCardShapePoints(edgeCardShapePoints));
    } catch {
      // Ignore local storage write failures and keep the in-memory shape.
    }
  }, [edgeCardShapePoints]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(EDGE_CARD_GLASS_OPACITY_STORAGE_KEY, String(edgeCardGlassOpacity));
    } catch {
      // Ignore local storage write failures and keep the in-memory opacity.
    }
  }, [edgeCardGlassOpacity]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(EDGE_CARD_GLASS_BLUR_STORAGE_KEY, String(edgeCardGlassBlur));
    } catch {
      // Ignore local storage write failures and keep the in-memory blur control.
    }
  }, [edgeCardGlassBlur]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      if (edgeCardGlassTintOverride) {
        window.localStorage.setItem(EDGE_CARD_GLASS_TINT_STORAGE_KEY, edgeCardGlassTintOverride);
      } else {
        window.localStorage.removeItem(EDGE_CARD_GLASS_TINT_STORAGE_KEY);
      }
    } catch {
      // Ignore local storage write failures and keep the in-memory tint control.
    }
  }, [edgeCardGlassTintOverride]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(EDGE_CARD_LAYOUT_STORAGE_KEY, serializeEdgeCardLayout(edgeCardLayout));
    } catch {
      // Ignore local storage write failures and keep the in-memory layout control.
    }
  }, [edgeCardLayout]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(ARC_TOOL_ASSIGNMENTS_STORAGE_KEY, JSON.stringify(toolAssignments));
    } catch {
      // Ignore local storage write failures and keep the in-memory assignment model.
    }
  }, [toolAssignments]);

  const handleSetToolPlacement = useCallback((toolId: string, placement: ArcToolPlacement) => {
    setToolAssignments(current => {
      const currentPlacement = current[toolId] ?? null;
      if (currentPlacement === placement) {
        return current;
      }

      if (placement != null) {
        const placementCount = Object.entries(current).reduce((count, [currentToolId, currentToolPlacement]) => {
          if (currentToolId === toolId) {
            return count;
          }

          return currentToolPlacement === placement ? count + 1 : count;
        }, 0);

        if (placementCount >= MAX_TOOL_SLOTS) {
          return current;
        }
      }

      return {
        ...current,
        [toolId]: placement,
      };
    });
  }, []);
  const sharedLiveSignal = useArcSharedLiveSignal(simulationClock.simulatedDate, {
    autonomousDaytimeEnabled,
    performancePreset: simulationPerformancePreset,
  });
  const liveTelemetry = useArcLiveTelemetry(sharedLiveSignal);
  const effectiveLiveSignal = isDeviceConnected ? sharedLiveSignal : frozenLiveSignal ?? sharedLiveSignal;
  const effectiveLiveTelemetry = isDeviceConnected ? liveTelemetry : frozenLiveTelemetry ?? liveTelemetry;
  const appOpenSimulatedMinutes = syncedCaptureMinutes;
  const foundationClockElapsedMinutes = Math.max(
    0,
    simulationClock.elapsedSimulatedMinutes - foundationClockOriginMinutes,
  );

  const activeTab = getActiveTab(screen);
  const activeAtmosphere = isAppOpen
    ? isOnboardingComplete
      ? getAtmosphereVariant(screen)
      : 'home'
    : 'home';
  const appData = useMemo(
    () =>
      buildArcAppData(
        recordedSessions,
        effectiveLiveTelemetry,
        profileOverride,
        appOpenSimulatedMinutes,
        foundationClockElapsedMinutes,
        trendHistory,
        simulationClock.simulatedDate,
        autonomousDaytimeEvents,
        lifetimeRecordedSessions,
      ),
    [
      appOpenSimulatedMinutes,
      autonomousDaytimeEvents,
      effectiveLiveTelemetry,
      foundationClockElapsedMinutes,
      lifetimeRecordedSessions,
      profileOverride,
      recordedSessions,
      simulationClock.simulatedDate,
      trendHistory,
    ],
  );
  const accountStatusLabel = useMemo(
    () => getProfileStage(appData.calibration.progress),
    [appData.calibration.progress],
  );
  const foundationChecklistRuntime = useMemo(
    () => buildFoundationChecklistRuntimeFromSnapshot(appData),
    [appData],
  );
  const foundationChecklistEvaluation = foundationChecklistRuntime.visible;
  const foundationHiddenEvaluation = foundationChecklistRuntime.hidden;
  const foundationGoalState = useMemo(
    () => buildFoundationGoalState(appData.currentGoal, foundationChecklistEvaluation),
    [appData.currentGoal, foundationChecklistEvaluation],
  );
  const foundationChecklistItemMap = useMemo(
    () =>
      foundationChecklistEvaluation.sections.flatMap(section => section.items).reduce<Record<string, (typeof foundationChecklistEvaluation.sections)[number]['items'][number]>>(
        (map, item) => {
          map[item.id] = item;
          return map;
        },
        {},
      ),
    [foundationChecklistEvaluation.sections],
  );
  const foundationHiddenMilestoneMap = useMemo(
    () =>
      foundationHiddenEvaluation.milestones.reduce<Record<string, (typeof foundationHiddenEvaluation.milestones)[number]>>(
        (map, milestone) => {
          map[milestone.id] = milestone;
          return map;
        },
        {},
      ),
    [foundationHiddenEvaluation.milestones],
  );
  const motionSessions = useMemo(
    () => appData.sessions.filter(session => session.type === 'motion'),
    [appData.sessions],
  );
  const latestPersonalBestSession = useMemo(
    () => appData.sessions.find(session => session.isPersonalBest) ?? null,
    [appData.sessions],
  );
  const onboardingGuidanceNote = useMemo(
    () => getOnboardingGuidanceNote(amoraGuidanceState),
    [amoraGuidanceState],
  );
  const amoraContent = useMemo(
    () =>
      resolveAmoraContent(amoraTopic, {
        username: appData.userProfile.anonymousUsername,
        calibrationComplete: appData.calibration.progress >= 1,
        insightLine: appData.edgeScore.unlocked ? 'Stronger hold. Faster rise.' : undefined,
        direction:
          appData.edgeScore.dayDelta == null
            ? 'flat'
            : appData.edgeScore.dayDelta > 0
              ? 'up'
              : appData.edgeScore.dayDelta < 0
                ? 'down'
                : 'flat',
      }),
    [
      amoraTopic,
      appData.calibration.progress,
      appData.edgeScore.dayDelta,
      appData.edgeScore.unlocked,
      appData.userProfile.anonymousUsername,
    ],
  );

  useEffect(() => {
    const completedIds = new Set(
      foundationChecklistEvaluation.sections.flatMap(section =>
        section.items.filter(item => item.completed).map(item => item.id),
      ),
    );
    const hiddenCompletedIds = new Set(
      foundationHiddenEvaluation.milestones
        .filter(milestone => milestone.isCompleted)
        .map(milestone => milestone.id),
    );

    const nextSignalFlags = {
      'baseline-is-building':
        foundationChecklistEvaluation.metrics.totalBaselineHours >= 1 &&
        !completedIds.has('baseline-started'),
      'wear-is-compounding':
        foundationChecklistEvaluation.metrics.totalWearHours >= 4 &&
        !completedIds.has('wear-building'),
      'session-range-is-improving':
        foundationChecklistEvaluation.metrics.qualifiedSessionCount >= 2 &&
        !completedIds.has('session-range'),
      'foundation-is-stabilizing':
        foundationChecklistEvaluation.completedCount >= 6 &&
        !foundationChecklistEvaluation.foundationComplete,
      'static-sessions-are-sharpening-your-read':
        foundationChecklistEvaluation.metrics.staticSessionCount >= 1,
      'motion-sessions-are-expanding-your-profile':
        foundationChecklistEvaluation.metrics.motionSessionCount >= 1,
      'more-baseline-time-will-strengthen-your-starting-read':
        foundationChecklistEvaluation.metrics.totalBaselineHours >= 0.5 &&
        !completedIds.has('baseline-started'),
      'one-more-qualified-session-will-complete-session-range':
        foundationChecklistEvaluation.metrics.qualifiedSessionCount === 2 &&
        !completedIds.has('session-range'),
      'a-motion-session-would-broaden-your-profile':
        foundationChecklistEvaluation.metrics.qualifiedSessionCount >= 1 &&
        foundationChecklistEvaluation.metrics.motionSessionCount === 0,
      'more-wear-time-will-sharpen-your-foundation':
        foundationChecklistEvaluation.metrics.totalWearHours >= 1 &&
        !completedIds.has('wear-building'),
      'a-strong-hold-will-add-stability-depth':
        foundationChecklistEvaluation.metrics.qualifiedSessionCount >= 1 &&
        foundationChecklistEvaluation.metrics.strongHoldCount === 0,
    };

    if (!isAppOpen || !isOnboardingComplete) {
      previousFoundationCompletedIdsRef.current = completedIds;
      previousFoundationHiddenCompletedIdsRef.current = hiddenCompletedIds;
      foundationSignalFlagsRef.current = nextSignalFlags;
      didHydrateFoundationPulsesRef.current = false;
      return;
    }

    if (!didHydrateFoundationPulsesRef.current) {
      foundationHiddenEvaluation.milestones
        .filter(milestone => milestone.isCompleted)
        .forEach(milestone => {
          pulse.backfillPulse(createFoundationHiddenMilestonePulse(milestone));
        });

      previousFoundationCompletedIdsRef.current = completedIds;
      previousFoundationHiddenCompletedIdsRef.current = hiddenCompletedIds;
      foundationSignalFlagsRef.current = nextSignalFlags;
      didHydrateFoundationPulsesRef.current = true;
      return;
    }

    Array.from(hiddenCompletedIds)
      .filter(milestoneId => !previousFoundationHiddenCompletedIdsRef.current.has(milestoneId))
      .forEach(milestoneId => {
        const milestone = foundationHiddenMilestoneMap[milestoneId];
        if (!milestone) {
          return;
        }

        pulse.pushPulse(createFoundationHiddenMilestonePulse(milestone));
      });

    Array.from(completedIds)
      .filter(itemId => !previousFoundationCompletedIdsRef.current.has(itemId))
      .forEach(itemId => {
        const item = foundationChecklistItemMap[itemId];
        if (!item) {
          return;
        }

        const accomplishmentPulse = createFoundationAccomplishmentPulse(item);
        if (accomplishmentPulse) {
          pulse.pushPulse(accomplishmentPulse);
        }
      });

    const previousFlags = foundationSignalFlagsRef.current;

    if (nextSignalFlags['baseline-is-building'] && !previousFlags['baseline-is-building']) {
      pulse.pushPulse(
        createFoundationInsightPulse(
          'baseline-is-building',
          foundationChecklistItemMap['baseline-started']?.progressDetail,
        ),
      );
    }

    if (nextSignalFlags['wear-is-compounding'] && !previousFlags['wear-is-compounding']) {
      pulse.pushPulse(
        createFoundationInsightPulse(
          'wear-is-compounding',
          foundationChecklistItemMap['wear-building']?.progressDetail,
        ),
      );
    }

    if (nextSignalFlags['session-range-is-improving'] && !previousFlags['session-range-is-improving']) {
      pulse.pushPulse(
        createFoundationInsightPulse(
          'session-range-is-improving',
          foundationChecklistItemMap['session-range']?.progressDetail,
        ),
      );
    }

    if (nextSignalFlags['foundation-is-stabilizing'] && !previousFlags['foundation-is-stabilizing']) {
      pulse.pushPulse(
        createFoundationInsightPulse(
          'foundation-is-stabilizing',
          `${foundationChecklistEvaluation.completedCount} / ${foundationChecklistEvaluation.totalCount} Foundation targets`,
        ),
      );
    }

    if (
      nextSignalFlags['static-sessions-are-sharpening-your-read'] &&
      !previousFlags['static-sessions-are-sharpening-your-read']
    ) {
      pulse.pushPulse(
        createFoundationInsightPulse(
          'static-sessions-are-sharpening-your-read',
          foundationChecklistItemMap['static-session-logged']?.progressDetail,
        ),
      );
    }

    if (
      nextSignalFlags['motion-sessions-are-expanding-your-profile'] &&
      !previousFlags['motion-sessions-are-expanding-your-profile']
    ) {
      pulse.pushPulse(
        createFoundationInsightPulse(
          'motion-sessions-are-expanding-your-profile',
          foundationChecklistItemMap['motion-session-logged']?.progressDetail,
        ),
      );
    }

    if (
      nextSignalFlags['more-baseline-time-will-strengthen-your-starting-read'] &&
      !previousFlags['more-baseline-time-will-strengthen-your-starting-read']
    ) {
      pulse.pushPulse(
        createFoundationGuidancePulse(
          'more-baseline-time-will-strengthen-your-starting-read',
          foundationChecklistItemMap['baseline-started']?.progressDetail,
        ),
      );
    }

    if (
      nextSignalFlags['one-more-qualified-session-will-complete-session-range'] &&
      !previousFlags['one-more-qualified-session-will-complete-session-range']
    ) {
      pulse.pushPulse(
        createFoundationGuidancePulse(
          'one-more-qualified-session-will-complete-session-range',
          foundationChecklistItemMap['session-range']?.progressDetail,
        ),
      );
    }

    if (
      nextSignalFlags['a-motion-session-would-broaden-your-profile'] &&
      !previousFlags['a-motion-session-would-broaden-your-profile']
    ) {
      pulse.pushPulse(
        createFoundationGuidancePulse(
          'a-motion-session-would-broaden-your-profile',
          foundationChecklistItemMap['motion-session-logged']?.progressDetail,
        ),
      );
    }

    if (
      nextSignalFlags['more-wear-time-will-sharpen-your-foundation'] &&
      !previousFlags['more-wear-time-will-sharpen-your-foundation']
    ) {
      pulse.pushPulse(
        createFoundationGuidancePulse(
          'more-wear-time-will-sharpen-your-foundation',
          foundationChecklistItemMap['wear-building']?.progressDetail,
        ),
      );
    }

    if (
      nextSignalFlags['a-strong-hold-will-add-stability-depth'] &&
      !previousFlags['a-strong-hold-will-add-stability-depth']
    ) {
      pulse.pushPulse(
        createFoundationGuidancePulse(
          'a-strong-hold-will-add-stability-depth',
          foundationChecklistItemMap['strong-hold']?.progressDetail,
        ),
      );
    }

    previousFoundationCompletedIdsRef.current = completedIds;
    previousFoundationHiddenCompletedIdsRef.current = hiddenCompletedIds;
    foundationSignalFlagsRef.current = nextSignalFlags;
  }, [
    foundationChecklistEvaluation,
    foundationChecklistItemMap,
    foundationHiddenEvaluation.milestones,
    foundationHiddenMilestoneMap,
    isAppOpen,
    isOnboardingComplete,
    pulse,
  ]);

  const amoraTourSteps = useMemo<ArcAmoraTourStep[]>(
    () => [
      {
        id: 'home-header',
          title: 'This is your Cinder HUB overview',
        summary: 'Your private account view, profile stage, and Amora access all live here.',
        detail: 'It is the quickest place to orient yourself before you move deeper into the app.',
      },
      {
        id: 'edge-score',
        title: 'This is EDGE SCORE',
        summary: 'EDGE is the flagship index that brings your recent pattern into one clear score.',
        detail: 'It becomes more meaningful as calibration and history build.',
      },
      {
        id: 'live-chart',
        title: 'This is Live',
        summary: 'Live shows what is happening right now in the current signal.',
        detail: 'Use it when you want the clearest view of immediate change.',
      },
      {
        id: 'trend-view',
        title: 'This is Trend View',
        summary: 'Trend View is the longer memory of that same signal over time.',
        detail: 'It helps you see what is improving, what is repeating, and what is changing.',
      },
      {
        id: 'insight-grid',
        title: 'These are your deeper signal views',
        summary: 'These tiles open focused breakdowns for resting state, sessions, signal interpretation, and nocturnal pattern.',
        detail: 'Think of them as the structured layers beneath the main score and charts.',
      },
      {
        id: 'session-archive',
        title: 'This is your archive',
        summary: 'Sessions are captured automatically when meaningful activity is detected.',
        detail: 'Over time, this becomes your reference for repeatable results and stronger insight.',
      },
      {
        id: 'bottom-nav',
        title: 'This is your navigation bar',
        summary: 'Use these tabs to move between Home, Sessions, Insights, and Profile, with Archive available inside Profile.',
        detail: 'The whole system stays organized around these sections as more data comes online.',
      },
    ],
    [],
  );
  const currentAmoraTourStep = amoraTourSteps[amoraTourStepIndex] ?? amoraTourSteps[0];
  const amoraHostActive = false;
  const showHubDashboardBackground = isAppOpen && isOnboardingComplete;
  const appShellBackground = `linear-gradient(180deg, ${hexToRgba(foundationTheme.text.inverse, 0.16)} 0%, ${hexToRgba(foundationTheme.text.inverse, 0.24)} 48%, ${hexToRgba(foundationTheme.text.inverse, 0.4)} 100%)`;
  const showSimulationPanel = showHubDashboardBackground;
  const amoraUnlocked = appData.calibration.progress >= 1;
  const amoraFeatureActive = false;
  const showAmoraWelcomeIntro =
    amoraHostActive &&
    amoraFeatureActive &&
    screen === 'home' &&
    !hasSeenAmoraIntro &&
    !showLaunch;
  const showAmoraIconIntro =
    amoraHostActive &&
    amoraFeatureActive &&
    screen === 'home' &&
    hasSeenAmoraIntro &&
    !hasSeenAmoraIconIntro &&
    !showLaunch;
  const showAmoraUnlockBriefing =
    amoraHostActive &&
    amoraFeatureActive &&
    amoraUnlocked &&
    screen === 'home' &&
    !showLaunch &&
    !showAmoraWelcomeIntro &&
    !showAmoraIconIntro &&
    !hasSeenAmoraUnlockReveal;
  const amoraSheetOpen =
    isAmoraOpen && !showAmoraWelcomeIntro && !showAmoraIconIntro && !isAmoraTourActive;
  const canShowProactiveAmora =
    amoraHostActive &&
    amoraFeatureActive &&
    amoraSettings.proactiveInsights &&
    amoraSettings.guidanceLevel !== 'minimal';
  const amoraGuidanceContextKey = [
    amoraTopic,
    amoraSettings.partnerAwarenessGuidance,
    appData.recordedSessionCount,
    appData.latestMotionSession?.id ?? 'no-motion',
    latestPersonalBestSession?.id ?? 'no-best',
  ].join(':');
  const showFloatingAmoraAccess =
    amoraFeatureActive &&
    amoraHostActive &&
    !showLaunch &&
    (!isDeviceConnected || screen !== 'home');
  const resetFoundationPulseTracking = useCallback(() => {
    didHydrateFoundationPulsesRef.current = false;
    previousFoundationCompletedIdsRef.current = new Set();
    previousFoundationHiddenCompletedIdsRef.current = new Set();
    foundationSignalFlagsRef.current = {};
    pulse.resetPulseState();
  }, [pulse]);
  const clearSyncTimers = useCallback(() => {
    syncTimerRefs.current.forEach(timer => window.clearTimeout(timer));
    syncTimerRefs.current = [];
  }, []);
  const currentSyncState: ArcDeviceSyncState = isImportingBufferedData
    ? 'importing'
    : showReconciledSyncState
      ? 'reconciled'
      : pendingBufferedMinutes > 0
        ? 'pending'
        : 'up_to_date';
  const pendingImportLabel = formatBufferedCaptureLabel(pendingBufferedMinutes);
  const lastSyncAgeMinutes =
    lastSyncTimestamp == null
      ? null
      : Math.max(0, Math.round((simulatedTimestamp - lastSyncTimestamp) / 60_000));
  const lastDeviceContactAgeMinutes =
    lastDeviceContactTimestamp == null
      ? null
      : Math.max(0, Math.round((simulatedTimestamp - lastDeviceContactTimestamp) / 60_000));
  const deviceMemoryFree = Math.round(
    clampNumber(100 - (pendingBufferedMinutes / DEVICE_MEMORY_CAPACITY_MINUTES) * 100, 8, 100),
  );
  const deviceStatusRows = useMemo(
    () => [
      {
        label: 'DEVICE',
        value: isDeviceConnected ? 'Connected' : 'Disconnected',
      },
      {
        label: 'CAPTURE',
        value: isDeviceConnected ? 'Live' : offlineCaptureEnabled ? 'Buffered on device' : 'Standby',
      },
      {
        label: 'SYNC',
        value:
          currentSyncState === 'importing'
            ? 'Importing stored data'
            : currentSyncState === 'pending'
              ? 'Pending'
              : currentSyncState === 'reconciled'
                ? 'Reconciled'
                : 'Up to date',
      },
    ],
    [currentSyncState, isDeviceConnected, offlineCaptureEnabled],
  );
  const hubSyncBanner = useMemo(() => {
    if (currentSyncState === 'importing') {
      return {
        title: 'Stored capture detected',
        detail: 'Syncing missed data from your device…',
      };
    }

    if (currentSyncState === 'reconciled') {
      return {
        title: 'Sync complete',
        detail: 'Timeline updated',
      };
    }

    return null;
  }, [currentSyncState]);
  const simulationSyncLabel =
    currentSyncState === 'importing'
      ? 'Importing'
      : currentSyncState === 'pending'
        ? 'Pending'
        : currentSyncState === 'reconciled'
          ? 'Reconciled'
          : 'None';
  const selectedPerformancePresetLabel =
    performancePresets.find(option => option.id === simulationPerformancePreset)?.shortLabel ?? 'Average';
  const selectedTimescalePreset =
    SIMULATION_TIMESCALE_PRESETS.find(option => option.value === simulationTimescale) ?? {
      value: 1 as ArcSimulationTimescalePreset,
      label: '1x',
      description: 'Default pace',
    };
  const simulationTimescaleLabel = selectedTimescalePreset.label;
  const simulationRateLabel = formatSimulationRateLabel(simulationClock.simulatedMinutesPerRealSecond);
  const simulationContinuitySummary = isDeviceConnected
    ? offlineCaptureEnabled
      ? 'Connected • capture active'
      : 'Connected • capture paused'
    : offlineCaptureEnabled
      ? 'Away • recording on device'
      : 'Disconnected • paused';
  const simulationContinuityNote = !isDeviceConnected
    ? offlineCaptureEnabled
      ? 'Recording continues on device until the link returns.'
      : 'Capture is paused until the device reconnects.'
    : currentSyncState === 'importing'
      ? 'Buffered capture is being merged back into the timeline.'
      : 'Live telemetry is active and capture remains continuous.';
  const simulationSyncDetail =
    pendingBufferedMinutes > 0
      ? `${pendingImportLabel} stored on device`
      : currentSyncState === 'reconciled'
        ? 'Timeline updated'
        : 'No buffered import waiting';
  const simulationSyncSummary =
    currentSyncState === 'pending'
      ? `${deviceBacklogPreset} • pending`
      : currentSyncState === 'importing'
        ? 'Importing backlog'
        : currentSyncState === 'reconciled'
          ? 'Reconciled'
          : `${deviceBacklogPreset} • ready`;
  const activeEdgeCardShapePoints = edgeCardShapeEditorEnabled ? edgeCardShapeDraftPoints : edgeCardShapePoints;
  const edgeCardClipPath = useMemo(() => buildCardShapeClipPath(activeEdgeCardShapePoints), [activeEdgeCardShapePoints]);
  const edgeCardShapeIsDirty = useMemo(
    () => serializeCardShapePoints(edgeCardShapeDraftPoints) !== serializeCardShapePoints(edgeCardShapePoints),
    [edgeCardShapeDraftPoints, edgeCardShapePoints],
  );
  const handleOpenEdgeCardShapeEditor = useCallback(() => {
    setEdgeCardShapeDraftPoints(edgeCardShapePoints);
    setActiveEdgeEditorTab('shape');
    setEdgeCardMoveEditorEnabled(false);
    setEdgeCardShapeSelectedPointIndex(null);
    setEdgeCardShapeCopyStatus('idle');
    setEdgeCardShapeEditorEnabled(true);
  }, [edgeCardShapePoints]);
  const handleCloseEdgeCardShapeEditor = useCallback(() => {
    setEdgeCardShapeDraftPoints(edgeCardShapePoints);
    setEdgeCardShapeSelectedPointIndex(null);
    setEdgeCardShapeCopyStatus('idle');
    setEdgeCardShapeEditorEnabled(false);
  }, [edgeCardShapePoints]);
  const handleToggleEdgeCardMoveEditor = useCallback(() => {
    setActiveEdgeEditorTab('move');
    setEdgeCardShapeEditorEnabled(false);
    setEdgeCardMoveEditorEnabled(current => !current);
  }, []);
  const handleResetEdgeCardLayout = useCallback(() => {
    setEdgeCardLayout(DEFAULT_EDGE_CARD_LAYOUT);
  }, []);
  const handleFinalizeEdgeCardShape = useCallback(() => {
    setEdgeCardShapePoints(edgeCardShapeDraftPoints);
    setEdgeCardShapeSelectedPointIndex(null);
    setEdgeCardShapeCopyStatus('idle');
    setEdgeCardShapeEditorEnabled(false);
  }, [edgeCardShapeDraftPoints]);
  const handleRevertEdgeCardShapeDraft = useCallback(() => {
    setEdgeCardShapeDraftPoints(edgeCardShapePoints);
    setEdgeCardShapeSelectedPointIndex(null);
    setEdgeCardShapeCopyStatus('idle');
  }, [edgeCardShapePoints]);
  const handleResetEdgeCardShape = useCallback(() => {
    setEdgeCardShapeDraftPoints(DEFAULT_EDGE_CARD_SHAPE_POINTS);
    setEdgeCardShapeSelectedPointIndex(null);
    setEdgeCardShapeCopyStatus('idle');
  }, []);
  const handleAddEdgeCardShapePoint = useCallback(() => {
    const insertionIndex = edgeCardShapeSelectedPointIndex ?? 0;
    const nextPoints = insertCardShapePointAfter(edgeCardShapeDraftPoints, insertionIndex);
    setEdgeCardShapeDraftPoints(nextPoints);
    setEdgeCardShapeSelectedPointIndex(Math.min(insertionIndex + 1, nextPoints.length - 1));
    setEdgeCardShapeCopyStatus('idle');
  }, [edgeCardShapeDraftPoints, edgeCardShapeSelectedPointIndex]);
  const handleCopyEdgeCardShape = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      return;
    }

    void navigator.clipboard.writeText(edgeCardClipPath).then(() => {
      setEdgeCardShapeCopyStatus('copied');
    });
  }, [edgeCardClipPath]);
  const activeSimulationPanelFolder =
    openSimulationPanelFolder === 'sync'
      ? 'continuity'
      : openSimulationPanelFolder === 'shape'
        ? 'profile'
      : openSimulationPanelFolder ?? 'profile';
  const simulationPanelFolders = [
    { id: 'profile', label: 'Profile', summary: selectedPerformancePresetLabel },
    { id: 'continuity', label: 'Continuity', summary: isDeviceConnected ? 'Live link' : 'Away' },
    { id: 'timescale', label: 'Timescale', summary: simulationTimescaleLabel },
    { id: 'actions', label: 'Actions', summary: `${simulationTimescaleLabel} • ${isLiveSimulationRunning ? 'Running' : 'Utilities'}` },
    { id: 'pulse', label: 'Pulse', summary: pulse.activePulse ? pulse.activePulse.title : `${pulse.pulseQueue.length} queued` },
  ] satisfies Array<{ id: ArcSimulationPanelFolderId; label: string; summary: string }>;
  const liveSyncPresentation = useMemo(() => {
    if (currentSyncState === 'importing') {
      return {
        pillLabel: 'SYNCING',
        statusLine: 'Stored capture detected',
        detailLine: 'Importing missed data',
      };
    }

    if (!isDeviceConnected) {
      return {
        pillLabel: 'BUFFERED',
        statusLine: `Last device contact ${formatRelativeSyncAgeLabel(lastDeviceContactAgeMinutes)}`,
        detailLine: offlineCaptureEnabled
          ? `Capture continues on device memory${pendingBufferedMinutes > 0 ? ` • ${pendingImportLabel}` : ''}`
          : 'Capture is paused until the device reconnects',
      };
    }

    if (currentSyncState === 'reconciled') {
      return {
        pillLabel: 'UP TO DATE',
        statusLine: 'Sync complete just now',
        detailLine: 'Timeline updated',
      };
    }

    return {
      pillLabel: 'LIVE',
      statusLine: 'Real-time telemetry active',
      detailLine: '',
    };
  }, [
    currentSyncState,
    isDeviceConnected,
    lastDeviceContactAgeMinutes,
    lastSyncAgeMinutes,
    offlineCaptureEnabled,
    pendingBufferedMinutes,
    pendingImportLabel,
  ]);
  const batteryChargingNow =
    isDeviceConnected &&
    deviceMemoryFree < 99 &&
    !isLiveSimulationRunning &&
    (simulationClock.simulatedDate.getHours() >= 22 || simulationClock.simulatedDate.getHours() < 6);
  const batteryDetailSnapshot = useMemo(
    () =>
      resolveArcBatteryState({
        simulationState: {
          batteryPercent: deviceMemoryFree,
          deviceConnected: isDeviceConnected,
          isCharging: batteryChargingNow,
          nowTimestamp: simulatedTimestamp,
          lastChargedTimestamp: isDeviceConnected ? null : lastSyncTimestamp ?? lastDeviceContactTimestamp ?? null,
          protocolEnabled: isDeviceConnected && batteryChargingNow && deviceMemoryFree < 60,
        },
      }),
    [
      batteryChargingNow,
      deviceMemoryFree,
      isDeviceConnected,
      lastDeviceContactTimestamp,
      lastSyncTimestamp,
      simulatedTimestamp,
    ],
  );
  const tabEnabled: Record<ArcTabId, boolean> = {
    home: true,
    sessions: true,
    insights: true,
    profile: true,
  };

  const captureAutonomousDaytimeSessions = useCallback((
    events: ArcAutonomousDaytimeEventSummary[],
    referenceTimestamp = simulatedTimestamp,
  ) => {
    if (events.length === 0) {
      return;
    }

    const sessions = events
      .map(event => createAutonomousDaytimeSession(event, appData.thresholdModel, simulationPerformancePreset))
      .filter((session): session is Session => session != null);

    if (sessions.length === 0) {
      return;
    }

    setRecordedSessions(previous => {
      let nextSessions = pruneRecordedSessionsToWindow(previous, referenceTimestamp);

      sessions.forEach(session => {
        nextSessions = upsertSessionById(nextSessions, session);
      });

      return pruneRecordedSessionsToWindow(nextSessions, referenceTimestamp);
    });

    setLifetimeRecordedSessions(previous => {
      let nextSessions = previous;
      sessions.forEach(session => {
        nextSessions = upsertSessionById(nextSessions, session);
      });
      return nextSessions;
    });
  }, [appData.thresholdModel, simulatedTimestamp, simulationPerformancePreset]);

  const captureAutonomousNocturnalSessions = useCallback((
    events: ArcAutonomousNocturnalEventSummary[],
    referenceTimestamp = simulatedTimestamp,
  ) => {
    if (events.length === 0) {
      return;
    }

    const sessions = events
      .map(event => createAutonomousNocturnalSession(event, appData.thresholdModel, simulationPerformancePreset))
      .filter((session): session is Session => session != null);

    if (sessions.length === 0) {
      return;
    }

    setRecordedSessions(previous => {
      let nextSessions = pruneRecordedSessionsToWindow(previous, referenceTimestamp);

      sessions.forEach(session => {
        nextSessions = upsertSessionById(nextSessions, session);
      });

      return pruneRecordedSessionsToWindow(nextSessions, referenceTimestamp);
    });

    setLifetimeRecordedSessions(previous => {
      let nextSessions = previous;
      sessions.forEach(session => {
        nextSessions = upsertSessionById(nextSessions, session);
      });
      return nextSessions;
    });
  }, [appData.thresholdModel, simulatedTimestamp, simulationPerformancePreset]);

  const clearTransientUi = useCallback(() => {
    setHoveredPanel(null);
  }, []);

  const openAmora = useCallback((topic: ArcAmoraTopicId) => {
    if (!amoraHostActive || !amoraFeatureActive) {
      return;
    }

    clearTransientUi();
    setIsAmoraTourActive(false);
    setAmoraTopic(topic);
    setIsAmoraExpanded(false);
    setIsAmoraOpen(true);
  }, [amoraFeatureActive, amoraHostActive, clearTransientUi]);

  const closeAmora = useCallback(() => {
    setIsAmoraOpen(false);
    setIsAmoraExpanded(false);
  }, []);

  const markOnboardingGuidanceSeen = useCallback(() => {
    setAmoraGuidanceState(current =>
      current.onboardingShown
        ? current
        : markGuidanceShown(
            current,
            simulationClock.simulatedDate.getTime(),
            Math.max(appData.recordedSessionCount, 1),
            'onboarding',
          ),
    );
  }, [appData.recordedSessionCount, simulationClock.simulatedDate]);

  const dismissAmoraIntro = useCallback(() => {
    markOnboardingGuidanceSeen();
    setHasSeenAmoraIntro(true);
  }, [markOnboardingGuidanceSeen]);

  const dismissAmoraIconIntro = useCallback(() => {
    setHasSeenAmoraIconIntro(true);
  }, []);

  const skipAmoraOnboarding = useCallback(() => {
    markOnboardingGuidanceSeen();
    setHasSeenAmoraIntro(true);
    setHasSeenAmoraIconIntro(true);
  }, [markOnboardingGuidanceSeen]);

  const closeAmoraTour = useCallback(() => {
    if (amoraTourStartTimerRef.current != null) {
      window.clearTimeout(amoraTourStartTimerRef.current);
      amoraTourStartTimerRef.current = null;
    }
    setIsAmoraTourActive(false);
    setAmoraTourStepIndex(0);
    setAmoraTourAnchorRect(null);
  }, []);

  const startAmoraTour = useCallback(() => {
    if (amoraTourStartTimerRef.current != null) {
      window.clearTimeout(amoraTourStartTimerRef.current);
      amoraTourStartTimerRef.current = null;
    }

    setHasSeenAmoraIntro(true);
    setHasSeenAmoraIconIntro(true);
    setIsAmoraOpen(false);
    setIsAmoraExpanded(false);
    setIsAmoraTourActive(false);
    setAmoraTourStepIndex(0);
    setAmoraTourAnchorRect(null);
    amoraTourStartTimerRef.current = window.setTimeout(() => {
      setIsAmoraTourActive(true);
      amoraTourStartTimerRef.current = null;
    }, 180);
  }, []);

  const updateAmoraTourAnchor = useCallback(() => {
    if (!isAmoraTourActive || screen !== 'home') {
      setAmoraTourAnchorRect(null);
      return;
    }

    const shellElement = phoneShellRef.current;
    const scrollElement = phoneScrollRef.current;
    const step = currentAmoraTourStep;

    if (!shellElement || !step) {
      setAmoraTourAnchorRect(null);
      return;
    }

    const anchorElement = shellElement.querySelector<HTMLElement>(`[data-amora-anchor="${step.id}"]`);
    if (!anchorElement) {
      setAmoraTourAnchorRect(null);
      return;
    }

    if (scrollElement) {
      const scrollBounds = scrollElement.getBoundingClientRect();
      const anchorBounds = anchorElement.getBoundingClientRect();
      const topBuffer = 96;
      const bottomBuffer = 148;
      const isOutsideView =
        anchorBounds.top < scrollBounds.top + topBuffer ||
        anchorBounds.bottom > scrollBounds.bottom - bottomBuffer;

      if (isOutsideView) {
        anchorElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }
    }

    const shellBounds = shellElement.getBoundingClientRect();
    const anchorBounds = anchorElement.getBoundingClientRect();

    setAmoraTourAnchorRect({
      top: anchorBounds.top - shellBounds.top,
      left: anchorBounds.left - shellBounds.left,
      width: anchorBounds.width,
      height: anchorBounds.height,
      containerWidth: shellBounds.width,
      containerHeight: shellBounds.height,
    });
  }, [currentAmoraTourStep, isAmoraTourActive, screen]);

  const updateAmoraIntroAnchor = useCallback(() => {
    if (!showAmoraIconIntro || screen !== 'home') {
      setAmoraIntroAnchorRect(null);
      return;
    }

    const shellElement = phoneShellRef.current;
    if (!shellElement) {
      setAmoraIntroAnchorRect(null);
      return;
    }

    const anchorElement = shellElement.querySelector<HTMLElement>('[data-amora-anchor="amora-icon"]');
    if (!anchorElement) {
      setAmoraIntroAnchorRect(null);
      return;
    }

    const shellBounds = shellElement.getBoundingClientRect();
    const anchorBounds = anchorElement.getBoundingClientRect();

    setAmoraIntroAnchorRect({
      top: anchorBounds.top - shellBounds.top,
      left: anchorBounds.left - shellBounds.left,
      width: anchorBounds.width,
      height: anchorBounds.height,
      containerWidth: shellBounds.width,
      containerHeight: shellBounds.height,
    });
  }, [screen, showAmoraIconIntro]);

  const handleAmoraTourNext = useCallback(() => {
    if (amoraTourStepIndex >= amoraTourSteps.length - 1) {
      closeAmoraTour();
      return;
    }

    setAmoraTourStepIndex(current => current + 1);
  }, [amoraTourStepIndex, amoraTourSteps.length, closeAmoraTour]);

  const handleAmoraTourBack = useCallback(() => {
    setAmoraTourStepIndex(current => Math.max(0, current - 1));
  }, []);

  useEffect(() => {
    if (hubConnectionState !== 'connecting') {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setHubConnectionState('connected');
      setHubLinkedDevice('arc');
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [hubConnectionState]);

  useEffect(() => () => {
    clearSyncTimers();
  }, [clearSyncTimers]);

  useEffect(() => {
    if (!isDeviceConnected) {
      return;
    }

    setFrozenLiveTelemetry({
      ...liveTelemetry,
      history: [...liveTelemetry.history],
      historyLinePhases: [...liveTelemetry.historyLinePhases],
    });
    setFrozenLiveSignal({
      ...sharedLiveSignal,
      history: [...sharedLiveSignal.history],
      historyLinePhases: [...sharedLiveSignal.historyLinePhases],
    });
    setLastDeviceContactTimestamp(simulatedTimestamp);
    if (pendingBufferedMinutes === 0 && !isImportingBufferedData) {
      setLastSyncTimestamp(simulatedTimestamp);
    }
  }, [
    isDeviceConnected,
    isImportingBufferedData,
    pendingBufferedMinutes,
    liveTelemetry.currentValue,
    liveTelemetry.history,
    liveTelemetry.historyLinePhases,
    liveTelemetry.isNocturnalActive,
    liveTelemetry.isSimulating,
    liveTelemetry.linePhase,
    liveTelemetry.phase,
    liveTelemetry.stateKey,
    liveTelemetry.trend,
    sharedLiveSignal.currentValue,
    sharedLiveSignal.history,
    sharedLiveSignal.historyLinePhases,
    sharedLiveSignal.isNocturnalActive,
    sharedLiveSignal.isSimulating,
    sharedLiveSignal.linePhase,
    sharedLiveSignal.phase,
    sharedLiveSignal.simulateEvent,
    simulatedTimestamp,
  ]);

  useEffect(() => {
    const canTrackDeviceContinuity =
      isAppOpen &&
      isOnboardingComplete &&
      hasStartedDashboardClock;

    const currentMinute = simulationClock.elapsedSimulatedMinutes;

    if (!canTrackDeviceContinuity) {
      lastDeviceCaptureMinuteRef.current = currentMinute;
      return;
    }

    if (lastDeviceCaptureMinuteRef.current == null) {
      lastDeviceCaptureMinuteRef.current = currentMinute;
      return;
    }

    const elapsedMinutes = currentMinute - lastDeviceCaptureMinuteRef.current;
    lastDeviceCaptureMinuteRef.current = currentMinute;

    if (elapsedMinutes <= 0) {
      return;
    }

    if (isDeviceConnected) {
      setSyncedCaptureMinutes(previous => previous + elapsedMinutes);
      return;
    }

    if (offlineCaptureEnabled) {
      setPendingBufferedMinutes(previous => previous + elapsedMinutes);
      setShowReconciledSyncState(false);
    }
  }, [
    hasStartedDashboardClock,
    isAppOpen,
    isDeviceConnected,
    isOnboardingComplete,
    offlineCaptureEnabled,
    simulationClock.elapsedSimulatedMinutes,
  ]);

  useEffect(() => {
    if (!showReconciledSyncState || pendingBufferedMinutes > 0) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setShowReconciledSyncState(false);
      setSyncVisualProgress(0);
    }, SYNC_RECONCILED_VISIBLE_MS);

    return () => window.clearTimeout(timer);
  }, [pendingBufferedMinutes, showReconciledSyncState]);

  useEffect(() => {
    setIsLiveSimulationRunning(liveTelemetry.isSimulating);
  }, [liveTelemetry.isSimulating]);

  useEffect(() => {
    if (amoraFeatureActive && amoraHostActive) {
      return;
    }

    if (amoraTourStartTimerRef.current != null) {
      window.clearTimeout(amoraTourStartTimerRef.current);
      amoraTourStartTimerRef.current = null;
    }
    setIsAmoraOpen(false);
    setIsAmoraExpanded(false);
    setIsAmoraTourActive(false);
  }, [amoraFeatureActive, amoraHostActive]);

  useEffect(() => {
    const justUnlocked = amoraUnlocked && !lastAmoraUnlockedRef.current;
    if (justUnlocked) {
      setHasSeenAmoraUnlockReveal(false);
    }
    lastAmoraUnlockedRef.current = amoraUnlocked;
  }, [amoraUnlocked]);

  useEffect(() => {
    if (!showAmoraUnlockBriefing) {
      return;
    }

    setAmoraTopic('home');
    setIsAmoraExpanded(false);
    setIsAmoraTourActive(false);
    setIsAmoraOpen(true);
    setHasSeenAmoraUnlockReveal(true);
  }, [showAmoraUnlockBriefing]);

  useEffect(() => {
    try {
      window.localStorage.setItem(AMORA_WELCOME_INTRO_STORAGE_KEY, hasSeenAmoraIntro ? 'true' : 'false');
    } catch {
      // Ignore storage failures in the mock environment.
    }
  }, [hasSeenAmoraIntro]);

  useEffect(() => {
    try {
      window.localStorage.setItem(AMORA_ICON_INTRO_STORAGE_KEY, hasSeenAmoraIconIntro ? 'true' : 'false');
    } catch {
      // Ignore storage failures in the mock environment.
    }
  }, [hasSeenAmoraIconIntro]);

  useEffect(() => {
    try {
      window.localStorage.setItem(AMORA_UNLOCK_REVEAL_STORAGE_KEY, hasSeenAmoraUnlockReveal ? 'true' : 'false');
    } catch {
      // Ignore storage failures in the mock environment.
    }
  }, [hasSeenAmoraUnlockReveal]);

  useEffect(() => {
    if (!showAmoraIconIntro) {
      setAmoraIntroAnchorRect(null);
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      updateAmoraIntroAnchor();
    });

    const handleResize = () => updateAmoraIntroAnchor();
    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [showAmoraIconIntro, updateAmoraIntroAnchor]);

  useEffect(() => {
    return () => {
      if (amoraTourStartTimerRef.current != null) {
        window.clearTimeout(amoraTourStartTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isAmoraTourActive || screen !== 'home') {
      setAmoraTourAnchorRect(null);
      return;
    }

    const refreshAnchor = () => {
      window.requestAnimationFrame(updateAmoraTourAnchor);
    };

    refreshAnchor();

    const handleResize = () => refreshAnchor();
    const scrollElement = phoneScrollRef.current;

    window.addEventListener('resize', handleResize);
    scrollElement?.addEventListener('scroll', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      scrollElement?.removeEventListener('scroll', handleResize);
    };
  }, [isAmoraTourActive, screen, updateAmoraTourAnchor]);

  useEffect(() => {
    if (screen === 'home' || !isAmoraTourActive) {
      return;
    }

    closeAmoraTour();
  }, [closeAmoraTour, isAmoraTourActive, screen]);

  useEffect(() => {
    if (!amoraSheetOpen) {
      setActiveAmoraGuidanceNote(null);
      setActiveAmoraGuidanceKey(null);
      return;
    }

    if (activeAmoraGuidanceKey === amoraGuidanceContextKey) {
      return;
    }

    const nextNote = maybeComposeGuidanceMessage({
      topic: amoraTopic,
      latestMotionSession: appData.latestMotionSession,
      latestPersonalBestSession,
      motionSessions,
      motionSessionCount: motionSessions.length,
      guidanceState: amoraGuidanceState,
      guidanceMode: amoraSettings.partnerAwarenessGuidance,
      currentTime: simulatedTimestamp,
      sessionIndex: Math.max(appData.recordedSessionCount, 1),
    });

    setActiveAmoraGuidanceNote(nextNote);
    setActiveAmoraGuidanceKey(amoraGuidanceContextKey);

    if (nextNote) {
      setAmoraGuidanceState(current =>
        markGuidanceShown(
          current,
          simulatedTimestamp,
          Math.max(appData.recordedSessionCount, 1),
          nextNote.type,
        ),
      );
    }
  }, [
    activeAmoraGuidanceKey,
    amoraGuidanceContextKey,
    amoraGuidanceState,
    amoraSettings.partnerAwarenessGuidance,
    amoraSheetOpen,
    amoraTopic,
    appData.latestMotionSession,
    appData.recordedSessionCount,
    latestPersonalBestSession,
    motionSessions,
    simulatedTimestamp,
  ]);

  useEffect(() => {
    if (!canShowProactiveAmora || hasSeenFirstEdgeExplanation || screen !== 'edgescore-details') {
      return;
    }

    setHasSeenFirstEdgeExplanation(true);
    openAmora(appData.edgeScore.unlocked ? 'edge-score' : 'calibration-locked');
  }, [
    canShowProactiveAmora,
    appData.edgeScore.unlocked,
    hasSeenFirstEdgeExplanation,
    openAmora,
    screen,
  ]);

  useEffect(() => {
    if (
      !canShowProactiveAmora ||
      hasSeenFirstSessionExplanation ||
      screen !== 'sessions' ||
      appData.recordedSessionCount <= 0
    ) {
      return;
    }

    setHasSeenFirstSessionExplanation(true);
    openAmora(appData.recordedSessionCount === 1 ? 'first-session' : 'event-archive');
  }, [
    canShowProactiveAmora,
    appData.recordedSessionCount,
    hasSeenFirstSessionExplanation,
    openAmora,
    screen,
  ]);

  useEffect(() => {
    if (
      !canShowProactiveAmora ||
      isAmoraOpen ||
      showAmoraWelcomeIntro ||
      showAmoraIconIntro ||
      isAmoraTourActive ||
      (screen !== 'home' && screen !== 'sessions')
    ) {
      return;
    }

    const nextTopic = getProactiveGuidanceTopic({
      latestMotionSession: appData.latestMotionSession,
      latestPersonalBestSession,
      motionSessions,
      guidanceState: amoraGuidanceState,
      guidanceMode: amoraSettings.partnerAwarenessGuidance,
      currentTime: simulatedTimestamp,
      sessionIndex: Math.max(appData.recordedSessionCount, 1),
    });

    if (!nextTopic) {
      return;
    }

    openAmora(nextTopic as ArcAmoraTopicId);
  }, [
    amoraGuidanceState,
    amoraSettings.partnerAwarenessGuidance,
    appData.latestMotionSession,
    appData.recordedSessionCount,
    canShowProactiveAmora,
    isAmoraOpen,
    isAmoraTourActive,
    latestPersonalBestSession,
    motionSessions,
    openAmora,
    screen,
    showAmoraIconIntro,
    showAmoraWelcomeIntro,
    simulatedTimestamp,
  ]);

  useEffect(() => {
    const canCaptureAutonomousDaytime =
      isAppOpen &&
      isOnboardingComplete &&
      isDeviceConnected &&
      hasStartedDashboardClock;

    if (!canCaptureAutonomousDaytime) {
      lastAutonomousDaytimeCaptureRef.current = null;
      return;
    }

    const currentTimestamp = simulationClock.simulatedDate.getTime();

    if (lastAutonomousDaytimeCaptureRef.current == null || currentTimestamp <= lastAutonomousDaytimeCaptureRef.current) {
      lastAutonomousDaytimeCaptureRef.current = currentTimestamp;
      return;
    }

    const nextEvents = collectAutonomousDaytimeEventsBetween(
      lastAutonomousDaytimeCaptureRef.current,
      currentTimestamp,
      { autonomousDaytimeEnabled },
    );
    const nextNocturnalEvents = collectAutonomousNocturnalEventsBetween(
      lastAutonomousDaytimeCaptureRef.current,
      currentTimestamp,
      appData.thresholdModel,
    );

    if (nextEvents.length > 0) {
      setAutonomousDaytimeEvents(previous => mergeAutonomousDaytimeEvents(previous, nextEvents));
      captureAutonomousDaytimeSessions(nextEvents, currentTimestamp);
    }

    if (nextNocturnalEvents.length > 0) {
      captureAutonomousNocturnalSessions(nextNocturnalEvents, currentTimestamp);
    }

    lastAutonomousDaytimeCaptureRef.current = currentTimestamp;
  }, [
    captureAutonomousDaytimeSessions,
    captureAutonomousNocturnalSessions,
    appData.thresholdModel,
    autonomousDaytimeEnabled,
    hasStartedDashboardClock,
    isAppOpen,
    isDeviceConnected,
    isOnboardingComplete,
    simulationClock.simulatedDate,
  ]);

  useEffect(() => {
    const canAccumulateTrend =
      isAppOpen &&
      isOnboardingComplete &&
      isDeviceConnected &&
      hasStartedDashboardClock;

    if (!canAccumulateTrend) {
      lastTrendSampleBucketRef.current = null;
      return;
    }

    const currentBucket = Math.floor(simulationClock.elapsedSimulatedMinutes / TREND_HISTORY_SAMPLE_MINUTES);
    if (lastTrendSampleBucketRef.current === currentBucket) {
      return;
    }

    lastTrendSampleBucketRef.current = currentBucket;

    setTrendHistory(previous => {
      const nextPoint: ArcTrendHistoryPoint = {
        timestamp: simulationClock.simulatedDate.getTime(),
        value: liveTelemetry.currentValue,
        linePhase: liveTelemetry.linePhase,
      };

      if (previous[previous.length - 1]?.timestamp === nextPoint.timestamp) {
        return previous;
      }

      const nextHistory = [...previous, nextPoint];
      return nextHistory.slice(-MAX_TREND_HISTORY_POINTS);
    });
  }, [
    hasStartedDashboardClock,
    isAppOpen,
    isDeviceConnected,
    isOnboardingComplete,
    liveTelemetry.currentValue,
    liveTelemetry.linePhase,
    simulationClock.elapsedSimulatedMinutes,
    simulationClock.simulatedDate,
  ]);

  useEffect(() => {
    setRecordedSessions(previous => {
      const nextSessions = pruneRecordedSessionsToWindow(previous, simulatedTimestamp);
      return nextSessions.length === previous.length ? previous : nextSessions;
    });
  }, [simulatedTimestamp]);

  const navigate = useCallback((target: ArcScreen) => {
    clearTransientUi();
    setScreenHistory(prev => [...prev, screen]);
    setScreen(target);
  }, [clearTransientUi, screen]);

  const handlePulseAction = useCallback((pulseItem: PulseItem) => {
    void pulseItem;
    navigate('pulse-mailbox');
  }, [navigate]);

  const goBack = useCallback(() => {
    clearTransientUi();
    const prev = screenHistory[screenHistory.length - 1];
    if (prev) {
      setScreenHistory(history => history.slice(0, -1));
      setScreen(prev);
      return;
    }
    setScreen('home');
  }, [clearTransientUi, screenHistory]);

  const handleTabClick = (tabId: ArcTabId) => {
    clearTransientUi();
    setScreenHistory([]);
    setScreen(tabToScreen[tabId]);
  };

  const upsertRecordedSession = useCallback((session: Session) => {
    const referenceTimestamp = session.capturedAt ?? simulatedTimestamp;
    setRecordedSessions(previous =>
      pruneRecordedSessionsToWindow(
        upsertSessionById(previous, session),
        referenceTimestamp,
      ),
    );
    setLifetimeRecordedSessions(previous => upsertSessionById(previous, session));
  }, [simulatedTimestamp]);

  const openLiveSessionDetails = useCallback((session: Session) => {
    clearTransientUi();
    upsertRecordedSession(session);
    setScreenHistory(['sessions']);
    setScreen(`session-detail:${session.id}`);
  }, [clearTransientUi, upsertRecordedSession]);

  const handleSessionCaptured = useCallback((session: Session) => {
    upsertRecordedSession(session);
  }, [upsertRecordedSession]);

  useEffect(() => {
    const canCaptureLiveSessions =
      isAppOpen &&
      isOnboardingComplete &&
      isDeviceConnected &&
      hasStartedDashboardClock &&
      screen !== 'live-detail';

    if (!canCaptureLiveSessions || liveTelemetry.isNocturnalActive) {
      wasAboveActiveEntryRef.current = false;
      activeSessionStartedAtRef.current = null;
      activeSessionPeakRef.current = appData.thresholdModel.activeEntry;
      return;
    }

    const isActiveManualEvent =
      liveTelemetry.isSimulating && liveTelemetry.currentValue >= appData.thresholdModel.activeEntry;

    if (isActiveManualEvent) {
      if (!wasAboveActiveEntryRef.current) {
        activeSessionStartedAtRef.current = new Date(simulationClock.simulatedDate.getTime());
        activeSessionPeakRef.current = liveTelemetry.currentValue;
      } else {
        activeSessionPeakRef.current = Math.max(activeSessionPeakRef.current, liveTelemetry.currentValue);
      }

      wasAboveActiveEntryRef.current = true;
      return;
    }

    if (wasAboveActiveEntryRef.current) {
      const completedSession = createCompletedSession(
        activeSessionPeakRef.current,
        activeSessionStartedAtRef.current,
        simulationClock.simulatedDate,
        appData.thresholdModel,
        simulationPerformancePreset,
      );
      upsertRecordedSession(completedSession);
      wasAboveActiveEntryRef.current = false;
      activeSessionStartedAtRef.current = null;
      activeSessionPeakRef.current = appData.thresholdModel.activeEntry;
    }
  }, [
    appData.thresholdModel,
    hasStartedDashboardClock,
    isAppOpen,
    isDeviceConnected,
    isOnboardingComplete,
    liveTelemetry.currentValue,
    liveTelemetry.isNocturnalActive,
    liveTelemetry.isSimulating,
    screen,
    simulationClock.simulatedDate,
    upsertRecordedSession,
  ]);

  const handleResetCollectedData = useCallback(() => {
    clearTransientUi();
    clearSyncTimers();
    resetFoundationPulseTracking();
    setRecordedSessions([]);
    setLifetimeRecordedSessions([]);
    setTrendHistory([]);
    setAutonomousDaytimeEvents([]);
    setPendingBufferedMinutes(0);
    setSyncedCaptureMinutes(0);
    setIsImportingBufferedData(false);
    setSyncVisualProgress(0);
    setShowReconciledSyncState(false);
    setLastSyncTimestamp(null);
    setLastDeviceContactTimestamp(null);
    setFrozenLiveTelemetry(null);
    setFrozenLiveSignal(null);
    setSimulatedMinuteOffset(0);
    setFoundationClockOriginMinutes(0);
    lastTrendSampleBucketRef.current = null;
    lastAutonomousDaytimeCaptureRef.current = null;
    lastDeviceCaptureMinuteRef.current = 0;
    setScreenHistory([]);
    setScreen('milestones');
    setIsLiveSimulationRunning(false);
    setIsAmoraOpen(false);
    setIsAmoraTourActive(false);
    setHasSeenAmoraUnlockReveal(false);
    setAmoraGuidanceState(DEFAULT_AMORA_GUIDANCE_STATE);
    setActiveAmoraGuidanceNote(null);
    setActiveAmoraGuidanceKey(null);
    setSimulationClockResetKey(current => current + 1);
  }, [clearSyncTimers, clearTransientUi, resetFoundationPulseTracking]);

  const handleResetCollectedDataInPlace = useCallback(() => {
    clearTransientUi();
    clearSyncTimers();
    resetFoundationPulseTracking();
    setRecordedSessions([]);
    setLifetimeRecordedSessions([]);
    setTrendHistory([]);
    setAutonomousDaytimeEvents([]);
    setPendingBufferedMinutes(0);
    setSyncedCaptureMinutes(0);
    setIsImportingBufferedData(false);
    setSyncVisualProgress(0);
    setShowReconciledSyncState(false);
    setLastSyncTimestamp(null);
    setLastDeviceContactTimestamp(isDeviceConnected ? simulationClock.simulatedDate.getTime() : null);
    setFrozenLiveTelemetry(
      isDeviceConnected
        ? {
            ...liveTelemetry,
            history: [...liveTelemetry.history],
            historyLinePhases: [...liveTelemetry.historyLinePhases],
          }
        : null,
    );
    setFrozenLiveSignal(
      isDeviceConnected
        ? {
            ...sharedLiveSignal,
            history: [...sharedLiveSignal.history],
            historyLinePhases: [...sharedLiveSignal.historyLinePhases],
          }
        : null,
    );
    setProfileOverride(current => {
      if (!current || !('tier' in current)) {
        return current;
      }

      const { tier: _tier, ...rest } = current;
      return rest;
    });
    setFoundationClockOriginMinutes(simulationClock.elapsedSimulatedMinutes);
    lastTrendSampleBucketRef.current = null;
    lastAutonomousDaytimeCaptureRef.current = null;
    lastDeviceCaptureMinuteRef.current = simulationClock.elapsedSimulatedMinutes;
    setIsLiveSimulationRunning(false);
  }, [
    clearSyncTimers,
    clearTransientUi,
    isDeviceConnected,
    liveTelemetry,
    resetFoundationPulseTracking,
    sharedLiveSignal,
    simulationClock.elapsedSimulatedMinutes,
    simulationClock.simulatedDate,
  ]);

  const handleOpenDeviceHub = useCallback(() => {
    clearTransientUi();
    setScreen('home');
    setScreenHistory([]);
    setIsDeviceConnected(false);
    setHubLinkedDevice('arc');
    setHubConnectionState('idle');
    setLastDeviceContactTimestamp(simulationClock.simulatedDate.getTime());
    setShowReconciledSyncState(false);
  }, [clearTransientUi, simulationClock.simulatedDate]);

  const openArcApp = useCallback(() => {
    clearTransientUi();
    clearSyncTimers();
    setScreen('home');
    setScreenHistory([]);
    setIsAppOpen(true);
    setHasStartedDashboardClock(false);
    setIsOnboardingComplete(false);
    setIsDeviceConnected(false);
    setHubLinkedDevice(null);
    setHubConnectionState('idle');
    setPendingBufferedMinutes(0);
    setSyncedCaptureMinutes(0);
    setIsImportingBufferedData(false);
    setSyncVisualProgress(0);
    setShowReconciledSyncState(false);
    setLastSyncTimestamp(null);
    setLastDeviceContactTimestamp(null);
    setFrozenLiveTelemetry(null);
    setFrozenLiveSignal(null);
    setTrendHistory([]);
    setAutonomousDaytimeEvents([]);
    setSimulatedMinuteOffset(0);
    setFoundationClockOriginMinutes(0);
    lastTrendSampleBucketRef.current = null;
    lastAutonomousDaytimeCaptureRef.current = null;
    lastDeviceCaptureMinuteRef.current = 0;
    setShowLaunch(true);
    setIsLiveSimulationRunning(false);
    setIsAmoraOpen(false);
    setIsAmoraTourActive(false);
    setAmoraTourStepIndex(0);
    setSimulationClockResetKey(current => current + 1);
  }, [clearSyncTimers, clearTransientUi]);

  const handleOnboardingComplete = useCallback((profile?: ArcOnboardingProfile) => {
    clearTransientUi();
    setProfileOverride(profile ?? null);
    setScreen('home');
    setScreenHistory([]);
    setIsOnboardingComplete(true);
    setHasStartedDashboardClock(true);
    setIsDeviceConnected(false);
    setHubLinkedDevice(null);
    setHubConnectionState('idle');
    setPendingBufferedMinutes(0);
    setSyncedCaptureMinutes(0);
    setIsImportingBufferedData(false);
    setSyncVisualProgress(0);
    setShowReconciledSyncState(false);
    setLastSyncTimestamp(null);
    setLastDeviceContactTimestamp(null);
    setFrozenLiveTelemetry(null);
    setFrozenLiveSignal(null);
    setTrendHistory([]);
    setAutonomousDaytimeEvents([]);
    setSimulatedMinuteOffset(0);
    setFoundationClockOriginMinutes(0);
    lastTrendSampleBucketRef.current = null;
    lastAutonomousDaytimeCaptureRef.current = null;
    lastDeviceCaptureMinuteRef.current = 0;
    setIsLiveSimulationRunning(false);
    setIsAmoraOpen(false);
    setIsAmoraTourActive(false);
    setSimulationClockResetKey(current => current + 1);
  }, [clearTransientUi]);

  const handleSkipToHubDashboard = useCallback(() => {
    clearTransientUi();
    setProfileOverride({
      anonymousUsername: 'driftnorth15',
      tier: 'threshold',
    });
    setScreen('home');
    setScreenHistory([]);
    setIsOnboardingComplete(true);
    setHubLinkedDevice('arc');
    setHubConnectionState('connected');
    setHasStartedDashboardClock(true);
    setIsDeviceConnected(true);
    setPendingBufferedMinutes(0);
    setSyncedCaptureMinutes(0);
    setIsImportingBufferedData(false);
    setSyncVisualProgress(0);
    setShowReconciledSyncState(false);
    setLastSyncTimestamp(simulationClock.simulatedDate.getTime());
    setLastDeviceContactTimestamp(simulationClock.simulatedDate.getTime());
    setTrendHistory([]);
    setAutonomousDaytimeEvents([]);
    setSimulatedMinuteOffset(0);
    setFoundationClockOriginMinutes(0);
    lastTrendSampleBucketRef.current = null;
    lastAutonomousDaytimeCaptureRef.current = null;
    lastDeviceCaptureMinuteRef.current = 0;
    setIsLiveSimulationRunning(false);
    setIsAmoraOpen(false);
    setIsAmoraTourActive(false);
    setSimulationClockResetKey(current => current + 1);
  }, [clearTransientUi, simulationClock.simulatedDate]);

  const handleEquipInsignia = useCallback((tier: ArcUserProfileOverride['tier']) => {
    if (!tier) {
      return;
    }

    setProfileOverride(current => ({
      ...(current ?? {}),
      tier,
    }));
  }, []);

  const handleSyncArcFromHub = useCallback(() => {
    if (hubConnectionState !== 'idle') {
      return;
    }

    setHubConnectionState('connecting');
  }, [hubConnectionState]);

  const handleDisconnectDevice = useCallback(() => {
    clearTransientUi();
    clearSyncTimers();

    const seededBacklogMinutes = offlineCaptureEnabled ? DEVICE_BACKLOG_PRESET_MINUTES[deviceBacklogPreset] : 0;
    const disconnectedAt = simulationClock.simulatedDate.getTime();

    setIsDeviceConnected(false);
    setHubLinkedDevice('arc');
    setHubConnectionState('idle');
    setIsImportingBufferedData(false);
    setSyncVisualProgress(0);
    setShowReconciledSyncState(false);
    setLastDeviceContactTimestamp(disconnectedAt);
    setIsLiveSimulationRunning(false);

    if (seededBacklogMinutes > 0) {
      setPendingBufferedMinutes(previous => previous + seededBacklogMinutes);
      setSimulatedMinuteOffset(current => current + seededBacklogMinutes);
      lastDeviceCaptureMinuteRef.current = simulationClock.elapsedSimulatedMinutes + seededBacklogMinutes;
    } else {
      lastDeviceCaptureMinuteRef.current = simulationClock.elapsedSimulatedMinutes;
    }
  }, [
    clearSyncTimers,
    clearTransientUi,
    deviceBacklogPreset,
    offlineCaptureEnabled,
    simulationClock.elapsedSimulatedMinutes,
    simulationClock.simulatedDate,
  ]);

  const handleReconnectAndSync = useCallback(() => {
    clearSyncTimers();
    setHubLinkedDevice('arc');
    setHubConnectionState('connected');
    setHasStartedDashboardClock(true);
    setIsDeviceConnected(true);

    const minutesToImport = pendingBufferedMinutes;
    const syncCompletedAt = simulationClock.simulatedDate.getTime();

    if (minutesToImport <= 0) {
      setIsImportingBufferedData(false);
      setSyncVisualProgress(0);
      setShowReconciledSyncState(false);
      setLastDeviceContactTimestamp(syncCompletedAt);
      setLastSyncTimestamp(syncCompletedAt);
      return;
    }

    const windowEndTimestamp = syncCompletedAt;
    const windowStartTimestamp = windowEndTimestamp - minutesToImport * 60_000;
    const windowStartDate = new Date(windowStartTimestamp);
    const windowEndDate = new Date(windowEndTimestamp);
    const importedTrendPoints = extendTrendHistoryForElapsedWindow({
      existingHistory: [],
      startDate: windowStartDate,
      endDate: windowEndDate,
      currentValue: liveTelemetry.currentValue,
      autonomousDaytimeEnabled,
      performancePreset: simulationPerformancePreset,
    });
    const importChunkSize = Math.max(1, Math.ceil(importedTrendPoints.length / SYNC_IMPORT_STEPS));
    const bufferedDaytimeEvents = collectAutonomousDaytimeEventsBetween(
      windowStartTimestamp,
      windowEndTimestamp,
      { autonomousDaytimeEnabled, performancePreset: simulationPerformancePreset },
    );
    const bufferedNocturnalEvents = collectAutonomousNocturnalEventsBetween(
      windowStartTimestamp,
      windowEndTimestamp,
      appData.thresholdModel,
      { performancePreset: simulationPerformancePreset },
    );

    setIsImportingBufferedData(true);
    setShowReconciledSyncState(false);
    setSyncVisualProgress(0);

    for (let step = 1; step <= SYNC_IMPORT_STEPS; step += 1) {
      const timer = window.setTimeout(() => {
        setSyncVisualProgress(step / SYNC_IMPORT_STEPS);

        if (importedTrendPoints.length > 0) {
          const importedSlice = importedTrendPoints.slice(0, importChunkSize * step);
          setTrendHistory(previous =>
            mergeTrendHistoryWindow(previous, importedSlice, windowStartTimestamp),
          );
        }

        if (step < SYNC_IMPORT_STEPS) {
          return;
        }

        if (bufferedDaytimeEvents.length > 0) {
          setAutonomousDaytimeEvents(previous =>
            mergeAutonomousDaytimeEvents(previous, bufferedDaytimeEvents),
          );
          captureAutonomousDaytimeSessions(bufferedDaytimeEvents, windowEndTimestamp);
        }

        if (bufferedNocturnalEvents.length > 0) {
          captureAutonomousNocturnalSessions(bufferedNocturnalEvents, windowEndTimestamp);
        }

        lastAutonomousDaytimeCaptureRef.current = windowEndTimestamp;
        lastTrendSampleBucketRef.current = Math.floor(
          simulationClock.elapsedSimulatedMinutes / TREND_HISTORY_SAMPLE_MINUTES,
        );
        lastDeviceCaptureMinuteRef.current = simulationClock.elapsedSimulatedMinutes;
        setSyncedCaptureMinutes(previous => previous + minutesToImport);
        setPendingBufferedMinutes(0);
        setIsImportingBufferedData(false);
        setShowReconciledSyncState(true);
        setLastDeviceContactTimestamp(windowEndTimestamp);
        setLastSyncTimestamp(windowEndTimestamp);
      }, step * SYNC_IMPORT_STEP_MS);

      syncTimerRefs.current.push(timer);
    }
  }, [
    appData.thresholdModel,
    autonomousDaytimeEnabled,
    captureAutonomousDaytimeSessions,
    captureAutonomousNocturnalSessions,
    clearSyncTimers,
    liveTelemetry.currentValue,
    pendingBufferedMinutes,
    simulationClock.elapsedSimulatedMinutes,
    simulationClock.simulatedDate,
  ]);

  const handleEnterArcDashboardFromHub = useCallback(() => {
    if (hubLinkedDevice !== 'arc' || hubConnectionState !== 'connected') {
      return;
    }

    clearTransientUi();
    setHasStartedDashboardClock(true);
    setIsDeviceConnected(true);
    setLastDeviceContactTimestamp(simulationClock.simulatedDate.getTime());
    setLastSyncTimestamp(simulationClock.simulatedDate.getTime());
    setScreen('home');
    setScreenHistory([]);
  }, [clearTransientUi, hubConnectionState, hubLinkedDevice, simulationClock.simulatedDate]);

  const handleSimulateEvent = useCallback(() => {
    if (!showHubDashboardBackground || !isDeviceConnected || isLiveSimulationRunning) {
      return;
    }

    sharedLiveSignal.simulateEvent();
  }, [isDeviceConnected, isLiveSimulationRunning, sharedLiveSignal, showHubDashboardBackground]);

  const handleSimulateDay = useCallback(() => {
    if (!showHubDashboardBackground || isLiveSimulationRunning) {
      return;
    }

    if (!isDeviceConnected) {
      setSimulatedMinuteOffset(current => current + SIMULATED_DAY_MINUTES);
      return;
    }

    const startDate = new Date(simulationClock.simulatedDate.getTime());
    const endDate = new Date(startDate.getTime() + SIMULATED_DAY_MINUTES * 60_000);
    const simulatedAutonomousEvents = collectAutonomousDaytimeEventsBetween(startDate.getTime(), endDate.getTime(), {
      autonomousDaytimeEnabled,
      performancePreset: simulationPerformancePreset,
    });
    const simulatedNocturnalEvents = collectAutonomousNocturnalEventsBetween(
      startDate.getTime(),
      endDate.getTime(),
      appData.thresholdModel,
      { performancePreset: simulationPerformancePreset },
    );

    setTrendHistory(previous =>
      extendTrendHistoryForElapsedWindow({
        existingHistory: previous,
        startDate,
        endDate,
        currentValue: liveTelemetry.currentValue,
        autonomousDaytimeEnabled,
        performancePreset: simulationPerformancePreset,
      }),
    );
    if (simulatedAutonomousEvents.length > 0) {
      setAutonomousDaytimeEvents(previous => mergeAutonomousDaytimeEvents(previous, simulatedAutonomousEvents));
      captureAutonomousDaytimeSessions(simulatedAutonomousEvents, endDate.getTime());
    }
    if (simulatedNocturnalEvents.length > 0) {
      captureAutonomousNocturnalSessions(simulatedNocturnalEvents, endDate.getTime());
    }
    lastAutonomousDaytimeCaptureRef.current = endDate.getTime();
    setSimulatedMinuteOffset(current => current + SIMULATED_DAY_MINUTES);
  }, [
    captureAutonomousDaytimeSessions,
    captureAutonomousNocturnalSessions,
    appData.thresholdModel,
    autonomousDaytimeEnabled,
    isDeviceConnected,
    isLiveSimulationRunning,
    liveTelemetry.currentValue,
    showHubDashboardBackground,
    simulationClock.simulatedDate,
  ]);

  const handleSimulateMonth = useCallback(() => {
    if (!showHubDashboardBackground || isLiveSimulationRunning) {
      return;
    }

    if (!isDeviceConnected) {
      setSimulatedMinuteOffset(current => current + SIMULATED_MONTH_MINUTES);
      return;
    }

    const startDate = new Date(simulationClock.simulatedDate.getTime());
    const endDate = new Date(startDate.getTime() + SIMULATED_MONTH_MINUTES * 60_000);
    const simulatedAutonomousEvents = collectAutonomousDaytimeEventsBetween(startDate.getTime(), endDate.getTime(), {
      autonomousDaytimeEnabled,
      performancePreset: simulationPerformancePreset,
    });
    const simulatedNocturnalEvents = collectAutonomousNocturnalEventsBetween(
      startDate.getTime(),
      endDate.getTime(),
      appData.thresholdModel,
      { performancePreset: simulationPerformancePreset },
    );

    setTrendHistory(previous =>
      extendTrendHistoryForElapsedWindow({
        existingHistory: previous,
        startDate,
        endDate,
        currentValue: liveTelemetry.currentValue,
        autonomousDaytimeEnabled,
        performancePreset: simulationPerformancePreset,
      }),
    );
    if (simulatedAutonomousEvents.length > 0) {
      setAutonomousDaytimeEvents(previous => mergeAutonomousDaytimeEvents(previous, simulatedAutonomousEvents));
      captureAutonomousDaytimeSessions(simulatedAutonomousEvents, endDate.getTime());
    }
    if (simulatedNocturnalEvents.length > 0) {
      captureAutonomousNocturnalSessions(simulatedNocturnalEvents, endDate.getTime());
    }
    lastAutonomousDaytimeCaptureRef.current = endDate.getTime();
    setSimulatedMinuteOffset(current => current + SIMULATED_MONTH_MINUTES);
  }, [
    captureAutonomousDaytimeSessions,
    captureAutonomousNocturnalSessions,
    appData.thresholdModel,
    autonomousDaytimeEnabled,
    isDeviceConnected,
    isLiveSimulationRunning,
    liveTelemetry.currentValue,
    showHubDashboardBackground,
    simulationClock.simulatedDate,
  ]);

  const handleLaunchComplete = useCallback(() => {
    setShowLaunch(false);
  }, []);

  const pushDevPriorityPulse = useCallback((priority: PulsePriority) => {
    if (priority === 'low') {
      pulse.pushPulse({
        category: 'guidance',
        priority,
        title: 'Quiet guidance',
        message: 'A little more baseline time would sharpen your current read.',
        source: 'active_focus',
        accentStyle: 'indigo',
        iconType: 'ring',
        isPersistentInHistory: true,
        summaryGroupKey: 'dev-priority-low',
        summaryEligible: true,
        dedupeKey: `dev-priority-low-${Date.now()}`,
        detail: {
          sourceLabel: 'Dev Priority Preview',
          whyItMatters: 'Low priority should feel present but quiet, with restrained graphite emphasis and minimal urgency.',
        },
      });
      return;
    }

    if (priority === 'normal') {
      pulse.pushPulse({
        category: 'insight',
        priority,
        title: 'Standard signal update',
        message: 'Your latest pattern read is settling into a clearer shape.',
        source: 'insight_engine',
        accentStyle: 'iceBlue',
        iconType: 'pulseLine',
        isPersistentInHistory: true,
        summaryGroupKey: 'dev-priority-normal',
        summaryEligible: true,
        dedupeKey: `dev-priority-normal-${Date.now()}`,
        detail: {
          sourceLabel: 'Dev Priority Preview',
          whyItMatters: 'Normal priority is the default live system energy, with a metallic-blue emphasis that feels active but composed.',
        },
      });
      return;
    }

    if (priority === 'high') {
      pulse.pushPulse({
        category: 'accomplishment',
        priority,
        title: 'Major milestone',
        message: 'Your profile just gained a more meaningful calibration layer.',
        source: 'profile_status',
        accentStyle: 'platinumBlue',
        iconType: 'diamond',
        isPersistentInHistory: true,
        summaryGroupKey: 'dev-priority-high',
        summaryEligible: true,
        dedupeKey: `dev-priority-high-${Date.now()}`,
        detail: {
          sourceLabel: 'Dev Priority Preview',
          whyItMatters: 'High priority should read as more meaningful and rewarding, with a deeper emerald emphasis that still stays premium.',
        },
      });
      return;
    }

    pulse.pushPulse({
      category: 'accomplishment',
      priority,
      title: 'Standout event',
      message: 'A rare profile moment just landed with top-tier emphasis.',
      source: 'profile_status',
      accentStyle: 'platinumBlue',
      iconType: 'foundation',
      isPersistentInHistory: true,
      summaryGroupKey: 'dev-priority-very-high',
      summaryEligible: true,
      dedupeKey: `dev-priority-very-high-${Date.now()}`,
      detail: {
        sourceLabel: 'Dev Priority Preview',
        whyItMatters: 'Very High priority is the rarest gold tier and should stand out immediately without becoming loud or gaudy.',
      },
    });
  }, [pulse]);

  const handleTriggerLowPriorityPulse = useCallback(() => {
    pushDevPriorityPulse('low');
  }, [pushDevPriorityPulse]);

  const handleTriggerNormalPriorityPulse = useCallback(() => {
    pushDevPriorityPulse('normal');
  }, [pushDevPriorityPulse]);

  const handleTriggerHighPriorityPulse = useCallback(() => {
    pushDevPriorityPulse('high');
  }, [pushDevPriorityPulse]);

  const handleTriggerVeryHighPriorityPulse = useCallback(() => {
    pushDevPriorityPulse('veryHigh');
  }, [pushDevPriorityPulse]);

  const handleTriggerPulseBurst = useCallback(() => {
    pushDevPriorityPulse('low');
    pushDevPriorityPulse('normal');
    pushDevPriorityPulse('high');
  }, [pushDevPriorityPulse]);

  const handleTriggerPulseSummaryPreview = useCallback(() => {
    pulse.pushPulse({
      category: 'accomplishment',
      priority: 'normal',
      title: 'Foundation update',
      message: 'Wear depth has advanced.',
      source: 'foundation_checklist',
      accentStyle: 'platinumBlue',
      iconType: 'diamond',
      isPersistentInHistory: true,
      summaryGroupKey: 'foundation-accomplishments',
      summaryEligible: true,
      dedupeKey: `dev-foundation-summary-a-${Date.now()}`,
      detail: {
        sourceLabel: 'Foundation',
        whyItMatters: 'This preview forces the summary system to merge multiple accomplishment pulses into a calmer grouped signal.',
      },
    });
    pulse.pushPulse({
      category: 'accomplishment',
      priority: 'normal',
      title: 'Foundation update',
      message: 'Baseline depth has advanced.',
      source: 'foundation_checklist',
      accentStyle: 'platinumBlue',
      iconType: 'diamond',
      isPersistentInHistory: true,
      summaryGroupKey: 'foundation-accomplishments',
      summaryEligible: true,
      dedupeKey: `dev-foundation-summary-b-${Date.now()}`,
      detail: {
        sourceLabel: 'Foundation',
        whyItMatters: 'Grouped pulses keep high activity feeling intelligent instead of spammy.',
      },
    });
  }, [pulse]);

  const handleTriggerFoundationPulseSequence = useCallback(() => {
    const firstWear = foundationChecklistItemMap['first-wear'];
    const baselineStarted = foundationChecklistItemMap['baseline-started'];
    const sessionRange = foundationChecklistItemMap['session-range'];

    if (firstWear) {
      const itemPulse = createFoundationAccomplishmentPulse(firstWear);
      if (itemPulse) {
        pulse.pushPulse(itemPulse);
      }
    }

    pulse.pushPulse(
      createFoundationInsightPulse(
        'baseline-is-building',
        baselineStarted?.progressDetail,
      ),
    );
    pulse.pushPulse(
      createFoundationGuidancePulse(
        'one-more-qualified-session-will-complete-session-range',
        sessionRange?.progressDetail,
      ),
    );
  }, [foundationChecklistItemMap, pulse]);

  const handleTriggerPulseFloodTest = useCallback(() => {
    for (let index = 0; index < 5; index += 1) {
      pulse.pushPulse({
        category: index % 2 === 0 ? 'insight' : 'guidance',
        priority: index === 0 ? 'veryHigh' : index === 1 ? 'high' : 'low',
        title: index % 2 === 0 ? 'Queued insight' : 'Queued guidance',
        message: index % 2 === 0 ? 'This is a queue and throttling preview.' : 'This is a queue restraint preview.',
        source: 'insight_engine',
        accentStyle: index % 2 === 0 ? 'iceBlue' : 'indigo',
        iconType: index % 2 === 0 ? 'pulseLine' : 'ring',
        isPersistentInHistory: true,
        summaryGroupKey: index % 2 === 0 ? 'dev-flood-insight' : 'dev-flood-guidance',
        summaryEligible: true,
        dedupeKey: `dev-flood-${index}-${Date.now()}`,
        detail: {
          sourceLabel: 'Dev Preview',
          whyItMatters: 'Flood testing helps verify the Pulse layer stays composed when several low-value items land together.',
        },
      });
    }
  }, [pulse]);

  const renderScreen = () => {
    if (screen.startsWith('session-detail:')) {
      const sessionId = screen.split(':')[1] || '';
      const selectedSession = appData.sessions.find(session => session.id === sessionId) ?? null;
      return (
        <ArcSessionDetail
          sessionId={sessionId}
          onBack={goBack}
          sessionsData={appData.sessions}
          calibrationComplete={appData.calibration.progress >= 1}
          amoraEnabled={amoraFeatureActive}
          proactiveInsightsEnabled={amoraSettings.proactiveInsights}
          amoraGuidanceLevel={amoraSettings.guidanceLevel}
          onOpenAmora={() =>
            openAmora(
              selectedSession?.type === 'motion'
                ? 'session-motion'
                : selectedSession?.type === 'static'
                  ? 'session-static'
                  : 'nocturnal-insight',
            )
          }
        />
      );
    }

    switch (screen) {
      case 'home':
        return (
          <ArcHomeScreen
            onNavigate={navigate}
            onPanelHover={setHoveredPanel}
            onOpenAmora={openAmora}
            amoraEnabled={amoraFeatureActive}
            proactiveInsightsEnabled={amoraSettings.proactiveInsights}
            amoraGuidanceLevel={amoraSettings.guidanceLevel}
            amoraIntroVisible={showAmoraWelcomeIntro || showAmoraIconIntro}
            toolAssignments={toolAssignments}
            data={appData}
            goalState={foundationGoalState}
            trendHistory={trendHistory}
            trendViewMode={trendViewMode}
            deviceStatusRows={deviceStatusRows}
            syncBanner={hubSyncBanner}
            lastSyncLabel={formatRelativeSyncAgeLabel(lastSyncAgeMinutes)}
            pendingImportLabel={pendingImportLabel}
            deviceMemoryLabel={`${deviceMemoryFree}% free`}
            liveSyncState={liveSyncPresentation}
            liveSyncProgress={syncVisualProgress}
            edgeCardClipPath={edgeCardClipPath}
            edgeCardShapePoints={activeEdgeCardShapePoints}
            edgeCardGlassOpacity={edgeCardGlassOpacity}
            edgeCardGlassBlur={edgeCardGlassBlur}
            edgeCardGlassTintOverride={edgeCardGlassTintOverride}
            edgeCardShapeEditor={{
              enabled: edgeCardShapeEditorEnabled,
              points: edgeCardShapeDraftPoints,
              selectedPointIndex: edgeCardShapeSelectedPointIndex,
              onPointsChange: setEdgeCardShapeDraftPoints,
              onSelectedPointChange: setEdgeCardShapeSelectedPointIndex,
            }}
            edgeCardLayout={edgeCardLayout}
            edgeCardMoveEditor={{
              enabled: edgeCardMoveEditorEnabled,
              layout: edgeCardLayout,
              onLayoutChange: setEdgeCardLayout,
            }}
          />
        );
      case 'battery':
        return <ArcBatteryDetailScreen onBack={goBack} battery={batteryDetailSnapshot} />;
      case 'pulse-mailbox':
        return <ArcPulseMailboxScreen onBack={goBack} onNavigate={navigate} />;
      case 'account-status':
        return <ArcAccountStatusScreen onBack={goBack} data={appData} />;
      case 'current-goal':
        return <ArcCurrentGoalScreen onBack={goBack} data={appData} goalState={foundationGoalState} />;
      case 'sessions':
        return (
          <ArcSessionFeed
            onNavigate={nextScreen => navigate(nextScreen as ArcScreen)}
            sessionsData={appData.sessions}
            calibrationComplete={appData.calibration.progress >= 1}
            amoraEnabled={amoraFeatureActive}
            proactiveInsightsEnabled={amoraSettings.proactiveInsights}
            amoraGuidanceLevel={amoraSettings.guidanceLevel}
            onOpenAmora={() => openAmora(appData.sessions.length === 1 ? 'first-session' : 'event-archive')}
          />
        );
      case 'insignia-inventory':
        return <ArcInsigniaInventoryScreen onBack={goBack} data={appData} onEquipInsignia={handleEquipInsignia} />;
      case 'edgescore-details':
        return (
          <ArcEdgeScoreDetails
            onBack={goBack}
            data={appData}
            amoraEnabled={amoraFeatureActive}
            proactiveInsightsEnabled={amoraSettings.proactiveInsights}
            amoraGuidanceLevel={amoraSettings.guidanceLevel}
            onOpenAmora={() => openAmora(appData.edgeScore.unlocked ? 'edge-score' : 'calibration-locked')}
          />
        );
      case 'live-detail':
        return (
          <ArcLiveDetailScreen
            onBack={goBack}
            liveSignal={effectiveLiveSignal}
            onOpenSessionDetails={openLiveSessionDetails}
            onSessionCaptured={handleSessionCaptured}
            data={appData}
            onSimulationStateChange={setIsLiveSimulationRunning}
            amoraEnabled={amoraFeatureActive}
            proactiveInsightsEnabled={amoraSettings.proactiveInsights}
            amoraGuidanceLevel={amoraSettings.guidanceLevel}
            onOpenAmora={() => openAmora('live-signal')}
          />
        );
      case 'trend-detail':
        return (
          <ArcTrendDetailScreen
            onBack={goBack}
            liveTelemetry={appData.liveTelemetry}
            trendHistory={trendHistory}
            trendMode={trendViewMode}
            thresholdModel={appData.thresholdModel}
            amoraEnabled={amoraFeatureActive}
            proactiveInsightsEnabled={amoraSettings.proactiveInsights}
            amoraGuidanceLevel={amoraSettings.guidanceLevel}
            onOpenAmora={() => openAmora('trend-view')}
          />
        );
      case 'insights':
        return (
          <ArcInsightsScreen
            onBack={goBack}
            toolAssignments={toolAssignments}
            onSetToolPlacement={handleSetToolPlacement}
            onOpenLiveDetail={() => navigate('live-detail')}
            onOpenTrendDetail={() => navigate('trend-detail')}
            amoraEnabled={amoraFeatureActive}
            proactiveInsightsEnabled={amoraSettings.proactiveInsights}
            amoraGuidanceLevel={amoraSettings.guidanceLevel}
            onOpenLiveAmora={() => openAmora('live-signal')}
            onOpenTrendAmora={() => openAmora('trend-view')}
            liveTelemetry={appData.liveTelemetry}
            trendHistory={trendHistory}
            trendMode={trendViewMode}
            thresholdModel={appData.thresholdModel}
            liveSyncState={liveSyncPresentation}
            liveSyncProgress={syncVisualProgress}
          />
        );
      case 'resting':
        return <ArcRestingScreen onBack={goBack} data={appData} />;
      case 'build':
        return <ArcBuildScreen onBack={goBack} data={appData} />;
      case 'active':
        return <ArcActiveScreen onBack={goBack} data={appData} />;
      case 'recovery':
        return <ArcRecoveryScreen onBack={goBack} data={appData} />;
      case 'motion':
        return <ArcMotionScreen onBack={goBack} data={appData} />;
      case 'nocturnal':
        return <ArcNocturnalScreen onBack={goBack} data={appData} />;
      case 'lifetime':
        return <ArcLifetimeScreen onNavigate={nextScreen => navigate(nextScreen as ArcScreen)} data={appData} />;
      case 'milestones':
        return (
          <ArcMilestonesScreen
            onNavigate={nextScreen => navigate(nextScreen as ArcScreen)}
            data={appData}
            onResetData={handleResetCollectedData}
            onOpenDeviceHub={handleOpenDeviceHub}
            amoraSettings={amoraSettings}
            homeScreenLiveViewEnabled={homeScreenLiveViewEnabled}
            homeScreenTrendViewEnabled={homeScreenTrendViewEnabled}
            onToggleAmoraEnabled={() =>
              setAmoraSettings(current => ({
                ...current,
                enabled: !current.enabled,
              }))
            }
            onToggleProactiveInsights={() =>
              setAmoraSettings(current => ({
                ...current,
                proactiveInsights: !current.proactiveInsights,
              }))
            }
            onGuidanceLevelChange={value =>
              setAmoraSettings(current => ({
                ...current,
                guidanceLevel: value,
              }))
            }
            onPartnerAwarenessGuidanceChange={value =>
              setAmoraSettings(current => ({
                ...current,
                partnerAwarenessGuidance: value,
              }))
            }
            onToggleHomeScreenLiveView={() =>
              setHomeScreenLiveViewEnabled(current => !current)
            }
            onToggleHomeScreenTrendView={() =>
              setHomeScreenTrendViewEnabled(current => !current)
            }
            onResetAmoraIntro={() => {
              setHasSeenAmoraIntro(false);
              setHasSeenAmoraIconIntro(false);
              setHasSeenAmoraUnlockReveal(false);
              setAmoraGuidanceState(DEFAULT_AMORA_GUIDANCE_STATE);
              setActiveAmoraGuidanceNote(null);
              setActiveAmoraGuidanceKey(null);
            }}
          />
        );
      default:
        return (
          <ArcHomeScreen
            onNavigate={navigate}
            onPanelHover={setHoveredPanel}
            onOpenAmora={openAmora}
            amoraEnabled={amoraFeatureActive}
            proactiveInsightsEnabled={amoraSettings.proactiveInsights}
            amoraGuidanceLevel={amoraSettings.guidanceLevel}
            amoraIntroVisible={showAmoraWelcomeIntro || showAmoraIconIntro}
            toolAssignments={toolAssignments}
            data={appData}
            goalState={foundationGoalState}
            trendHistory={trendHistory}
            trendViewMode={trendViewMode}
            deviceStatusRows={deviceStatusRows}
            syncBanner={hubSyncBanner}
            lastSyncLabel={formatRelativeSyncAgeLabel(lastSyncAgeMinutes)}
            pendingImportLabel={pendingImportLabel}
            deviceMemoryLabel={`${deviceMemoryFree}% free`}
            liveSyncState={liveSyncPresentation}
            liveSyncProgress={syncVisualProgress}
            edgeCardClipPath={edgeCardClipPath}
            edgeCardShapePoints={activeEdgeCardShapePoints}
            edgeCardGlassOpacity={edgeCardGlassOpacity}
            edgeCardGlassBlur={edgeCardGlassBlur}
            edgeCardGlassTintOverride={edgeCardGlassTintOverride}
            edgeCardShapeEditor={{
              enabled: edgeCardShapeEditorEnabled,
              points: edgeCardShapeDraftPoints,
              selectedPointIndex: edgeCardShapeSelectedPointIndex,
              onPointsChange: setEdgeCardShapeDraftPoints,
              onSelectedPointChange: setEdgeCardShapeSelectedPointIndex,
            }}
            edgeCardLayout={edgeCardLayout}
            edgeCardMoveEditor={{
              enabled: edgeCardMoveEditorEnabled,
              layout: edgeCardLayout,
              onLayoutChange: setEdgeCardLayout,
            }}
          />
        );
    }
  };

  const simulationPanelContent: ReactNode =
    activeSimulationPanelFolder === 'profile' ? (
      <div className="grid grid-cols-2 gap-1.5">
        {performancePresets.map(option => (
          <ArcSimulationPanelLineItem
            key={option.id}
            active={simulationPerformancePreset === option.id}
            label={option.label}
            detail={
              option.id === 'poor'
                ? 'Lower peak and hold profile.'
                : option.id === 'below_average'
                  ? 'Usable but softer pattern.'
                  : option.id === 'average'
                    ? 'Balanced baseline profile.'
                    : option.id === 'strong'
                      ? 'Stronger quality and steadier holds.'
                      : 'Upper-range peaks and support.'
            }
            value={simulationPerformancePreset === option.id ? 'Current' : 'Use'}
            onClick={() => setSimulationPerformancePreset(option.id)}
            tone={simulationPerformancePreset === option.id ? 'accent' : 'neutral'}
          />
        ))}
      </div>
    ) : activeSimulationPanelFolder === 'continuity' ? (
      <div className="grid grid-cols-2 gap-1.5">
        <ArcSimulationPanelLineItem
          label="Device Link"
          detail={isDeviceConnected ? 'Disconnect the wearable link.' : 'Reconnect live telemetry.'}
          value={isDeviceConnected ? 'Connected' : 'Disconnected'}
          onClick={isDeviceConnected ? handleDisconnectDevice : handleReconnectAndSync}
          active={isDeviceConnected}
          tone={isDeviceConnected ? 'accent' : 'neutral'}
        />
        <ArcSimulationPanelLineItem
          label="Offline Capture"
          detail={offlineCaptureEnabled ? 'Recording continues away.' : 'Buffered capture pauses away.'}
          value={offlineCaptureEnabled ? 'On' : 'Off'}
          onClick={() => setOfflineCaptureEnabled(current => !current)}
          active={offlineCaptureEnabled}
          tone={offlineCaptureEnabled ? 'baseline' : 'neutral'}
        />
        <div className="col-span-2">
          <ArcSimulationPanelLineItem
            label="Capture State"
            detail={simulationContinuityNote}
            value={simulationContinuitySummary}
            active={currentSyncState === 'importing'}
            tone={currentSyncState === 'importing' ? 'accent' : 'neutral'}
          />
        </div>
        {(Object.keys(DEVICE_BACKLOG_PRESET_MINUTES) as ArcDeviceBacklogPreset[]).map(option => (
          <ArcSimulationPanelLineItem
            key={option}
            active={deviceBacklogPreset === option}
            label={`Backlog ${option}`}
            detail={`Use ${option} of buffered capture.`}
            value={deviceBacklogPreset === option ? 'Current' : 'Use'}
            onClick={() => setDeviceBacklogPreset(option)}
            tone={deviceBacklogPreset === option ? 'accent' : 'neutral'}
          />
        ))}
        <div className="col-span-2">
          <ArcSimulationPanelLineItem
            label="Sync State"
            detail={simulationSyncDetail}
            value={simulationSyncLabel}
            active={currentSyncState === 'pending' || currentSyncState === 'importing'}
            tone={currentSyncState === 'pending' || currentSyncState === 'importing' ? 'accent' : 'neutral'}
          />
        </div>
      </div>
    ) : activeSimulationPanelFolder === 'timescale' ? (
      <div className="space-y-1.5">
        <ArcSimulationPanelLineItem
          label="Clock Rate"
          detail="Controls how quickly the shared in-app simulation clock advances."
          value={simulationRateLabel}
          active
          tone="accent"
        />
        <div className="grid grid-cols-2 gap-1.5">
          {SIMULATION_TIMESCALE_PRESETS.map(option => (
            <ArcSimulationPanelLineItem
              key={option.label}
              label={option.label === 'Real' ? 'Real Time' : `Timescale ${option.label}`}
              detail={option.description}
              value={simulationTimescale === option.value ? 'Current' : 'Use'}
              onClick={() => setSimulationTimescale(option.value)}
              active={simulationTimescale === option.value}
              tone={simulationTimescale === option.value ? 'accent' : 'neutral'}
            />
          ))}
        </div>
      </div>
    ) : activeSimulationPanelFolder === 'actions' ? (
      <div className="grid grid-cols-2 gap-1.5">
        <ArcSimulationPanelLineItem
          label="Simulate Live Event"
          detail="Inject one live event."
          value={isLiveSimulationRunning ? 'Running' : 'Run'}
          onClick={handleSimulateEvent}
          disabled={isLiveSimulationRunning || !isDeviceConnected}
          active={isLiveSimulationRunning}
          tone="critical"
        />
        <ArcSimulationPanelLineItem
          label="Simulate Day"
          detail="Advance one simulated day."
          value="+1d"
          onClick={handleSimulateDay}
          disabled={isLiveSimulationRunning}
          tone="baseline"
        />
        <ArcSimulationPanelLineItem
          label="Simulate Month"
          detail="Advance one simulated month."
          value="+30d"
          onClick={handleSimulateMonth}
          disabled={isLiveSimulationRunning}
          tone="accent"
        />
        <ArcSimulationPanelLineItem
          label="Reset Data"
          detail="Clear collected simulation history."
          value="Reset"
          onClick={handleResetCollectedDataInPlace}
          tone="critical"
        />
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-1.5">
        <ArcSimulationPanelLineItem
          label="Low"
          detail="Preview graphite priority."
          value="Show"
          onClick={handleTriggerLowPriorityPulse}
          tone="neutral"
        />
        <ArcSimulationPanelLineItem
          label="Normal"
          detail="Preview metallic blue priority."
          value="Show"
          onClick={handleTriggerNormalPriorityPulse}
          tone="accent"
        />
        <ArcSimulationPanelLineItem
          label="High"
          detail="Preview emerald priority."
          value="Show"
          onClick={handleTriggerHighPriorityPulse}
          tone="baseline"
        />
        <ArcSimulationPanelLineItem
          label="Very High"
          detail="Preview gold priority."
          value="Show"
          onClick={handleTriggerVeryHighPriorityPulse}
          tone="critical"
        />
        <ArcSimulationPanelLineItem
          label="Summary"
          detail="Force grouped Foundation merge."
          value="Merge"
          onClick={handleTriggerPulseSummaryPreview}
          tone="baseline"
        />
        <ArcSimulationPanelLineItem
          label="Foundation Set"
          detail="Preview accomplishment, insight, guidance."
          value="Show"
          onClick={handleTriggerFoundationPulseSequence}
          tone="accent"
        />
        <ArcSimulationPanelLineItem
          label="Burst"
          detail="Queue low, normal, and high."
          value="+3"
          onClick={handleTriggerPulseBurst}
          tone="accent"
        />
        <ArcSimulationPanelLineItem
          label="Flood Test"
          detail="Stress queue and anti-spam logic."
          value="+5"
          onClick={handleTriggerPulseFloodTest}
          tone="critical"
        />
        <ArcSimulationPanelLineItem
          label="Reduced Motion"
          detail="Preview low-motion presentation."
          value={pulseReducedMotionPreview ? 'On' : 'Off'}
          onClick={() => setPulseReducedMotionPreview(current => !current)}
          active={pulseReducedMotionPreview}
          tone={pulseReducedMotionPreview ? 'baseline' : 'neutral'}
        />
        <div className="col-span-2">
          <ArcSimulationPanelLineItem
            label="Pulse Queue"
            detail="Active, queued, and saved history."
            value={`${pulse.activePulse ? 1 : 0} live • ${pulse.pulseQueue.length} queued • ${pulse.recentPulseHistory.length} saved`}
            active={pulse.activePulse != null || pulse.pulseQueue.length > 0}
            tone={
              pulse.activePulse?.priority === 'veryHigh'
                ? 'critical'
                : pulse.activePulse?.priority === 'high'
                  ? 'baseline'
                  : pulse.activePulse?.priority === 'normal'
                    ? 'accent'
                    : 'neutral'
            }
          />
        </div>
      </div>
    );

  const edgeCardGlassOpacityLabel = `${Math.round(edgeCardGlassOpacity * 100)}%`;
  const edgeCardGlassBlurLabel = `${Math.round(edgeCardGlassBlur * 100)}%`;
  const edgeCardGlassTintLabel = edgeCardGlassTintOverride ? edgeCardGlassTintOverride.toUpperCase() : 'Default';
  const edgeCardLayoutSummary = [
    `Text ${Math.round(edgeCardLayout.title.x)}, ${Math.round(edgeCardLayout.title.y)}`,
    `Score ${Math.round(edgeCardLayout.gauge.x)}, ${Math.round(edgeCardLayout.gauge.y)}`,
    `Pillars ${Math.round(edgeCardLayout.pillars.x)}, ${Math.round(edgeCardLayout.pillars.y)}`,
  ].join(' • ');
  const edgeCardGlassTintPresets = [
    { label: 'Steel', value: '#98A5B5' },
    { label: 'Ice', value: '#AFC8E8' },
    { label: 'Indigo', value: '#6E78D8' },
    { label: 'Ember', value: '#C67D5E' },
  ] as const;
  const shapeCutEditorPanelContent: ReactNode = (
    <div className="space-y-1.5">
      <div className="grid grid-cols-2 gap-1.5">
        <ArcSimulationPanelLineItem
          label="Edge Cutter"
          detail="Preview a draft cut directly on the Home EDGE card."
          value={edgeCardShapeEditorEnabled ? 'On' : 'Off'}
          onClick={edgeCardShapeEditorEnabled ? handleCloseEdgeCardShapeEditor : handleOpenEdgeCardShapeEditor}
          active={edgeCardShapeEditorEnabled}
          tone={edgeCardShapeEditorEnabled ? 'accent' : 'neutral'}
        />
        <ArcSimulationPanelLineItem
          label="Draft State"
          detail="Only finalized cuts become the saved EDGE shape."
          value={edgeCardShapeIsDirty ? 'Unsaved' : 'Saved'}
          active
          tone={edgeCardShapeIsDirty ? 'baseline' : 'neutral'}
        />
        <ArcSimulationPanelLineItem
          label="Add Point"
          detail="Adds a midpoint after the selected handle."
          value="+1"
          onClick={handleAddEdgeCardShapePoint}
          tone="baseline"
        />
        <ArcSimulationPanelLineItem
          label="Reset Draft"
          detail="Restore the draft to the original EDGE card cut."
          value="Reset"
          onClick={handleResetEdgeCardShape}
          tone="neutral"
        />
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <ArcSimulationPanelLineItem
          label="Finalize Cut"
          detail="Commit the current draft as the saved EDGE shape."
          value="Apply"
          onClick={handleFinalizeEdgeCardShape}
          active={edgeCardShapeIsDirty}
          tone={edgeCardShapeIsDirty ? 'accent' : 'neutral'}
        />
        <ArcSimulationPanelLineItem
          label="Revert Draft"
          detail="Discard the draft and return to the saved cut."
          value="Revert"
          onClick={handleRevertEdgeCardShapeDraft}
          tone="neutral"
        />
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        <ArcSimulationPanelLineItem
          label="Copy Clip Path"
          detail="Copies the current polygon for reuse."
          value={edgeCardShapeCopyStatus === 'copied' ? 'Copied' : 'Copy'}
          onClick={handleCopyEdgeCardShape}
          active={edgeCardShapeCopyStatus === 'copied'}
          tone={edgeCardShapeCopyStatus === 'copied' ? 'accent' : 'neutral'}
        />
      </div>
      <div
        className="rounded-[14px] border px-3 py-2.5"
        style={{
          background: hexToRgba('#FFFFFF', 0.024),
          borderColor: hexToRgba('#FFFFFF', 0.05),
        }}
      >
        <div
          style={{
            ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
            color: foundationTheme.text.secondary,
            letterSpacing: '0.08em',
          }}
        >
          SHAPE NOTES
        </div>
        <div
          className="mt-1.5"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'caption'),
            color: foundationTheme.text.muted,
            lineHeight: 1.3,
          }}
        >
          Drag points on the EDGE card with your mouse. Double-click the outline to add a point. Double-click a point to remove it. Use Finalize Cut to make the draft permanent.
        </div>
        <div
          className="mt-2 rounded-[12px] border px-2.5 py-2"
          style={{
            background: hexToRgba('#05080D', 0.52),
            borderColor: hexToRgba('#FFFFFF', 0.05),
            ...getArcTypographyStyle(foundationTheme, 'caption'),
            color: hexToRgba('#FFFFFF', 0.72),
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: '0.58rem',
            lineHeight: 1.35,
            wordBreak: 'break-word',
          }}
        >
          {edgeCardClipPath}
        </div>
      </div>
    </div>
  );
  const glassEditorPanelContent: ReactNode = (
    <div className="space-y-1.5">
      <div
        className="rounded-[14px] border px-3 py-2.5"
        style={{
          background: hexToRgba('#FFFFFF', 0.024),
          borderColor: hexToRgba('#FFFFFF', 0.05),
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
              color: foundationTheme.text.secondary,
              letterSpacing: '0.08em',
            }}
          >
            GLASS OPACITY
          </div>
          <div
            className="rounded-full border px-2 py-0.5"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
              background: hexToRgba('#FFFFFF', 0.03),
              borderColor: hexToRgba('#FFFFFF', 0.06),
              color: foundationTheme.text.secondary,
            }}
          >
            {edgeCardGlassOpacityLabel}
          </div>
        </div>
        <div className="mt-2">
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(edgeCardGlassOpacity * 100)}
            onChange={event => setEdgeCardGlassOpacity(Number(event.target.value) / 100)}
            className="w-full accent-white"
          />
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {[0, 0.35, 0.68, 1].map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setEdgeCardGlassOpacity(option)}
              className="rounded-[10px] border px-2 py-1.5 text-center transition-all duration-200"
              style={{
                background: Math.abs(edgeCardGlassOpacity - option) < 0.005 ? hexToRgba('#FFFFFF', 0.08) : hexToRgba('#FFFFFF', 0.025),
                borderColor: Math.abs(edgeCardGlassOpacity - option) < 0.005 ? hexToRgba('#FFFFFF', 0.1) : hexToRgba('#FFFFFF', 0.05),
                ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                color: Math.abs(edgeCardGlassOpacity - option) < 0.005 ? foundationTheme.text.secondary : foundationTheme.text.muted,
              }}
            >
              {Math.round(option * 100)}%
            </button>
          ))}
        </div>
      </div>
      <div
        className="rounded-[14px] border px-3 py-2.5"
        style={{
          background: hexToRgba('#FFFFFF', 0.024),
          borderColor: hexToRgba('#FFFFFF', 0.05),
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
              color: foundationTheme.text.secondary,
              letterSpacing: '0.08em',
            }}
          >
            SMOKED BLUR
          </div>
          <div
            className="rounded-full border px-2 py-0.5"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
              background: hexToRgba('#FFFFFF', 0.03),
              borderColor: hexToRgba('#FFFFFF', 0.06),
              color: foundationTheme.text.secondary,
            }}
          >
            {edgeCardGlassBlurLabel}
          </div>
        </div>
        <div className="mt-2">
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(edgeCardGlassBlur * 100)}
            onChange={event => setEdgeCardGlassBlur(Number(event.target.value) / 100)}
            className="w-full accent-white"
          />
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {[0, 0.3, 0.65, 1].map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setEdgeCardGlassBlur(option)}
              className="rounded-[10px] border px-2 py-1.5 text-center transition-all duration-200"
              style={{
                background: Math.abs(edgeCardGlassBlur - option) < 0.005 ? hexToRgba('#FFFFFF', 0.08) : hexToRgba('#FFFFFF', 0.025),
                borderColor: Math.abs(edgeCardGlassBlur - option) < 0.005 ? hexToRgba('#FFFFFF', 0.1) : hexToRgba('#FFFFFF', 0.05),
                ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                color: Math.abs(edgeCardGlassBlur - option) < 0.005 ? foundationTheme.text.secondary : foundationTheme.text.muted,
              }}
            >
              {Math.round(option * 100)}%
            </button>
          ))}
        </div>
      </div>
      <div
        className="rounded-[14px] border px-3 py-2.5"
        style={{
          background: hexToRgba('#FFFFFF', 0.024),
          borderColor: hexToRgba('#FFFFFF', 0.05),
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
              color: foundationTheme.text.secondary,
              letterSpacing: '0.08em',
            }}
          >
            GLASS TINT
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-4.5 w-4.5 rounded-full border"
              style={{
                background: edgeCardGlassTintOverride ?? '#98A5B5',
                borderColor: hexToRgba('#FFFFFF', 0.16),
                boxShadow: `0 0 0 1px ${hexToRgba('#000000', 0.2)}`,
              }}
            />
            <div
              className="rounded-full border px-2 py-0.5"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                background: hexToRgba('#FFFFFF', 0.03),
                borderColor: hexToRgba('#FFFFFF', 0.06),
                color: foundationTheme.text.secondary,
              }}
            >
              {edgeCardGlassTintLabel}
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="color"
            value={edgeCardGlassTintOverride ?? '#98A5B5'}
            onChange={event => setEdgeCardGlassTintOverride(event.target.value)}
            className="h-9 w-11 cursor-pointer rounded-[10px] border bg-transparent p-1"
            style={{
              borderColor: hexToRgba('#FFFFFF', 0.08),
            }}
          />
          <button
            type="button"
            onClick={() => setEdgeCardGlassTintOverride(null)}
            className="rounded-[10px] border px-3 py-2 text-center transition-all duration-200"
            style={{
              background: edgeCardGlassTintOverride == null ? hexToRgba('#FFFFFF', 0.08) : hexToRgba('#FFFFFF', 0.025),
              borderColor: edgeCardGlassTintOverride == null ? hexToRgba('#FFFFFF', 0.1) : hexToRgba('#FFFFFF', 0.05),
              ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
              color: edgeCardGlassTintOverride == null ? foundationTheme.text.secondary : foundationTheme.text.muted,
            }}
          >
            Revert
          </button>
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {edgeCardGlassTintPresets.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => setEdgeCardGlassTintOverride(option.value)}
              className="rounded-[10px] border px-2 py-1.5 text-center transition-all duration-200"
              style={{
                background:
                  edgeCardGlassTintOverride?.toUpperCase() === option.value.toUpperCase()
                    ? hexToRgba(option.value, 0.18)
                    : hexToRgba('#FFFFFF', 0.025),
                borderColor:
                  edgeCardGlassTintOverride?.toUpperCase() === option.value.toUpperCase()
                    ? hexToRgba(option.value, 0.32)
                    : hexToRgba('#FFFFFF', 0.05),
                ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                color:
                  edgeCardGlassTintOverride?.toUpperCase() === option.value.toUpperCase()
                    ? foundationTheme.text.secondary
                    : foundationTheme.text.muted,
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
  const moveEditorPanelContent: ReactNode = (
    <div className="space-y-1.5">
      <div className="grid grid-cols-2 gap-1.5">
        <ArcSimulationPanelLineItem
          label="Mover Tool"
          detail="Drag live handles for text, score, and pillars."
          value={edgeCardMoveEditorEnabled ? 'On' : 'Off'}
          onClick={handleToggleEdgeCardMoveEditor}
          active={edgeCardMoveEditorEnabled}
          tone={edgeCardMoveEditorEnabled ? 'accent' : 'neutral'}
        />
        <ArcSimulationPanelLineItem
          label="Reset Layout"
          detail="Restore the original EDGE card layout."
          value="Reset"
          onClick={handleResetEdgeCardLayout}
          tone="neutral"
        />
      </div>
      <div
        className="rounded-[14px] border px-3 py-2.5"
        style={{
          background: hexToRgba('#FFFFFF', 0.024),
          borderColor: hexToRgba('#FFFFFF', 0.05),
        }}
      >
        <div
          style={{
            ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
            color: foundationTheme.text.secondary,
            letterSpacing: '0.08em',
          }}
        >
          LAYOUT OFFSETS
        </div>
        <div
          className="mt-1.5"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'caption'),
            color: foundationTheme.text.muted,
            lineHeight: 1.35,
          }}
        >
          {edgeCardLayoutSummary}
        </div>
      </div>
      <div
        className="rounded-[14px] border px-3 py-2.5"
        style={{
          background: hexToRgba('#FFFFFF', 0.024),
          borderColor: hexToRgba('#FFFFFF', 0.05),
        }}
      >
        <div
          style={{
            ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
            color: foundationTheme.text.secondary,
            letterSpacing: '0.08em',
          }}
        >
          MOVE NOTES
        </div>
        <div
          className="mt-1.5"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'caption'),
            color: foundationTheme.text.muted,
            lineHeight: 1.3,
          }}
        >
          Turn the mover on, then drag the outlined targets directly on the EDGE card. The handles move the text block, score instrument, and pillar formation independently.
        </div>
      </div>
    </div>
  );
  const shapeEditorPanelContent: ReactNode = (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { id: 'shape', label: 'Shape', detail: 'Cut draft and finalize' },
          { id: 'move', label: 'Move', detail: 'Reposition card items' },
          { id: 'glass', label: 'Glass', detail: 'Opacity, blur, tint' },
        ].map(option => {
          const selected = activeEdgeEditorTab === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setActiveEdgeEditorTab(option.id as ArcEdgeEditorTab)}
              className="rounded-[12px] border px-2 py-2 text-center transition-all duration-200"
              style={{
                background: selected ? hexToRgba('#FFFFFF', 0.08) : hexToRgba('#FFFFFF', 0.025),
                borderColor: selected ? hexToRgba('#FFFFFF', 0.1) : hexToRgba('#FFFFFF', 0.05),
              }}
            >
              <div style={{ ...getArcTypographyStyle(foundationTheme, 'pillLabel'), color: selected ? foundationTheme.text.secondary : foundationTheme.text.muted }}>
                {option.label}
              </div>
              <div className="mt-0.5 truncate" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: hexToRgba('#FFFFFF', selected ? 0.58 : 0.42), fontSize: '0.58rem' }}>
                {option.detail}
              </div>
            </button>
          );
        })}
      </div>
      {activeEdgeEditorTab === 'shape' ? shapeCutEditorPanelContent : activeEdgeEditorTab === 'move' ? moveEditorPanelContent : glassEditorPanelContent}
    </div>
  );

  return (
    <ArcSimulationClockProvider value={simulationClock}>
      <PulseProvider value={pulse}>
        <div
          className="relative flex min-h-screen items-center justify-center p-4 text-white selection:bg-rose-500/30"
          style={{
            fontFamily: foundationTheme.typography.fontFamily.primary,
            background: foundationTheme.bg.app,
            color: foundationTheme.text.primary,
          }}
        >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 scale-[1.03]"
            style={{
              backgroundImage: "url('/arc-mock-background.webp')",
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              opacity: 0.82,
              filter: 'saturate(0.94) brightness(0.78)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${hexToRgba(foundationTheme.text.inverse, 0.48)} 0%, ${hexToRgba(foundationTheme.text.inverse, 0.68)} 100%)`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 42%, transparent 0%, ${hexToRgba(foundationTheme.text.inverse, 0.22)} 48%, ${hexToRgba(foundationTheme.text.inverse, 0.58)} 100%)`,
            }}
          />
        </div>

        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm transition-colors"
          style={{
            background: foundationTheme.surface.cardSecondary,
            borderColor: foundationTheme.border.strong,
          }}
          title="Back to Landing"
        >
          <svg className="h-4 w-4" style={{ color: foundationTheme.text.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative z-10 flex w-full max-w-[400px] items-center justify-center">
            <div
              ref={phoneShellRef}
              data-arc-phone-shell="true"
              className="relative flex h-[820px] w-full max-w-[400px] flex-col overflow-hidden rounded-[48px]"
              style={{
                '--arc-foundation-background': appShellBackground,
                background: foundationTheme.bg.app,
                border: `6px solid ${PHONE_EDGE_ROSE_GOLD}`,
                boxShadow: `0 0 0 1px ${hexToRgba(PHONE_EDGE_ROSE_GOLD, 0.8)}, ${foundationTheme.shadow.overlay}`,
              } as CSSProperties}
            >
              <ArcFoundationMotionBackground />
              <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                  background: `
                    linear-gradient(180deg,
                      ${hexToRgba(foundationTheme.text.inverse, 0.18)} 0%,
                      ${hexToRgba(foundationTheme.text.inverse, 0.14)} 18%,
                      ${hexToRgba(foundationTheme.text.inverse, 0.24)} 52%,
                      ${hexToRgba(foundationTheme.text.inverse, 0.42)} 100%),
                    radial-gradient(circle at 50% 12%,
                      ${hexToRgba('#163144', 0.18)} 0%,
                      transparent 42%),
                    radial-gradient(circle at 50% 84%,
                      ${hexToRgba('#020408', 0.3)} 0%,
                      transparent 58%)
                  `,
                }}
              />
              <ArcAtmosphere variant={activeAtmosphere} className="z-0" />
            <div className="absolute top-[-34px] left-1/2 z-10 h-[128px] w-[200px] rounded-full blur-3xl" style={{ background: foundationTheme.accent.primary, opacity: 0.04, transform: 'translateX(-50%)' }} />
            <div className="absolute top-2 left-1/2 z-40 h-[26px] w-28 -translate-x-1/2 rounded-full" style={{ background: foundationTheme.text.inverse }} />

            <div className="absolute top-0 z-30 flex h-12 w-full items-center justify-between px-7 pt-4">
              <span style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary, fontSize: '0.6875rem' }}>
                {simulationClock.displayTime}
              </span>
              <div className="flex gap-1 items-center">
                <svg className="w-4 h-2.5" viewBox="0 0 16 10" fill={foundationTheme.text.primary}><rect x="0" y="3" width="3" height="7" rx="0.5" opacity="0.34" /><rect x="4" y="2" width="3" height="8" rx="0.5" opacity="0.5" /><rect x="8" y="1" width="3" height="9" rx="0.5" opacity="0.7" /><rect x="12" y="0" width="3" height="10" rx="0.5" /></svg>
                <svg className="w-3 h-3 ml-0.5" viewBox="0 0 12 12" fill="none" stroke={foundationTheme.text.primary} strokeWidth="1"><path d="M1 4.5c1.5-2 3.5-3 5-3s3.5 1 5 3" /><path d="M3 7c1-1.2 2-1.8 3-1.8s2 .6 3 1.8" /><circle cx="6" cy="9" r="1" fill={foundationTheme.text.primary} /></svg>
                <div className="relative ml-1 h-2.5 w-6 rounded-sm border" style={{ borderColor: hexToRgba(foundationTheme.text.primary, 0.6) }}>
                  <div className="absolute inset-0.5 rounded-sm" style={{ width: '70%', background: hexToRgba(foundationTheme.text.primary, 0.78) }} />
                </div>
              </div>
            </div>

            {showFloatingAmoraAccess ? (
              <div className="absolute right-5 top-14 z-40">
                <ArcAmoraAccessButton
                  onClick={() => openAmora('home')}
                  quiet
                  anchorId="amora-icon"
                  introReveal={showAmoraIconIntro}
                />
              </div>
            ) : null}

            {isAppOpen && isOnboardingComplete ? (
              <PulseHost onAction={handlePulseAction} reducedMotionOverride={pulseReducedMotionPreview || null} />
            ) : null}

            {isAppOpen ? (
              <>
                {isOnboardingComplete ? (
                  <>
                    <div ref={phoneScrollRef} className="relative z-10 flex-1 min-h-0 overflow-y-auto pt-14 px-5 pb-28" style={{ scrollbarWidth: 'none' }}>
                      {renderScreen()}
                    </div>

                    <div
                      data-amora-anchor="bottom-nav"
                      className="absolute inset-x-0 bottom-0 z-30 rounded-b-[42px] overflow-hidden"
                      style={{ background: foundationTheme.bg.nav }}
                    >
                      <div className="absolute inset-x-0 top-0 h-px" style={{ background: foundationTheme.border.soft }} />
                      <div className="absolute inset-x-6 top-0 h-6 blur-xl" style={{ background: foundationTheme.accent.soft }} />
                      <div className="flex justify-around items-center px-4 pb-6 pt-4">
                        {tabs.map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className="flex flex-col items-center gap-0.5 transition-all"
                            style={{
                              color: activeTab === tab.id ? foundationTheme.accent.primary : foundationTheme.text.muted,
                              opacity: tabEnabled[tab.id] ? 1 : 0.52,
                            }}
                          >
                            {tab.icon(activeTab === tab.id)}
                            <span style={getArcTypographyStyle(foundationTheme, 'navLabel')}>{tab.label}</span>
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-center pb-2">
                        <div className="h-1 w-28 rounded-full" style={{ background: hexToRgba(foundationTheme.text.primary, 0.2) }} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="relative z-10 flex-1 min-h-0 px-5 pb-5 pt-14">
                    <ArcOnboardingFlow
                      onComplete={handleOnboardingComplete}
                      onSkipToDashboard={handleSkipToHubDashboard}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="relative z-10 flex-1 min-h-0 px-5 pb-5 pt-14">
                <ArcPhoneHomeScreen onOpenApp={openArcApp} />
              </div>
            )}

            {amoraHostActive ? (
              <>
                <ArcAmoraSheet
                  open={amoraSheetOpen}
                  content={amoraContent}
                  guidanceNote={activeAmoraGuidanceNote}
                  onClose={closeAmora}
                  expanded={isAmoraExpanded}
                  onToggleExpanded={() => setIsAmoraExpanded(current => !current)}
                />

                <ArcAmoraIntroCard
                  visible={showAmoraWelcomeIntro}
                  username={appData.userProfile.anonymousUsername}
                  guidanceNote={onboardingGuidanceNote}
                  onContinue={dismissAmoraIntro}
                  onSkip={skipAmoraOnboarding}
                />

                <ArcAmoraIconIntro
                  visible={showAmoraIconIntro}
                  anchorRect={amoraIntroAnchorRect}
                  onDismiss={dismissAmoraIconIntro}
                  onLearnMore={startAmoraTour}
                />

                {currentAmoraTourStep ? (
                  <ArcAmoraTourOverlay
                    visible={isAmoraTourActive}
                    step={currentAmoraTourStep}
                    stepIndex={amoraTourStepIndex}
                    totalSteps={amoraTourSteps.length}
                    anchorRect={amoraTourAnchorRect}
                    onNext={handleAmoraTourNext}
                    onBack={handleAmoraTourBack}
                    onClose={closeAmoraTour}
                  />
                ) : null}
              </>
            ) : null}

            {showLaunch && <ArcLaunchScreen onComplete={handleLaunchComplete} />}
          </div>

          {showSimulationPanel ? (
            <div className="absolute left-[calc(100%+12px)] top-[58%] z-20 -translate-y-1/2">
              <div
                className="group absolute left-0 z-0 h-10 w-[84px]"
                style={{ top: 'calc(50% - 54px)' }}
              >
                <div className="pointer-events-none absolute left-0 top-0 flex -translate-x-2 group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
                  <button
                    type="button"
                    onClick={handleOpenEdgeCardShapeEditor}
                    className="flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-300 group-hover:translate-x-0.5 group-focus-within:translate-x-0.5"
                    style={{
                      background: hexToRgba('#0B1117', 0.82),
                      borderColor: hexToRgba('#FFFFFF', 0.08),
                      boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.05)}, 0 10px 24px ${hexToRgba('#000000', 0.22)}`,
                      backdropFilter: 'blur(14px)',
                      transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  >
                    <span
                      className="block h-[2px] w-4 rounded-full"
                      style={{ background: hexToRgba('#FFFFFF', 0.44) }}
                    />
                    <span style={{ ...getArcTypographyStyle(foundationTheme, 'pillLabel'), color: foundationTheme.text.secondary }}>
                      Edit
                    </span>
                    <span
                      style={{
                        ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                        color: foundationTheme.text.muted,
                        transform: 'translateY(-1px)',
                      }}
                    >
                      &gt;
                    </span>
                  </button>
                </div>
                  <div
                    className="pointer-events-none absolute bottom-[calc(100%-4px)] left-5 w-[344px] translate-x-3 rounded-[20px] border p-2.5 opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-x-0 group-focus-within:opacity-100"
                    style={{
                      background: foundationTheme.surface.cardSecondary,
                      borderColor: foundationTheme.border.soft,
                    boxShadow: foundationTheme.shadow.card,
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.text.secondary }}>
                        Shape Editor
                      </div>
                      <div className="mt-0.5 truncate" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted }}>
                        EDGE card cutter and glass tuning
                      </div>
                    </div>
                    <div className="flex max-w-[160px] flex-wrap items-center justify-end gap-1">
                      <div
                        className="rounded-full border px-2 py-0.5"
                        style={{
                          ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                          background: hexToRgba('#FFFFFF', 0.04),
                          borderColor: hexToRgba('#FFFFFF', 0.08),
                          color: foundationTheme.text.secondary,
                        }}
                      >
                        {activeEdgeCardShapePoints.length} pts
                      </div>
                      <div
                        className="rounded-full border px-2 py-0.5"
                        style={{
                          ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                          background: hexToRgba('#FFFFFF', 0.035),
                          borderColor: hexToRgba('#FFFFFF', 0.07),
                          color: foundationTheme.text.secondary,
                        }}
                      >
                        {edgeCardGlassOpacityLabel}
                      </div>
                    </div>
                  </div>

                  <div
                    className="mt-2 max-h-[328px] overflow-y-auto rounded-[16px] border p-2"
                    style={{
                      background: hexToRgba('#FFFFFF', 0.02),
                      borderColor: hexToRgba('#FFFFFF', 0.05),
                      scrollbarWidth: 'none',
                    }}
                  >
                    {shapeEditorPanelContent}
                  </div>
                </div>
              </div>

              <div className="group relative z-10 h-10 w-[76px]">
                <div className="pointer-events-none absolute left-0 top-0 flex -translate-x-2 group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
                  <button
                    type="button"
                    onClick={() => setOpenSimulationPanelFolder(current => current ?? 'profile')}
                    className="flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-300 group-hover:translate-x-0.5 group-focus-within:translate-x-0.5"
                    style={{
                      background: hexToRgba('#0B1117', 0.82),
                      borderColor: hexToRgba('#FFFFFF', 0.08),
                      boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.05)}, 0 10px 24px ${hexToRgba('#000000', 0.22)}`,
                      backdropFilter: 'blur(14px)',
                      transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  >
                    <span
                      className="block h-[2px] w-4 rounded-full"
                      style={{ background: hexToRgba('#FFFFFF', 0.44) }}
                    />
                    <span style={{ ...getArcTypographyStyle(foundationTheme, 'pillLabel'), color: foundationTheme.text.secondary }}>
                      Sim
                    </span>
                    <span
                      style={{
                        ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                        color: foundationTheme.text.muted,
                        transform: 'translateY(-1px)',
                      }}
                    >
                      &gt;
                    </span>
                  </button>
                </div>
                <div
                  className="pointer-events-none absolute left-5 top-1/2 w-[392px] -translate-y-1/2 translate-x-3 rounded-[20px] border p-2.5 opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-x-0 group-focus-within:opacity-100"
                  style={{
                    background: foundationTheme.surface.cardSecondary,
                    borderColor: foundationTheme.border.soft,
                    boxShadow: foundationTheme.shadow.card,
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.text.secondary }}>
                        Simulation Panel
                      </div>
                      <div className="mt-0.5 truncate" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted }}>
                        {simulationContinuitySummary}
                      </div>
                    </div>
                    <div className="flex max-w-[210px] flex-wrap items-center justify-end gap-1">
                      <div
                        className="rounded-full border px-2 py-0.5"
                        style={{
                          ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                          background: hexToRgba('#FFFFFF', 0.04),
                          borderColor: hexToRgba('#FFFFFF', 0.08),
                          color: foundationTheme.text.secondary,
                        }}
                      >
                        {selectedPerformancePresetLabel}
                      </div>
                      <div
                        className="rounded-full border px-2 py-0.5"
                        style={{
                          ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                          background: hexToRgba('#FFFFFF', 0.035),
                          borderColor: hexToRgba('#FFFFFF', 0.07),
                          color: foundationTheme.text.secondary,
                        }}
                      >
                        {simulationTimescaleLabel}
                      </div>
                      <div
                        className="rounded-full border px-2 py-0.5"
                        style={{
                          ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                          background: hexToRgba('#FFFFFF', 0.03),
                          borderColor: hexToRgba('#FFFFFF', 0.06),
                          color: foundationTheme.text.muted,
                        }}
                      >
                        {simulationSyncLabel}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-3 gap-1.5">
                    {simulationPanelFolders.map(section => {
                      const selected = activeSimulationPanelFolder === section.id;

                      return (
                        <button
                          key={section.id}
                          type="button"
                          onClick={() => setOpenSimulationPanelFolder(section.id)}
                          className="min-w-0 rounded-[12px] border px-2 py-2 text-center transition-all duration-200"
                          style={{
                            background: selected ? hexToRgba('#FFFFFF', 0.08) : hexToRgba('#FFFFFF', 0.025),
                            borderColor: selected ? hexToRgba('#FFFFFF', 0.1) : hexToRgba('#FFFFFF', 0.05),
                            boxShadow: selected ? `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.06)}` : 'none',
                          }}
                        >
                          <div
                            style={{
                              ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                              color: selected ? foundationTheme.text.secondary : foundationTheme.text.muted,
                              lineHeight: 1.1,
                            }}
                          >
                            {section.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div
                    className="mt-2 max-h-[268px] overflow-y-auto rounded-[16px] border p-2"
                    style={{
                      background: hexToRgba('#FFFFFF', 0.02),
                      borderColor: hexToRgba('#FFFFFF', 0.05),
                      scrollbarWidth: 'none',
                    }}
                    >
                      {simulationPanelContent}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
        </div>

        <ArcInsigniaPanel visible={isAppOpen && isOnboardingComplete && hoveredPanel === 'insignia' && screen === 'home'} />
        <ArcIdentityPanel
          visible={isAppOpen && isOnboardingComplete && hoveredPanel === 'identity' && screen === 'home'}
          anonymousUsername={appData.userProfile.anonymousUsername}
        />
        <ArcAccountStatusPanel
          visible={isAppOpen && isOnboardingComplete && hoveredPanel === 'accountStatus' && screen === 'home'}
          statusLabel={accountStatusLabel}
          calibrationProgress={appData.calibration.progress}
        />
        <ArcGoalPanel visible={isAppOpen && isOnboardingComplete && hoveredPanel === 'goal' && screen === 'home'} goal={foundationGoalState} />
        <ArcMomentumPanel visible={isAppOpen && isOnboardingComplete && hoveredPanel === 'momentum' && screen === 'home'} />
        <ArcBatteryPanel
          visible={isAppOpen && isOnboardingComplete && hoveredPanel === 'battery' && screen === 'home'}
          batteryLevel={deviceMemoryFree}
          deviceConnected={isDeviceConnected}
        />
        <ArcPulsePanel
          visible={isAppOpen && isOnboardingComplete && hoveredPanel === 'pulse' && screen === 'home'}
          unreadCount={pulse.recentPulseHistory.reduce((count, item) => count + (item.isRead ? 0 : 1), 0)}
          latestPulse={pulse.recentPulseHistory[0] ?? null}
        />
        <ArcEdgeScorePanel visible={isAppOpen && isOnboardingComplete && hoveredPanel === 'edgeScore' && (screen === 'home' || screen === 'edgescore-details')} />
        <ArcSyncPanel visible={isAppOpen && isOnboardingComplete && hoveredPanel === 'sync' && screen === 'home'} />
        <ArcConnectionPanel visible={isAppOpen && isOnboardingComplete && hoveredPanel === 'connection' && screen === 'home'} />
        </div>
      </PulseProvider>
    </ArcSimulationClockProvider>
  );
}
