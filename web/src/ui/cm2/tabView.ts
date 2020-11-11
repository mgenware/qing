import { customElement, css, html } from 'lit-element';
import BaseElement from 'baseElement';

@customElement('tab-view')
export class TabView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        .bar {
          overflow-x: auto;
          border-bottom: 1px solid var(--default-separator-color);
        }

        .bar a {
          font-size: 1.2rem;
          transition: 0.4s;
          padding: 0.8rem 1rem;
        }

        .bar a:hover {
          background-color: var(--default-secondary-back-color);
        }

        .bar a.active {
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
