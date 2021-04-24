/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css, BaseElement, lp } from 'll';
import ls from 'ls';

@customElement('pc-item-view')
export class PCItemView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  @lp.string name = '';
  @lp.string link = '';
  @lp.string id = '';

  render() {
    return html`
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

    this.dispatchEvent(
      new CustomEvent<string>('deleteClick', { detail: this.id }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pc-item-view': PCItemView;
  }
}
