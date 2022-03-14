/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import user from '../user/user.js';

export class Cmt extends mm.Table {
  id = mm.pk();
  parent_id = mm.uBigInt().nullable;
  content = mm.text().setModelName('ContentHTML');
  user_id = user.id;
  reply_count = mm.uInt().default(0);
  likes = mm.uInt().default(0);
  created_at = mm.datetime({ defaultToNow: 'utc' }).setModelName('RawCreatedAt');
  modified_at = mm.datetime({ defaultToNow: 'utc' }).setModelName('RawModifiedAt');

  del_flag = mm.uTinyInt().default(0);

  host_id = mm.uBigInt();
  host_type = mm.uTinyInt();
}

export const cmt = mm.table(Cmt);

export default cmt;
