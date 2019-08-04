import { html, customElement, property } from 'lit-element';
import './error-view';
import './spinner';
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
      return null;
    }
    if (status.isWorking) {
      return html`
        <spinner-view .text=${this.loadingText || ls.loading}></spinner-view>
      `;
    }
    if (status.isError) {
      return html`
        <errow-view
          .canRetry=${this.canRetry}
          .title=${this.errorTitle || ls.errOccurred}
          .message=${status.error!.message}
        ></errow-view>
      `;
    }
    return null;
  }
}
