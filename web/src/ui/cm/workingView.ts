import { html, customElement, property } from 'lit-element';
import BaseElement from 'baseElement';
import Status from 'lib/status';

@customElement('working-view')
export class WorkingView extends BaseElement {
  @property() status = new Status();
  @property() isWorking = false;

  render() {
    const { status, isWorking } = this;
    return html`
      <div class=${status.isWorking || isWorking ? 'content-disabled' : ''}>
        <slot></slot>
      </div>
    `;
  }
}
