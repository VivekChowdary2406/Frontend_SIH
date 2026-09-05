/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#11271e',
        leaf: '#176b52',
        paper: '#f5f7f5',
        ink: '#16251f',
        line: '#dfe7e2',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(19,47,34,.045)',
      },
    },
  },
  plugins: [],
};
