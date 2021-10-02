/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import ls from 'ls';
import { CHECK } from 'checks';
import { parseString } from 'narwhal-js';
import appPageState from 'app/appPageState';
import { entityAnswer } from 'sharedConstants';
import 'com/postCore/setEntityApp';
import wind from './questionWind';

CHECK(wind.ForumID);

@ll.customElement('add-answer-app')
export class AddAnswerApp extends ll.BaseElement {
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

  @ll.string myAnswerURL = '';
  @ll.bool isMyAnswer = false;
  @ll.bool answerDialogOpen = false;

  render() {
    // Render "login to answer" for visitors.
    if (!appPageState.user) {
      return this.renderLoginToAddYourAnswer();
    }

    // Render nothing if current page is my answer.
    if (this.isMyAnswer) {
      return '';
    }

    // Render "go to my answer" button if `myAnswerURL` is not empty.
    if (this.myAnswerURL) {
      return ll.html`<qing-button btnStyle="primary">${ls.goToMyAnswer}</qing-button>`;
    }

    // Render "post an answer".
    return ll.html`<qing-button btnStyle="success" @click=${this.handlePostAnAnswerClick}
        >${ls.postAnAnswer}</qing-button
      >
      <set-entity-app
        ?open=${this.answerDialogOpen}
        .showTitleInput=${false}
        entityType=${entityAnswer}
        headerText=${ls.postAnAnswer}
        .forumID=${wind.ForumID}
        .questionID=${wind.QuestionID}
        @editorClose=${this.handleAnswerDialogClose}></set-entity-app>`;
  }

  private renderLoginToAddYourAnswer() {
    return ll.html`
      <div>
        ${parseString(ls.postAnAnswer).map((sg) => {
          if (!sg.type) {
            return ll.html`<span>${sg.value}</span>`;
          }
          return ll.html`<qing-button btnStyle="success" class="m-l-xs m-r-xs"
            >${sg.value}</qing-button
          >`;
        })}
      </div>
    `;
  }

  private handlePostAnAnswerClick() {
    this.answerDialogOpen = true;
  }

  private handleAnswerDialogClose() {
    this.answerDialogOpen = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-answer-app': AddAnswerApp;
  }
}
