/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br.js';

export enum AlertType {
  error,
  success,
  warning,
}

export enum AlertButtons {
  OK,
  YesNo,
}

function alertButtonsToArray(type: AlertButtons): string[] {
  switch (type) {
    case AlertButtons.OK:
      return ['OK'];
    case AlertButtons.YesNo:
      return ['Yes', 'No'];
    default:
      throw new Error('Not reachable');
  }
}

function typeToString(type: AlertType): string {
  switch (type) {
    case AlertType.error:
      return 'error';
    case AlertType.success:
      return 'success';
    case AlertType.warning:
      return 'warning';
    default:
      throw new Error('Not reachable');
  }
}

function getDialogEl(page: br.Page) {
  return page.$('#__g_dialog_container dialog-view');
}

export class BRDialog {
  constructor(public c: br.Element) {}

  async clickBtn(text: string) {
    await this.c.$qingButton(text).click();
    await this.c.waitForDetached();
  }

  clickYes() {
    return this.clickBtn('Yes');
  }

  clickNo() {
    return this.clickBtn('No');
  }

  clickCancel() {
    return this.clickBtn('Cancel');
  }

  clickOK() {
    return this.clickBtn('OK');
  }
}

export interface AlertShouldAppearArgs {
  content?: string;
  title?: string;
  type?: AlertType;
  buttons?: AlertButtons;
  focusedBtn?: number;
}

export async function waitFor(page: br.Page, e: AlertShouldAppearArgs) {
  // Wait for the alert to be fully shown.
  const el = getDialogEl(page);
  await el.waitForAttached();
  await el.e.toHaveAttribute('open', '');

  // Icon.
  if (e.type !== undefined) {
    await el.$(`svg-icon[iconstyle='${typeToString(e.type)}']`).e.toBeVisible();
  }

  // Content.
  if (e.content) {
    await el.$hasText('p', e.content).e.toBeVisible();
  }

  // Buttons.
  if (e.buttons !== undefined) {
    const btns = el.$$('#__buttons qing-button');
    const btnNames = alertButtonsToArray(e.buttons);
    await btns.shouldHaveCount(btnNames.length);
    await Promise.all(btnNames.map((b, i) => btns.item(i).e.toHaveText(b)));
  }

  return new BRDialog(el);
}