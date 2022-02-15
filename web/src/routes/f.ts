/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import format from 'bowhead-js';

const f = '/f/{0}';

const rawSettings = `${f}/settings`;
const rawSettingsMods = `${rawSettings}/mods`;

export function settings(id: string) {
  return format(rawSettings, id);
}

export function settingsMods(id: string) {
  return format(rawSettingsMods, id);
}
