import type { Polygon, Point } from "@shared/domain";

/**
 * Convert a Polygon to an SVG path `d` attribute string.
 * Closes the path automatically.
 */
export function polygonToPath(polygon: Polygon): string {
  const { points } = polygon;
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  const segments = [`M ${first.x} ${first.y}`];
  for (const p of rest) {
    segments.push(`L ${p.x} ${p.y}`);
  }
  segments.push("Z");
  return segments.join(" ");
}

/**
 * Get the centroid of a polygon (average of vertices).
 * Good enough for label placement on convex-ish shapes.
 */
export function polygonCentroid(polygon: Polygon): Point {
  const { points } = polygon;
  if (points.length === 0) return { x: 0, y: 0 };
  const sum = points.reduce(
    (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
    { x: 0, y: 0 },
  );
  return { x: sum.x / points.length, y: sum.y / points.length };
}

/**
 * Compute the bounding box of a set of polygons.
 * Returns the viewBox with padding applied.
 */
export function computeViewBox(
  polygons: Polygon[],
  padding = 30,
): { minX: number; minY: number; width: number; height: number } {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const poly of polygons) {
    for (const p of poly.points) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }
  }

  return {
    minX: minX - padding,
    minY: minY - padding,
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2,
  };
}
