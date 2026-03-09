import type { Polygon, GeoPoint, Season } from "../../shared/domain";

/** Raw input to the analysis pipeline */
export interface AnalysisInput {
  address: string;
  resolvedAddress?: string;
  centroid: GeoPoint;
  parcelGeometry: Polygon;
  buildingGeometry: Polygon;
  /** Additional site features detected or provided */
  additionalFeatures?: {
    neighboringBuildings?: Polygon[];
    canopies?: Array<{ geometry: Polygon; species?: string }>;
    fences?: Array<{ geometry: Polygon; heightFt?: number }>;
    imperviousSurfaces?: Polygon[];
  };
  /** Property-level metadata */
  lotAreaSqFt: number;
  buildingAreaSqFt: number;
  /** Compass orientation: degrees from north for the front of the property */
  frontFacingDegrees: number;
  /** How geometry was obtained — affects confidence propagation */
  geometrySource?: 'osm' | 'osm_partial' | 'demo_fallback';
}

/** Intermediate result from a single analysis module */
export interface LayerResult {
  type: string;
  season: Season;
  zones: Array<{
    geometry: Polygon;
    intensity: number;
    label?: string;
  }>;
  sourceInputs: string[];
  methodology: string;
}
