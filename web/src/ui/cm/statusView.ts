import { html, customElement } from 'lit-element';
import * as lp from 'lit-props';
import './errorView';
import './spinnerView';
import ls from 'ls';
import BaseElement from 'baseElement';
import LoadingStatus from 'lib/loadingStatus';

@customElement('status-view')
export class StatusView extends BaseElement {
  @lp.object status = LoadingStatus.empty;
  @lp.string loadingText = '';
  @lp.bool canRetry = false;
  @lp.string errorTitle = '';

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
          .headerText=${this.errorTitle || ls.errOccurred}
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
