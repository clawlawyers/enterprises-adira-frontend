/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        'progress-wave': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'progress-wave': 'progress-wave 2s ease-in-out infinite',
      },
      backgroundImage: {
        "custom-gradient": "linear-gradient(180deg, #0E1118 0%, #1D2330 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(0, 110, 110, 0.45) 1.83%, rgba(9, 255, 255, 0.45) 98.17%); ",
        "popup-gradient":
          "linear-gradient(102deg, #018081 0.16%, rgba(0, 67, 67, 1) 99.84%);",
        "logo-gradient": "linear-gradient(90deg, #018081 0%, #004343 80%);",
        "upload-card":
          "linear-gradient(102.52deg, #FFFFFF 0.1%, #B4B4B4 99.9%)",
        "hover-gradient": "linear-gradient(90deg, #018081 0%, #00A9AB 100%)",
        "edit-gradient":
          " linear-gradient(151.58deg, rgba(0, 67, 67, 0.2) 0.65%, rgba(0, 168, 169, 0.2) 99.35%)",
        "btn-gradient":
          "linear-gradient(93.61deg, #004343 0.2%, #00A9AB 99.8%)",
      },
      colors: {
        customBlack: "rgba(34, 34, 34, 0.8)",
        customBlue: "#018081",
        customGrey: "#868686",
        customInput: "#E7E7E7",
        customOTP: "#001616",
        customBORDER: "#2D2D2D",
        customDrakBlue: "#00A9AB",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none" /* IE and Edge */,
          "scrollbar-width": "none" /* Firefox */,
          "&::-webkit-scrollbar": {
            display: "none" /* Chrome, Safari, and Opera */,
          },
        },
      });
    },
  ],
};
