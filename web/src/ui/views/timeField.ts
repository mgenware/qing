import { html, customElement, css, property, LitElement } from 'lit-element';
import ls from '../../ls';
import { formatRelative, Locale } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import app from '../../app';

@customElement('time-field')
export class TimeField extends LitElement {
  static get styles() {
    return css``;
  }

  @property() src = '';
  @property() edited = '';
  locale!: Locale;

  firstUpdated() {
    const lang = app.state.lang;
    this.locale = lang === 'cs' ? zhCN : enUS;
  }

  render() {
    const { src, edited } = this;
    if (src === edited) {
      return html`
        ${this.formatDate(src)}
      `;
    }
    return html`
      <span>
        ${this.formatDate(src)} [${ls.editedAt} ${this.formatDate(edited)}]
      </span>
    `;
  }

  private formatDate(s: string): string {
    const date = this.stringToDate(s);
    if (date) {
      return formatRelative(date, new Date(), { locale: this.locale });
    }
    return '[Invalid date]';
  }

  private stringToDate(str: string): Date | null {
    try {
      return new Date(str);
    } catch (e) {
      return null;
    }
  }
}
