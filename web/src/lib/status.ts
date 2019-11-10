import ErrorWithCode from './errorWithCode';

export default class Status {
  private constructor() {
    /* mute eslint */
  }

  static unstarted(): Status {
    return new Status();
  }

  static started(): Status {
    const s = new Status();
    s.isStarted = true;
    return s;
  }

  static success(): Status {
    const s = Status.started();
    s._succeeded = true;
    return s;
  }

  static failure(err: ErrorWithCode): Status {
    const s = Status.started();
    s._error = err;
    return s;
  }

  isStarted = false;
  private _succeeded = false;
  private _error: ErrorWithCode | null = null;

  get error(): ErrorWithCode | null {
    return this._error;
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
