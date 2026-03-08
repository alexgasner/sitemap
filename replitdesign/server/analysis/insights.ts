import type { Insight, Microzone } from "../../shared/domain";

/**
 * Generate plain-English insights from the derived microzones.
 *
 * Looks for notable patterns: best planting zone, warm walls,
 * wet constraints, competition zones, wind exposure.
 */
export function generateInsights(microzones: Microzone[]): Insight[] {
  const insights: Insight[] = [];
  let id = 1;

  // Find the most versatile zone (balanced moisture, full sun, low competition)
  const primeZone = microzones.find(
    (z) => z.moistureClass === "balanced" && z.lightClass === "full_sun" && z.competitionClass === "low",
  );
  if (primeZone) {
    insights.push({
      id: `insight-${id++}`,
      type: "opportunity",
      title: "Prime planting zone identified",
      body: `The "${primeZone.name}" has the best combination of full sun, balanced moisture, and low competition. Focus planting design here for the widest range of garden plants.`,
      relatedMicrozoneIds: [primeZone.id],
      importance: "high",
      confidence: "modeled",
    });
  }

  // Warm wall opportunity
  const warmZone = microzones.find((z) => z.heatClass === "warm" && z.supportClass === "wall_adjacent");
  if (warmZone) {
    insights.push({
      id: `insight-${id++}`,
      type: "opportunity",
      title: "Warm wall microclimate",
      body: `The "${warmZone.name}" creates conditions approximately one USDA hardiness zone warmer than the open yard. Suitable for borderline-hardy plants that would struggle elsewhere.`,
      relatedMicrozoneIds: [warmZone.id],
      importance: "high",
      confidence: "modeled",
    });
  }

  // Wet constraint
  const wetZones = microzones.filter((z) => z.moistureClass === "wet");
  for (const zone of wetZones) {
    insights.push({
      id: `insight-${id++}`,
      type: "constraint",
      title: "Wet area limits plant selection",
      body: `The "${zone.name}" collects runoff and drains slowly. Only moisture-tolerant species will thrive. Consider rain garden plantings or grading improvements.`,
      relatedMicrozoneIds: [zone.id],
      importance: "medium",
      confidence: "modeled",
    });
  }

  // Root competition constraint
  const competitiveZones = microzones.filter((z) => z.competitionClass === "high");
  for (const zone of competitiveZones) {
    insights.push({
      id: `insight-${id++}`,
      type: "constraint",
      title: "High root competition",
      body: `The "${zone.name}" has aggressive root competition from established trees. Use shade-tolerant, drought-adapted species that coexist with tree roots.`,
      relatedMicrozoneIds: [zone.id],
      importance: "medium",
      confidence: "modeled",
    });
  }

  // Wind exposure observation
  const exposedZones = microzones.filter((z) => z.windClass === "exposed");
  if (exposedZones.length > 0) {
    insights.push({
      id: `insight-${id++}`,
      type: "observation",
      title: "Wind-exposed areas present",
      body: `${exposedZones.map((z) => `"${z.name}"`).join(" and ")} ${exposedZones.length === 1 ? "receives" : "receive"} prevailing winds with limited shelter. Wind-tolerant species recommended. A future hedge or fence would expand sheltered planting area.`,
      relatedMicrozoneIds: exposedZones.map((z) => z.id),
      importance: "medium",
      confidence: "modeled",
    });
  }

  return insights;
}
