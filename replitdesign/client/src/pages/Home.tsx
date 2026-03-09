import { useState, useEffect } from "react";
import Header from "@/components/Header";
import LeftPanel from "@/components/LeftPanel";
import MapCanvas from "@/components/MapCanvas";
import RightPanel from "@/components/RightPanel";
import AnalysisProgress from "@/components/AnalysisProgress";
import MobileBottomSheet from "@/components/MobileBottomSheet";
import MobileZoneDetail from "@/components/MobileZoneDetail";
import ExportDialog from "@/components/ExportDialog";
import { useDemoProperty, useAnalyzeProperty } from "@/hooks/useProperty";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useToast } from "@/hooks/use-toast";
import type { ViewMode, Season } from "@shared/domain";

export default function Home() {
  const [demoRequested, setDemoRequested] = useState(false);
  const { data: demoData, isLoading: isDemoLoading, error: demoError } = useDemoProperty(demoRequested);
  const analyzeMutation = useAnalyzeProperty();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // App state
  const [viewMode, setViewMode] = useState<ViewMode>("base");
  const [season, setSeason] = useState<Season>("spring_fall");
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  // Unified property: prefer analyze result over demo
  const property = analyzeMutation.data ?? demoData ?? undefined;
  const isLoading = isDemoLoading || analyzeMutation.isPending;
  const error = analyzeMutation.error ?? demoError ?? undefined;
  const hasSearched = !!property;

  // Error toasts
  useEffect(() => {
    if (analyzeMutation.error) {
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: analyzeMutation.error.message || "Could not analyze the property. Please try again.",
      });
    }
  }, [analyzeMutation.error]);

  useEffect(() => {
    if (demoError) {
      toast({
        variant: "destructive",
        title: "Could not load demo",
        description: demoError.message || "Failed to load the demo property.",
      });
    }
  }, [demoError]);

  const handleSearch = (address: string) => {
    setSelectedZone(null);
    setViewMode("base");
    setDemoRequested(false);
    analyzeMutation.mutate(address);
  };

  const handleDemo = () => {
    setSelectedZone(null);
    setViewMode("base");
    setDemoRequested(true);
  };

  const handleRetry = () => {
    analyzeMutation.reset();
  };

  const handleSave = () => {
    if (!property) return;
    localStorage.setItem("sl_saved_analysis", JSON.stringify(property));
    toast({ title: "Analysis saved", description: "Saved to local storage." });
  };

  const handleExport = () => {
    setExportDialogOpen(true);
  };

  const handleSelectZone = (zoneId: string) => {
    setSelectedZone(zoneId);
    if (isMobile) {
      setMobileSheetOpen(false);
    }
  };

  const selectedMicrozone = property?.microzones.find(z => z.id === selectedZone) ?? null;

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden selection:bg-primary/20 selection:text-primary">
      <Header
        onSearch={handleSearch}
        onDemo={handleDemo}
        isLoading={isLoading}
        hasSearched={hasSearched}
        resolvedAddress={property?.resolvedAddress}
        onExport={handleExport}
        onSave={handleSave}
      />

      <main className="flex-1 flex overflow-hidden relative">
        {hasSearched ? (
          <>
            {/* Desktop: three-panel layout */}
            {!isMobile && (
              <LeftPanel
                property={property}
                selectedZone={selectedZone}
                onSelectZone={handleSelectZone}
              />
            )}

            <MapCanvas
              property={property}
              hasSearched={true}
              viewMode={viewMode}
              season={season}
              onViewModeChange={setViewMode}
              onSeasonChange={setSeason}
              selectedZone={selectedZone}
              onSelectZone={handleSelectZone}
            />

            {/* Desktop: right panel */}
            {!isMobile && (
              <RightPanel
                microzone={selectedMicrozone}
                onClose={() => setSelectedZone(null)}
                season={season}
              />
            )}

            {/* Mobile: floating button to open bottom sheet */}
            {isMobile && (
              <button
                className="absolute bottom-24 left-4 z-30 bg-background/95 backdrop-blur-md border border-border/60 rounded-full px-4 py-2 text-xs font-medium text-foreground shadow-lg"
                onClick={() => setMobileSheetOpen(true)}
              >
                Zones
              </button>
            )}

            {/* Mobile: bottom sheet */}
            {isMobile && property && (
              <MobileBottomSheet
                property={property}
                selectedZone={selectedZone}
                onSelectZone={handleSelectZone}
                open={mobileSheetOpen}
                onOpenChange={setMobileSheetOpen}
              />
            )}

            {/* Mobile: zone detail drawer */}
            {isMobile && (
              <MobileZoneDetail
                microzone={selectedMicrozone}
                onClose={() => setSelectedZone(null)}
                season={season}
              />
            )}
          </>
        ) : (
          <MapCanvas
            hasSearched={false}
            viewMode="base"
            season="spring_fall"
            onViewModeChange={() => {}}
            onSeasonChange={() => {}}
            selectedZone={null}
            onSelectZone={() => {}}
            isLoading={isLoading}
            error={error?.message}
          />
        )}

        <AnalysisProgress
          isActive={isLoading}
          hasError={!!error}
          onRetry={handleRetry}
        />
      </main>

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        property={property}
      />
    </div>
  );
}
