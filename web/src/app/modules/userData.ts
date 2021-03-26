/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import cookies from 'js-cookie';
import * as defs from 'defs';
import * as lib from 'lib/htmlLib';
import { keyLang } from 'sharedConstants';

const CSS_DARK_THEME = 'theme-dark';

export default class UserData {
  constructor() {
    lib.ready(() => {
      this.applyTheme(this.theme);
    });
  }

  get theme(): defs.UserTheme {
    return this.getCookieNumber(defs.Cookies.themeKey) || defs.UserTheme.light;
  }

  set theme(value: defs.UserTheme) {
    if (this.theme === value) {
      return;
    }
    this.setCookieNumber(defs.Cookies.themeKey, value);
    this.applyTheme(value);
  }

  get lang(): string {
    return this.getCookieString(keyLang);
  }

  set lang(value: string) {
    this.setCookieString(keyLang, value);
  }

  private getCookieString(key: string): string {
    return cookies.get(key) || '';
  }

  private getCookieNumber(key: string): number {
    return parseInt(this.getCookieString(key), 10) || 0;
  }

  private setCookieString(key: string, value: string) {
    cookies.set(key, value);
  }

  private setCookieNumber(key: string, value: number) {
    this.setCookieString(key, `${value}`);
  }

  private applyTheme(value: defs.UserTheme) {
    if (value === defs.UserTheme.light) {
      document.body.classList.remove(CSS_DARK_THEME);
    } else {
      document.body.classList.add(CSS_DARK_THEME);
    }
  }
}
