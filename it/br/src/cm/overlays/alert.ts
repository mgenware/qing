/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from '@playwright/test';
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

function typeToString(type: AlertType): string {
  switch (type) {
    case AlertType.error:
      return 'danger';
    case AlertType.success:
      return 'success';
    case AlertType.warning:
      return 'warning';
    default:
      throw new Error('Not reachable');
  }
}

function getDialogEl(page: br.BRPage) {
  return page.$('#__g_dialog_container dialog-view[open] qing-overlay[open] dialog[open]');
}

export class BRDialog {
  constructor(public p: br.BRPage, public element: br.BRElement) {}

  async clickBtn(text: string) {
    await this.p.c.getByRole('button', { name: text, exact: true }).click();
    await this.element.waitForDetached();
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
  title?: string;
  type?: AlertType;
  focusedBtn?: number;
}

export async function wait(p: br.BRPage, e: AlertShouldAppearArgs) {
  // Wait for the alert to be fully shown.
  const el = getDialogEl(p);
  await el.waitForVisible();

  // Icon.
  if (e.type !== undefined) {
    await expect(el.$(`svg-icon[iconstyle="${typeToString(e.type)}"]`).c).toBeVisible();
  }

  // Title.
  if (e.title) {
    await expect(p.c.getByText(e.title)).toBeVisible();
  }
  return new BRDialog(p, el);
}
