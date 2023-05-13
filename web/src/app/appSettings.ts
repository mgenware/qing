/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import cookies from 'js-cookie';
import * as def from 'def.js';
import { appdef } from '@qing/def';
import * as brLib from 'lib/brLib.js';
import appState from 'app/appState.js';
import appStateName from 'app/appStateName.js';

const CSS_DARK_THEME = 'theme-dark';

export default class AppSettings {
  #systemDarkTheme = false;

  private constructor() {
    /** Private ctor */
  }

  static #instance?: AppSettings;

  static get instance() {
    if (!AppSettings.#instance) {
      AppSettings.#instance = new AppSettings();
      AppSettings.#instance.init();
    }
    return AppSettings.#instance;
  }

  static isDarkTheme() {
    return document.body.classList.contains(CSS_DARK_THEME);
  }

  get theme(): def.UserTheme {
    return this.getCookieNumber(def.Cookies.themeKey) || def.UserTheme.light;
  }

  set theme(value: def.UserTheme) {
    if (this.theme === value) {
      return;
    }
    this.setCookieNumber(def.Cookies.themeKey, value);
    this.updateTheme();
    appState.set(appStateName.themeOption, value);
  }

  get lang(): string {
    return this.getCookieString(appdef.keyLang);
  }

  set lang(value: string) {
    this.setCookieString(appdef.keyLang, value);
  }

  // Called only once by `getInstance`.
  private init() {
    brLib.mediaQueryHandler('(prefers-color-scheme: dark)', (dark) => {
      this.#systemDarkTheme = dark;
      // Will be called as well on first call to `mediaQueryHandler`.
      this.updateTheme();
    });
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

  private updateTheme() {
    const { theme } = this;
    let dark: boolean;
    if (theme !== def.UserTheme.device) {
      dark = theme === def.UserTheme.dark;
    } else {
      dark = this.#systemDarkTheme;
    }
    if (dark) {
      document.body.classList.add(CSS_DARK_THEME);
    } else {
      document.body.classList.remove(CSS_DARK_THEME);
    }
    appState.set(appStateName.isDarkTheme, dark);
  }
}
