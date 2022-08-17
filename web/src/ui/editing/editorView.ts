/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, css } from 'll';
import ls from 'ls';
import coreStyles from 'app/styles/bundle';
import { KXEditor } from 'kangxi-editor';

// A wrapper around the kangxi editor.
@customElement('editor-view')
export default class EditorView extends KXEditor {
  static override get styles() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return [
      ...coreStyles,
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
        }

        .kx-content {
          flex: 1 1 auto;
        }
      `,
    ];
  }

  constructor() {
    super();

    this.localizedStrings = ls;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'editor-view': EditorView;
  }
}
