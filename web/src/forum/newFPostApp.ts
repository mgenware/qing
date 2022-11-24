/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll';
import ls from 'ls';
import 'qing-overlay';
import wind from './forumWind';
import { appdef } from '@qing/def';
import { runNewEntityCommand } from 'app/appCommands';

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
          >${ls.newFPost}</qing-button
        >
      </p>
      <qing-overlay ?open=${this.fpostTypeDialogOpen} @overlay-esc-down=${this.closeFPostTypeModal}>
        <p>
          <qing-button @click=${this.newFPostClick}>${ls.newFPost}</qing-button>
        </p>
        <div class="text-center">
          <div style="margin-top: 1.2rem">
            <qing-button class="dialog-btn" @click=${this.closeFPostTypeModal}
              >${ls.close}</qing-button
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
    runNewEntityCommand(appdef.ContentBaseType.fPost, wind.FID);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'new-fpost-app': NewFPostApp;
  }
}
