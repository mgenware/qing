/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property, state } from 'll.js';
import './views/rootCmtList';
import Entity from 'lib/entity.js';
import { CHECK } from 'checks.js';
import 'qing-overlay';
import 'ui/editing/composerView.js';
import { Cmt } from './data/cmt.js';
import { ItemsChangedEvent } from 'lib/itemCollector.js';
import { CmtFocusModeData } from 'sod/cmt.js';

@customElement('cmt-app')
export class CmtApp extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  @property({ type: Number }) initialTotalCmtCount = 0;
  @property({ type: Object }) host!: Entity;
  @property({ type: Object }) focusModeData?: CmtFocusModeData;

  // The number of all comments and their replies.
  @state() private _totalCmtCount = 0;

  override firstUpdated() {
    CHECK(this.host);
    this._totalCmtCount = this.initialTotalCmtCount;
  }

  override render() {
    return html`
      <root-cmt-list
        .totalCmtCount=${this._totalCmtCount}
        .host=${this.host}
        .focusModeData=${this.focusModeData}
        @cmt-block-items-change=${this.handleAnyItemsChanged}
        @rcl-view-all-cmts=${() =>
          this.dispatchEvent(new CustomEvent('cmt-app-view-all-cmts'))}></root-cmt-list>
    `;
  }

  // Handles all `cmt-block-items-change` events from descendants.
  // This is to track cmt count changes.
  private handleAnyItemsChanged(e: CustomEvent<ItemsChangedEvent<Cmt>>) {
    e.stopPropagation();
    const change = e.detail;
    if (!change.changedByLoading) {
      this._totalCmtCount += change.detail.countDelta;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-app': CmtApp;
  }
}
