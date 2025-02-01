import type { Config } from 'tailwindcss';

const palette = {
  white: 'var(--color-white)',
  blue: 'var(--color-blue)',
  'blue-light': 'var(--color-blue-light)',
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
      link: 'var(--color-text-link)',
      'grey-light': 'var(--color-grey-light)',
      'grey-lightest': 'var(--color-grey-lightest)',
      'social-x': 'var(--color-social-x)',
    },
    fontFamily: {
      display: ['Inter', '-apple-system', 'sans-serif'],
      body: ['Inter', '-apple-system', 'sans-serif'],
      system: ['-apple-system', 'sans-serif'],
    },
    spacing: {
      '0': '0',
      '2': '2px',
      '4': '4px',
      '8': '8px',
      '10': '10px',
      '12': '12px',
      '16': '16px',
      '18': '18px',
      '20': '20px',
      '24': '24px',
      '30': '30px',
      '40': '40px',
      '60': '60px',
      '80': '80px',
      '85': '85px',
      '140': '140px',
      '180': '180px',
      '325': '325px',
      '560': '560px',
      '1800': '1800px',
    },
    extend: {
      fontSize: {
        xxs: '0.625rem',
        xs: '0.75rem',
        sm: '0.875rem',
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
};

export default config;
