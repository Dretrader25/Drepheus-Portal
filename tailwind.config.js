/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        matrix: {
          green: '#00ff00',
          darkGreen: '#003300',
          lightGreen: '#66ff66',
          blue: '#00ffff',
          gold: '#ffd700',
          white: '#ffffff'
        }
      },
      animation: {
        'matrix-fall': 'matrix-fall linear infinite',
        'matrix-glow': 'matrix-glow 2s ease-in-out infinite alternate',
        'matrix-flicker': 'matrix-flicker 0.1s linear infinite',
      },
      keyframes: {
        'matrix-fall': {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        'matrix-glow': {
          '0%': { 
            textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
            filter: 'brightness(1)'
          },
          '100%': { 
            textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
            filter: 'brightness(1.3)'
          }
        },
        'matrix-flicker': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 }
        }
      }
    },
  },
  plugins: [],
}
