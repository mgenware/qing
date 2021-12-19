/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

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

export function waitForAlertDetached(page: brt.Page) {
  return getDialogEl(page).waitForDetached();
}

export async function alertShouldAppear(
  page: brt.Page,
  title: string,
  content: string,
  type: AlertType,
  buttons: AlertButtons,
  focused: number,
): Promise<brt.ElementCollection> {
  const { expect } = page;
  // Wait for the alert to be fully shown.
  const el = await getDialogEl(page).waitForVisible();
  await expect(el.getAttribute('open')).toBe('');

  // Title.
  // eslint-disable-next-line no-param-reassign
  title ??= typeToTitle(type);
  await el.$(`h2:has-text("${title}")`).shouldBeVisible();

  // Icon.
  await el.$(`svg-icon[iconstyle='${typeToString(type)}']`).shouldBeVisible();

  // Content.
  await el.$(`p:has-text("${content}")`).shouldBeVisible();

  // Buttons.
  const btns = el.$$('#__buttons qing-button');
  const btnNames = alertButtonsToArray(buttons);
  await btns.shouldHaveCount(btnNames.length);
  await Promise.all(btnNames.map((b, i) => expect(btns.item(i).shouldHaveTextContent(b))));

  // Focused button.
  // Get the qing-overlay element to check the active element.
  // eslint-disable-next-line @typescript-eslint/no-shadow
  await expect(
    btns.item(focused).evaluate((e) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const overlayEl = (e.getRootNode() as any).host as HTMLElement;
      return e === overlayEl.shadowRoot?.activeElement;
    }),
  ).toBeTruthy();
  return btns;
}
