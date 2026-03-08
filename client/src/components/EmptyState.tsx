import { Layers, MapPin, Grid, Compass } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center animate-in fade-in duration-500 zoom-in-95">
      <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-10 max-w-lg w-full text-center shadow-sm">
        
        <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/10">
          <Layers className="w-8 h-8 text-primary/70" strokeWidth={1.5} />
        </div>

        <h2 className="font-display text-2xl font-medium text-foreground tracking-tight mb-3">
          Enter an address to generate a layered landscape site analysis.
        </h2>
        
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          Site Layers instantly resolves property boundaries, environmental constraints, and microclimate data to create an interactive garden foundation map.
        </p>

        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/40 shadow-sm">
            <MapPin className="w-4 h-4 text-primary mt-0.5" />
            <div>
              <div className="text-sm font-medium text-foreground">Base Geometry</div>
              <div className="text-xs text-muted-foreground mt-0.5">Lot lines & building footprint</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/40 shadow-sm">
            <Grid className="w-4 h-4 text-primary mt-0.5" />
            <div>
              <div className="text-sm font-medium text-foreground">Environmental Overlays</div>
              <div className="text-xs text-muted-foreground mt-0.5">Sun, wind, heat & drainage</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/40 shadow-sm col-span-2">
            <Compass className="w-4 h-4 text-primary mt-0.5" />
            <div>
              <div className="text-sm font-medium text-foreground">Garden Microzones</div>
              <div className="text-xs text-muted-foreground mt-0.5">Synthesized actionable zones for planting</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}