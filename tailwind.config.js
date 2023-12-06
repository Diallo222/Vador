/*eslint-env node*/
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#050816",
        secondary: "#aaa6c3",
        tertiary: "#151030",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
      },
      // backgroundImage: {
      //   "hero-pattern": "url('/src/assets/herobg.png')",
      // },
      // fontFamily: {
      //   'geek': "Geek",
      //   'geek2': "Geek2",
      //   'geek3': "Geek3"
      // }
    },
    fontFamily: {
      'Jedi': "Jedi",
      'Jedi2': "Jedi2",
      'Jedi3': "Jedi3",
      'Jedi4': "Jedi4",
    }
  },
  plugins: [],
};
