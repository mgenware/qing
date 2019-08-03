import AppState from './appState';
import Alert from './alert';
import ls from 'ls';

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

  async warnUnsavedChangesAsync(): Promise<boolean> {
    return await this.alert.confirm(WARN_CHANGES);
  }
}
