/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        spinSlow: 'spin 3s linear infinite', // Custom slower spin
        spinFast: 'spin 1s linear infinite', // Custom faster spin
      },
      boxShadow: {
        custom: "0px 2px 6px rgba(241, 152, 149, 0.5)", // Replace with your color and alpha
      },
      colors: {
        primary: {
          DEFAULT: "#f19895", // Default primary color
          light: "#f8c0be", // Lighter shade
          dark: "#d87774", // Darker shade
        },
        backColor: '#898c8f',
        NavColor: '#101820',
        GoldColor: '#f3ca20',
      },
    },
  },
  plugins: [],
};
