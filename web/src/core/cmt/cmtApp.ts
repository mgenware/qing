import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import 'ui/cm/itemCounter';
import './cmtView';
import './addCmtApp';
import './cmtListView';
import { EntityType } from 'lib/entity';

@customElement('cmt-app')
export class CmtApp extends BaseElement {
  @lp.number initialCount = 0;
  @lp.string hostID = '';
  @lp.number hostType: EntityType = 0;
  @lp.number private totalCount = 0;

  firstUpdated() {
    this.totalCount = this.initialCount;
  }

  render() {
    return html`
      <cmt-list-view
        .totalCount=${this.totalCount}
        .hostID=${this.hostID}
        .hostType=${this.hostType}
        .needsUpdate=${!!this.initialCount}
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
