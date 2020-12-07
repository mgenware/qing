import { html, customElement, css } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import UserInfo from './userInfo';

@customElement('user-card')
export class UserCard extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
        }
      `,
    ];
  }

  @lp.object user!: UserInfo;

  render() {
    const { user } = this;
    return html`
      <img src=${user.iconURL} class="avatar-m vertical-align-middle" width="40" height="40" />
      <span class="m-l-xs">${user.name}</span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'user-card': UserCard;
  }
}