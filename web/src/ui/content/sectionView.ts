import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import { AppViewStyleNullable } from 'ui/types/appViewStyle';

@customElement('section-view')
export class SectionView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .section {
          padding: 0.75rem 1rem;
          border-radius: 5px;
          color: var(--color);
          background-color: var(--background-color);
        }
      `,
    ];
  }

  @lp.string sectionStyle: AppViewStyleNullable = '';

  render() {
    return html` <div class="section"><slot></slot></div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'section-view': SectionView;
  }
}
