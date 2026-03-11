/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink:    "#0d0c0a",
        paper:  "#f5f0e8",
        amber: {
          DEFAULT: "#e8a020",
          light:   "#f5c355",
          dim:     "rgba(232,160,32,0.12)",
        },
        rust:  "#c44b2b",
        sage:  "#5a7a5c",
        slate: "#2a2825",
        muted: "#7a776e",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans:    ["DM Sans", "system-ui", "sans-serif"],
        mono:    ["DM Mono", "monospace"],
      },
      animation: {
        "spin-slow":    "spin 8s linear infinite",
        "marquee":      "marquee 25s linear infinite",
        "fade-up":      "fadeUp 0.5s ease both",
        "fade-slide-1": "fadeSlideIn 0.6s ease 0.1s both",
        "fade-slide-2": "fadeSlideIn 0.6s ease 0.2s both",
        "fade-slide-3": "fadeSlideIn 0.6s ease 0.3s both",
        "pulse-slow":   "pulse 3s ease-in-out infinite",
        "pulse-dot":    "pulseDot 2s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeSlideIn: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.3" },
        },
      },
    },
  },
  plugins: [],
};
