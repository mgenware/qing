/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';

export const navbarSel = '#main-navbar';
const userGroupSel = '.user-group';
const themeGroupSel = '.theme-group';

export function navEl(p: br.Page) {
  return p.$(navbarSel);
}

function menuEl(menuBtnEl: br.Element) {
  return menuBtnEl.$('.dropdown');
}

export function userMenuBtn(p: br.Page) {
  return navEl(p).$(userGroupSel);
}

export function themeMenuBtn(p: br.Page) {
  return navEl(p).$(themeGroupSel);
}

export function userMenuEl(p: br.Page) {
  return menuEl(userMenuBtn(p));
}

export function themeMenuEl(p: br.Page) {
  return menuEl(themeMenuBtn(p));
}
