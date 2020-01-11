import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import 'ui/cm/itemCounter';
import './cmtView';
import './addCmtApp';
import './cmtListView';

@customElement('cmt-app')
export class CmtApp extends BaseElement {
  @lp.number initialCount = 0;
  @lp.string entityID = '';
  @lp.number entityType = 0;

  render() {
    return html`
      <cmt-list-view
        .initialTotalCount=${this.initialCount}
        .entityID=${this.entityID}
        .entityType=${this.entityType}
      ></cmt-list-view>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-app': CmtApp;
  }
}
