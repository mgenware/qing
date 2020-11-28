import { customElement, css, html } from 'lit-element';
import BaseElement from 'baseElement';

export const tabViewActiveClass = 'tab-active';

@customElement('tab-view')
export class TabView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .bar {
          overflow-x: auto;
          border-bottom: 1px solid var(--default-separator-color);
        }

        ::slotted(a) {
          display: inline-block;
          font-size: 1.2rem;
          transition: 0.4s;
          padding: 0.8rem 1rem;
        }

        ::slotted(a:hover) {
          background-color: var(--default-secondary-back-color);
        }

        ::slotted(a.tab-active) {
          border-bottom: 3px solid var(--default-primary-fore-color);
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="bar">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tab-view': TabView;
  }
}
