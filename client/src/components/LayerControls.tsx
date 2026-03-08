import { Map as MapIcon, Sun, Wind, Droplets, Thermometer, Layers, Snowflake, Leaf, Sun as SunHot, BoxSelect } from "lucide-react";
import { ViewMode, Season } from "@/pages/Home";
import clsx from "clsx";

interface LayerControlsProps {
  viewMode: ViewMode;
  season: Season;
  onViewModeChange: (mode: ViewMode) => void;
  onSeasonChange: (season: Season) => void;
}

export default function LayerControls({ viewMode, season, onViewModeChange, onSeasonChange }: LayerControlsProps) {
  
  const modes: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: "base", label: "Base Plan", icon: <MapIcon className="w-4 h-4" /> },
    { id: "sun", label: "Sun/Shade", icon: <Sun className="w-4 h-4" /> },
    { id: "wind", label: "Wind", icon: <Wind className="w-4 h-4" /> },
    { id: "water", label: "Water", icon: <Droplets className="w-4 h-4" /> },
    { id: "heat", label: "Heat", icon: <Thermometer className="w-4 h-4" /> },
    { id: "microzones", label: "Zones", icon: <BoxSelect className="w-4 h-4" /> },
    { id: "composite", label: "Composite", icon: <Layers className="w-4 h-4" /> },
  ];

  const seasons: { id: Season; label: string; icon: React.ReactNode }[] = [
    { id: "winter", label: "Winter", icon: <Snowflake className="w-3.5 h-3.5" /> },
    { id: "spring_fall", label: "Spring/Fall", icon: <Leaf className="w-3.5 h-3.5" /> },
    { id: "summer", label: "Summer", icon: <SunHot className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20">
      
      {/* Seasonal Toggle (Smaller) */}
      <div className="bg-background/90 backdrop-blur-md border border-border/60 rounded-full p-1 shadow-sm flex items-center">
        {seasons.map((s) => (
          <button
            key={s.id}
            onClick={() => onSeasonChange(s.id)}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
              season === s.id 
                ? "bg-secondary text-secondary-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>

      {/* Main Layer Toggle (Prominent) */}
      <div className="bg-background/95 backdrop-blur-md border border-border/80 shadow-lg rounded-xl p-1.5 flex items-center gap-1">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onViewModeChange(mode.id)}
            className={clsx(
              "flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-lg transition-all duration-200 min-w-[80px]",
              viewMode === mode.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <div className={clsx(
              "transition-transform duration-200",
              viewMode === mode.id ? "scale-110" : "scale-100"
            )}>
              {mode.icon}
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              {mode.label}
            </span>
          </button>
        ))}
      </div>

    </div>
  );
}
