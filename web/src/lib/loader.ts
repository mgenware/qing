import { ls, formatLS, getLSByKey } from 'ls';
import { errGeneric } from 'sharedConstants';
import ErrorWithCode from './errorWithCode';
import LoadingStatus from './loadingStatus';

export interface APIResponse {
  code?: number;
  message?: string;
  data?: unknown;
}

export default class Loader<T> {
  static defaultLocalizedMessageDict?: Map<number, string>;
  localizedMessageDict?: Map<number, string>;

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
          response.status === 404
            ? formatLS(ls.pPageNotFound, window.location.href)
            : response.statusText;
        throw new ErrorWithCode(message);
      } else {
        // Handle server error if exists.
        const resp = (await response.json()) as APIResponse;
        if (resp.code) {
          let msg = resp.message;

          // If we have a localized message associated with the response code,
          // use that message(ignore response message).
          const localizedMsgKey = this.getLocalizedMessage(resp.code);
          if (localizedMsgKey) {
            msg = getLSByKey(localizedMsgKey);
          }
          // Fallback to default message.
          if (!msg) {
            msg = `${ls.errorCode} ${resp.code}`;
          }
          throw new ErrorWithCode(msg, resp.code);
        }
        // No server error present on this response.
        return this.handleSuccess(resp);
      }
    } catch (err) {
      let errWithCode: ErrorWithCode;
      if (err instanceof ErrorWithCode) {
        errWithCode = err;
      } else {
        errWithCode = new ErrorWithCode(err.message ?? ls.internalErr, errGeneric);
      }

      errWithCode.message = `${errWithCode.message} [${ls.request}: "${this.requestURL()}"]`;
      errWithCode.stack = err.stack;
      this.onLoadingStatusChanged(LoadingStatus.error(errWithCode));
      throw errWithCode;
    }
  }

  requestURL(): string {
    return '';
  }

  requestParams(): unknown {
    return {};
  }

  handleSuccess(resp: APIResponse): T {
    const data = resp.data as T;
    this.onLoadingStatusChanged(LoadingStatus.success);
    return data;
  }

  fetchParams(): RequestInit {
    let body = '';
    const params = this.requestParams();
    if (params !== undefined) {
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

  private getLocalizedMessage(code: number): string | undefined {
    return this.localizedMessageDict?.get(code) ?? Loader.defaultLocalizedMessageDict?.get(code);
  }
}
