import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
// eslint-disable-next-line import/no-extraneous-dependencies
import { classMap } from 'lit-html/directives/class-map';
import { AppViewStyleNullable } from './types/appViewStyle';

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
          margin-bottom: 0.8rem;
          border-radius: 5px;
        }

        .is-success {
          background-color: var(--success-back-color);
          color: var(--success-fore-color);
        }

        .is-danger {
          background-color: var(--danger-back-color);
          color: var(--danger-fore-color);
        }

        .is-primary {
          background-color: var(--primary-back-color);
          color: var(--primary-fore-color);
        }

        .is-warning {
          background-color: var(--warning-back-color);
          color: var(--warning-fore-color);
        }

        .is-info {
          background-color: var(--info-back-color);
          color: var(--info-fore-color);
        }
      `,
    ];
  }

  @lp.string type: AppViewStyleNullable = '';

  render() {
    const clsMap: Record<string, boolean> = {
      section: true,
    };
    const { type } = this;
    if (type) {
      clsMap[`is-${type}`] = true;
    }
    return html` <div class=${classMap(clsMap)}><slot></slot></div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'section-view': SectionView;
  }
}
