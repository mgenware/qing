/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import Loader from 'lib/loader';

// Base loader type for all forum mod APIs.
export default class FModBaseLoader<T> extends Loader<T> {
  constructor(public forumID: string) {
    super();
  }

  requestParams(): Record<string, unknown> {
    return {
      forumID: this.forumID,
    };
  }
}
