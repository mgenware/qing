/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import ls from 'ls';

@ll.customElement('pc-item-view')
export class PCItemView extends ll.BaseElement {
  static get styles() {
    return [
      super.styles,
      ll.css`
        :host {
          display: block;
        }
      `,
    ];
  }

  @ll.string name = '';
  @ll.string link = '';
  @ll.string id = '';

  render() {
    return ll.html`
      <tr>
        <td><a href=${this.link}>${this.name}</a></td>
        <td>
          <a @click=${this.handleDeleteClick}>${ls.delete}</a>
        </td>
      </tr>
    `;
  }

  private handleDeleteClick(e: Event) {
    e.preventDefault();

    this.dispatchEvent(new CustomEvent<string>('deleteClick', { detail: this.id }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pc-item-view': PCItemView;
  }
}
