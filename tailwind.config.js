/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-strong": "rgb(var(--surface-strong) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-soft": "rgb(var(--accent-soft) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        "danger-soft": "rgb(var(--danger-soft) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        "warning-soft": "rgb(var(--warning-soft) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Manrope", "ui-sans-serif", "sans-serif"],
      },
      boxShadow: {
        glow: "0 24px 80px rgba(15, 23, 42, 0.12)",
        panel: "0 24px 60px rgba(15, 23, 42, 0.08)",
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(14px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        shimmer: {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.65s ease-out both",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};
