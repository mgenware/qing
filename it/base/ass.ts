/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import deepEqual from 'fast-deep-equal/es6/index.js';

export function panic(msg: string) {
  throw new Error(`Assertion failed: ${msg}`);
}

export function e<T>(a: T, b: T) {
  if (a !== b) {
    panic(`Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}.`);
  }
}

export function ne<T>(a: T, b: T) {
  if (a === b) {
    panic(`${JSON.stringify(a)} should not be equal to ${JSON.stringify(b)}`);
  }
}

export function de<T>(a: T, b: T) {
  if (!deepEqual(a, b)) {
    panic(`Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}.`);
  }
}

export function t(a: unknown) {
  if (!a) {
    panic(`${JSON.stringify(a)} should not be false`);
  }
}

export function f(a: unknown) {
  if (a) {
    panic(`${JSON.stringify(a)} should not be true`);
  }
}

export function regex(s: string, r: RegExp) {
  if (!r.test(s)) {
    panic(`"${s}" does not match "${r}"`);
  }
}
