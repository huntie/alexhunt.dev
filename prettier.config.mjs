/** @type {import('prettier').Config} */
const config = {
  arrowParens: 'avoid',
  singleQuote: true,
  trailingComma: 'all',
  plugins: ['prettier-plugin-organize-imports'],
  overrides: [
    {
      files: ['*.code-workspace', 'tsconfig.json'],
      options: {
        parser: 'json-stringify',
      },
    },
  ],
};

export default config;
