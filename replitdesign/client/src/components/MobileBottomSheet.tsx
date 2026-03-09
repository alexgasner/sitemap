import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sun, Wind, Droplets } from "lucide-react";
import { displayLabel } from "@/lib/display";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import type { Property, Insight } from "@shared/domain";
import clsx from "clsx";

interface MobileBottomSheetProps {
  property: Property;
  selectedZone: string | null;
  onSelectZone: (zoneId: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Tab = "summary" | "zones" | "insights";

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

export default function MobileBottomSheet({ property, selectedZone, onSelectZone, open, onOpenChange }: MobileBottomSheetProps) {
  const [activeTab, setActiveTab] = useState<Tab>("summary");

  const constraints = property.insights.filter(i => i.type === "constraint");
  const opportunities = property.insights.filter(i => i.type === "opportunity");

  const handleZoneClick = (zoneId: string) => {
    onSelectZone(zoneId);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[60vh]">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-sm font-medium">
            {property.resolvedAddress.split(",")[0]}
          </DrawerTitle>
          {/* Tab bar */}
          <div className="flex gap-1 mt-2">
            {(["summary", "zones", "insights"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "flex-1 py-1.5 text-xs font-medium rounded-md transition-colors",
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {tab === "summary" ? "Summary" : tab === "zones" ? "Zones" : "Insights"}
              </button>
            ))}
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-4 pb-4">
          {activeTab === "summary" && (
            <div className="space-y-3">
              <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground">
                  {formatAcres(property.areaStats.lotAreaSqFt)} &bull; {formatCoverage(property.areaStats.buildingCoverageSqFt, property.areaStats.lotAreaSqFt)}
                </p>
                <ul className="mt-2 space-y-1.5 text-xs text-foreground/80">
                  {property.insights.filter(i => i.importance === "high").slice(0, 3).map(insight => (
                    <li key={insight.id} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary/50 mt-1.5 shrink-0" />
                      {insight.title}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-xs text-muted-foreground">
                {property.microzones.length} microzones &bull; {property.insights.length} insights
              </div>
            </div>
          )}

          {activeTab === "zones" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Garden Microzones</span>
                <Badge variant="outline" className="text-[10px] h-5 px-1.5">{property.microzones.length}</Badge>
              </div>
              {property.microzones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => handleZoneClick(zone.id)}
                  className={clsx(
                    "w-full text-left p-3 rounded-lg border transition-all duration-200 text-sm",
                    selectedZone === zone.id
                      ? "bg-primary/5 border-primary/30 shadow-sm"
                      : "bg-card border-border/50 hover:border-primary/20"
                  )}
                >
                  <div className="font-medium text-foreground mb-1.5 flex items-center gap-2">
                    <div className={clsx(
                      "w-2 h-2 rounded-full",
                      selectedZone === zone.id ? "bg-primary" : "bg-muted-foreground/30"
                    )} />
                    {zone.name}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                      <Sun className="w-2.5 h-2.5" /> {displayLabel(zone.lightClass)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                      <Droplets className="w-2.5 h-2.5" /> {displayLabel(zone.moistureClass)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                      <Wind className="w-2.5 h-2.5" /> {displayLabel(zone.windClass)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === "insights" && (
            <div className="space-y-4">
              {constraints.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Constraints</h3>
                  {constraints.map(c => <InsightCard key={c.id} insight={c} />)}
                </div>
              )}
              {constraints.length > 0 && opportunities.length > 0 && <Separator className="bg-border/50" />}
              {opportunities.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Opportunities</h3>
                  {opportunities.map(o => <InsightCard key={o.id} insight={o} />)}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}

function formatAcres(sqFt: number): string {
  return `~${(sqFt / 43560).toFixed(2)} acres`;
}

function formatCoverage(buildingSqFt: number, lotSqFt: number): string {
  return `${Math.round((buildingSqFt / lotSqFt) * 100)}% building coverage`;
}
