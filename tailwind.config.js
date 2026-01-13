/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.9s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '100' },
          '100%': { opacity: '100' },
        },
      },
    },
  },
  plugins: [],
  
}