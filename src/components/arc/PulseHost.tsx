import { useEffect, useState } from 'react';
import type { PulseItem } from '../../data/pulseTypes';
import PulseCard from './PulseCard';
import { usePulse } from './pulseManager';

function useReducedMotionPreference(override: boolean | null) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(override ?? false);

  useEffect(() => {
    if (override != null) {
      setPrefersReducedMotion(override);
      return undefined;
    }

    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      setPrefersReducedMotion(false);
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    handleChange();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [override]);

  return prefersReducedMotion;
}

export default function PulseHost({
  onAction,
  reducedMotionOverride = null,
}: {
  onAction?: (pulse: PulseItem) => void;
  reducedMotionOverride?: boolean | null;
}) {
  const { activePulse, dismissPulse, markPulseRead } = usePulse();
  const reducedMotion = useReducedMotionPreference(reducedMotionOverride);

  if (!activePulse) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[3.35rem] z-40 flex justify-center px-3.5">
      <div className="pointer-events-auto w-full max-w-[318px]" aria-live="polite" aria-atomic="true">
        <div
          style={{
            transition: reducedMotion
              ? 'opacity 180ms ease-out'
              : 'opacity 260ms ease-out, transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
            transform: 'translateY(0)',
            opacity: 1,
          }}
        >
          <PulseCard
            pulse={activePulse}
            reducedMotion={reducedMotion}
            onDismiss={() => dismissPulse(activePulse.id)}
            onOpen={() => {
              markPulseRead(activePulse.id);
              if (onAction) {
                onAction(activePulse);
              }
              dismissPulse(activePulse.id);
            }}
          />
        </div>
      </div>
    </div>
  );
}
