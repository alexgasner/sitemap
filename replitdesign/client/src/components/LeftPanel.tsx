import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Info, Sun, Wind, Droplets, Thermometer, Box, AlertTriangle, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

interface LeftPanelProps {
  address: string;
  selectedZone: string | null;
  onSelectZone: (zoneId: string) => void;
}

const MICROZONES = [
  { id: "zone-a", name: "South Wall Warm Pocket", light: "Full sun", moisture: "Dry", wind: "Sheltered", heat: "Warm", support: "Wall-adjacent" },
  { id: "zone-b", name: "Exposed West Edge", light: "Part sun", moisture: "Balanced", wind: "Exposed", heat: "Neutral", support: "Open bed" },
  { id: "zone-c", name: "Cool North Side Shade", light: "Deep shade", moisture: "Moist", wind: "Sheltered", heat: "Cool", support: "Foundation strip" },
  { id: "zone-d", name: "Wet Rear Corner", light: "Part shade", moisture: "Wet", wind: "Moderate", heat: "Neutral", support: "Under canopy" },
  { id: "zone-e", name: "Open Sunny Planting Bed", light: "Full sun", moisture: "Balanced", wind: "Moderate", heat: "Neutral", support: "Open bed" },
  { id: "zone-f", name: "Tree Root Competition Zone", light: "Bright shade", moisture: "Dry", wind: "Moderate", heat: "Neutral", support: "Under canopy" },
];

export default function LeftPanel({ address, selectedZone, onSelectZone }: LeftPanelProps) {
  return (
    <div className="w-80 h-full border-r border-border/60 bg-card flex flex-col z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
      <ScrollArea className="flex-1">
        <div className="p-5 space-y-6">
          
          {/* Property Summary */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Property Summary</h2>
            <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
              <h3 className="font-medium text-sm text-foreground truncate" title={address}>
                {address.split(',')[0]}
              </h3>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">~0.15 acres • 35% building coverage</p>
                <Badge variant="outline" className="text-[10px] font-medium bg-background/50 text-foreground/80">Zone 9b</Badge>
              </div>
              
              <ul className="mt-3 space-y-1.5 text-xs text-foreground/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-primary/50 mt-1.5 shrink-0" />
                  Front yard appears exposed and heat-reflective
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-primary/50 mt-1.5 shrink-0" />
                  North side is cooler and more shaded
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-primary/50 mt-1.5 shrink-0" />
                  South wall creates a protected warm microclimate
                </li>
              </ul>
            </div>
          </section>

          <Separator className="bg-border/50" />

          {/* Key Constraints */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Key Constraints
            </h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-destructive/10 text-destructive-foreground/80 hover:bg-destructive/15 border-transparent text-[10px] font-medium">Deep shade</Badge>
              <Badge variant="secondary" className="bg-destructive/10 text-destructive-foreground/80 hover:bg-destructive/15 border-transparent text-[10px] font-medium">Poor drainage</Badge>
              <Badge variant="secondary" className="bg-destructive/10 text-destructive-foreground/80 hover:bg-destructive/15 border-transparent text-[10px] font-medium">Root competition</Badge>
            </div>
          </section>

          <Separator className="bg-border/50" />

          {/* Key Opportunities */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Key Opportunities
            </h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/15 border-transparent text-[10px] font-medium">Warm wall-adjacent zone</Badge>
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/15 border-transparent text-[10px] font-medium">Best full-sun planting</Badge>
            </div>
          </section>

          <Separator className="bg-border/50" />

          {/* Microzones */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Garden Microzones</h2>
              <Badge variant="outline" className="text-[10px] h-5 px-1.5">6 Found</Badge>
            </div>
            
            <div className="space-y-2">
              {MICROZONES.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => onSelectZone(zone.id)}
                  className={clsx(
                    "w-full text-left p-3 rounded-lg border transition-all duration-200 text-sm",
                    selectedZone === zone.id 
                      ? "bg-primary/5 border-primary/30 shadow-sm" 
                      : "bg-card border-border/50 hover:border-primary/20 hover:bg-muted/30"
                  )}
                >
                  <div className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <div className={clsx(
                      "w-2 h-2 rounded-full",
                      selectedZone === zone.id ? "bg-primary" : "bg-muted-foreground/30"
                    )} />
                    {zone.name}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground" title="Light">
                      <Sun className="w-2.5 h-2.5" /> {zone.light}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground" title="Moisture">
                      <Droplets className="w-2.5 h-2.5" /> {zone.moisture}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground" title="Wind">
                      <Wind className="w-2.5 h-2.5" /> {zone.wind}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

        </div>
      </ScrollArea>
    </div>
  );
}
