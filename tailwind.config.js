/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        "weather-primary": "#00668A",
        "weather-secondary": "#004E71"
      },
      fontFamily: {
        Roboto: ["Roboto, san-serif"],
      },
      container: {
        padding: "2rem",
        center: true
      },
      screens: {
        sm: "640px",
        md: "768px",
      },
    },
  },
  plugins: [],
}

