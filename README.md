# SAPTARISHI · A Residence of Seven Stars
### Ultra-Luxury 7-Star Interactive Hotel Website

An award-winning, cinematic interactive digital experience for **Saptarishi**, an ultra-luxury 7-star hotel. Visitors physically walk through the architectural sanctuary of the hotel via synchronized, frame-accurate scroll progression.

---

## 🌟 Architecture & Tech Stack

- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **Scroll Engine**: Lenis (lerp `0.08`, wheelMultiplier `0.85`) synced with GSAP ScrollTrigger
- **Visual Scrubbing**: Zero-stutter intra-frame (`-g 1`) H.264 video scrubbing across three synchronized journeys
- **3D Atmosphere**: Three.js floating amber dust particles (`#D98E5F`) and soft architectural light beams
- **UI & Overlays**: Framer Motion for full-screen Umber space navigation and booking concierge panel
- **Typography**: Google Fonts *Bodoni Moda* (display headlines) and *Inter* (architectural body & labels)

---

## 🚀 Getting Started

### 1. Development Server
Run the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Building for Production
```bash
npm run build
npm start
```

---

## 🎬 How to Replace or Update Journey Videos

The journey is divided into three continuous segments:
- `journey-1.mp4`: Arrival, Grand Entrance, Lobby, Grand Staircase, Dining
- `journey-2.mp4`: Thermal Spa, Private Studio, Infinity Pool, Signature Suites
- `journey-3.mp4`: Private Balcony, Sky Lounge, Estate Sunset Reveal

### To re-encode new footage:
1. Place raw footage or frame sequences in `public/videos/`.
2. Run the keyframe encoder script:
```bash
bash scripts/encode-videos.sh
```
Or with Python:
```bash
python scripts/process_videos.py
```
This ensures every frame is an intra-keyframe (`-g 1`), preventing decoder lag or stutter when scrubbing in reverse.

---

## ⏱ How to Retime Sections and Spaces

All space timings, copy, headlines, and card details are configured in a single master configuration file:
👉 **[`lib/journey.ts`](file:///d:/Luxury%20Hotel%20Website/lib/journey.ts)**

To adjust the scroll position where any section appears:
1. Open `lib/journey.ts`.
2. Modify `startProgress`, `peakProgress`, or `endProgress` for any of the 11 spaces (normalized from `0.0` to `1.0`).
3. Modify card details or headlines directly in the `JOURNEY_SECTIONS` array.
4. Changes update immediately with hot reloading.

---

## 🎨 Design System Tokens

- `--obsidian`: `#100D0B` (Architectural background)
- `--umber`: `#2A1F1A` (Cards, panels, menu)
- `--linen`: `#EFE6DA` (Headlines, primary typography)
- `--linen-muted`: `#B8A898` (Body copy, captions)
- `--bronze`: `#B07A52` (Hairlines, icons, hover states)
- `--sunset`: `#D98E5F` (Logo, CTA, progress lines, final reveal)
- `--line`: `#3A302A` (Architectural dividers)

---

*Seven stars. One sky.*
