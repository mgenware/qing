/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';

export interface ButtonTraits {
  text: string;
  focused?: boolean;
  style?: string;
}

export async function buttonShouldHaveFocus(el: brt.Element) {
  await el.$('button').shouldHaveFocus();
  return el;
}

export async function buttonShouldAppear(el: brt.Element, traits: ButtonTraits) {
  await el.shouldHaveTextContent(traits.text);
  if (traits.focused) {
    await buttonShouldHaveFocus(el);
  }
  if (traits.style) {
    await el.shouldHaveAttr('btnStyle', traits.style);
  }
  return el;
}
