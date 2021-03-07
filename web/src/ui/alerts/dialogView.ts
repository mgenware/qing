import { customElement, css, html, TemplateResult } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import 'qing-overlay';
import 'ui/widgets/svgIcon';
import { CHECK } from 'checks';
import { staticMainImage } from 'urls';

const iconSize = 48;
const buttonContainerID = '__buttons';
const transitionDelay = 50;

export enum DialogIcon {
  error = 1,
  success,
  warning,
}

@customElement('dialog-view')
export class DialogView extends BaseElement {
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

  @lp.bool open = false;
  @lp.string title = '';
  @lp.string message = '';
  @lp.number icon: DialogIcon = 0;
  @lp.array buttons: string[] = [];
  @lp.number defaultButton = -1;
  @lp.number cancelButton = -1;

  private iconElement?: TemplateResult;
  private closingButton = -1;

  constructor() {
    super();

    if (this.icon) {
      this.iconElement = this.getIconElement(this.icon);
    }
  }

  render() {
    return html`
      <qing-overlay ?open=${this.open} @openChanged=${this.handleOpenChanged}>
        <h2 style="margin: 1rem 0">
          ${this.iconElement}
          <span style="vertical-align: middle">${this.title}</span>
        </h2>
        <p>${this.message}</p>
        <p id=${buttonContainerID}>${this.renderButtons()}</p>
      </qing-overlay>
    `;
  }

  firstUpdated() {
    this.getButtonElement('def')?.focus();
  }

  private getButtonElement(type: 'def' | 'esc'): HTMLElement | null {
    const userIdx = type === 'def' ? this.defaultButton : this.cancelButton;
    const idx = this.buttons.length === 1 ? 0 : userIdx;
    if (idx < 0) {
      return null;
    }
    return (
      this.shadowRoot
        ?.getElementById(buttonContainerID)
        ?.querySelector(`qing-button:nth-child(${idx + 1})`) ?? null
    );
  }

  private renderButtons() {
    return this.buttons.map(
      (b, i) => html`<qing-button @click=${() => this.handleButtonClick(b, i)}>${b}</qing-button>`,
    );
  }

  private handleButtonClick(_: string, idx: number) {
    this.closingButton = idx;
    this.open = false;
  }

  private handleOpenChanged(e: CustomEvent<boolean>) {
    const opened = e.detail;
    this.open = opened;
    // Delay events a little bit to wait for transition completion.
    setTimeout(() => {
      if (opened) {
        this.dispatchEvent(new CustomEvent('dialogShown'));
      } else {
        this.dispatchEvent(
          new CustomEvent<number>('dialogClosed', { detail: this.closingButton }),
        );
      }
    }, transitionDelay);
  }

  private getIconElement(icon: DialogIcon): TemplateResult {
    let iconStr = '';
    switch (icon) {
      case DialogIcon.error:
        iconStr = 'error';
        break;
      case DialogIcon.success:
        iconStr = 'success';
        break;
      case DialogIcon.warning:
        iconStr = 'warning';
        break;
      default:
        break;
    }
    if (!iconStr) {
      CHECK(0);
      return html``;
    }
    return html`<svg-icon
      class="liked"
      .oneTimeSrc=${staticMainImage(iconStr)}
      .size=${iconSize}
    ></svg-icon>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dialog-view': DialogView;
  }
}
