/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import format from 'bowhead-js';

const postFS = '/p/{0}';

export function getPost(id: string) {
  return format(postFS, id);
}
