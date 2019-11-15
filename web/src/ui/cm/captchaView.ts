import { html, customElement, property, css } from 'lit-element';
import ls from 'ls';
import BaseElement from 'baseElement';
import routes from 'routes';

@customElement('captcha-view')
export class CaptchaView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        .root-img img {
          border: 1px solid var(--main-secondary-tint-color);
        }
        /* Disable the default hover filter */
        .root-img:hover {
          filter: none;
        }
      `,
    ];
  }

  @property({ type: Number }) eType = 0;
  @property({ type: Number }) private timestamp = Date.now();
  private textElement!: HTMLInputElement;

  firstUpdated() {
    this.textElement = this.mustGetShadowElement('inputElement');
  }

  render() {
    const src = `${routes.sr.reqCapt}?etype=${this.eType}&t=${this.timestamp}`;
    return html`
      <span>
        <a class="root-img" @click=${this.handleClick} href="#">
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

  private handleClick(e: Event) {
    e.preventDefault();
    this.refresh();
  }

  private handleEnterKeyUp(e: KeyboardEvent) {
    if (e.keyCode === 13) {
      this.dispatchEvent(new CustomEvent('onEnterKeyUp'));
    }
  }
}
