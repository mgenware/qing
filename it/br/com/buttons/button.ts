/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';

export interface ButtonTraits {
  text: string;
  focused?: boolean;
  style?: string;
}

export async function shouldHaveFocus(el: br.Element) {
  await el.$('button').e.toBeFocused();
  return el;
}

export async function shouldAppear(el: br.Element, traits: ButtonTraits) {
  await el.e.toHaveText(traits.text);
  if (traits.focused) {
    await shouldHaveFocus(el);
  }
  if (traits.style) {
    await el.e.toHaveAttribute('btnStyle', traits.style);
  }
  return el;
}
