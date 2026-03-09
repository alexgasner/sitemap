import type { ViewMode } from "@shared/domain";
import { LEGEND_LABEL_TO_VIEW_MODE } from "@/lib/map/colors";

interface LegendItem {
  color: string;
  label: string;
}

const LEGENDS: Partial<Record<ViewMode, { title: string; items: LegendItem[] }>> = {
  sun: {
    title: "Sun / Shade",
    items: [
      { color: "rgba(250, 204, 21, 0.5)", label: "High sun exposure" },
      { color: "rgba(250, 204, 21, 0.2)", label: "Moderate sun" },
      { color: "rgba(30, 58, 138, 0.35)", label: "Heavy shade" },
      { color: "rgba(30, 58, 138, 0.15)", label: "Light shade" },
    ],
  },
  wind: {
    title: "Wind Exposure",
    items: [
      { color: "rgba(22, 163, 74, 0.4)", label: "Exposed" },
      { color: "rgba(134, 239, 172, 0.3)", label: "Sheltered" },
    ],
  },
  water: {
    title: "Moisture",
    items: [
      { color: "rgba(37, 99, 235, 0.4)", label: "Wet / collects water" },
      { color: "rgba(96, 165, 250, 0.2)", label: "Dry strip" },
    ],
  },
  heat: {
    title: "Heat",
    items: [
      { color: "rgba(239, 68, 68, 0.4)", label: "Warm / reflected heat" },
      { color: "rgba(252, 165, 165, 0.2)", label: "Mild heat gain" },
    ],
  },
  composite: {
    title: "Composite",
    items: [
      { color: "rgba(250, 204, 21, 0.35)", label: "Sun" },
      { color: "rgba(30, 58, 138, 0.25)", label: "Shade" },
      { color: "rgba(22, 163, 74, 0.30)", label: "Wind" },
      { color: "rgba(37, 99, 235, 0.30)", label: "Moisture" },
      { color: "rgba(239, 68, 68, 0.30)", label: "Heat" },
    ],
  },
};

interface MapLegendProps {
  viewMode: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
}

export default function MapLegend({ viewMode, onViewModeChange }: MapLegendProps) {
  const legend = LEGENDS[viewMode];
  if (!legend) return null;

  const isComposite = viewMode === "composite";
  const isSingleLayer = ["sun", "wind", "water", "heat"].includes(viewMode);

  const handleItemClick = (label: string) => {
    if (!onViewModeChange || !isComposite) return;
    const target = LEGEND_LABEL_TO_VIEW_MODE[label];
    if (target) onViewModeChange(target);
  };

  return (
    <div className="absolute top-4 left-4 z-20 bg-background/90 backdrop-blur-md border border-border/60 rounded-lg p-3 shadow-sm max-w-[180px] print:hidden">
      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        {legend.title}
      </h4>
      <div className="flex flex-col gap-1.5">
        {legend.items.map((item) => {
          const isClickable = isComposite && !!LEGEND_LABEL_TO_VIEW_MODE[item.label];
          return (
            <div
              key={item.label}
              className={`flex items-center gap-2 ${isClickable ? "cursor-pointer hover:bg-muted/50 rounded px-1 -mx-1 py-0.5" : ""}`}
              onClick={() => handleItemClick(item.label)}
            >
              <div
                className="w-4 h-3 rounded-sm border border-border/40 shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[10px] text-muted-foreground leading-tight">{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Composite subtitle */}
      {isComposite && (
        <p className="text-[9px] italic text-muted-foreground/70 mt-2">
          Combined environmental conditions
        </p>
      )}

      {/* Link back to composite from single-layer modes */}
      {isSingleLayer && onViewModeChange && (
        <button
          className="text-[10px] text-primary hover:underline mt-2 block"
          onClick={() => onViewModeChange("composite")}
        >
          View all layers
        </button>
      )}
    </div>
  );
}
