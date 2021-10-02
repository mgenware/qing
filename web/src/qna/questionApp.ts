/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import 'com/cmt/cmtApp';
import { entityQuestion } from 'sharedConstants';
import { CHECK } from 'checks';

// Handles rendering of question votes and comments.
@ll.customElement('question-app')
export class QuestionApp extends ll.BaseElement {
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

  @ll.number initialLikes = 0;
  // Intentionally set as a number as server bool values are easy
  // to passed down as numbers when set as attributes.
  // See `questionView.html`.
  @ll.number initialHasLiked = 0;
  @ll.number initialCmtCount = 0;
  @ll.number initialAnsCount = 0;
  @ll.string eid = '';

  firstUpdated() {
    CHECK(this.eid);
  }

  render() {
    return ll.html`
      <div>
        <slot></slot>
        <div class="m-t-md">
          <like-app
            .iconSize=${'md'}
            .initialLikes=${this.initialLikes}
            .initialHasLiked=${!!this.initialHasLiked}
            .hostID=${this.eid}
            .hostType=${entityQuestion}></like-app>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'question-app': QuestionApp;
  }
}
