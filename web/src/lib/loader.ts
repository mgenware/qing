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
  statusChanged: ((status: Status) => void) | null = null;
  private _currentStatus: Status | null = null;

  constructor() {
    this._currentStatus = Status.unstarted();
  }

  async startAsync(): Promise<T> {
    try {
      if (this._currentStatus && this._currentStatus.isStarted) {
        throw new Error('Loader should not be reused');
      }
      this.onStatusChanged(Status.started());

      let body = '';
      const params = this.requestParams();
      if (params) {
        body = JSON.stringify(params);
      }
      const reqURL = this.requestURL();
      const response = await fetch(reqURL, {
        method: 'POST',
        body,
        headers: {
          'content-type': 'application/json',
          credentials: 'same-origin',
        },
      });

      // Handle HTTP status errors
      if (!response.ok) {
        const message =
          response.status === 404 ? ls.error404 : response.statusText;

        throw new ErrorWithCode(message);
      } else {
        const resp = (await response.json()) as APIResponse;

        // Check server return error
        if (resp.code) {
          const message = resp.message || `Error code ${resp.code}`;
          throw new ErrorWithCode(message, resp.code);
        }
        return this.handleSuccess(resp);
      }
    } catch (err) {
      let errWithCode: ErrorWithCode;
      if (err instanceof ErrorWithCode) {
        errWithCode = err;
      } else {
        errWithCode = new ErrorWithCode(err.message, GenericError);
      }
      err.message = `${
        err.message
      } [Error processing request "${this.requestURL()}"]`;
      this.onStatusChanged(Status.failure(errWithCode));
      // Rethrow the original error
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
    this.onStatusChanged(Status.success());
    return data;
  }

  private onStatusChanged(status: Status) {
    this._currentStatus = status;
    if (this.statusChanged) {
      this.statusChanged(status);
    }
  }
}
