import { FlatCompat } from '@eslint/eslintrc';
import nkzw from '@nkzw/eslint-config';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default [...nkzw, ...compat.extends('plugin:@next/next/recommended')];
