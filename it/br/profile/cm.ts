/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br.js';

export interface CheckProfileFeedArgs {
  title: string;
  link: string;
}

export async function checkProfileFeed(el: br.Element, e: CheckProfileFeedArgs) {
  await el.$a({ href: e.link, text: e.title }).e.toBeVisible();
}
