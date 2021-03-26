/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import ls from 'ls';
import { localizedErrDict } from 'defs';
import ErrorWithCode from 'lib/errorWithCode';
import LoadingStatus from 'lib/loadingStatus';
import AlertModule from './app/modules/alertModule';
import UserData from './app/modules/userData';
import Loader from './lib/loader';
import PageModule from 'app/modules/pageModule';

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
  alert = new AlertModule();
  page = new PageModule();
  userData = new UserData();

  get devMode(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).__qing_dev__;
  }

  async runLocalActionAsync<T>(
    loader: Loader<T>,
    cb: (status: LoadingStatus) => void,
  ): Promise<Result<T>> {
    try {
      // eslint-disable-next-line no-param-reassign
      loader.loadingStatusChanged = cb;
      const data = await loader.startAsync();
      return Result.data(data);
    } catch (err) {
      // Note: error is also handled in loader.loadingStatusChanged.
      return Result.error<T>(err);
    }
  }

  async runGlobalActionAsync<T>(
    loader: Loader<T>,
    overlayText?: string,
    cb?: (status: LoadingStatus) => void,
  ): Promise<Result<T>> {
    const { alert } = this;
    try {
      // eslint-disable-next-line no-param-reassign
      loader.loadingStatusChanged = (s) => {
        if (cb) {
          cb(s);
        }
      };
      alert.showLoadingOverlay(overlayText || ls.loading);
      const data = await loader.startAsync();
      alert.hideLoadingOverlay();
      return Result.data(data);
    } catch (err) {
      alert.hideLoadingOverlay();
      await alert.error(err.message);
      return Result.error<T>(err);
    }
  }
}

// Set global error messages to loader type.
Loader.defaultLocalizedMessageDict = localizedErrDict;

const app = new APP();
export default app;
