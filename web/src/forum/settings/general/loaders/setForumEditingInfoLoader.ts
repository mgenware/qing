/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as fmodRoute from '@qing/routes/s/pri/forum/fmod.js';
import FModBaseLoader from './fmodBaseLoader.js';

export default class SetForumEditingInfoLoader extends FModBaseLoader<undefined> {
  constructor(forumID: string, public name: string, public descHTML: string) {
    super(forumID);
  }

  override requestURL(): string {
    return fmodRoute.setInfo;
  }

  override requestParams(): Record<string, unknown> {
    return {
      ...super.requestParams(),
      name: this.name,
      desc: this.descHTML,
    };
  }
}
