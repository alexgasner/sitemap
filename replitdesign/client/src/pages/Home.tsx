import { useState } from "react";
import Header from "@/components/Header";
import LeftPanel from "@/components/LeftPanel";
import MapCanvas from "@/components/MapCanvas";
import RightPanel from "@/components/RightPanel";
import { useDemoProperty } from "@/hooks/useProperty";
import type { ViewMode, Season } from "@shared/domain";

export default function Home() {
  const [demoRequested, setDemoRequested] = useState(false);
  const { data: property, isLoading, error } = useDemoProperty(demoRequested);

  // App state
  const [viewMode, setViewMode] = useState<ViewMode>("base");
  const [season, setSeason] = useState<Season>("spring_fall");
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const hasSearched = !!property;

  const handleSearch = (_address: string) => {
    // For now, any search triggers the demo property
    setSelectedZone(null);
    setViewMode("base");
    setDemoRequested(true);
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
      </main>
    </div>
  );
}
