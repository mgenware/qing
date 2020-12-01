import { customElement, css, html } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import LoadingStatus from 'lib/loadingStatus';
import ls from 'ls';
// Views.
import 'ui/cm/sectionView';
import 'ui/cm/statusOverlay';

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
        <section-view type="info">${ls.adminAccounts}</section-view>
        <section-view type="warning">${ls.featureOnlyAvailableToAdmins}</section-view>
      </status-overlay>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'user-mgr-app': UserMgrApp;
  }
}
