/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import routes from 'routes';

export interface GetProfileInfoResult {
  iconURL?: string;
  name?: string;
  website?: string;
  company?: string;
  location?: string;
  status?: string;
  bioHTML?: string;
}

export class GetProfileInfoLoader extends Loader<GetProfileInfoResult> {
  requestURL(): string {
    return routes.s.pri.profile.getInfo;
  }
}
