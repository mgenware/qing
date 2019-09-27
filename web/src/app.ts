import AppState from './app/modules/appState';
import AlertModule from './app/modules/alertModule';
import UserData from './app/modules/userData';
import BrowserModule from './app/modules/browserModule';
import Loader from './lib/loader';
import ls from 'ls';
import * as defs from 'defs';

export class LoaderResult<T> {
  constructor(public error: Error | undefined, public result: T | null) {}

  get isError(): boolean {
    return !!this.error;
  }

  get isSuccess(): boolean {
    return !this.isError;
  }

  // Call this after isSuccess().
  getResult(): T {
    return this.result as T;
  }
}

// tslint:disable-next-line: class-name
export class _APP {
  state = new AppState();
  alert = new AlertModule();
  browser = new BrowserModule();
  userData = new UserData(this.state, this.alert);

  get isLoggedIn(): boolean {
    return !!this.state.hasUser;
  }

  async runActionAsync<T>(
    loader: Loader<T>,
    overlayText?: string,
    errorDict?: Map<number, string>,
  ): Promise<LoaderResult<T>> {
    const { alert } = this;
    errorDict = errorDict;
    try {
      alert.showLoadingOverlay(overlayText || ls.loading);
      const result = await loader.startAsync();
      alert.hideLoadingOverlay();

      return new LoaderResult(undefined, result);
    } catch (ex) {
      alert.hideLoadingOverlay();
      let message;
      const { code } = ex;
      if (code) {
        if (errorDict && errorDict.get(code)) {
          message = errorDict.get(code);
        } else if (defs.errLSDict.get(code)) {
          const lsKey = defs.errLSDict.get(code) as string;
          message = ls[lsKey];
        } else {
          message = ex.message;
        }
      } else {
        message = ex.message;
      }
      await alert.error(message);
      return new LoaderResult<T>(ex, null);
    }
  }
}

const app = new _APP();
export default app;
