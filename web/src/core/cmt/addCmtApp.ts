import { html, customElement, property } from 'lit-element';
import BaseElement from 'baseElement';
import 'ui/editor/composerView';
import ls from 'ls';
import { EntityType } from 'lib/entity';
import SetCmtLoader, { SetCmtResponse } from './loaders/setCmtLoader';
import { ComposerPayload } from 'ui/editor/composerView';
import app from 'app';

@customElement('add-cmt-app')
export class AddCmtApp extends BaseElement {
  @property() entityID = '';
  @property({ type: Number }) entityType = 0;
  @property({ type: Boolean }) private expanded = false;

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
        .showTitleInput=${false}
        .headerText=${ls.writeAComment}
        .entityType=${EntityType.cmt}
        .submitButtonText=${ls.comment}
        @onSubmit=${this.handleSubmit}
        @onDiscard=${this.handleDiscard}
      ></composer-view>
    `;
  }

  private handleCommentButtonClick() {
    this.expanded = true;
  }

  private async handleSubmit(e: CustomEvent<ComposerPayload>) {
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

  private handleDiscard() {
    this.dispatchEvent(new CustomEvent<undefined>('cmtContentDiscarded'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-cmt-app': AddCmtApp;
  }
}
