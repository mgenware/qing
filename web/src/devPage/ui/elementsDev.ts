/* eslint-disable no-alert */
import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import 'qing-button';
import 'ui/content/alertView';
import 'ui/status/spinnerView';
import 'ui/panels/centeredView';
import 'ui/status/statusView';
import 'ui/status/statusOverlay';
import 'ui/form/selectionView';
import 'post/views/likeView';
import LoadingStatus from 'lib/loadingStatus';

@customElement('elements-dev')
export class ElementsDev extends BaseElement {
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
        .highlighted {
          padding: 0.6rem;
          background-color: var(--highlight-color);
        }

        .with-border {
          border: 1px solid var(--default-separator-color);
        }
      `,
    ];
  }

  render() {
    return html`
      <container-view id="root">
        <div>
          <input type="checkbox" id="darkModeCheckbox" @click=${this.handleDarkModeChecked} />
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
        <h2>Highlight color</h2>
        <div class="highlighted">Highlight color</div>
        <h1>Views</h1>
        <hr />
        <h2>Selection view</h2>
        <selection-view
          multiSelect
          .dataSource=${[{ text: 'Qing', checked: true }, { text: 'Ming' }, { text: 'Yuan' }]}
        ></selection-view>
        <selection-view
          class="m-t-md"
          .dataSource=${[{ text: 'Qing', checked: true }, { text: 'Ming' }, { text: 'Yuan' }]}
        ></selection-view>
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
        <h2>Spinners</h2>
        <spinner-view>Loading...</spinner-view>
        <h3>Spinner in a fixed view</h3>
        <centered-view class="with-border" height="150px">
          <spinner-view>Loading...</spinner-view>
        </centered-view>
        <h2>Status view</h2>
        <status-view .status=${LoadingStatus.working}></status-view>
        <h2>Status overlay</h2>
        <status-overlay .status=${LoadingStatus.working}>
          <h1>heading 1</h1>
          <p>text text text text text text text text text text</p>
        </status-overlay>
        <h2>Misc</h2>
        <like-view .likes=${20} @click=${() => alert('Like button clicked!')}></like-view>
        <like-view .likes=${1} hasLiked></like-view>
        <like-view .likes=${1} hasLiked isWorking></like-view>
      </container-view>
    `;
  }

  private handleDarkModeChecked() {
    document.body.classList.toggle('theme-dark');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'elements-dev': ElementsDev;
  }
}
