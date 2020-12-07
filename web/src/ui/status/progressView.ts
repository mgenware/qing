import { html, customElement, property } from 'lit-element';
import BaseElement from 'baseElement';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ifDefined } from 'lit-html/directives/if-defined';

@customElement('progress-view')
export default class ProgressView extends BaseElement {
  @property({ type: Number }) progress = 0;

  render() {
    const { progress } = this;
    return html`
      <progress value=${ifDefined(progress < 0 ? undefined : progress.toString())} max="100">
        ${progress} %
      </progress>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'progress-view': ProgressView;
  }
}