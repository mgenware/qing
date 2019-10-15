import { html, customElement, property } from 'lit-element';
import ls from 'ls';
import 'ui/editor/composerView';
import { ComposerView, ComposerPayload } from 'ui/editor/composerView';
import app from 'app';
import SetPostLoader from './loaders/setPostLoader';
import BaseElement from 'baseElement';
import { EntityType } from 'lib/entity';
import { GetPostForEditingLoader } from './loaders/getPostForEditingLoader';

@customElement('set-post-app')
export default class SetPostApp extends BaseElement {
  @property() editedID = '';
  @property() title = '';
  private editor: ComposerView | null = null;

  async firstUpdated() {
    this.editor = (this.mustGetShadowElement(
      'editor',
    ) as unknown) as ComposerView | null;
    if (this.editedID) {
      // Loading content
      const loader = new GetPostForEditingLoader(this.editedID);
      const res = await app.runActionAsync(loader);
      if (res.isSuccess) {
        const postData = res.getResult();
        this.updateContent(postData.Title, postData.Content);
      }
    }
  }

  render() {
    return html`
      <div>
        <p class="is-h4">${this.editedID ? ls.editPost : ls.newPost}</p>
        <hr />
        <composer-view
          id="editor"
          .title=${this.title}
          .showTitle=${true}
          .entityID=${this.editedID}
          .entityType=${EntityType.post}
          @onSubmit=${this.handleSubmit}
        ></composer-view>
      </div>
    `;
  }

  private updateContent(title: string, content: string) {
    if (!this.editor) {
      return;
    }
    this.title = title;
    this.editor.contentHTML = content;
  }

  private async handleSubmit(e: CustomEvent<ComposerPayload>) {
    const { editor } = this;
    if (!editor) {
      return;
    }
    const loader = new SetPostLoader(this.editedID, e.detail);
    const res = await app.runActionAsync(
      loader,
      this.editedID ? ls.saving : ls.publishing,
    );
    if (res.isSuccess) {
      const url = res.getResult();
      if (url) {
        app.browser.setURL(url);
      }
    }
  }
}
