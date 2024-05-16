import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      background: 'var(--color-background)',
      primary: 'var(--color-text-primary)',
      secondary: 'var(--color-text-secondary)',
      'grey-light': 'var(--color-grey-light)',
    },
    fontFamily: {
      display: ['Inter', '-apple-system', 'sans-serif'],
      body: ['Inter', '-apple-system', 'sans-serif'],
    },
    spacing: {
      '8': '8px',
      '16': '16px',
      '30': '30px',
    },
  },
  plugins: [],
};
export default config;
