/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import routes from 'routes';

export default class SetBioLoader extends Loader<undefined> {
  constructor(public bio: string) {
    super();
  }

  requestURL(): string {
    return routes.s.pri.profile.setBio;
  }

  requestParams(): Record<string, unknown> {
    return {
      bio: this.bio,
    };
  }
}
