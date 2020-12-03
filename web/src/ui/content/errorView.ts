import { html, customElement, css } from 'lit-element';
import ls from 'ls';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import 'ui/content/alertView';

@customElement('error-view')
export class ErrorView extends BaseElement {
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

  @lp.string headerText = '';
  @lp.bool canRetry = false;

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
