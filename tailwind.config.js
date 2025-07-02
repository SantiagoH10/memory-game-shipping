/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'ssp': ['Source Sans Pro', 'sans-serif'],
        'sans': ['Source Sans Pro', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        'ccblue': '#0D173F',
        'ccred': '#FF0000',
        'ccaqua': '#3E64B8',
      }
    },
  },
  plugins: [],
}