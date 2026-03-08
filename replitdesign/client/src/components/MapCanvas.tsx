import LayerControls from "./LayerControls";
import EmptyState from "./EmptyState";
import ParcelLayer from "./map/ParcelLayer";
import BuildingLayer from "./map/BuildingLayer";
import SiteFeatureLayer from "./map/SiteFeatureLayer";
import EnvironmentalOverlay from "./map/EnvironmentalOverlay";
import MicrozoneLayer from "./map/MicrozoneLayer";
import MapLegend from "./map/MapLegend";
import { computeViewBox } from "@/lib/map/renderer";
import type { Property, ViewMode, Season } from "@shared/domain";
import { Loader2 } from "lucide-react";

interface MapCanvasProps {
  property?: Property;
  hasSearched: boolean;
  viewMode: ViewMode;
  season: Season;
  onViewModeChange: (mode: ViewMode) => void;
  onSeasonChange: (season: Season) => void;
  selectedZone: string | null;
  onSelectZone: (zoneId: string) => void;
  isLoading?: boolean;
  error?: string;
}

export default function MapCanvas({
  property,
  hasSearched,
  viewMode,
  season,
  onViewModeChange,
  onSeasonChange,
  selectedZone,
  onSelectZone,
  isLoading,
  error,
}: MapCanvasProps) {
  const dimBase = viewMode !== "base" && viewMode !== "microzones";

  // Compute viewBox from parcel geometry (with fallback)
  const vb = property
    ? computeViewBox([property.parcelGeometry])
    : { minX: 0, minY: 0, width: 1000, height: 1000 };

  return (
    <div className="flex-1 relative map-canvas-bg overflow-hidden flex items-center justify-center">
      <div className="w-full h-full relative p-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Analyzing property...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : !hasSearched || !property ? (
          <EmptyState />
        ) : (
          <div className="w-full h-full flex items-center justify-center animate-in fade-in duration-700 relative">
            <MapLegend viewMode={viewMode} />
            <svg
              viewBox={`${vb.minX} ${vb.minY} ${vb.width} ${vb.height}`}
              className="w-full h-full max-w-[700px] max-h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* 1. Parcel outline — always visible */}
              <ParcelLayer parcelGeometry={property.parcelGeometry} />

              {/* 2. Site features (driveway, canopy, fence) */}
              <SiteFeatureLayer features={property.siteFeatures} dimmed={dimBase} />

              {/* 3. Building footprints */}
              <BuildingLayer features={property.siteFeatures} dimmed={dimBase} />

              {/* 4. Environmental layer overlays (sun, wind, water, heat) */}
              <EnvironmentalOverlay
                layers={property.environmentalLayers}
                viewMode={viewMode}
                season={season}
              />

              {/* 5. Microzone interactive polygons — always on top */}
              <MicrozoneLayer
                microzones={property.microzones}
                viewMode={viewMode}
                selectedZone={selectedZone}
                onSelectZone={onSelectZone}
              />

              {/* Compass */}
              <g transform={`translate(${vb.minX + vb.width - 40}, ${vb.minY + 30})`} opacity={0.5}>
                <polygon points="0,-14 -5,0 5,0" fill="currentColor" />
                <text y={14} textAnchor="middle" fontSize={10} fontWeight={500} letterSpacing="0.1em" fill="currentColor">N</text>
              </g>
            </svg>
          </div>
        )}
      </div>

      {hasSearched && (
        <LayerControls
          viewMode={viewMode}
          season={season}
          onViewModeChange={onViewModeChange}
          onSeasonChange={onSeasonChange}
        />
      )}
    </div>
  );
}
