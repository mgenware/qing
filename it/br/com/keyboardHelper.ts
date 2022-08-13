/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { Element } from 'br';

export const enterKeyHandlerSel = 'enter-key-handler';

export function shouldBeEnterKeyResponder(el: Element) {
  return el.e.toHaveClass(/enter-key-responder/);
}
