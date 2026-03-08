import type { AnalysisInput, LayerResult } from "./types";
import type { Season } from "../../shared/domain";

/**
 * Compute moisture tendency layers.
 *
 * Heuristic: low-point corners collect water; areas near building walls
 * under roof overhang are dry; impervious surfaces create runoff.
 */
export function analyzeMoisture(input: AnalysisInput): LayerResult[] {
  const { buildingGeometry, parcelGeometry } = input;
  const bPts = buildingGeometry.points;
  const pPts = parcelGeometry.points;

  const bMinX = Math.min(...bPts.map((p) => p.x));
  const bMaxX = Math.max(...bPts.map((p) => p.x));
  const bMaxY = Math.max(...bPts.map((p) => p.y));

  const pMaxX = Math.max(...pPts.map((p) => p.x));
  const pMaxY = Math.max(...pPts.map((p) => p.y));

  const seasons: Array<{ season: Season; wetMult: number }> = [
    { season: "summer", wetMult: 0.85 },
    { season: "spring_fall", wetMult: 0.75 },
    { season: "winter", wetMult: 0.95 },
  ];

  return seasons.map(({ season, wetMult }) => ({
    type: "moisture_tendency",
    season,
    zones: [
      // Wet corner: far rear of parcel (assumed low point)
      {
        geometry: {
          points: [
            { x: pMaxX - 200, y: pMaxY - 200 },
            { x: pMaxX, y: pMaxY - 200 },
            { x: pMaxX, y: pMaxY },
            { x: pMaxX - 200, y: pMaxY },
          ],
        },
        intensity: wetMult,
        label: `Wet — ${season === "winter" ? "waterlogged" : "collects runoff"}`,
      },
      // Dry strip: south wall base under overhang
      {
        geometry: {
          points: [
            { x: bMinX, y: bMaxY },
            { x: bMinX + 100, y: bMaxY },
            { x: bMinX + 100, y: bMaxY + 150 },
            { x: bMinX, y: bMaxY + 150 },
          ],
        },
        intensity: season === "winter" ? 0.15 : 0.2,
        label: "Dry — rain shadow / roof overhang",
      },
    ],
    sourceInputs: ["building_footprint", "parcel_geometry", "roof_edges"],
    methodology: `Moisture from roof runoff and assumed drainage; ${season} precipitation factor`,
  }));
}
