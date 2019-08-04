import { html, customElement, css, property } from 'lit-element';
import BaseElement from 'baseElement';
import Status from 'lib/status';

@customElement('working-view')
export class WorkingView extends BaseElement {
  static get styles() {
    return css``;
  }

  @property() status = new Status();

  render() {
    const { status } = this;
    return html`
      <div class=${status.isWorking ? 'content-disabled' : ''}>
        <slot></slot>
      </div>
    `;
  }
}
