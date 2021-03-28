/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import routes from 'routes';

export default class DeletePostLoader extends Loader<string> {
  constructor(public pid: string | null, public entityType: number) {
    super();
  }

  requestURL(): string {
    return routes.s.pri.compose.deletePost;
  }

  requestParams(): Record<string, unknown> {
    return {
      id: this.pid,
      entityType: this.entityType,
    };
  }
}
