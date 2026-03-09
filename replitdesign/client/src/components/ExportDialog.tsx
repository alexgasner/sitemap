import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Image } from "lucide-react";
import type { Property } from "@shared/domain";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property;
}

export default function ExportDialog({ open, onOpenChange, property }: ExportDialogProps) {
  const handlePrint = () => {
    onOpenChange(false);
    // Small delay to let dialog close before print dialog opens
    setTimeout(() => window.print(), 200);
  };

  const handleDownloadSvg = () => {
    const svgEl = document.querySelector(".map-svg");
    if (!svgEl) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgEl);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const filename = property
      ? `site-layers-${property.resolvedAddress.split(",")[0].replace(/\s+/g, "-").toLowerCase()}.svg`
      : "site-layers-export.svg";

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Analysis</DialogTitle>
          <DialogDescription>
            {property ? property.resolvedAddress : "Export your site analysis"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-2">
          <Button variant="outline" className="justify-start gap-3 h-12" onClick={handlePrint}>
            <FileText className="w-5 h-5 text-muted-foreground" />
            <div className="text-left">
              <div className="text-sm font-medium">Export PDF</div>
              <div className="text-xs text-muted-foreground">Print-optimized layout</div>
            </div>
          </Button>

          <Button variant="outline" className="justify-start gap-3 h-12" onClick={handleDownloadSvg}>
            <Image className="w-5 h-5 text-muted-foreground" />
            <div className="text-left">
              <div className="text-sm font-medium">Download SVG</div>
              <div className="text-xs text-muted-foreground">Vector map image</div>
            </div>
          </Button>
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Analysis date: {new Date().toLocaleDateString()}
        </p>
      </DialogContent>
    </Dialog>
  );
}
