import type { AnalysisInput } from "./types";
import type {
  Property,
  SiteFeature,
  EnvironmentalLayer,
  ConfidenceLevel,
} from "../../shared/domain";
import { analyzeSolar } from "./solar";
import { analyzeWind } from "./wind";
import { analyzeMoisture } from "./moisture";
import { analyzeHeat } from "./heat";
import { deriveMicrozones } from "./microzones";
import { generateInsights } from "./insights";

/**
 * Main analysis pipeline.
 *
 * Takes raw property geometry and produces a complete Property
 * with site features, environmental layers, microzones, and insights.
 */
export function analyzeProperty(input: AnalysisInput): Property {
  // 1. Build site features from input geometry
  const siteFeatures = buildSiteFeatures(input);

  // 2. Run environmental analysis modules
  const solarLayers = analyzeSolar(input);
  const windLayers = analyzeWind(input);
  const moistureLayers = analyzeMoisture(input);
  const heatLayers = analyzeHeat(input);

  const allLayerResults = [
    ...solarLayers,
    ...windLayers,
    ...moistureLayers,
    ...heatLayers,
  ];

  // 3. Convert to domain EnvironmentalLayer objects
  const layerConfidence = layerConfidenceFor(input.geometrySource);
  const environmentalLayers: EnvironmentalLayer[] = allLayerResults.map(
    (lr, i) => ({
      id: `layer-${lr.type}-${lr.season}-${i}`,
      type: lr.type as EnvironmentalLayer["type"],
      season: lr.season,
      zones: lr.zones,
      sourceInputs: lr.sourceInputs,
      methodology: lr.methodology,
      confidence: layerConfidence,
    }),
  );

  // 4. Derive microzones
  const microzones = deriveMicrozones(input, allLayerResults);

  // 5. Generate insights
  const insights = generateInsights(microzones);

  // 6. Compute area stats
  const imperviousArea =
    (input.additionalFeatures?.imperviousSurfaces ?? []).length > 0
      ? input.lotAreaSqFt * 0.12 // rough estimate
      : 0;

  // 7. Build data source notes
  const dataSourceNotes = buildDataSourceNotes(input.geometrySource);

  return {
    id: `prop-${Date.now()}`,
    inputAddress: input.address,
    resolvedAddress: input.resolvedAddress ?? input.address,
    centroid: input.centroid,
    parcelGeometry: input.parcelGeometry,
    geometrySource: input.geometrySource,
    siteFeatures,
    environmentalLayers,
    microzones,
    insights,
    areaStats: {
      lotAreaSqFt: input.lotAreaSqFt,
      buildingCoverageSqFt: input.buildingAreaSqFt,
      imperviousSqFt: imperviousArea,
      greenSpaceSqFt: input.lotAreaSqFt - input.buildingAreaSqFt - imperviousArea,
    },
    analysisMetadata: {
      analyzedAt: new Date().toISOString(),
      pipelineVersion: "0.3.0-osm",
      dataSourceNotes,
    },
  };
}

function layerConfidenceFor(source?: string): ConfidenceLevel {
  switch (source) {
    case 'osm': return "detected";
    case 'osm_partial': return "inferred";
    default: return "modeled";
  }
}

function featureConfidenceFor(source?: string, isParcel = false): ConfidenceLevel {
  switch (source) {
    case 'osm': return "detected";
    case 'osm_partial': return isParcel ? "inferred" : "detected";
    default: return "modeled";
  }
}

function buildDataSourceNotes(source?: string): string[] {
  switch (source) {
    case 'osm':
      return [
        "Building and parcel geometry from OpenStreetMap",
        "Environmental layers computed via heuristic analysis",
        "Microzones derived from spatial partitioning + layer overlap",
      ];
    case 'osm_partial':
      return [
        "Building footprint from OpenStreetMap",
        "Parcel boundary synthesized from building extent (not in OSM)",
        "Environmental layers computed via heuristic analysis",
        "Microzones derived from spatial partitioning + layer overlap",
      ];
    default:
      return [
        "Geometry is modeled from demo data",
        "Environmental layers computed via heuristic analysis",
        "Microzones derived from spatial partitioning + layer overlap",
      ];
  }
}

function buildSiteFeatures(input: AnalysisInput): SiteFeature[] {
  const buildingConfidence = featureConfidenceFor(input.geometrySource, false);
  const parcelConfidence = featureConfidenceFor(input.geometrySource, true);

  const features: SiteFeature[] = [
    {
      id: "feat-building",
      type: "building",
      geometry: input.buildingGeometry,
      source: "input",
      confidence: buildingConfidence,
      attributes: { stories: 2, material: "wood_frame" },
    },
  ];

  const add = input.additionalFeatures;
  if (add?.neighboringBuildings) {
    add.neighboringBuildings.forEach((geo, i) => {
      features.push({
        id: `feat-neighbor-${i}`,
        type: "neighboring_building",
        geometry: geo,
        source: "input",
        confidence: buildingConfidence,
        attributes: { stories: 2 },
      });
    });
  }
  if (add?.imperviousSurfaces) {
    add.imperviousSurfaces.forEach((geo, i) => {
      features.push({
        id: `feat-impervious-${i}`,
        type: "impervious_surface",
        geometry: geo,
        source: "input",
        confidence: parcelConfidence,
        attributes: { material: "concrete" },
      });
    });
  }
  if (add?.canopies) {
    add.canopies.forEach((c, i) => {
      features.push({
        id: `feat-canopy-${i}`,
        type: "canopy",
        geometry: c.geometry,
        source: "input",
        confidence: input.geometrySource === 'osm' || input.geometrySource === 'osm_partial' ? "detected" : "modeled",
        attributes: { species: c.species ?? "deciduous", canopyDiameterFt: 30 },
      });
    });
  }
  if (add?.fences) {
    add.fences.forEach((f, i) => {
      features.push({
        id: `feat-fence-${i}`,
        type: "fence",
        geometry: f.geometry,
        source: "input",
        confidence: "inferred",
        attributes: { heightFt: f.heightFt ?? 6, material: "wood" },
      });
    });
  }

  return features;
}
