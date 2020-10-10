import { customElement, css, html } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import 'ui/cm/sectionView';

export type AlertViewStyle = 'primary' | 'success' | 'danger' | 'warning' | '';

@customElement('alert-view')
export class AlertView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        section-view {
          border: 1px solid var(--alert-border-color, var(--default-secondary-fore-color));
          border-left-width: 5px;
        }
      `,
    ];
  }

  @lp.reflected.string alertStyle: AlertViewStyle = '';

  render() {
    return html`
      <section-view>
        <slot></slot>
      </section-view>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'alert-view': AlertView;
  }
}
