/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader.js';
import * as profileRoute from '@qing/routes/s/pri/profile.js';

export interface GetProfileInfoResult {
  iconURL?: string;
  name?: string;
  website?: string;
  company?: string;
  location?: string;
  bioHTML?: string;
}

export class GetProfileInfoLoader extends Loader<GetProfileInfoResult> {
  override requestURL(): string {
    return profileRoute.info;
  }
}
