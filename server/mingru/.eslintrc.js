module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-typescript-lite', 'plugin:@typescript-eslint/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-plusplus': 'off',
    // Allow `for-of` loops.
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'max-classes-per-file': 'off',
    'prefer-destructuring': ['error', { object: true, array: false }],
    '@typescript-eslint/indent': 'off',
    // We'll let prettier handle whitespaces.
    'operator-linebreak': 'off',
    'function-paren-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'object-curly-newline': 'off',
    // End of prettier-related rules.
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    '@typescript-eslint/lines-between-class-members': 'off',
    'lines-between-class-members': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'import/prefer-default-export': 'off',
    'newline-per-chained-call': 'off',
  },
};
