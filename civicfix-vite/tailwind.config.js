/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-navy': '#0A2A5E',
        'brand-blue': '#1d4ed8',
        'brand-blue-dark': '#1e3a8a',
        'brand-orange': '#F97316',
        'brand-amber': '#f59e0b',
        'panel-blue-dark': '#1e3a8a',
        'panel-blue': '#3b82f6',
      }
    },
  },
  plugins: [],
}
