import type { SiteFeature } from "@shared/domain";
import { polygonToPath } from "@/lib/map/renderer";

interface SiteFeatureLayerProps {
  features: SiteFeature[];
  dimmed?: boolean;
}

const FEATURE_STYLES: Record<string, { fill: string; stroke: string; strokeWidth: number; strokeDasharray?: string }> = {
  impervious_surface: { fill: "#F0F0EB", stroke: "#D8D8D2", strokeWidth: 1 },
  canopy: { fill: "rgba(34, 197, 94, 0.08)", stroke: "rgba(34, 197, 94, 0.25)", strokeWidth: 2, strokeDasharray: "3 2" },
  fence: { fill: "none", stroke: "#A8A29E", strokeWidth: 2 },
  wall: { fill: "none", stroke: "#78716C", strokeWidth: 2.5 },
};

export default function SiteFeatureLayer({ features, dimmed }: SiteFeatureLayerProps) {
  // Only render non-building features here
  const otherFeatures = features.filter(
    (f) => f.type !== "building" && f.type !== "neighboring_building",
  );

  return (
    <g className={dimmed ? "opacity-40" : "opacity-80"} style={{ transition: "opacity 0.5s" }}>
      {otherFeatures.map((feat) => {
        const style = FEATURE_STYLES[feat.type] ?? { fill: "#F5F5F0", stroke: "#D0D0C8", strokeWidth: 1 };
        return (
          <path
            key={feat.id}
            d={polygonToPath(feat.geometry)}
            fill={style.fill}
            stroke={style.stroke}
            strokeWidth={style.strokeWidth}
            strokeDasharray={style.strokeDasharray}
          />
        );
      })}
    </g>
  );
}
