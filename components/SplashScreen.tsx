"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        gsap.to(el, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            setIsDone(true);
            onComplete();
          },
        });
      }, 800);
      return () => clearTimeout(timer);
    }

    const svg = svgRef.current;
    if (!svg) return;

    // Elements inside SVG
    const groundLine = svg.querySelector(".arch-ground");
    const columns = svg.querySelectorAll(".arch-col");
    const canopy = svg.querySelector(".arch-canopy");
    const mainBody = svg.querySelector(".arch-body");
    const towerTiers = svg.querySelectorAll(".arch-tower");
    const windows = svg.querySelectorAll(".arch-window");
    const entrance = svg.querySelector(".arch-entrance");
    const wordmark = svg.querySelector(".arch-wordmark");

    const tl = gsap.timeline({
      onComplete: () => {
        // Slide splash upward to reveal hero
        gsap.to(el, {
          yPercent: -100,
          duration: 1.0,
          ease: "power4.inOut",
          overwrite: "auto",
          onComplete: () => {
            setIsDone(true);
            onComplete();
          },
        });
      },
    });

    // 1. Ground line draws left to right (0 to 0.4s)
    if (groundLine) {
      tl.fromTo(
        groundLine,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.45, ease: "power2.out" }
      );
    }

    // 2. Columns rise one after another from ground (0.45s to 1.1s)
    if (columns.length > 0) {
      tl.fromTo(
        columns,
        { scaleY: 0, transformOrigin: "center bottom" },
        {
          scaleY: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
        },
        "-=0.1"
      );
    }

    // 3. Canopy slides in horizontally and main body outline appears (0.9s to 1.4s)
    if (mainBody) {
      tl.fromTo(
        mainBody,
        { opacity: 0, scaleY: 0, transformOrigin: "center bottom" },
        { opacity: 1, scaleY: 1, duration: 0.5, ease: "power3.out" },
        "-=0.4"
      );
    }

    if (canopy) {
      tl.fromTo(
        canopy,
        { scaleX: 0, transformOrigin: "center center" },
        { scaleX: 1, duration: 0.55, ease: "power4.out" },
        "-=0.3"
      );
    }

    // 4. Stepped top tower rises (1.3s to 1.8s)
    if (towerTiers.length > 0) {
      tl.fromTo(
        towerTiers,
        { scaleY: 0, transformOrigin: "center bottom" },
        {
          scaleY: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
        },
        "-=0.2"
      );
    }

    // 5. Windows and entrance fill with --sunset at low opacity one by one (1.7s to 2.2s)
    if (windows.length > 0) {
      tl.fromTo(
        windows,
        { opacity: 0 },
        {
          opacity: 0.28,
          duration: 0.4,
          stagger: 0.07,
          ease: "power2.out",
        },
        "-=0.3"
      );
    }

    if (entrance) {
      tl.fromTo(
        entrance,
        { opacity: 0 },
        { opacity: 0.4, duration: 0.5, ease: "power2.out" },
        "-=0.2"
      );
    }

    // 6. "SAPTARISHI" text fades in under the building (2.1s to 2.6s)
    if (wordmark) {
      tl.fromTo(
        wordmark,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.2"
      );
    }

    // Small hold before slide-up
    tl.to({}, { duration: 0.3 });

    // Failsafe timeout at 4.5 seconds max
    const failsafe = setTimeout(() => {
      if (!isDone) {
        gsap.to(el, {
          yPercent: -100,
          duration: 0.8,
          ease: "power4.inOut",
          overwrite: "auto",
          onComplete: () => {
            setIsDone(true);
            onComplete();
          },
        });
      }
    }, 4500);

    return () => {
      clearTimeout(failsafe);
      tl.kill();
    };
  }, [onComplete, isDone]);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      id="splash-screen"
      className="fixed inset-0 z-[100] w-screen h-screen bg-[#100D0B] flex flex-col items-center justify-center pointer-events-auto select-none overflow-hidden"
    >
      <div className="w-[70vw] max-w-[420px] aspect-[420/280] relative flex items-center justify-center">
        <svg
          ref={svgRef}
          viewBox="0 0 420 280"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 1. Ground Line */}
          <line
            x1="16"
            y1="230"
            x2="404"
            y2="230"
            stroke="#B07A52"
            strokeWidth="1"
            className="arch-ground"
          />

          {/* Stepped Top Tower Tiers */}
          {/* Tower Tier 2 (Highest Pinnacle) */}
          <rect
            x="175"
            y="40"
            width="70"
            height="38"
            stroke="#B07A52"
            strokeWidth="1"
            className="arch-tower"
          />

          {/* Top Tower Window (lit in --sunset) */}
          <rect
            x="195"
            y="48"
            width="30"
            height="20"
            fill="#D98E5F"
            stroke="#B07A52"
            strokeWidth="1"
            opacity="0"
            className="arch-window"
          />

          {/* Tower Tier 1 (Middle) */}
          <rect
            x="140"
            y="78"
            width="140"
            height="42"
            stroke="#B07A52"
            strokeWidth="1"
            className="arch-tower"
          />

          {/* Windows on Tier 1 */}
          <rect
            x="154"
            y="88"
            width="18"
            height="22"
            fill="#D98E5F"
            stroke="#B07A52"
            strokeWidth="0.8"
            opacity="0"
            className="arch-window"
          />
          <rect
            x="180"
            y="88"
            width="18"
            height="22"
            fill="#D98E5F"
            stroke="#B07A52"
            strokeWidth="0.8"
            opacity="0"
            className="arch-window"
          />
          <rect
            x="222"
            y="88"
            width="18"
            height="22"
            fill="#D98E5F"
            stroke="#B07A52"
            strokeWidth="0.8"
            opacity="0"
            className="arch-window"
          />
          <rect
            x="248"
            y="88"
            width="18"
            height="22"
            fill="#D98E5F"
            stroke="#B07A52"
            strokeWidth="0.8"
            opacity="0"
            className="arch-window"
          />

          {/* 3. Wide Flat Canopy */}
          <rect
            x="48"
            y="120"
            width="324"
            height="6"
            stroke="#B07A52"
            strokeWidth="1"
            fill="#100D0B"
            className="arch-canopy"
          />

          {/* Main Hotel Body Frame */}
          <rect
            x="64"
            y="126"
            width="292"
            height="104"
            stroke="#B07A52"
            strokeWidth="1"
            className="arch-body"
          />

          {/* Intermediate Balcony Hairline */}
          <line
            x1="64"
            y1="172"
            x2="356"
            y2="172"
            stroke="#B07A52"
            strokeWidth="0.8"
            className="arch-body"
          />

          {/* 2. Tall Columns (scaleY from ground up) */}
          <rect
            x="84"
            y="126"
            width="4"
            height="104"
            fill="#B07A52"
            className="arch-col"
          />
          <rect
            x="132"
            y="126"
            width="4"
            height="104"
            fill="#B07A52"
            className="arch-col"
          />
          <rect
            x="180"
            y="126"
            width="4"
            height="104"
            fill="#B07A52"
            className="arch-col"
          />

          {/* Central Entrance (lit in --sunset) */}
          <rect
            x="192"
            y="172"
            width="36"
            height="58"
            fill="#D98E5F"
            stroke="#B07A52"
            strokeWidth="1"
            opacity="0"
            className="arch-entrance"
          />
          {/* Inner Entrance Door Line */}
          <line
            x1="210"
            y1="172"
            x2="210"
            y2="230"
            stroke="#B07A52"
            strokeWidth="0.8"
            className="arch-entrance"
          />

          <rect
            x="236"
            y="126"
            width="4"
            height="104"
            fill="#B07A52"
            className="arch-col"
          />
          <rect
            x="284"
            y="126"
            width="4"
            height="104"
            fill="#B07A52"
            className="arch-col"
          />
          <rect
            x="332"
            y="126"
            width="4"
            height="104"
            fill="#B07A52"
            className="arch-col"
          />

          {/* 6. "SAPTARISHI" text */}
          <text
            x="210"
            y="262"
            textAnchor="middle"
            fill="#EFE6DA"
            fontSize="13"
            letterSpacing="0.38em"
            fontFamily="var(--font-bodoni), serif"
            className="arch-wordmark uppercase"
            opacity="0"
          >
            SAPTARISHI
          </text>
        </svg>
      </div>
    </div>
  );
}
