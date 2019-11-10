import ErrorWithCode from './errorWithCode';

export default class Status<T> {
  private constructor() {
    /* mute eslint */
  }

  static empty<T>(): Status<T> {
    return new Status<T>();
  }

  static started<T>(): Status<T> {
    const s = new Status<T>();
    s.isStarted = true;
    return s;
  }

  static success<T>(data: T | null): Status<T> {
    const s = Status.started<T>();
    s._succeeded = true;
    s._data = data;
    return s;
  }

  static failure<T>(err: ErrorWithCode): Status<T> {
    const s = Status.started<T>();
    s._error = err;
    return s;
  }

  isStarted = false;
  private _error: ErrorWithCode | null = null;
  private _data: T | null = null;
  private _succeeded = false;

  get error(): ErrorWithCode | null {
    return this._error;
  }

  get data(): T | null {
    return this._data;
  }

  get isCompleted(): boolean {
    return !!this.error || this.isSuccess;
  }

  get isWorking(): boolean {
    return this.isStarted && !this.isCompleted;
  }

  // canRestart = isNotStarted | isFailed
  get canRestart(): boolean {
    return !this.isStarted || !!this.error;
  }

  get isSuccess(): boolean {
    return this._succeeded;
  }
}
