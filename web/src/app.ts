import AppState from './app/modules/appState';
import AlertModule from './app/modules/alertModule';
import UserData from './app/modules/userData';
import BrowserModule from './app/modules/browserModule';
import Loader from './lib/loader';
import ls from 'ls';
import { localizedErrDict } from 'defs';
import ErrorWithCode from 'lib/errorWithCode';
import LoadingStatus from 'lib/loadingStatus';

export class Result<T> {
  constructor(public error: ErrorWithCode | null, public data: T | null) {}

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

class APP {
  state = new AppState();
  alert = new AlertModule();
  browser = new BrowserModule();
  userData = new UserData(this.state, this.alert);

  get isLoggedIn(): boolean {
    return !!this.state.hasUser;
  }

  get devMode(): boolean {
    return !!(window as any).__qing_dev__;
  }

  async runLocalActionAsync<T>(
    loader: Loader<T>,
    cb: (status: LoadingStatus) => void,
  ): Promise<Result<T>> {
    try {
      loader.loadingStatusChanged = cb;
      const data = await loader.startAsync();
      return Result.data(data);
    } catch (err) {
      // Note: error is also handled in loader.loadingStatusChanged.
      return Result.error<T>(err);
    }
  }

  async runGlobalActionAsync<T>(
    loader: Loader<T>,
    overlayText?: string,
    cb?: (status: LoadingStatus) => void,
  ): Promise<Result<T>> {
    const { alert } = this;
    try {
      loader.loadingStatusChanged = s => {
        if (cb) {
          cb(s);
        }
      };
      alert.showLoadingOverlay(overlayText || ls.loading);
      const data = await loader.startAsync();
      alert.hideLoadingOverlay();
      return Result.data(data);
    } catch (err) {
      alert.hideLoadingOverlay();
      await alert.error(err.message);
      return Result.error<T>(err);
    }
  }
}

// Set global error messages to loader type.
Loader.defaultLocalizedMessageDict = localizedErrDict;

const app = new APP();
export default app;
