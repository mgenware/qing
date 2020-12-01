import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import ls from 'ls';
import app from 'app';

@customElement('profile-id-view')
export class ProfileIDView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        qing-button::part(button) {
          background-color: none;
          border: 0;
        }
      `,
    ];
  }

  @lp.string value = '';
  @lp.bool buttonDisabled = false;

  render() {
    const { value, buttonDisabled } = this;
    return html`
      <span>${value} </span>
      <qing-button class="small" .disabled=${buttonDisabled} @click=${this.handleCopyClick}
        >${buttonDisabled ? ls.copied : ls.copy}
      </qing-button>
    `;
  }

  private async handleCopyClick() {
    if (!navigator.clipboard || !this.value) {
      return;
    }
    try {
      await navigator.clipboard.writeText(this.value);
      this.buttonDisabled = true;
      setTimeout(() => (this.buttonDisabled = false), 1000);
    } catch (err) {
      await app.alert.error(err.message);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'profile-id-view': ProfileIDView;
  }
}
