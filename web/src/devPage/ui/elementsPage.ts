/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

/* eslint-disable no-alert */
import { BaseElement, customElement, html, css, property } from 'll';
import 'qing-button';
import 'qing-dock-box';
import 'ui/alerts/alertView';
import 'ui/alerts/sectionView';
import 'ui/content/headingView';
import 'ui/status/spinnerView';
import 'ui/status/statusView';
import 'ui/status/statusOverlay';
import 'ui/forms/inputView';
import 'ui/forms/checklistView';
import 'ui/forms/selectView';
import 'ui/lists/linkListView';
import 'com/like/likesView';
import 'com/postCore/setEntityApp';
import LoadingStatus from 'lib/loadingStatus';
import { linkListActiveClass, linkListActiveFilledClass } from 'ui/lists/linkListView';
import { renderTemplateResult } from 'lib/htmlLib';
import { appdef } from '@qing/def';
import appAlert from 'app/appAlert';
import ErrorWithCode from 'lib/errorWithCode';
import delay from 'lib/delay';

const workingStatus = LoadingStatus.working;
const errorStatus = LoadingStatus.error(new ErrorWithCode('Example error', 1));

const immersiveDialogID = 'qing-overlay-immersive';
const checklistViewData = ['Zhang', 'Chen', 'Liu', 'Zheng'];

@customElement('elements-page')
export class ElementsPage extends BaseElement {
  static override get styles() {
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
      `,
    ];
  }

  @property({ type: Array }) checklistIndices1: readonly number[] = [];
  @property({ type: Array }) checklistIndices2: readonly number[] = [];

  override render() {
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
        }}
        >immersive dialog</qing-button
      >
      <qing-button @click=${async () => appAlert.error('Long content '.repeat(20))}
        >Long content</qing-button
      >
      <qing-overlay id=${immersiveDialogID} class="immersive">
        <div class="flex-grow">
          <h2>Full dialog (will close in 3 seconds)</h2>
          <p>Hello world</p>
        </div>
      </qing-overlay>
      <h2>Forms</h2>
      <h3>Button group</h3>
      <div>
        <span class="qing-btn-group">
          <qing-button>Qing</qing-button>
          <qing-button btnStyle="warning">Ming</qing-button>
          <qing-button btnStyle="success">Song</qing-button>
        </span>
        <span class="qing-btn-group">
          <qing-button>Zheng</qing-button>
          <qing-button>Liu</qing-button>
          <qing-button>Chen</qing-button>
        </span>
      </div>
      <p><input-view required type="email" label="Email"></input-view></p>
      <checklist-view
        @checklist-change=${(e: CustomEvent<number[]>) => (this.checklistIndices1 = e.detail)}
        class="m-t-md"
        multiSelect
        .selectedIndices=${this.checklistIndices1}
        .dataSource=${checklistViewData}></checklist-view>
      <checklist-view
        @checklist-change=${(e: CustomEvent<number[]>) => (this.checklistIndices2 = e.detail)}
        class="m-t-md"
        .selectedIndices=${this.checklistIndices2}
        .dataSource=${checklistViewData}></checklist-view>
      <p>
        <select-view .dataSource=${checklistViewData}></select-view>
      </p>
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
      <h2>Link list view</h2>
      <h3>Default style</h3>
      <link-list-view>
        <link-button>Linux</link-button>
        <link-button class=${linkListActiveClass}>macOS</link-button>
        <link-button>Windows</link-button>
      </link-list-view>
      <h3>Filled style</h3>
      <link-list-view>
        <link-button>Linux</link-button>
        <link-button class=${linkListActiveFilledClass}>macOS</link-button>
        <link-button>Windows</link-button>
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
      <p>Default<likes-view class="m-l-sm"></likes-view></p>
      <p>Liked<likes-view class="m-l-sm" .likes=${1} hasLiked></likes-view></p>
      <p>Working<likes-view class="m-l-sm" .likes=${1} hasLiked isWorking></likes-view></p>
      <h3>Flexbox utils</h3>
      <div class="d-flex">
        <div class="flex-auto" style="background-color:yellow">A ${'b'.repeat(20)} A</div>
        <div class="flex-full" style="background-color:green">A ${'b'.repeat(20)} D</div>
        <div class="flex-auto" style="background-color:yellow">A ${'b'.repeat(20)} D</div>
        <div class="flex-full" style="background-color:green">A ${'b'.repeat(20)} D</div>
      </div>
    `;
  }

  private async startFullscreenSpinner() {
    appAlert.showLoadingOverlay('Loading...');
    await delay(2000);
    appAlert.hideLoadingOverlay();
  }

  private showPostEditor() {
    renderTemplateResult(
      '',
      html`<set-entity-app
        entityType=${appdef.ContentBaseType.post}
        desc="Create a new post"></set-entity-app>`,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'elements-page': ElementsPage;
  }
}
