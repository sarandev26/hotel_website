"use client";

import React, { useEffect, useRef, useState } from "react";
import HeroCanvas from "./HeroCanvas";
import {
  HERO_MOMENTS,
  HeroMoment,
  TOTAL_FRAMES,
  getActiveMomentIndex,
} from "@/lib/journey";

interface HeroStageProps {
  targetProgress: number; // 0 to 1 from the hero spacer
  isVisible: boolean; // Managed by scroll boundary
  stageTranslateY?: number; // 0 to -30vh on exit
  heroUiOpacity?: number; // 1 down to 0 during first 25vh of exit
  onOpenBooking: () => void;
}

export default function HeroStage({
  targetProgress,
  isVisible,
  stageTranslateY = 0,
  heroUiOpacity = 1,
  onOpenBooking,
}: HeroStageProps) {
  const [smoothProgress, setSmoothProgress] = useState<number>(0);
  const smoothRef = useRef<number>(0);

  // Single requestAnimationFrame loop: smooth += (targetProgress - smooth) * 0.12
  useEffect(() => {
    let animId: number;

    const tick = () => {
      if (isVisible) {
        const current = smoothRef.current;
        const target = targetProgress;
        const diff = target - current;
        if (Math.abs(diff) > 0.00005) {
          const next = current + diff * 0.14;
          smoothRef.current = next;
          setSmoothProgress(next);
        } else if (current !== target) {
          smoothRef.current = target;
          setSmoothProgress(target);
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [targetProgress, isVisible]);

  // Derive frame index across 360 frames (v1, v2, v3 in order)
  const currentFrame = Math.max(
    0,
    Math.min(TOTAL_FRAMES - 1, Math.round(smoothProgress * (TOTAL_FRAMES - 1)))
  );

  // Derive active moment index from smooth progress
  const activeIndex = getActiveMomentIndex(smoothProgress);
  const activeMoment = HERO_MOMENTS[activeIndex] || HERO_MOMENTS[0];

  return (
    <div
      id="hero-stage"
      className="fixed inset-0 w-screen h-screen pointer-events-none select-none overflow-hidden transition-transform duration-75 ease-out"
      style={{
        zIndex: 1,
        visibility: isVisible ? "visible" : "hidden",
        transform: `translate3d(0, ${stageTranslateY}vh, 0)`,
      }}
    >
      {/* 1. Full-screen cover-fit frame canvas (z-0, lowest layer) */}
      <HeroCanvas currentFrameIndex={currentFrame} isVisible={isVisible} />

      {/* 2. Flat dark overlay (exactly 18% opacity, uniform, no gradient, z-10) */}
      <div className="absolute inset-0 bg-[#100D0B]/[0.18] pointer-events-none z-10" />

      {/* 3. In-place Hero Moments text layers (z-20, fades out to opacity 0 on exit) */}
      <div
        className="absolute inset-0 z-20 pointer-events-none flex items-center px-6 md:px-16 lg:px-24 transition-opacity duration-150"
        style={{
          opacity: heroUiOpacity,
          pointerEvents: heroUiOpacity <= 0.01 ? "none" : undefined,
        }}
      >
        {HERO_MOMENTS.map((moment, idx) => {
          const isFinale = moment.id === "finale";
          const isWelcome = moment.id === "welcome";

          // Equal share calculation (1/11 per moment)
          const start = moment.startProgress;
          const end = moment.endProgress;
          const share = end - start;

          // Local position inside moment share [0..1]
          let opacity = 0;
          let translateY = 14;

          if (smoothProgress >= start && smoothProgress <= end) {
            const local = (smoothProgress - start) / share;

            if (isWelcome) {
              if (local < 0.7) {
                opacity = 1;
                translateY = 0;
              } else {
                const t = (local - 0.7) / 0.3;
                opacity = Math.max(0, 1 - t);
                translateY = -12 * t;
              }
            } else if (isFinale) {
              if (local < 0.6) {
                const t = local / 0.6;
                opacity = t;
                translateY = 14 * (1 - t);
              } else {
                opacity = 1;
                translateY = 0;
              }
            } else {
              if (local < 0.15) {
                const t = local / 0.15;
                opacity = t;
                translateY = 14 * (1 - t);
              } else if (local > 0.85) {
                const t = (local - 0.85) / 0.15;
                opacity = Math.max(0, 1 - t);
                translateY = -12 * t;
              } else {
                opacity = 1;
                translateY = 0;
              }
            }
          } else if (isFinale && smoothProgress >= end) {
            // Finale stays visible until exit fade out
            opacity = 1;
            translateY = 0;
          }

          if (opacity <= 0.001) return null;

          const isRight = moment.align === "right";
          const isCenter = moment.align === "center";

          return (
            <div
              key={moment.id}
              className={`absolute inset-0 flex items-center px-6 md:px-16 lg:px-24 pointer-events-none transition-opacity duration-200 ${
                isCenter
                  ? "justify-center"
                  : isRight
                  ? "justify-end text-right"
                  : "justify-start text-left"
              }`}
              style={{ opacity }}
            >
              {isFinale ? (
                /* FINALE: Centered Headline + CTA Button */
                <div
                  className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto pointer-events-auto py-10"
                  style={{ transform: `translate3d(0, ${translateY}px, 0)` }}
                >
                  <span
                    className="text-[#D98E5F] text-[12px] md:text-[13px] uppercase tracking-[0.38em] font-normal mb-5"
                    style={{ fontFamily: "var(--font-bodoni), serif" }}
                  >
                    SAPTARISHI
                  </span>

                  <h2 className="hero-heading mb-8">
                    Seven stars. One{" "}
                    <span className="font-italic-serif italic text-[#D98E5F]">
                      sky.
                    </span>
                  </h2>

                  <button
                    type="button"
                    onClick={onOpenBooking}
                    className="btn-primary mb-6"
                    style={{
                      padding: "18px 48px",
                      fontSize: "11px",
                      letterSpacing: "0.26em",
                      pointerEvents: heroUiOpacity <= 0.01 ? "none" : "auto",
                    }}
                  >
                    Reserve Your Experience
                  </button>

                  <p
                    className="text-[#B8A898] text-[10px] md:text-[11px] uppercase tracking-[0.28em] font-light"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    A residence of seven stars
                  </p>
                </div>
              ) : (
                /* MOMENTS 00 to 09: Fixed in-place, clean and sharp */
                <div
                  className={`max-w-xl flex flex-col pointer-events-auto ${
                    isRight ? "items-end" : "items-start"
                  } bg-transparent`}
                  style={{
                    transform: `translate3d(0, ${translateY}px, 0)`,
                  }}
                >
                  <div className="mb-4">
                    <span className="label-caps">{moment.label}</span>
                  </div>

                  <div className="mb-4">
                    <h2 className="section-heading">
                      {moment.headlinePrefix}{" "}
                      <span className="font-italic-serif italic text-[#D98E5F]">
                        {moment.italicWord}
                      </span>
                    </h2>
                  </div>

                  <p className="body-luxury max-w-md">{moment.line}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Controls: (z-30, fades out to opacity 0 on exit) */}
      <footer
        className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none px-6 md:px-12 py-7 select-none flex items-end justify-between transition-opacity duration-150"
        style={{
          opacity: heroUiOpacity,
          pointerEvents: heroUiOpacity <= 0.01 ? "none" : undefined,
        }}
      >
        {/* Bottom Left: Plain text space name only */}
        <div className="flex items-center">
          <span
            className="text-[#EFE6DA] text-[11px] font-normal tracking-[0.22em] uppercase"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            {activeMoment.spaceName}
          </span>
        </div>

        {/* Bottom Center: Plain, static "Scroll" text label that fades out on first scroll */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 bottom-7 transition-opacity duration-500 pointer-events-none ${
            smoothProgress < 0.03 ? "opacity-100" : "opacity-0"
          }`}
        >
          <span
            className="text-[#B8A898] text-[10px] uppercase tracking-[0.32em] font-light"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Scroll
          </span>
        </div>

        {/* Bottom Right: Thin horizontal progress hairline (--sunset) only */}
        <div className="flex items-center">
          <div className="w-[100px] md:w-[140px] h-[1px] bg-[#3A302A] relative overflow-hidden">
            <div
              className="h-full bg-[#D98E5F] transition-all duration-100 ease-out"
              style={{
                width: `${Math.min(100, Math.max(0, smoothProgress * 100))}%`,
              }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
