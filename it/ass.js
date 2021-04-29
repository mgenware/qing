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
    panic(`Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}.`);
  }
}

/**
 * @param {*} a
 * @param {*} b
 */
export function ne(a, b) {
  if (a === b) {
    panic(`${JSON.stringify(a)} should not be equal to ${JSON.stringify(b)}`);
  }
}

/**
 * @param {*} a
 * @param {*} b
 */
export function de(a, b) {
  if (!deepEqual(a, b)) {
    panic(`Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}.`);
  }
}

/**
 * @param {*} a
 */
export function t(a) {
  if (!a) {
    panic(`${JSON.stringify(a)} should not be false`);
  }
}

/**
 * @param {*} a
 */
export function f(a) {
  if (a) {
    panic(`${JSON.stringify(a)} should not be true`);
  }
}

/**
 * @param {string} s
 * @param {RegExp} r
 */
export function regex(s, r) {
  if (!r.test(s)) {
    panic(`"${s}" does not match "${r}"`);
  }
}
