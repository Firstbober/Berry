/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        black: '#172121',
        white: '#EBEBFF',
        brandPink: '#F64A8A',
        brandRed: '#ED2839'
      },
      backgroundImage: {
        welcomeHeroLight: 'url("/images/background/background-light.jpg")'
      }
    },
    fontFamily: {
      sans: ['Sarabun', 'sans-serif']
      // NotoSans: ['Noto Sans', 'sans-serif']
    }
  },
  plugins: []
}
