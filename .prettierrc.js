/** @type {import('prettier').Config} */
module.exports = {
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
