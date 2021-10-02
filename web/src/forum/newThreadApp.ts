/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import ls from 'ls';
import 'qing-overlay';
import wind from './forumWind';
import { entityQuestion } from 'sharedConstants';
import { runNewEntityCommand } from 'app/appCommands';

@ll.customElement('new-thread-app')
export class NewThreadApp extends ll.BaseElement {
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

  @ll.bool threadTypeDialogOpen = false;

  render() {
    return ll.html`
      <p>
        <qing-button btnStyle="success" @click=${this.handleNewThreadClick}
          >${ls.newThread}</qing-button
        >
      </p>
      <qing-overlay ?open=${this.threadTypeDialogOpen} @escKeyDown=${this.closeThreadTypeModal}>
        <p>
          <qing-button>${ls.newDiscussion}</qing-button>
          <qing-button @click=${this.newQuestionClick}>${ls.newQuestion}</qing-button>
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

  private newQuestionClick() {
    this.closeThreadTypeModal();
    runNewEntityCommand(entityQuestion, wind.FID);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'new-thread-app': NewThreadApp;
  }
}
