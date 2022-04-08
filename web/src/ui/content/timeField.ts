/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html } from 'll';
import * as lp from 'lit-props';
import ls from 'ls';

var units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

var rtf = new Intl.RelativeTimeFormat(ls._lang, { numeric: 'auto' });

@customElement('time-field')
export class TimeField extends BaseElement {
  @lp.string createdAt = '';
  @lp.string modifiedAt = '';

  render() {
    const { createdAt, modifiedAt } = this;

    let content = this.formatDate(createdAt);
    if (modifiedAt !== createdAt) {
      content += ` [${ls.editedAt} ${this.formatDate(modifiedAt)}]`;
    }
    return html`<small class="is-secondary">${content}</small>`;
  }

  private formatDate(s: string): string {
    try {
      const date = this.stringToDate(s);
      return this.formatRelativeDate(date);
    } catch (err) {
      return '[Invalid date]';
    }
  }

  private stringToDate(str: string): Date {
    return new Date(str);
  }

  // https://stackoverflow.com/questions/6108819/javascript-timestamp-to-relative-time?answertab=modifieddesc#tab-top
  private formatRelativeDate(date: Date) {
    var elapsed = date.getTime() - new Date().getTime();

    // "Math.abs" accounts for both "past" & "future" scenarios
    for (var [k, v] of Object.entries(units)) {
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
