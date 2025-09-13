import { FlatCompat } from '@eslint/eslintrc';
import nkzw from '@nkzw/eslint-config';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default [
  ...nkzw,
  ...compat.extends('plugin:@next/next/recommended'),
  {
    rules: {
      'perfectionist/sort-jsx-props': 'off',
      'perfectionist/sort-object-types': 'off',
      'perfectionist/sort-objects': 'off',
    },
  },
];
