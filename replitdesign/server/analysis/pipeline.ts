import type { AnalysisInput } from "./types";
import type {
  Property,
  SiteFeature,
  EnvironmentalLayer,
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
  const environmentalLayers: EnvironmentalLayer[] = allLayerResults.map(
    (lr, i) => ({
      id: `layer-${lr.type}-${lr.season}-${i}`,
      type: lr.type as EnvironmentalLayer["type"],
      season: lr.season,
      zones: lr.zones,
      sourceInputs: lr.sourceInputs,
      methodology: lr.methodology,
      confidence: "modeled" as const,
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

  return {
    id: `prop-${Date.now()}`,
    inputAddress: input.address,
    resolvedAddress: input.resolvedAddress ?? input.address,
    centroid: input.centroid,
    parcelGeometry: input.parcelGeometry,
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
      pipelineVersion: "0.2.0-heuristic",
      dataSourceNotes: [
        "Geometry is modeled from input data",
        "Environmental layers computed via heuristic analysis",
        "Microzones derived from spatial partitioning + layer overlap",
      ],
    },
  };
}

function buildSiteFeatures(input: AnalysisInput): SiteFeature[] {
  const features: SiteFeature[] = [
    {
      id: "feat-building",
      type: "building",
      geometry: input.buildingGeometry,
      source: "input",
      confidence: "modeled",
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
        confidence: "modeled",
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
        confidence: "modeled",
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
        confidence: "modeled",
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
