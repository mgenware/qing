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
  created_at = mm.datetime('utc').setModelName('RawCreatedAt');
  modified_at = mm.datetime('utc').setModelName('RawModifiedAt');
}

export const cmt = mm.table(Cmt);

export default cmt;
