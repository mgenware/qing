/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css, BaseElement, lp } from 'll';
import ls from 'ls';
import 'ui/editor/composerView';
import { ComposerContent, ComposerView } from 'ui/editor/composerView';
import { CHECK } from 'checks';
import { entityPost, entityDiscussionMsg } from 'sharedConstants';
import 'qing-overlay';
import { GetEntitySourceLoader } from './loaders/getEntitySourceLoader';
import { SetPostLoader } from './loaders/setPostLoader';
import appTask from 'app/appTask';
import pageUtils from 'app/utils/pageUtils';

const composerID = 'composer';

@customElement('set-post-app')
export default class SetPostApp extends BaseElement {
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

  @lp.string postID = '';
  @lp.string postTitle = '';
  @lp.number entityType = 0;
  @lp.string headerText = '';
  @lp.bool showTitleInput = true;
  @lp.string submitButtonText = '';

  @lp.bool open = false;

  // Used when `entityType` is discussion msg.
  @lp.string discussionID: string | undefined;

  private get composerEl(): ComposerView | null {
    return this.getShadowElement(composerID);
  }

  async firstUpdated() {
    const { entityType } = this;
    CHECK(entityType);
    if (entityType === entityDiscussionMsg) {
      if (!this.discussionID) {
        throw new Error('`discussionID` is required when `entityType` is discussion msg');
      }
    }

    if (this.postID) {
      const loader = new GetEntitySourceLoader(entityPost, this.postID);
      const status = await appTask.critical(loader);
      if (status.data) {
        const postData = status.data;
        this.updateContent(postData.title ?? '', postData.contentHTML);
      }
    }
  }

  render() {
    return html`
      <qing-overlay
        class="immersive"
        ?open=${this.open}
        @openChanged=${(e: CustomEvent<boolean>) => (this.open = e.detail)}
        @escKeyDown=${this.handleEscDown}
      >
        <h2>${this.headerText}</h2>
        <composer-view
          .id=${composerID}
          .showTitleInput=${this.showTitleInput}
          .inputTitle=${this.postTitle}
          .entityID=${this.postID}
          .entityType=${entityPost}
          .submitButtonText=${this.submitButtonText}
          @onSubmit=${this.handleSubmit}
          @onDiscard=${this.handleDiscard}
        ></composer-view>
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
    const loader = new SetPostLoader(this.postID, e.detail, this.entityType);
    if (this.discussionID) {
      loader.discussionID = this.discussionID;
    }
    const status = await appTask.critical(loader, this.postID ? ls.saving : ls.publishing);
    if (status.data) {
      this.composerEl?.markAsSaved();
      pageUtils.setURL(status.data);
    }
  }

  private handleDiscard() {
    this.open = false;
  }

  private handleEscDown() {
    this.composerEl?.clickCancel();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'set-post-app': SetPostApp;
  }
}
