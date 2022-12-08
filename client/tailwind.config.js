/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js, jsx, ts, tsx}"],
  theme: {
    extend: {
      colors: {
        "body-dark": "#1A1A2E",
        "navbar-dark": "#0F3460",
        "yellow-avatar": "#D6CDA4",
      },
      backgroundImage: {
        "mountain-1": "url('../public/img/mountain_agri.jpg')",
        "mountain-2": "url('../public/img/mountain_mckinley.jpg')",
        "mountain-3":
          "url('../public/img/parth-savani-uCuZ9kscyuc-unsplash.jpg')",
        "mountain-4":
          "url('../public/img/stephan-bechert-xQWelDCacZE-unsplash.jpg')",
        "mountain-5": "url('../public/img/toan-chu-pKFCH2t00wA-unsplash.jpg')",
        "mountain-6":
          "url('../public/img/tomas-malik-orQBzc7Dl3U-unsplash.jpg')",
      },
    },
  },
  plugins: [],
};
