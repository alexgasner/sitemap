import { useState } from "react";
import Header from "@/components/Header";
import LeftPanel from "@/components/LeftPanel";
import MapCanvas from "@/components/MapCanvas";
import RightPanel from "@/components/RightPanel";

export type ViewMode = "base" | "sun" | "wind" | "water" | "heat" | "composite";
export type Season = "winter" | "spring_fall" | "summer";

export default function Home() {
  const [address, setAddress] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  
  // App State
  const [viewMode, setViewMode] = useState<ViewMode>("base");
  const [season, setSeason] = useState<Season>("spring_fall");
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const handleSearch = (newAddress: string) => {
    setAddress(newAddress);
    setHasSearched(true);
    // Reset selections on new search
    setSelectedZone(null);
    setViewMode("base");
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden selection:bg-primary/20 selection:text-primary">
      <Header 
        address={address} 
        onSearch={handleSearch} 
        hasSearched={hasSearched}
      />
      
      <main className="flex-1 flex overflow-hidden relative">
        {hasSearched ? (
          <>
            <LeftPanel 
              address={address}
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
              selectedZone={selectedZone}
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
          />
        )}
      </main>
    </div>
  );
}
