/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

/* eslint-disable no-alert */
import { BaseElement, customElement, html, css, state } from 'll.js';
import 'qing-button';
import 'ui/alerts/alertView.js';
import 'ui/alerts/sectionView.js';
import 'ui/content/headingView.js';
import 'ui/status/spinnerView.js';
import 'ui/status/statusView.js';
import 'ui/status/statusOverlay.js';
import 'ui/forms/inputView.js';
import 'ui/forms/selectView.js';
import 'ui/lists/linkListView.js';
import 'ui//editing/composerView.js';
import 'ui/editing/coreEditor.js';
import 'com/like/likesView';
import 'com/postCore/setEntityApp';
import LoadingStatus from 'lib/loadingStatus.js';
import { linkListActiveClass, linkListActiveFilledClass } from 'ui/lists/linkListView.js';
import { renderTemplateResult } from 'lib/htmlLib.js';
import { frozenDef } from '@qing/def';
import appAlert from 'app/appAlert.js';
import appSpinner from 'app/appSpinner.js';
import ErrorWithCode from 'lib/errorWithCode.js';
import delay from 'lib/delay.js';
import { CheckListChangeArgs, CheckListItem } from 'ui/forms/checkList.js';

const workingStatus = LoadingStatus.working;
const errorStatus = LoadingStatus.error(new ErrorWithCode('Example error', 1));

const immersiveDialogID = 'qing-overlay-immersive';

enum ChecklistKey {
  zhang,
  chen,
  liu,
  zheng,
}
const checklistItems: CheckListItem[] = [
  { key: ChecklistKey.zhang, text: 'Zhang' },
  { key: ChecklistKey.chen, text: 'Chen' },
  { key: ChecklistKey.liu, text: 'Liu' },
  { key: ChecklistKey.zheng, text: 'Zheng' },
];

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

        .flex-grow {
          flex-grow: 1;
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

        .editor-size {
          height: 300px;
        }

        .overlay-fixed-content {
          height: 300px;
          border: 1px solid gray;
        }
      `,
    ];
  }

  @state() _checklistSelectedItems1: readonly ChecklistKey[] = [ChecklistKey.liu];
  @state() _checklistSelectedItems2?: ChecklistKey;
  @state() _selectedCheckmarks = new Set<ChecklistKey>();

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
      <h2>Checkbox list</h2>
      <check-list
        @checklist-change=${(e: CustomEvent<CheckListChangeArgs>) =>
          (this._checklistSelectedItems1 = e.detail.selectedItems())}
        class="m-t-md"
        multiSelect
        .selectedItems=${this._checklistSelectedItems1}
        .items=${checklistItems}></check-list>
      <h2>Radiobox list</h2>
      <check-list
        @checklist-change=${(e: CustomEvent<CheckListChangeArgs>) =>
          (this._checklistSelectedItems2 = e.detail.selectedItem())}
        class="m-t-md"
        .selectedItems=${[this._checklistSelectedItems2]}
        .items=${checklistItems}></check-list>
      <p>
        <select-view .dataSource=${checklistItems}></select-view>
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
      <h2>Status view</h2>
      <status-view .status=${workingStatus}></status-view>
      <status-view .status=${errorStatus}></status-view>
      <h3>'progressViewPadding' = 'md'</h3>
      <status-view .status=${workingStatus} .progressViewPadding=${'md'}></status-view>
      <status-view .status=${errorStatus} .progressViewPadding=${'md'}></status-view>
      <h2>Status overlay</h2>
      <h3>Auto-height</h3>
      <status-overlay .status=${workingStatus}>
        <h1>heading 1</h1>
        <p>text text text text text text text text text text</p>
      </status-overlay>
      <status-overlay .status=${errorStatus}>
        <h1>heading 1</h1>
        <p>text text text text text text text text text text</p>
      </status-overlay>
      <h3>Full-height</h3>
      <status-overlay .status=${workingStatus}>
        <div class="overlay-fixed-content">
          <h1>heading 1</h1>
          <p>text text text text text text text text text text</p>
        </div>
      </status-overlay>
      <status-overlay .status=${errorStatus}>
        <div class="overlay-fixed-content">
          <h1>heading 1</h1>
          <p>text text text text text text text text text text</p>
        </div>
      </status-overlay>
      <h2>Misc</h2>
      <h3>Like Views</h3>
      <p>Default<likes-view class="m-l-sm"></likes-view></p>
      <p>Liked<likes-view class="m-l-sm" .likes=${1} hasLiked></likes-view></p>
      <p>Working<likes-view class="m-l-sm" .likes=${1} hasLiked isWorking></likes-view></p>
      <h2>Editors</h2>
      <h3>SD Editor</h3>
      <core-editor class="editor-size" editormode="standard"></core-editor>
      <h3>MD Editor</h3>
      <core-editor class="editor-size" editormode="markdown"></core-editor>
      <h3>Composer</h3>
      <composer-view .desc=${'Test'} class="editor-size"></composer-view>
      <h3>Composer (loading)</h3>
      <composer-view class="editor-size" .brLoadingDelay=${true}></composer-view>
    `;
  }

  private async startFullscreenSpinner() {
    appSpinner.showLoadingOverlay('Loading...');
    await delay(2000);
    appSpinner.hideLoadingOverlay();
  }

  private showPostEditor() {
    renderTemplateResult(
      '',
      html`<set-entity-app
        entityType=${frozenDef.ContentBaseType.post}
        desc="Create a new post"></set-entity-app>`,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'elements-page': ElementsPage;
  }
}
