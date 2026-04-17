// eslint-disable-next-line import-x/no-extraneous-dependencies
import nextPlugin from '@next/eslint-plugin-next';
import nkzw from '@nkzw/eslint-config';

export default [
  ...nkzw,
  {
    ignores: ['.next/**'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
    },
  },
  {
    rules: {
      'perfectionist/sort-jsx-props': 'off',
      'perfectionist/sort-object-types': 'off',
      'perfectionist/sort-objects': 'off',
    },
  },
];
