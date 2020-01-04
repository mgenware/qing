import { html, customElement, property } from 'lit-element';
import BaseElement from 'baseElement';
import 'ui/editor/composerView';
import ls from 'ls';
import { EntityType } from 'lib/entity';
import EditorView from 'ui/editor/editorView';
import SetCmtLoader, { SetCmtResponse } from './loaders/setCmtLoader';
import { ComposerPayload } from 'ui/editor/composerView';
import app from 'app';

@customElement('add-cmt-app')
export class AddCmtApp extends BaseElement {
  @property() entityID = '';
  @property({ type: Number }) entityType = 0;
  @property({ type: Boolean }) private expanded = false;

  private get editor(): EditorView | null {
    return this.mustGetShadowElement('cmt-editor') as EditorView | null;
  }

  render() {
    if (!this.expanded) {
      return html`
        <p>
          <lit-button @click=${this.handleCommentButtonClick}
            >${ls.writeAComment}</lit-button
          >
        </p>
      `;
    }
    return html`
      <composer-view
        id="cmt-editor"
        .showTitle=${false}
        .entityType=${EntityType.cmt}
        .attachedEntityID=${this.entityID}
        .attachedEntityType=${this.entityType}
        .submitButtonText=${ls.comment}
        @onSubmit=${this.handleSubmit}
      ></composer-view>
    `;
  }

  private handleCommentButtonClick() {
    this.expanded = true;
  }

  private async handleSubmit(e: CustomEvent<ComposerPayload>) {
    const { editor } = this;
    if (!editor) {
      return;
    }
    const loader = SetCmtLoader.newCmt(
      this.entityID,
      this.entityType,
      e.detail,
    );
    const status = await app.runGlobalActionAsync(loader, ls.publishing);
    if (status.data) {
      this.dispatchEvent(
        new CustomEvent<SetCmtResponse>('cmtAdded', {
          detail: status.data,
        }),
      );
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-cmt-app': AddCmtApp;
  }
}
