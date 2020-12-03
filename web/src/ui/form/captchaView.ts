import { html, customElement, property, css } from 'lit-element';
import ls from 'ls';
import BaseElement from 'baseElement';
import routes from 'routes';
import 'ui/form/inputView';

@customElement('captcha-view')
export class CaptchaView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
        }

        .root-img img {
          border: 1px solid var(--default-separator-color);
        }
        /* Disable the default hover filter */
        .root-img:hover {
          filter: none;
        }

        #inputElement {
          width: 150px;
          margin-bottom: 0.8rem;
          line-height: 1.5;
          padding: 0.25rem 0.4rem;
          padding: 0.35rem 0.6rem;
          border-radius: 5px;
        }
      `,
    ];
  }

  @property({ type: Number }) entityType = 0;
  @property({ type: Number }) private timestamp = Date.now();
  private textElement!: HTMLInputElement;

  firstUpdated() {
    this.textElement = this.mustGetShadowElement('inputElement');
  }

  render() {
    const src = `${routes.s.pri.reqCapt}?entityType=${this.entityType}&t=${this.timestamp}`;
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
        <span style="width: 150px">
          <input
            id="inputElement"
            class="m-t-sm app-inline-text-input"
            type="text"
            @keydown=${this.handleEnterKeyDown}
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

  private handleEnterKeyDown(e: KeyboardEvent) {
    if (e.target === this.textElement && e.keyCode === 13) {
      this.dispatchEvent(new CustomEvent('onEnterKeyDown'));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'captcha-view': CaptchaView;
  }
}
