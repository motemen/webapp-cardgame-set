/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "fade-out": "fadeOut 2s cubic-bezier(0.86, 0.01, 0.98, 0.12) forwards",
        bounce: "bounce 3s infinite",
      },
      keyframes: {
        fadeOut: {
          "0%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
