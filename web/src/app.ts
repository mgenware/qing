import AppState from './app/modules/appState';
import Alert from './app/modules/alert';
import UserData from './app/modules/userData';
import Vue from 'vue';
import Loader from '@/lib/loader';
import Router from 'vue-router';

export class LoaderResult {
  constructor(public error: Error | undefined, public data: object) {}

  get isError(): boolean {
    return !!this.error;
  }

  get isSuccess(): boolean {
    return !this.isError;
  }
}

// tslint:disable-next-line: class-name
export class _APP {
  state = new AppState();
  alert = new Alert();
  userData = new UserData(this.state, this.alert);

  get isLoggedIn(): boolean {
    return !!this.state.user;
  }

  mountComponent(
    selector: string | HTMLElement,
    instance: any,
    props?: object,
    router?: Router,
  ) {
    new Vue({
      router,
      render: h =>
        h(instance, {
          props,
        }),
    }).$mount(selector);
  }

  async runActionAsync(
    loader: Loader,
    overlayText: string,
    errorDict?: { [key: number]: string },
  ): Promise<LoaderResult> {
    const { alert } = this;
    errorDict = errorDict || {};
    try {
      alert.showLoadingOverlay(overlayText);
      const result = await loader.startAsync();
      alert.hideLoadingOverlay();

      return new LoaderResult(undefined, result);
    } catch (ex) {
      alert.hideLoadingOverlay();
      let message;
      if (ex.code && errorDict[ex.code]) {
        message = errorDict[ex.code];
      } else {
        message = ex.message;
      }
      await alert.error(message);

      return new LoaderResult(ex, {});
    }
  }
}

const app = new _APP();
export default app;
