import ErrorWithCode from './errorWithCode';

export default class Result<TData> {
  private constructor(public error: ErrorWithCode | null, public data: TData | null) {}

  static error<T>(err: ErrorWithCode): Result<T> {
    return new Result<T>(err, null);
  }

  static data<T>(data: T): Result<T> {
    return new Result<T>(null, data);
  }

  get isSuccess(): boolean {
    return !this.error;
  }
}
