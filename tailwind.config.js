/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#237A4B',
          dark: '#185C38',
          light: '#E8F3E9',
          hover: '#1e683f'
        },
        accent: {
          yellow: '#F4C84A',
          orange: '#E67E22',
        },
        app: {
          bg: '#F7F8F3',
          card: '#FFFFFF',
          text: '#252A25',
          muted: '#667066',
          border: '#E2E6DF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Noto Sans Devanagari', 'Noto Sans Kannada', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
