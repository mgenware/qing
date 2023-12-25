/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from '@playwright/test';
import * as br from 'br.js';

export interface ButtonTraits {
  focused?: boolean;
  style?: string;
}

export async function shouldHaveFocus(el: br.BRElement) {
  await expect(el.$('button').c).toBeFocused();
  return el;
}

export async function shouldAppear(el: br.BRElement, traits?: ButtonTraits) {
  if (traits?.focused) {
    await shouldHaveFocus(el);
  }
  if (traits?.style) {
    await expect(el.c).toHaveAttribute('btnStyle', traits.style);
  }
  return el;
}
