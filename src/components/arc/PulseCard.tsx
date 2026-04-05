import { useRef, useState } from 'react';
import type { PulseItem } from '../../data/pulseTypes';
import { foundationTheme, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';
import {
  formatPulseTimestamp,
  getPulseCategoryLabel,
  getPulseChipStyle,
  getPulsePalette,
  getPulsePriorityLabel,
  PulseGlyph,
} from './pulseAppearance';

export default function PulseCard({
  pulse,
  reducedMotion,
  onOpen,
  onDismiss,
}: {
  pulse: PulseItem;
  reducedMotion: boolean;
  onOpen: () => void;
  onDismiss: () => void;
}) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const pointerStateRef = useRef<{ pointerId: number; x: number; y: number; moved: boolean } | null>(null);
  const palette = getPulsePalette(pulse);
  const dragDistance = Math.max(Math.abs(dragOffset.x), Math.abs(dragOffset.y));
  const opacity = Math.max(0.28, 1 - dragDistance / 160);

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen();
        }
      }}
      onPointerDown={event => {
        pointerStateRef.current = {
          pointerId: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          moved: false,
        };
      }}
      onPointerMove={event => {
        const pointer = pointerStateRef.current;
        if (!pointer || pointer.pointerId !== event.pointerId) {
          return;
        }

        const nextOffset = {
          x: event.clientX - pointer.x,
          y: event.clientY - pointer.y,
        };

        if (Math.abs(nextOffset.x) > 8 || Math.abs(nextOffset.y) > 8) {
          pointer.moved = true;
        }

        setDragOffset(nextOffset);
      }}
      onPointerCancel={() => {
        pointerStateRef.current = null;
        setDragOffset({ x: 0, y: 0 });
      }}
      onPointerUp={event => {
        const pointer = pointerStateRef.current;
        if (!pointer || pointer.pointerId !== event.pointerId) {
          return;
        }

        const shouldDismiss = Math.abs(dragOffset.x) > 84 || dragOffset.y < -68;
        const moved = pointer.moved;

        pointerStateRef.current = null;

        if (shouldDismiss) {
          onDismiss();
          setDragOffset({ x: 0, y: 0 });
          return;
        }

        setDragOffset({ x: 0, y: 0 });

        if (!moved) {
          onOpen();
        }
      }}
      className="relative w-full cursor-pointer select-none overflow-hidden rounded-[24px] border px-3.5 py-3.5 text-left outline-none"
      style={{
        ...getArcGlassSurfaceStyle(foundationTheme, 'medium', {
          tint: palette.categoryGlow,
          tintStrength: 0.026,
        }),
        borderColor: palette.border,
        boxShadow: `${String(
          getArcGlassSurfaceStyle(foundationTheme, 'medium', {
            tint: palette.categoryGlow,
            tintStrength: 0.026,
          }).boxShadow ?? '',
        )}, 0 0 12px ${palette.glow}`,
        transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)`,
        opacity,
        transition: pointerStateRef.current
          ? 'none'
          : reducedMotion
            ? 'opacity 180ms ease-out'
            : 'transform 240ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease-out',
      }}
      aria-label={`${pulse.title}. ${pulse.message}`}
    >
      <div
        className="pointer-events-none absolute inset-x-4 top-0 h-px"
        style={{ background: palette.edge }}
      />
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
          style={{
            background: palette.surface,
            borderColor: palette.chipBorder,
            boxShadow: `inset 0 1px 0 ${hexToRgba('#FFFFFF', 0.05)}`,
          }}
        >
          <PulseGlyph iconType={pulse.iconType} color={palette.accent} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="rounded-full border px-2 py-[0.14rem]"
                style={{
                  ...getPulseChipStyle(palette.categoryChipText),
                  background: palette.categoryChip,
                  borderColor: palette.categoryChipBorder,
                }}
              >
                {getPulseCategoryLabel(pulse.category)}
              </span>
              <span
                className="rounded-full border px-2 py-[0.14rem]"
                style={{
                  ...getPulseChipStyle(palette.chipText),
                  background: palette.chip,
                  borderColor: palette.chipBorder,
                }}
              >
                {getPulsePriorityLabel(pulse.priority)}
              </span>
              {pulse.summaryCount && pulse.summaryCount > 1 ? (
                <span style={getPulseChipStyle(hexToRgba(foundationTheme.text.secondary, 0.8))}>+{pulse.summaryCount - 1}</span>
              ) : null}
            </div>
            <span style={getPulseChipStyle(hexToRgba(foundationTheme.text.muted, 0.82))}>{formatPulseTimestamp(pulse.timestamp)}</span>
          </div>

          <div
            className="mt-1"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
              color: foundationTheme.text.primary,
              fontSize: '0.8rem',
            }}
          >
            {pulse.title}
          </div>

          <div
            className="mt-1 overflow-hidden"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'caption'),
              color: foundationTheme.text.secondary,
              fontSize: '0.66rem',
              lineHeight: 1.28,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {pulse.message}
          </div>

          <div className="mt-2 flex items-center justify-between gap-3">
            <div
              className="h-[2px] flex-1 rounded-full"
              style={{
                background: palette.edge,
              }}
            />
            <span style={getPulseChipStyle(hexToRgba(foundationTheme.text.muted, 0.72))}>Open mailbox</span>
          </div>
        </div>
      </div>
    </div>
  );
}
