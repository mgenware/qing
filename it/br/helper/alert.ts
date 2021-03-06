/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ass } from 'base/br';
import sleep from 'base/sleep';
import testing from 'testing';

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

async function getDialogEl(page: testing.Page) {
  return page.$('#__global_dialog_container dialog-view');
}

export async function checkNoVisibleAlert(page: testing.Page) {
  const el = await getDialogEl(page);
  ass.f(el);
}

export async function checkVisibleAlert(
  page: testing.Page,
  title: string,
  content: string,
  type: AlertType,
  buttons: AlertButtons,
  focused: number,
) {
  // Wait for the alert to be fully shown.
  await sleep();
  const el = await getDialogEl(page);
  ass.t(el);
  ass.e(await el.getAttribute('open'), '');

  // Title.
  // eslint-disable-next-line no-param-reassign
  title ??= typeToTitle(type);
  ass.t(await el.$(`h2:has-text("${title}")`));

  // Icon.
  ass.t(await el.$(`svg-icon[iconstyle='${typeToString(type)}']`));

  // Content.
  ass.t(await el.$(`p:has-text("${content}")`));

  // Buttons.
  const btns = await el.$$('#__buttons qing-button');
  const btnNames = alertButtonsToArray(buttons);
  ass.t(btns.length === btnNames.length);
  for (let i = 0; i < btns.length; i++) {
    const btn = btns[i];
    ass.t(btn);
    // eslint-disable-next-line no-await-in-loop
    ass.equalsToString(await btn.textContent(), btnNames[i] ?? null);
  }

  // Focused button.
  // Get the qing-overlay element to check the active element.
  ass.t(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    await btns[focused]?.evaluate((el) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const overlayEl = (el.getRootNode() as any).host as HTMLElement;
      return el === overlayEl.shadowRoot?.activeElement;
    }),
  );
  return btns;
}
