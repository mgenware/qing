import AppState from './appState';
import Alert from './alertModule';
import ls from 'ls';
import cookies from 'js-cookie';
import * as defs from 'defs';

const WARN_CHANGES = ls.unsavedChangesWarning;

export default class UserData {
  // tslint:disable-next-line variable-name
  private _hasUnsavedChanges = false;
  private alert: Alert;

  constructor(_: AppState, alert: Alert) {
    this.alert = alert;

    window.onbeforeunload = () => {
      if (this.hasUnsavedChanges) {
        return WARN_CHANGES;
      }
      return undefined;
    };
  }

  // --- unsaved changes ---
  setUnsavedChanges(val: boolean) {
    this._hasUnsavedChanges = val;
  }

  get hasUnsavedChanges(): boolean {
    return this._hasUnsavedChanges;
  }

  get theme(): defs.UserTheme {
    return this.getCookieNumber(defs.Cookies.themeKey) || defs.UserTheme.light;
  }

  set theme(value: defs.UserTheme) {
    this.setCookieNumber(defs.Cookies.themeKey, value);
  }

  async warnUnsavedChangesAsync(): Promise<boolean> {
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
}
