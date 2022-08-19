/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, TemplateResult, property } from 'll';
import 'qing-overlay';
import 'ui/widgets/svgIcon';
import delay from 'lib/delay';
import { staticMainImage } from 'urls';

const iconSize = 58;
const buttonContainerID = '__buttons';
const transitionDelay = 50;

export enum DialogIcon {
  error = 1,
  success,
  warning,
}

@customElement('dialog-view')
export class DialogView extends BaseElement {
  static override get styles() {
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

        .dialog-btn {
          min-width: var(--app-dialog-btn-min-width);
        }

        .dialog-btn:not(:first-child) {
          margin-left: var(--app-dialog-btn-spacing);
        }
      `,
    ];
  }

  @property({ type: Boolean }) open = false;
  @property() dialogTitle = '';
  @property() message = '';
  @property({ type: Number }) icon: DialogIcon = 0;
  @property({ type: Array }) buttons: readonly string[] = [];
  @property({ type: Number }) defaultButton = -1;
  @property({ type: Number }) cancelButton = -1;

  private closingButton = -1;

  override render() {
    const iconEl = this.getIconElement(this.icon);
    return html`
      <qing-overlay
        ?open=${this.open}
        @overlay-open=${() => this.handleOpenChanged(true)}
        @overlay-close=${() => this.handleOpenChanged(false)}
        @overlay-esc-down=${this.handleEscDown}>
        <div class="text-center" style="margin: 1rem">
          <div class="m-t-lg">${iconEl}</div>
          <h2>${this.dialogTitle}</h2>
          <p>${this.message}</p>
          <!-- Don't use <p> here. Margins are handcrafted. -->
          <div id=${buttonContainerID} style="padding:0; margin-top: 1.2rem" class="text-center">
            ${this.renderButtons()}
          </div>
        </div>
      </qing-overlay>
    `;
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
      (b, i) => html`<qing-button class="dialog-btn" @click=${() => this.handleButtonClick(b, i)}
        >${b}</qing-button
      >`,
    );
  }

  private handleButtonClick(_: string, idx: number) {
    this.closingButton = idx;
    this.open = false;
  }

  private async handleOpenChanged(opened: boolean) {
    this.open = opened;

    await delay(transitionDelay);
    // Delay events a little bit to wait for transition completion.
    if (opened) {
      // Focus the default button. This must happens before `dialog-show` fires, as
      // `dialog-show` might change the focus later.
      this.getButtonElement('def')?.focus();
      this.dispatchEvent(new CustomEvent('dialog-show'));
    } else {
      this.dispatchEvent(new CustomEvent<number>('dialog-close', { detail: this.closingButton }));
    }
  }

  private handleEscDown() {
    this.getButtonElement('esc')?.click();
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
      .size=${iconSize}></svg-icon>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dialog-view': DialogView;
  }
}
