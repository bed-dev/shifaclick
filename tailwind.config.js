/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        aqua: '#3CA4AC',
        dark: '#2D3E50',
        page: '#F7F8FA',
      },
      fontFamily: {
        jakarta: ['Plus Jakarta Sans'],
      },
    },
  },
  plugins: [],
};
