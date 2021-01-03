import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import 'ui/form/inputView';
import 'ui/form/selectionView';
import ls from 'ls';
import 'ui/alerts/noticeView';
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
          border: 1px solid var(--app-default-separator-color);
          min-width: 200px;
          max-width: 100%;
        }

        .no-result-row {
          padding: 0.7rem 1rem;
          font-size: 1.2rem;
          color: var(--app-default-secondary-fore-color);
        }

        .user-row {
          cursor: pointer;
          display: block;
          padding: 0.2rem 0.4rem;
        }
        .user-row:hover {
          background-color: var(--app-primary-back-color);
          color: var(--app-primary-fore-color);
          /** Reset the default brightness filter in app.css */
          filter: none;
        }

        .selected-user-row {
          font-size: 1rem;
          max-width: 100%;
          width: 100%;
          margin-bottom: 0.8rem;
          line-height: 1.5;
          background-color: transparent;
          color: var(--app-default-fore-color);
          border: 1px solid var(--app-default-separator-color);
          padding: 0.35rem 0.6rem;
          border-radius: 5px;
        }
      `,
    ];
  }

  @lp.bool byID = true;
  @lp.string value = '';
  @lp.array private users: UserInfo[] = [];
  @lp.object private status = LoadingStatus.empty;
  @lp.bool private popoverVisible = false;
  @lp.object private selectedUser: UserInfo | null = null;

  private get inputView(): HTMLElement {
    return this.mustGetShadowElement('input-view');
  }

  private get popoverRoot(): HTMLElement {
    return this.mustGetShadowElement('popover-root');
  }

  render() {
    const { users, selectedUser } = this;
    return html`
      <div>${ls.findUsersByColon}</div>
      ${selectedUser
        ? html`<div class="selected-user-row m-t-md">
            <qing-button class="vertical-align-middle" @click=${this.handleRemoveSelection}
              >✖</qing-button
            ><user-card class="m-l-md" .user=${selectedUser}></user-card>
          </div>`
        : html`<selection-view
            class="m-t-md"
            .dataSource=${[{ text: ls.userID, checked: true }, { text: ls.name }]}
            @onSelectionChange=${this.handleByIDSelectionChange}
          ></selection-view>`}
      <input-view
        class="m-t-md"
        id="input-view"
        style=${`visibility: ${selectedUser ? 'collapse' : 'visible'}`}
        .showInputView=${false}
        .value=${this.value}
        debounceOnChange
        @onChange=${this.handleValueChange}
        @onChangeDebounced=${this.handleValueChangeDebounced}
      ></input-view>
      <status-overlay
        id="popover-root"
        .status=${this.status}
        style=${`visibility: ${this.popoverVisible ? 'visible' : 'collapse'}`}
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
      <a class="user-row" href="#" @click=${() => this.handleUserRowClick(user)}>
        <user-card .user=${user}></user-card>
      </a>
    `;
  }

  private async handleByIDSelectionChange(e: SelectionViewItemEvent) {
    this.byID = e.index === 0;
    await this.startRequestAsync();
  }

  private handleValueChange(e: CustomEvent<string>) {
    this.value = e.detail;
    if (this.value) {
      this.showPopoverIfNeeded();
    } else {
      this.popoverVisible = false;
    }
  }

  private showPopoverIfNeeded() {
    if (this.popoverVisible) {
      return;
    }
    document.addEventListener(
      'click touchend',
      (_) => {
        // TODO: Dismiss popover.
      },
      { once: true },
    );
    createPopper(this.inputView, this.popoverRoot, {
      strategy: 'fixed',
      placement: 'bottom',
    });
    this.popoverVisible = true;
  }

  private async handleUserRowClick(user: UserInfo) {
    this.selectedUser = user;
    this.popoverVisible = false;
  }

  private async handleValueChangeDebounced() {
    await this.startRequestAsync();
  }

  private handleRemoveSelection() {
    this.selectedUser = null;
  }

  private async startRequestAsync() {
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
