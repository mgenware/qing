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

export function getEditBarID(type: number, id: string): string {
  return `edit-bar-${type}-${id}`;
}

@customElement('edit-bar')
export class EditBar extends BaseElement {
  @lp.bool hasLeftMargin = false;

  render() {
    return html`
      <span class="${this.hasLeftMargin ? 'm-l-sm' : ''}">
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
