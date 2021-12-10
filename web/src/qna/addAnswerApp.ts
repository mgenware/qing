/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';
import * as lp from 'lit-props';
import ls from 'ls';
import { parseString } from 'narwhal-js';
import appPageState from 'app/appPageState';
import { entityAnswer } from 'sharedConstants';
import 'com/postCore/setEntityApp';
import wind from './qnaWind';

@customElement('add-answer-app')
export class AddAnswerApp extends BaseElement {
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

  @lp.string myAnswerURL = '';
  @lp.bool isMyAnswer = false;
  @lp.bool answerDialogOpen = false;

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
      return html`<qing-button btnStyle="primary">${ls.goToMyAnswer}</qing-button>`;
    }

    // Render "post an answer".
    return html`<qing-button btnStyle="success" @click=${this.handlePostAnAnswerClick}
        >${ls.postAnAnswer}</qing-button
      >
      <set-entity-app
        ?open=${this.answerDialogOpen}
        .showTitleInput=${false}
        entityType=${entityAnswer}
        headerText=${ls.postAnAnswer}
        .forumID=${wind.forumID || ''}
        .questionID=${wind.questionID}
        @editorClose=${this.handleAnswerDialogClose}></set-entity-app>`;
  }

  private renderLoginToAddYourAnswer() {
    return html`
      <div>
        ${parseString(ls.postAnAnswer).map((sg) => {
          if (!sg.type) {
            return html`<span>${sg.value}</span>`;
          }
          return html`<qing-button btnStyle="success" class="m-l-xs m-r-xs"
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
