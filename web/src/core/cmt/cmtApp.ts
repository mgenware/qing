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

  render() {
    return html`
      <cmt-list-view
        .initialTotalCount=${this.initialCount}
        .hostID=${this.hostID}
        .hostType=${this.hostType}
      ></cmt-list-view>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-app': CmtApp;
  }
}
