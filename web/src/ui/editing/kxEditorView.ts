/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, css } from 'll.js';
import { KXEditor } from 'kangxi-editor';
import coreStyles from 'qing-css-base';

// A wrapper around the kangxi editor.
@customElement('kx-editor-view')
export default class KXEditorView extends KXEditor {
  static override get styles() {
    return [
      coreStyles,
      super.styles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          /** Make sure it stretches to parent height */
          flex: 1 1 auto;
        }

        .kx-editor {
          border: 1px solid var(--app-default-separator-color);
          --kx-back-color: var(--app-default-back-color);
          --kx-fore-color: var(--app-default-fore-color);
          --kx-toolbar-separator-color: var(--app-default-separator-color);

          display: flex;
          flex-direction: column;
          /** Make sure it stretches to parent height */
          flex: 1 1 auto;
          min-height: 0;
        }

        .kx-content {
          flex: 1 1 auto;
        }
      `,
    ];
  }

  constructor() {
    super();

    this.localizedStrings = globalThis.coreLS;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kx-editor-view': KXEditorView;
  }
}
