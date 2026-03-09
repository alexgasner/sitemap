import LayerControls from "./LayerControls";
import EmptyState from "./EmptyState";
import MapLegend from "./map/MapLegend";
import LeafletMap from "./map/LeafletMap";
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
  return (
    <div className="flex-1 relative map-canvas-bg overflow-hidden flex items-center justify-center">
      <div className="w-full h-full relative">
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
          <div className="w-full h-full animate-in fade-in duration-700 relative">
            <MapLegend viewMode={viewMode} onViewModeChange={onViewModeChange} />
            <LeafletMap
              property={property}
              viewMode={viewMode}
              season={season}
              selectedZone={selectedZone}
              onSelectZone={onSelectZone}
            />
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
