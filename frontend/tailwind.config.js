/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'onion-peel': '#F3E5D8',
        'deep-brown': '#4B3028',
        'mandarin': '#E87936',
        'warm-cream': '#FFF9F3',
        'muted-beige': '#D8BFA9',
      },
    },
  },
  plugins: [],
}
