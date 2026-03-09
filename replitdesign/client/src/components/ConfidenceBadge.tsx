import { displayLabel } from "@/lib/display";
import type { ConfidenceLevel } from "@shared/domain";
import { CheckCircle2 } from "lucide-react";
import clsx from "clsx";

const DOT_COLORS: Record<ConfidenceLevel, string> = {
  authoritative: "bg-green-500",
  detected: "bg-blue-500",
  inferred: "bg-amber-500",
  modeled: "bg-purple-500",
  user_confirmed: "bg-green-500",
};

interface ConfidenceBadgeProps {
  confidence: ConfidenceLevel;
  size?: "sm" | "md";
}

export default function ConfidenceBadge({ confidence, size = "md" }: ConfidenceBadgeProps) {
  const isConfirmed = confidence === "user_confirmed";
  const dotColor = DOT_COLORS[confidence];

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded bg-muted/50 font-medium text-muted-foreground uppercase tracking-wider",
        size === "sm" ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[10px]",
      )}
    >
      {isConfirmed ? (
        <CheckCircle2 className={size === "sm" ? "w-2.5 h-2.5 text-green-500" : "w-3 h-3 text-green-500"} />
      ) : (
        <span className={clsx("rounded-full", dotColor, size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2")} />
      )}
      {displayLabel(confidence)}
    </span>
  );
}
