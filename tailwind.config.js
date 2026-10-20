/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: "#08090b",
          900: "#0d0f13",
          800: "#13161c",
          700: "#1a1e27",
          600: "#242a36",
        },
        lime: {
          neon: "#d4ff00",
          glow: "rgba(212, 255, 0, 0.25)",
          dark: "#a3c700",
        },
      },
      boxShadow: {
        "neon": "0 0 25px -4px rgba(212, 255, 0, 0.25)",
        "neon-lg": "0 0 40px -2px rgba(212, 255, 0, 0.35)",
        "card": "0 10px 30px -10px rgba(0, 0, 0, 0.6)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "bounce-slight": "bounceSlight 2s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 15px rgba(212, 255, 0, 0.2)" },
          "100%": { boxShadow: "0 0 35px rgba(212, 255, 0, 0.5)" },
        },
        bounceSlight: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
    },
  },
  plugins: [],
};
