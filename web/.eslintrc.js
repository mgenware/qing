module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-typescript-lite', 'plugin:@typescript-eslint/recommended', 'mgenware'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    // Sometimes, we need both web component files and their typings imported to avoid
    // unwanted tree-shaking.
    'import/no-duplicates': 'off',
    'import/order': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
  },
};
