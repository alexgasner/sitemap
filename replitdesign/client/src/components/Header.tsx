import { Button } from "@/components/ui/button";
import { Download, Save, Settings, Search, Map as MapIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";

interface HeaderProps {
  address: string;
  onSearch: (address: string) => void;
  hasSearched: boolean;
}

export default function Header({ address, onSearch, hasSearched }: HeaderProps) {
  const [searchValue, setSearchValue] = useState(address);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    
    setIsSearching(true);
    // Simulate resolving the address
    setTimeout(() => {
      onSearch(searchValue);
      setIsSearching(false);
    }, 1200);
  };

  const handleDemo = () => {
    setSearchValue("1428 Elm Street, Example City, EX 90210");
    setIsSearching(true);
    setTimeout(() => {
      onSearch("1428 Elm Street, Example City, EX 90210");
      setIsSearching(false);
    }, 1200);
  }

  return (
    <header className="flex-none h-16 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-8 w-1/3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-sm bg-primary/10 flex items-center justify-center border border-primary/20">
              <MapIcon className="w-3.5 h-3.5 text-primary" />
            </div>
            <h1 className="font-display font-medium text-lg leading-none tracking-tight text-foreground">
              Site Layers
            </h1>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mt-1">
            Landscape Intelligence
          </span>
        </div>
      </div>

      <div className="w-1/3 flex justify-center max-w-md">
        <form onSubmit={handleSearch} className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            type="text"
            placeholder="Enter a property address"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-9 pr-24 h-10 bg-muted/50 border-transparent hover:border-border focus-visible:border-primary/30 focus-visible:ring-primary/20 shadow-none text-sm transition-all rounded-full"
          />
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mr-3" />
            ) : (
              !hasSearched && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground rounded-full"
                  onClick={handleDemo}
                >
                  Demo
                </Button>
              )
            )}
          </div>
        </form>
      </div>

      <div className="flex items-center justify-end gap-2 w-1/3">
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full">
          <Save className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full">
          <Download className="w-4 h-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-2" />
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
