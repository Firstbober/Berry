/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        black: '#172121',
        white: '#EBEBFF',
        indigo: {
          800: '#2B3661',
          700: '#5461AF',
          600: '#646FB6'
        },
        green: {
          500: '#50C878',
          800: '#296A46'
        },
        pink: {
          900: '#982649'
        }
      },
    },
    fontFamily: {
      sans: ['Sarabun', 'sans-serif']
    }
  },
  plugins: [],
};
