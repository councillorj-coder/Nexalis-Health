export interface ArcCardShapePoint {
  x: number;
  y: number;
}

export const DEFAULT_EDGE_CARD_SHAPE_POINTS: ArcCardShapePoint[] = [
  { x: 0, y: 0 },
  { x: 50, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 50 },
  { x: 100, y: 100 },
  { x: 50, y: 100 },
  { x: 0, y: 100 },
  { x: 0, y: 50 },
];

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
}

function distanceToSegment(point: ArcCardShapePoint, start: ArcCardShapePoint, end: ArcCardShapePoint) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared <= 0.0001) {
    return Math.hypot(point.x - start.x, point.y - start.y);
  }

  const t = Math.min(1, Math.max(0, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
  const projectionX = start.x + dx * t;
  const projectionY = start.y + dy * t;

  return Math.hypot(point.x - projectionX, point.y - projectionY);
}

function midpoint(start: ArcCardShapePoint, end: ArcCardShapePoint): ArcCardShapePoint {
  return {
    x: clampPercent((start.x + end.x) / 2),
    y: clampPercent((start.y + end.y) / 2),
  };
}

export function normalizeCardShapePoints(points: ArcCardShapePoint[]) {
  if (!Array.isArray(points) || points.length < 4) {
    return DEFAULT_EDGE_CARD_SHAPE_POINTS;
  }

  return points.map(point => ({
    x: clampPercent(point.x),
    y: clampPercent(point.y),
  }));
}

export function buildCardShapeClipPath(points: ArcCardShapePoint[]) {
  const safePoints = normalizeCardShapePoints(points);
  return `polygon(${safePoints.map(point => `${point.x.toFixed(2)}% ${point.y.toFixed(2)}%`).join(', ')})`;
}

export function buildCardShapeSvgPath(points: ArcCardShapePoint[]) {
  const safePoints = normalizeCardShapePoints(points);
  const [firstPoint, ...restPoints] = safePoints;

  if (!firstPoint) {
    return 'M0 0L100 0L100 100L0 100Z';
  }

  return [
    `M${firstPoint.x.toFixed(2)} ${firstPoint.y.toFixed(2)}`,
    ...restPoints.map(point => `L${point.x.toFixed(2)} ${point.y.toFixed(2)}`),
    'Z',
  ].join(' ');
}

export function buildCardShapeMaskImage(points: ArcCardShapePoint[]) {
  const shapePath = buildCardShapeSvgPath(points);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path fill="white" d="${shapePath}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function parseCardShapePoints(serialized: string | null | undefined) {
  if (!serialized) {
    return DEFAULT_EDGE_CARD_SHAPE_POINTS;
  }

  try {
    const parsed = JSON.parse(serialized) as ArcCardShapePoint[];
    return normalizeCardShapePoints(parsed);
  } catch {
    return DEFAULT_EDGE_CARD_SHAPE_POINTS;
  }
}

export function serializeCardShapePoints(points: ArcCardShapePoint[]) {
  return JSON.stringify(normalizeCardShapePoints(points));
}

export function insertCardShapePointAfter(points: ArcCardShapePoint[], index: number) {
  const safePoints = normalizeCardShapePoints(points);
  if (safePoints.length < 2) {
    return DEFAULT_EDGE_CARD_SHAPE_POINTS;
  }

  const fallbackPoint: ArcCardShapePoint = safePoints[0] ?? { x: 0, y: 0 };
  const start = safePoints[index] ?? fallbackPoint;
  const end = safePoints[(index + 1) % safePoints.length] ?? fallbackPoint;
  const insertedPoint = midpoint(start, end);

  return [...safePoints.slice(0, index + 1), insertedPoint, ...safePoints.slice(index + 1)];
}

export function insertCardShapePointAtNearestEdge(points: ArcCardShapePoint[], nextPoint: ArcCardShapePoint) {
  const safePoints = normalizeCardShapePoints(points);
  const normalizedNextPoint = {
    x: clampPercent(nextPoint.x),
    y: clampPercent(nextPoint.y),
  };

  let nearestEdgeIndex = 0;
  let nearestEdgeDistance = Number.POSITIVE_INFINITY;

  safePoints.forEach((point, index) => {
    const edgeEnd = safePoints[(index + 1) % safePoints.length] ?? point;
    const distance = distanceToSegment(normalizedNextPoint, point, edgeEnd);
    if (distance < nearestEdgeDistance) {
      nearestEdgeDistance = distance;
      nearestEdgeIndex = index;
    }
  });

  return [...safePoints.slice(0, nearestEdgeIndex + 1), normalizedNextPoint, ...safePoints.slice(nearestEdgeIndex + 1)];
}

export function removeCardShapePointAtIndex(points: ArcCardShapePoint[], index: number) {
  const safePoints = normalizeCardShapePoints(points);
  if (safePoints.length <= 4) {
    return safePoints;
  }

  return safePoints.filter((_, pointIndex) => pointIndex !== index);
}
