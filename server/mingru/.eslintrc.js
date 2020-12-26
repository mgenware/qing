module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-typescript-lite', 'plugin:@typescript-eslint/recommended', 'mgenware'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
};
