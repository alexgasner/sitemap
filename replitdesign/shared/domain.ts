// =============================================================================
// Canonical Domain Model — Site Layers
// =============================================================================
// This file is the single source of truth for all domain types.
// Every layer of the app (server, client, analysis) imports from here.
// =============================================================================

// ---------------------------------------------------------------------------
// Enums / Constrained Vocabularies
// ---------------------------------------------------------------------------

export const CONFIDENCE_LEVELS = [
  "authoritative",
  "detected",
  "inferred",
  "modeled",
  "user_confirmed",
] as const;
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

export const LIGHT_CLASSES = [
  "full_sun",
  "part_sun",
  "part_shade",
  "bright_shade",
  "deep_shade",
] as const;
export type LightClass = (typeof LIGHT_CLASSES)[number];

export const MOISTURE_CLASSES = [
  "dry",
  "moderately_dry",
  "balanced",
  "moist",
  "wet",
] as const;
export type MoistureClass = (typeof MOISTURE_CLASSES)[number];

export const WIND_CLASSES = ["exposed", "moderate", "sheltered"] as const;
export type WindClass = (typeof WIND_CLASSES)[number];

export const HEAT_CLASSES = [
  "cool",
  "neutral",
  "warm",
  "heat_reflective",
] as const;
export type HeatClass = (typeof HEAT_CLASSES)[number];

export const SUPPORT_CLASSES = [
  "open_bed",
  "wall_adjacent",
  "fence_line",
  "trellis_capable",
  "foundation_strip",
  "canopy_edge",
] as const;
export type SupportClass = (typeof SUPPORT_CLASSES)[number];

export const COMPETITION_CLASSES = ["low", "moderate", "high"] as const;
export type CompetitionClass = (typeof COMPETITION_CLASSES)[number];

export const SITE_FEATURE_TYPES = [
  "building",
  "neighboring_building",
  "impervious_surface",
  "wall",
  "fence",
  "canopy",
  "paved_edge",
  "roof_edge",
  "foundation_edge",
] as const;
export type SiteFeatureType = (typeof SITE_FEATURE_TYPES)[number];

export const LAYER_TYPES = [
  "solar_exposure",
  "shade",
  "wind_exposure",
  "shelter",
  "moisture_tendency",
  "drainage_tendency",
  "heat_exposure",
  "reflective_heat",
  "support_opportunity",
  "root_competition",
] as const;
export type LayerType = (typeof LAYER_TYPES)[number];

export const SEASONS = ["winter", "spring_fall", "summer"] as const;
export type Season = (typeof SEASONS)[number];

export const VIEW_MODES = [
  "base",
  "sun",
  "wind",
  "water",
  "heat",
  "microzones",
  "composite",
] as const;
export type ViewMode = (typeof VIEW_MODES)[number];

export const INSIGHT_IMPORTANCE = ["high", "medium", "low"] as const;
export type InsightImportance = (typeof INSIGHT_IMPORTANCE)[number];

export const INSIGHT_TYPES = [
  "constraint",
  "opportunity",
  "observation",
] as const;
export type InsightType = (typeof INSIGHT_TYPES)[number];

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

/** A point in 2D space. For demo data, uses a 0-1000 coordinate system. */
export interface Point {
  x: number;
  y: number;
}

/** A geographic coordinate (lat/lon). Used when real geocoding is available. */
export interface GeoPoint {
  lat: number;
  lon: number;
}

/** A closed polygon defined by its vertices. */
export interface Polygon {
  points: Point[];
}

// ---------------------------------------------------------------------------
// Site Features
// ---------------------------------------------------------------------------

export interface SiteFeature {
  id: string;
  type: SiteFeatureType;
  geometry: Polygon;
  source: string;
  confidence: ConfidenceLevel;
  attributes: Record<string, string | number | boolean>;
}

// ---------------------------------------------------------------------------
// Environmental Layers
// ---------------------------------------------------------------------------

export interface LayerZone {
  geometry: Polygon;
  intensity: number; // 0-1 normalized
  label?: string;
}

export interface EnvironmentalLayer {
  id: string;
  type: LayerType;
  season: Season;
  zones: LayerZone[];
  sourceInputs: string[];
  methodology: string;
  confidence: ConfidenceLevel;
}

// ---------------------------------------------------------------------------
// Microzones — the core product object
// ---------------------------------------------------------------------------

export interface SeasonalNote {
  season: Season;
  note: string;
}

export interface Microzone {
  id: string;
  name: string;
  geometry: Polygon;
  lightClass: LightClass;
  moistureClass: MoistureClass;
  windClass: WindClass;
  heatClass: HeatClass;
  supportClass: SupportClass;
  competitionClass: CompetitionClass;
  confidence: ConfidenceLevel;
  rationale: string;
  seasonalNotes: SeasonalNote[];
  sourceInputs: string[];
  tags: string[];
}

// ---------------------------------------------------------------------------
// Insights
// ---------------------------------------------------------------------------

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  body: string;
  relatedMicrozoneIds: string[];
  importance: InsightImportance;
  confidence: ConfidenceLevel;
}

// ---------------------------------------------------------------------------
// Property — the top-level analysis result
// ---------------------------------------------------------------------------

export interface AreaStats {
  lotAreaSqFt: number;
  buildingCoverageSqFt: number;
  imperviousSqFt: number;
  greenSpaceSqFt: number;
}

export interface AnalysisMetadata {
  analyzedAt: string; // ISO 8601
  pipelineVersion: string;
  dataSourceNotes: string[];
}

export interface Property {
  id: string;
  inputAddress: string;
  resolvedAddress: string;
  centroid: GeoPoint;
  parcelGeometry: Polygon;
  siteFeatures: SiteFeature[];
  environmentalLayers: EnvironmentalLayer[];
  microzones: Microzone[];
  insights: Insight[];
  areaStats: AreaStats;
  analysisMetadata: AnalysisMetadata;
}
