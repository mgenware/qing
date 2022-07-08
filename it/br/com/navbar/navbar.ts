/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';

const navSel = '#main-navbar';

export function navEl(p: br.Page) {
  return p.$(navSel);
}

function menuBtn(p: br.Page, idx: number) {
  return navEl(p).$$('.dropdown-btn').item(idx);
}

function menuEl(menuBtnEl: br.Element) {
  return menuBtnEl.$('.dropdown');
}

export function userMenuBtn(p: br.Page) {
  return menuBtn(p, 0);
}

export function themeMenuBtn(p: br.Page) {
  return menuBtn(p, 1);
}

export function userMenuEl(p: br.Page) {
  return menuEl(userMenuBtn(p));
}

export function themeMenuEl(p: br.Page) {
  return menuEl(themeMenuBtn(p));
}
