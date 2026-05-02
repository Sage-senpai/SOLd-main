import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'sold-primary': '#7c3aed',
        'sold-success': '#10b981',
        'sold-danger': '#ef4444',
        'sold-gray': {
          0: '#ffffff',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#0a0a0a',
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
      animation: {
        'sold-drift': 'sold-drift 18s ease-in-out infinite',
        'sold-pulse-line': 'sold-pulse-line 9s ease-in-out infinite',
        'sold-enter': 'sold-enter 520ms ease both',
      },
    },
  },
  plugins: [],
};

export default config;
