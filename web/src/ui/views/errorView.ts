import { html, customElement, property } from 'lit-element';
import ls from 'ls';
import BaseElement from 'baseElement';

@customElement('error-view')
export class ErrorView extends BaseElement {
  @property() title = '';
  @property() canRetry = false;

  render() {
    return html`
      <div>
        <h3>${this.title || ls.errOccurred}</h3>
        <slot></slot>

        ${this.canRetry
          ? html`
              <p>
                <button class="button m-t-md" @click=${this.handleRetryClick}>
                  ${ls.retry}
                </button>
              </p>
            `
          : ''}
      </div>
    `;
  }

  private handleRetryClick() {
    this.dispatchEvent(new CustomEvent('onRetry'));
  }
}
