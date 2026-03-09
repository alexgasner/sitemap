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
