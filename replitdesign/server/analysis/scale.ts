import type { AnalysisInput } from "./types";

/**
 * Scale factors derived from actual property dimensions.
 *
 * The analysis modules were originally written with hardcoded pixel offsets
 * (150, 200, 100, 20) that assume a 0–1000 unit demo space. This module
 * computes proportional equivalents from real geometry so that analysis
 * heuristics work at any scale (meters, feet, or demo units).
 */
export interface ScaleFactors {
  parcelWidth: number;
  parcelDepth: number;
  buildingWidth: number;
  buildingDepth: number;
  /** ~15% of smaller parcel dimension (was 150 in demo) */
  offset: number;
  /** ~7.5% of smaller parcel dimension (was 100 in demo) */
  halfOffset: number;
  /** ~2% of smaller parcel dimension (was 20 in demo) */
  smallOffset: number;
  /** ~20% of smaller parcel dimension (was 200 in demo) */
  largeOffset: number;
}

export function computeScale(input: AnalysisInput): ScaleFactors {
  const pPts = input.parcelGeometry.points;
  const bPts = input.buildingGeometry.points;

  const pMinX = Math.min(...pPts.map((p) => p.x));
  const pMaxX = Math.max(...pPts.map((p) => p.x));
  const pMinY = Math.min(...pPts.map((p) => p.y));
  const pMaxY = Math.max(...pPts.map((p) => p.y));

  const bMinX = Math.min(...bPts.map((p) => p.x));
  const bMaxX = Math.max(...bPts.map((p) => p.x));
  const bMinY = Math.min(...bPts.map((p) => p.y));
  const bMaxY = Math.max(...bPts.map((p) => p.y));

  const parcelWidth = pMaxX - pMinX;
  const parcelDepth = pMaxY - pMinY;
  const buildingWidth = bMaxX - bMinX;
  const buildingDepth = bMaxY - bMinY;

  const smallerDim = Math.min(parcelWidth, parcelDepth);

  return {
    parcelWidth,
    parcelDepth,
    buildingWidth,
    buildingDepth,
    offset: smallerDim * 0.15,
    halfOffset: smallerDim * 0.075,
    smallOffset: smallerDim * 0.02,
    largeOffset: smallerDim * 0.20,
  };
}
