import { html, customElement, property, LitElement } from 'lit-element';
import ls from 'ls';
import { formatRelative, Locale } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import app from 'app';

@customElement('time-field')
export class TimeField extends LitElement {
  @property() created = '';
  @property() edited = '';
  locale!: Locale;

  firstUpdated() {
    const lang = app.state.lang;
    this.locale = lang === 'cs' ? zhCN : enUS;
    const content = this.textContent;
    if (content) {
      const parts = content.split('|');
      if (parts.length > 0) {
        this.created = this.formatDate(parts[0]);
      }
      if (parts.length > 1) {
        this.edited = this.formatDate(parts[1]);
      }
    }
  }

  render() {
    const { created, edited } = this;

    let content = created;
    if (!created && edited !== created) {
      content += ` [${ls.editedAt} ${edited}]`;
    }
    return html`
      <!-- Set visibility to visible cuz this component is inherently hidden, and only shows when its content is ready -->
      <span style="visibility: visible">
        ${content}
      </span>
    `;
  }

  private formatDate(s: string): string {
    try {
      const date = this.stringToDate(s);
      return formatRelative(date, new Date(), { locale: this.locale });
    } catch (err) {
      return '[Invalid date]';
    }
  }

  private stringToDate(str: string): Date {
    return new Date(str);
  }
}
