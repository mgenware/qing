import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';

@customElement('like-view')
export class LikeView extends BaseElement {
  @lp.number likes = 0;
  @lp.bool isWorking = false;
  @lp.bool hasLiked = false;

  render() {
    return html`
      <qing-button ?disabled=${this.isWorking}
        >❤ ${this.likes || ''}</qing-button
      >
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'like-view': LikeView;
  }
}
