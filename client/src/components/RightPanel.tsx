import { X, Info, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface RightPanelProps {
  selectedZone: string | null;
  onClose: () => void;
}

// Mock data matching LeftPanel
const ZONE_DETAILS: Record<string, any> = {
  "zone-a": { 
    name: "South Wall Warm Pocket", 
    light: "Full sun", 
    moisture: "Dry", 
    wind: "Sheltered", 
    heat: "Elevated", 
    support: "Wall-adjacent / trellis-capable",
    competition: "Low",
    confidence: "Medium",
    interpretation: "This zone receives strong solar exposure and benefits from reflected warmth from the south-facing wall. It appears relatively protected from prevailing winds but may dry quickly because of wall adjacency and reduced rainfall exposure."
  },
  "zone-c": {
    name: "Cool North Side Shade",
    light: "Deep shade",
    moisture: "Moist",
    wind: "Sheltered",
    heat: "Cool",
    support: "Foundation strip",
    competition: "Low",
    confidence: "High",
    interpretation: "Persistently shaded by the building structure. This area stays cooler and retains moisture longer than the rest of the property. Ideal for shade-adapted understory planting, but watch for potential moss or poor drainage."
  }
};

export default function RightPanel({ selectedZone, onClose }: RightPanelProps) {
  if (!selectedZone) return null;

  // Fallback to zone-a data if exact ID isn't mocked
  const details = ZONE_DETAILS[selectedZone] || {
    ...ZONE_DETAILS["zone-a"],
    name: "Selected Microzone"
  };

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-card border-l border-border/60 shadow-[-4px_0_24px_-12px_rgba(0,0,0,0.1)] z-20 flex flex-col animate-in slide-in-from-right-8 duration-300">
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <h2 className="font-display font-medium text-base text-foreground">Zone Detail</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-5 space-y-6">
          <div>
            <h3 className="text-xl font-display font-medium leading-tight mb-2">{details.name}</h3>
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-muted/50 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              <Info className="w-3 h-3" /> Confidence: {details.confidence}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Conditions</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between py-1 border-b border-border/30">
                <span className="text-muted-foreground">Light</span>
                <span className="font-medium text-right">{details.light}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/30">
                <span className="text-muted-foreground">Moisture</span>
                <span className="font-medium text-right">{details.moisture}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/30">
                <span className="text-muted-foreground">Wind</span>
                <span className="font-medium text-right">{details.wind}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/30">
                <span className="text-muted-foreground">Heat</span>
                <span className="font-medium text-right">{details.heat}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/30">
                <span className="text-muted-foreground">Structure</span>
                <span className="font-medium text-right">{details.support}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/30">
                <span className="text-muted-foreground">Competition</span>
                <span className="font-medium text-right">{details.competition}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Interpretation</h4>
            <p className="text-sm leading-relaxed text-foreground/80">
              {details.interpretation}
            </p>
          </div>

          <div className="bg-accent/30 rounded-lg p-4 mt-6">
            <div className="flex gap-2">
              <HelpCircle className="w-4 h-4 text-accent-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-accent-foreground/90 leading-relaxed">
                This analysis is foundation for future planting advice. Do not make specific plant choices based solely on these raw layers yet.
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
