/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import { localizedErrDict } from 'defs';
import ErrorWithCode from 'lib/errorWithCode';
import UserData from './app/modules/userData';
import Loader from './lib/loader';

export class Result<TData> {
  constructor(public error: ErrorWithCode | null, public data: TData | null) {}

  static error<T>(err: ErrorWithCode): Result<T> {
    return new Result<T>(err, null);
  }

  static data<T>(data: T): Result<T> {
    return new Result<T>(null, data);
  }

  get isSuccess(): boolean {
    return !this.error;
  }
}

class APP {
  userData = new UserData();

  get devMode(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).__qing_dev__;
  }
}

// Set global error messages to loader type.
Loader.defaultLocalizedMessageDict = localizedErrDict;

const app = new APP();
export default app;
