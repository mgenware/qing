module.exports = {
  extends: ['airbnb-base', 'prettier'],
  parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
  rules: {
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'import/named': 'off',
  },
};
