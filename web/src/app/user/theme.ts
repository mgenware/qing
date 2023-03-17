/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as def from 'def.js';

export const textMap = new Map<def.UserTheme, string>([
  [def.UserTheme.light, globalThis.coreLS.themeLight],
  [def.UserTheme.dark, globalThis.coreLS.themeDark],
  [def.UserTheme.device, globalThis.coreLS.themeDevice],
]);

export const iconMap = new Map<def.UserTheme, string>([
  [def.UserTheme.light, 'light-mode.svg'],
  [def.UserTheme.dark, 'dark-mode.svg'],
  [def.UserTheme.device, 'device.svg'],
]);
