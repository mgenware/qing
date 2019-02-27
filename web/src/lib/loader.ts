import Status from './status';
import Result from './result';
import ls from '../ls';
import ErrorWithCode from './errorWithCode';
import { constructURL } from './htmlLib';

export default class Loader {
  status: Status;
  createPayloadCallback: ((raw?: object) => object | undefined) | null = null;
  private _result: Result | null = null;

  get result(): Result | null {
    return this._result;
  }

  get resultData(): object | null {
    if (this.result) {
      return this.result || null;
    }
    return null;
  }

  constructor() {
    this.status = new Status();
  }

  async startAsync(settledCb?: () => void): Promise<object> {
    if (this.status.isStarted) {
      throw new Error('Loader should not be reused');
    }
    this.status.start();

    let body = '';
    const params = this.requestParams();
    if (params) {
      body = constructURL(params);
    }
    const response = await fetch(this.requestURL(), {
      method: 'POST',
      body,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        credentials: 'same-origin',
      },
    });

    // unlike a finally statement, settled callback is called before the catch block
    // Suppose we need to something regardless of the result, e.g. hide the loading spinner, the problem is,
    // finally is called after catch, but you need to do this immediately when it completes,
    // this is where settled callback kicks in.
    if (settledCb) {
      settledCb();
    }

    // Handle HTTP status errors
    if (!response.ok) {
      const message =
        response.status === 404 ? ls.error404 : response.statusText;

      throw new ErrorWithCode(message);
    } else {
      const result = (await response.json()) as Result;
      this._result = result;

      // Check server return error
      if (result.code) {
        const message = result.message || `Error code ${result.code}`;
        throw new ErrorWithCode(message, result.code);
      }
      return this.handleSuccess(result);
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
    this.status.succeeded(data);
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
}
