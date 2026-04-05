import type { ReactNode } from 'react';
import {
  foundationTheme,
  getArcGlassSurfaceStyle,
  getArcTypographyStyle,
  hexToRgba,
} from './arc-theme';
import {
  getArcBatteryEstimateLineText,
  getArcBatteryPrimaryValueText,
  getArcBatteryStateLineText,
  type ArcBatteryDetailSnapshot,
  type ArcBatteryStatus,
  type ArcChargeProtocolStatus,
} from '../../data/arc-battery-detail';

const BATTERY_DEVICE_HERO_ASSET = '/pulse-arc-3-gold-edition.png';
const BATTERY_DEVICE_NAME = 'Arc 3 Gold Edition';

function BatteryMotionStyles() {
  return (
    <style>
      {`
        @keyframes nexhub-battery-hero-enter {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes nexhub-battery-card-enter {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes nexhub-battery-charge-sheen {
          0% {
            transform: translateX(-132%);
            opacity: 0;
          }
          20% {
            opacity: 0.28;
          }
          72% {
            opacity: 0.12;
          }
          100% {
            transform: translateX(244%);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nexhub-battery-detail-root,
          .nexhub-battery-detail-root * {
            animation-duration: 1ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 1ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}
    </style>
  );
}

function getStatusAccent(status: ArcBatteryStatus) {
  switch (status) {
    case 'Critical':
      return '#D0AEA8';
    case 'Low':
      return '#D7D4CA';
    case 'Unavailable':
      return '#9CA8B8';
    default:
      return '#DEE8F4';
  }
}

function getProtocolAccent(status: ArcChargeProtocolStatus | '') {
  switch (status) {
    case 'Complete for today':
      return '#DDE7F3';
    case 'Missed':
      return '#C9AEA8';
    case 'At risk':
      return '#C6D0DE';
    case 'On track':
      return '#D7E1EE';
    default:
      return hexToRgba(foundationTheme.text.secondary, 0.78);
  }
}

function BatteryDetailHeader({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex items-center gap-3 px-[0.05rem] pb-0.5">
      <button
        type="button"
        onClick={onBack}
        className="flex h-9 w-9 items-center justify-center rounded-[15px] border transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          ...getArcGlassSurfaceStyle(foundationTheme, 'light', {
            tint: '#CFDAE8',
            tintStrength: 0.012,
          }),
          borderColor: hexToRgba('#FFFFFF', 0.075),
          boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.055)}, 0 8px 18px ${hexToRgba('#000000', 0.12)}`,
        }}
        aria-label="Back from Battery"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.85}
            d="M15 19l-7-7 7-7"
            style={{ color: foundationTheme.text.primary }}
          />
        </svg>
      </button>
      <div
        style={{
          ...getArcTypographyStyle(foundationTheme, 'screenTitle'),
          color: foundationTheme.text.primary,
          fontSize: '1.04rem',
          letterSpacing: '0.01em',
        }}
      >
        Battery
      </div>
    </div>
  );
}

function BatteryHeroDeviceFigure({ battery }: { battery: ArcBatteryDetailSnapshot }) {
  const connected = battery.deviceConnected && battery.batteryPercent != null;

  return (
    <div className="relative h-[23.8rem] w-[19.2rem] shrink-0">
      <div
        className="absolute inset-x-[12%] bottom-[8%] top-[18%] rounded-[2.4rem] blur-3xl"
        style={{
          background: connected ? hexToRgba('#D1B17B', 0.14) : hexToRgba('#FFFFFF', 0.02),
        }}
      />
      <img
        src={BATTERY_DEVICE_HERO_ASSET}
        alt={BATTERY_DEVICE_NAME}
        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        style={{
          opacity: connected ? 0.98 : 0.42,
          filter: connected
            ? 'contrast(1.04) brightness(1.02) saturate(0.94) drop-shadow(0 20px 30px rgba(0, 0, 0, 0.22))'
            : 'grayscale(0.28) brightness(0.76)',
        }}
      />
      {battery.isCharging ? (
        <div
          className="pointer-events-none absolute inset-y-[10%] left-[4%] w-[28%]"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${hexToRgba('#FFFFFF', 0.02)} 28%, ${hexToRgba('#F8F5EF', 0.16)} 55%, transparent 100%)`,
            animation: 'nexhub-battery-charge-sheen 3.2s ease-in-out infinite',
            mixBlendMode: 'screen',
          }}
        />
      ) : null}
    </div>
  );
}

function BatteryLifeIndicator({ battery }: { battery: ArcBatteryDetailSnapshot }) {
  const primaryText = getArcBatteryPrimaryValueText(battery);
  const stateLine = getArcBatteryStateLineText(battery);
  const estimateLine = getArcBatteryEstimateLineText(battery);
  const accent = getStatusAccent(battery.batteryStatus);
  const progress =
    battery.batteryPercent == null ? 0 : Math.min(1, Math.max(0, battery.batteryPercent / 100));
  const connected = battery.deviceConnected && battery.batteryPercent != null;

  return (
    <div className="w-full max-w-[17rem]">
      <div
        className="relative h-[0.98rem] overflow-hidden rounded-full border px-[0.18rem] py-[0.18rem]"
        style={{
          background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', connected ? 0.036 : 0.016)} 0%, ${hexToRgba('#FFFFFF', connected ? 0.012 : 0.006)} 100%)`,
          borderColor: hexToRgba('#FFFFFF', connected ? 0.11 : 0.05),
          boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', connected ? 0.1 : 0.03)}`,
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden rounded-full"
          style={{
            background: `linear-gradient(180deg, ${hexToRgba('#FFFFFF', connected ? 0.05 : 0.015)} 0%, ${hexToRgba('#FFFFFF', connected ? 0.012 : 0.004)} 100%)`,
          }}
        >
          {connected ? (
            <>
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${Math.max(7, progress * 100)}%`,
                  background: `linear-gradient(90deg, ${hexToRgba('#FCFDFE', 0.88)} 0%, ${hexToRgba('#EEF3FA', 0.95)} 52%, ${hexToRgba('#D8E1EC', 0.84)} 100%)`,
                  boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.22)}, 0 0 8px ${hexToRgba('#FFFFFF', 0.04)}`,
                  transition: 'width 480ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
              {battery.isCharging ? (
                <div
                  className="absolute inset-y-0 -left-[22%] w-[22%]"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${hexToRgba('#FFFFFF', 0.04)} 18%, ${hexToRgba('#FFFFFF', 0.18)} 52%, transparent 100%)`,
                    animation: 'nexhub-battery-charge-sheen 2.9s ease-in-out infinite',
                  }}
                />
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      <div className="mt-[0.9rem] text-center">
        <div
          style={{
            ...getArcTypographyStyle(foundationTheme, 'displayHero'),
            color: foundationTheme.text.highlight,
            fontSize: battery.deviceConnected ? '3.18rem' : '1.42rem',
            lineHeight: battery.deviceConnected ? 0.92 : 1.02,
            letterSpacing: battery.deviceConnected ? '-0.06em' : '-0.015em',
          }}
        >
          {primaryText}
        </div>
        <div
          className="mt-[0.52rem]"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'body'),
            color: hexToRgba(foundationTheme.text.secondary, 0.82),
            fontSize: '0.72rem',
            lineHeight: 1.14,
          }}
        >
          {stateLine}
        </div>
        {estimateLine ? (
          <div
            className="mt-[0.38rem]"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
              color: hexToRgba(accent, 0.98),
              fontSize: '0.96rem',
              lineHeight: 1.08,
            }}
          >
            {estimateLine}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function BatteryHeroSection({ battery }: { battery: ArcBatteryDetailSnapshot }) {
  return (
    <section
      className="relative px-[0.1rem] pt-[0.18rem]"
      style={{
        animation: 'nexhub-battery-hero-enter 420ms cubic-bezier(0.22, 1, 0.36, 1) both',
      }}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-[6%] h-[13rem] w-[16rem] -translate-x-1/2 rounded-full blur-[72px]"
        style={{ background: `radial-gradient(circle, ${hexToRgba('#D4B789', 0.08)} 0%, transparent 68%)` }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <div className="flex justify-center">
          <BatteryHeroDeviceFigure battery={battery} />
        </div>
        <div
          className="mt-[0.12rem] text-center"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'caption'),
            color: hexToRgba(foundationTheme.text.secondary, 0.78),
            fontSize: '0.62rem',
            letterSpacing: '0.11em',
            textTransform: 'uppercase',
          }}
        >
          {BATTERY_DEVICE_NAME}
        </div>
        <div className="mt-[0.86rem] flex w-full justify-center">
          <BatteryLifeIndicator battery={battery} />
        </div>
      </div>
    </section>
  );
}

function BatteryCard({
  title,
  children,
  delayMs,
}: {
  title: string;
  children: ReactNode;
  delayMs: number;
}) {
  return (
    <section
      className="rounded-[24px] border px-4 py-3.5"
      style={{
        ...getArcGlassSurfaceStyle(foundationTheme, 'light', {
          tint: '#C0D1E6',
          tintStrength: 0.011,
        }),
        borderColor: hexToRgba('#FFFFFF', 0.048),
        animation: `nexhub-battery-card-enter 340ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms both`,
      }}
    >
      <div
        style={{
          ...getArcTypographyStyle(foundationTheme, 'sectionTitle'),
          color: hexToRgba(foundationTheme.text.secondary, 0.7),
          fontSize: '0.52rem',
          letterSpacing: '0.12em',
        }}
      >
        {title}
      </div>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

function BatteryMetaRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div
        style={{
          ...getArcTypographyStyle(foundationTheme, 'caption'),
          color: hexToRgba(foundationTheme.text.secondary, 0.68),
          fontSize: '0.62rem',
        }}
      >
        {label}
      </div>
      <div
        style={{
          ...getArcTypographyStyle(foundationTheme, 'body'),
          color: accent ?? foundationTheme.text.primary,
          fontSize: '0.76rem',
        }}
      >
        {value}
      </div>
    </div>
  );
}

function BatteryStatusCard({ battery }: { battery: ArcBatteryDetailSnapshot }) {
  return (
    <BatteryCard title="BATTERY STATUS" delayMs={70}>
      <div className="space-y-2.5">
        <BatteryMetaRow
          label="Status"
          value={battery.batteryStatus}
          accent={getStatusAccent(battery.batteryStatus)}
        />
        <div
          className="h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${hexToRgba('#FFFFFF', 0.055)} 18%, ${hexToRgba('#FFFFFF', 0.055)} 82%, transparent 100%)`,
          }}
        />
        <BatteryMetaRow label="Last charged" value={battery.lastChargedText} />
      </div>
    </BatteryCard>
  );
}

function BatteryRecommendationCard({ battery }: { battery: ArcBatteryDetailSnapshot }) {
  return (
    <BatteryCard title="RECOMMENDATION" delayMs={120}>
      <div className="flex items-start gap-2.5">
        <span
          className="mt-[0.34rem] inline-flex h-[0.38rem] w-[0.38rem] shrink-0 rounded-full"
          style={{ background: hexToRgba(getStatusAccent(battery.batteryStatus), 0.92) }}
        />
        <div
          style={{
            ...getArcTypographyStyle(foundationTheme, 'body'),
            color: foundationTheme.text.primary,
            fontSize: '0.82rem',
            lineHeight: 1.34,
          }}
        >
          {battery.recommendationText}
        </div>
      </div>
    </BatteryCard>
  );
}

function ChargeProtocolCard({ battery }: { battery: ArcBatteryDetailSnapshot }) {
  if (!battery.protocolEnabled || !battery.protocolStatusText || !battery.protocolNextWindowText) {
    return null;
  }

  return (
    <BatteryCard title="CHARGE PROTOCOL" delayMs={170}>
      <div className="space-y-2.5">
        <BatteryMetaRow label="Next window" value={battery.protocolNextWindowText} />
        <div
          className="h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${hexToRgba('#FFFFFF', 0.05)} 18%, ${hexToRgba('#FFFFFF', 0.05)} 82%, transparent 100%)`,
          }}
        />
        <BatteryMetaRow
          label="Status"
          value={battery.protocolStatusText}
          accent={getProtocolAccent(battery.protocolStatusText)}
        />
      </div>
    </BatteryCard>
  );
}

export default function ArcBatteryDetailScreen({
  onBack,
  battery,
}: {
  onBack: () => void;
  battery: ArcBatteryDetailSnapshot;
}) {
  return (
    <div className="nexhub-battery-detail-root relative space-y-3">
      <BatteryMotionStyles />
      <div
        className="pointer-events-none absolute inset-x-[-1.2rem] top-[10.6rem] bottom-[-1.4rem] rounded-[2rem]"
        style={{
          background: `
            linear-gradient(180deg,
              ${hexToRgba('#020408', 0)} 0%,
              ${hexToRgba('#020408', 0.12)} 14%,
              ${hexToRgba('#020408', 0.28)} 52%,
              ${hexToRgba('#020408', 0.42)} 100%),
            radial-gradient(circle at 50% 0%,
              ${hexToRgba('#0E1621', 0.12)} 0%,
              transparent 58%)
          `,
        }}
      />

      <div className="relative z-10 space-y-3">
        <BatteryDetailHeader onBack={onBack} />
        <BatteryHeroSection battery={battery} />
        <BatteryStatusCard battery={battery} />
        <BatteryRecommendationCard battery={battery} />
        <ChargeProtocolCard battery={battery} />
      </div>
    </div>
  );
}
