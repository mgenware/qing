import Swal from 'sweetalert2';
import escapeHTML from 'escape-html';
import ls from '../../ls';
import { parseDOMString, removeElement } from '@/lib/htmlLib';
const SpinnerID = '__spinner_main';

export default class AlertModule {
  async error(message: string, title?: string): Promise<void> {
    await Swal.fire({
      title: title || ls.error,
      text: message,
      type: 'error',
      confirmButtonText: ls.ok,
    });
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
    return `
    <div id="${SpinnerID}" class="spinner-screen-overlay">
      <div class="spinner-root">
        <div class="spinner">
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
        </div>
        <div class="text-center">${escapeHTML(message)}</div>
      </div>
    </div>`;
  }
}
