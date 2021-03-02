import { html, customElement, css } from 'lit-element';
import 'debug/d/injectLangEN';
import ls, { formatLS } from 'ls';
import BaseElement from 'baseElement';
import 'ui/lists/linkListView';
import langWind, { LangInfo } from './langWind';
import app from 'app';
import { linkListActiveFilledClass } from 'ui/lists/linkListView';

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
              html`<a
                href="#"
                @click=${() => this.handleLangChange(t)}
                class=${curLang === t.ID ? linkListActiveFilledClass : ''}
                >${t.Name} (${t.LocalizedName})</a
              >`,
          )}
        </link-list-view>
      </container-view>
    `;
  }

  private async handleLangChange(t: LangInfo) {
    if (t.ID === app.state.lang) {
      return;
    }
    if (
      await app.alert.confirm(ls.warning, formatLS(ls.doYouWantToChangeLangTo, t.LocalizedName))
    ) {
      app.userData.lang = t.ID;
      app.page.reload();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lang-page-view': LangPageView;
  }
}
