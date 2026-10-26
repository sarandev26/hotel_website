"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  HERO_MOMENTS,
  HeroMoment,
  HERO_SCROLL_VH,
} from "@/lib/journey";
import HeroStage from "./HeroStage";
import Nav from "./Nav";
import Menu from "./Menu";
import BookingPanel from "./BookingPanel";
import ResidenceSection from "./ResidenceSection";
import SpacesSection from "./SpacesSection";
import SuitesSection from "./SuitesSection";
import MomentsSection from "./MomentsSection";
import FooterSection from "./FooterSection";
import SplashScreen from "./SplashScreen";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Journey() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [targetProgress, setTargetProgress] = useState<number>(0);
  const [stageTranslateY, setStageTranslateY] = useState<number>(0);
  const [heroUiOpacity, setHeroUiOpacity] = useState<number>(1);
  const [isStageVisible, setIsStageVisible] = useState<boolean>(true);
  const [isLightSection, setIsLightSection] = useState<boolean>(false);
  const [isScrollingHero, setIsScrollingHero] = useState<boolean>(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);

  const spacerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const lastScrollYRef = useRef<number>(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredAssistRef = useRef<boolean>(false);

  // Initialize Lenis + GSAP ScrollTrigger inside gsap.context()
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }

    // 1. Lenis Smooth Scroll Engine
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
      autoRaf: false,
    });
    lenisRef.current = lenis;

    // Pause scrolling initially while splash plays
    lenis.stop();

    lenis.on("scroll", (e: any) => {
      ScrollTrigger.update();

      const currentScroll = e.animatedScroll ?? window.scrollY;
      const prevScroll = lastScrollYRef.current;
      if (Math.abs(currentScroll - prevScroll) > 2) {
        setScrollDirection(currentScroll > prevScroll ? "down" : "up");
      }
      lastScrollYRef.current = currentScroll;

      // Handle Hero Exit Parallax & UI Fade
      if (spacerRef.current) {
        const spacerHeight = spacerRef.current.offsetHeight;
        const winHeight = window.innerHeight;
        const exitStart = spacerHeight - winHeight;

        if (currentScroll >= exitStart) {
          // Exit zone: scroll moves from exitStart to spacerHeight
          const exitFraction = Math.max(0, Math.min(1, (currentScroll - exitStart) / winHeight));
          // Fixed hero stage moves up slowly: 30% of scroll speed, up to -30vh
          setStageTranslateY(-exitFraction * 30);

          // During the first 25vh of exit, fade out ALL hero UI to opacity 0
          const exitFraction25 = Math.max(0, Math.min(1, (currentScroll - exitStart) / (winHeight * 0.25)));
          setHeroUiOpacity(Math.max(0, 1 - exitFraction25));
        } else {
          setStageTranslateY(0);
          setHeroUiOpacity(1);
        }

        const inLight = currentScroll >= spacerHeight - winHeight * 0.4;
        setIsLightSection(inLight);

        // Header scroll-hide behavior inside hero
        if (!inLight) {
          setIsScrollingHero(true);
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }
          scrollTimeoutRef.current = setTimeout(() => {
            setIsScrollingHero(false);
          }, 400);
        }
      }
    });

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // 2. Setup ScrollTrigger on hero spacer (NO PIN) inside gsap.context()
    const spacer = spacerRef.current;
    const ctx = gsap.context(() => {
      if (!spacer) return;

      ScrollTrigger.create({
        trigger: spacer,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          setTargetProgress(self.progress);
        },
      });

      // Keep fixed hero stage visible until #site reaches top of viewport
      ScrollTrigger.create({
        trigger: "#site",
        start: "top top",
        onEnter: () => {
          setIsStageVisible(false);
        },
        onLeaveBack: () => {
          setIsStageVisible(true);
        },
      });

      // Refresh ScrollTrigger after DOM setup
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Preload all section images in background while in hero
  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    lenisRef.current?.start();

    const sectionImages = [
      "/images/residence.webp",
      "/images/lobby.webp",
      "/images/dining.webp",
      "/images/spa.webp",
      "/images/studio.webp",
      "/images/pool.webp",
      "/images/suites/suite-1.webp",
      "/images/suites/suite-2.webp",
      "/images/suites/suite-3.webp",
      "/images/suites/suite-4.webp",
      "/images/suites/suite-5.webp",
      "/images/suites/suite-6.webp",
      "/images/suites/suite-7.webp",
      "/images/moment-arrival.webp",
      "/images/moment-chef.webp",
      "/images/moment-sunset.webp",
      "/images/moment-spa.webp",
      "/images/guests.webp",
    ];

    sectionImages.forEach((src) => {
      const img = new window.Image();
      img.src = src;
      img.decode?.().catch(() => {});
    });
  }, []);

  // Handle smooth scroll to space from Menu
  const handleSelectSpace = useCallback((moment: HeroMoment) => {
    if (!lenisRef.current || !spacerRef.current) return;
    const spacerHeight = spacerRef.current.offsetHeight;
    const targetScrollY = ((moment.startProgress + moment.endProgress) / 2) * spacerHeight;
    lenisRef.current.scrollTo(targetScrollY, {
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  }, []);

  return (
    <div className="relative w-full bg-[#FAF7F2] text-[#100D0B] select-none">
      {/* 0. ARCHITECTURAL HOTEL CONSTRUCTION SPLASH SCREEN */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* 1. FIXED HEADER (z-index 50) */}
      <Nav
        isScrollingHero={isScrollingHero}
        isLightSection={isLightSection}
        scrollDirection={scrollDirection}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenBooking={() => setIsBookingOpen(true)}
        onScrollTop={() => lenisRef.current?.scrollTo(0, { duration: 1.8 })}
      />

      {/* 2. HERO STAGE (position: fixed; inset: 0; z-index: 1; exit parallax up to -30vh) */}
      <HeroStage
        targetProgress={targetProgress}
        isVisible={isStageVisible}
        stageTranslateY={stageTranslateY}
        heroUiOpacity={heroUiOpacity}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {/* 3. HERO SPACER (Empty div in normal flow, height = HERO_SCROLL_VH, e.g. 1800vh) */}
      <div
        id="hero-spacer"
        ref={spacerRef}
        className="w-full pointer-events-none"
        style={{ height: `${HERO_SCROLL_VH}vh` }}
      />

      {/* 4. THE SITE WRAPPER (one <div id="site"> directly after spacer; z-index: 20; background: var(--paper)) */}
      <div
        id="site"
        className="relative z-20 w-full bg-[#FAF7F2]"
        style={{ position: "relative", zIndex: 20, background: "var(--paper)" }}
      >
        {/* Section 01: The Residence (background --paper) */}
        <ResidenceSection />

        {/* Section 02: The Spaces (background --paper-2) */}
        <SpacesSection onOpenBooking={() => setIsBookingOpen(true)} />

        {/* Section 03: The Suites (background --paper) */}
        <SuitesSection onOpenBooking={() => setIsBookingOpen(true)} />

        {/* Section 04: Moments + Testimonials Dark Band (background --paper-2 & --umber) */}
        <MomentsSection />

        {/* Reserve Band + Footer (background --obsidian, linen text) */}
        <FooterSection
          onOpenBooking={() => setIsBookingOpen(true)}
          onScrollTop={() => lenisRef.current?.scrollTo(0, { duration: 2.2 })}
        />
      </div>

      {/* 5. Space Navigation Overlay (z-index 60) */}
      <Menu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectSpace={handleSelectSpace}
      />

      {/* 6. Right-Side Luxury Booking Inquiry Panel (z-index 70) */}
      <BookingPanel
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
