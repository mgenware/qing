import escapeHTML from 'escape-html';
import ls from 'ls';
import { parseDOMString, removeElement } from 'lib/htmlLib';
import 'ui/cm/spinnerView';
import {
  QingDialog,
  DialogIconType,
  IsOpenChangedArgs,
  DialogButtonType,
} from 'qing-dialog-component';
const SpinnerID = '__spinner_main';
let __modalCounter = 1;

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
    const buttons: DialogButtonType[] = ['yes', 'no'];
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
    buttons: DialogButtonType[];
    icon: DialogIconType;
    defaultButtonIndex?: number;
    cancelButtonIndex?: number;
    timeout?: number;
  }): Promise<IsOpenChangedArgs> {
    return new Promise<IsOpenChangedArgs>((resolve, reject) => {
      const id = `__modal_${__modalCounter++}`;
      const modalHTML = `
        <qing-dialog id="${id}" dialogTitle="${escapeHTML(
        args.title || '',
      )}" isOpen="true" buttons="${escapeHTML(
        JSON.stringify(args.buttons),
      )}" icon="${args.icon}" defaultButtonIndex="${
        args.defaultButtonIndex ?? -1
      }" cancelButtonIndex="${args.cancelButtonIndex ?? -1}">${escapeHTML(
        args.message,
      )}</qing-dialog>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      const element = document.getElementById(id) as QingDialog;
      if (!element) {
        reject(new Error(`Modal DOM ID "${id}" not found`));
        return;
      }
      element.addEventListener('closed', ((
        e: CustomEvent<IsOpenChangedArgs>,
      ) => {
        element.remove();
        resolve(e.detail);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any);
      const { timeout } = args;
      if (timeout && timeout > 0) {
        setTimeout(() => {
          element.isOpen = false;
        }, timeout);
      }
    });
  }
}
