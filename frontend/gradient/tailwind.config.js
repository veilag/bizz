export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "spin-in": {
          "50%": {transform: "rotate(360deg)"}
        },
        "spin-out": {
          "50%": {transform: "rotate(-360deg)"}
        }
      },
      animation: {
        "spin-in": "spin-in 5s linear infinite",
        "spin-out": "spin-out 5s linear infinite",
      }
    },
  },
  plugins: [],
}

