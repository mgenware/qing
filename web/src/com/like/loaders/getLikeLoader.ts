/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import Loader from 'lib/loader';
import routes from 'routes';
import { CHECK } from 'checks';
import LikeHostType from './likeHostType';

export default class GetLikeLoader extends Loader<boolean> {
  constructor(public id: string, public type: LikeHostType) {
    super();
    CHECK(id);
  }

  requestURL(): string {
    return routes.s.pri.like.get;
  }

  requestParams(): Record<string, unknown> {
    return {
      id: this.id,
      type: +this.type,
    };
  }
}
