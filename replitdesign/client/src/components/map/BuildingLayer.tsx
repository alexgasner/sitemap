import type { SiteFeature } from "@shared/domain";
import { polygonToPath } from "@/lib/map/renderer";

interface BuildingLayerProps {
  features: SiteFeature[];
  dimmed?: boolean;
}

export default function BuildingLayer({ features, dimmed }: BuildingLayerProps) {
  const buildings = features.filter((f) => f.type === "building");
  const neighbors = features.filter((f) => f.type === "neighboring_building");

  return (
    <g className={dimmed ? "opacity-60" : "opacity-100"} style={{ transition: "opacity 0.5s" }}>
      {buildings.map((b) => (
        <path
          key={b.id}
          d={polygonToPath(b.geometry)}
          fill="#E5E5E0"
          stroke="#D0D0C8"
          strokeWidth={1.5}
        />
      ))}
      {neighbors.map((b) => (
        <path
          key={b.id}
          d={polygonToPath(b.geometry)}
          fill="#ECECEA"
          stroke="#D8D8D2"
          strokeWidth={1}
          strokeDasharray="4 2"
        />
      ))}
    </g>
  );
}
