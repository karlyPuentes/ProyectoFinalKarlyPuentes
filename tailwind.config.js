/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff0f6",
          100: "#ffe0ee",
          200: "#ffb3d0",
          300: "#ff80b0",
          400: "#ff4d90",
          500: "#ff1a70",
          600: "#d4115a",
          700: "#a80c46",
          800: "#7c0833",
          900: "#500520"
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
