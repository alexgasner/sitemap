import type { EnvironmentalLayer, Season, ViewMode } from "@shared/domain";
import { polygonToPath } from "@/lib/map/renderer";
import { getLayerFill, getLayerTypesForViewMode } from "@/lib/map/colors";

interface EnvironmentalOverlayProps {
  layers: EnvironmentalLayer[];
  viewMode: ViewMode;
  season: Season;
}

export default function EnvironmentalOverlay({ layers, viewMode, season }: EnvironmentalOverlayProps) {
  const activeTypes = getLayerTypesForViewMode(viewMode);
  if (activeTypes.length === 0) return null;

  // Filter to matching layers for this season and view mode
  const activeLayers = layers.filter(
    (l) => activeTypes.includes(l.type) && l.season === season,
  );

  return (
    <g className="pointer-events-none" style={{ transition: "opacity 0.5s" }}>
      {activeLayers.map((layer) =>
        layer.zones.map((zone, i) => (
          <path
            key={`${layer.id}-${i}`}
            d={polygonToPath(zone.geometry)}
            fill={getLayerFill(layer.type, zone.intensity)}
            stroke="none"
          />
        )),
      )}
    </g>
  );
}
