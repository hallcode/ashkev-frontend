module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'serif': ['Libre Baskerville', 'serif']
    },
    extend: {
      screens: {
        'print': {'raw': 'print'},
        // => @media print { ... }
      },
      colors: {
        'gold': '#d4af34',
      },
      borderWidth: {
        'fat': '16px'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
