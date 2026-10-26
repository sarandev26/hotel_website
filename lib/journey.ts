export interface HeroMoment {
  id: string;
  number: string;
  spaceName: string;
  label: string;
  headlinePrefix: string;
  italicWord: string;
  headlineSuffix?: string;
  line: string;
  align: "left" | "right" | "center";
  startProgress: number;
  endProgress: number;
}

export const HERO_SCROLL_VH = 1800; // Default 1800vh spacer height

export const FRAME_COUNTS = [120, 120, 120];
export const TOTAL_FRAMES = 360; // 120 + 120 + 120 frames across v1, v2, v3

// Helper to get frame path from 0-based global index [0..359]
export function getFramePath(globalIndex: number): { path: string; videoIdx: number; localIdx: number } {
  const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(globalIndex)));
  if (clamped < 120) {
    const num = String(clamped + 1).padStart(4, "0");
    return { path: `/frames/v1/f_${num}.webp`, videoIdx: 0, localIdx: clamped };
  } else if (clamped < 240) {
    const local = clamped - 120;
    const num = String(local + 1).padStart(4, "0");
    return { path: `/frames/v2/f_${num}.webp`, videoIdx: 1, localIdx: local };
  } else {
    const local = clamped - 240;
    const num = String(local + 1).padStart(4, "0");
    return { path: `/frames/v3/f_${num}.webp`, videoIdx: 2, localIdx: local };
  }
}

// 11 Hero Moments - each owning equal share (1/11 each ~ 0.0909)
const MOMENT_SHARE = 1 / 11;

export const HERO_MOMENTS: HeroMoment[] = [
  {
    id: "welcome",
    number: "00 / 10",
    spaceName: "Arrival",
    label: "Welcome",
    headlinePrefix: "Where light meets",
    italicWord: "luxury",
    line: "Saptarishi. A residence of seven stars.",
    align: "left",
    startProgress: 0 * MOMENT_SHARE,
    endProgress: 1 * MOMENT_SHARE,
  },
  {
    id: "lobby",
    number: "01 / 10",
    spaceName: "The Lobby",
    label: "The lobby",
    headlinePrefix: "Beyond five",
    italicWord: "stars",
    line: "Step inside. Time slows to the pace of light.",
    align: "left",
    startProgress: 1 * MOMENT_SHARE,
    endProgress: 2 * MOMENT_SHARE,
  },
  {
    id: "staircase",
    number: "02 / 10",
    spaceName: "Grand Staircase",
    label: "The staircase",
    headlinePrefix: "Architecture designed for",
    italicWord: "serenity",
    line: "Every line leads you gently upward.",
    align: "right",
    startProgress: 2 * MOMENT_SHARE,
    endProgress: 3 * MOMENT_SHARE,
  },
  {
    id: "dining",
    number: "03 / 10",
    spaceName: "Dining",
    label: "The restaurant",
    headlinePrefix: "An evening,",
    italicWord: "composed",
    line: "Seven tables. One chef. A menu you will never repeat.",
    align: "left",
    startProgress: 3 * MOMENT_SHARE,
    endProgress: 4 * MOMENT_SHARE,
  },
  {
    id: "spa",
    number: "04 / 10",
    spaceName: "The Spa",
    label: "The spa",
    headlinePrefix: "Stillness,",
    italicWord: "restored",
    line: "Warm stone, quiet water, and hours that belong to you.",
    align: "right",
    startProgress: 4 * MOMENT_SHARE,
    endProgress: 5 * MOMENT_SHARE,
  },
  {
    id: "studio",
    number: "05 / 10",
    spaceName: "The Studio",
    label: "The studio",
    headlinePrefix: "Strength in",
    italicWord: "silence",
    line: "A private studio, soft daylight, a trainer who knows your name.",
    align: "left",
    startProgress: 5 * MOMENT_SHARE,
    endProgress: 6 * MOMENT_SHARE,
  },
  {
    id: "pool",
    number: "06 / 10",
    spaceName: "The Pool",
    label: "The pool",
    headlinePrefix: "Water that holds the",
    italicWord: "sky",
    line: "A heated infinity pool, open to the stars.",
    align: "right",
    startProgress: 6 * MOMENT_SHARE,
    endProgress: 7 * MOMENT_SHARE,
  },
  {
    id: "suites",
    number: "07 / 10",
    spaceName: "The Suites",
    label: "The suites",
    headlinePrefix: "Every stay becomes a",
    italicWord: "memory",
    line: "Seven signature suites, each with its own view of the sky.",
    align: "left",
    startProgress: 7 * MOMENT_SHARE,
    endProgress: 8 * MOMENT_SHARE,
  },
  {
    id: "balcony",
    number: "08 / 10",
    spaceName: "The Balcony",
    label: "The balcony",
    headlinePrefix: "Your private",
    italicWord: "horizon",
    line: "Step outside. The city glows below you.",
    align: "right",
    startProgress: 8 * MOMENT_SHARE,
    endProgress: 9 * MOMENT_SHARE,
  },
  {
    id: "skylounge",
    number: "09 / 10",
    spaceName: "Sky Lounge",
    label: "The sky lounge",
    headlinePrefix: "Closer to the",
    italicWord: "stars",
    line: "An evening drink at the top of the sky.",
    align: "left",
    startProgress: 9 * MOMENT_SHARE,
    endProgress: 10 * MOMENT_SHARE,
  },
  {
    id: "finale",
    number: "10 / 10",
    spaceName: "Finale",
    label: "Finale",
    headlinePrefix: "Seven stars. One",
    italicWord: "sky.",
    line: "Saptarishi · A residence of seven stars",
    align: "center",
    startProgress: 10 * MOMENT_SHARE,
    endProgress: 1.0,
  },
];

export function getActiveMomentIndex(progress: number): number {
  if (progress <= 0) return 0;
  if (progress >= 1 - MOMENT_SHARE) return HERO_MOMENTS.length - 1;
  const idx = Math.floor(progress / MOMENT_SHARE);
  return Math.min(HERO_MOMENTS.length - 1, Math.max(0, idx));
}
