/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { appDef } from '@qing/def';
import { PANIC } from 'checks.js';

export default class ErrorWithCode extends Error {
  code: number;

  constructor(message: string, code: number = appDef.errGeneric) {
    super(message);
    this.code = code;
    this.message = message;
  }

  static assert(err: unknown): asserts err is ErrorWithCode {
    if (err instanceof ErrorWithCode === false) {
      PANIC('err is not an ErrorWithCode');
    }
  }
}
