/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'fibonacci-gold': '#FFD700',
        'fibonacci-deep': '#B8860B',
        'fibonacci-light': '#FFF8DC',
      },
      animation: {
        'spiral': 'spiral 10s linear infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
      },
      keyframes: {
        spiral: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '100%': { transform: 'rotate(360deg) scale(1.618)' }
        },
        'pulse-gold': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.05)' }
        }
      }
    },
  },
  plugins: [],
}
