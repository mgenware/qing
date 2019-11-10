import { html, customElement, property } from 'lit-element';
import './errorView';
import './spinnerView';
import Status from 'lib/status';
import ls from 'ls';
import BaseElement from 'baseElement';

@customElement('loading-view')
export class LoadingView extends BaseElement {
  @property({ type: Object }) status = Status.unstarted();
  @property() loadingText = '';
  @property({ type: Boolean }) canRetry = false;
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
    if (status.error) {
      return html`
        <error-view
          .canRetry=${this.canRetry}
          .title=${this.errorTitle || ls.errOccurred}
          @onRetry=${this.handleRetry}
        >
          ${status.error.message}
        </error-view>
      `;
    }
    return;
  }

  private handleRetry() {
    this.dispatchEvent(new CustomEvent('onRetry'));
  }
}
