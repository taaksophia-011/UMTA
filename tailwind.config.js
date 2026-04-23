/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'executive-blue': '#1e3a8a',
        'executive-slate': '#334155',
      }
    },
  },
  plugins: [],
}
