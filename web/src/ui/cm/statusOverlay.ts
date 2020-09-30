import { html, customElement, css } from 'lit-element';
// eslint-disable-next-line import/no-extraneous-dependencies
import { classMap } from 'lit-html/directives/class-map';
import * as lp from 'lit-props';
import ls from 'ls';
import BaseElement from 'baseElement';
import LoadingStatus from 'lib/loadingStatus';
import 'ui/cm/centeredView';
import 'ui/cm/spinnerView';
import './errorView';

@customElement('status-overlay')
export class StatusOverlay extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .root-div {
          display: grid;
        }

        .content,
        .overlay {
          grid-area: 1 / 1;
        }
      `,
    ];
  }

  @lp.object status = LoadingStatus.empty;
  @lp.string loadingText = '';
  @lp.bool canRetry = false;
  @lp.string errorTitle = '';

  render() {
    const { status } = this;
    return html`
      <div class="root-div">
        <div
          class=${classMap({
            'content-disabled': !status.isSuccess,
            content: true,
          })}
        >
          <slot></slot>
        </div>
        ${!status.isSuccess
          ? html`
              <centered-view class="overlay" height="100%">
                ${status.isWorking
                  ? html` <spinner-view>${this.loadingText || ls.loading}</spinner-view> `
                  : html``}
                ${status.error
                  ? html`
                      <error-view
                        .canRetry=${this.canRetry}
                        .headerText=${this.errorTitle || ls.errOccurred}
                        @onRetry=${this.handleRetry}
                      >
                        ${status.error.message}
                      </error-view>
                    `
                  : html``}
              </centered-view>
            `
          : html``}
      </div>
    `;
  }

  private handleRetry() {
    this.dispatchEvent(new CustomEvent('onRetry'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'status-overlay': StatusOverlay;
  }
}
