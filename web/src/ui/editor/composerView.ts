import './editorView';
import { html, customElement, property } from 'lit-element';
import { ls, format } from 'ls';
import app from 'app';
import EditorView from './editorView';
import 'ui/cm/captchaView';
import BaseElement from 'baseElement';
import { CaptchaView } from 'ui/cm/captchaView';
import { EntityType } from 'lib/entity';

class ValidationError extends Error {
  constructor(msg: string, public callback: () => void) {
    super(msg);
  }
}

export class ComposerPayload {
  title: string | null = null;
  captcha: string | null = null;
  constructor(public content: string) {}
}

export interface ComposerOptions {
  entityType?: EntityType;
  showTitle?: boolean;
  entityID?: string;
}

export interface ComposerSource {
  url: string;
}

@customElement('composer-view')
export class ComposerView extends BaseElement {
  @property({ type: Object }) options: ComposerOptions = {};
  @property() title = '';
  @property({ type: Object }) source: ComposerSource | null = null;

  private editor!: EditorView;
  private captchaView: CaptchaView | null = null;
  private titleElement: HTMLInputElement | null = null;

  firstUpdated() {
    this.editor = this.mustGetShadowElement('editor');
    this.titleElement = this.getShadowElement('titleElement');
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
          <div class="p-b-md">
            <input
              id="titleElement"
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
                  @onEnterKeyUp=${this.handleSubmit}
                ></captcha-view>
              </div>
            `}
        <lit-button class="is-success" @click=${this.handleSubmit}>
          ${ls.publish}
        </lit-button>
      </div>
    `;

    return html`
      <div class="form">
        <div>
          ${titleElement}${editorElement}${bottomElement}
        </div>
      </div>
    `;
  }

  private getPayload(): ComposerPayload {
    const { options, captchaView } = this;
    if (options.showTitle && !this.title) {
      throw new ValidationError(format('pPlzEnterThe', ls.title), () => {
        if (this.titleElement) {
          this.titleElement.focus();
        }
      });
    }
    if (!this.contentHTML) {
      throw new ValidationError(format('pPlzEnterThe', ls.content), () =>
        this.editor.focus(),
      );
    }
    if (captchaView && !captchaView.value) {
      throw new ValidationError(format('pPlzEnterThe', ls.captcha), () => {
        if (this.captchaView) {
          this.captchaView.focus();
        }
      });
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
      if (err instanceof ValidationError) {
        const verr = err as ValidationError;
        if (verr.callback) {
          verr.callback();
        }
      }
    }
  }
}
