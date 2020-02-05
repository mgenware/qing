import { html, customElement } from 'lit-element';
import * as lp from 'lit-props';
import ls from 'ls';
import 'ui/editor/composerView';
import { ComposerPayload, ComposerView } from 'ui/editor/composerView';
import app from 'app';
import SetPostLoader from './loaders/setPostLoader';
import BaseElement from 'baseElement';
import { EntityType } from 'lib/entity';
import { GetPostSourceLoader } from './loaders/getPostSourceLoader';

const composerID = 'composer';

@customElement('set-post-app')
export default class SetPostApp extends BaseElement {
  @lp.string editedID = '';
  @lp.string title = '';

  private composerElement!: ComposerView;

  async firstUpdated() {
    this.composerElement = this.mustGetShadowElement(composerID);
    if (this.editedID) {
      // Loading content
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
        <h4>${this.editedID ? ls.editPost : ls.newPost}</h4>
        <hr />
        <composer-view
          .id=${composerID}
          .title=${this.title}
          .entityID=${this.editedID}
          .entityType=${EntityType.post}
          @onSubmit=${this.handleSubmit}
        ></composer-view>
      </div>
    `;
  }

  private updateContent(title: string, content: string) {
    this.title = title;
    this.composerElement.contentHTML = content;
  }

  private async handleSubmit(e: CustomEvent<ComposerPayload>) {
    const loader = new SetPostLoader(this.editedID, e.detail);
    const status = await app.runGlobalActionAsync(
      loader,
      this.editedID ? ls.saving : ls.publishing,
    );
    if (status.data) {
      this.composerElement?.markAsSaved();
      app.browser.setURL(status.data);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'set-post-app': SetPostApp;
  }
}
