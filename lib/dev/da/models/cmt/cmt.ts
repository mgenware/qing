/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { ContentBaseWithoutUser } from '../com/contentBase.js';
import user from '../user/user.js';

export class Cmt extends ContentBaseWithoutUser {
  user_id = mm.fk(user.id).nullable;

  parent_id = mm.fk(this.id).nullable;
  del_flag = mm.uTinyInt().default(0);

  host_id = mm.uBigInt();
  host_type = mm.uTinyInt();
}

export const cmt = mm.table(Cmt);

export default cmt;
