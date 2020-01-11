import { html, customElement, property } from 'lit-element';
import './errorView';
import './spinnerView';
import ls from 'ls';
import BaseElement from 'baseElement';
import LoadingStatus from 'lib/loadingStatus';

@customElement('status-view')
export class StatusView extends BaseElement {
  @property({ type: Object }) status = LoadingStatus.empty;
  @property() loadingText = '';
  @property({ type: Boolean }) canRetry = false;
  @property() errorTitle = '';

  render() {
    const { status } = this;
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
    return html``;
  }

  private handleRetry() {
    this.dispatchEvent(new CustomEvent('onRetry'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'status-view': StatusView;
  }
}
