/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll';
import ls from 'ls';
import 'ui/editing/composerView';
import { ComposerContent, ComposerView } from 'ui/editing/composerView';
import 'qing-overlay';
import { SetEntityLoader } from './loaders/setEntityLoader';
import appTask from 'app/appTask';
import * as pu from 'app/utils/pageUtils';

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
  @property() forumID = '';

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

  private async handleSubmit(e: CustomEvent<ComposerContent>) {
    const loader = new SetEntityLoader(
      this.entityID ?? null,
      e.detail,
      this.entityType,
      this.forumID,
    );
    const status = await appTask.critical(loader, this.entityID ? ls.saving : ls.publishing);
    if (status.isSuccess) {
      this.composerEl?.markAsSaved();
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
