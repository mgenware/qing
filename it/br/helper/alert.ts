/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { Browser, ass } from 'base/br';

export enum AlertType {
  error,
  success,
  warning,
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

export async function checkVisibleAlert(
  br: Browser,
  title: string,
  content: string,
  type: AlertType,
  buttons: string[],
  focused: number,
) {
  const el = await br.page.$('#__global_dialog_container dialog-view');
  ass.t(el);
  ass.e(await el.getAttribute('open'), '');

  // Title.
  title ??= typeToTitle(type);
  ass.t(await el.$(`h2:has-text("${title}")`));

  // Icon.
  ass.t(await el.$(`svg-icon[iconstyle='${typeToString(type)}']`));

  // Content.
  ass.t(await el.$(`p:has-text("${content}")`));

  // Buttons.
  const btns = await el.$$('#__buttons qing-button');
  ass.t(btns.length === buttons.length);
  for (let i = 0; i < btns.length; i++) {
    const btn = btns[i];
    ass.t(btn);
    ass.equalsToString(await btn.textContent(), buttons[i] ?? null);
  }
  // Focused button.
  ass.t(
    await btns[focused]?.evaluate((el) => {
      console.log(' ---- ', document.activeElement);
      return el === document.activeElement;
    }),
  );
}
