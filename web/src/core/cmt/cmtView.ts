import { html, customElement } from 'lit-element';
import * as lp from 'lit-props';
import app from 'app';
import { ls, formatLS } from 'ls';
import BaseElement from 'baseElement';
import 'ui/cm/timeField';
import 'ui/editor/editBar';
import 'ui/cm/statusOverlay';
import 'ui/cm/linkButton';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import Cmt from './cmt';
import { EntityType } from 'lib/entity';
import LoadingStatus from 'lib/loadingStatus';
import { GetCmtSourceLoader } from './loaders/getCmtSrcLoader';
import { ComposerView, ComposerContent } from 'ui/editor/composerView';
import SetCmtLoader, { SetCmtResponse } from './loaders/setCmtLoader';
import DeleteCmtLoader from './loaders/deleteCmtLoader';

enum EditorMode {
  none,
  editing,
  replying,
}

const composerID = 'composer';
@customElement('cmt-view')
export class CmtView extends BaseElement {
  @lp.string hostID = '';
  @lp.number hostType: EntityType = 0;

  @lp.object cmt: Cmt | null = null;
  @lp.bool isReply = false;
  @lp.bool private editorMode = EditorMode.none;
  @lp.object private srcLoadingStatus = LoadingStatus.empty;

  // Composer view is optional in `render`.
  private get composerElement(): ComposerView | null {
    return this.getShadowElement(composerID) as ComposerView | null;
  }

  render() {
    const { cmt, editorMode } = this;
    if (!cmt) {
      return html``;
    }
    let editorHTML = html``;
    if (editorMode !== EditorMode.none) {
      editorHTML = html`
        <status-overlay
          .status=${editorMode === EditorMode.editing
            ? this.srcLoadingStatus
            : LoadingStatus.success}
          .canRetry=${true}
          @onRetry=${this.loadEditorContent}
        >
          <composer-view
            .id=${composerID}
            .headerText=${editorMode === EditorMode.editing
              ? ls.editComment
              : formatLS(ls.pReplyTo, cmt.userName)}
            .showTitleInput=${false}
            .showCancelButton=${true}
            .entityID=${this.editorMode === EditorMode.editing ? cmt.id : ''}
            .entityType=${EntityType.cmt}
            .submitButtonText=${ls.save}
            @onSubmit=${this.handleSubmit}
            @onDiscard=${this.handleDiscard}
          ></composer-view>
        </status-overlay>
      `;
    }
    if (editorMode === EditorMode.editing) {
      return editorHTML;
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
        <div class="col" style="padding-left: 0">
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
                  <link-button class="m-l-sm" @click=${this.handleReplyClick}
                    >${ls.reply}</link-button
                  >
                `
              : ''}
          </div>
          <div>
            ${unsafeHTML(cmt.content)}
          </div>
          ${editorHTML}
        </div>
      </div>
    `;
  }

  private async handleEditClick() {
    const { cmt } = this;
    if (!cmt) {
      return;
    }
    this.editorMode = EditorMode.editing;
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
    this.editorMode = EditorMode.none;
  }

  private async handleSubmit(e: CustomEvent<ComposerContent>) {
    const { cmt, editorMode } = this;
    if (!cmt || editorMode === EditorMode.none) {
      return;
    }
    const loader =
      editorMode === EditorMode.editing
        ? SetCmtLoader.editCmt(this.hostID, this.hostType, cmt.id, e.detail)
        : SetCmtLoader.newReply(
            this.hostID,
            this.hostType,
            cmt.userID,
            cmt.id,
            e.detail,
          );
    const status = await app.runGlobalActionAsync(loader, ls.publishing);
    if (status.data) {
      this.closeEditor();

      if (editorMode === EditorMode.editing) {
        // Copy all properties from `serverCmt` except for the `createdAt`.
        // We're hot patching the cmt object, and the `createdAt` property
        // is something server must return (an empty timestamp) but doesn't
        // make sense here.
        const serverCmt = status.data.cmt;
        const newCmt: Cmt = {
          ...cmt,
          ...serverCmt,
        };
        newCmt.createdAt = cmt.createdAt;

        this.cmt = newCmt;
        this.dispatchEvent(
          new CustomEvent<Cmt>('cmtUpdated', { detail: newCmt }),
        );
      } else {
        this.dispatchEvent(
          new CustomEvent<SetCmtResponse>('cmtAdded', { detail: status.data }),
        );
      }
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

  private async handleDeleteClick() {
    const { cmt } = this;
    if (!cmt) {
      return;
    }
    if (await app.alert.confirm(formatLS(ls.pDoYouWantToDeleteThis, ls.post))) {
      app.alert.showLoadingOverlay(ls.working);
      const loader = new DeleteCmtLoader(cmt.id, this.hostType);
      const status = await app.runGlobalActionAsync(loader, ls.working);
      if (status.isSuccess) {
        this.dispatchEvent(new CustomEvent<undefined>('cmtDeleted'));
      }
    }
  }

  private async handleReplyClick() {
    this.editorMode = EditorMode.replying;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-view': CmtView;
  }
}
