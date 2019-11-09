import { html, customElement, property } from 'lit-element';
import ls from 'ls';
import BaseElement from 'baseElement';

@customElement('error-view')
export class ErrorView extends BaseElement {
  @property() title = '';
  @property({ type: Boolean }) canRetry = false;

  render() {
    return html`
      <div class="section is-danger">
        <h3>${this.title || ls.errOccurred}</h3>
        <div><slot></slot></div>

        ${this.canRetry
          ? html`
              <div class="m-t-md">
                <lit-button class="is-primary" @click=${this.handleRetryClick}>
                  ${ls.retry}
                </lit-button>
              </div>
            `
          : ''}
      </div>
    `;
  }

  private handleRetryClick() {
    this.dispatchEvent(new CustomEvent('onRetry'));
  }
}
