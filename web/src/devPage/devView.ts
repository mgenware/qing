import { html, customElement } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import routes from './devRoutes';

@customElement('dev-view')
export class DevView extends BaseElement {
  @lp.string loginUserID = '1';

  render() {
    return html`
      <h1>Qing Debug Page</h1>
      <hr />
      <ul>
        <li><a href=${routes.authRoot}>Auth</a></li>
        <li><a href=${routes.elements}>Elements</a></li>
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dev-view': DevView;
  }
}
