import type { ViewMode } from "@shared/domain";

/**
 * Fixed palette of zone colors — visually distinct, premium aesthetic.
 * Index-based so each zone always gets a unique color.
 */
const ZONE_PALETTE = [
  { fill: "rgba(234, 88, 12, 0.12)", stroke: "#ea580c", text: "text-orange-900", bg: "bg-orange-100/90", border: "border-orange-200", label: "orange" },
  { fill: "rgba(234, 179, 8, 0.12)", stroke: "#eab308", text: "text-yellow-900", bg: "bg-yellow-100/90", border: "border-yellow-200", label: "yellow" },
  { fill: "rgba(59, 130, 246, 0.12)", stroke: "#3b82f6", text: "text-blue-900", bg: "bg-blue-100/90", border: "border-blue-200", label: "blue" },
  { fill: "rgba(20, 184, 166, 0.12)", stroke: "#14b8a6", text: "text-teal-900", bg: "bg-teal-100/90", border: "border-teal-200", label: "teal" },
  { fill: "rgba(245, 158, 11, 0.12)", stroke: "#f59e0b", text: "text-amber-900", bg: "bg-amber-100/90", border: "border-amber-200", label: "amber" },
  { fill: "rgba(22, 163, 74, 0.12)", stroke: "#16a34a", text: "text-emerald-900", bg: "bg-emerald-100/90", border: "border-emerald-200", label: "emerald" },
  { fill: "rgba(168, 85, 247, 0.12)", stroke: "#a855f7", text: "text-purple-900", bg: "bg-purple-100/90", border: "border-purple-200", label: "purple" },
  { fill: "rgba(236, 72, 153, 0.12)", stroke: "#ec4899", text: "text-pink-900", bg: "bg-pink-100/90", border: "border-pink-200", label: "pink" },
];

export function getZoneColor(index: number) {
  return ZONE_PALETTE[index % ZONE_PALETTE.length];
}

/** Selected zone gets a stronger fill; hovered zone gets intermediate fill */
export function getZoneFill(index: number, isSelected: boolean, viewMode: ViewMode, isHovered = false): string {
  const color = ZONE_PALETTE[index % ZONE_PALETTE.length];
  if (isSelected) return color.fill.replace("0.12", "0.25");
  if (isHovered) return color.fill.replace("0.12", "0.18");
  if (viewMode === "microzones") return color.fill;
  // Ghost outlines in composite mode
  if (viewMode === "composite") return color.fill.replace("0.12", "0.06");
  return "transparent";
}

export function getZoneStroke(index: number, isSelected: boolean, viewMode: ViewMode, isHovered = false): string {
  const color = ZONE_PALETTE[index % ZONE_PALETTE.length];
  if (isSelected) return color.stroke;
  if (isHovered) return color.stroke + "80"; // ~50% opacity
  if (viewMode === "microzones") return color.stroke + "4d"; // ~30% opacity hex
  // Ghost outlines in composite mode
  if (viewMode === "composite") return color.stroke + "33"; // ~20% opacity
  return "transparent";
}

export function getZoneStrokeWidth(isSelected: boolean, viewMode: ViewMode, isHovered = false): number {
  if (isSelected) return 3;
  if (isHovered) return 2;
  if (viewMode === "microzones") return 2;
  if (viewMode === "composite") return 1;
  return 0;
}

/** Layer overlay color by intensity (0-1) */
export const LAYER_COLORS: Record<string, { low: string; high: string }> = {
  solar_exposure: { low: "rgba(250, 204, 21, 0.05)", high: "rgba(250, 204, 21, 0.35)" },
  shade:          { low: "rgba(30, 58, 138, 0.05)", high: "rgba(30, 58, 138, 0.25)" },
  wind_exposure:  { low: "rgba(134, 239, 172, 0.05)", high: "rgba(22, 163, 74, 0.30)" },
  moisture_tendency: { low: "rgba(96, 165, 250, 0.05)", high: "rgba(37, 99, 235, 0.30)" },
  heat_exposure:  { low: "rgba(252, 165, 165, 0.05)", high: "rgba(239, 68, 68, 0.30)" },
};

export function getLayerFill(layerType: string, intensity: number): string {
  const palette = LAYER_COLORS[layerType];
  if (!palette) return `rgba(128, 128, 128, ${intensity * 0.2})`;
  // Parse rgba values and interpolate
  const parse = (s: string) => {
    const m = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    return m ? { r: +m[1], g: +m[2], b: +m[3], a: +m[4] } : { r: 128, g: 128, b: 128, a: 0.1 };
  };
  const lo = parse(palette.low);
  const hi = parse(palette.high);
  const t = Math.max(0, Math.min(1, intensity));
  const r = Math.round(lo.r + (hi.r - lo.r) * t);
  const g = Math.round(lo.g + (hi.g - lo.g) * t);
  const b = Math.round(lo.b + (hi.b - lo.b) * t);
  const a = +(lo.a + (hi.a - lo.a) * t).toFixed(3);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/** Map ViewMode to the layer types it should display */
export function getLayerTypesForViewMode(viewMode: ViewMode): string[] {
  switch (viewMode) {
    case "sun": return ["solar_exposure", "shade"];
    case "wind": return ["wind_exposure", "shelter"];
    case "water": return ["moisture_tendency", "drainage_tendency"];
    case "heat": return ["heat_exposure", "reflective_heat"];
    case "composite": return ["solar_exposure", "shade", "wind_exposure", "moisture_tendency", "heat_exposure"];
    default: return [];
  }
}

/** Map legend label to ViewMode for interactive legend clicks */
export const LEGEND_LABEL_TO_VIEW_MODE: Record<string, ViewMode> = {
  "Sun": "sun",
  "Shade": "sun",
  "Wind": "wind",
  "Moisture": "water",
  "Heat": "heat",
};
