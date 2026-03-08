import type { Polygon } from "@shared/domain";
import { polygonToPath } from "@/lib/map/renderer";

interface ParcelLayerProps {
  parcelGeometry: Polygon;
}

export default function ParcelLayer({ parcelGeometry }: ParcelLayerProps) {
  return (
    <path
      d={polygonToPath(parcelGeometry)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeDasharray="8 4"
      className="text-muted-foreground/30"
    />
  );
}
