import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';

@customElement('like-view')
export class LikeView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        qing-button::part(button) {
          background-color: none;
          border: 0;
        }
      `,
    ];
  }

  @lp.number likes = 0;
  @lp.bool isWorking = false;
  @lp.bool hasLiked = false;

  render() {
    return html`
      <qing-button
        class=${this.hasLiked ? 'selected' : ''}
        ?disabled=${this.isWorking}
        canSelect
        ?selected=${this.hasLiked}
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
