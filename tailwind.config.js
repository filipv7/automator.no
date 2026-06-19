/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        bg: '#FAF8F3',
        bgalt: '#F1ECE0',
        surface: '#FFFFFF',
        ink: '#25323D',
        inksoft: '#51606B',
        inkfaint: '#8B96A0',
        line: '#E3DDCD',
        bronze: '#9C7748',
        amber: { DEFAULT: '#D98B3F', dark: '#B8702C', light: '#F0B776' },
        teal: { DEFAULT: '#3D7A78', dark: '#2A5957', light: '#6FA9A6' },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
