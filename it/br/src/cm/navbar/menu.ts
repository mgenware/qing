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

function dropdownMenu(menuBtnEl: br.BRElement) {
  return menuBtnEl.$('.dropdown');
}

export function userDropdownBtn(p: br.BRPage) {
  return p.$(navbarSel).$(userGroupSel);
}

export function themeDropdownBtn(p: br.BRPage) {
  return p.$(navbarSel).$(themeGroupSel);
}

export function userDropdownMenu(p: br.BRPage) {
  return dropdownMenu(userDropdownBtn(p));
}

export function themeDropdownMenu(p: br.BRPage) {
  return dropdownMenu(themeDropdownBtn(p));
}
