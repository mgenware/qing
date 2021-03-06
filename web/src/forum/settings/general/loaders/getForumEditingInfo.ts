/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import routes from 'routes';
import FModBaseLoader from './fmodBaseLoader';

export interface GetForumEditingInfo {
  name?: string;
  descHTML?: string;
}

export class GetForumEditingInfoLoader extends FModBaseLoader<GetForumEditingInfo> {
  requestURL(): string {
    return routes.s.pri.forum.fmod.getInfo;
  }
}
