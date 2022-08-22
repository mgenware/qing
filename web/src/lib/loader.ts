/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ls } from 'ls';
import { appdef } from '@qing/def';
import { ERR } from 'checks';
import ErrorWithCode from './errorWithCode';
import LoadingStatus from './loadingStatus';
import delay from './delay';

export interface APIResponse {
  code?: number;
  msg?: string;
  d?: unknown;
}

enum MockResponse {
  hang = 1,
  error,
}

export default class Loader<T> {
  loadingStatusChanged?: (status: LoadingStatus) => void;
  private isStarted = false;

  async startAsync(): Promise<T> {
    try {
      if (this.isStarted) {
        throw new Error('Loader should not be reused');
      }
      this.isStarted = true;
      this.onLoadingStatusChanged(LoadingStatus.working);

      const reqURL = this.requestURL();
      const response = await fetch(reqURL, { ...this.fetchParams() });

      if (!response.ok) {
        // Handle HTTP error.
        const message = response.status === 404 ? ls.resNotFound : response.statusText;
        throw new ErrorWithCode(message);
      } else {
        // Handle server error if exists.
        const resp = (await response.json()) as APIResponse;
        if (resp.code) {
          throw new ErrorWithCode(resp.msg ?? `${ls.errorCode} ${resp.code}`, resp.code);
        }

        const mockRes = this.mockResponse();
        if (mockRes) {
          // eslint-disable-next-line default-case
          switch (mockRes) {
            case MockResponse.error:
              throw new Error('Mock error');

            case MockResponse.hang:
              await delay(3600000);
              break;
          }
        }

        // No server error present on this response.
        return this.handleSuccess(resp);
      }
    } catch (err) {
      ERR(err);
      let errWithCode: ErrorWithCode;
      if (err instanceof ErrorWithCode) {
        errWithCode = err;
      } else {
        errWithCode = new ErrorWithCode(err.message || ls.internalErr, appdef.errGeneric);
      }

      errWithCode.message = `${errWithCode.message} [${ls.httpRequest}: "${this.requestURL()}"]`;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      errWithCode.stack = err.stack;
      this.onLoadingStatusChanged(LoadingStatus.error(errWithCode));
      throw errWithCode;
    }
  }

  requestURL(): string {
    return '';
  }

  requestParams(): Record<string, unknown> {
    return {
      [appdef.apiLangParam]: document.documentElement.lang,
    };
  }

  handleSuccess(resp: APIResponse): T {
    const data = resp.d as T;
    this.onLoadingStatusChanged(LoadingStatus.success);
    return data;
  }

  fetchParams(): RequestInit {
    let body = '';
    const params = this.requestParams();
    if (Object.entries(params).length) {
      body = JSON.stringify(params);
    }
    return {
      method: 'POST',
      body,
      headers: {
        'content-type': 'application/json',
      },
    };
  }

  private onLoadingStatusChanged(status: LoadingStatus) {
    if (this.loadingStatusChanged) {
      this.loadingStatusChanged(status);
    }
  }

  private mockResponse() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).__loader_res as MockResponse | undefined;
  }
}
