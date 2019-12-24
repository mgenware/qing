import { html, customElement, property, TemplateResult } from 'lit-element';
import BaseElement from 'baseElement';
import 'ui/cm/loadingView';
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

  @property({ type: Object }) status = Status.empty();
  @property({ type: Boolean }) hasNext = false;
  @property({ type: Array }) cmts: Cmt[] = [];
  private page = 1;

  async firstUpdated() {
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
    if (!cmts.length && this.status.isSuccess) {
      content = html`
        <span>${ls.noComment}</span>
      `;
    } else if (cmts.length) {
      content = html`
        <div>
          ${cmts.map(
            cmt =>
              html`
                <cmt-view .cmt=${cmt}></cmt-view>
              `,
          )}
        </div>
      `;
    } else {
      content = html`
        <loading-view
          .status=${this.status}
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
      this.status = status;
      if (status.isSuccess && status.data) {
        const resp = status.data;
        this.hasNext = resp.hasNext;
        this.cmts.push(...(resp.cmts || []));
      }
    });
  }

  private async handleCmtAdded(e: CustomEvent<SetCmtResponse>) {
    if (e.detail) {
      this.cmts.push(e.detail.cmt);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-app': CmtApp;
  }
}
