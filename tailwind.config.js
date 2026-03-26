/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        // BRAND (más profesional)
        primary: "#c9a34f",
        "primary-dark": "#a8842f",
        "primary-soft": "#e6d3a3",

        accent: "#4B2E6F",
        "accent-dark": "#2e1b47",
        "accent-soft": "#6d4ca3",

        // 🧱 BACKGROUNDS
        "background-light": "#FAFAFA",
        "background-soft": "#F5F3EF",
        "background-dark": "#14110f",

        // 🧾 SURFACES (cards, modales)
        "surface-light": "#ffffff",
        "surface-soft": "#f9f7f4",
        "surface-dark": "#1f1b17",

        // 🔤 TEXTOS
        "text-main": "#171512",
        "text-secondary": "#5f584b",
        "text-muted": "#827a68",
        "text-inverse": "#ffffff",

        // 🔲 BORDES
        "border-light": "#e8e6e1",
        "border-default": "#e4e2dd",
        "border-strong": "#cfcac1",

        // 🚨 ESTADOS (pro)
        success: "#16a34a",
        warning: "#f59e0b",
        error: "#dc2626",
      },

      fontFamily: {
        display: ["Manrope", "sans-serif"], 
        serif: ["Cormorant Garamond", "serif"], 
      },

      // 💎 SOMBRAS PRO (clave para ecommerce)
      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.06)",
        medium: "0 4px 14px rgba(0,0,0,0.1)",
        strong: "0 10px 25px rgba(0,0,0,0.15)",

        glow: "0 0 0 2px #c9a34f, 0 4px 12px rgba(0,0,0,0.15)",
      },

      // ✨ ANIMACIONES MÁS PREMIUM
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "scale-in": "scaleIn 0.25s ease-out forwards",
        "smooth-bounce": "smoothBounce 0.6s ease",
        "scroll": "scroll 40s linear infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },

        slideUp: {
          "0%": { opacity: "0", transform: "translateY(25px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },

        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },

        smoothBounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },

      // 🎯 TRANSICIONES MÁS SUAVES
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },

  plugins: [],
};