import escapeHTML from 'escape-html';
import ls from 'ls';
import { parseDOMString, removeElement } from 'lib/htmlLib';
import 'ui/cm/spinnerView';
import 'ui/cm/modalView';
import { ModalButton, ModalIcon, ModalClickInfo } from 'ui/cm/modalView';
const SpinnerID = '__spinner_main';
let __modalCounter = 1;

export default class AlertModule {
  async error(message: string, title?: string): Promise<void> {
    await this.showModalAsync(
      message,
      title || ls.error,
      [ModalButton.ok],
      ModalIcon.error,
      0,
    );
  }

  async successToast(title: string): Promise<void> {
    await this.showModalAsync(
      '',
      title || ls.error,
      [],
      ModalIcon.success,
      -1,
      2000,
    );
  }

  async confirm(
    message: string,
    hasCancelButton?: false,
  ): Promise<boolean | null> {
    const btns = [ModalButton.yes, ModalButton.no];
    if (hasCancelButton) {
      btns.push(ModalButton.cancel);
    }
    const buttonType = await this.showModalAsync(
      '',
      message || ls.warning,
      btns,
      ModalIcon.warning,
      hasCancelButton ? 2 : 1, // active button default to no or cancel
    );
    if (buttonType === ModalButton.yes) {
      return true;
    }
    if (buttonType === ModalButton.no) {
      return false;
    }
    // User chose Cancel
    return null;
  }

  // loading spinner
  showLoadingOverlay(text: string) {
    this.hideLoadingOverlay();
    const element = parseDOMString(this.getSpinnerHTML(text));
    if (element) {
      document.body.appendChild((element as unknown) as Node);
    }
  }

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

  private showModalAsync(
    message: string,
    title: string,
    buttons: ModalButton[],
    icon: ModalIcon,
    activeButtonIndex = -1,
    timeout = 0,
  ): Promise<number> {
    return new Promise<number>(resolve => {
      const id = `__modal_${__modalCounter++}`;
      const modalHTML = `
        <modal-view id="${id}" modalTitle="${escapeHTML(
        title || '',
      )}" isOpen="true" buttons="${JSON.stringify(
        buttons,
      ).toString()}" icon="${icon}" timeout="${timeout}" activeButtonIndex="${activeButtonIndex}">${escapeHTML(
        message,
      )}</modal-view>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      const element = document.getElementById(id)!;
      element.addEventListener('modalClosed', ((
        e: CustomEvent<ModalClickInfo>,
      ) => {
        element.remove();
        resolve(e.detail.type);
      }) as any);
    });
  }
}
