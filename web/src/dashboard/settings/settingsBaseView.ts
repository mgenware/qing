import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import ls from 'ls';
import rs from 'routes';

@customElement('settings-base-view')
export class SettingsBaseView extends BaseElement {
  render() {
    return html`
      <div class="row">
        <div class="col-md-auto">
          <aside>
            <p class="menu-label">${ls.settings}</p>
            <ul class="menu-list">
              <li>
                <a href=${rs.home.settings.profile}>${ls.profile}</a>
              </li>
            </ul>
          </aside>
        </div>
        <div class="col-md">
          <div class="m-md">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'settings-base-view': SettingsBaseView;
  }
}
