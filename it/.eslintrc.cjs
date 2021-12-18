/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['mgenware'],
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    'import/order': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'import/extensions': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // TODO: turn this rule on when we migrate away from runner.js
    '@typescript-eslint/no-floating-promises': 'off',
    // TODO: turn this rule on when we migrate away from runner.js
    '@typescript-eslint/no-misused-promises': 'off',
    'prefer-template': 'off',
  },
};
