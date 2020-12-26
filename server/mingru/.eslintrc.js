module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-typescript-lite', 'plugin:@typescript-eslint/recommended', 'mgenware'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'lines-between-class-members': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
  },
};
