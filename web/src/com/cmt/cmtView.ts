import { html, customElement, css } from 'lit-element';
import * as lp from 'lit-props';
import app from 'app';
import { ls, formatLS } from 'ls';
import BaseElement from 'baseElement';
import 'ui/editor/editBar';
import 'ui/status/statusOverlay';
import 'ui/buttons/linkButton';
import 'ui/widgets/svgIcon';
import 'com/like/likeApp';
// eslint-disable-next-line import/no-extraneous-dependencies
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import LoadingStatus from 'lib/loadingStatus';
import { ComposerView, ComposerContent } from 'ui/editor/composerView';
import { staticMainImage } from 'urls';
import Cmt, { isReply } from './cmt';
import DeleteCmtLoader from './loaders/deleteCmtLoader';
import SetCmtLoader, { SetCmtResponse } from './loaders/setCmtLoader';
import { GetCmtSourceLoader } from './loaders/getCmtSrcLoader';
import { CHECK } from 'checks';
import { entityCmt, entityReply } from 'sharedConstants';

enum EditorMode {
  none,
  editing,
  replying,
}

const composerID = 'composer';
@customElement('cmt-view')
export class CmtView extends BaseElement {
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

  @lp.string hostID = '';
  @lp.number hostType = 0;
  @lp.bool isReply = false;

  @lp.object cmt: Cmt | null = null;
  // Only available to replies.
  @lp.string parentCmtID: string | null = null;
  @lp.bool private editorMode = EditorMode.none;
  @lp.object private srcLoadingStatus = LoadingStatus.notStarted;

  // Composer view is optional in `render`.
  private get composerElement(): ComposerView | null {
    return this.getShadowElement(composerID) as ComposerView | null;
  }

  firstUpdated() {
    CHECK(this.hostID);
    CHECK(this.hostType);
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
            .showCancelButton=${true}
            .entityID=${this.editorMode === EditorMode.editing ? cmt.id : ''}
            .entityType=${entityCmt}
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
            <img src=${cmt.userIconURL} class="avatar-m" width="50" height="50" />
          </a>
        </div>
        <div class="col" style="padding-left: 0">
          <div>
            <a href=${cmt.userURL}>${cmt.userName}</a>
            ${cmt.toUserID
              ? html`
                  <span>
                    <svg-icon
                      title=${formatLS(ls.pReplyTo, cmt.toUserName)}
                      iconStyle="info"
                      .oneTimeSrc=${staticMainImage('reply-to.svg')}
                      .size=${16}
                    >
                    </svg-icon>
                    <a href=${cmt.toUserURL || '#'}>${cmt.toUserName}</a>
                  </span>
                `
              : ''}
            <time-field .createdAt=${cmt.createdAt} .modifiedAt=${cmt.modifiedAt}></time-field>
            ${cmt.userID === app.state.userEID
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
          <div>${unsafeHTML(cmt.contentHTML)}</div>
          <p>
            <like-app
              .iconSize=${'sm'}
              .initialLikes=${cmt.likes}
              .hostID=${cmt.id}
              .hostType=${this.isReply ? entityReply : entityCmt}
            ></like-app>
          </p>
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
            // If `parentCmtID` is null, we're replying to a comment,
            // the comment ID itself is the parent ID.
            this.parentCmtID || cmt.id,
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
    const res = await app.runLocalActionAsync(loader, (s) => (this.srcLoadingStatus = s));

    const { composerElement } = this;
    if (res.data && composerElement) {
      composerElement.contentHTML = res.data.contentHTML;
      composerElement.markAsSaved();
    }
  }

  private async handleDeleteClick() {
    const { cmt } = this;
    if (!cmt) {
      return;
    }
    if (await app.alert.confirm(ls.warning, formatLS(ls.pDoYouWantToDeleteThis, ls.post))) {
      app.alert.showLoadingOverlay(ls.working);
      const loader = new DeleteCmtLoader(cmt.id, this.hostType, this.hostID, isReply(cmt));
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
