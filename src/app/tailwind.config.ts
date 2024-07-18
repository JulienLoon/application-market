import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Hiermee wordt class-based dark mode ingeschakeld
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        background: {
          light: "rgb(214, 219, 220)",
          dark: "rgb(0, 0, 0)"
        },
        foreground: {
          light: "rgb(0, 0, 0)",
          dark: "rgb(255, 255, 255)"
        }
      }
    },
  },
  plugins: [],
};

export default config;
