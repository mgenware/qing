/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import * as profileRoute from '@qing/routes/s/pri/profile';

export default class SetProfileLangLoader extends Loader<undefined> {
  constructor(public lang: string) {
    super();
  }

  override requestURL(): string {
    return profileRoute.setLang;
  }

  override requestParams(): Record<string, unknown> {
    return {
      lang: this.lang,
    };
  }
}
