import { X, HelpCircle, Leaf, Snowflake, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { displayLabel } from "@/lib/display";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import type { Microzone, Season } from "@shared/domain";

const SEASON_ICONS: Record<Season, typeof Sun> = {
  summer: Sun,
  winter: Snowflake,
  spring_fall: Leaf,
};

interface RightPanelProps {
  microzone: Microzone | null;
  onClose: () => void;
  season: Season;
}

export default function RightPanel({ microzone, onClose, season }: RightPanelProps) {
  if (!microzone) return null;

  const conditions = [
    { label: "Light", value: displayLabel(microzone.lightClass) },
    { label: "Moisture", value: displayLabel(microzone.moistureClass) },
    { label: "Wind", value: displayLabel(microzone.windClass) },
    { label: "Heat", value: displayLabel(microzone.heatClass) },
    { label: "Structure", value: displayLabel(microzone.supportClass) },
    { label: "Competition", value: displayLabel(microzone.competitionClass) },
  ];

  const seasonalNote = microzone.seasonalNotes.find(n => n.season === season);
  const SeasonIcon = SEASON_ICONS[season];

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-card border-l border-border/60 shadow-[-4px_0_24px_-12px_rgba(0,0,0,0.1)] z-20 flex flex-col animate-in slide-in-from-right-8 duration-300 print:hidden">
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <h2 className="font-display font-medium text-base text-foreground">Zone Detail</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-5 space-y-6">
          <div>
            <h3 className="text-xl font-display font-medium leading-tight mb-2">{microzone.name}</h3>
            <ConfidenceBadge confidence={microzone.confidence} />
          </div>

          {/* Conditions */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Conditions</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {conditions.map(c => (
                <div key={c.label} className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">{c.label}</span>
                  <span className="font-medium text-right">{c.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interpretation / Rationale */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Interpretation</h4>
            <p className="text-sm leading-relaxed text-foreground/80">
              {microzone.rationale}
            </p>
          </div>

          {/* Source Inputs */}
          {microzone.sourceInputs.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Source Inputs</h4>
              <div className="flex flex-wrap gap-1.5">
                {microzone.sourceInputs.map(input => (
                  <span key={input} className="text-[10px] bg-muted/70 border border-border/40 px-1.5 py-0.5 rounded text-muted-foreground">
                    {displayLabel(input)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Seasonal Note */}
          {seasonalNote && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Seasonal Note</h4>
              <div className="bg-muted/30 rounded-lg p-3 border border-border/40 flex gap-2.5">
                <SeasonIcon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed text-foreground/80">
                  {seasonalNote.note}
                </p>
              </div>
            </div>
          )}

          {/* Tags */}
          {microzone.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {microzone.tags.map(tag => (
                <span key={tag} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}

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
