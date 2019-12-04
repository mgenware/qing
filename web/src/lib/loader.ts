import Status from './status';
import ls from '../ls';
import ErrorWithCode from './errorWithCode';
import { GenericError } from 'defs';

export interface APIResponse {
  code?: number;
  message?: string;
  data?: unknown;
}

export default class Loader<T> {
  static defaultLocalizedMessageDict: Map<number, string> | null = null;

  statusChanged: ((status: Status<T>) => void) | null = null;
  private isStarted = false;

  async startAsync(): Promise<T> {
    try {
      if (this.isStarted) {
        throw new Error('Loader should not be reused');
      }
      this.isStarted = true;
      this.onStatusChanged(Status.started());

      const reqURL = this.requestURL();
      const response = await fetch(reqURL, { ...this.fetchParams() });

      if (!response.ok) {
        // Handle HTTP error.
        const message =
          response.status === 404 ? ls.error404 : response.statusText;
        throw new ErrorWithCode(message);
      } else {
        // Handle server error if exists.
        const resp = (await response.json()) as APIResponse;
        if (resp.code) {
          let msg = resp.message;

          // Try getting message with message code.
          if (Loader.defaultLocalizedMessageDict) {
            const value = Loader.defaultLocalizedMessageDict.get(resp.code);
            // If we have a code to message mapping, use that message(ignore server message).
            if (value) {
              msg = ls[value];
            }
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
        errWithCode = new ErrorWithCode(
          err.message || ls.internalErr,
          GenericError,
        );
      }

      err.message = `${err.message} [${ls.request}: "${this.requestURL()}"]`;
      this.onStatusChanged(Status.failure(errWithCode));
      // Rethrow the original error.
      throw err;
    }
  }

  requestURL(): string {
    return '';
  }

  requestParams(): object {
    return {};
  }

  handleSuccess(resp: APIResponse): T {
    const data = resp.data as T;
    this.onStatusChanged(Status.success(data));
    return data;
  }

  fetchParams(): any {
    let body = '';
    const params = this.requestParams();
    if (params) {
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

  private onStatusChanged(status: Status<T>) {
    if (this.statusChanged) {
      this.statusChanged(status);
    }
  }
}
