/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          bg: '#F5F7F0',
          card: '#FFFFFF',
          text: '#26382D',
          primary: '#1B5E3B',
          forest: '#1B5E3B',
          emerald: '#2E8B57',
          sandstone: '#DCC8A3',
          earthBrown: '#806044',
          softOlive: '#A3B18A',
          border: '#DCC8A3',
          muted: '#526A59',
        },
        aravalli: {
          50: '#F5F7F0',
          100: '#E8EFE3',
          200: '#D5E2CC',
          300: '#A3B18A',
          400: '#588157',
          500: '#3A5A40',
          600: '#2E8B57',
          700: '#1B5E3B',
          800: '#15472C',
          900: '#26382D',
          950: '#121F17',
        },
        risk: {
          safe: '#2E8B57',       // Emerald
          watch: '#D97706',      // Amber
          high: '#EA580C',       // Orange
          critical: '#DC2626',   // Red
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
