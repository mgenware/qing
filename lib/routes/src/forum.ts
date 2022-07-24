/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import format from 'bowhead-js';

const forumFS = '/f/{0}';

const rawSettings = `${forumFS}/settings`;
const rawSettingsMods = `${rawSettings}/mods`;

export function getSettings(id: string) {
  return format(rawSettings, id);
}

export function getSettingsMods(id: string) {
  return format(rawSettingsMods, id);
}
