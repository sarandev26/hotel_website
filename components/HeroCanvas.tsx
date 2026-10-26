"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { TOTAL_FRAMES, getFramePath } from "@/lib/journey";

interface HeroCanvasProps {
  currentFrameIndex: number;
  isVisible: boolean;
}

export default function HeroCanvas({
  currentFrameIndex,
  isVisible,
}: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES).fill(null)
  );
  const isLoadedRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
  const isRequestedRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
  const decodedRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));

  const currentFrameIndexRef = useRef<number>(currentFrameIndex);
  currentFrameIndexRef.current = currentFrameIndex;

  const lastDrawnIndexRef = useRef<number>(-1);
  const lastDrawnImgRef = useRef<HTMLImageElement | null>(null);
  const isVisibleRef = useRef<boolean>(isVisible);
  isVisibleRef.current = isVisible;
  const needsRedrawRef = useRef<boolean>(true);

  // Helper: Find nearest loaded frame with valid natural dimensions
  const getNearestLoadedFrame = useCallback(
    (targetIdx: number): HTMLImageElement | null => {
      const images = imagesRef.current;
      const isLoaded = isLoadedRef.current;

      const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, targetIdx));

      if (isLoaded[clamped] && images[clamped]?.complete && images[clamped]!.naturalWidth > 0) {
        return images[clamped];
      }

      // Radiate outward from target index to find closest loaded frame
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = clamped - offset;
        if (
          prev >= 0 &&
          isLoaded[prev] &&
          images[prev]?.complete &&
          images[prev]!.naturalWidth > 0
        ) {
          return images[prev];
        }
        const next = clamped + offset;
        if (
          next < TOTAL_FRAMES &&
          isLoaded[next] &&
          images[next]?.complete &&
          images[next]!.naturalWidth > 0
        ) {
          return images[next];
        }
      }

      return null;
    },
    []
  );

  // Helper: Draw frame with exact cover-fit math on canvas
  const drawFrame = useCallback(
    (targetIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const img = getNearestLoadedFrame(targetIndex);
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const width = canvas.width;
      const height = canvas.height;
      if (width === 0 || height === 0) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Cover-fit math based on image's natural dimensions
      const imgWidth = img.naturalWidth || 1280;
      const imgHeight = img.naturalHeight || 720;
      const canvasRatio = width / height;
      const imgRatio = imgWidth / imgHeight;

      let drawW: number;
      let drawH: number;
      let drawX: number;
      let drawY: number;

      if (canvasRatio > imgRatio) {
        drawW = width;
        drawH = width / imgRatio;
        drawX = 0;
        drawY = (height - drawH) / 2;
      } else {
        drawH = height;
        drawW = height * imgRatio;
        drawX = (width - drawW) / 2;
        drawY = 0;
      }

      // Check boundary crossfades (6 frames around index 120 and 240)
      if (targetIndex >= 117 && targetIndex <= 122) {
        const t = (targetIndex - 117) / 5; // 0 to 1
        const v1Last = getNearestLoadedFrame(119);
        const v2First = getNearestLoadedFrame(120);
        if (v1Last && v2First && v1Last !== v2First) {
          ctx.globalAlpha = 1;
          ctx.drawImage(v1Last, drawX, drawY, drawW, drawH);
          ctx.globalAlpha = t;
          ctx.drawImage(v2First, drawX, drawY, drawW, drawH);
          ctx.globalAlpha = 1;
          lastDrawnIndexRef.current = targetIndex;
          lastDrawnImgRef.current = v2First;
          needsRedrawRef.current = false;
          return;
        }
      } else if (targetIndex >= 237 && targetIndex <= 242) {
        const t = (targetIndex - 237) / 5;
        const v2Last = getNearestLoadedFrame(239);
        const v3First = getNearestLoadedFrame(240);
        if (v2Last && v3First && v2Last !== v3First) {
          ctx.globalAlpha = 1;
          ctx.drawImage(v2Last, drawX, drawY, drawW, drawH);
          ctx.globalAlpha = t;
          ctx.drawImage(v3First, drawX, drawY, drawW, drawH);
          ctx.globalAlpha = 1;
          lastDrawnIndexRef.current = targetIndex;
          lastDrawnImgRef.current = v3First;
          needsRedrawRef.current = false;
          return;
        }
      }

      ctx.globalAlpha = 1;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      lastDrawnIndexRef.current = targetIndex;
      lastDrawnImgRef.current = img;
      needsRedrawRef.current = false;
    },
    [getNearestLoadedFrame]
  );

  const drawFrameRef = useRef(drawFrame);
  drawFrameRef.current = drawFrame;

  // Single function to load a specific frame index
  const loadSingleFrame = useCallback((idx: number, priority = false) => {
    if (idx < 0 || idx >= TOTAL_FRAMES) return;
    if (isRequestedRef.current[idx]) return;
    isRequestedRef.current[idx] = true;

    const img = new window.Image();
    const info = getFramePath(idx);
    img.src = info.path;

    img.onload = () => {
      imagesRef.current[idx] = img;
      isLoadedRef.current[idx] = true;

      // If this frame is at or near current position, redraw immediately
      const current = Math.round(currentFrameIndexRef.current);
      if (Math.abs(idx - current) <= 6) {
        needsRedrawRef.current = true;
      }

      if (priority && img.decode) {
        img.decode().catch(() => {});
      }
    };

    img.onerror = () => {
      // Allow retry if needed
      isRequestedRef.current[idx] = false;
    };
  }, []);

  // 1. Progressive Preloading Strategy:
  // Phase 1: Load frames 0 to 15 immediately for instant start
  // Phase 2: Load coarse frames across the sequence (every 4th)
  // Phase 3: Load remaining fine frames
  useEffect(() => {
    let isCancelled = false;

    // Load poster image as instant fallback
    const posterImg = new window.Image();
    posterImg.src = "/images/hero-poster.jpg";
    posterImg.onload = () => {
      if (isCancelled) return;
      if (!isLoadedRef.current[0]) {
        imagesRef.current[0] = posterImg;
        isLoadedRef.current[0] = true;
        needsRedrawRef.current = true;
      }
    };

    // Load first 16 frames immediately
    for (let i = 0; i <= 15; i++) {
      loadSingleFrame(i, true);
    }

    // Coarse pass indices (every 4th)
    const coarseIndices: number[] = [];
    for (let i = 16; i < TOTAL_FRAMES; i += 4) {
      coarseIndices.push(i);
    }

    // Fine pass indices (all remaining)
    const fineIndices: number[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (i > 15 && i % 4 !== 0) {
        fineIndices.push(i);
      }
    }

    // Runner queue with concurrency
    const runQueue = (indices: number[], concurrency: number, onDone?: () => void) => {
      let cursor = 0;
      let active = 0;

      const spawn = () => {
        if (isCancelled) return;
        while (active < concurrency && cursor < indices.length) {
          const idx = indices[cursor++];
          if (isLoadedRef.current[idx] || isRequestedRef.current[idx]) {
            continue;
          }

          active++;
          isRequestedRef.current[idx] = true;
          const img = new window.Image();
          const info = getFramePath(idx);
          img.src = info.path;

          img.onload = () => {
            active--;
            if (!isCancelled) {
              imagesRef.current[idx] = img;
              isLoadedRef.current[idx] = true;
              const current = Math.round(currentFrameIndexRef.current);
              if (Math.abs(idx - current) <= 6) {
                needsRedrawRef.current = true;
              }
            }
            spawn();
          };

          img.onerror = () => {
            active--;
            isRequestedRef.current[idx] = false;
            spawn();
          };
        }

        if (active === 0 && cursor >= indices.length && onDone) {
          onDone();
        }
      };

      spawn();
    };

    // Run coarse pass with concurrency 6, then fine pass with concurrency 6
    const timer = setTimeout(() => {
      if (!isCancelled) {
        runQueue(coarseIndices, 6, () => {
          if (!isCancelled) {
            runQueue(fineIndices, 6);
          }
        });
      }
    }, 100);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [loadSingleFrame]);

  // 2. Dynamic Proximity Preloading: As user scrolls, prioritize frames +/- 12 around current position
  useEffect(() => {
    const current = Math.round(currentFrameIndex);
    const min = Math.max(0, current - 12);
    const max = Math.min(TOTAL_FRAMES - 1, current + 12);

    for (let i = min; i <= max; i++) {
      if (!isLoadedRef.current[i] && !isRequestedRef.current[i]) {
        loadSingleFrame(i, true);
      } else if (isLoadedRef.current[i] && imagesRef.current[i] && !decodedRef.current[i]) {
        decodedRef.current[i] = true;
        imagesRef.current[i]?.decode?.().catch(() => {});
      }
    }
  }, [currentFrameIndex, loadSingleFrame]);

  // 3. Set Canvas real pixel resolution (capped at 1.5 for peak 60fps performance)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(window.innerWidth * dpr);
      const h = Math.round(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        needsRedrawRef.current = true;
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize, { passive: true });
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // 4. One continuous requestAnimationFrame loop that renders smoothly
  useEffect(() => {
    let animId: number;

    const tick = () => {
      if (isVisibleRef.current) {
        const targetIdx = Math.max(
          0,
          Math.min(TOTAL_FRAMES - 1, Math.round(currentFrameIndexRef.current))
        );

        const currentBest = getNearestLoadedFrame(targetIdx);

        if (
          targetIdx !== lastDrawnIndexRef.current ||
          currentBest !== lastDrawnImgRef.current ||
          needsRedrawRef.current
        ) {
          drawFrameRef.current(targetIdx);
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [getNearestLoadedFrame]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
    />
  );
}
