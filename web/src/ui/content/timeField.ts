/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, property } from 'll';
import ls from 'ls';

const units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

const rtf = new Intl.RelativeTimeFormat(ls.qingLang, { numeric: 'auto' });

@customElement('time-field')
export class TimeField extends BaseElement {
  @property() createdAt = '';
  @property() modifiedAt = '';

  override render() {
    const { createdAt, modifiedAt } = this;

    let [dateString, date] = this.formatDate(createdAt);
    if (modifiedAt !== createdAt) {
      const [modDateString] = this.formatDate(modifiedAt);
      dateString += ` [${ls.editedAt} ${modDateString}]`;
    }
    return html`<small class="is-secondary" title=${date?.toLocaleString() ?? ''}
      >${dateString}</small
    >`;
  }

  private formatDate(s: string): [string, Date | null] {
    try {
      const date = this.stringToDate(s);
      return [this.formatRelativeDate(date), date];
    } catch (err) {
      return [ls.invalidDate, null];
    }
  }

  private stringToDate(str: string): Date {
    return new Date(str);
  }

  // https://stackoverflow.com/questions/6108819/javascript-timestamp-to-relative-time?answertab=modifieddesc#tab-top
  private formatRelativeDate(date: Date) {
    const elapsed = date.getTime() - new Date().getTime();

    // "Math.abs" accounts for both "past" & "future" scenarios
    for (const [k, v] of Object.entries(units)) {
      if (Math.abs(elapsed) > v || k === 'second') {
        return rtf.format(Math.round(elapsed / v), k as Intl.RelativeTimeFormatUnit);
      }
    }
    return '';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'time-field': TimeField;
  }
}
