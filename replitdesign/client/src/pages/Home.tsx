import { useState } from "react";
import Header from "@/components/Header";
import LeftPanel from "@/components/LeftPanel";
import MapCanvas from "@/components/MapCanvas";
import RightPanel from "@/components/RightPanel";
import AnalysisProgress from "@/components/AnalysisProgress";
import { useDemoProperty, useAnalyzeProperty } from "@/hooks/useProperty";
import type { ViewMode, Season } from "@shared/domain";

export default function Home() {
  const [demoRequested, setDemoRequested] = useState(false);
  const { data: demoData, isLoading: isDemoLoading, error: demoError } = useDemoProperty(demoRequested);
  const analyzeMutation = useAnalyzeProperty();

  // App state
  const [viewMode, setViewMode] = useState<ViewMode>("base");
  const [season, setSeason] = useState<Season>("spring_fall");
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // Unified property: prefer analyze result over demo
  const property = analyzeMutation.data ?? demoData ?? undefined;
  const isLoading = isDemoLoading || analyzeMutation.isPending;
  const error = analyzeMutation.error ?? demoError ?? undefined;
  const hasSearched = !!property;

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

  const selectedMicrozone = property?.microzones.find(z => z.id === selectedZone) ?? null;

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden selection:bg-primary/20 selection:text-primary">
      <Header
        onSearch={handleSearch}
        onDemo={handleDemo}
        isLoading={isLoading}
        hasSearched={hasSearched}
        resolvedAddress={property?.resolvedAddress}
      />

      <main className="flex-1 flex overflow-hidden relative">
        {hasSearched ? (
          <>
            <LeftPanel
              property={property}
              selectedZone={selectedZone}
              onSelectZone={setSelectedZone}
            />

            <MapCanvas
              property={property}
              hasSearched={true}
              viewMode={viewMode}
              season={season}
              onViewModeChange={setViewMode}
              onSeasonChange={setSeason}
              selectedZone={selectedZone}
              onSelectZone={setSelectedZone}
            />

            <RightPanel
              microzone={selectedMicrozone}
              onClose={() => setSelectedZone(null)}
              season={season}
            />
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
        />
      </main>
    </div>
  );
}
