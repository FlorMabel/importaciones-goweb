/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  darkMode: "class",

  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        // 👑 LUXURY PALETTE (60-20-20 Rule)
        primary: "var(--primary)",      // 20% Dorado (Luxury & CTAs)
        "primary-dark": "var(--primary-dark)",
        "primary-soft": "var(--primary-soft)",

        accent: "var(--accent)",       // 20% Morado (Prestige & Badges)
        "accent-dark": "var(--accent-dark)",
        "accent-soft": "var(--accent-soft)",

        // 🧱 BASES (60% Beige)
        beige: {
          light: "var(--bg-light)",
          soft: "var(--bg-soft)",       // 60% Beige Base
          strong: "var(--bg-strong)",
        },

        "background-light": "var(--bg-light)",
        "background-soft": "var(--bg-soft)",
        "background-dark": "var(--bg-dark)",

        // 🧾 SURFACES (Luxury layers)
        "surface-light": "var(--surface-light)",
        "surface-soft": "var(--surface-soft)",
        "surface-dark": "var(--surface-dark)",

        // 🔤 TYPOGRAPHY
        "text-main": "var(--text-main)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "text-inverse": "var(--text-inverse)",

        // 🔲 BORDERS
        "border-light": "var(--border-light)",
        "border-default": "var(--border-default)",
        "border-strong": "var(--border-strong)",

        // 🚨 STATES
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
        soft: "0 2px 8px var(--shadow-color)",
        medium: "0 4px 14px rgba(0,0,0,0.1)",
        strong: "0 10px 25px rgba(0,0,0,0.15)",

        glow: "0 0 0 2px var(--primary), 0 4px 12px rgba(0,0,0,0.15)",
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