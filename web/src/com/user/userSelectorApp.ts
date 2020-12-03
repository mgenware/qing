import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import { CHECK } from 'checks';
import 'ui/form/inputView';
import 'ui/form/selectionView';
import ls from 'ls';

@customElement('user-selector-app')
export class UserSelectorApp extends BaseElement {
  @lp.bool byID = true;
  @lp.string value = '';

  firstUpdated() {
    CHECK(this.hostID);
    CHECK(this.hostType);
    this.totalCount = this.initialCount;
  }

  render() {
    return html`
      <div>${ls.findUsersByColon}</div>
      <div>
        <selection-view
          .dataSource=${[{ text: ls.userID, selected: true }, { text: ls.name }]}
        ></selection-view>
      </div>
      <input-view
        required
        value=${this.value}
        @onChange=${(e: CustomEvent<string>) => (this.value = e.detail)}
      ></input-view>
    `;
  }

  private handleTotalCountChangedWithOffset(e: CustomEvent<number>) {
    this.totalCount += e.detail;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'user-selector-app': UserSelectorApp;
  }
}
