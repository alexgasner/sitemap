/**
 * Enum-to-display-string formatters for domain types.
 * Converts snake_case enum values to human-readable labels.
 */

const LABEL_MAP: Record<string, string> = {
  // Light
  full_sun: "Full sun",
  part_sun: "Part sun",
  part_shade: "Part shade",
  bright_shade: "Bright shade",
  deep_shade: "Deep shade",
  // Moisture
  dry: "Dry",
  moderately_dry: "Moderately dry",
  balanced: "Balanced",
  moist: "Moist",
  wet: "Wet",
  // Wind
  exposed: "Exposed",
  moderate: "Moderate",
  sheltered: "Sheltered",
  // Heat
  cool: "Cool",
  neutral: "Neutral",
  warm: "Warm",
  heat_reflective: "Heat-reflective",
  // Support
  open_bed: "Open bed",
  wall_adjacent: "Wall-adjacent",
  fence_line: "Fence line",
  trellis_capable: "Trellis-capable",
  foundation_strip: "Foundation strip",
  canopy_edge: "Canopy edge",
  // Competition
  low: "Low",
  high: "High",
  // Confidence
  authoritative: "Authoritative",
  detected: "Detected",
  inferred: "Inferred",
  modeled: "Modeled",
  user_confirmed: "User-confirmed",
  // Insight types
  constraint: "Constraint",
  opportunity: "Opportunity",
  observation: "Observation",
};

/** Convert any domain enum value to a display string. */
export function displayLabel(value: string): string {
  return LABEL_MAP[value] ?? value.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

/** Format square footage with commas. */
export function formatSqFt(sqFt: number): string {
  return sqFt.toLocaleString();
}

/** Format lot area as approximate acres. */
export function formatAcres(sqFt: number): string {
  return `~${(sqFt / 43560).toFixed(2)} acres`;
}

/** Format building coverage as percentage of lot. */
export function formatCoverage(buildingSqFt: number, lotSqFt: number): string {
  return `${Math.round((buildingSqFt / lotSqFt) * 100)}% building coverage`;
}
