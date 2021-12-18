/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import sleep from 'base/sleep';
import * as brt from 'brt';

export enum AlertType {
  error,
  success,
  warning,
}

export enum AlertButtons {
  OK,
  YesNo,
}

function typeToTitle(type: AlertType): string {
  switch (type) {
    case AlertType.error:
      return 'Error';
    case AlertType.success:
      return 'Success';
    case AlertType.warning:
      return 'Warning';
    default:
      throw new Error('Not reachable');
  }
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

function getDialogEl(page: brt.Page) {
  return page.$('#__global_dialog_container dialog-view');
}

export async function checkNoVisibleAlert(expect: brt.Expect, page: brt.Page) {
  await expect(getDialogEl(page)).toHaveCount(0);
}

export async function checkVisibleAlert(
  expect: brt.Expect,
  page: brt.Page,
  title: string,
  content: string,
  type: AlertType,
  buttons: AlertButtons,
  focused: number,
): Promise<brt.ElementCollection> {
  // Wait for the alert to be fully shown.
  await sleep();
  const el = getDialogEl(page);
  await expect(el).toBeVisible();
  await expect(el.getAttribute('open')).toBe('');

  // Title.
  // eslint-disable-next-line no-param-reassign
  title ??= typeToTitle(type);
  await expect(el.$(`h2:has-text("${title}")`)).toBeVisible();

  // Icon.
  await expect(el.$(`svg-icon[iconstyle='${typeToString(type)}']`)).toBeVisible();

  // Content.
  await expect(el.$(`p:has-text("${content}")`)).toBeVisible();

  // Buttons.
  const btns = el.$$('#__buttons qing-button');
  const btnNames = alertButtonsToArray(buttons);
  await expect(btns).toHaveCount(btnNames.length);
  for (let i = 0; i < btnNames.length; i++) {
    const btn = btns.item(i);
    // eslint-disable-next-line no-await-in-loop
    await expect(btn.textContent()).toBe(btnNames[i] ?? null);
  }

  // Focused button.
  // Get the qing-overlay element to check the active element.
  // eslint-disable-next-line @typescript-eslint/no-shadow
  await expect(
    btns.item(focused).evaluate((el) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const overlayEl = (el.getRootNode() as any).host as HTMLElement;
      return el === overlayEl.shadowRoot?.activeElement;
    }),
  ).toBeTruthy();
  return btns;
}
