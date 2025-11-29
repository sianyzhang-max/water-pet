/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        blob: "blob 7s infinite",
        float: "float 4s ease-in-out infinite",
        'pop-in': "pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        blink: "blink 4s infinite",
        'bounce-gentle': "bounce-gentle 1s infinite",
        'fade-in': "fadeIn 0.3s ease-out",
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(5px, -10px) scale(1.05)" },
          "66%": { transform: "translate(-5px, 5px) scale(0.95)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        'pop-in': {
          "0%": { transform: "scale(0) translateY(10px)", opacity: "0" },
          "70%": { transform: "scale(1.1) translateY(-2px)", opacity: "1" },
          "100%": { transform: "scale(1) translateY(0)", opacity: "1" },
        },
        blink: {
          "0%, 96%, 100%": { transform: "scaleY(1)" },
          "98%": { transform: "scaleY(0.1)" },
        },
        'bounce-gentle': {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        ping: {
          "75%, 100%": {
            transform: "scale(2)",
            opacity: "0",
          },
        },
      },
      animationDelay: {
        2000: '2000ms',
        4000: '4000ms',
      }
    },
  },
  plugins: [],
}