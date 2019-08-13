import './editorView';
import { html, customElement, property } from 'lit-element';
import { ls, format } from 'ls';
import app from 'app';
import ComposerPayload from './composerPayload';
import EditorView from './editorView';
import 'ui/views/captchaView';
import BaseElement from 'baseElement';
import ComposerOptions from './composerOptions';
import { CaptchaView } from 'ui/views/captchaView';

@customElement('composer-view')
export class ComposerView extends BaseElement {
  @property() options: ComposerOptions = {};
  @property() title = '';

  private editor!: EditorView;
  private captchaView: CaptchaView | null = null;

  firstUpdated() {
    this.editor = this.mustGetShadowElement('editor');
    this.captchaView = this.getShadowElement('captElement');
    // Checking required properties
    const { options } = this;
    if (!options.entityType) {
      throw new Error('options.entityType is required');
    }
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
      <div class="m-t-md">
        ${options.entityID
          ? ''
          : html`
              <div class="m-b-md">
                <captcha-view
                  id="captElement"
                  etype=${options.entityType}
                ></captcha-view>
              </div>
            `}
        <button class="button" @click=${this.handleSubmit}>
          ${ls.publish}
        </button>
      </div>
    `;

    return html`
      ${titleElement}${editorElement}${bottomElement}
    `;
  }

  private getPayload(): ComposerPayload {
    const { options } = this;
    if (options.showTitle && !this.title) {
      throw new Error(format('pCannotBeEmpty', ls.title));
    }
    if (!this.contentHTML) {
      throw new Error(format('pCannotBeEmpty', ls.content));
    }
    const payload = new ComposerPayload(this.contentHTML);
    if (options.showTitle) {
      payload.title = this.title;
    }
    if (this.captchaView) {
      payload.captcha = this.captchaView.value;
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
