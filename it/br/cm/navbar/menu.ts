/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br.js';

export const navbarSel = '#main-navbar';
const userGroupSel = '.dropdown-btn.dropdown-btn-user';
const themeGroupSel = '.dropdown-btn.dropdown-btn-sys-theme';

function dropdownMenu(menuBtnEl: br.Element) {
  return menuBtnEl.$('.dropdown');
}

export function userDropdownBtn(p: br.Page) {
  return p.$(navbarSel).$(userGroupSel);
}

export function themeDropdownBtn(p: br.Page) {
  return p.$(navbarSel).$(themeGroupSel);
}

export function userDropdownMenu(p: br.Page) {
  return dropdownMenu(userDropdownBtn(p));
}

export function themeDropdownMenu(p: br.Page) {
  return dropdownMenu(themeDropdownBtn(p));
}
