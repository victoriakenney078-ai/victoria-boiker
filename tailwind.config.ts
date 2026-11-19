import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    borderRadius: {
      none: "0px",
      sm: "0px",
      DEFAULT: "0px",
      md: "0px",
      lg: "0px",
      xl: "0px",
      "2xl": "0px",
      "3xl": "0px",
      full: "0px",
    },
    extend: {
      colors: {
        navy: "#0B1320",
        "navy-elevated": "#111D30",
        parchment: "#EAE0D0",
        "parchment-deep": "#D5C7B2",
        ink: "rgba(234, 224, 208, 0.78)",
        mahogany: "#2C1E16",
        "mahogany-mid": "#3B281E",
        brass: "#9A8464",
        hairline: "rgba(234, 224, 208, 0.14)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      transitionTimingFunction: {
        salon: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      maxWidth: {
        salon: "1600px",
      },
    },
  },
  plugins: [],
};

export default config;
