/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import ls from 'ls';
import appPageState from 'app/appPageState';

export function editBarID(type: number, id: string): string {
  // IMPORTANT: changes to this format can break HTML templates.
  return `edit-bar-${type}-${id}`;
}

@ll.customElement('edit-bar-app')
export class EditBarApp extends ll.BaseElement {
  @ll.string uid = '';
  @ll.bool private visible = false;

  firstUpdated() {
    const cur = appPageState.userEID;
    this.visible = !!cur && cur === this.uid;
  }

  render() {
    if (!this.visible) {
      return ll.html``;
    }
    return ll.html`
      <span>
        <a href="#" @click=${this.handleEditClick}>${ls.edit}</a>
        <a class="m-l-sm" href="#" @click=${this.handleDeleteClick}>${ls.delete}</a>
      </span>
    `;
  }

  private handleEditClick(e: Event) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent<undefined>('editClick'));
  }

  private handleDeleteClick(e: Event) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent<undefined>('deleteClick'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'edit-bar-app': EditBarApp;
  }
}
