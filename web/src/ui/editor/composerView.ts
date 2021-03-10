import { html, customElement, css } from 'lit-element';
import * as lp from 'lit-props';
import { ls, formatLS } from 'ls';
import app from 'app';
import BaseElement from 'baseElement';
import './editorView';
import 'ui/form/inputView';
import EditorView from './editorView';
import { CHECK } from 'checks';
import { tif } from 'lib/htmlLib';

class ValidationError extends Error {
  constructor(msg: string, public callback: () => void) {
    super(msg);
  }
}

export interface ComposerContent {
  contentHTML: string;
  title?: string;
}

/**
 * Built upon editor-view, providing the following features:
 *   Title, and content fields.
 *   Warns the user about unsaved changes.
 *   Submit and cancel buttons.
 */
@customElement('composer-view')
export class ComposerView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  @lp.number entityType = 0;

  // Title field value.
  @lp.string inputTitle = '';
  @lp.bool showTitleInput = false;

  @lp.string entityID = '';
  @lp.bool showCancelButton = false;
  @lp.string submitButtonText = '';

  // Used to check if editor content has changed.
  private lastSavedTitle = '';
  private lastSavedContent = '';

  hasContentChanged(): boolean {
    if (!this.editor) {
      return false;
    }
    return (
      this.lastSavedContent !== this.editor.contentHTML ||
      (this.showTitleInput && this.lastSavedTitle !== this.inputTitle)
    );
  }

  markAsSaved() {
    this.lastSavedContent = this.contentHTML;
    if (this.showTitleInput) {
      this.lastSavedTitle = this.inputTitle;
    }
  }

  private editor?: EditorView;
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
    CHECK(this.entityType);

    const editor = this.mustGetShadowElement('editor') as EditorView;
    editor.contentHTML = this.contentHTML;
    this.editor = editor;
    this.titleElement = this.getShadowElement('titleElement');
    this.markAsSaved();
  }

  // ==========
  // We're using a standard property instead of a lit-element property for performance reason.
  // Keep assigning and comparing lit-element property might hurt performance?
  // ==========
  // Used to store the property value before editor instance is created.
  private initialContentHTML = '';
  get contentHTML(): string {
    return this.editor ? this.editor.contentHTML : this.initialContentHTML;
  }

  set contentHTML(val: string) {
    this.initialContentHTML = val;
    if (this.editor) {
      this.editor.contentHTML = val;
    }
  }

  render() {
    const titleElement = tif(
      this.showTitleInput,
      html`
        <div class="p-b-sm">
          <input-view
            required
            .placeholder=${ls.title}
            .value=${this.inputTitle}
            @onChange=${(e: CustomEvent<string>) => (this.inputTitle = e.detail)}
          ></input-view>
        </div>
      `,
    );
    const editorElement = html`<editor-view id="editor"></editor-view>`;
    const bottomElement = html`
      <div class="m-t-md">
        <qing-button btnStyle="success" @click=${this.handleSubmit}>
          ${this.entityID ? ls.save : this.submitButtonText || ls.publish}
        </qing-button>
        ${tif(
          this.showCancelButton,
          html`
            <qing-button class="m-l-sm" @click=${this.handleCancel}>${ls.cancel}</qing-button>
          `,
        )}
      </div>
    `;

    return html` <div>${titleElement}${editorElement}${bottomElement}</div> `;
  }

  private getPayload(): ComposerContent {
    if (this.showTitleInput && !this.inputTitle) {
      throw new ValidationError(formatLS(ls.pPlzEnterThe, ls.title), () => {
        if (this.titleElement) {
          this.titleElement.focus();
        }
      });
    }
    if (!this.contentHTML) {
      throw new ValidationError(formatLS(ls.pPlzEnterThe, ls.content), () => this.editor?.focus());
    }
    const payload: ComposerContent = {
      contentHTML: this.contentHTML,
    };
    if (this.showTitleInput) {
      payload.title = this.inputTitle;
    }
    return payload;
  }

  private async handleSubmit() {
    try {
      const payload = this.getPayload();
      this.dispatchEvent(
        new CustomEvent<ComposerContent>('onSubmit', { detail: payload }),
      );
    } catch (err) {
      await app.alert.error(err.message);
      if (err instanceof ValidationError) {
        const verr = err as ValidationError;
        verr.callback();
      }
    }
  }

  private async handleCancel() {
    const fireEvent = () => {
      this.markAsSaved();
      this.dispatchEvent(new CustomEvent('onDiscard'));
    };
    if (this.hasContentChanged()) {
      // Warn user of unsaved changes.
      if (await app.alert.warnUnsavedChanges()) {
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
