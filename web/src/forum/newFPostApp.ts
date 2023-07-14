/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll.js';
import 'qing-overlay';
import pageState from './forumPageState.js';
import { frozenDef } from '@qing/def';
import { runNewEntityCommand } from 'app/appCommands.js';

@customElement('new-fpost-app')
export class NewFPostApp extends BaseElement {
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

  @property({ type: Boolean }) fpostTypeDialogOpen = false;

  override render() {
    return html`
      <p>
        <qing-button btnStyle="success" @click=${this.handleNewFPostClick}
          >${globalThis.coreLS.newFPost}</qing-button
        >
      </p>
      <qing-overlay ?open=${this.fpostTypeDialogOpen} @overlay-esc-down=${this.closeFPostTypeModal}>
        <p>
          <qing-button @click=${this.newFPostClick}>${globalThis.coreLS.newFPost}</qing-button>
        </p>
        <div class="text-center">
          <div style="margin-top: 1.2rem">
            <qing-button class="dialog-btn" @click=${this.closeFPostTypeModal}
              >${globalThis.coreLS.close}</qing-button
            >
          </div>
        </div>
      </qing-overlay>
    `;
  }

  private closeFPostTypeModal() {
    this.fpostTypeDialogOpen = false;
  }

  private handleNewFPostClick() {
    this.fpostTypeDialogOpen = true;
  }

  private newFPostClick() {
    this.closeFPostTypeModal();
    runNewEntityCommand(frozenDef.ContentBaseType.fPost, pageState.FID);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'new-fpost-app': NewFPostApp;
  }
}
