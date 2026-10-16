/*eslint-env node*/
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#050505",
        ink: "#0b0b0c",
        bone: "#ece6dc",
        ash: "#8a847c",
        saber: "#ff2a2a",
        blood: "#9e0f1c",
        kyber: "#5cc8ff",
        sand: "#d8a865",
        gold: "#f2d49b",
      },
      fontFamily: {
        jedi: ["Moonhouse", "serif"],
        display: ["Anton", "Impact", "sans-serif"],
        serif: ["'Instrument Serif'", "Georgia", "serif"],
        sans: ["'Inter Tight'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        hud: "0.28em",
        wide2: "0.14em",
      },
      screens: {
        xs: "450px",
      },
      transitionTimingFunction: {
        sith: "cubic-bezier(0.7, 0, 0.2, 1)",
        out4: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
