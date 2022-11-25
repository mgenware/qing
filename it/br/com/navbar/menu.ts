/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br.js';

export const navbarSel = '#main-navbar';
const userGroupSel = '.user-group';
const themeGroupSel = '.theme-group';

function menuEl(menuBtnEl: br.Element) {
  return menuBtnEl.$('.dropdown');
}

export function userMenuBtn(p: br.Page) {
  return p.$(navbarSel).$(userGroupSel);
}

export function themeMenuBtn(p: br.Page) {
  return p.$(navbarSel).$(themeGroupSel);
}

export function userMenuEl(p: br.Page) {
  return menuEl(userMenuBtn(p));
}

export function themeMenuEl(p: br.Page) {
  return menuEl(themeMenuBtn(p));
}
