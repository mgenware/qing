/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import c from '../../../defs/constants.json';

export class UserPwd extends mm.Table {
  // `id` is from `user.id`.
  id = mm.pk().noAutoIncrement;
  pwd_hash = mm.varChar(c.maxPwdHashLen);
}

export default mm.table(UserPwd);
