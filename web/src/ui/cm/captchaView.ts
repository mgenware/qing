import { html, customElement, property } from 'lit-element';
import ls from 'ls';
import BaseElement from 'baseElement';
const MAPI_CAPT_REQ = '/sr/req-capt';

@customElement('captcha-view')
export class CaptchaView extends BaseElement {
  @property() eType = '';
  @property({ type: Number }) private timestamp = Date.now();
  private textElement!: HTMLInputElement;

  firstUpdated() {
    this.textElement = this.mustGetShadowElement('inputElement');
  }

  render() {
    const src = `${MAPI_CAPT_REQ}?etype=${this.eType}&t=${this.timestamp}`;
    return html`
      <span>
        <a @click=${this.handleClick} href="#">
          <!-- the v-if is necessary, when uesr reloads this, timestamp first turns to 0 and this image disappears and then appears in order to clear the previous content especially useful when network condition is bad -->
          <img
            id="img"
            src=${src}
            width="150"
            height="45"
            style="background-color: white"
            title=${ls.clickToRefreshCapt}
            data-toggle="tooltip"
            data-placement="top"
          />
        </a>
        <br />
        <span class="form">
          <input
            id="inputElement"
            style="width: 150px"
            class="m-t-sm input"
            type="text"
            @keyup=${this.handleEnterKeyUp}
            placeholder=${ls.enterCaptchaPlz}
          />
        </span>
      </span>
    `;
  }

  focus() {
    this.textElement.focus();
  }

  refresh() {
    this.timestamp = Date.now();
  }

  get value(): string {
    return this.textElement.value;
  }

  private handleClick() {
    this.refresh();
  }

  private handleEnterKeyUp(e: KeyboardEvent) {
    if (e.keyCode === 13) {
      this.dispatchEvent(new CustomEvent('onEnterKeyUp'));
    }
  }
}
