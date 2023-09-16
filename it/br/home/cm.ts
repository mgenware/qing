/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br.js';

export const homePostBRPrefix = '__BR_';

export enum HomePageMode {
  personal,
  everyone,
}

export interface CheckHomeItemArgs {
  mode: HomePageMode;
  user?: br.User;
  title: string;
  link: string;
}

export async function checkHomeItem(el: br.Element, e: CheckHomeItemArgs) {
  if (e.mode === HomePageMode.everyone && !e.user) {
    throw new Error('`user` cannot be null for `HomePageMode.everyone`');
  }
  const avatarDiv = el.$('> :first-child');
  const contentDiv = el.$('> :last-child');
  await contentDiv.$a({ href: e.link }).shouldExist();
  await contentDiv.$hasText('.fi-title', e.title).shouldExist();
  const bottomBarEl = contentDiv.$('> :last-child');
  if (e.user) {
    await avatarDiv.$('a').e.toHaveAttribute('href', e.user.link);
    await avatarDiv.$('img').e.toHaveAttribute('src', e.user.iconURL);
    await bottomBarEl.$a({ href: e.user.link, text: e.user.name }).shouldExist();
  }
}
