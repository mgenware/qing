import { html, customElement, property, LitElement } from 'lit-element';
import ls from 'ls';
import { formatRelative, Locale } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import app from 'app';

@customElement('time-field')
export class TimeField extends LitElement {
  @property() createdAt = '';
  @property() modifiedAt = '';
  locale!: Locale;

  firstUpdated() {
    const lang = app.state.lang;
    this.locale = lang === 'cs' ? zhCN : enUS;
    const content = this.textContent;
    // Load time properties from content if it's present.
    if (content) {
      const parts = content.split('|');
      if (parts.length > 0) {
        this.createdAt = this.formatDate(parts[0]);
      }
      if (parts.length > 1) {
        this.modifiedAt = this.formatDate(parts[1]);
      }
    }
  }

  render() {
    const { createdAt, modifiedAt } = this;

    let content = createdAt;
    if (!createdAt && modifiedAt !== createdAt) {
      content += ` [${ls.editedAt} ${modifiedAt}]`;
    }
    return html`
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

declare global {
  interface HTMLElementTagNameMap {
    'time-field': TimeField;
  }
}
