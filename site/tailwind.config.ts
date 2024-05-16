import type { Config } from 'tailwindcss';

const palette = {
  white: 'var(--color-white)',
};

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      ...palette,
      background: 'var(--color-background)',
      primary: 'var(--color-text-primary)',
      secondary: 'var(--color-text-secondary)',
      'grey-light': 'var(--color-grey-light)',
      'social-x': 'var(--color-social-x)',
    },
    fontFamily: {
      display: ['Inter', '-apple-system', 'sans-serif'],
      body: ['Inter', '-apple-system', 'sans-serif'],
      system: ['-apple-system', 'sans-serif'],
    },
    spacing: {
      '2': '2px',
      '4': '4px',
      '5': '5px',
      '8': '8px',
      '10': '10px',
      '12': '12px',
      '24': '24px',
      '16': '16px',
      '30': '30px',
      '60': '60px',
    },
    extend: {
      fontSize: {
        xs: '0.625rem',
      },
    },
  },
  plugins: [],
};
export default config;
