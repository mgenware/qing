/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { devMode } from 'devMode';

export function PANIC(errMessage: string) {
  if (devMode()) {
    // eslint-disable-next-line no-alert
    alert(errMessage);
    throw new Error(errMessage);
  } else {
    // eslint-disable-next-line no-console
    console.error(errMessage);
    // eslint-disable-next-line no-console
    console.trace();
  }
}

export function CHECK(v: unknown): asserts v {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!v) {
    PANIC('Assertion failed');
  }
}

export function ERR(err: unknown): asserts err is Error {
  if (err instanceof Error === false) {
    PANIC('err is not an Error');
  }
}
