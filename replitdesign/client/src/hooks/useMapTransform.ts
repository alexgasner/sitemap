import { useState, useRef, useCallback, useEffect } from "react";

interface Transform {
  scale: number;
  translateX: number;
  translateY: number;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 4;
const ZOOM_FACTOR = 0.002;

export function useMapTransform() {
  const containerRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState<Transform>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const svg = containerRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    // Cursor position relative to SVG element
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    setTransform((prev) => {
      const delta = -e.deltaY * ZOOM_FACTOR;
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale * (1 + delta)));
      const ratio = newScale / prev.scale;

      // Zoom toward cursor: adjust translate so the point under cursor stays fixed
      const newTx = cx - ratio * (cx - prev.translateX);
      const newTy = cy - ratio * (cy - prev.translateY);

      return { scale: newScale, translateX: newTx, translateY: newTy };
    });
  }, []);

  // Attach wheel listener with { passive: false } to allow preventDefault
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Only pan on primary button (left click)
      if (e.button !== 0) return;
      setIsPanning(true);
      panStart.current = {
        x: e.clientX,
        y: e.clientY,
        tx: transform.translateX,
        ty: transform.translateY,
      };
      (e.target as Element).setPointerCapture(e.pointerId);
    },
    [transform.translateX, transform.translateY],
  );

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!panStart.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setTransform((prev) => ({
      ...prev,
      translateX: panStart.current!.tx + dx,
      translateY: panStart.current!.ty + dy,
    }));
  }, []);

  const handlePointerUp = useCallback(() => {
    setIsPanning(false);
    panStart.current = null;
  }, []);

  const resetView = useCallback(() => {
    setTransform({ scale: 1, translateX: 0, translateY: 0 });
  }, []);

  const zoomIn = useCallback(() => {
    setTransform((prev) => {
      const newScale = Math.min(MAX_SCALE, prev.scale * 1.3);
      const svg = containerRef.current;
      if (!svg) return { ...prev, scale: newScale };
      const rect = svg.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const ratio = newScale / prev.scale;
      return {
        scale: newScale,
        translateX: cx - ratio * (cx - prev.translateX),
        translateY: cy - ratio * (cy - prev.translateY),
      };
    });
  }, []);

  const zoomOut = useCallback(() => {
    setTransform((prev) => {
      const newScale = Math.max(MIN_SCALE, prev.scale / 1.3);
      const svg = containerRef.current;
      if (!svg) return { ...prev, scale: newScale };
      const rect = svg.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const ratio = newScale / prev.scale;
      return {
        scale: newScale,
        translateX: cx - ratio * (cx - prev.translateX),
        translateY: cy - ratio * (cy - prev.translateY),
      };
    });
  }, []);

  // CSS transform for the inner <g> element
  const svgTransform = `translate(${transform.translateX}, ${transform.translateY}) scale(${transform.scale})`;

  return {
    containerRef,
    svgTransform,
    isPanning,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    resetView,
    zoomIn,
    zoomOut,
  };
}
