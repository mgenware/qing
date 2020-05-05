import { html, customElement, property } from 'lit-element';
import ls from 'ls';
import BaseElement from '../baseElement';
import page from 'page';
import rs from 'routes';
import './reg/regApp';
import './signIn/signInApp';

class Page {
  constructor(public content: any) {}
}

@customElement('auth-app')
export default class AuthApp extends BaseElement {
  @property({ type: Object }) content: Page | null = null;

  set title(s: string) {
    document.title = `${s} - ${ls._siteName}`;
  }

  firstUpdated() {
    page(rs.auth.signUp, () => {
      this.content = new Page(html`<reg-app></reg-app>`);
      this.title = ls.createAnAcc;
    });
    page(rs.auth.signIn, () => {
      this.content = new Page(html`<sign-in-app></sign-in-app>`);
      this.title = ls.signIn;
    });
    page();
  }

  render() {
    const { content } = this;
    if (!content) {
      return html``;
    }
    return html`<div class="container section">${content.content}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'auth-app': AuthApp;
  }
}
