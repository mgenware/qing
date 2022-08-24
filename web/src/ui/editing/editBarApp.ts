/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, property, state } from 'll';
import ls from 'ls';
import appPageState from 'app/appPageState';

@customElement('edit-bar-app')
export class EditBarApp extends BaseElement {
  @property() uid = '';
  @state() private visible = false;

  override firstUpdated() {
    const cur = appPageState.userEID;
    this.visible = !!cur && cur === this.uid;
  }

  override render() {
    if (!this.visible) {
      return html``;
    }
    return html`
      <span>
        <link-button @click=${this.handleEditClick}>${ls.edit}</link-button>
        <link-button class="m-l-md" @click=${this.handleDeleteClick}>${ls.delete}</link-button>
      </span>
    `;
  }

  private handleEditClick(e: Event) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent<undefined>('edit-bar-edit-click'));
  }

  private handleDeleteClick(e: Event) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent<undefined>('edit-bar-delete-click'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'edit-bar-app': EditBarApp;
  }
}
