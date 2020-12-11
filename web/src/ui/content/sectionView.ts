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

        .section-header {
          padding: 0.75rem 1rem;
          color: var(--header-color);
          background-color: var(--tint-color);
          border-radius: 8px;
        }

        .section-content {
          padding: 0.75rem 1rem;
          color: var(--content-color);
        }

        @media (min-width: 768px) {
          .section-header {
            border-radius: 8px 8px 0 0;
          }

          .section-content {
            border-width: 0 1px 1px 1px;
            border-radius: 0 0 8px 8px;
            border-color: var(--tint-color);
            border-style: solid;
          }
        }
      `,
    ];
  }

  @lp.string sectionStyle: AppViewStyleNullable = '';

  render() {
    return html`
      <div class="section-container">
        <div class="section-header">
          <slot name="header"></slot>
        </div>
        <div class="section-content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'section-view': SectionView;
  }
}
