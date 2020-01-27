import './editorView';
import { html, customElement } from 'lit-element';
import * as lp from 'lit-props';
import { ls, formatLS } from 'ls';
import app from 'app';
import EditorView from './editorView';
import 'ui/cm/captchaView';
import 'lit-button';
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

@customElement('composer-view')
export class ComposerView extends BaseElement {
  @lp.number entityType: EntityType = 0;
  @lp.string title = '';
  @lp.bool showTitle = true;
  @lp.string entityID = '';
  @lp.string content = '';
  @lp.bool showCancelButton = false;
  @lp.string submitButtonText = '';
  @lp.string contentHTML = '';

  private editor!: EditorView;
  private captchaView: CaptchaView | null = null;
  private titleElement: HTMLInputElement | null = null;

  firstUpdated() {
    if (!this.entityType) {
      throw new Error('Invalid entity type');
    }
    this.editor = this.mustGetShadowElement('editor');
    this.titleElement = this.getShadowElement('titleElement');
    this.captchaView = this.getShadowElement('captElement');
  }

  render() {
    const titleElement = this.showTitle
      ? html`
          <div class="p-b-sm form">
            <input
              id="titleElement"
              type="text"
              value=${this.title}
              placeholder=${ls.title}
              @change=${(e: any) => (this.title = e.target.value)}
            />
          </div>
        `
      : '';
    const editorElement = html`
      <editor-view
        id="editor"
        .contentHTML=${this.contentHTML}
        @contentChanged=${this.handleContentChanged}
      ></editor-view>
    `;
    const bottomElement = html`
      <div class="m-t-md">
        ${this.entityID
          ? ''
          : html`
              <div class="m-b-md">
                <captcha-view
                  id="captElement"
                  .entityType=${this.entityType}
                  @onEnterKeyDown=${this.handleSubmit}
                ></captcha-view>
              </div>
            `}
        <lit-button class="is-success" @click=${this.handleSubmit}>
          ${this.submitButtonText || (this.entityID ? ls.save : ls.publish)}
        </lit-button>
        ${this.showCancelButton
          ? html`
              <lit-button class="m-l-sm" @click=${this.handleCancel}
                >${ls.cancel}</lit-button
              >
            `
          : ''}
      </div>
    `;

    return html`
      <div>
        ${titleElement}${editorElement}${bottomElement}
      </div>
    `;
  }

  private getPayload(): ComposerPayload {
    const { captchaView } = this;
    if (this.showTitle && !this.title) {
      throw new ValidationError(formatLS(ls.pPlzEnterThe, ls.title), () => {
        if (this.titleElement) {
          this.titleElement.focus();
        }
      });
    }
    if (!this.contentHTML) {
      throw new ValidationError(formatLS(ls.pPlzEnterThe, ls.content), () =>
        this.editor.focus(),
      );
    }
    if (captchaView && !captchaView.value) {
      throw new ValidationError(formatLS(ls.pPlzEnterThe, ls.captcha), () => {
        if (this.captchaView) {
          this.captchaView.focus();
        }
      });
    }
    const payload = new ComposerPayload(this.contentHTML);
    if (this.showTitle) {
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

  private handleCancel() {
    this.dispatchEvent(new CustomEvent('onCancel'));
  }

  private handleContentChanged(e: CustomEvent<string>) {
    this.contentHTML = e.detail;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'composer-view': ComposerView;
  }
}
