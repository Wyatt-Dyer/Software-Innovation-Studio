/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}", // Correctly targets the screens folder
    "./components/**/*.{js,jsx,ts,tsx}", // Target new components
    "./client/**/*.{js,jsx,ts,tsx}",  // If you have other components in the client folder
  ],
  theme: {
    extend: {},
  },
  plugins: [require("nativewind/tailwind/css")],
};
