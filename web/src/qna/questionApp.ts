/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import 'com/cmt/cmtApp';

// Handles rendering of question votes and comments.
@customElement('question-app')
export class QuestionApp extends BaseElement {
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

  @lp.number initialVotes = 0;
  @lp.number initialUpVotes = 0;
  @lp.number initialDownVotes = 0;
  @lp.number initialCmtCount = 0;
  @lp.number initialAnsCount = 0;

  render() {
    return html`
      <div class="row">
        <div class="col-md-auto"></div>
        <div class="col"><slot></slot></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'question-app': QuestionApp;
  }
}
