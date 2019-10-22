module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.html', // replace this by more specific extension if needed
      options: {
        parser: 'html',
      },
    },
  ],
};
