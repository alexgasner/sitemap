import type { AnalysisInput, LayerResult } from "./types";
import type { Season } from "../../shared/domain";
import { computeScale } from "./scale";

/**
 * Compute heat exposure layers.
 *
 * Heuristic: south-facing walls reflect heat; hardscape (driveways)
 * re-radiate stored heat. Effect is strongest in summer, minimal in winter.
 */
export function analyzeHeat(input: AnalysisInput): LayerResult[] {
  const { buildingGeometry } = input;
  const scale = computeScale(input);
  const bPts = buildingGeometry.points;

  const bMinX = Math.min(...bPts.map((p) => p.x));
  const bMaxX = Math.max(...bPts.map((p) => p.x));
  const bMaxY = Math.max(...bPts.map((p) => p.y));

  const seasons: Array<{ season: Season; heatMult: number }> = [
    { season: "summer", heatMult: 1.0 },
    { season: "spring_fall", heatMult: 0.65 },
    { season: "winter", heatMult: 0.35 },
  ];

  const results: LayerResult[] = [];

  for (const { season, heatMult } of seasons) {
    const zones = [
      // South wall heat zone
      {
        geometry: {
          points: [
            { x: bMinX, y: bMaxY },
            { x: bMaxX, y: bMaxY },
            { x: bMaxX, y: bMaxY + scale.offset },
            { x: bMinX, y: bMaxY + scale.offset },
          ],
        },
        intensity: Math.min(0.85 * heatMult, 1),
        label: `${heatMult > 0.6 ? "Warm" : "Mild"} — south wall reflected heat`,
      },
    ];

    // Driveway heat from impervious surfaces
    const impervious = input.additionalFeatures?.imperviousSurfaces ?? [];
    for (const surface of impervious) {
      zones.push({
        geometry: surface,
        intensity: Math.min(0.7 * heatMult, 1),
        label: "Heat-reflective — hardscape",
      });
    }

    results.push({
      type: "heat_exposure",
      season,
      zones,
      sourceInputs: ["building_footprint", "impervious_surfaces", "compass_orientation"],
      methodology: `Heat from wall reflection and hardscape; ${season} gain factor ${heatMult}`,
    });
  }

  return results;
}
