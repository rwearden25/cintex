import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cintex: {
          50: "#eff8ff",
          100: "#dff0ff",
          200: "#b9e3ff",
          300: "#7fcdff",
          400: "#38b2ff",
          500: "#1098f7",
          600: "#0b78d1",
          700: "#075ea8",
          800: "#064b87",
          900: "#053a68",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
