import Status from './status';
import Result from './result';
import ls from '../ls';
import ErrorWithCode, { GENERIC_CODE } from './errorWithCode';

export default class Loader {
  statusChanged: ((status: Status) => void) | null = null;
  createPayloadCallback: ((raw?: object) => object | undefined) | null = null;
  private _currentStatus: Status | null = null;

  constructor() {
    this._currentStatus = new Status();
  }

  async startAsync(): Promise<object> {
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
        errWithCode = new ErrorWithCode(err.message, GENERIC_CODE);
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

  handleSuccess(result: Result): object {
    const data = this.onCreatePayload(result.data);
    this.onStatusChanged(Status.success(data));
    return data || {};
  }

  createPayload(data?: object): object | undefined {
    return data;
  }

  private onCreatePayload(data?: object): object | undefined {
    if (this.createPayloadCallback) {
      return this.createPayloadCallback(data);
    }
    return this.createPayload(data);
  }

  private onStatusChanged(status: Status) {
    this._currentStatus = status;
    if (this.statusChanged) {
      this.statusChanged(status);
    }
  }
}
