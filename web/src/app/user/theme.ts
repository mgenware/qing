/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as defs from 'defs';
import ls from 'ls';

export const textMap = new Map<defs.UserTheme, string>([
  [defs.UserTheme.light, ls.themeLight],
  [defs.UserTheme.dark, ls.themeDark],
  [defs.UserTheme.device, ls.themeDevice],
]);

export const iconMap = new Map<defs.UserTheme, string>([
  [defs.UserTheme.light, 'light-mode.svg'],
  [defs.UserTheme.dark, 'dark-mode.svg'],
  [defs.UserTheme.device, 'device.svg'],
]);
