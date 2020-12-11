import { html, customElement, css } from 'lit-element';
import * as lp from 'lit-props';
import '../alerts/errorView';
import './spinnerView';
import ls from 'ls';
import BaseElement from 'baseElement';
import LoadingStatus from 'lib/loadingStatus';

// A status view used to display `LoadingStatus`.
// It has 3 states: loading, success and error.
@customElement('status-view')
export class StatusView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  // The underlying status of this view.
  @lp.object status = LoadingStatus.empty;
  // The loading text when in loading state.
  @lp.string loadingText = '';
  // If a "retry" button is displayed when in error state.
  @lp.bool canRetry = false;
  // The title of error state view.
  @lp.string errorTitle = '';

  render() {
    const { status } = this;
    if (status.isWorking) {
      return html` <spinner-view>${this.loadingText || ls.loading}</spinner-view> `;
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
