"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BookingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingPanel({ isOpen, onClose }: BookingPanelProps) {
  const [checkIn, setCheckIn] = useState("2026-11-12");
  const [checkOut, setCheckOut] = useState("2026-11-18");
  const [suite, setSuite] = useState("Kratu Sky Penthouse");
  const [guests, setGuests] = useState("2 Guests");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-[#100D0B]/80 backdrop-grayscale pointer-events-auto"
          />

          {/* Right-side Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-[#2A1F1A] text-[#EFE6DA] border-l border-[#3A302A] p-8 md:p-12 flex flex-col justify-between overflow-y-auto pointer-events-auto"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-[#3A302A] pb-6">
              <div>
                <span className="text-[#D98E5F] text-[11px] uppercase tracking-[0.22em] font-normal block mb-1">
                  Private Sanctuary
                </span>
                <h3
                  className="text-[26px] font-normal leading-tight text-[#EFE6DA]"
                  style={{ fontFamily: "var(--font-bodoni), serif" }}
                >
                  Reserve Your Stay
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-[#B8A898] hover:text-[#D98E5F] text-[11px] uppercase tracking-[0.22em] transition-colors"
                aria-label="Close Reservation Panel"
              >
                [ Close ]
              </button>
            </div>

            {/* Form */}
            {submitted ? (
              <div className="py-20 text-center my-auto">
                <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center">
                  <span
                    className="text-[#D98E5F] text-[28px] font-normal"
                    style={{ fontFamily: "var(--font-bodoni), serif" }}
                  >
                    S
                  </span>
                </div>
                <h4
                  className="text-2xl font-normal text-[#EFE6DA] mb-3"
                  style={{ fontFamily: "var(--font-bodoni), serif" }}
                >
                  Sanctuary Requested
                </h4>
                <p className="text-[#B8A898] text-[13px] leading-relaxed max-w-xs mx-auto">
                  Our private butler and reservations director will attend to your itinerary within the hour.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="py-8 space-y-6 my-auto">
                {/* Suite Selection */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.24em] text-[#B8A898] mb-2">
                    Signature Suite
                  </label>
                  <select
                    value={suite}
                    onChange={(e) => setSuite(e.target.value)}
                    className="w-full bg-[#100D0B] border border-[#3A302A] text-[#EFE6DA] px-4 py-3.5 text-[13px] focus:outline-none focus:border-[#D98E5F]"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    <option value="Kratu Sky Penthouse">01 / Kratu Sky Penthouse</option>
                    <option value="Pulaha Royal Pavillion">02 / Pulaha Royal Pavillion</option>
                    <option value="Pulastya Horizon Suite">03 / Pulastya Horizon Suite</option>
                    <option value="Atri Celestial Residence">04 / Atri Celestial Residence</option>
                    <option value="Angiras Garden Villa">05 / Angiras Garden Villa</option>
                    <option value="Vasistha Presidential Suite">06 / Vasistha Presidential Suite</option>
                    <option value="Bhrigu Panoramic Master Suite">07 / Bhrigu Panoramic Master Suite</option>
                  </select>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.24em] text-[#B8A898] mb-2">
                      Arrival Date
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-[#100D0B] border border-[#3A302A] text-[#EFE6DA] px-4 py-3.5 text-[13px] focus:outline-none focus:border-[#D98E5F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.24em] text-[#B8A898] mb-2">
                      Departure Date
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-[#100D0B] border border-[#3A302A] text-[#EFE6DA] px-4 py-3.5 text-[13px] focus:outline-none focus:border-[#D98E5F]"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.24em] text-[#B8A898] mb-2">
                    Guests & Party
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-[#100D0B] border border-[#3A302A] text-[#EFE6DA] px-4 py-3.5 text-[13px] focus:outline-none focus:border-[#D98E5F]"
                  >
                    <option value="1 Guest">1 Guest (Private)</option>
                    <option value="2 Guests">2 Guests (Couple)</option>
                    <option value="4 Guests">4 Guests (Private Suite)</option>
                    <option value="Exclusive Estate Buyout">Entire Wing Buyout</option>
                  </select>
                </div>

                {/* Concierge Notes */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.24em] text-[#B8A898] mb-2">
                    Bespoke Requirements (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Helipad transfer, dietary preferences, private cellar curation..."
                    className="w-full bg-[#100D0B] border border-[#3A302A] text-[#EFE6DA] px-4 py-3 text-[13px] focus:outline-none focus:border-[#D98E5F] placeholder-[#B8A898]/40 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn-primary w-full mt-4"
                  style={{ padding: "16px 24px" }}
                >
                  Confirm Reservation Inquiry
                </button>
              </form>
            )}

            {/* Bottom details */}
            <div className="border-t border-[#3A302A] pt-4 text-[10px] text-[#B8A898] uppercase tracking-[0.2em] flex items-center justify-between font-light">
              <span>Direct Concierge: +1 (800) 777-SAPT</span>
              <span>7 Stars</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
