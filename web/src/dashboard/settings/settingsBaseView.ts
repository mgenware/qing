import { html, customElement, css } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import ls from 'ls';
import rs from 'routes';

@customElement('settings-base-view')
export class SettingsBaseView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        div {
          display: inline-block;
          padding: 5px 8px;
          background-color: var(--danger-back-color);
          color: var(--danger-fore-color);
          border-radius: 4px;
          margin-bottom: 10px;
        }
      `,
    ];
  }

  @lp.string message = '';

  render() {
    const { message } = this;
    if (!message) {
      return html``;
    }
    return html`
      <div class="row">
        <div class="col-md-auto">
          <aside>
            <p class="menu-label">${ls.common}</p>
            <ul class="menu-list">
              <li>
                <a href=${rs.home.newPost}>${ls.newPost}</a>
              </li>
              <li>
                <a href=${rs.home.posts}>${ls.posts}</a>
              </li>
            </ul>
            <p class="menu-label">${ls.settings}</p>
            <ul class="menu-list">
              <li>
                <a href=${rs.home.editProfile}>${ls.profile}</a>
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
