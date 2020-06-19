import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import 'ui/cm/qingButton';

@customElement('views-demo')
export class ViewsDemo extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        .root {
          padding-bottom: 4rem;
        }

        .text {
          padding: 1rem;
          color: var(--default-fore-color);
          background-color: var(--default-back-color);
        }

        .text span {
          font-size: 20px;
          font-weight: bold;
          margin-right: 1rem;
        }

        .text .secondary {
          color: var(--default-secondary-fore-color);
        }
        .text .primary {
          color: var(--default-primary-fore-color);
        }
        .text .success {
          color: var(--default-success-fore-color);
        }
        .text .warning {
          color: var(--default-warning-fore-color);
        }
        .text .danger {
          color: var(--default-danger-fore-color);
        }

        .ctx {
          padding: 1rem;
        }
        .ctx-primary {
          color: var(--primary-fore-color);
          background-color: var(--primary-back-color);
        }
        .ctx-success {
          color: var(--success-fore-color);
          background-color: var(--success-back-color);
        }
        .ctx-warning {
          color: var(--warning-fore-color);
          background-color: var(--warning-back-color);
        }
        .ctx-danger {
          color: var(--danger-fore-color);
          background-color: var(--danger-back-color);
        }
        .ctx-info {
          color: var(--info-fore-color);
          background-color: var(--info-back-color);
        }

        .sep {
          color: var(--default-fore-color);
          background-color: var(--default-back-color);
          padding: 1rem;
        }
        .sep div {
          border: 1px solid var(--default-separator-color);
          padding: 1rem;
          border-radius: 0.3rem;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="root container">
        <h2>Default context</h2>
        <div class="text">
          <span>Default</span>
          <span class="secondary">Secondary</span>
          <span class="primary">Primary</span>
          <span class="success">Success</span>
          <span class="warning">Warning</span>
          <span class="danger">Danger</span>
        </div>
        <div class="text theme-dark">
          <span>Default</span>
          <span class="secondary">Secondary</span>
          <span class="primary">Primary</span>
          <span class="success">Success</span>
          <span class="warning">Warning</span>
          <span class="danger">Danger</span>
        </div>
        <p>
          <qing-button>Default</qing-button>
          <qing-button btnStyle="primary">Primary</qing-button>
          <qing-button btnStyle="success">Success</qing-button>
          <qing-button btnStyle="warning">Warning</qing-button>
          <qing-button btnStyle="danger">Danger</qing-button>
        </p>
        <p class="theme-dark">
          <qing-button>Default</qing-button>
          <qing-button btnStyle="primary">Primary</qing-button>
          <qing-button btnStyle="success">Success</qing-button>
          <qing-button btnStyle="warning">Warning</qing-button>
          <qing-button btnStyle="danger">Danger</qing-button>
        </p>
        <h2>Other contexts</h2>
        <div class="ctx-container">
          <div class="ctx ctx-primary">Primary</div>
          <div class="ctx ctx-success">Success</div>
          <div class="ctx ctx-warning">Warning</div>
          <div class="ctx ctx-danger">Danger</div>
          <div class="ctx ctx-info">Info</div>
        </div>
        <hr />
        <div class="ctx-container theme-dark">
          <div class="ctx ctx-primary">Primary</div>
          <div class="ctx ctx-success">Success</div>
          <div class="ctx ctx-warning">Warning</div>
          <div class="ctx ctx-danger">Danger</div>
          <div class="ctx ctx-info">Info</div>
        </div>
        <h2>Separators</h2>
        <div class="sep">
          <div>Content</div>
        </div>
        <div class="sep theme-dark">
          <div>Content</div>
        </div>
        <h1>Views</h1>
        <hr />
        <h2>Error view</h2>
        <error-view headerTitle="Error">
          <p>Hello <b>world</b></p>
        </error-view>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'views-demo': ViewsDemo;
  }
}
