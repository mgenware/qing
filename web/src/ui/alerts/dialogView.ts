import { customElement, css, html, TemplateResult } from 'lit-element';
// eslint-disable-next-line import/no-extraneous-dependencies
import { classMap } from 'lit-html/directives/class-map';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import 'qing-overlay';
import 'ui/widgets/svgIcon';
import { staticMainImage } from 'urls';

const iconSize = 58;
const buttonContainerID = '__buttons';
const transitionDelay = 50;

export enum DialogIcon {
  error = 1,
  success,
  warning,
}

const defaultBtnClass = '__def_btn';
const cancelBtnClass = '__esc_btn';

@customElement('dialog-view')
export class DialogView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        /** Remove the default padding */
        qing-overlay::part(overlay) {
          padding: 0;
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

  private closingButton = -1;

  get defaultButtonElement(): HTMLElement | null {
    return this.queryShadowElements(`.${defaultBtnClass}`);
  }
  get cancelButtonElement(): HTMLElement | null {
    return this.queryShadowElements(`.${cancelBtnClass}`);
  }

  render() {
    const iconEl = this.getIconElement(this.icon);
    return html`
      <qing-overlay ?open=${this.open} @openChanged=${this.handleOpenChanged}>
        <div class="text-center" style="margin: 1rem">
          <div class="m-t-lg">${iconEl}</div>
          <h2>${this.title}</h2>
          <p>${this.message}</p>
          <!-- Don't use <p> here. Margins are handcrafted. -->
          <div id=${buttonContainerID} style="padding:0; margin-top: 1.2rem" class="text-center">
            ${this.renderButtons()}
          </div>
        </div>
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
    const oneButton = this.buttons.length === 1;
    return this.buttons.map((b, i) => {
      const isDefaultBtn = oneButton || i === this.defaultButton;
      const isCancelBtn = oneButton || i === this.cancelButton;
      return html`<qing-button
        class=${classMap({
          'm-l-md': i,
          [defaultBtnClass]: isDefaultBtn,
          [cancelBtnClass]: isCancelBtn,
        })}
        @click=${() => this.handleButtonClick(b, i)}
        >${b}</qing-button
      >`;
    });
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
    let iconName = '';
    // See `svg-icon.iconStyle`.
    let iconStyle = '';
    switch (icon) {
      case DialogIcon.error:
        iconName = 'error';
        iconStyle = 'danger';
        break;
      case DialogIcon.success:
        iconName = iconStyle = 'success';
        break;
      case DialogIcon.warning:
        iconName = iconStyle = 'warning';
        break;
      default:
        break;
    }
    if (!iconName) {
      return html``;
    }
    return html`<svg-icon
      iconStyle=${iconStyle}
      .oneTimeSrc=${staticMainImage(`${iconName}.svg`)}
      .size=${iconSize}
    ></svg-icon>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dialog-view': DialogView;
  }
}