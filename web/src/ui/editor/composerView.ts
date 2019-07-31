import './editorView';
import { html, customElement, property } from 'lit-element';
import Element from '../../element';
import ls from '../../ls';
import app from '../../app';
import ComposerPayload from './composerPayload';
import EditorView from './editorView';

export interface ComposerOptions {
  showTitle?: boolean;
}

@customElement('composer-view')
export class ComposerView extends Element {
  @property() options: ComposerOptions = {};
  @property() title = '';

  private editor!: EditorView;

  firstUpdated() {
    const editor = this.shadowRoot!.getElementById('editor') as EditorView;
    if (!editor) {
      throw new Error('Editor element not found');
    }
    this.editor = editor;
  }

  get contentHTML(): string {
    return this.editor.contentHTML;
  }

  render() {
    const { options } = this;
    const titleElement = options.showTitle
      ? html`
          <div class="control p-b-md">
            <input
              class="input"
              type="text"
              placeholder=${ls.title}
              @change=${(e: any) => (this.title = e.target.value)}
            />
          </div>
        `
      : '';
    const editorElement = html`
      <editor-view id="editor"></editor-view>
    `;
    const bottomElement = html`
      <button class="button m-t-md" @click=${this.handleSubmit}>
        ${ls.publish}
      </button>
    `;

    return html`
      ${titleElement}${editorElement}${bottomElement}
    `;
  }

  private getPayload(): ComposerPayload {
    const { options } = this;
    if (options.showTitle && !this.title) {
      throw new Error(ls.titleCannotBeEmpty);
    }
    if (!this.contentHTML) {
      throw new Error(ls.contentCannotBeEmpty);
    }
    const payload = new ComposerPayload(this.contentHTML);
    if (options.showTitle) {
      payload.title = this.title;
    }
    return payload;
  }

  private async handleSubmit() {
    try {
      const payload = this.getPayload();
      this.dispatchEvent(
        new CustomEvent<ComposerPayload>('onSubmit', { detail: payload }),
      );
    } catch (err) {
      await app.alert.error(err.message);
    }
  }
}
