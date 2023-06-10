/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader.js';
import * as profileRoute from '@qing/routes/s/pri/profile.js';
import { UserEditingResult } from 'da/types.js';

export class GetProfileInfoLoader extends Loader<UserEditingResult> {
  override requestURL(): string {
    return profileRoute.info;
  }
}
