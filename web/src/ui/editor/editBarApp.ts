/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import { html, customElement } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import ls from 'ls';
import app from 'app';

export function getEditBarID(type: number, id: string): string {
  return `edit-bar-${type}-${id}`;
}

@customElement('edit-bar-app')
export class EditBarApp extends BaseElement {
  @lp.bool private visible = false;

  firstUpdated() {
    const { id } = this;
    this.visible = app.state.hasUser && app.state.userEID === this.parseUID(id);
  }

  render() {
    if (!this.visible) {
      return html``;
    }
    return html`
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

  private parseUID(s: string | undefined): string {
    if (!s) {
      return '';
    }
    const lastSep = s.lastIndexOf('-');
    return s.substr(lastSep + 1);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'edit-bar-app': EditBarApp;
  }
}
