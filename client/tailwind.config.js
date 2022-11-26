/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js, jsx, ts, tsx}"],
  theme: {
    extend: {
      colors: {
        "body-dark": "#1A1A2E",
        "navbar-dark": "#0F3460",
      },
    },
  },
  plugins: [],
};
