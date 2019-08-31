import { html, customElement } from 'lit-element';
import ls from 'ls';
import 'ui/editor/composerView';
import { ComposerView } from 'ui/editor/composerView';
import ComposerPayload from 'ui/editor/composerPayload';
import app from 'app';
import SetPostLoader from './loaders/setPostLoader';
import BaseElement from 'baseElement';
import ComposerOptions from 'ui/editor/composerOptions';
import { EntityType } from 'lib/entity';

@customElement('new-post-app')
export default class NewPostApp extends BaseElement {
  private editor: ComposerView | null = null;

  firstUpdated() {
    this.editor = (this.shadowRoot!.getElementById(
      'editor',
    ) as unknown) as ComposerView;
  }

  render() {
    const composerOpts: ComposerOptions = {
      showTitle: true,
      entityType: EntityType.post,
    };
    return html`
      <div>
        <p class="is-size-4">${ls.newPost}</p>
        <hr />
        <composer-view
          id="editor"
          .options=${composerOpts}
          @onSubmit=${this.handleSubmit}
        ></composer-view>
      </div>
    `;
  }

  private async handleSubmit(e: CustomEvent<ComposerPayload>) {
    const { editor } = this;
    if (!editor) {
      return;
    }
    const loader = new SetPostLoader(null, e.detail);
    const res = await app.runActionAsync(loader, ls.publishing);
    if (res.isSuccess) {
      const url = res.data as string;
      if (url) {
        app.browser.setURL(url);
      }
    }
  }
}
