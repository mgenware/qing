import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import { CHECK } from 'checks';
import UserInfo from '../userInfo';

@customElement('find-user-item-view')
export class FindUserItemView extends BaseElement {
  @lp.object user: UserInfo | undefined;

  firstUpdated() {
    CHECK(this.user);
  }

  render() {
    const { user } = this;
    return html`
      <div class="m-t-md row">
        <div class="col-auto">
          <a href=${user?.url ?? ''}>
            <img src="{{.UserIconURL}}" class="avatar-m" width="50" height="50" />
          </a>
        </div>
        <div class="col">
          <div><a href="{{.UserURL}}">{{html .UserName}}</a></div>
          <p>
            <!-- prettier-ignore -->
            <time-field>{{.ItemCreatedAt.Format "2006-01-02T15:04:05Z07:00"}}{{if .ItemModifiedAt}}|{{.ItemModifiedAt.Format "2006-01-02T15:04:05Z07:00"}}{{end}}</time-field>
            <edit-bar itemID="{{.ItemEID}}" itemUserID="{{.UserEID}}" hasLeftMargin></edit-bar>
          </p>
        </div>
      </div>
    `;
  }

  private handleTotalCountChangedWithOffset(e: CustomEvent<number>) {
    this.totalCount += e.detail;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'find-user-item-view': FindUserItemView;
  }
}
