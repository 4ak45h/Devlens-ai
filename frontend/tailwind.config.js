/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "tertiary-fixed": "#ffdea9",
        "secondary": "#c6c4da",
        "surface-container-low": "#1b1b20",
        "on-tertiary": "#422d00",
        "on-primary-fixed": "#001f26",
        "on-surface": "#e4e1e9",
        "surface-tint": "#00d9ff",
        "primary-fixed": "#aeecff",
        "on-primary-container": "#005b6c",
        "on-background": "#e4e1e9",
        "secondary-container": "#464557",
        "on-surface-variant": "#bbc9ce",
        "error-container": "#93000a",
        "on-error": "#690005",
        "surface-container": "#1f1f25",
        "on-tertiary-fixed-variant": "#5e4100",
        "primary-fixed-dim": "#00d9ff",
        "tertiary-fixed-dim": "#febb29",
        "on-error-container": "#ffdad6",
        "primary-container": "#00d9ff",
        "on-secondary-fixed": "#1a1a2a",
        "tertiary-container": "#ffbb2a",
        "surface": "#131318",
        "surface-variant": "#35343a",
        "surface-container-highest": "#35343a",
        "background": "#131318",
        "surface-bright": "#39383e",
        "on-primary-fixed-variant": "#004e5d",
        "inverse-surface": "#e4e1e9",
        "on-secondary-fixed-variant": "#464557",
        "primary": "#afecff",
        "secondary-fixed-dim": "#c6c4da",
        "inverse-primary": "#00687b",
        "on-primary": "#003641",
        "inverse-on-surface": "#303036",
        "on-secondary-container": "#b5b3c8",
        "error": "#ffb4ab",
        "secondary-fixed": "#e3e0f7",
        "on-secondary": "#2f2f40",
        "surface-container-high": "#2a292f",
        "tertiary": "#ffdeaa",
        "on-tertiary-container": "#6e4d00",
        "surface-container-lowest": "#0e0e13",
        "outline-variant": "#3c494d",
        "surface-dim": "#131318",
        "outline": "#859398",
        "on-tertiary-fixed": "#271900"
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Space Grotesk", "sans-serif"],
        mono: ["Space Grotesk", "sans-serif"]
      }
    }
  },
  plugins: []
}