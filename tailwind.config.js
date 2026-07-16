/*eslint-env node*/
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#050505",
          elevated: "#0a0a0a",
        },
        crimson: {
          DEFAULT: "#b11226",
          deep: "#7a0c1a",
          ember: "#e11d2e",
        },
        steel: {
          DEFAULT: "#a8a29e",
          dim: "#78716c",
        },
        bone: {
          DEFAULT: "#e7e5e4",
          warm: "#f5f0e8",
        },
        sky: {
          light: "#7dd3fc",
        },
      },
      fontFamily: {
        Jedi4: ["Jedi4", "serif"],
        display: ["Cinzel", "serif"],
        body: ["Exo 2", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      letterSpacing: {
        imperial: "0.35em",
        chapter: "0.2em",
      },
      screens: {
        xs: "450px",
      },
      keyframes: {
        "pulse-ring": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        "scroll-line": {
          "0%": { transform: "scaleY(0)", transformOrigin: "top" },
          "50%": { transform: "scaleY(1)", transformOrigin: "top" },
          "51%": { transformOrigin: "bottom" },
          "100%": { transform: "scaleY(0)", transformOrigin: "bottom" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2s ease-in-out infinite",
        "scroll-line": "scroll-line 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
