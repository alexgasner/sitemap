import type { Polygon, Point } from "../../shared/domain";
import type { AnalysisInput } from "../analysis/types";

/**
 * Geometry service — fetches real building and parcel data from OpenStreetMap
 * via the Overpass API, transforms to local meter-based coordinates.
 */

export interface GeometryResult {
  parcelGeometry: Polygon;
  buildingGeometry: Polygon;
  additionalFeatures: AnalysisInput['additionalFeatures'];
  lotAreaSqFt: number;
  buildingAreaSqFt: number;
  geometrySource: 'osm' | 'osm_partial';
  sourceNotes: string[];
}

// ---- Cache ----

interface CacheEntry {
  result: GeometryResult | null;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL_MS = 1100; // rate limit: ~1 req/sec

function cacheKey(lat: number, lon: number): string {
  return `${lat.toFixed(4)},${lon.toFixed(4)}`;
}

// ---- Coordinate Transform ----

interface LatLon {
  lat: number;
  lon: number;
}

function latLonToLocal(coord: LatLon, origin: LatLon): Point {
  const mPerDegLat = 111320;
  const mPerDegLon = 111320 * Math.cos(origin.lat * Math.PI / 180);
  return {
    x: (coord.lon - origin.lon) * mPerDegLon,
    y: -(coord.lat - origin.lat) * mPerDegLat,
  };
}

// ---- Overpass Query ----

interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  nodes?: number[];
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

async function queryOverpass(lat: number, lon: number): Promise<OverpassResponse> {
  // Rate limiting
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_REQUEST_INTERVAL_MS) {
    await new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_INTERVAL_MS - elapsed));
  }
  lastRequestTime = Date.now();

  const query = `[out:json][timeout:15];(way["building"](around:150,${lat},${lon});way["landuse"="residential"](around:150,${lat},${lon});way["boundary"="lot"](around:150,${lat},${lon});way["boundary"="cadastral"](around:150,${lat},${lon});way["leisure"="garden"](around:80,${lat},${lon});node["natural"="tree"](around:100,${lat},${lon}););out body;>;out skel qt;`;

  const url = "https://overpass-api.de/api/interpreter";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!res.ok) {
    throw new Error(`Overpass API error: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as OverpassResponse;
}

// ---- Geometry Math ----

function polygonArea(points: Point[]): number {
  // Shoelace formula — returns absolute area in whatever units points are in
  let area = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area) / 2;
}

function sqMetersToSqFt(sqm: number): number {
  return sqm * 10.7639;
}

function centroid(points: Point[]): Point {
  const n = points.length;
  const cx = points.reduce((s, p) => s + p.x, 0) / n;
  const cy = points.reduce((s, p) => s + p.y, 0) / n;
  return { x: cx, y: cy };
}

function distance(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function boundingBox(points: Point[]): { minX: number; minY: number; maxX: number; maxY: number } {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  };
}

// ---- Main ----

export async function fetchPropertyGeometry(
  lat: number,
  lon: number,
): Promise<GeometryResult | null> {
  const key = cacheKey(lat, lon);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.result;
  }

  let data: OverpassResponse;
  try {
    data = await queryOverpass(lat, lon);
  } catch (err) {
    console.error("Overpass query failed:", err);
    cache.set(key, { result: null, timestamp: Date.now() });
    return null;
  }

  const origin: LatLon = { lat, lon };

  // Build node lookup
  const nodeMap = new Map<number, LatLon>();
  for (const el of data.elements) {
    if (el.type === "node" && el.lat !== undefined && el.lon !== undefined) {
      nodeMap.set(el.id, { lat: el.lat, lon: el.lon });
    }
  }

  // Resolve ways into local-coordinate polygons
  interface ClassifiedPolygon {
    kind: 'building' | 'parcel';
    points: Point[];
    center: Point;
    priority?: number; // lower = better source for parcels
  }

  const buildings: ClassifiedPolygon[] = [];
  const parcels: ClassifiedPolygon[] = [];
  const trees: Point[] = [];

  for (const el of data.elements) {
    if (el.type === "way" && el.nodes && el.tags) {
      const coords: Point[] = [];
      for (const nid of el.nodes) {
        const node = nodeMap.get(nid);
        if (node) {
          coords.push(latLonToLocal(node, origin));
        }
      }
      // OSM ways repeat the first node at the end; drop it for our polygon
      if (coords.length > 2 && coords[0].x === coords[coords.length - 1].x && coords[0].y === coords[coords.length - 1].y) {
        coords.pop();
      }
      if (coords.length < 3) continue;

      const center = centroid(coords);

      if (el.tags.building) {
        buildings.push({ kind: 'building', points: coords, center });
      } else if (el.tags.boundary === 'lot') {
        parcels.push({ kind: 'parcel', points: coords, center, priority: 1 });
      } else if (el.tags.boundary === 'cadastral') {
        parcels.push({ kind: 'parcel', points: coords, center, priority: 2 });
      } else if (el.tags.landuse === 'residential') {
        parcels.push({ kind: 'parcel', points: coords, center, priority: 3 });
      } else if (el.tags.leisure === 'garden') {
        parcels.push({ kind: 'parcel', points: coords, center, priority: 4 });
        }
    }

    // Trees
    if (el.type === "node" && el.tags?.natural === "tree" && el.lat !== undefined && el.lon !== undefined) {
      trees.push(latLonToLocal({ lat: el.lat, lon: el.lon }, origin));
    }
  }

  if (buildings.length === 0) {
    cache.set(key, { result: null, timestamp: Date.now() });
    return null;
  }

  // Pick main building: closest to origin (0,0 in local coords)
  const originPt: Point = { x: 0, y: 0 };
  buildings.sort((a, b) => distance(a.center, originPt) - distance(b.center, originPt));
  const mainBuilding = buildings[0];
  const neighborBuildings = buildings.slice(1);

  const sourceNotes: string[] = [];

  // Parcel: use OSM parcel if found, otherwise synthesize
  let parcelPoints: Point[] | null = null;
  let geoSource: 'osm' | 'osm_partial' = 'osm_partial';

  // Filter parcels: reject those too large or too far from the building
  if (parcels.length > 0) {
    parcels.sort((a, b) => {
      const pa = a.priority ?? 99;
      const pb = b.priority ?? 99;
      if (pa !== pb) return pa - pb;
      return distance(a.center, mainBuilding.center) - distance(b.center, mainBuilding.center);
    });

    const maxParcelArea = 10000; // sq meters (~2.5 acres)
    const maxCentroidDistance = 100; // meters
    const validParcels = parcels.filter(p => {
      const area = polygonArea(p.points);
      const dist = distance(p.center, mainBuilding.center);
      return area < maxParcelArea && dist < maxCentroidDistance;
    });

    if (validParcels.length > 0) {
      parcelPoints = validParcels[0].points;
      geoSource = 'osm';
      sourceNotes.push("Parcel boundary from OpenStreetMap");
    }
  }

  if (!parcelPoints) {
    // Synthesize parcel from bounding box of main building + nearby neighbors
    const nearbyThreshold = 30; // meters
    const lotBuildings = [mainBuilding, ...neighborBuildings.filter(
      (b) => distance(b.center, mainBuilding.center) < nearbyThreshold
    )];
    const allBuildingPoints = lotBuildings.flatMap((b) => b.points);
    const bbox = boundingBox(allBuildingPoints);

    // Asymmetric expansion: less in front (south/+Y), more behind (north/-Y)
    const expandSide = Math.min((bbox.maxX - bbox.minX) * 0.6, 12);  // max 12m side
    const expandFront = Math.min((bbox.maxY - bbox.minY) * 0.4, 8);  // max 8m front setback
    const expandBack = Math.min((bbox.maxY - bbox.minY) * 0.8, 15);  // max 15m backyard
    parcelPoints = [
      { x: bbox.minX - expandSide, y: bbox.minY - expandBack },
      { x: bbox.maxX + expandSide, y: bbox.minY - expandBack },
      { x: bbox.maxX + expandSide, y: bbox.maxY + expandFront },
      { x: bbox.minX - expandSide, y: bbox.maxY + expandFront },
    ];
    geoSource = 'osm_partial';
    sourceNotes.push("Parcel boundary synthesized (not in OSM); building footprint from OSM");
  }

  sourceNotes.push(`Main building from OSM (${buildings.length} building(s) found)`);
  if (trees.length > 0) {
    sourceNotes.push(`${trees.length} tree(s) found near property`);
  }

  // Build additional features
  const additionalFeatures: AnalysisInput['additionalFeatures'] = {};

  if (neighborBuildings.length > 0) {
    additionalFeatures.neighboringBuildings = neighborBuildings.map((b) => ({ points: b.points }));
  }

  if (trees.length > 0) {
    // Create circular-ish canopy polygons (hexagons, ~5m radius)
    const canopyRadius = 5;
    additionalFeatures.canopies = trees.map((t) => ({
      geometry: {
        points: Array.from({ length: 6 }, (_, i) => {
          const angle = (Math.PI / 3) * i;
          return {
            x: t.x + canopyRadius * Math.cos(angle),
            y: t.y + canopyRadius * Math.sin(angle),
          };
        }),
      },
      species: "deciduous",
    }));
  }

  const parcelGeometry: Polygon = { points: parcelPoints };
  const buildingGeometry: Polygon = { points: mainBuilding.points };

  const lotAreaSqFt = sqMetersToSqFt(polygonArea(parcelPoints));
  const buildingAreaSqFt = sqMetersToSqFt(polygonArea(mainBuilding.points));

  const result: GeometryResult = {
    parcelGeometry,
    buildingGeometry,
    additionalFeatures,
    lotAreaSqFt,
    buildingAreaSqFt,
    geometrySource: geoSource,
    sourceNotes,
  };

  cache.set(key, { result, timestamp: Date.now() });
  return result;
}
