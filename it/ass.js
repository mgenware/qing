/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import deepEqual from 'fast-deep-equal/es6/index.js';

/**
 * Throws an error with the given message.
 * @param {string} msg
 */
function panic(msg) {
  throw new Error(`Assertion failed: ${msg}`);
}

/**
 * @param {*} a
 * @param {*} b
 */
export function e(a, b) {
  if (a !== b) {
    panic(`${JSON.stringify(a)} !== ${JSON.stringify(b)}`);
  }
}

/**
 * @param {*} a
 * @param {*} b
 */
export function ne(a, b) {
  if (a === b) {
    panic(`${JSON.stringify(a)} === ${JSON.stringify(b)}`);
  }
}

/**
 * @param {*} a
 * @param {*} b
 */
export function de(a, b) {
  if (!deepEqual(a, b)) {
    panic(`${JSON.stringify(a)} does not equals to ${JSON.stringify(b)}`);
  }
}

/**
 * @param {*} a
 */
export function t(a) {
  if (!a) {
    panic(`${JSON.stringify(a)} is false`);
  }
}

/**
 * @param {*} a
 */
export function f(a) {
  if (a) {
    panic(`${JSON.stringify(a)} is true`);
  }
}
