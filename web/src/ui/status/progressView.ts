/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import { ifDefined } from 'lit/directives/if-defined.js';

@ll.customElement('progress-view')
export default class ProgressView extends ll.BaseElement {
  static get styles() {
    return [
      super.styles,
      ll.css`
        :host {
          display: inline-block;
        }
      `,
    ];
  }

  @ll.number progress = 0;

  render() {
    const { progress } = this;
    return ll.html`
      <progress value=${ifDefined(progress < 0 ? undefined : progress.toString())} max="100">
        ${progress} %
      </progress>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'progress-view': ProgressView;
  }
}
