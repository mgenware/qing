import AppState from './appState';
import Alert from './alertModule';
import ls from 'ls';
import cookies from 'js-cookie';
import * as defs from 'defs';
import * as lib from 'lib/htmlLib';

const WARN_CHANGES = ls.unsavedChangesWarning;
const CSS_DARK_THEME = 'theme-dark';

export default class UserData {
  private alert: Alert;

  constructor(_: AppState, alert: Alert) {
    this.alert = alert;
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

  async warnUnsavedChangesAsync(): Promise<boolean | null> {
    return await this.alert.confirm(WARN_CHANGES);
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
