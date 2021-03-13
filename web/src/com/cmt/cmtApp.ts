import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import 'ui/lists/itemCounter';
import './cmtView';
import './addCmtApp';
import './cmtListView';
import { CHECK } from 'checks';

@customElement('cmt-app')
export class CmtApp extends BaseElement {
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

  @lp.number initialCount = 0;
  @lp.string hostID = '';
  @lp.number hostType = 0;
  @lp.number private totalCount = 0;

  firstUpdated() {
    CHECK(this.hostID);
    CHECK(this.hostType);
    this.totalCount = this.initialCount;
  }

  render() {
    return html`
      <cmt-list-view
        .totalCount=${this.totalCount}
        .hostID=${this.hostID}
        .hostType=${this.hostType}
        .loadOnVisible=${!!this.initialCount}
        @totalCountChangedWithOffset=${this.handleTotalCountChangedWithOffset}
      ></cmt-list-view>
    `;
  }

  private handleTotalCountChangedWithOffset(e: CustomEvent<number>) {
    this.totalCount += e.detail;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-app': CmtApp;
  }
}
