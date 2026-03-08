import type { AnalysisInput, LayerResult } from "./types";
import type { Season } from "../../shared/domain";

/**
 * Compute wind exposure layers.
 *
 * Heuristic: areas behind buildings/fences (relative to prevailing wind from SW)
 * are sheltered. Open parcel edges are exposed.
 */
export function analyzeWind(input: AnalysisInput): LayerResult[] {
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

  const seasons: Array<{ season: Season; exposureMult: number }> = [
    { season: "summer", exposureMult: 1.0 },
    { season: "spring_fall", exposureMult: 0.9 },
    { season: "winter", exposureMult: 1.2 },
  ];

  return seasons.map(({ season, exposureMult }) => ({
    type: "wind_exposure",
    season,
    zones: [
      // Sheltered: lee of building (NE corner, assuming prevailing SW wind)
      {
        geometry: {
          points: [
            { x: pMinX, y: pMinY },
            { x: bMinX, y: pMinY },
            { x: bMinX, y: bMinY },
            { x: pMinX, y: bMinY },
          ],
        },
        intensity: Math.min(0.35 * exposureMult, 1),
        label: "Sheltered — building lee",
      },
      // Exposed: open south-east
      {
        geometry: {
          points: [
            { x: bMaxX, y: bMaxY },
            { x: pMaxX, y: bMaxY },
            { x: pMaxX, y: pMaxY },
            { x: bMaxX, y: pMaxY },
          ],
        },
        intensity: Math.min(0.85 * exposureMult, 1),
        label: `Exposed — open${season === "winter" ? " (winter storms)" : ""}`,
      },
    ],
    sourceInputs: ["building_footprint", "fence_lines", "parcel_edges"],
    methodology: `Wind shelter from building wind-shadow; ${season} exposure factor ${exposureMult}`,
  }));
}
