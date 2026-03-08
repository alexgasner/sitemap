import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sun, Wind, Droplets, AlertTriangle, CheckCircle2 } from "lucide-react";
import { displayLabel, formatAcres, formatCoverage } from "@/lib/display";
import type { Property, Insight } from "@shared/domain";
import clsx from "clsx";

interface LeftPanelProps {
  property: Property;
  selectedZone: string | null;
  onSelectZone: (zoneId: string) => void;
}

export default function LeftPanel({ property, selectedZone, onSelectZone }: LeftPanelProps) {
  const constraints = property.insights.filter(i => i.type === "constraint");
  const opportunities = property.insights.filter(i => i.type === "opportunity");

  return (
    <div className="w-80 h-full border-r border-border/60 bg-card flex flex-col z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
      <ScrollArea className="flex-1">
        <div className="p-5 space-y-6">

          {/* Property Summary */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Property Summary</h2>
            <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
              <h3 className="font-medium text-sm text-foreground truncate" title={property.resolvedAddress}>
                {property.resolvedAddress.split(",")[0]}
              </h3>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  {formatAcres(property.areaStats.lotAreaSqFt)} &bull; {formatCoverage(property.areaStats.buildingCoverageSqFt, property.areaStats.lotAreaSqFt)}
                </p>
              </div>

              {/* Top insights as summary bullets */}
              <ul className="mt-3 space-y-1.5 text-xs text-foreground/80 leading-relaxed">
                {property.insights.filter(i => i.importance === "high").slice(0, 3).map(insight => (
                  <li key={insight.id} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary/50 mt-1.5 shrink-0" />
                    {insight.title}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Separator className="bg-border/50" />

          {/* Key Constraints */}
          {constraints.length > 0 && (
            <>
              <section className="space-y-3">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Key Constraints
                </h2>
                <div className="flex flex-wrap gap-2">
                  {constraints.map(c => (
                    <Badge key={c.id} variant="secondary" className="bg-destructive/10 text-destructive-foreground/80 hover:bg-destructive/15 border-transparent text-[10px] font-medium">
                      {c.title}
                    </Badge>
                  ))}
                </div>
              </section>
              <Separator className="bg-border/50" />
            </>
          )}

          {/* Key Opportunities */}
          {opportunities.length > 0 && (
            <>
              <section className="space-y-3">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Key Opportunities
                </h2>
                <div className="flex flex-wrap gap-2">
                  {opportunities.map(o => (
                    <Badge key={o.id} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/15 border-transparent text-[10px] font-medium">
                      {o.title}
                    </Badge>
                  ))}
                </div>
              </section>
              <Separator className="bg-border/50" />
            </>
          )}

          {/* Microzones */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Garden Microzones</h2>
              <Badge variant="outline" className="text-[10px] h-5 px-1.5">{property.microzones.length} Found</Badge>
            </div>

            <div className="space-y-2">
              {property.microzones.map((zone) => (
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
                      <Sun className="w-2.5 h-2.5" /> {displayLabel(zone.lightClass)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground" title="Moisture">
                      <Droplets className="w-2.5 h-2.5" /> {displayLabel(zone.moistureClass)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground" title="Wind">
                      <Wind className="w-2.5 h-2.5" /> {displayLabel(zone.windClass)}
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
