/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.neutral.800"),
            a: { color: theme("colors.neutral.700"), textDecoration: "underline" },
            h1: { color: theme("colors.neutral.900") },
            h2: { color: theme("colors.neutral.900") },
            h3: { color: theme("colors.neutral.900") },
            h4: { color: theme("colors.neutral.900") },
            h5: { color: theme("colors.neutral.900") },
            h6: { color: theme("colors.neutral.900") },
            blockquote: {
              color: theme("colors.neutral.700"),
              borderLeftColor: theme("colors.neutral.400"),
            },
            code: { color: theme("colors.neutral.900") },
            "pre code": { color: theme("colors.neutral.50") },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
