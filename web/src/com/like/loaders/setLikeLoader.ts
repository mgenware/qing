/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import * as likeRoute from '@qing/routes/d/s/pri/like';
import { CHECK } from 'checks';
import LikeHostType from './likeHostType';

export default class SetLikeLoader extends Loader<string> {
  constructor(public id: string, public type: LikeHostType, public liked: boolean) {
    super();
    CHECK(id);
  }

  requestURL(): string {
    return likeRoute.set;
  }

  requestParams(): Record<string, unknown> {
    return {
      id: this.id,
      value: +this.liked,
      type: +this.type,
    };
  }
}
