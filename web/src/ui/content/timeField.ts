/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, property, BaseElement } from 'll';
import ls from 'ls';
import { formatRelative, Locale } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';

@customElement('time-field')
export class TimeField extends BaseElement {
  @property() createdAt = '';
  @property() modifiedAt = '';
  locale?: Locale;

  firstUpdated() {
    const curLang = ls._lang;
    // TODO: remove hardcoded lang codes.
    this.locale = curLang === 'zh-Hans' ? zhCN : enUS;
  }

  render() {
    const { createdAt, modifiedAt } = this;

    let content = this.formatDate(createdAt);
    if (modifiedAt !== createdAt) {
      content += ` [${ls.editedAt} ${this.formatDate(modifiedAt)}]`;
    }
    return html` <small class="is-secondary"> ${content} </small> `;
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
