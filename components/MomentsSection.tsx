"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOMENTS_CONTENT } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MomentsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineLineRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  // Moments images load states
  const [momentImgLoaded, setMomentImgLoaded] = useState<Record<number, boolean>>({});
  const [momentImgErrors, setMomentImgErrors] = useState<Record<number, boolean>>({});

  // Testimonials sticky layout refs
  const guestImgWrapperRef = useRef<HTMLDivElement>(null);
  const guestImgInnerRef = useRef<HTMLDivElement>(null);
  const testimonialsContainerRef = useRef<HTMLDivElement>(null);
  const testimonialItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [guestImgLoaded, setGuestImgLoaded] = useState<boolean>(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Hairline draw across at start of Moments
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

    // 2. Columns rise with stagger
    if (columnsRef.current) {
      const cols = columnsRef.current.querySelectorAll(".moment-col");
      gsap.fromTo(
        cols,
        { opacity: 0, y: prefersReducedMotion ? 0 : 36 },
        {
          opacity: 1,
          y: 0,
          duration: prefersReducedMotion ? 0.01 : 1.2,
          stagger: 0.16,
          ease: "power4.out",
          scrollTrigger: {
            trigger: columnsRef.current,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // 3. Big guest quote word-by-word reveal
    if (quoteRef.current && !prefersReducedMotion) {
      const words = quoteRef.current.querySelectorAll(".quote-word");
      gsap.fromTo(
        words,
        { opacity: 0.2 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 80%",
            end: "bottom 60%",
            scrub: 0.8,
          },
        }
      );
    }

    // 4. Testimonials Left Sticky Image Wipe & Parallax
    if (guestImgWrapperRef.current && guestImgInnerRef.current && !prefersReducedMotion) {
      // Wipe in with clip-path from bottom
      gsap.fromTo(
        guestImgWrapperRef.current,
        { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
        {
          clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
          duration: 1.4,
          ease: "power4.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: guestImgWrapperRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Slow scale (1 to 1.05) & inner parallax while testimonials on the right scroll past
      if (testimonialsContainerRef.current) {
        gsap.fromTo(
          guestImgInnerRef.current,
          { scale: 1.0, yPercent: 0 },
          {
            scale: 1.05,
            yPercent: -4,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: testimonialsContainerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    }

    // 5. Each Testimonial on the right reveals smoothly as it enters
    testimonialItemsRef.current.forEach((item) => {
      if (!item || prefersReducedMotion) return;

      const hairline = item.querySelector(".testimonial-hairline");
      const authorInfo = item.querySelector(".testimonial-author-block");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      });

      // Whole testimonial card rises smoothly without child conflict
      tl.from(item, {
        opacity: 0,
        y: 28,
        duration: 0.85,
        ease: "power3.out",
      });

      // Hairline expands from left
      if (hairline) {
        tl.from(
          hairline,
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.45"
        );
      }

      // Author detail fades up
      if (authorInfo) {
        tl.from(
          authorInfo,
          {
            opacity: 0,
            y: 8,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.35"
        );
      }
    });
  }, []);

  const quoteWords = MOMENTS_CONTENT.quote.split(" ");

  return (
    <section ref={containerRef} id="moments" className="relative w-full">
      {/* 1. EDITORIAL MOMENTS & BIG GUEST QUOTE (Paper-2 background #F1EBE1) */}
      <div className="w-full bg-[#F1EBE1] text-[#100D0B] py-[clamp(72px,8vw,120px)] px-6 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          {/* Hairline that draws across at start */}
          <div ref={headlineLineRef} className="w-full h-[1px] bg-[#E3D9CB] mb-10 md:mb-14" />

          {/* Section Label (no numbers) */}
          <div className="mb-6">
            <span
              className="text-[#B07A52] text-[11px] font-normal tracking-[0.24em] uppercase"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {MOMENTS_CONTENT.label}
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
            {MOMENTS_CONTENT.headlinePrefix}{" "}
            <span className="font-italic-serif italic text-[#D98E5F]">
              {MOMENTS_CONTENT.italicWord}
            </span>
          </h2>

          {/* Four Columns separated by vertical hairlines */}
          <div
            ref={columnsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-0 border-t border-b border-[#E3D9CB] py-8 md:py-12"
          >
            {MOMENTS_CONTENT.moments.map((item, idx) => {
              const hasError = momentImgErrors[idx];
              const isLoaded = momentImgLoaded[idx];

              return (
                <div
                  key={item.title}
                  className={`moment-col flex flex-col ${
                    idx > 0 ? "lg:border-l lg:border-[#E3D9CB] lg:pl-8 xl:pl-10" : ""
                  } ${idx < 3 ? "lg:pr-8 xl:pr-10" : ""}`}
                >
                  {/* Image with flat umber placeholder and 0.4s fade-in */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#2A1F1A] mb-5">
                    {hasError ? (
                      <div className="absolute inset-0 bg-[#2A1F1A] flex items-center justify-center p-4 border border-[#B07A52]/40">
                        <span
                          className="text-[#B8A898] text-[10px] uppercase tracking-[0.2em]"
                          style={{ fontFamily: "var(--font-inter), sans-serif" }}
                        >
                          {item.title}
                        </span>
                      </div>
                    ) : (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        loading="eager"
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover transition-all duration-[400ms] hover:scale-[1.03] ease-out"
                        onError={() =>
                          setMomentImgErrors((prev) => ({ ...prev, [idx]: true }))
                        }
                      />
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3
                    className="text-[1.4rem] md:text-[1.6rem] font-normal text-[#100D0B] leading-snug mb-2.5"
                    style={{
                      fontFamily: "var(--font-bodoni), serif",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="text-[#6B5F55] text-[13px] md:text-[14px] font-light leading-[1.65]"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Big Guest Quote: revealing word by word */}
          <div ref={quoteRef} className="pt-12 md:pt-16 text-center max-w-3xl mx-auto">
            <blockquote
              className="text-[1.9rem] md:text-[2.8rem] lg:text-[3.4rem] font-normal leading-[1.25] text-[#100D0B] mb-5"
              style={{
                fontFamily: "var(--font-bodoni), serif",
                fontStyle: "italic",
              }}
            >
              &ldquo;
              {quoteWords.map((word, idx) => (
                <span key={idx} className="quote-word inline-block mr-2 opacity-20">
                  {word}
                </span>
              ))}
              &rdquo;
            </blockquote>

            {/* Attribution */}
            <cite
              className="block text-[#6B5F55] text-[11px] md:text-[12px] uppercase tracking-[0.28em] font-light not-italic"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {MOMENTS_CONTENT.author}
            </cite>
          </div>
        </div>
      </div>

      {/* 2. FULL-WIDTH DARK BAND: GUEST STORIES TESTIMONIALS (--umber background #2A1F1A) */}
      <div
        ref={testimonialsContainerRef}
        className="w-full bg-[#2A1F1A] text-[#EFE6DA] py-[clamp(72px,8vw,120px)] px-6 md:px-16 lg:px-24 border-t border-[#3A302A]"
      >
        <div className="max-w-6xl mx-auto">
          {/* Label & Headline */}
          <div className="mb-12 md:mb-16">
            <div className="mb-4">
              <span
                className="text-[#B07A52] text-[11px] font-normal tracking-[0.24em] uppercase"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                Guest stories
              </span>
            </div>

            <h2
              className="text-[2.4rem] md:text-[3.6rem] lg:text-[4.2rem] font-normal leading-[1.06] text-[#EFE6DA]"
              style={{
                fontFamily: "var(--font-bodoni), serif",
                letterSpacing: "-0.02em",
              }}
            >
              In their{" "}
              <span className="font-italic-serif italic text-[#D98E5F]">
                words
              </span>
            </h2>
          </div>

          {/* Two-Column Editorial Layout: Left Sticky Image (42%) | Right Testimonials (50%) */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16">
            {/* LEFT COLUMN: Large portrait image (42% width, sticky top 12vh, max-h 78vh) */}
            <div className="w-full lg:w-[42%] lg:sticky lg:top-[12vh] self-start z-10">
              <div
                ref={guestImgWrapperRef}
                className="relative w-full aspect-[4/3] lg:aspect-[4/5] max-h-[78vh] overflow-hidden bg-[#2A1F1A]"
                style={{
                  clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
                }}
              >
                <div
                  ref={guestImgInnerRef}
                  className="relative w-full h-[110%] -top-[5%] transition-transform duration-700 ease-out"
                >
                  <Image
                    src="/images/guests.webp"
                    alt="Saptarishi Evening Sanctuary Guests"
                    fill
                    loading="eager"
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Three testimonials stacked vertically with 56px spacing */}
            <div className="w-full lg:w-[50%] flex flex-col space-y-[56px]">
              {/* SAMPLE GUEST STORIES: these are editable samples to replace */}
              {MOMENTS_CONTENT.testimonials.map((item, idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    testimonialItemsRef.current[idx] = el;
                  }}
                  className="testimonial-item flex flex-col pt-2"
                >
                  {/* Large Bodoni Moda quote mark (~56px, --bronze #B07A52) */}
                  <span
                    className="testimonial-quote-mark text-[56px] leading-none text-[#B07A52] font-serif select-none -mb-3 block"
                    style={{ fontFamily: "var(--font-bodoni), serif" }}
                  >
                    &ldquo;
                  </span>

                  {/* Quote in Bodoni Moda italic (~24px, --linen #EFE6DA, max 30 words) */}
                  <p
                    className="testimonial-quote-text text-[21px] md:text-[24px] leading-[1.38] font-normal text-[#EFE6DA] mb-6 font-italic-serif italic"
                    style={{ fontFamily: "var(--font-bodoni), serif" }}
                  >
                    &ldquo;{item.quote}&rdquo;
                  </p>

                  {/* Hairline (0.5px --line #3A302A) */}
                  <div className="testimonial-hairline w-full h-[0.5px] bg-[#3A302A] mb-4 origin-left" />

                  {/* Guest Name & Details */}
                  <div className="testimonial-author-block">
                    <div
                      className="testimonial-author text-[12px] font-normal uppercase tracking-[0.2em] text-[#EFE6DA]"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {item.author}
                    </div>
                    <div
                      className="testimonial-detail text-[12px] font-light tracking-[0.05em] text-[#B8A898] mt-1"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {item.details}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
