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
import { CHECK } from 'checks';
import 'qing-overlay';
import { GetEntitySourceLoader } from './loaders/getEntitySourceLoader';
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

  @property() postID = '';
  @property() postTitle = '';
  @property({ type: Number }) entityType = 0;
  @property() headerText = '';
  @property({ type: Boolean }) showTitleInput = true;
  @property() submitButtonText = '';
  @property() forumID = '';

  @property({ type: Boolean }) open = false;
  @property({ type: Boolean }) autoClose = false;

  private get composerEl(): ComposerView | null {
    return this.getShadowElement(composerID);
  }

  override async firstUpdated() {
    const { entityType } = this;
    CHECK(entityType);

    if (this.postID) {
      const loader = new GetEntitySourceLoader({ type: this.entityType, id: this.postID });
      const status = await appTask.critical(loader);
      if (status.data) {
        const postData = status.data;
        this.updateContent(postData.title ?? '', postData.contentHTML ?? '');
      }
    }
  }

  override render() {
    return html`
      <qing-overlay
        class="immersive"
        ?open=${this.open}
        @overlay-open=${() => (this.open = true)}
        @overlay-close=${() => (this.open = false)}
        @escKeyDown=${this.handleEscDown}>
        <h2>${this.headerText}</h2>
        <composer-view
          .id=${composerID}
          .showTitleInput=${this.showTitleInput}
          .inputTitle=${this.postTitle}
          .entityID=${this.postID}
          .entityType=${this.entityType}
          .submitButtonText=${this.submitButtonText}
          @onSubmit=${this.handleSubmit}
          @onCancel=${this.handleCancel}></composer-view>
      </qing-overlay>
    `;
  }

  private updateContent(title: string, contentHTML: string) {
    const { composerEl } = this;
    this.postTitle = title;
    if (composerEl) {
      composerEl.setContentHTML(contentHTML, false);
      composerEl.markAsSaved();
    }
  }

  private async handleSubmit(e: CustomEvent<ComposerContent>) {
    const loader = new SetEntityLoader(this.postID, e.detail, this.entityType, this.forumID);
    const status = await appTask.critical(loader, this.postID ? ls.saving : ls.publishing);
    if (status.isSuccess) {
      this.composerEl?.markAsSaved();
      if (status.data) {
        pu.setURL(status.data);
      } else {
        pu.reload();
      }
    }
  }

  private handleCancel() {
    if (this.autoClose) {
      this.open = false;
    } else {
      this.dispatchEvent(new CustomEvent('onEditorClose'));
    }
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
