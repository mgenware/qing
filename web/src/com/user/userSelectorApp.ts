import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import 'ui/form/inputView';
import 'ui/form/selectionView';
import ls from 'ls';
import 'ui/content/noticeView';
import UserInfo from './userInfo';
import 'ui/status/statusOverlay';
import LoadingStatus from 'lib/loadingStatus';
import FindUsersLoader from './loaders/findUsersLoader';
import { SelectionViewItemEvent } from 'ui/form/selectionView';
import app from 'app';
import { createPopper } from '@popperjs/core';
import './userCard';

@customElement('user-selector-app')
export class UserSelectorApp extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .list-view {
          max-height: 300px;
          overflow-y: auto;
        }

        #popover-root {
          border: 1px solid var(--default-separator-color);
          min-width: 200px;
          max-width: 100%;
        }

        .no-result-row {
          padding: 0.7rem 1rem;
          font-size: 1.2rem;
          color: var(--default-secondary-fore-color);
        }
      `,
    ];
  }

  @lp.bool byID = true;
  @lp.string value = '';
  @lp.array private users: UserInfo[] = [];
  @lp.object private status = LoadingStatus.empty;
  @lp.bool private popperVisible = false;

  private inputView!: HTMLElement;
  private popoverRoot!: HTMLElement;

  firstUpdated() {
    this.inputView = this.mustGetShadowElement('input-view');
    this.popoverRoot = this.mustGetShadowElement('popover-root');
  }

  render() {
    const { users } = this;
    return html`
      <div>${ls.findUsersByColon}</div>
      <div>
        <selection-view
          .dataSource=${[{ text: ls.userID, selected: true }, { text: ls.name }]}
          @onSelectionChange=${this.handleByIDSelectionChange}
        ></selection-view>
      </div>
      <input-view
        id="input-view"
        required
        .showInputView=${false}
        .value=${this.value}
        debounceOnChange
        @onChange=${this.handleValueChange}
        @onChangeDebounced=${this.handleValueChangeDebounced}
      ></input-view>
      <status-overlay
        id="popover-root"
        .status=${this.status}
        style=${`visibility: ${this.popperVisible ? 'visible' : 'collapse'}`}
      >
        <div class="list-view">
          ${users.length
            ? users.map((item) => this.renderUserRow(item))
            : html`<div class="no-result-row">${ls.noResultsFound}</div>`}
        </div>
      </status-overlay>
    `;
  }

  private renderUserRow(user: UserInfo) {
    return html`
      <div>
        <a>
          <user-card .user=${user}></user-card>
        </a>
      </div>
    `;
  }

  private handleByIDSelectionChange(e: SelectionViewItemEvent) {
    this.byID = e.index === 0;
  }

  private handleValueChange(e: CustomEvent<string>) {
    this.value = e.detail;
    if (this.value) {
      this.showPopoverIfNeeded();
    } else {
      this.popperVisible = false;
    }
  }

  private showPopoverIfNeeded() {
    if (this.popperVisible) {
      return;
    }
    document.addEventListener(
      'click touchend',
      (e) => {
        console.log('Touch end target', e.target);
      },
      { once: true },
    );
    createPopper(this.inputView, this.popoverRoot, {
      strategy: 'fixed',
      placement: 'bottom',
    });
    this.popperVisible = true;
  }

  private async handleValueChangeDebounced() {
    const { value } = this;
    if (!value) {
      return;
    }
    const loader = new FindUsersLoader(this.byID, value);
    const res = await app.runLocalActionAsync(loader, (st) => (this.status = st));
    if (res.data) {
      this.users = res.data;
      if (app.devMode) {
        // DEBUG: Add more users.
        this.users = [...this.users, ...this.users, ...this.users, ...this.users];
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'user-selector-app': UserSelectorApp;
  }
}
