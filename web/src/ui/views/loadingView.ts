import { html, customElement, property } from 'lit-element';
import './errorView';
import './spinnerView';
import Status from 'lib/status';
import ls from 'ls';
import BaseElement from 'baseElement';

@customElement('loading-view')
export class LoadingView extends BaseElement {
  @property() status = new Status();
  @property() loadingText = '';
  @property() canRetry = false;
  @property() errorTitle = '';

  render() {
    const { status } = this;
    if (!status.isStarted) {
      return;
    }
    if (status.isWorking) {
      return html`
        <spinner-view>${this.loadingText || ls.loading}</spinner-view>
      `;
    }
    if (status.isError) {
      return html`
        <error-view
          .canRetry=${this.canRetry}
          .title=${this.errorTitle || ls.errOccurred}
        >
          ${status.error!.message}
        </error-view>
      `;
    }
    return;
  }
}
