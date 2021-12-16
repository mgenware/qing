/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import deepEqual from 'fast-deep-equal/es6/index.js';
import { diff } from 'jest-diff';
import { debugMode } from './debug';

function panic(msg: string | null) {
  const s = `Assertion failed: ${msg}`;
  if (debugMode()) {
    console.warn(s);
    // eslint-disable-next-line no-console
    console.trace();
  } else {
    // eslint-disable-next-line no-console
    console.log(s);
    // eslint-disable-next-line no-console
    console.trace();
    process.exit(1);
  }
}

export function e<T>(a: T, b: T) {
  if (a !== b) {
    panic(diff(a, b));
  }
}

export function ne<T>(a: T, b: T) {
  if (a === b) {
    panic(`${JSON.stringify(a)} should not be equal to ${JSON.stringify(b)}`);
  }
}

export function de<T>(a: T, b: T) {
  if (!deepEqual(a, b)) {
    panic(diff(a, b));
  }
}

export function t(a: unknown): asserts a {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!a) {
    panic(`${JSON.stringify(a)} is expected to be truthy`);
    // Not reachable.
    return;
  }
  if (typeof a === 'function') {
    throw new Error(`value cannot be a function, got ${a}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (a as any).then === 'function') {
    throw new Error(`value cannot be a Promise, got ${a}`);
  }
}

export function f(a: unknown) {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (a) {
    panic(`${JSON.stringify(a)} is expected to be falsy`);
  }
}

export function regex(s: string, r: RegExp) {
  if (!r.test(s)) {
    panic(`"${s}" does not match "${r}"`);
  }
}

export function isNumber(v: unknown): number {
  if (typeof v !== 'number') {
    panic(`${v} is expected to be a number`);
    // Not reachable.
    return 0;
  }
  return v;
}

export function isString(v: unknown): string {
  if (typeof v !== 'string' || !v) {
    panic(`${v} is expected to be a string`);
    // Not reachable.
    return '';
  }
  return v;
}

export function equalsToString(v: unknown, expected: string | null, trim?: boolean): string {
  let s = isString(v);
  if (trim) {
    s = s.trim();
  }
  e(s, expected);
  return s;
}

export function isElement(v: unknown): HTMLElement {
  if (v instanceof HTMLElement) {
    return v;
  }
  panic(`${v} is expected to be an HTMLElement`);
  // Not reachable.
  return new HTMLElement();
}
