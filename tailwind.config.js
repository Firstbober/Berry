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
        white: {
          DEFAULT: '#EBEBFF',
          50: '#EBEBFF',
          100: '#d4d4e6',
          200: '#bcbccc',
          300: '#a5a5b3',
          400: '#8d8d99',
          500: '#767680',
          600: '#5e5e66',
          700: '#46464c',
          800: '#2f2f33',
          900: '#171719'
        },
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
  plugins: [
    require('tailwind-scrollbar-hide')
  ]
}
