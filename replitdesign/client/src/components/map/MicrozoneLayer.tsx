import { useState } from "react";
import type { Microzone, ViewMode } from "@shared/domain";
import { polygonToPath, polygonCentroid } from "@/lib/map/renderer";
import { getZoneFill, getZoneStroke, getZoneStrokeWidth, getZoneColor } from "@/lib/map/colors";

interface MicrozoneLayerProps {
  microzones: Microzone[];
  viewMode: ViewMode;
  selectedZone: string | null;
  onSelectZone: (zoneId: string) => void;
}

export default function MicrozoneLayer({
  microzones,
  viewMode,
  selectedZone,
  onSelectZone,
}: MicrozoneLayerProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const showLabels = viewMode === "microzones";

  return (
    <g>
      {microzones.map((zone, index) => {
        const isSelected = selectedZone === zone.id;
        const isHovered = hoveredZone === zone.id && !isSelected;
        const centroid = polygonCentroid(zone.geometry);
        const color = getZoneColor(index);
        const showLabel = showLabels || isSelected || isHovered;

        return (
          <g key={zone.id}>
            <path
              d={polygonToPath(zone.geometry)}
              fill={getZoneFill(index, isSelected, viewMode, isHovered)}
              stroke={getZoneStroke(index, isSelected, viewMode, isHovered)}
              strokeWidth={getZoneStrokeWidth(isSelected, viewMode, isHovered)}
              className="cursor-pointer transition-all duration-200"
              style={{ pointerEvents: "all" }}
              onClick={() => onSelectZone(zone.id)}
              onMouseEnter={() => setHoveredZone(zone.id)}
              onMouseLeave={() => setHoveredZone(null)}
            />
            {/* Invisible wider hit area for easier clicking */}
            <path
              d={polygonToPath(zone.geometry)}
              fill="transparent"
              stroke="transparent"
              strokeWidth={16}
              className="cursor-pointer"
              style={{ pointerEvents: "stroke" }}
              onClick={() => onSelectZone(zone.id)}
              onMouseEnter={() => setHoveredZone(zone.id)}
              onMouseLeave={() => setHoveredZone(null)}
            />
            {showLabel && (
              <foreignObject
                x={centroid.x - 60}
                y={centroid.y - 12}
                width={120}
                height={24}
                className="pointer-events-none"
              >
                <div className="flex items-center justify-center h-full">
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded backdrop-blur-md shadow-sm border whitespace-nowrap ${color.text} ${color.bg} ${color.border}`}
                  >
                    {zone.name}
                  </span>
                </div>
              </foreignObject>
            )}
          </g>
        );
      })}
    </g>
  );
}
