/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundSize: {
        "3x-wide": "300% 100%",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-button": "linear-gradient(270deg, #5bb65b 45%, #333e48 55%)",
      },

      dropShadow: {
        "3xl": "0 35px 35px rgba(0, 0, 0, 0.25)",
        "4xl": [
          "0 35px 35px rgba(0, 0, 0, 0.25)",
          "0 45px 65px rgba(0, 0, 0, 0.15)",
        ],
        "1904labs-text": "0 0 10px #5c696f",
      },
      colors: {
        "form-primary": "#5bb65b",
        "form-primary-hover": "#447f44",
        "form-primary-contrast": "#fefefe",
        "1904labs-green": {
          // green color centered around 1904labs green #5BB65B
          50: "#f1f8f1",
          100: "#e3f1e3",
          200: "#c6e3c6",
          300: "#a9d6a9",
          400: "#6fbc6f",
          500: "#5bb65b",
          600: "#539e53",
          700: "#447f44",
          800: "#336033",
          900: "#2b522b",
        },
        "1904labs-grey": {
          // grey color centered around 1904labs grey #333e48
          50: "#e8ebee",
          100: "#c5ccd2",
          200: "#a2abb1",
          300: "#7f8a90",
          400: "#5c696f",
          500: "#333e48",
          600: "#2d3842",
          700: "#262d35",
          800: "#20272c",
          900: "#1a2025",
        },
        "1904labs-blue": {
          // blue color centered around 1904labs blue #62a0a5
          50: "#f2f7f7",
          100: "#d9ecec",
          200: "#c0e1e1",
          300: "#a7d6d6",
          400: "#8ecbcb",
          500: "#62a0a5",
          600: "#5ca5a5",
          700: "#4d8a8a",
          800: "#3e6f6f",
          900: "#2f5454",
        },
        "1904labs-yellow": {
          // orange color centered around 1904labs orange #F2C750
          50: "#f9f7f1",
          100: "#f3edd3",
          200: "#ecd3a6",
          300: "#e6b979",
          400: "#df9d4c",
          500: "#f2c750",
          600: "#d18d3f",
          700: "#a86e32",
          800: "#7f4f25",
          900: "#562f18",
        },
        "1904labs-red": {
          // red color centered around 1904labs red #E2504D
          50: "#f9f1f1",
          100: "#f3e3e3",
          200: "#ecc6c6",
          300: "#e5a9a9",
          400: "#de8c8c",
          500: "#E2504D",
          600: "#c84645",
          700: "#9f3838",
          800: "#762a2a",
          900: "#4d1d1d",
        },
        "1904labs-white": "#fefefe",
      },
    },
  },
  plugins: [],
};
