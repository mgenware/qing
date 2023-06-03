/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { appDef } from '@qing/def';
import { ERR } from 'checks.js';
import ErrorWithCode from './errorWithCode.js';
import LoadingStatus from './loadingStatus.js';
import delay from './delay.js';

const devLoaderResName = '__loader_res';

export interface APIResponse {
  c?: number;
  m?: string;
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
        const message =
          response.status === 404 ? globalThis.coreLS.resNotFound : response.statusText;
        throw new ErrorWithCode(message);
      } else {
        // Handle server error if exists.
        const resp = (await response.json()) as APIResponse;
        if (resp.c) {
          throw new ErrorWithCode(resp.m ?? `${globalThis.coreLS.errorCode} ${resp.c}`, resp.c);
        }

        const mockRes = this.mockResponse();
        if (mockRes) {
          // eslint-disable-next-line default-case
          switch (mockRes) {
            case MockResponse.error:
              // One-off error.
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (window as any)[devLoaderResName] = undefined;
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
        errWithCode = new ErrorWithCode(
          err.message || globalThis.coreLS.internalErr,
          appDef.errGeneric,
        );
      }

      const dbgMsg = `${errWithCode.message} [${
        globalThis.coreLS.httpRequest
      }: "${this.requestURL()}"]`;

      // eslint-disable-next-line no-console
      console.log(dbgMsg);
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
      [appDef.apiLangParam]: document.documentElement.lang,
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
    return (window as any)[devLoaderResName] as MockResponse | undefined;
  }
}
