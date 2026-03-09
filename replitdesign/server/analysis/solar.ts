import type { AnalysisInput, LayerResult } from "./types";
import type { Season } from "../../shared/domain";
import { computeScale } from "./scale";

/**
 * Compute solar exposure and shade layers.
 *
 * Heuristic: building casts shadow to the north (in northern hemisphere).
 * Shadow length varies by season — longer in winter, shorter in summer.
 * Canopy also casts shade in its vicinity.
 */
export function analyzeSolar(input: AnalysisInput): LayerResult[] {
  const { buildingGeometry, parcelGeometry } = input;
  const scale = computeScale(input);
  const bPts = buildingGeometry.points;
  const pPts = parcelGeometry.points;

  // Building bounding box
  const bMinX = Math.min(...bPts.map((p) => p.x));
  const bMaxX = Math.max(...bPts.map((p) => p.x));
  const bMinY = Math.min(...bPts.map((p) => p.y));
  const bMaxY = Math.max(...bPts.map((p) => p.y));
  const bHeight = bMaxY - bMinY;

  // Parcel bounds
  const pMinY = Math.min(...pPts.map((p) => p.y));
  const pMaxX = Math.max(...pPts.map((p) => p.x));
  const pMaxY = Math.max(...pPts.map((p) => p.y));

  const seasons: Array<{ season: Season; shadowMult: number; sunIntensity: number }> = [
    { season: "summer", shadowMult: 0.5, sunIntensity: 0.9 },
    { season: "spring_fall", shadowMult: 0.8, sunIntensity: 0.75 },
    { season: "winter", shadowMult: 1.4, sunIntensity: 0.55 },
  ];

  const results: LayerResult[] = [];

  for (const { season, shadowMult, sunIntensity } of seasons) {
    const shadowDepth = Math.min(bHeight * shadowMult, bMinY - pMinY);

    // Solar exposure: south of building
    results.push({
      type: "solar_exposure",
      season,
      zones: [
        {
          geometry: {
            points: [
              { x: bMinX, y: bMaxY },
              { x: bMaxX, y: bMaxY },
              { x: pMaxX, y: Math.min(bMaxY + bHeight * 1.5, pMaxY) },
              { x: pMaxX, y: pMaxY },
              { x: bMinX, y: pMaxY },
            ],
          },
          intensity: sunIntensity,
          label: `${season === "summer" ? "High" : season === "winter" ? "Low" : "Moderate"} sun — south yard`,
        },
      ],
      sourceInputs: ["building_footprint", "compass_orientation"],
      methodology: `Solar exposure heuristic for ${season}: sun angle determines south-yard exposure`,
    });

    // Shade: north of building
    results.push({
      type: "shade",
      season,
      zones: [
        {
          geometry: {
            points: [
              { x: bMinX - scale.smallOffset, y: Math.max(bMinY - shadowDepth, pMinY) },
              { x: bMaxX + scale.smallOffset, y: Math.max(bMinY - shadowDepth, pMinY) },
              { x: bMaxX, y: bMinY },
              { x: bMinX, y: bMinY },
            ],
          },
          intensity: 0.5 + shadowMult * 0.25,
          label: `Building shadow — ${season}`,
        },
      ],
      sourceInputs: ["building_footprint", "compass_orientation"],
      methodology: `Shadow projection from building; ${season} shadow multiplier ${shadowMult}x`,
    });

    // Add canopy shade if present
    const canopies = input.additionalFeatures?.canopies ?? [];
    for (const canopy of canopies) {
      results[results.length - 1].zones.push({
        geometry: canopy.geometry,
        intensity: season === "winter" ? 0.3 : 0.65,
        label: `Tree canopy shade${season === "winter" ? " (leafless)" : ""}`,
      });
    }
  }

  return results;
}
