"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RESIDENCE_CONTENT } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ResidenceSection() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineLineRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const factsRef = useRef<HTMLDivElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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

    // 2. Word-by-word scroll-linked reveal
    if (paragraphRef.current && !prefersReducedMotion) {
      const words = paragraphRef.current.querySelectorAll(".word");
      gsap.fromTo(
        words,
        { opacity: 0.2 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: paragraphRef.current,
            start: "top 75%",
            end: "bottom 55%",
            scrub: 0.8,
          },
        }
      );
    }

    // 3. Stagger reveal for the three facts
    if (factsRef.current) {
      const factItems = factsRef.current.querySelectorAll(".fact-col");
      gsap.fromTo(
        factItems,
        { opacity: 0, y: prefersReducedMotion ? 0 : 28 },
        {
          opacity: 1,
          y: 0,
          duration: prefersReducedMotion ? 0.01 : 1.2,
          stagger: 0.18,
          ease: "power4.out",
          scrollTrigger: {
            trigger: factsRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // 4. Portrait Image reveal: clip-path wipe from bottom (1.4s, power4.out) + scale 1.12 to 1 + parallax
    if (imgWrapperRef.current && imgInnerRef.current && !prefersReducedMotion) {
      gsap.fromTo(
        imgWrapperRef.current,
        { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
        {
          clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: {
            trigger: imgWrapperRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        imgInnerRef.current,
        { scale: 1.12, yPercent: 4 },
        {
          scale: 1,
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: imgWrapperRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }
  }, []);

  const words = RESIDENCE_CONTENT.paragraph.split(" ");

  return (
    <section
      ref={containerRef}
      id="residence"
      className="relative w-full bg-[#FAF7F2] text-[#100D0B] py-[clamp(72px,8vw,120px)] px-6 md:px-16 lg:px-24 border-t-0"
    >
      <div className="max-w-6xl mx-auto">
        {/* Hairline that draws across at start */}
        <div ref={headlineLineRef} className="w-full h-[1px] bg-[#E3D9CB] mb-10 md:mb-14" />

        {/* Two-Column Grid: Text on left (7 cols), Portrait image on right (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Headline, paragraph, and 3 facts */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Label only (no numbers) */}
            <div className="mb-6">
              <span
                className="text-[#B07A52] text-[11px] font-normal tracking-[0.24em] uppercase"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {RESIDENCE_CONTENT.label}
              </span>
            </div>

            {/* Bodoni Headline with one italic word */}
            <h2
              className="text-[2.6rem] md:text-[4.2rem] lg:text-[4.8rem] font-normal leading-[1.04] text-[#100D0B] mb-[clamp(32px,4vw,48px)]"
              style={{
                fontFamily: "var(--font-bodoni), serif",
                letterSpacing: "-0.02em",
              }}
            >
              {RESIDENCE_CONTENT.headlinePrefix}{" "}
              <span className="font-italic-serif italic text-[#D98E5F]">
                {RESIDENCE_CONTENT.italicWord}
              </span>
            </h2>

            {/* Word-by-word scroll-linked paragraph */}
            <p
              ref={paragraphRef}
              className="text-[1.35rem] md:text-[1.8rem] lg:text-[2.1rem] font-light leading-[1.35] text-[#100D0B] max-w-xl mb-[clamp(40px,5vw,64px)]"
              style={{ fontFamily: "var(--font-bodoni), serif" }}
            >
              {words.map((word, idx) => (
                <span key={idx} className="word inline-block mr-2 opacity-20">
                  {word}
                </span>
              ))}
            </p>

            {/* Row of three facts separated by vertical hairlines */}
            <div
              ref={factsRef}
              className="grid grid-cols-1 sm:grid-cols-3 border-t border-[#E3D9CB] pt-2"
            >
              {RESIDENCE_CONTENT.facts.map((fact, idx) => (
                <div
                  key={idx}
                  className={`fact-col py-6 md:py-8 ${
                    idx > 0 ? "sm:border-l sm:border-[#E3D9CB] sm:pl-8 lg:pl-10" : ""
                  } ${idx < 2 ? "border-b sm:border-b-0 border-[#E3D9CB]" : ""}`}
                >
                  <div
                    className="text-[2.4rem] md:text-[3rem] lg:text-[3.4rem] font-normal text-[#100D0B] leading-none mb-2"
                    style={{ fontFamily: "var(--font-bodoni), serif" }}
                  >
                    {fact.number}
                  </div>
                  <div
                    className="text-[#6B5F55] text-[11px] uppercase tracking-[0.22em] font-light"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {fact.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Tall 4:5 portrait image (42% width on desktop, full width on mobile) */}
          <div className="lg:col-span-5 w-full">
            <div
              ref={imgWrapperRef}
              className="relative w-full aspect-[4/5] overflow-hidden bg-[#2A1F1A] border-0"
              style={{
                clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
              }}
            >
              {imgError ? (
                /* Art-directed Umber fallback with bronze hairline frame */
                <div className="absolute inset-0 bg-[#2A1F1A] flex items-center justify-center p-6 border border-[#B07A52]/40">
                  <span
                    className="text-[#B8A898] text-[11px] uppercase tracking-[0.24em]"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    Saptarishi Residence
                  </span>
                </div>
              ) : (
                <div
                  ref={imgInnerRef}
                  className="relative w-full h-[112%] -top-[6%] transition-transform duration-700 ease-out hover:scale-[1.02]"
                >
                  <Image
                    src={RESIDENCE_CONTENT.image}
                    alt="Saptarishi Luxury Residence Entrance"
                    fill
                    loading="eager"
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                    onError={() => setImgError(true)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
