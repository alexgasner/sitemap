import type { Point, GeoPoint, Polygon } from "@shared/domain";

/**
 * Convert local meter-based coordinates back to lat/lon.
 * Inverse of server's latLonToLocal (geometry.ts).
 */
export function localToLatLon(point: Point, origin: GeoPoint): [number, number] {
  const mPerDegLat = 111320;
  const mPerDegLon = 111320 * Math.cos(origin.lat * Math.PI / 180);
  return [
    origin.lat - point.y / mPerDegLat,
    origin.lon + point.x / mPerDegLon,
  ];
}

export function polygonToLatLngs(polygon: Polygon, origin: GeoPoint): [number, number][] {
  return polygon.points.map(p => localToLatLon(p, origin));
}

/**
 * Compute the signed area of a ring of lat/lon pairs.
 * Positive = counter-clockwise, negative = clockwise (in lat/lon space).
 */
function signedArea(ring: [number, number][]): number {
  let area = 0;
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length;
    area += ring[i][1] * ring[j][0]; // lon_i * lat_j
    area -= ring[j][1] * ring[i][0]; // lon_j * lat_i
  }
  return area / 2;
}

/**
 * Ensure a ring is counter-clockwise (for Leaflet outer rings).
 */
export function ensureCounterClockwise(ring: [number, number][]): [number, number][] {
  return signedArea(ring) < 0 ? [...ring].reverse() : ring;
}

/**
 * Ensure a ring is clockwise (for Leaflet polygon holes).
 */
export function ensureClockwise(ring: [number, number][]): [number, number][] {
  return signedArea(ring) > 0 ? [...ring].reverse() : ring;
}
