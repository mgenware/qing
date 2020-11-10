import { html, customElement } from 'lit-element';
import * as lp from 'lit-props';
import ls from 'ls';
import 'ui/editor/composerView';
import { ComposerContent, ComposerView } from 'ui/editor/composerView';
import app from 'app';
import BaseElement from 'baseElement';
import { CHECK } from 'checks';
import { GetPostSourceLoader } from './loaders/getPostSourceLoader';
import { SetPostLoader } from './loaders/setPostLoader';
import { entityPost, entityThreadMsg } from 'sharedConstants';

const composerID = 'composer';

@customElement('set-post-app')
export default class SetPostApp extends BaseElement {
  @lp.string editedID = '';
  @lp.string postTitle = '';
  @lp.number entityType = 0;
  @lp.string headerText = '';
  @lp.bool showTitleInput = true;
  @lp.string submitButtonText = '';

  // Used when `entityType` is thread msg.
  @lp.string threadID: string | undefined;

  private composerElement!: ComposerView;

  async firstUpdated() {
    const { entityType } = this;
    CHECK(entityType);
    if (entityType === entityThreadMsg) {
      if (!this.threadID) {
        throw new Error('`threadID` is required when `entityType` is thread msg');
      }
    }

    this.composerElement = this.mustGetShadowElement(composerID);
    if (this.editedID) {
      const loader = new GetPostSourceLoader(this.editedID);
      const status = await app.runGlobalActionAsync(loader);
      if (status.data) {
        const postData = status.data;
        this.updateContent(postData.title, postData.content);
      }
    }
  }

  render() {
    return html`
      <div>
        <composer-view
          .id=${composerID}
          .showTitleInput=${this.showTitleInput}
          .inputTitle=${this.postTitle}
          .entityID=${this.editedID}
          .entityType=${entityPost}
          .headerText=${this.headerText}
          .submitButtonText=${this.submitButtonText}
          @onSubmit=${this.handleSubmit}
        ></composer-view>
      </div>
    `;
  }

  private updateContent(title: string, content: string) {
    this.postTitle = title;
    this.composerElement.contentHTML = content;
    this.composerElement.markAsSaved();
  }

  private async handleSubmit(e: CustomEvent<ComposerContent>) {
    const loader = new SetPostLoader(this.editedID, e.detail, this.entityType);
    if (this.threadID) {
      loader.threadID = this.threadID;
    }
    const status = await app.runGlobalActionAsync(
      loader,
      this.editedID ? ls.saving : ls.publishing,
    );
    if (status.data) {
      this.composerElement?.markAsSaved();
      app.page.setURL(status.data);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'set-post-app': SetPostApp;
  }
}
