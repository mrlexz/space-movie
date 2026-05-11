/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cinema: {
          black: "#0a0a0f",
          dark: "#0f0f1a",
          card: "#141420",
          border: "#1e1e2e",
          accent: "#e50914",
          gold: "#f5c518",
          muted: "#6b7280",
          text: "#e8e8f0",
          sub: "#9999aa",
        },
      },
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        body: ["'DM Sans'", "sans-serif"],
      },
      backgroundImage: {
        "cinema-gradient": "linear-gradient(to right, #0a0a0f 30%, transparent 100%)",
        "card-gradient": "linear-gradient(to top, rgba(10,10,15,0.95) 0%, transparent 60%)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
};
