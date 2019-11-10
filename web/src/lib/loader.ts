import Status from './status';
import Result from './result';
import ls from '../ls';
import ErrorWithCode from './errorWithCode';
import { GenericError } from 'defs';

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
        const result = (await response.json()) as Result;

        // Check server return error
        if (result.code) {
          const message = result.message || `Error code ${result.code}`;
          throw new ErrorWithCode(message, result.code);
        }
        return this.handleSuccess(result);
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

  handleSuccess(result: Result): T {
    const data = result.data as T;
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
