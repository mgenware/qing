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

/**
 * Built upon editor-view, providing the following features:
 *   Title, captcha inputs.
 *   Warns user about unsaved changes.
 *   A descriptive header shown on top of the editor.
 *   Submit and cancel buttons.
 */
@customElement('composer-view')
export class ComposerView extends BaseElement {
  @lp.number entityType: EntityType = 0;

  // A descriptive header string displayed on top of the editor.
  @lp.string headerText = '';

  // Title field value.
  @lp.string titleText = '';
  @lp.bool showTitleInput = true;

  // NOTE: if `entityID` is empty, captcha view will show up.
  @lp.string entityID = '';
  @lp.bool showCancelButton = false;
  @lp.string submitButtonText = '';

  // Used to check if editor content has changed.
  private lastSavedContent = '';

  hasContentChanged(): boolean {
    if (!this.editor) {
      return false;
    }
    return this.lastSavedContent !== this.editor.contentHTML;
  }

  markAsSaved() {
    this.lastSavedContent = this.contentHTML;
  }

  private editor?: EditorView;
  private captchaView: CaptchaView | null = null;
  private titleElement: HTMLInputElement | null = null;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }

  firstUpdated() {
    if (!this.entityType) {
      throw new Error('Invalid entity type');
    }

    const editor = this.mustGetShadowElement('editor') as EditorView;
    editor.contentHTML = this.contentHTML;
    this.editor = editor;
    this.titleElement = this.getShadowElement('titleElement');
    this.captchaView = this.getShadowElement('captElement');
    this.markAsSaved();
  }

  // ==========
  // We're using a standard property instead of a lit-element property for performance reason.
  // Keep assigning and comparing lit-element property changes hurts performance.
  // ==========
  // Use to store the property value before editor instance is created.
  private _initialContentHTML = '';
  get contentHTML(): string {
    return this.editor ? this.editor.contentHTML : this._initialContentHTML;
  }

  set contentHTML(val: string) {
    this._initialContentHTML = val;
    if (this.editor) {
      this.editor.contentHTML = val;
    }
  }

  render() {
    const titleElement = this.showTitleInput
      ? html`
          <div class="p-b-sm form">
            <input
              id="titleElement"
              type="text"
              value=${this.titleText}
              placeholder=${ls.title}
              @change=${(e: any) => (this.titleText = e.target.value)}
            />
          </div>
        `
      : '';
    const editorElement = html`
      <editor-view id="editor"></editor-view>
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
        ${this.headerText
          ? html`
              <h3>${this.headerText}</h3>
            `
          : html``}
        ${titleElement}${editorElement}${bottomElement}
      </div>
    `;
  }

  private getPayload(): ComposerPayload {
    const { captchaView } = this;
    if (this.showTitleInput && !this.titleText) {
      throw new ValidationError(formatLS(ls.pPlzEnterThe, ls.title), () => {
        if (this.titleElement) {
          this.titleElement.focus();
        }
      });
    }
    if (!this.contentHTML) {
      throw new ValidationError(formatLS(ls.pPlzEnterThe, ls.content), () =>
        this.editor?.focus(),
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
    if (this.showTitleInput) {
      payload.title = this.titleText;
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

  private async handleCancel() {
    const fireEvent = () => this.dispatchEvent(new CustomEvent('onDiscard'));
    if (this.hasContentChanged()) {
      // Warn user of unsaved changes.
      const confirmed = await app.alert.confirm(ls.unsavedChangesWarning);
      if (confirmed) {
        fireEvent();
      }
    } else {
      fireEvent();
    }
  }

  private handleBeforeUnload(e: BeforeUnloadEvent) {
    if (this.hasContentChanged()) {
      // Cancel the event as stated by the standard.
      e.preventDefault();
      // Chrome requires returnValue to be set.
      e.returnValue = '';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'composer-view': ComposerView;
  }
}
