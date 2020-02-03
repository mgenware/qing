import { html, customElement } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import 'ui/editor/composerView';
import ls from 'ls';
import { EntityType } from 'lib/entity';
import SetCmtLoader, { SetCmtResponse } from './loaders/setCmtLoader';
import { ComposerPayload, ComposerView } from 'ui/editor/composerView';
import app from 'app';

const composerID = 'composer';

@customElement('add-cmt-app')
export class AddCmtApp extends BaseElement {
  @lp.string entityID = '';
  @lp.number entityType = 0;
  @lp.bool private expanded = false;

  private get composerElement(): ComposerView | null {
    return this.mustGetShadowElement(composerID) as ComposerView | null;
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
        .id=${composerID}
        .showTitleInput=${false}
        .headerText=${ls.writeAComment}
        .entityType=${EntityType.cmt}
        .submitButtonText=${ls.comment}
        .showCancelButton=${true}
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
      this.composerElement?.markAsSaved();

      this.expanded = false;
      this.dispatchEvent(
        new CustomEvent<SetCmtResponse>('cmtAdded', {
          detail: status.data,
        }),
      );
    }
  }

  private handleDiscard() {
    this.expanded = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-cmt-app': AddCmtApp;
  }
}
