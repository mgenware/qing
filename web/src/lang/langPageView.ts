import { html, customElement, css } from 'lit-element';
import 'debug/d/injectLangEN';
import ls from 'ls';
import BaseElement from 'baseElement';

@customElement('lang-page-view')
export class LangPageView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  render() {
    return html`
      <container-view>
        <h2>${ls.langSettings}</h2>
        <hr />
      </container-view>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lang-page-view': LangPageView;
  }
}
