/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#457b9d',
      },
      screens: {
        mds: "800px"
      },
    },
  },
  plugins: [],
}

