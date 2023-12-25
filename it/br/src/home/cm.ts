/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from '@playwright/test';
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

export async function checkHomeItem(el: br.BRElement, e: CheckHomeItemArgs) {
  if (e.mode === HomePageMode.everyone && !e.user) {
    throw new Error('`user` cannot be null for `HomePageMode.everyone`');
  }

  // In default mode, content div is wrapped as the last child of current element.
  // In personal mode, content div is the current element.
  const contentDiv = e.mode === HomePageMode.personal ? el : el.$('> :last-child');
  await contentDiv.$hasText('.fi-title', e.title).shouldExist();
  await contentDiv.$a({ href: e.link }).shouldExist();
  const bottomBarEl = contentDiv.$('> :last-child');
  if (e.mode === HomePageMode.everyone && e.user) {
    const avatarDiv = el.$('> :first-child');
    await expect(avatarDiv.$('a').c).toHaveAttribute('href', e.user.link);
    await expect(avatarDiv.$('img').c).toHaveAttribute('src', e.user.iconURL);
    await bottomBarEl.$a({ href: e.user.link, text: e.user.name }).shouldExist();
  }
}
