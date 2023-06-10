/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll.js';
import 'ui/editing/composerView.js';
import { ComposerView } from 'ui/editing/composerView.js';
import 'qing-overlay';
import { SetEntityLoader } from './loaders/setEntityLoader.js';
import appTask from 'app/appTask.js';
import * as pu from 'lib/pageUtil.js';
import { CHECK } from 'checks.js';
import { PostCorePayload } from 'sod/post.js';

const composerID = 'composer';

@customElement('set-entity-app')
export default class SetEntityApp extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  @property() entityID?: string;
  @property({ type: Number }) entityType = 0;
  @property() desc = '';
  @property({ type: Boolean }) hasTitle = true;
  @property() submitButtonText = '';
  @property() forumID?: string;

  private get composerEl(): ComposerView | null {
    return this.getShadowElement(composerID);
  }

  override render() {
    return html`
      <qing-overlay class="immersive" open @overlay-esc-down=${this.handleEscDown}>
        <composer-view
          .id=${composerID}
          .desc=${this.desc}
          .hasTitle=${this.hasTitle}
          .entity=${this.entityID ? { id: this.entityID, type: this.entityType } : undefined}
          .submitButtonText=${this.submitButtonText}
          @composer-submit=${this.handleSubmit}
          @composer-discard=${this.handleDiscard}></composer-view>
      </qing-overlay>
    `;
  }

  private async handleSubmit(e: CustomEvent<PostCorePayload>) {
    CHECK(this.composerEl);
    const editorImpl = this.composerEl.unsafeEditorImplEl;
    CHECK(editorImpl);

    const loader = new SetEntityLoader({
      content: e.detail,
      entityType: this.entityType,
      forumID: this.forumID,
      id: this.entityID,
    });
    const status = await appTask.critical(
      loader,
      this.entityID ? globalThis.coreLS.saving : globalThis.coreLS.publishing,
    );
    if (status.isSuccess) {
      this.composerEl.markAsSaved(editorImpl);
      if (status.data) {
        pu.setURL(status.data);
      } else {
        pu.reload();
      }
    }
  }

  private handleDiscard() {
    this.remove();
  }

  private handleEscDown() {
    return this.composerEl?.clickCancel();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'set-entity-app': SetEntityApp;
  }
}
