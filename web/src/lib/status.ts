import ErrorWithCode from './errorWithCode';

export default class Status {
  static started(): Status {
    const s = new Status();
    s.start();
    return s;
  }

  static success(data?: object): Status {
    const s = Status.started();
    s.succeeded(data);
    return s;
  }

  static failure(err: ErrorWithCode): Status {
    const s = Status.started();
    s.failed(err);
    return s;
  }

  isStarted: boolean = false;
  private _succeeded = false;
  private _data: object | null = null;
  private _error: ErrorWithCode | null = null;

  get data(): object | null {
    return this._data;
  }

  get error(): ErrorWithCode | null {
    return this._error;
  }

  start() {
    this.isStarted = true;
  }

  succeeded(data?: object) {
    if (data) {
      this._data = data;
    }
    this._succeeded = true;
  }

  failed(err: ErrorWithCode) {
    this._error = err;
  }

  get isCompleted(): boolean {
    return this.isError || this.isSuccess;
  }

  get isWorking(): boolean {
    return this.isStarted && !this.isCompleted;
  }

  // canRestart = isNotStarted | isFailed
  get canRestart(): boolean {
    return !this.isStarted || this.isError;
  }

  get isError(): boolean {
    return !!this.error;
  }

  get isSuccess(): boolean {
    return this._succeeded;
  }
}
