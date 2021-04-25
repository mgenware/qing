/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, property, css, BaseElement } from 'll';
import { ifDefined } from 'lit/directives/if-defined.js';

@customElement('progress-view')
export default class ProgressView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
        }
      `,
    ];
  }

  @property({ type: Number }) progress = 0;

  render() {
    const { progress } = this;
    return html`
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
