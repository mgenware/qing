import ErrorWithCode from './errorWithCode';

// Represents different states of a loading action.
export default class LoadingStatus {
  private constructor(
    public error: ErrorWithCode | null,
    public isWorking: boolean,
    public isSuccess: boolean,
  ) {}

  static error(err: ErrorWithCode): LoadingStatus {
    return new LoadingStatus(err, false, false);
  }

  static get working(): LoadingStatus {
    return new LoadingStatus(null, true, false);
  }

  static get success(): LoadingStatus {
    return new LoadingStatus(null, false, true);
  }

  static get empty(): LoadingStatus {
    return new LoadingStatus(null, false, false);
  }

  get hasError(): boolean {
    return !!this.error;
  }

  get isEmpty(): boolean {
    return !this.isWorking && !this.isSuccess && !this.hasError;
  }
}
