import { html, customElement } from 'lit-element';
import Element from '../../element';
import ls from '../../ls';
import '../../ui/editor/composerView';
import { ComposerView } from '../../ui/editor/composerView';
import ComposerPayload from '../../ui/editor/composerPayload';
import app from '../../app';
import SetPostLoader from './loaders/setPostLoader';

@customElement('new-post-app')
export default class NewPostApp extends Element {
  private editor: ComposerView | null = null;

  firstUpdated() {
    this.editor = this.shadowRoot!.getElementById('editor') as ComposerView;
  }

  render() {
    return html`
      <div>
        <p class="is-size-4">${ls.newPost}</p>
        <hr />
        <composer-view
          id="editor"
          .options=${{ showTitle: true }}
          @onSubmit=${this.handleSubmit}
        ></composer-view>
      </div>
    `;
  }

  private handleSubmit(e: CustomEvent<ComposerPayload>) {
    const { editor } = this;
    if (!editor) {
      return;
    }
    const loader = new SetPostLoader(null, e.detail);
    app.runActionAsync(loader, ls.publishing);
  }
}
