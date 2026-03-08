import { useState } from "react";
import LayerControls from "./LayerControls";
import EmptyState from "./EmptyState";
import { ViewMode, Season } from "@/pages/Home";
import clsx from "clsx";

interface MapCanvasProps {
  hasSearched: boolean;
  viewMode: ViewMode;
  season: Season;
  onViewModeChange: (mode: ViewMode) => void;
  onSeasonChange: (season: Season) => void;
  selectedZone: string | null;
  onSelectZone: (zoneId: string) => void;
}

export default function MapCanvas({ 
  hasSearched, 
  viewMode, 
  season, 
  onViewModeChange, 
  onSeasonChange,
  selectedZone,
  onSelectZone
}: MapCanvasProps) {

  return (
    <div className="flex-1 relative map-canvas-bg overflow-hidden flex items-center justify-center">
      
      {/* Map Content Area */}
      <div className="w-full h-full relative p-8">
        {!hasSearched ? (
          <EmptyState />
        ) : (
          <div className="w-full h-full flex items-center justify-center animate-in fade-in duration-700">
            {/* Mock Map Drawing */}
            <div className="relative w-[600px] h-[600px] max-w-full max-h-full">
              
              {/* Parcel Outline */}
              <div className="absolute inset-4 border border-muted-foreground/30 border-dashed rounded-sm" />
              
              {/* Base Geometry (always faintly visible or prominent in base mode) */}
              <div className={clsx(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 bg-[#E5E5E0] border border-[#D0D0C8] shadow-sm transition-opacity duration-500",
                viewMode === "base" ? "opacity-100" : "opacity-60"
              )}>
                {/* Building Footprint Details */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-[#DCDCD6] border-t border-[#D0D0C8]" />
              </div>

              {/* Hardscape / Driveway */}
              <div className="absolute top-1/2 left-1/4 w-16 h-32 bg-[#F0F0EB] -translate-y-1/2 rounded-sm opacity-80" />
              
              {/* Tree Canopy */}
              <div className={clsx(
                "absolute top-1/4 right-1/4 w-32 h-32 rounded-full border-2 border-primary/20 bg-primary/5 blur-[1px] transition-opacity duration-500",
                viewMode === "base" ? "opacity-100" : "opacity-30"
              )} />


              {/* Mock Layers overlay based on ViewMode */}
              {viewMode === "sun" && (
                <div className="absolute inset-0 animate-in fade-in duration-500 pointer-events-none">
                  {/* Sun shadow casting north */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+40px)] w-48 h-24 bg-blue-900/10 blur-xl" />
                  {/* Sunny south yard */}
                  <div className="absolute bottom-1/4 left-1/4 right-1/4 h-32 bg-yellow-500/10 blur-xl" />
                </div>
              )}

              {viewMode === "heat" && (
                <div className="absolute inset-0 animate-in fade-in duration-500 pointer-events-none">
                  {/* Hot south wall */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[calc(50%-10px)] w-48 h-6 bg-red-500/20 blur-md" />
                </div>
              )}


              {/* Interactive Microzones overlay (Interactive paths) */}
              <div className="absolute inset-0 z-10">
                {/* Zone A: South Wall */}
                <button 
                  className={clsx(
                    "absolute top-[calc(50%+100px)] left-1/2 -translate-x-1/2 w-48 h-12 rounded-sm transition-all duration-200 cursor-pointer flex items-center justify-center",
                    selectedZone === "zone-a" 
                      ? "bg-orange-500/20 border-2 border-orange-500" 
                      : viewMode === "microzones"
                        ? "bg-orange-500/10 border-2 border-orange-500/30 hover:border-orange-500/60 hover:bg-orange-500/20"
                        : "bg-transparent border-2 border-transparent hover:border-primary/30 hover:bg-primary/5"
                  )}
                  onClick={() => onSelectZone("zone-a")}
                >
                  {(viewMode === "microzones" || selectedZone === "zone-a") && (
                    <span className="text-[10px] font-medium text-orange-900 bg-orange-100/90 px-1.5 py-0.5 rounded backdrop-blur-md shadow-sm border border-orange-200">Zone A</span>
                  )}
                </button>
                
                {/* Zone B: Exposed West Edge */}
                <button 
                  className={clsx(
                    "absolute top-1/2 left-[15%] -translate-y-1/2 w-20 h-64 rounded-sm transition-all duration-200 cursor-pointer flex items-center justify-center",
                    selectedZone === "zone-b" 
                      ? "bg-yellow-500/20 border-2 border-yellow-500" 
                      : viewMode === "microzones"
                        ? "bg-yellow-500/10 border-2 border-yellow-500/30 hover:border-yellow-500/60 hover:bg-yellow-500/20"
                        : "bg-transparent border-2 border-transparent hover:border-primary/30 hover:bg-primary/5"
                  )}
                  onClick={() => onSelectZone("zone-b")}
                  style={{ pointerEvents: viewMode === "microzones" || selectedZone === "zone-b" || viewMode === "base" ? 'auto' : 'none' }}
                >
                  {(viewMode === "microzones" || selectedZone === "zone-b") && (
                    <span className="text-[10px] font-medium text-yellow-900 bg-yellow-100/90 px-1.5 py-0.5 rounded backdrop-blur-md shadow-sm border border-yellow-200 -rotate-90">Zone B</span>
                  )}
                </button>

                {/* Zone C: North Shade */}
                <button 
                  className={clsx(
                    "absolute top-[calc(50%-160px)] left-1/2 -translate-x-1/2 w-48 h-16 rounded-sm transition-all duration-200 cursor-pointer flex items-center justify-center",
                    selectedZone === "zone-c" 
                      ? "bg-blue-500/20 border-2 border-blue-500" 
                      : viewMode === "microzones"
                        ? "bg-blue-500/10 border-2 border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/20"
                        : "bg-transparent border-2 border-transparent hover:border-primary/30 hover:bg-primary/5"
                  )}
                  onClick={() => onSelectZone("zone-c")}
                >
                  {(viewMode === "microzones" || selectedZone === "zone-c") && (
                    <span className="text-[10px] font-medium text-blue-900 bg-blue-100/90 px-1.5 py-0.5 rounded backdrop-blur-md shadow-sm border border-blue-200">Zone C</span>
                  )}
                </button>

                {/* Zone D: Wet Rear Corner */}
                <button 
                  className={clsx(
                    "absolute top-[10%] right-[15%] w-32 h-32 rounded-tl-full transition-all duration-200 cursor-pointer flex items-center justify-center",
                    selectedZone === "zone-d" 
                      ? "bg-teal-500/20 border-2 border-teal-500" 
                      : viewMode === "microzones"
                        ? "bg-teal-500/10 border-2 border-teal-500/30 hover:border-teal-500/60 hover:bg-teal-500/20"
                        : "bg-transparent border-2 border-transparent hover:border-primary/30 hover:bg-primary/5"
                  )}
                  onClick={() => onSelectZone("zone-d")}
                  style={{ pointerEvents: viewMode === "microzones" || selectedZone === "zone-d" || viewMode === "base" ? 'auto' : 'none' }}
                >
                  {(viewMode === "microzones" || selectedZone === "zone-d") && (
                    <span className="text-[10px] font-medium text-teal-900 bg-teal-100/90 px-1.5 py-0.5 rounded backdrop-blur-md shadow-sm border border-teal-200">Zone D</span>
                  )}
                </button>

                {/* Zone E: Open Sunny Bed */}
                <button 
                  className={clsx(
                    "absolute bottom-[15%] right-[15%] w-48 h-32 rounded-br-3xl transition-all duration-200 cursor-pointer flex items-center justify-center",
                    selectedZone === "zone-e" 
                      ? "bg-amber-500/20 border-2 border-amber-500" 
                      : viewMode === "microzones"
                        ? "bg-amber-500/10 border-2 border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/20"
                        : "bg-transparent border-2 border-transparent hover:border-primary/30 hover:bg-primary/5"
                  )}
                  onClick={() => onSelectZone("zone-e")}
                  style={{ pointerEvents: viewMode === "microzones" || selectedZone === "zone-e" || viewMode === "base" ? 'auto' : 'none' }}
                >
                  {(viewMode === "microzones" || selectedZone === "zone-e") && (
                    <span className="text-[10px] font-medium text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded backdrop-blur-md shadow-sm border border-amber-200">Zone E</span>
                  )}
                </button>

                {/* Zone F: Tree Root Competition */}
                <button 
                  className={clsx(
                    "absolute top-1/4 right-1/4 w-32 h-32 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center",
                    selectedZone === "zone-f" 
                      ? "bg-emerald-600/20 border-2 border-emerald-600" 
                      : viewMode === "microzones"
                        ? "bg-emerald-600/10 border-2 border-emerald-600/30 hover:border-emerald-600/60 hover:bg-emerald-600/20"
                        : "bg-transparent border-2 border-transparent hover:border-primary/30 hover:bg-primary/5"
                  )}
                  onClick={() => onSelectZone("zone-f")}
                  style={{ pointerEvents: viewMode === "microzones" || selectedZone === "zone-f" || viewMode === "base" ? 'auto' : 'none' }}
                >
                  {(viewMode === "microzones" || selectedZone === "zone-f") && (
                    <span className="text-[10px] font-medium text-emerald-900 bg-emerald-100/90 px-1.5 py-0.5 rounded backdrop-blur-md shadow-sm border border-emerald-200">Zone F</span>
                  )}
                </button>

              </div>

              {/* Compass / Scale */}
              <div className="absolute top-8 right-8 flex flex-col items-center opacity-50">
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[12px] border-l-transparent border-r-transparent border-b-foreground mb-1" />
                <span className="text-[10px] font-medium tracking-widest">N</span>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Layer Controls - Only show if searched */}
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
