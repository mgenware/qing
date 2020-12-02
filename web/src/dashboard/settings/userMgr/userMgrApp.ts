import { customElement, css, html } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import LoadingStatus from 'lib/loadingStatus';
import ls from 'ls';
// Views.
import 'ui/com/sectionView';
import 'ui/com/statusOverlay';
import 'ui/com/tagView';

@customElement('user-mgr-app')
export class UserMgrApp extends BaseElement {
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

  @lp.bool adminSectionStatus = LoadingStatus.success;

  render() {
    return html`
      <status-overlay .status=${this.adminSectionStatus}>
        <section-view sectionStyle="info">
          <span>${ls.adminAccounts}</span>
          <tag-view tagStyle="warning">${ls.featureOnlyAvailableToAdmins}</tag-view>
        </section-view>
      </status-overlay>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'user-mgr-app': UserMgrApp;
  }
}
