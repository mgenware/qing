/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader.js';
import * as likeRoute from '@qing/routes/s/pri/like.js';
import { CHECK } from 'checks.js';
import LikeHostType from './likeHostType.js';

export default class SetLikeLoader extends Loader<string> {
  constructor(public id: string, public type: LikeHostType, public liked: boolean) {
    super();
    CHECK(id);
  }

  override requestURL(): string {
    return likeRoute.set;
  }

  override requestParams(): Record<string, unknown> {
    return {
      id: this.id,
      value: +this.liked,
      type: +this.type,
    };
  }
}
