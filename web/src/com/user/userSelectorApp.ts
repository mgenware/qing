/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, when } from 'll';
import * as lp from 'lit-props';
import 'ui/form/inputView';
import 'ui/form/checklistView';
import ls from 'ls';
import 'ui/alerts/noticeView';
import UserInfo from './userInfo';
import 'ui/status/statusOverlay';
import LoadingStatus from 'lib/loadingStatus';
import FindUsersLoader from './loaders/findUsersLoader';
import { createPopper } from '@popperjs/core';
import './userCard';
import appTask from 'app/appTask';

const inputViewID = 'input-view';
const popoverRootID = 'popover-root';

@customElement('user-selector-app')
export class UserSelectorApp extends BaseElement {
  static override get styles() {
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
  @lp.array private users: readonly UserInfo[] = [];
  @lp.object private status = LoadingStatus.notStarted;
  @lp.bool private popoverVisible = false;
  @lp.object private selectedUser: UserInfo | null = null;

  private get inputView(): HTMLElement | null {
    return this.getShadowElement(inputViewID);
  }

  private get popoverRoot(): HTMLElement | null {
    return this.getShadowElement('popover-root');
  }

  override render() {
    const { users, selectedUser } = this;
    return html`
      <div>${ls.findUsersByColon}</div>
      ${selectedUser
        ? html`<div class="selected-user-row m-t-md">
            <qing-button
              class="vertical-align-middle"
              title=${ls.cancel}
              @click=${this.handleRemoveSelection}
              >✖</qing-button
            ><user-card class="m-l-md" .user=${selectedUser}></user-card>
          </div>`
        : html`<checklist-view
              class="m-t-md"
              @selectionChanged=${this.handleByIDSelectionChange}></checklist-view>
            <input-view
              class="m-t-md"
              id=${inputViewID}
              .showInputView=${false}
              .value=${this.value}
              debounceOnChange
              @onChange=${this.handleValueChange}
              @onChangeDebounced=${this.handleValueChangeDebounced}></input-view>
            <status-overlay
              id=${popoverRootID}
              .status=${this.status}
              style=${`visibility: ${this.popoverVisible ? 'visible' : 'collapse'}`}>
              <div class="list-view">
                ${users.length
                  ? users.map((item) => this.renderUserRow(item))
                  : when(
                      this.status.isWorking,
                      () => html`<div class="no-result-row">${ls.noResultsFound}</div>`,
                    )}
              </div>
            </status-overlay>`}
    `;
  }

  private renderUserRow(user: UserInfo) {
    return html`
      <a class="user-row" href="#" @click=${() => this.handleUserRowClick(user)}>
        <user-card .user=${user}></user-card>
      </a>
    `;
  }

  private async handleByIDSelectionChange(e: CustomEvent<number[]>) {
    this.byID = e.detail[0] === 0;
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
    if (this.popoverVisible || !this.inputView || !this.popoverRoot) {
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

  private handleUserRowClick(user: UserInfo) {
    this.selectedUser = user;
    this.popoverVisible = false;
    this.onSelectionChanged(user);
  }

  private onSelectionChanged(detail: UserInfo | null) {
    this.dispatchEvent(new CustomEvent<UserInfo | null>('selectionChanged', { detail }));
  }

  private async handleValueChangeDebounced() {
    await this.startRequestAsync();
  }

  private handleRemoveSelection() {
    this.selectedUser = null;
    this.onSelectionChanged(null);
  }

  private async startRequestAsync() {
    const { value } = this;
    if (!value) {
      return;
    }
    const loader = new FindUsersLoader(this.byID, value);
    const res = await appTask.local(loader, (st) => (this.status = st));
    if (res.data) {
      this.users = res.data;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'user-selector-app': UserSelectorApp;
  }
}
