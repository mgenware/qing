import { html, customElement, property } from 'lit-element';
import BaseElement from 'baseElement';
import LoadingStatus from 'lib/loadingStatus';

@customElement('working-view')
export class WorkingView extends BaseElement {
  @property({ type: Object }) status = LoadingStatus.empty;
  @property({ type: Boolean }) isWorking = false;

  render() {
    const { status, isWorking } = this;
    return html`
      <div class=${status.isWorking || isWorking ? 'content-disabled' : ''}>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'working-view': WorkingView;
  }
}
