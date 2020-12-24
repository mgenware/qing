import { customElement, css, html } from 'lit-element';
import BaseElement from 'baseElement';

export const linkListActiveClass = 'link-active';

@customElement('link-list-view')
export class LinkListView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        ::slotted(a) {
          color: var(--app-default-primary-fore-color);
          display: block;
          text-decoration: none;
          padding: 0.5rem 0.4rem;
          border-left: var(--app-heading-indicator-width-sm) solid transparent;
        }
        ::slotted(a:visited) {
          color: var(--app-default-primary-fore-color);
        }

        @media (min-width: 768px) {
          ::slotted(a) {
            padding: 0.5rem 0.8rem;
          }
        }

        ::slotted(a:hover) {
          opacity: 0.8;
        }

        ::slotted(a:disabled) {
          opacity: 0.6;
        }

        ::slotted(a.link-active) {
          border-left: var(--app-heading-indicator-width-sm) solid
            var(--app-default-primary-fore-color);
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="menu">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'link-list-view': LinkListView;
  }
}
