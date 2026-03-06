/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        'hind-siliguri': ['"Hind Siliguri"', 'sans-serif'],
        'noto-sans-bengali': ['"Noto Sans Bengali"', '"Noto Sans Devanagari"', 'sans-serif'],
      },
      colors: {
        'brand-magenta': '#81007F',
        'brand-violet': '#4B0081',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float-1 8s ease-in-out infinite',
        'float-medium': 'float-2 6s ease-in-out infinite',
        'float-fast': 'float-3 5s ease-in-out infinite',
        'infinite-scroll': 'infinite-scroll 40s linear infinite',
      },
      keyframes: {
        // 1. Gentle vertical bobbing with slight rotation
        'float-1': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(2deg)' },
        },
        'float-2': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(-1deg)' },
          '33%': { transform: 'translate(8px, -10px) rotate(2deg)' },
          '66%': { transform: 'translate(-8px, 5px) rotate(-2deg)' },
        },

        'float-3': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-12px) scale(1.05)' },
        },
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        }
      }
      // ----------------------------------
    },
  },
  plugins: [],
}