/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import routes from 'routes';
import ForumsSettingsJSON from './forumsSettingsJSON';

export default class GetSiteSettingsLoader extends Loader<ForumsSettingsJSON> {
  constructor(public key: string) {
    super();
  }

  requestURL(): string {
    return routes.s.admin.getSiteSettings;
  }

  requestParams(): Record<string, unknown> {
    return {
      key: this.key,
    };
  }
}
