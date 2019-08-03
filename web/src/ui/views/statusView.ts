import { html, customElement, css, property } from 'lit-element';
import './error-view';
import './spinner';
import Status from 'lib/status';
import ls from 'ls';
import BaseElement from 'baseElement';

@customElement('status-view')
export class StatusView extends BaseElement {
  static get styles() {
    return css``;
  }

  @property() status = new Status();
  @property() loadingText = '';
  @property() canRetry = false;
  @property() errorTitle = '';

  render() {
    const { status } = this;
    if (!status.isStarted) {
      return null;
    }
    return html`
      <div>
        <spinner
          v-if="status.isWorking"
          :text="loadingText || $ls.loading"
        ></spinner>
        <errow-view
          v-else-if="status.isError"
          .canRetry=${this.canRetry}
          .title=${this.errorTitle || ls.errOccurred}
          .message=${status.error.message}
        ></errow-view>
      </div>
    `;
  }
}
