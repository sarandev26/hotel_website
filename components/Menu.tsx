"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HERO_MOMENTS, HeroMoment } from "@/lib/journey";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSpace: (moment: HeroMoment) => void;
}

export default function Menu({ isOpen, onClose, onSelectSpace }: MenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[60] bg-[#2A1F1A] text-[#EFE6DA] flex flex-col justify-between p-8 md:p-16 lg:p-20 overflow-y-auto"
        >
          {/* Header Bar inside Menu */}
          <div className="flex items-center justify-between border-b border-[#3A302A] pb-6">
            <div className="flex items-center space-x-3">
              <span
                className="text-[#EFE6DA] text-[15px] uppercase font-normal"
                style={{
                  fontFamily: "var(--font-bodoni), serif",
                  letterSpacing: "0.38em",
                }}
              >
                SAPTARISHI
              </span>
              <span className="text-[#3A302A]">/</span>
              <span className="text-[#B8A898] text-[11px] uppercase tracking-[0.22em] font-light">
                Spaces & Sanctuary
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-[#EFE6DA] hover:text-[#D98E5F] text-[11px] uppercase tracking-[0.24em] font-normal transition-colors duration-300 py-1"
              aria-label="Close Menu"
            >
              [ Close ]
            </button>
          </div>

          {/* List of Spaces in Bodoni Moda */}
          <div className="py-12 my-auto max-w-4xl">
            <nav className="flex flex-col space-y-4 md:space-y-6">
              {HERO_MOMENTS.map((sec, idx) => (
                <motion.button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    onSelectSpace(sec);
                    onClose();
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.03 * idx,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group flex items-baseline space-x-6 text-left py-1 transition-all duration-300"
                >
                  <span className="w-3 h-[1px] bg-[#B07A52] group-hover:w-6 transition-all duration-300 mr-2 self-center" />

                  <span
                    className="text-[2rem] md:text-[3rem] lg:text-[3.5rem] font-normal leading-tight text-[#EFE6DA] group-hover:text-[#D98E5F] transition-colors"
                    style={{
                      fontFamily: "var(--font-bodoni), serif",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {sec.spaceName}
                  </span>

                  <span
                    className="hidden sm:inline-block text-[#B07A52] text-[11px] font-light tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    Explore space →
                  </span>
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Footer Bar inside Menu */}
          <div className="border-t border-[#3A302A] pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] tracking-[0.22em] text-[#B8A898] uppercase">
            <span>Seven stars. One sky.</span>
            <span className="mt-2 sm:mt-0 font-light">
              Reservations by appointment only
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
