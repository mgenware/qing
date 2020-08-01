import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import 'qing-button';
import 'ui/cm/alertView';
import 'ui/cm/progressView';
import 'post/views/likeView';

@customElement('views-demo')
export class ViewsDemo extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
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
      <container-view id="root">
        <div>
          <input
            type="checkbox"
            id="darkModeCheckbox"
            @click=${this.handleDarkModeChecked}
          />
          <label for="darkModeCheckbox">Dark mode</label>
        </div>
        <h2>Default context</h2>
        <div class="text">
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
        <h2>Other contexts</h2>
        <div class="ctx-container">
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
        <h1>Views</h1>
        <hr />
        <h2>Alerts</h2>
        <alert-view>Default</alert-view>
        <alert-view alertStyle="primary">Primary</alert-view>
        <alert-view alertStyle="success">Success</alert-view>
        <alert-view alertStyle="warning">Warning</alert-view>
        <alert-view alertStyle="danger">Danger</alert-view>
        <h2>Error view</h2>
        <error-view headerTitle="Error" .canRetry=${true}>
          <p>Hello <b>world</b></p>
        </error-view>
        <h2>Progress view</h2>
        <progress-view progress="30"></progress-view>
        <progress-view progress="-1"></progress-view>
        <h2>Misc</h2>
        <like-view .likes=${20}></like-view>
        <like-view .likes=${1} hasLiked></like-view>
      </container-view>
    `;
  }

  private handleDarkModeChecked() {
    document.body.classList.toggle('theme-dark');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'views-demo': ViewsDemo;
  }
}
