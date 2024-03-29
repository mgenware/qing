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
    'import/order': 'off',
    'class-methods-use-this': 'off',
    'prefer-template': 'off',
  },
};
