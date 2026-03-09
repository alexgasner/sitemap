import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon as LPolygon, Tooltip, useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Property, ViewMode, Season, GeoPoint } from "@shared/domain";
import { polygonToLatLngs } from "@/lib/map/coordinates";
import { polygonCentroid } from "@/lib/map/renderer";
import { localToLatLon } from "@/lib/map/coordinates";
import {
  getZoneFill,
  getZoneStroke,
  getZoneStrokeWidth,
  getZoneColor,
  getLayerFill,
  getLayerTypesForViewMode,
} from "@/lib/map/colors";

const FEATURE_STYLES: Record<string, { fill: string; stroke: string; weight: number; dashArray?: string }> = {
  impervious_surface: { fill: "#F0F0EB", stroke: "#D8D8D2", weight: 1 },
  canopy: { fill: "rgba(34, 197, 94, 0.08)", stroke: "rgba(34, 197, 94, 0.25)", weight: 2, dashArray: "3 2" },
  fence: { fill: "transparent", stroke: "#A8A29E", weight: 2 },
  wall: { fill: "transparent", stroke: "#78716C", weight: 2.5 },
};

interface LeafletMapProps {
  property: Property;
  viewMode: ViewMode;
  season: Season;
  selectedZone: string | null;
  onSelectZone: (zoneId: string) => void;
}

/** Auto-fit map bounds when property changes */
function FitBounds({ property }: { property: Property }) {
  const map = useMap();
  useEffect(() => {
    const latlngs = polygonToLatLngs(property.parcelGeometry, property.centroid);
    if (latlngs.length > 0) {
      map.fitBounds(latlngs as LatLngBoundsExpression, { padding: [40, 40] });
    }
  }, [map, property.parcelGeometry, property.centroid]);
  return null;
}

export default function LeafletMap({
  property,
  viewMode,
  season,
  selectedZone,
  onSelectZone,
}: LeafletMapProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const origin: GeoPoint = property.centroid;
  const dimBase = viewMode !== "base" && viewMode !== "microzones";

  // Environmental layers
  const activeTypes = getLayerTypesForViewMode(viewMode);
  const isComposite = viewMode === "composite";
  const activeLayers = property.environmentalLayers.filter(
    (l) => activeTypes.includes(l.type) && l.season === season,
  );

  // Site features (non-building)
  const siteFeatures = property.siteFeatures.filter(
    (f) => f.type !== "building" && f.type !== "neighboring_building",
  );
  const buildings = property.siteFeatures.filter((f) => f.type === "building");
  const neighbors = property.siteFeatures.filter((f) => f.type === "neighboring_building");

  return (
    <MapContainer
      center={[origin.lat, origin.lon]}
      zoom={18}
      className="w-full h-full"
      zoomControl={true}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />
      <FitBounds property={property} />

      {/* 1. Parcel outline */}
      <LPolygon
        positions={polygonToLatLngs(property.parcelGeometry, origin)}
        pathOptions={{
          color: "#9ca3af",
          weight: 2,
          dashArray: "8 4",
          fill: false,
        }}
      />

      {/* 2. Site features */}
      {siteFeatures.map((feat) => {
        const style = FEATURE_STYLES[feat.type] ?? { fill: "#F5F5F0", stroke: "#D0D0C8", weight: 1 };
        return (
          <LPolygon
            key={feat.id}
            positions={polygonToLatLngs(feat.geometry, origin)}
            pathOptions={{
              fillColor: style.fill,
              fillOpacity: dimBase ? 0.4 : 0.8,
              color: style.stroke,
              weight: style.weight,
              dashArray: style.dashArray,
            }}
          />
        );
      })}

      {/* 3. Buildings */}
      {buildings.map((b) => (
        <LPolygon
          key={b.id}
          positions={polygonToLatLngs(b.geometry, origin)}
          pathOptions={{
            fillColor: "#E5E5E0",
            fillOpacity: dimBase ? 0.6 : 1,
            color: "#D0D0C8",
            weight: 1.5,
          }}
        />
      ))}
      {neighbors.map((b) => (
        <LPolygon
          key={b.id}
          positions={polygonToLatLngs(b.geometry, origin)}
          pathOptions={{
            fillColor: "#ECECEA",
            fillOpacity: dimBase ? 0.6 : 1,
            color: "#D8D8D2",
            weight: 1,
            dashArray: "4 2",
          }}
        />
      ))}

      {/* 4. Environmental overlays */}
      {activeLayers.map((layer) =>
        layer.zones.map((zone, i) => {
          const intensity = isComposite ? zone.intensity * 0.6 : zone.intensity;
          const fillColor = getLayerFill(layer.type, intensity);
          return (
            <LPolygon
              key={`${layer.id}-${i}`}
              positions={polygonToLatLngs(zone.geometry, origin)}
              pathOptions={{
                fillColor,
                fillOpacity: 1, // opacity is already in the rgba fill
                color: "transparent",
                weight: 0,
                interactive: false,
              }}
            />
          );
        }),
      )}

      {/* 5. Microzones */}
      {property.microzones.map((zone, index) => {
        const isSelected = selectedZone === zone.id;
        const isHovered = hoveredZone === zone.id && !isSelected;
        const center = polygonCentroid(zone.geometry);
        const [labelLat, labelLon] = localToLatLon(center, origin);
        const showLabel = viewMode === "microzones" || isSelected || isHovered;
        const color = getZoneColor(index);

        return (
          <LPolygon
            key={zone.id}
            positions={polygonToLatLngs(zone.geometry, origin)}
            pathOptions={{
              fillColor: getZoneFill(index, isSelected, viewMode, isHovered),
              fillOpacity: 1,
              color: getZoneStroke(index, isSelected, viewMode, isHovered),
              weight: getZoneStrokeWidth(isSelected, viewMode, isHovered),
            }}
            eventHandlers={{
              click: () => onSelectZone(zone.id),
              mouseover: () => setHoveredZone(zone.id),
              mouseout: () => setHoveredZone(null),
            }}
          >
            {showLabel && (
              <Tooltip
                permanent
                direction="center"
                className="leaflet-zone-label"
              >
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${color.text}`}>
                  {zone.name}
                </span>
              </Tooltip>
            )}
          </LPolygon>
        );
      })}
    </MapContainer>
  );
}
