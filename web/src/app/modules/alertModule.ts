import Swal from 'sweetalert2';
import escapeHTML from 'escape-html';
import ls from 'ls';
import { parseDOMString, removeElement } from 'lib/htmlLib';
import 'ui/cm/spinnerView';
import 'ui/cm/modalView';
import { DialogButtonsType } from 'ui/cm/modalView';
const SpinnerID = '__spinner_main';
let __modalCounter = 1;

export default class AlertModule {
  async error(message: string, title?: string): Promise<void> {
    this.showModal(message, title || ls.error, DialogButtonsType.ok);
  }

  async confirm(message: string, title?: string): Promise<boolean> {
    const result = await Swal.fire({
      title: title || ls.warning,
      text: message,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: ls.yes,
      cancelButtonText: ls.no,
      focusCancel: true,
    });
    return result.value;
  }

  async successToast(title: string): Promise<void> {
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 2000,
    });
    Toast.fire({
      type: 'success',
      title,
    });
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

  private showModal(
    message: string,
    title: string,
    buttons: DialogButtonsType,
  ) {
    const id = `__modal_${__modalCounter++}`;
    const modalHTML = `
      <modal-view id="${id}" modalTitle="${escapeHTML(
      title || '',
    )}" isOpen="true" buttons="${buttons}">${escapeHTML(message)}</modal-view>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const element = document.getElementById(id)!;
    element.addEventListener('modalClosed', () => {
      element.remove();
    });
  }
}
