/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as pw from '@playwright/test';

export function asHTMLElement(e: HTMLElement | SVGElement): HTMLElement {
  if (e instanceof HTMLElement) {
    return e;
  }
  throw new Error(`Element is not an HTML element. Got ${e}`);
}
