/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import routes from 'routes';

export default class SetProfileInfoLoader extends Loader<undefined> {
  constructor(
    public name: string,
    public website: string,
    public company: string,
    public location: string,
    public bio: string,
  ) {
    super();
  }

  requestURL(): string {
    return routes.s.pri.profile.setInfo;
  }

  requestParams(): Record<string, unknown> {
    return {
      name: this.name,
      website: this.website,
      company: this.company,
      location: this.location,
      bio: this.bio,
    };
  }
}
