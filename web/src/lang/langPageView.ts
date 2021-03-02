import { html, customElement, css } from 'lit-element';
import 'debug/d/injectLangEN';
import ls from 'ls';
import BaseElement from 'baseElement';
import 'ui/lists/linkListView';
import langWind, { LangInfo } from './langWind';
import app from 'app';
import { linkListActiveClass } from 'ui/lists/linkListView';

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

  tags: LangInfo[] = [];

  constructor() {
    super();

    this.tags = langWind.Langs;
  }

  render() {
    const curLang = app.state.lang;
    return html`
      <container-view>
        <h2>${ls.langSettings}</h2>
        <hr />
        <link-list-view>
          ${this.tags.map(
            (t) =>
              html`<a href="#" class=${curLang === t.ID ? linkListActiveClass : ''}
                >${t.Name} (${t.LocalizedName})</a
              >`,
          )}
        </link-list-view>
      </container-view>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lang-page-view': LangPageView;
  }
}
