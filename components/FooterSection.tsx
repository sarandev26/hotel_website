"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RESERVE_CONTENT, FOOTER_CONTENT } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FooterSectionProps {
  onOpenBooking: () => void;
  onScrollTop?: () => void;
}

export default function FooterSection({
  onOpenBooking,
  onScrollTop,
}: FooterSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Upward mask reveal for the huge SAPTARISHI wordmark at the bottom
    if (wordmarkRef.current && !prefersReducedMotion) {
      gsap.fromTo(
        wordmarkRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: {
            trigger: wordmarkRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  return (
    <footer
      ref={containerRef}
      id="reserve"
      className="relative w-full bg-[#100D0B] text-[#EFE6DA] select-none"
    >
      {/* 1. RESERVE BAND (Dark theme, centered headline, one line, CTA) */}
      <div className="py-[clamp(72px,8vw,120px)] px-6 md:px-16 lg:px-24 border-b border-[#3A302A] text-center max-w-4xl mx-auto">
        <h2
          className="text-[2.6rem] md:text-[4.5rem] lg:text-[5.4rem] font-normal leading-[1.04] text-[#EFE6DA] mb-6"
          style={{
            fontFamily: "var(--font-bodoni), serif",
            letterSpacing: "-0.02em",
          }}
        >
          {RESERVE_CONTENT.headlinePrefix}{" "}
          <span className="font-italic-serif italic text-[#D98E5F]">
            {RESERVE_CONTENT.italicWord}
          </span>
        </h2>

        <p
          className="text-[#B8A898] text-[15px] md:text-[17px] font-light max-w-lg mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          {RESERVE_CONTENT.line}
        </p>

        <button
          type="button"
          onClick={onOpenBooking}
          className="btn-primary"
          style={{
            padding: "18px 48px",
            fontSize: "11px",
            letterSpacing: "0.26em",
          }}
        >
          {RESERVE_CONTENT.cta}
        </button>
      </div>

      {/* 2. FOOTER LINKS & CONTACT */}
      <div className="pt-20 pb-12 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-20">
          {FOOTER_CONTENT.columns.map((col) => (
            <div key={col.title} className="flex flex-col">
              <span
                className="text-[#D98E5F] text-[10px] md:text-[11px] uppercase tracking-[0.26em] font-normal mb-5"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {col.title}
              </span>
              <ul className="flex flex-col space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      onClick={onOpenBooking}
                      className="text-[#B8A898] hover:text-[#EFE6DA] text-[13px] font-light transition-colors duration-300 text-left"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Info & Legal Row */}
        <div className="border-t border-[#3A302A] pt-8 pb-12 flex flex-col md:flex-row items-start md:items-center justify-between text-[11px] text-[#B8A898] uppercase tracking-[0.22em] font-light gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-8">
            <span>{FOOTER_CONTENT.address}</span>
            <span>{FOOTER_CONTENT.phone}</span>
          </div>

          <div className="flex items-center space-x-6">
            <span>{FOOTER_CONTENT.legal}</span>
            {onScrollTop && (
              <button
                type="button"
                onClick={onScrollTop}
                className="text-[#B07A52] hover:text-[#D98E5F] transition-colors"
              >
                Back to top ↑
              </button>
            )}
          </div>
        </div>

        {/* 3. HUGE SAPTARISHI WORDMARK (Bodoni Moda spanning width, letter-spacing 0.1em, color --umber) */}
        <div className="overflow-hidden pt-4 pb-4 border-t border-[#3A302A]/40 text-center">
          <h2
            ref={wordmarkRef}
            className="text-[#2A1F1A] hover:text-[#3A302A] transition-colors duration-700 font-normal select-none leading-none w-full"
            style={{
              fontFamily: "var(--font-bodoni), serif",
              fontSize: "clamp(2.8rem, 14vw, 12rem)",
              letterSpacing: "0.1em",
            }}
          >
            {FOOTER_CONTENT.wordmark}
          </h2>
        </div>
      </div>
    </footer>
  );
}
