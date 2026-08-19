/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          DEFAULT: '#16A34A',
          light: '#22C55E',
          dark: '#15803D',
          soft: 'rgba(34, 197, 94, 0.12)',
          glow: 'rgba(34, 197, 94, 0.35)'
        },
        orangeSoft: {
          DEFAULT: '#F97316',
          light: '#FB923C',
          warm: '#FFF7ED',
          border: 'rgba(251, 146, 60, 0.25)',
          soft: 'rgba(249, 115, 22, 0.1)'
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.85)',
          card: 'rgba(255, 255, 255, 0.75)',
          border: 'rgba(251, 146, 60, 0.2)',
          hover: 'rgba(255, 255, 255, 0.95)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
