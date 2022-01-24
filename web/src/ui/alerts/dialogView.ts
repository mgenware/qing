/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, TemplateResult } from 'll';
import * as lp from 'lit-props';
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

        .dialog-btn {
          min-width: var(--app-dialog-btn-min-width);
        }

        .dialog-btn:not(:first-child) {
          margin-left: var(--app-dialog-btn-spacing);
        }
      `,
    ];
  }

  @lp.bool open = false;
  @lp.string title = '';
  @lp.string message = '';
  @lp.number icon: DialogIcon = 0;
  @lp.array buttons: readonly string[] = [];
  @lp.number defaultButton = -1;
  @lp.number cancelButton = -1;

  private closingButton = -1;

  render() {
    const iconEl = this.getIconElement(this.icon);
    return html`
      <qing-overlay
        ?open=${this.open}
        @openChanged=${this.handleOpenChanged}
        @escKeyDown=${this.handleEscDown}>
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

  private async handleOpenChanged(e: CustomEvent<boolean>) {
    const opened = e.detail;
    this.open = opened;

    await delay(transitionDelay);
    // Delay events a little bit to wait for transition completion.
    if (opened) {
      // Focus the default button. This must happens before `dialogShown` fires, as
      // `dialogShown` might change the focus later.
      this.getButtonElement('def')?.focus();
      this.dispatchEvent(new CustomEvent('dialogShown'));
    } else {
      this.dispatchEvent(new CustomEvent<number>('dialogClosed', { detail: this.closingButton }));
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
