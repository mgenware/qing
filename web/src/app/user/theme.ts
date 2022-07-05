/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as def from 'def';
import ls from 'ls';

export const textMap = new Map<def.UserTheme, string>([
  [def.UserTheme.light, ls.themeLight],
  [def.UserTheme.dark, ls.themeDark],
  [def.UserTheme.device, ls.themeDevice],
]);

export const iconMap = new Map<def.UserTheme, string>([
  [def.UserTheme.light, 'light-mode.svg'],
  [def.UserTheme.dark, 'dark-mode.svg'],
  [def.UserTheme.device, 'device.svg'],
]);
