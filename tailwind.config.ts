import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0f172a", // Slate 900
        secondary: "#64748b", // Slate 500
        accent: "#3b82f6", // Blue 500
      },
    },
  },
  plugins: [],
};
export default config;
