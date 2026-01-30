/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        "light-text": "#11181C",
        "light-background": "#fff",
        "light-tint": "#0a7ea4",
        "light-icon": "#687076",
        "light-tab-default": "#687076",
        "light-tab-selected": "#0a7ea4",

        // Dark mode colors
        "dark-text": "#ECEDEE",
        "dark-background": "#151718",
        "dark-tint": "#fff",
        "dark-icon": "#9BA1A6",
        "dark-tab-default": "#9BA1A6",
        "dark-tab-selected": "#fff",
      },
      fontFamily: {
        sans: ["system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
        mono: ["monospace"],
      },
    },
  },
  plugins: [],
};
