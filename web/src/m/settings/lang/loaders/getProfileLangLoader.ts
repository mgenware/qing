/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import * as profileRoute from '@qing/routes/s/pri/profile';
import { GetProfileLangResult } from 'sod/profile';

export class GetProfileLangLoader extends Loader<GetProfileLangResult> {
  override requestURL(): string {
    return profileRoute.lang;
  }
}
