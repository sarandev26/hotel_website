"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SPACES_CONTENT } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SpacesSectionProps {
  onOpenBooking: () => void;
}

export default function SpacesSection({ onOpenBooking }: SpacesSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const headlineLineRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Hairline draw across
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
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // 2. Animate each alternating row: clip-path wipe from bottom + inner image scale + text stagger
    rowsRef.current.forEach((row) => {
      if (!row) return;

      const imgWrapper = row.querySelector(".space-img-wrapper");
      const imgInner = row.querySelector(".space-img-inner");
      const textGroup = row.querySelector(".space-text-group");

      if (imgWrapper && imgInner && !prefersReducedMotion) {
        // Clip-path wipe from bottom
        gsap.fromTo(
          imgWrapper,
          { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
          {
            clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
            duration: 1.4,
            ease: "power4.out",
            scrollTrigger: {
              trigger: row,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Inner image scale from 1.15 to 1.0 + subtle parallax
        gsap.fromTo(
          imgInner,
          { scale: 1.15, yPercent: 4 },
          {
            scale: 1,
            yPercent: -4,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // Text elements stagger fade & rise
      if (textGroup && !prefersReducedMotion) {
        const textElements = textGroup.querySelectorAll(".reveal-text");
        gsap.fromTo(
          textElements,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.12,
            ease: "power4.out",
            scrollTrigger: {
              trigger: row,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });
  }, []);

  return (
    <section
      ref={containerRef}
      id="spaces"
      className="relative w-full bg-[#F1EBE1] text-[#100D0B] py-[clamp(72px,8vw,120px)] px-6 md:px-16 lg:px-24"
    >
      <div className="max-w-6xl mx-auto">
        {/* Hairline that draws across at start */}
        <div ref={headlineLineRef} className="w-full h-[1px] bg-[#E3D9CB] mb-10 md:mb-14" />

        {/* Section Label (no numbers) */}
        <div className="mb-6">
          <span
            className="text-[#B07A52] text-[11px] font-normal tracking-[0.24em] uppercase"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            {SPACES_CONTENT.label}
          </span>
        </div>

        {/* Bodoni Headline with one italic word */}
        <h2
          className="text-[2.6rem] md:text-[4.5rem] lg:text-[5.4rem] font-normal leading-[1.04] text-[#100D0B] mb-[clamp(40px,5vw,72px)]"
          style={{
            fontFamily: "var(--font-bodoni), serif",
            letterSpacing: "-0.02em",
          }}
        >
          {SPACES_CONTENT.headlinePrefix}{" "}
          <span className="font-italic-serif italic text-[#D98E5F]">
            {SPACES_CONTENT.italicWord}
          </span>
        </h2>

        {/* 5 Alternating Rows */}
        <div className="flex flex-col space-y-[clamp(56px,7vw,96px)]">
          {SPACES_CONTENT.spaces.map((space, idx) => {
            const isImageLeft = idx % 2 === 0;
            const hasError = imageErrors[idx];

            return (
              <div
                key={space.title}
                ref={(el) => {
                  rowsRef.current[idx] = el;
                }}
                className={`flex flex-col ${
                  isImageLeft ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-10 md:gap-16 lg:gap-20`}
              >
                {/* Image Column */}
                <div className="w-full md:w-1/2">
                  <div
                    className="space-img-wrapper relative w-full aspect-[4/5] md:aspect-[3/2] overflow-hidden bg-[#2A1F1A]"
                    style={{
                      clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
                    }}
                  >
                    {hasError ? (
                      /* Art-directed Umber fallback with bronze hairline frame */
                      <div className="absolute inset-0 bg-[#2A1F1A] flex items-center justify-center p-6 border border-[#B07A52]/40">
                        <span
                          className="text-[#B8A898] text-[11px] uppercase tracking-[0.24em]"
                          style={{ fontFamily: "var(--font-inter), sans-serif" }}
                        >
                          {space.title} · Saptarishi
                        </span>
                      </div>
                    ) : (
                      <div className="space-img-inner relative w-full h-[112%] -top-[6%] transition-transform duration-700 hover:scale-[1.03] ease-out">
                        <Image
                          src={space.image}
                          alt={space.title}
                          fill
                          priority={idx <= 1}
                          loading="eager"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                          onError={() =>
                            setImageErrors((prev) => ({ ...prev, [idx]: true }))
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Column */}
                <div className="space-text-group w-full md:w-1/2 flex flex-col items-start">
                  <span
                    className="reveal-text text-[#6B5F55] text-[11px] font-light tracking-[0.3em] uppercase mb-3"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {space.title}
                  </span>

                  <h3
                    className="reveal-text text-[2.2rem] md:text-[3rem] lg:text-[3.6rem] font-normal text-[#100D0B] leading-[1.08] mb-5"
                    style={{
                      fontFamily: "var(--font-bodoni), serif",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {space.title}
                  </h3>

                  <p
                    className="reveal-text text-[#6B5F55] text-[15px] md:text-[17px] font-light leading-[1.7] max-w-md mb-6"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {space.line}
                  </p>

                  {/* Two small details separated by hairline */}
                  <div className="reveal-text w-full max-w-md border-t border-[#E3D9CB] pt-4 mb-6 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-[#6B5F55]">
                    <span className="font-light">{space.details[0]}</span>
                    <span className="w-[8px] h-[1px] bg-[#B07A52]" />
                    <span className="font-light">{space.details[1]}</span>
                  </div>

                  {/* Discover Link with hover underline that draws */}
                  <button
                    type="button"
                    onClick={onOpenBooking}
                    className="reveal-text group relative inline-flex items-center text-[11px] uppercase tracking-[0.24em] font-normal text-[#100D0B] pb-1"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    <span>Discover</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#B07A52] transition-all duration-300 group-hover:w-full" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
