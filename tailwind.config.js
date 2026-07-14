/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
              "primary": "var(--primary)",
              "primary-dark": "var(--primary-dark)",
              "on-primary": "#ffffff",
              "surface": "var(--surface)",
              "on-surface": "var(--on-surface)",
              "on-surface-variant": "var(--on-surface-variant)",
              "surface-container": "var(--surface-container)",
              "outline": "var(--outline)"
      },
      "borderRadius": {
              "DEFAULT": "0.25rem",
              "lg": "0.5rem",
              "xl": "0.75rem",
              "full": "9999px"
      },
      "fontFamily": {
              "headline": ["Playfair Display", "serif"],
              "body": ["Inter", "sans-serif"],
              "label": ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}
