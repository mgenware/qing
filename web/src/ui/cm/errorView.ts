import { html, customElement, property } from 'lit-element';
import ls from 'ls';
import BaseElement from 'baseElement';
import 'ui/cm/alertView';

@customElement('error-view')
export class ErrorView extends BaseElement {
  @property() headerText = '';
  @property({ type: Boolean }) canRetry = false;

  render() {
    return html`
      <alert-view alertStyle="danger">
        <h3>${this.headerText || ls.errOccurred}</h3>
        <p><slot></slot></p>

        ${this.canRetry
          ? html`
              <div class="m-t-md">
                <qing-button btnStyle="primary" @click=${this.handleRetryClick}>
                  ${ls.retry}
                </qing-button>
              </div>
            `
          : ''}
      </alert-view>
    `;
  }

  private handleRetryClick() {
    this.dispatchEvent(new CustomEvent('onRetry'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'error-view': ErrorView;
  }
}
