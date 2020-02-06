import { html, customElement } from 'lit-element';
import * as lp from 'lit-props';
import app from 'app';
import { ls, formatLS } from 'ls';
import BaseElement from 'baseElement';
import 'ui/cm/timeField';
import 'ui/editor/editBar';
import 'ui/cm/statusOverlay';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import Cmt from './cmt';
import { EntityType } from 'lib/entity';
import LoadingStatus from 'lib/loadingStatus';
import { GetCmtSourceLoader } from './loaders/getCmtSrcLoader';
import { ComposerView, ComposerPayload } from 'ui/editor/composerView';
import SetCmtLoader from './loaders/setCmtLoader';
import DeleteCmtLoader from './loaders/deleteCmtLoader';

const composerID = 'composer';
@customElement('cmt-view')
export class CmtView extends BaseElement {
  @lp.object cmt: Cmt | null = null;
  @lp.bool isReply = false;
  @lp.bool private isEditing = false;
  @lp.object private srcLoadingStatus = LoadingStatus.empty;

  // Composer view is optional in `render`.
  private get composerElement(): ComposerView | null {
    return this.getShadowElement(composerID) as ComposerView | null;
  }

  render() {
    const { cmt, isEditing } = this;
    if (!cmt) {
      return html``;
    }
    if (isEditing) {
      return html`
        <status-overlay
          .status=${this.srcLoadingStatus}
          .canRetry=${true}
          @onRetry=${this.loadEditorContent}
        >
          <composer-view
            .id=${composerID}
            .headerText=${ls.editComment}
            .showTitleInput=${false}
            .showCancelButton=${true}
            .entityID=${cmt.id}
            .entityType=${EntityType.cmt}
            .submitButtonText=${ls.save}
            @onSubmit=${this.handleEdit}
            @onDiscard=${this.handleDiscard}
          ></composer-view>
        </status-overlay>
      `;
    }
    return html`
      <div class="m-t-md row">
        <div class="col-auto">
          <a href=${cmt.userURL}>
            <img
              src=${cmt.userIconURL}
              class="avatar-m"
              width="50"
              height="50"
            />
          </a>
        </div>
        <div class="col">
          <div>
            <a href=${cmt.userURL}>${cmt.userName}</a>
            <time-field
              .createdAt=${cmt.createdAt}
              .modifiedAt=${cmt.modifiedAt}
            ></time-field>
            ${cmt.userID === app.state.userID
              ? html`
                  <edit-bar
                    .hasLeftMargin=${true}
                    @editClick=${this.handleEditClick}
                    @deleteClick=${this.handleDeleteClick}
                  ></edit-bar>
                `
              : ''}
          </div>
          <div>
            ${unsafeHTML(cmt.content)}
          </div>
        </div>
      </div>
    `;
  }

  private async handleEditClick() {
    const { cmt } = this;
    if (!cmt) {
      return;
    }
    this.isEditing = true;
    await this.loadEditorContent();
  }

  // Closes and resets the editor.
  private closeEditor() {
    const { composerElement } = this;
    if (!composerElement) {
      return;
    }
    composerElement.contentHTML = '';
    composerElement.markAsSaved();
    this.isEditing = false;
  }

  private async handleEdit(e: CustomEvent<ComposerPayload>) {
    const { cmt } = this;
    if (!cmt) {
      return;
    }
    const loader = SetCmtLoader.editCmt(cmt.id, e.detail);
    const status = await app.runGlobalActionAsync(loader, ls.publishing);
    if (status.data) {
      // Copy all properties from `serverCmt` except for the `createdAt`.
      // We're hot patching the cmt object, and the `createdAt` property
      // is something server must return (an empty timestamp) but doesn't
      // make sense here.
      const serverCmt = status.data.cmt;
      const updatedCmt: Cmt = {
        ...cmt,
        ...serverCmt,
      };
      updatedCmt.createdAt = cmt.createdAt;

      this.cmt = updatedCmt;
      this.closeEditor();
    }
  }

  private async handleDiscard() {
    this.closeEditor();
  }

  private async loadEditorContent() {
    const { cmt } = this;
    if (!cmt) {
      return;
    }
    const loader = new GetCmtSourceLoader(cmt.id);
    const res = await app.runLocalActionAsync(
      loader,
      status => (this.srcLoadingStatus = status),
    );

    const { composerElement } = this;
    if (res.data && composerElement) {
      composerElement.contentHTML = res.data.content;
      composerElement.markAsSaved();
    }
  }

  protected async handleDeleteClick() {
    const { cmt } = this;
    if (!cmt) {
      return;
    }
    if (await app.alert.confirm(formatLS(ls.pDoYouWantToDeleteThis, ls.post))) {
      app.alert.showLoadingOverlay(ls.working);
      const loader = new DeleteCmtLoader(cmt.id);
      const status = await app.runGlobalActionAsync(loader, ls.working);
      if (status.isSuccess) {
        this.dispatchEvent(new CustomEvent<undefined>('cmtDeleted'));
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-view': CmtView;
  }
}
