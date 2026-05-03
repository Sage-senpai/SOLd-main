import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'sold-primary': '#0b0b0b',
        'sold-success': '#111111',
        'sold-danger': '#0b0b0b',
        'sold-gray': {
          0: '#ffffff',
          50: '#faf9f5',
          100: '#f7f5ef',
          200: '#e7e4dd',
          300: '#c8c4ba',
          400: '#9a968d',
          500: '#6e6a63',
          600: '#4b4843',
          700: '#302e2a',
          800: '#171615',
          900: '#0b0b0b',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        eldritch: ['Unbounded', 'IBM Plex Sans', 'sans-serif'],
      },
      spacing: {
        unit: '4px',
      },
    },
  },
  plugins: [],
};

export default config;
