import { html, customElement, property, TemplateResult } from 'lit-element';
import BaseElement from 'baseElement';
import 'ui/cm/loadingView';
import 'ui/cm/itemCounter';
import Status from 'lib/status';
import ls from 'ls';
import ListCmtLoader from './loaders/listCmtLoader';
import Cmt from './cmt';
import './cmtView';
import app from 'app';
import { splitLocalizedString } from 'lib/stringUtils';
import './addCmtApp';
import { SetCmtResponse } from './loaders/setCmtLoader';

@customElement('cmt-app')
export class CmtApp extends BaseElement {
  @property({ type: Number }) initialCount = 0;
  @property() entityID = '';
  @property({ type: Number }) entityType = 0;

  // Loading status of initial comment list.
  @property({ type: Object }) private initialLoadingStatus = Status.empty();
  // Loading status of view more.
  @property({ type: Object }) private extendedLoadingStatus = Status.empty();
  @property({ type: Boolean }) private hasNext = false;
  @property({ type: Array }) private cmts: Cmt[] = [];
  @property({ type: Number }) private cmtCount = 0;
  @property({ type: Number }) private totalCmtCount = 0;

  // Keeps track of all IDs. When adding a comment, instead of reloading the
  // whole page, the new comment object is constructed locally and added to
  // the collection. Later when user scrolls to load more comments from server,
  // the newly added comment could get added again. `cmtIDs` can help detect
  // duplicates.
  private cmtIDs = new Set<string>();
  // Last loaded page number.
  private page = 1;

  async firstUpdated() {
    this.totalCmtCount = this.initialCount;
    if (this.initialCount) {
      await this.reloadAllAsync();
    }
  }

  render() {
    const { cmts } = this;
    const header = html`
      <h2>${ls.comments}</h2>
    `;
    let content: TemplateResult;
    if (!this.totalCmtCount && this.initialLoadingStatus.isSuccess) {
      content = html`
        <span>${ls.noComment}</span>
      `;
    } else if (this.totalCmtCount) {
      content = html`
        <div>
          ${cmts.map(
            cmt =>
              html`
                <cmt-view .cmt=${cmt}></cmt-view>
              `,
          )}
          <item-counter
            .shown=${this.cmtCount}
            .total=${this.totalCmtCount}
          ></item-counter>
          ${this.hasNext && !this.extendedLoadingStatus.isWorking
            ? html`
                <div>
                  <a href="#" @click=${this.handleViewMoreClick}
                    >${ls.viewMore}</a
                  >
                </div>
              `
            : html``}
        </div>
      `;
    } else {
      content = html`
        <loading-view
          .status=${this.initialLoadingStatus}
          .canRetry=${true}
          @onRetry=${this.reloadAllAsync}
        ></loading-view>
      `;
    }

    const footer = app.state.hasUser
      ? this.renderCommentComposer()
      : this.renderLoginToComment();

    return html`
      ${header}${content}${footer}
    `;
  }

  private renderLoginToComment() {
    const loginToCommentTextArray = splitLocalizedString(ls.plsLoginToComment);
    return html`
      <div>
        <span>${loginToCommentTextArray[0]}</span>
        <lit-button class="is-success m-l-xs m-r-xs"
          >${loginToCommentTextArray[1]}</lit-button
        >
        <span>${loginToCommentTextArray[2]}</span>
      </div>
    `;
  }

  private renderCommentComposer() {
    return html`
      <div>
        <add-cmt-app
          .entityID=${this.entityID}
          .entityType=${this.entityType}
          @cmtAdded=${this.handleCmtAdded}
        ></add-cmt-app>
      </div>
    `;
  }

  private async reloadAllAsync() {
    const loader = new ListCmtLoader(this.entityID, this.entityType, this.page);
    await app.runLocalActionAsync(loader, status => {
      this.initialLoadingStatus = status;
      if (status.isSuccess && status.data) {
        const resp = status.data;
        this.hasNext = resp.hasNext;
        this.resetCmts(resp.cmts || []);
      }
    });
  }

  private async handleCmtAdded(e: CustomEvent<SetCmtResponse>) {
    if (e.detail) {
      this.appendCmt(e.detail.cmt);
    }
  }

  private updateStats(cmtCount: number, totalCmtCount: number) {
    this.cmtCount = cmtCount;
    this.totalCmtCount = totalCmtCount;
  }

  private resetCmts(cmts: Cmt[]) {
    this.cmts = [...cmts];
    this.cmtIDs = new Set(cmts.map(c => c.id));
    this.updateStats(cmts.length, this.totalCmtCount);
  }

  private appendCmt(cmt: Cmt) {
    if (this.cmtIDs.has(cmt.id)) {
      return;
    }
    this.cmts = [...this.cmts, cmt];
    this.cmtIDs.add(cmt.id);
    this.updateStats(this.cmtCount + 1, this.totalCmtCount + 1);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-app': CmtApp;
  }
}
