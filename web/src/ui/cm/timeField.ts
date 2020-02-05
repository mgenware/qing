import { html, customElement, property } from 'lit-element';
import ls from 'ls';
import { formatRelative, Locale } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import app from 'app';
import BaseElement from 'baseElement';

@customElement('time-field')
export class TimeField extends BaseElement {
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
        this.createdAt = parts[0];
      }
      if (parts.length > 1) {
        this.modifiedAt = parts[1];
      }
    }
  }

  render() {
    const { createdAt, modifiedAt } = this;

    let content = this.formatDate(createdAt);
    if (modifiedAt) {
      content += ` ${ls.editedAt} ${this.formatDate(modifiedAt)}`;
    }
    return html`
      <small class="is-secondary" style="visibility: visible">
        ${content}
      </small>
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
