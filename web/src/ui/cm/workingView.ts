import { html, customElement, css } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import * as lp from 'lit-props';
import ls from 'ls';
import BaseElement from 'baseElement';
import LoadingStatus from 'lib/loadingStatus';
import 'ui/cm/centeredView';
import 'ui/cm/spinnerView';

@customElement('working-view')
export class WorkingView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        .root {
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
  @lp.bool isWorking = false;
  @lp.string loadingText = '';

  render() {
    const { status, isWorking } = this;
    const showOverlay = status.isWorking || isWorking;
    return html`
      <div class="root">
        <div
          class=${classMap({ 'content-disabled': showOverlay, content: true })}
        >
          <slot></slot>
        </div>
        ${showOverlay
          ? html`
              <centered-view class="overlay" height="100%">
                <spinner-view>${this.loadingText || ls.loading}</spinner-view>
              </centered-view>
            `
          : html``}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'working-view': WorkingView;
  }
}
