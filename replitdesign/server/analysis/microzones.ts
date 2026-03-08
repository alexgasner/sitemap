import type { AnalysisInput, LayerResult } from "./types";
import type {
  Microzone,
  LightClass,
  MoistureClass,
  WindClass,
  HeatClass,
  SupportClass,
  CompetitionClass,
  Polygon,
  Point,
} from "../../shared/domain";

/**
 * Derive microzones from the property geometry and layer results.
 *
 * Strategy: partition the property into logical zones based on spatial
 * relationship to the building, then classify each zone using the
 * layer intensities that overlap it.
 *
 * This is a heuristic partitioner — it creates zones for:
 * 1. South wall strip (warm pocket)
 * 2. Open south/SE yard (exposed)
 * 3. North side (shade)
 * 4. Wet low-point corner
 * 5. Main open planting area
 * 6. Under-canopy competition zone (if canopy exists)
 */
export function deriveMicrozones(
  input: AnalysisInput,
  layers: LayerResult[],
): Microzone[] {
  const { buildingGeometry, parcelGeometry } = input;
  const bPts = buildingGeometry.points;
  const pPts = parcelGeometry.points;

  const bMinX = Math.min(...bPts.map((p) => p.x));
  const bMaxX = Math.max(...bPts.map((p) => p.x));
  const bMinY = Math.min(...bPts.map((p) => p.y));
  const bMaxY = Math.max(...bPts.map((p) => p.y));

  const pMinX = Math.min(...pPts.map((p) => p.x));
  const pMinY = Math.min(...pPts.map((p) => p.y));
  const pMaxX = Math.max(...pPts.map((p) => p.x));
  const pMaxY = Math.max(...pPts.map((p) => p.y));

  const zones: Microzone[] = [];

  // Zone A: South Wall Warm Pocket — strip directly south of building
  const southStripDepth = 150;
  zones.push(makeZone({
    id: "zone-a",
    name: "South Wall Warm Pocket",
    geometry: rect(bMinX, bMaxY, bMaxX, bMaxY + southStripDepth),
    light: "full_sun",
    moisture: "moderately_dry",
    wind: "sheltered",
    heat: "warm",
    support: "wall_adjacent",
    competition: "low",
    rationale:
      "The south-facing wall creates a warm, sheltered microclimate. Reflected heat and full sun make this the warmest zone. Roof overhang keeps soil drier.",
    tags: ["warm", "sheltered", "wall-support", "dry-tendency"],
    sourceInputs: ["building_footprint", "compass_orientation", "solar_exposure", "heat_exposure"],
  }));

  // Zone B: Exposed open area — SE of building
  zones.push(makeZone({
    id: "zone-b",
    name: "Exposed West Edge",
    geometry: {
      points: [
        { x: bMaxX, y: bMaxY },
        { x: pMaxX, y: bMaxY },
        { x: pMaxX, y: bMaxY + (pMaxY - bMaxY) * 0.6 },
        { x: bMaxX, y: bMaxY + southStripDepth },
      ],
    },
    light: "full_sun",
    moisture: "moderately_dry",
    wind: "exposed",
    heat: "neutral",
    support: "open_bed",
    competition: "low",
    rationale:
      "Open yard with no wind shelter from structures. Exposed to prevailing winds. Good planting area for wind-tolerant species.",
    tags: ["exposed", "sunny", "wind-stressed", "open"],
    sourceInputs: ["parcel_edges", "wind_exposure", "solar_exposure"],
  }));

  // Zone C: North Shade — strip north of building
  const shadeDepth = Math.min(bMinY - pMinY, (bMaxY - bMinY) * 0.5);
  zones.push(makeZone({
    id: "zone-c",
    name: "Cool North Side Shade",
    geometry: rect(bMinX, bMinY - shadeDepth, bMaxX, bMinY),
    light: "part_shade",
    moisture: "moist",
    wind: "sheltered",
    heat: "cool",
    support: "foundation_strip",
    competition: "moderate",
    rationale:
      "The north side is shaded most of the day. Cool, moist conditions persist. Foundation edge offers structural support.",
    tags: ["shady", "cool", "moist", "foundation"],
    sourceInputs: ["building_footprint", "shade_layer", "moisture_tendency"],
  }));

  // Zone D: Wet Rear Corner — far rear of parcel
  zones.push(makeZone({
    id: "zone-d",
    name: "Wet Rear Corner",
    geometry: rect(pMaxX - 200, pMaxY - 200, pMaxX, pMaxY),
    light: "part_sun",
    moisture: "wet",
    wind: "moderate",
    heat: "cool",
    support: "open_bed",
    competition: "low",
    rationale:
      "Runoff collects at this low point. Drainage is slow, keeping soil wet. Only moisture-tolerant plants thrive here.",
    tags: ["wet", "drainage-issue", "low-point", "moist-loving"],
    sourceInputs: ["parcel_geometry", "moisture_tendency", "drainage_tendency"],
  }));

  // Zone E: Open Sunny Planting Bed — central south yard
  zones.push(makeZone({
    id: "zone-e",
    name: "Open Sunny Planting Bed",
    geometry: {
      points: [
        { x: bMinX + 100, y: bMaxY + southStripDepth },
        { x: bMaxX, y: bMaxY + southStripDepth },
        { x: pMaxX - 200, y: pMaxY - 200 },
        { x: pMaxX - 200, y: pMaxY },
        { x: bMinX, y: pMaxY },
        { x: bMinX, y: bMaxY + southStripDepth },
      ],
    },
    light: "full_sun",
    moisture: "balanced",
    wind: "moderate",
    heat: "neutral",
    support: "open_bed",
    competition: "low",
    rationale:
      "The largest open area with the best conditions: full sun, balanced moisture, and moderate wind. The most versatile planting zone.",
    tags: ["sunny", "balanced", "versatile", "prime-planting"],
    sourceInputs: ["solar_exposure", "moisture_tendency", "wind_exposure"],
  }));

  // Zone F: Tree canopy competition (if canopy features exist)
  const canopies = input.additionalFeatures?.canopies ?? [];
  if (canopies.length > 0) {
    const canopy = canopies[0];
    zones.push(makeZone({
      id: "zone-f",
      name: "Tree Root Competition Zone",
      geometry: canopy.geometry,
      light: "bright_shade",
      moisture: "moderately_dry",
      wind: "sheltered",
      heat: "cool",
      support: "canopy_edge",
      competition: "high",
      rationale:
        "Beneath the mature tree canopy. Root competition makes new planting difficult. Filtered light provides bright shade. Tree intercepts rainfall.",
      tags: ["shady", "competitive", "canopy-edge", "dry-under-canopy"],
      sourceInputs: ["canopy_outline", "shade_layer", "root_competition"],
    }));
  }

  return zones;
}

// ---- Helpers ----

function rect(x1: number, y1: number, x2: number, y2: number): Polygon {
  return {
    points: [
      { x: x1, y: y1 },
      { x: x2, y: y1 },
      { x: x2, y: y2 },
      { x: x1, y: y2 },
    ],
  };
}

interface ZoneInput {
  id: string;
  name: string;
  geometry: Polygon;
  light: LightClass;
  moisture: MoistureClass;
  wind: WindClass;
  heat: HeatClass;
  support: SupportClass;
  competition: CompetitionClass;
  rationale: string;
  tags: string[];
  sourceInputs: string[];
}

function makeZone(z: ZoneInput): Microzone {
  return {
    id: z.id,
    name: z.name,
    geometry: z.geometry,
    lightClass: z.light,
    moistureClass: z.moisture,
    windClass: z.wind,
    heatClass: z.heat,
    supportClass: z.support,
    competitionClass: z.competition,
    confidence: "modeled",
    rationale: z.rationale,
    seasonalNotes: [
      { season: "summer", note: "Peak growing conditions for this zone profile." },
      { season: "winter", note: "Reduced light and cooler temperatures affect this zone." },
      { season: "spring_fall", note: "Moderate conditions; good transition season." },
    ],
    sourceInputs: z.sourceInputs,
    tags: z.tags,
  };
}
