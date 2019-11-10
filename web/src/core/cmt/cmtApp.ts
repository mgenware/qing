import { html, customElement, property, TemplateResult } from 'lit-element';
import BaseElement from 'baseElement';
import 'ui/cm/loadingView';
import Status from 'lib/status';
import ls from 'ls';
import ListCmtLoader from './loaders/listCmtLoader';
import Cmt from './cmt';
import './cmtView';

@customElement('cmt-app')
export class CmtApp extends BaseElement {
  @property({ type: Number }) initialCount = 0;
  @property() eID = '';
  @property({ type: Number }) eType = 0;

  @property({ type: Object }) status = Status.unstarted();
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
    return html`
      ${header}${content}
    `;
  }

  private async reloadAllAsync() {
    const loader = new ListCmtLoader(this.eID, this.eType, this.page);
    this.status = Status.started();
    try {
      const resp = await loader.startAsync();
      this.hasNext = resp.hasNext;
      this.status = Status.success();
      this.cmts.push(...(resp.cmts || []));
    } catch (err) {
      this.status = Status.failure(err);
    }
  }
}
