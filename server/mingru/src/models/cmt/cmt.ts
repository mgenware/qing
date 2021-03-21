/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import user from '../user/user';

export class Cmt extends mm.Table {
  // Common fields for both cmt and reply.
  id = mm.pk();
  content = mm.text().setModelName('ContentHTML');
  user_id = user.id;
  created_at = mm.datetime('utc');
  modified_at = mm.datetime('utc').nullable;

  reply_count = mm.uInt().default(0);
  likes = mm.uInt().default(0);
}

export const cmt = mm.table(Cmt);

export class Reply extends mm.Table {
  // Common fields for both cmt and reply.
  id = mm.pk();
  content = mm.text().setModelName('ContentHTML');
  user_id = user.id;
  created_at = mm.datetime('utc');
  modified_at = mm.datetime('utc').nullable;

  to_user_id = user.id;
  parent_id = cmt.id;
  likes = mm.uInt().default(0);
}

export const reply = mm.table(Reply);
