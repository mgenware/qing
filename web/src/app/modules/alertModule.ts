import ls from 'ls';
import { renderTemplateResult } from 'lib/htmlLib';
import 'ui/com/spinnerView';
import 'qing-dialog-component';
import {
  QingDialog,
  IsOpenChangedArgs,
  DialogButton,
  iconElement,
  IconType,
} from 'qing-dialog-component';
import { html } from 'lit-element';
const dialogContainer = '__global_dialog_container';
const spinnerContainer = '__global_spinner_container';

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

  async confirm(message: string, hasCancelButton = false): Promise<boolean | null> {
    const buttons = ['yes', 'no'];
    // Default button is "No".
    let defaultBtnIdx = 1;
    if (hasCancelButton) {
      buttons.push('no');
      defaultBtnIdx = 2;
    }
    const { button } = await this.showModalAsync({
      message: '',
      title: message || ls.warning,
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

  // Shows the global loading spinner.
  showLoadingOverlay(text: string) {
    this.hideLoadingOverlay();

    const template = html`<spinner-view .fullScreen=${true}>${text}</spinner-view>`;
    renderTemplateResult(spinnerContainer, template);
  }

  // Hides the global loading spinner.
  hideLoadingOverlay() {
    renderTemplateResult(spinnerContainer, null);
  }

  private showModalAsync(args: {
    message: string;
    title: string;
    buttons: (string | DialogButton)[];
    icon: IconType;
    defaultButtonIndex?: number;
    cancelButtonIndex?: number;
    timeout?: number;
  }): Promise<IsOpenChangedArgs> {
    return new Promise<IsOpenChangedArgs>((resolve, reject) => {
      const template = html`<qing-dialog
        .isOpen=${true}
        .buttons=${args.buttons}
        .defaultButtonIndex=${args.defaultButtonIndex ?? -1}
        .cancelButtonIndex=${args.cancelButtonIndex ?? -1}
        @closed=${(e: CustomEvent<IsOpenChangedArgs>) => {
          resolve(e.detail);
          renderTemplateResult(dialogContainer, null);
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
        ${args.message ? html`<div>${args.message}</div>` : ''}
      </qing-dialog>`;

      const element = renderTemplateResult(dialogContainer, template) as QingDialog;
      if (!element) {
        reject(new Error('Unexpected empty modal element'));
        return;
      }
      const { timeout } = args;
      if (timeout && timeout > 0) {
        setTimeout(() => {
          element.isOpen = false;
        }, timeout);
      }
    });
  }
}
