import AppState from './app/modules/appState';
import AlertModule from './app/modules/alertModule';
import UserData from './app/modules/userData';
import BrowserModule from './app/modules/browserModule';
import Loader from './lib/loader';
import ls from 'ls';
import Status from 'lib/status';
import { localizedErrDict } from 'defs';

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
    cb: (result: Status<T>) => void,
  ) {
    try {
      loader.statusChanged = cb;
      await loader.startAsync();
    } catch (err) {
      // Error will be handled in loader.statusChanged
    }
  }

  async runGlobalActionAsync<T>(
    loader: Loader<T>,
    overlayText?: string,
    cb?: (result: Status<T>) => void,
  ): Promise<Status<T>> {
    const { alert } = this;
    let status = Status.empty<T>();
    try {
      loader.statusChanged = s => {
        status = s;
        if (cb) {
          cb(s);
        }
      };
      alert.showLoadingOverlay(overlayText || ls.loading);
      await loader.startAsync();
      alert.hideLoadingOverlay();
    } catch (ex) {
      alert.hideLoadingOverlay();
      await alert.error(ex.message);
    }
    return status;
  }
}

// Set global error messages to loader type.
Loader.defaultLocalizedMessageDict = localizedErrDict;

const app = new APP();
export default app;
