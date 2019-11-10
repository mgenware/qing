import AppState from './app/modules/appState';
import AlertModule from './app/modules/alertModule';
import UserData from './app/modules/userData';
import BrowserModule from './app/modules/browserModule';
import Loader from './lib/loader';
import ls from 'ls';
import * as defs from 'defs';
import Status from 'lib/status';

class APP {
  state = new AppState();
  alert = new AlertModule();
  browser = new BrowserModule();
  userData = new UserData(this.state, this.alert);

  get isLoggedIn(): boolean {
    return !!this.state.hasUser;
  }

  async runLocalActionAsync<T>(
    loader: Loader<T>,
    cb: (result: Status<T>) => void,
  ) {
    try {
      cb(Status.started<T>());
      const data = await loader.startAsync();
      cb(Status.success<T>(data));
    } catch (err) {
      cb(Status.failure<T>(err));
    }
  }

  async runGlobalActionAsync<T>(
    loader: Loader<T>,
    overlayText?: string,
    errorDict?: Map<number, string>,
  ): Promise<Status<T>> {
    const { alert } = this;
    errorDict = errorDict;
    try {
      alert.showLoadingOverlay(overlayText || ls.loading);
      const data = await loader.startAsync();
      alert.hideLoadingOverlay();

      return Status.success(data);
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
      return Status.failure(ex);
    }
  }
}

const app = new APP();
export default app;
