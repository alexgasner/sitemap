import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sun, Wind, Droplets } from "lucide-react";
import { displayLabel } from "@/lib/display";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import type { Property, Insight } from "@shared/domain";
import clsx from "clsx";

interface LeftPanelProps {
  property: Property;
  selectedZone: string | null;
  onSelectZone: (zoneId: string) => void;
}

function InsightCard({ insight }: { insight: Insight }) {
  return (
    <div className="bg-card border border-border/50 rounded-lg p-3 space-y-1.5">
      <div className="flex items-start gap-2">
        <div
          className={clsx(
            "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
            insight.importance === "high" ? "bg-primary" : "bg-muted-foreground/30",
          )}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-tight">{insight.title}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{insight.body}</p>
        </div>
      </div>
      <div className="pl-3.5">
        <ConfidenceBadge confidence={insight.confidence} size="sm" />
      </div>
    </div>
  );
}

export default function LeftPanel({ property, selectedZone, onSelectZone }: LeftPanelProps) {
  const constraints = property.insights.filter(i => i.type === "constraint");
  const opportunities = property.insights.filter(i => i.type === "opportunity");

  return (
    <div className="w-80 h-full border-r border-border/60 bg-card flex flex-col z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] print:block print:w-full print:shadow-none print:border-none">
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
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key Constraints</h2>
                <div className="space-y-2">
                  {constraints.map(c => (
                    <InsightCard key={c.id} insight={c} />
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
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key Opportunities</h2>
                <div className="space-y-2">
                  {opportunities.map(o => (
                    <InsightCard key={o.id} insight={o} />
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

// Inline helpers (previously imported but kept local for simplicity)
function formatAcres(sqFt: number): string {
  return `~${(sqFt / 43560).toFixed(2)} acres`;
}

function formatCoverage(buildingSqFt: number, lotSqFt: number): string {
  return `${Math.round((buildingSqFt / lotSqFt) * 100)}% building coverage`;
}
