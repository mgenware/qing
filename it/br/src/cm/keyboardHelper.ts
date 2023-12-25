/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from '@playwright/test';
import { BRElement } from 'br.js';

export const enterKeyHandlerSel = 'enter-key-handler';

export function shouldBeEnterKeyResponder(el: BRElement) {
  return expect(el.c).toHaveClass(/enter-key-responder/);
}
