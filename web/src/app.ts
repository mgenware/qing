import AppState from './app/modules/AppState';
import Vue from 'vue';
import Router from 'vue-router';

// tslint:disable-next-line: class-name
export class _APP {
  state: AppState;

  constructor() {
    const state = new AppState();
    this.state = state;
  }

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
}

const app = new _APP();
export default app;
