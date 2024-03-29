/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['mgenware'],
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
  },
  ignorePatterns: '/dist/',
  rules: {
    // Sometimes, we need both web component files and their typings imported to avoid
    // unwanted tree-shaking.
    'import/no-duplicates': 'off',
    'import/order': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'import/extensions': 'off',
    // Unbound methods are handled by lit.
    '@typescript-eslint/unbound-method': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
  ignorePatterns: ['src/sod'],
};
