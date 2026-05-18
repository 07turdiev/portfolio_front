/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4775ff',
          dark: '#1e325c',
          footer: '#21396a',
          text: '#172b4d',
          muted: '#6b778c'
        }
      },
      fontFamily: {
        sans: ['"Public Sans"', 'sans-serif']
      },
      maxWidth: {
        'screen-2k': '1920px'
      }
    }
  },
  plugins: []
}
