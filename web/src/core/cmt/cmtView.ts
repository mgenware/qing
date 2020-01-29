import { html, customElement } from 'lit-element';
import * as lp from 'lit-props';
import app from 'app';
import ls from 'ls';
import BaseElement from 'baseElement';
import 'ui/cm/timeField';
import 'ui/editor/editBar';
import 'ui/cm/statusOverlay';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import Cmt from './cmt';
import { EntityType } from 'lib/entity';
import LoadingStatus from 'lib/loadingStatus';
import { GetCmtSourceLoader } from './loaders/getCmtSrcLoader';
import { ComposerView } from 'ui/editor/composerView';

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
            .entityType=${EntityType.cmt}
            .submitButtonText=${ls.comment}
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
              class="border-radius-5"
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
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-view': CmtView;
  }
}
