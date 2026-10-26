"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SUITES_CONTENT, SuiteItem } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SuitesSectionProps {
  onOpenBooking: () => void;
}

export default function SuitesSection({ onOpenBooking }: SuitesSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const headlineLineRef = useRef<HTMLDivElement>(null);
  const sectionContentRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);

  const [activeSuiteIndex, setActiveSuiteIndex] = useState<number>(0);
  const prevIndexRef = useRef<number>(0);
  const isFirstRenderRef = useRef<boolean>(true);

  // Preload all 7 suite images so transitions never flash
  useEffect(() => {
    SUITES_CONTENT.suites.forEach((suite) => {
      const img = new window.Image();
      img.src = suite.image;
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Hairline draw across at start
    if (headlineLineRef.current) {
      gsap.fromTo(
        headlineLineRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: prefersReducedMotion ? 0.01 : 1.4,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // 2. Section overall entrance reveal
    if (sectionContentRef.current && !prefersReducedMotion) {
      gsap.from(sectionContentRef.current, {
        opacity: 0,
        y: 28,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }

    // 3. Derive active suite index from scroll progress through wrapper (progress * 7)
    // Discrete step transition with gentle scrub smoothing
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
      onUpdate: (self) => {
        const raw = self.progress * 6.99;
        const step = Math.min(6, Math.max(0, Math.floor(raw)));
        setActiveSuiteIndex((prev) => {
          if (prev !== step) {
            prevIndexRef.current = prev;
            return step;
          }
          return prev;
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Direction-aware Discrete Step Wipe Animation on suite change
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const frame = imageFrameRef.current;
    if (!frame) return;

    const layers = frame.querySelectorAll<HTMLDivElement>(".suite-img-layer");
    const activeLayer = layers[activeSuiteIndex];
    const prevLayer = layers[prevIndexRef.current];
    const isForward = activeSuiteIndex >= prevIndexRef.current;

    if (activeLayer) {
      const activeInner = activeLayer.querySelector<HTMLDivElement>(".suite-img-inner");

      // Set z-index stack
      gsap.set(activeLayer, { zIndex: 10 });
      if (prevLayer && prevLayer !== activeLayer) {
        gsap.set(prevLayer, { zIndex: 1 });
      }

      // Direction-aware wipe: wipe from bottom if moving forward, wipe from top if moving backward
      const initialClip = isForward
        ? "inset(100% 0% 0% 0%)"
        : "inset(0% 0% 100% 0%)";

      gsap.fromTo(
        activeLayer,
        { clipPath: initialClip },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.95,
          ease: "power4.inOut",
          overwrite: "auto",
          onComplete: () => {
            // Clean up other layers
            layers.forEach((l, idx) => {
              if (idx !== activeSuiteIndex) {
                gsap.set(l, { zIndex: 0, clipPath: "inset(100% 0% 0% 0%)" });
              }
            });
          },
        }
      );

      // Inner picture subtle counter-scale
      if (activeInner) {
        gsap.fromTo(
          activeInner,
          { scale: 1.08, filter: "brightness(1)" },
          {
            scale: 1.0,
            filter: "brightness(1)",
            duration: 0.95,
            ease: "power3.out",
            overwrite: "auto",
          }
        );
      }
    }

    // Details text mask-reveal line by line
    if (detailsRef.current) {
      const lines = detailsRef.current.querySelectorAll(".reveal-line");
      gsap.fromTo(
        lines,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.05,
          ease: "power3.out",
          overwrite: "auto",
        }
      );
    }
  }, [activeSuiteIndex]);

  const scrollToSuite = (index: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const containerTop = scrollY + rect.top;
    const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
    const targetY = containerTop + (index / 7) * scrollableDistance + 10;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const currentSuite: SuiteItem =
    SUITES_CONTENT.suites[activeSuiteIndex] || SUITES_CONTENT.suites[0];

  return (
    <section
      ref={containerRef}
      id="suites"
      className="relative w-full bg-[#FAF7F2] text-[#100D0B]"
      style={{ height: "calc(7 * 70vh + 100vh)" }}
    >
      {/* Sticky Inner Panel (position: sticky; top: 0; height: 100vh; align-self: start) */}
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden px-6 md:px-12 lg:px-16">
        <div className="w-full max-w-7xl mx-auto flex flex-col justify-center h-full max-h-[94vh]">
          {/* Hairline that draws across at start */}
          <div ref={headlineLineRef} className="w-full h-[1px] bg-[#E3D9CB] mb-6 md:mb-8" />

          {/* 3-Part Desktop Layout: Suite List (Left) | 4:5 Framed Image (Center) | Details (Right) */}
          <div
            ref={sectionContentRef}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          >
            {/* Left Column (4 cols): Label, Headline, 7 Suite Names (no numbers!) with sliding hairline */}
            <div className="lg:col-span-4 flex flex-col justify-center order-2 lg:order-1">
              {/* Section Label (no numbers) */}
              <div className="mb-4">
                <span
                  className="text-[#B07A52] text-[11px] font-normal tracking-[0.24em] uppercase"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {SUITES_CONTENT.label}
                </span>
              </div>

              {/* Bodoni Headline */}
              <h2
                className="text-[2.2rem] md:text-[2.8rem] lg:text-[3.2rem] font-normal leading-[1.04] text-[#100D0B] mb-6"
                style={{
                  fontFamily: "var(--font-bodoni), serif",
                  letterSpacing: "-0.02em",
                }}
              >
                {SUITES_CONTENT.headlinePrefix}{" "}
                <span className="font-italic-serif italic text-[#D98E5F]">
                  {SUITES_CONTENT.italicWord}
                </span>
              </h2>

              {/* Suite List with Vertical Hairline and Sliding --sunset segment */}
              <div className="relative pl-5 py-1">
                {/* Vertical Hairline */}
                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-[#E3D9CB]" />

                {/* Sliding --sunset indicator segment */}
                <div
                  className="absolute left-[-0.5px] w-[2px] bg-[#D98E5F] transition-all duration-500 ease-out"
                  style={{
                    height: "36px",
                    top: `${activeSuiteIndex * 40}px`,
                  }}
                />

                <div className="flex flex-col space-y-1">
                  {SUITES_CONTENT.suites.map((suite, idx) => {
                    const isActive = activeSuiteIndex === idx;

                    return (
                      <button
                        key={suite.name}
                        type="button"
                        onClick={() => scrollToSuite(idx)}
                        className={`h-[36px] flex items-center text-left transition-all duration-300 focus:outline-none ${
                          isActive
                            ? "opacity-100 text-[#D98E5F]"
                            : "opacity-35 hover:opacity-75 text-[#100D0B]"
                        }`}
                      >
                        <span
                          className="text-[1.15rem] md:text-[1.3rem] lg:text-[1.4rem] font-normal tracking-[-0.01em]"
                          style={{ fontFamily: "var(--font-bodoni), serif" }}
                        >
                          {suite.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Center Column (5 cols): Framed 4:5 Portrait Image (width ~36vw, max-h 70vh) */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex items-center justify-center">
              <div
                ref={imageFrameRef}
                className="relative w-full max-w-[36vw] aspect-[4/5] max-h-[70vh] overflow-hidden bg-[#2A1F1A] border-0"
              >
                {SUITES_CONTENT.suites.map((suite, idx) => {
                  const isActive = activeSuiteIndex === idx;

                  return (
                    <div
                      key={suite.name}
                      className="suite-img-layer absolute inset-0 overflow-hidden"
                      style={{
                        zIndex: isActive ? 10 : 0,
                        clipPath: isActive
                          ? "inset(0% 0% 0% 0%)"
                          : "inset(100% 0% 0% 0%)",
                      }}
                    >
                      <div className="suite-img-inner relative w-full h-full">
                        <Image
                          src={suite.image}
                          alt={suite.name}
                          fill
                          loading="eager"
                          priority={idx === 0}
                          sizes="(max-width: 1024px) 100vw, 36vw"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column (3 cols): Small Details Block with mask reveal */}
            <div
              ref={detailsRef}
              className="lg:col-span-3 flex flex-col justify-center order-3 space-y-4"
            >
              <div className="reveal-line">
                <span
                  className="text-[#6B5F55] text-[10px] md:text-[11px] uppercase tracking-[0.26em] font-light block mb-2"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Signature Suite
                </span>
                <h3
                  className="text-[1.8rem] md:text-[2.2rem] lg:text-[2.5rem] font-normal text-[#100D0B] leading-none mb-3"
                  style={{ fontFamily: "var(--font-bodoni), serif" }}
                >
                  {currentSuite.name}
                </h3>
              </div>

              {/* Size & View line */}
              <div
                className="reveal-line flex items-center space-x-3 text-[11px] uppercase tracking-[0.2em] text-[#B07A52]"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                <span>{currentSuite.size}</span>
                <span className="w-[6px] h-[1px] bg-[#B07A52]" />
                <span>{currentSuite.feature}</span>
              </div>

              {/* Short descriptive line (max 12 words) */}
              <p
                className="reveal-line text-[#6B5F55] text-[13px] md:text-[14px] font-light leading-[1.6] max-w-xs"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {currentSuite.description}
              </p>

              {/* Small text link "Enquire" with hover underline */}
              <div className="reveal-line pt-2">
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="group relative inline-flex items-center text-[11px] uppercase tracking-[0.24em] font-normal text-[#100D0B] pb-1 focus:outline-none"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  <span>Enquire</span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#D98E5F] transition-transform duration-300 origin-left group-hover:scale-x-110" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
