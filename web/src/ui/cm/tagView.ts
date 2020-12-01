import BaseElement from 'baseElement';
import { html, customElement, css } from 'lit-element';
import * as lp from 'lit-props';
import { AppViewStyleNullable } from './types/appViewStyle';

@customElement('tag-view')
export class TagView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        .tag {
          padding: 0.1rem 0.3rem;
          margin-left: 0.2rem;
          margin-right: 0.2rem;
          line-height: 1.3;
          border: 1px solid transparent;
          border-radius: 4px;
          color: var(--color);
          background-color: var(--background-color);
        }
      `,
    ];
  }

  @lp.string tagStyle: AppViewStyleNullable = '';

  render() {
    return html`<span class="tag"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tag-view': TagView;
  }
}
