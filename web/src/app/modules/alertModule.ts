import ls from 'ls';
import { renderTemplateResult } from 'lib/htmlLib';
import { html } from 'lit-element';
import 'ui/status/spinnerView';
import 'qing-dialog-component';
import { QingDialog, DialogButton, iconElement, IconType } from 'qing-dialog-component';

const dialogContainerID = '__global_dialog_container';
const spinnerContainerID = '__global_spinner_container';

export default class AlertModule {
  async error(message: string, title?: string): Promise<void> {
    await this.showModalAsync({
      message,
      title: title || ls.error,
      buttons: ['ok'],
      icon: 'error',
      defaultButtonIndex: 0,
      cancelButtonIndex: 0,
    });
  }

  async successToast(title: string): Promise<void> {
    await this.showModalAsync({
      message: '',
      title: title || ls.error,
      buttons: [],
      icon: 'success',
      timeout: 2000,
    });
  }

  async confirm(title: string, message: string, hasCancelButton = false): Promise<boolean | null> {
    const buttons = ['yes', 'no'];
    // Default button is "No".
    let defaultBtnIdx = 1;
    if (hasCancelButton) {
      buttons.push('no');
      defaultBtnIdx = 2;
    }
    const button = await this.showModalAsync({
      message,
      title,
      buttons,
      icon: 'warning',
      defaultButtonIndex: defaultBtnIdx,
      cancelButtonIndex: defaultBtnIdx,
    });
    if (button?.type === 'yes') {
      return true;
    }
    if (button?.type === 'no') {
      return false;
    }
    // User chose "Cancel".
    return null;
  }

  async warnUnsavedChanges(): Promise<boolean> {
    return (
      (await this.confirm(ls.doYouWantDoDiscardYourChanges, ls.youHaveNotSavedYourChanges)) ?? false
    );
  }

  // Shows the global loading spinner.
  showLoadingOverlay(text: string) {
    this.hideLoadingOverlay();

    const template = html`<spinner-view .fullScreen=${true}>${text}</spinner-view>`;
    renderTemplateResult(spinnerContainerID, template);
  }

  // Hides the global loading spinner.
  hideLoadingOverlay() {
    renderTemplateResult(spinnerContainerID, null);
  }

  private showModalAsync(args: {
    message: string;
    title: string;
    buttons: (string | DialogButton)[];
    icon: IconType;
    defaultButtonIndex?: number;
    cancelButtonIndex?: number;
    timeout?: number;
  }): Promise<DialogButton> {
    return new Promise<DialogButton>((resolve, reject) => {
      const template = html`<qing-dialog
        open
        .buttons=${args.buttons}
        .defaultButtonIndex=${args.defaultButtonIndex ?? -1}
        .cancelButtonIndex=${args.cancelButtonIndex ?? -1}
        @closed=${(e: CustomEvent<DialogButton>) => {
          resolve(e.detail);
          renderTemplateResult(dialogContainerID, null);
        }}
      >
        <h2 style="margin: 1rem 0">
          ${args.icon
            ? iconElement({
                type: args.icon,
                size: 48,
                color: '' /** Set default to an empty value, we'll style colors in CSS */,
              })
            : ''}
          <span style="vertical-align: middle">${args.title}</span>
        </h2>
        ${args.message ? html`<p>${args.message}</p>` : ''}
      </qing-dialog>`;

      const element = renderTemplateResult<QingDialog>(dialogContainerID, template);
      if (!element) {
        reject(new Error('Unexpected empty modal element'));
        return;
      }
      const { timeout } = args;
      if (timeout && timeout > 0) {
        setTimeout(() => {
          element.open = false;
        }, timeout);
      }
    });
  }
}
