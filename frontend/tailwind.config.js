/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aravalli: {
          50: '#f2f9f4',
          100: '#e1f2e6',
          200: '#c5e4ce',
          300: '#9bcdab',
          400: '#69b081',
          500: '#43945d',
          600: '#327749',
          700: '#295e3c',
          800: '#244b32',
          900: '#1e3e2b',
          950: '#0c2215',
        },
        stoneplate: {
          850: '#1a1f26',
          900: '#12161c',
          950: '#0a0d11',
        },
        risk: {
          safe: '#10b981',       // Emerald
          watch: '#f59e0b',      // Amber
          high: '#f97316',       // Orange
          critical: '#ef4444',   // Red
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
