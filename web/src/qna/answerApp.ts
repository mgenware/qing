/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css, BaseElement, lp } from 'll';
import 'com/cmt/cmtApp';
import { entityAnswer } from 'sharedConstants';

@customElement('answer-app')
export class AnswerApp extends BaseElement {
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

  @lp.number initialLikes = 0;
  // Intentionally set as a number as server bool values are easy
  // to passed down as numbers when set as attributes.
  // See `questionView.html`.
  @lp.number initialHasLiked = 0;
  @lp.number initialCmtCount = 0;
  @lp.number initialAnsCount = 0;
  @lp.string eid = '';

  render() {
    return html`
      <div>
        <slot></slot>
        <div class="m-t-md">
          <like-app
            .iconSize=${'md'}
            .initialLikes=${this.initialLikes}
            .initialHasLiked=${!!this.initialHasLiked}
            .hostID=${this.eid}
            .hostType=${entityAnswer}
          ></like-app>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'answer-app': AnswerApp;
  }
}