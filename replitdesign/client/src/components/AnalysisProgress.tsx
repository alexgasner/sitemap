import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STAGES = [
  "Resolving property...",
  "Detecting structures...",
  "Computing sun and shade...",
  "Modeling wind and moisture...",
  "Generating garden microzones...",
];

const STAGE_DURATION_MS = 800;

interface AnalysisProgressProps {
  isActive: boolean;
  hasError: boolean;
}

export default function AnalysisProgress({ isActive, hasError }: AnalysisProgressProps) {
  const [stageIndex, setStageIndex] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);
  const [visible, setVisible] = useState(false);
  const apiDoneRef = useRef(false);

  // Track when the API is done
  useEffect(() => {
    if (isActive) {
      apiDoneRef.current = false;
      setStageIndex(0);
      setAnimationDone(false);
      setVisible(true);
    } else {
      apiDoneRef.current = true;
    }
  }, [isActive]);

  // Advance stages on a timer
  useEffect(() => {
    if (!visible || hasError) return;

    if (stageIndex >= STAGES.length - 1) {
      setAnimationDone(true);
      return;
    }

    const timer = setTimeout(() => {
      setStageIndex(i => i + 1);
    }, STAGE_DURATION_MS);

    return () => clearTimeout(timer);
  }, [stageIndex, visible, hasError]);

  // Dismiss when both API and animation are done
  useEffect(() => {
    if (animationDone && apiDoneRef.current && !isActive) {
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [animationDone, isActive]);

  if (!visible) return null;

  const progress = ((stageIndex + 1) / STAGES.length) * 100;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div className="bg-card border border-border/50 shadow-2xl rounded-2xl px-10 py-8 max-w-sm w-full text-center">
        {hasError ? (
          <p className="text-sm text-destructive font-medium">Analysis failed. Please try again.</p>
        ) : (
          <>
            <div className="h-8 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={stageIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm font-medium text-foreground"
                >
                  {STAGES[stageIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mt-4 flex justify-center gap-1.5">
              {STAGES.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    i <= stageIndex ? "bg-primary" : "bg-muted-foreground/20"
                  }`}
                />
              ))}
            </div>

            <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
