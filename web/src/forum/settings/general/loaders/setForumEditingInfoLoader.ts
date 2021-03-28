/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import routes from 'routes';
import FModBaseLoader from './fmodBaseLoader';

export default class SetForumEditingInfoLoader extends FModBaseLoader<undefined> {
  constructor(forumID: string, public name: string, public descHTML: string) {
    super(forumID);
  }

  requestURL(): string {
    return routes.s.pri.forum.fmod.setInfo;
  }

  requestParams(): Record<string, unknown> {
    return {
      ...super.requestParams(),
      name: this.name,
      desc: this.descHTML,
    };
  }
}
