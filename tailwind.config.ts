import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark tokens
        obsidian: "#100D0B",
        umber: "#2A1F1A",
        linen: "#EFE6DA",
        "linen-muted": "#B8A898",
        bronze: "#B07A52",
        sunset: "#D98E5F",
        line: "#3A302A",

        // Light tokens for website sections
        paper: "#FAF7F2",
        "paper-2": "#F1EBE1",
        ink: "#100D0B",
        "ink-muted": "#6B5F55",
        hairline: "#E3D9CB",
      },
      fontFamily: {
        serif: ["var(--font-bodoni)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
