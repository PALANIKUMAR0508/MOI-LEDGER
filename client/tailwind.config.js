/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.hl', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4A3728',
        'primary-light': '#8C6239',
        secondary: '#C5A059',
        accent: '#D4AF37',
        surface: '#FDFCF0',
        'surface-variant': '#F5F2E0',
        'surface-container': '#F2EEDA',
        'surface-lowest': '#FFFFFF',
        'on-surface': '#2C241E',
        'on-surface-variant': '#6D5F52',
        outline: '#C5B358',
        'outline-variant': '#E5DCC3',
        error: '#93000A',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      borderRadius: {
        DEFAULT: '0px',
        sm: '2px',
        md: '4px',
        lg: '4px',
        xl: '8px',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
