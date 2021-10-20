/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

/* eslint-disable no-alert */
import { BaseElement, customElement, html, css } from 'll';
import 'qing-button';
import 'qing-dock-box';
import 'ui/alerts/alertView';
import 'ui/alerts/sectionView';
import 'ui/content/headingView';
import 'ui/status/spinnerView';
import 'ui/status/statusView';
import 'ui/status/statusOverlay';
import 'ui/form/inputView';
import 'ui/form/selectionView';
import 'ui/qna/voteView';
import 'ui/lists/linkListView';
import 'com/like/likeView';
import 'com/postCore/setEntityApp';
import LoadingStatus from 'lib/loadingStatus';
import { linkListActiveClass, linkListActiveFilledClass } from 'ui/lists/linkListView';
import SetEntityApp from 'com/postCore/setEntityApp';
import { renderTemplateResult } from 'lib/htmlLib';
import { entityPost, upVoteValue, downVoteValue } from 'sharedConstants';
import appAlert from 'app/appAlert';
import ErrorWithCode from 'lib/errorWithCode';

const workingStatus = LoadingStatus.working;
const errorStatus = LoadingStatus.error(new ErrorWithCode('Example error', 1));

const immersiveDialogID = 'qing-overlay-immersive';

@customElement('elements-dev')
export class ElementsDev extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: var(--app-default-fore-color);
          background-color: var(--app-default-back-color);
        }

        .text {
          padding: 1rem;
        }

        .text span {
          font-size: 1.2rem;
          font-weight: bold;
          margin-right: 1rem;
        }

        .text .secondary {
          color: var(--app-default-secondary-fore-color);
        }
        .text .primary {
          color: var(--app-default-primary-fore-color);
        }
        .text .success {
          color: var(--app-default-success-fore-color);
        }
        .text .warning {
          color: var(--app-default-warning-fore-color);
        }
        .text .danger {
          color: var(--app-default-danger-fore-color);
        }

        .ctx {
          padding: 1rem;
        }
        .ctx-primary {
          color: var(--app-primary-fore-color);
          background-color: var(--app-primary-back-color);
        }
        .ctx-success {
          color: var(--app-success-fore-color);
          background-color: var(--app-success-back-color);
        }
        .ctx-warning {
          color: var(--app-warning-fore-color);
          background-color: var(--app-warning-back-color);
        }
        .ctx-danger {
          color: var(--app-danger-fore-color);
          background-color: var(--app-danger-back-color);
        }
        .ctx-info {
          color: var(--app-info-fore-color);
          background-color: var(--app-info-back-color);
        }

        .sep {
          color: var(--app-default-fore-color);
          background-color: var(--app-default-back-color);
          padding: 1rem;
        }
        .sep div {
          border: 1px solid var(--app-default-separator-color);
          padding: 1rem;
          border-radius: 0.3rem;
        }
        .highlighted {
          padding: 0.6rem;
          background-color: var(--app-highlight-color);
        }

        .with-border {
          border: 1px solid var(--app-default-separator-color);
        }

        vote-view {
          margin-bottom: 1rem;
        }
      `,
    ];
  }

  #setEntityApp: SetEntityApp | null = null;

  render() {
    return html`
      <h1>Colors</h1>
      <hr />
      <h2>Default context</h2>
      <div class="text">
        <span>Welcome to <a href="https://github.com/mgenware/qing" target="_blank">Qing</a></span>
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
      <h3>With blockquote</h3>
      <blockquote>
        <div class="text">
          <span
            >Welcome to <a href="https://github.com/mgenware/qing" target="_blank">Qing</a></span
          >
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
      </blockquote>
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
      <h2>Section</h2>
      <section-view sectionStyle="primary">
        <span slot="header">Section header</span>
        <div>Section content</div>
      </section-view>
      <heading-view>Heading view</heading-view>
      <heading-view>
        <span>Heading with decorator view</span>
        <qing-button slot="decorator" class="small">Button</qing-button>
      </heading-view>
      <h2>Highlight color</h2>
      <div class="highlighted">Highlight color</div>
      <h1>Views</h1>
      <hr />
      <h2>Dialogs</h2>
      <qing-button @click=${async () => appAlert.error('This is an error')}>Error</qing-button>
      <qing-button
        @click=${async () =>
          alert((await appAlert.confirm('Warning', 'Yes or no?')) ? 'Yes' : 'No')}
        >Confirm</qing-button
      >
      <qing-button @click=${async () => appAlert.successToast('Success!')}
        >Success toast</qing-button
      >
      <qing-button
        @click=${() => {
          this.shadowRoot?.getElementById(immersiveDialogID)?.setAttribute('open', '');
          setTimeout(
            () => this.shadowRoot?.getElementById(immersiveDialogID)?.removeAttribute('open'),
            3000,
          );
        }}
        >immersive dialog</qing-button
      >
      <qing-overlay
        id=${immersiveDialogID}
        class="immersive"
        .buttons=${['ok']}
        .cancelButtonIndex=${0}>
        <div class="flex-grow">
          <h2>Full dialog (will close in 3 seconds)</h2>
          <p>Hello world</p>
        </div>
      </qing-overlay>
      <h2>Forms</h2>
      <h3>Button group</h3>
      <div class="qing-btn-group">
        <qing-button>Qing</qing-button>
        <qing-button btnStyle="warning">Ming</qing-button>
        <qing-button btnStyle="success">Song</qing-button>
      </div>
      <p><input-view required type="email" label="Email"></input-view></p>
      <selection-view
        class="m-t-md"
        multiSelect
        .dataSource=${[
          { text: 'Qing', checked: true },
          { text: 'Ming' },
          { text: 'Yuan' },
        ]}></selection-view>
      <selection-view
        class="m-t-md"
        .dataSource=${[
          { text: 'Qing', checked: true },
          { text: 'Ming' },
          { text: 'Yuan' },
        ]}></selection-view>
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
      <h2>Vote view</h2>
      <vote-view .value=${-20} .ups=${100} .downs=${4003489394}></vote-view>
      <vote-view .value=${2000003430} .downs=${400} .myVote=${upVoteValue}></vote-view>
      <vote-view .value=${20} .ups=${400} .myVote=${downVoteValue}></vote-view>
      <vote-view></vote-view>
      <h2>Link list view</h2>
      <h3>Default style</h3>
      <link-list-view>
        <a href="#">Linux</a>
        <a href="#" class=${linkListActiveClass}>macOS</a>
        <a href="#">Windows</a>
      </link-list-view>
      <h3>Filled style</h3>
      <link-list-view>
        <a href="#">Linux</a>
        <a href="#" class=${linkListActiveFilledClass}>macOS</a>
        <a href="#">Windows</a>
      </link-list-view>
      <h2>Post editor</h2>
      <qing-button @click=${this.showPostEditor}>Show post editor</qing-button>
      <h2>Spinners</h2>
      <p>
        <qing-button @click=${this.startFullscreenSpinner}>Fullscreen spinner</qing-button>
      </p>
      <spinner-view>Loading...</spinner-view>
      <h3>Spinner in a fixed view</h3>
      <qing-dock-box class="with-border" style="height:150px">
        <spinner-view>Loading...</spinner-view>
      </qing-dock-box>
      <h2>Status view</h2>
      <status-view .status=${workingStatus}></status-view>
      <status-view .status=${errorStatus}></status-view>
      <h3>'progressViewPadding' = 'md'</h3>
      <status-view .status=${workingStatus} .progressViewPadding=${'md'}></status-view>
      <status-view .status=${errorStatus} .progressViewPadding=${'md'}></status-view>
      <h2>Status overlay</h2>
      <status-overlay .status=${workingStatus}>
        <h1>heading 1</h1>
        <p>text text text text text text text text text text</p>
      </status-overlay>
      <status-overlay .status=${errorStatus}>
        <h1>heading 1</h1>
        <p>text text text text text text text text text text</p>
      </status-overlay>
      <h2>Misc</h2>
      <h3>Like Views</h3>
      <p>Default<like-view class="m-l-sm"></like-view></p>
      <p>Liked<like-view class="m-l-sm" .likes=${1} hasLiked></like-view></p>
      <p>Working<like-view class="m-l-sm" .likes=${1} hasLiked isWorking></like-view></p>
      <h3>Flexbox utils</h3>
      <div class="d-flex">
        <div class="flex-auto" style="background-color:yellow">A ${'b'.repeat(20)} A</div>
        <div class="flex-full" style="background-color:green">A ${'b'.repeat(20)} D</div>
        <div class="flex-auto" style="background-color:yellow">A ${'b'.repeat(20)} D</div>
        <div class="flex-full" style="background-color:green">A ${'b'.repeat(20)} D</div>
      </div>
    `;
  }

  firstUpdated() {
    this.#setEntityApp = renderTemplateResult(
      '',
      html`<set-entity-app
        autoClose
        entityType=${entityPost}
        headerText="Create a new post"></set-entity-app>`,
    );
  }

  private startFullscreenSpinner() {
    appAlert.showLoadingOverlay('Loading...');
    setTimeout(() => {
      appAlert.hideLoadingOverlay();
    }, 2000);
  }

  private showPostEditor() {
    if (this.#setEntityApp) {
      this.#setEntityApp.open = true;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'elements-dev': ElementsDev;
  }
}
