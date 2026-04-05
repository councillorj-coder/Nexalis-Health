export type ArcEdgeCardMoveItemId = 'title' | 'gauge' | 'pillars';

export interface ArcEdgeCardItemOffset {
  x: number;
  y: number;
}

export interface ArcEdgeCardLayout {
  title: ArcEdgeCardItemOffset;
  gauge: ArcEdgeCardItemOffset;
  pillars: ArcEdgeCardItemOffset;
}

export const DEFAULT_EDGE_CARD_LAYOUT: ArcEdgeCardLayout = {
  title: { x: 0, y: 0 },
  gauge: { x: 0, y: 0 },
  pillars: { x: 0, y: 0 },
};

function clampOffset(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(260, Math.max(-260, value));
}

function normalizeOffset(value: Partial<ArcEdgeCardItemOffset> | undefined): ArcEdgeCardItemOffset {
  return {
    x: clampOffset(value?.x ?? 0),
    y: clampOffset(value?.y ?? 0),
  };
}

export function normalizeEdgeCardLayout(layout: Partial<ArcEdgeCardLayout> | null | undefined): ArcEdgeCardLayout {
  return {
    title: normalizeOffset(layout?.title),
    gauge: normalizeOffset(layout?.gauge),
    pillars: normalizeOffset(layout?.pillars),
  };
}

export function parseEdgeCardLayout(serialized: string | null | undefined) {
  if (!serialized) {
    return DEFAULT_EDGE_CARD_LAYOUT;
  }

  try {
    const parsed = JSON.parse(serialized) as Partial<ArcEdgeCardLayout>;
    return normalizeEdgeCardLayout(parsed);
  } catch {
    return DEFAULT_EDGE_CARD_LAYOUT;
  }
}

export function serializeEdgeCardLayout(layout: ArcEdgeCardLayout) {
  return JSON.stringify(normalizeEdgeCardLayout(layout));
}
