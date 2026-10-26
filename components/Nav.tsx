"use client";

import React from "react";

interface NavProps {
  isScrollingHero: boolean;
  isLightSection: boolean;
  scrollDirection: "up" | "down";
  onOpenMenu: () => void;
  onOpenBooking: () => void;
  onScrollTop?: () => void;
}

export default function Nav({
  isScrollingHero,
  isLightSection,
  scrollDirection,
  onOpenMenu,
  onOpenBooking,
  onScrollTop,
}: NavProps) {
  // Over hero: hides while scrolling, returns when scrolling stops
  // Over white sections: hides when scrolling down, shows when scrolling up
  const isHidden = isLightSection
    ? scrollDirection === "down"
    : isScrollingHero;

  const textColor = isLightSection ? "text-[#100D0B]" : "text-[#EFE6DA]";
  const brandColor = isLightSection ? "text-[#100D0B]" : "text-[#EFE6DA]";
  const hoverColor = "hover:text-[#D98E5F]";
  const bgStyle = isLightSection
    ? "bg-[#FAF7F2] border-b border-[#E3D9CB]"
    : "bg-[#100D0B]/60";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 pb-6 transition-all duration-500 pointer-events-auto ${bgStyle} ${
        isHidden ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      }`}
      style={{
        paddingTop: "24px",
      }}
    >
      {/* Top Left: Hotel Name (Text only, Bodoni Moda 400, 18px, letter-spacing 0.38em) */}
      <button
        type="button"
        onClick={() => {
          if (onScrollTop) {
            onScrollTop();
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        className="group flex items-center focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D98E5F] leading-normal"
        aria-label="Saptarishi Home"
      >
        <span
          className={`${brandColor} text-[16px] md:text-[18px] font-normal uppercase transition-colors duration-300 leading-tight block ${hoverColor}`}
          style={{
            fontFamily: "var(--font-bodoni), serif",
            letterSpacing: "0.38em",
            lineHeight: "1.25",
          }}
        >
          SAPTARISHI
        </span>
      </button>

      {/* Top Right: Menu and Book stay */}
      <div className="flex items-center space-x-8 md:space-x-12">
        <button
          type="button"
          onClick={onOpenMenu}
          className={`group text-[11px] font-normal uppercase tracking-[0.22em] ${textColor} ${hoverColor} transition-colors duration-300 focus:outline-none leading-tight`}
          aria-label="Open Hotel Spaces Menu"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          <span className="relative py-1">
            Menu
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#B07A52] transition-all duration-300 group-hover:w-full" />
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenBooking}
          className={`group relative text-[11px] font-normal uppercase tracking-[0.22em] ${textColor} ${hoverColor} transition-colors duration-300 py-1 focus:outline-none leading-tight`}
          aria-label="Book Stay"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          <span>Book stay</span>
          {/* Thin sunset underline */}
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#D98E5F] transition-transform duration-300 group-hover:scale-x-110" />
        </button>
      </div>
    </header>
  );
}
