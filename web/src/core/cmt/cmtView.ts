import { html, customElement } from 'lit-element';
import * as lp from 'lit-props';
import app from 'app';
import ls from 'ls';
import BaseElement from 'baseElement';
import 'ui/cm/timeField';
import 'ui/editor/editBar';
import 'ui/cm/workingView';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import Cmt from './cmt';
import { EntityType } from 'lib/entity';
import LoadingStatus from 'lib/loadingStatus';
import { GetCmtSourceLoader } from './loaders/getCmtSrcLoader';
import { ComposerView } from 'ui/editor/composerView';

@customElement('cmt-view')
export class CmtView extends BaseElement {
  @lp.object cmt: Cmt | null = null;
  @lp.bool isReply = false;
  @lp.bool private isEditing = false;
  @lp.object private srcLoadingStatus = LoadingStatus.empty;

  render() {
    const { cmt, isEditing } = this;
    if (!cmt) {
      return html``;
    }
    if (isEditing) {
      return html`
        <working-view .status=${this.srcLoadingStatus}>
          <composer-view
            id="cmt-editor"
            .showTitle=${false}
            .entityType=${EntityType.cmt}
            .submitButtonText=${ls.comment}
          ></composer-view>
        </working-view>
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
    const loader = new GetCmtSourceLoader(cmt.id);
    const res = await app.runLocalActionAsync(
      loader,
      status => (this.srcLoadingStatus = status),
    );
    if (res.data) {
      const contentHTML = res.data.content;
      (this.shadowRoot?.getElementById(
        'editor',
      ) as ComposerView).content = contentHTML;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-view': CmtView;
  }
}
