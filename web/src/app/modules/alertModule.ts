import escapeHTML from 'escape-html';
import ls from 'ls';
import {
  parseDOMString,
  removeElement,
  renderTemplateResult,
} from 'lib/htmlLib';
import 'ui/cm/spinnerView';
import 'qing-dialog-component';
import {
  QingDialog,
  IsOpenChangedArgs,
  DialogButton,
  iconElement,
  IconType,
} from 'qing-dialog-component';
import { html } from 'lit-element';
const dialogContainerID = '__dialog_container';
const SpinnerID = '__spinner_main';

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

  async confirm(
    message: string,
    hasCancelButton = false,
  ): Promise<boolean | null> {
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
    const element = parseDOMString(this.getSpinnerHTML(text));
    if (element) {
      document.body.appendChild((element as unknown) as Node);
    }
  }

  // Hides the global loading spinner.
  hideLoadingOverlay() {
    const element = document.getElementById(SpinnerID);
    if (element) {
      removeElement(element);
    }
  }

  private getSpinnerHTML(message: string): string {
    return `<spinner-view id="${SpinnerID}" fullScreen="true">${escapeHTML(
      message,
    )}</spinner-view>`;
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
      let containerDiv = document.getElementById(dialogContainerID);
      if (!containerDiv) {
        containerDiv = document.createElement('div');
        containerDiv.id = dialogContainerID;
        document.body.append(containerDiv);
      }

      const template = html`<qing-dialog
        .isOpen=${true}
        .buttons=${args.buttons}
        .defaultButtonIndex=${args.defaultButtonIndex ?? -1}
        .cancelButtonIndex=${args.cancelButtonIndex ?? -1}
        @closed=${(e: CustomEvent<IsOpenChangedArgs>) => {
          if (containerDiv) {
            renderTemplateResult(containerDiv, null);
          }
          resolve(e.detail);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }}
      >
        <h2 style="margin-bottom: 0">
          ${args.icon
            ? iconElement({
                type: args.icon,
                size: 48,
                color:
                  '' /** Set default to an empty value, we'll style colors in CSS */,
              })
            : ''}
          <span style="vertical-align: middle">${args.title}</span>
        </h2>
        ${args.message ? html`<p>${args.message}</p>` : ''}
      </qing-dialog>`;

      const element = renderTemplateResult(
        containerDiv,
        template,
      ) as QingDialog;
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
