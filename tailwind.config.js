/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#c9a34f",
        "primary-dark": "#b08d43",
        accent: "#4B2E6F",
        "accent-dark": "#362151",
        "background-light": "#FAFAFA",
        "background-soft": "#F4F1EC",
        "background-dark": "#1E1B14",
        "surface-light": "#ffffff",
        "surface-dark": "#2d2a24",
        "text-main": "#171512",
        "text-muted": "#827a68",
        "border-color": "#e4e2dd",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        "scroll-infinite": "scrollInfinite 30s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scrollInfinite: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
