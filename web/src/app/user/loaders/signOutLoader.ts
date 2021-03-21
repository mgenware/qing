/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import Loader from 'lib/loader';
import routes from 'routes';

export default class SignOutLoader extends Loader<undefined> {
  requestURL(): string {
    return routes.s.pri.auth.signOut;
  }
}
