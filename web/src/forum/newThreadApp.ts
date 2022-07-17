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

@customElement('new-thread-app')
export class NewThreadApp extends BaseElement {
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

  @property({ type: Boolean }) threadTypeDialogOpen = false;

  override render() {
    return html`
      <p>
        <qing-button btnStyle="success" @click=${this.handleNewThreadClick}
          >${ls.newThread}</qing-button
        >
      </p>
      <qing-overlay ?open=${this.threadTypeDialogOpen} @escKeyDown=${this.closeThreadTypeModal}>
        <p>
          <qing-button @click=${this.newThreadClick}>${ls.newThread}</qing-button>
        </p>
        <div class="text-center">
          <div style="margin-top: 1.2rem">
            <qing-button class="dialog-btn" @click=${this.closeThreadTypeModal}
              >${ls.close}</qing-button
            >
          </div>
        </div>
      </qing-overlay>
    `;
  }

  private closeThreadTypeModal() {
    this.threadTypeDialogOpen = false;
  }

  private handleNewThreadClick() {
    this.threadTypeDialogOpen = true;
  }

  private newThreadClick() {
    this.closeThreadTypeModal();
    runNewEntityCommand(appdef.contentBaseTypeThread, wind.FID);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'new-thread-app': NewThreadApp;
  }
}
