/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import user from '../user/user.js';

export class ContentBaseWithoutUser extends mm.Table {
  id = mm.pk();
  content = mm.text().setModelName('ContentHTML');
  content_src = mm.text().setModelName('ContentSrc').nullable;

  created_at = mm.datetime({ defaultToNow: 'server' }).setModelName('RawCreatedAt');
  modified_at = mm.datetime({ defaultToNow: 'server' }).setModelName('RawModifiedAt');

  // For cmt, it's the number of direct replies.
  // For post, it's the number of all cmts associated with it.
  cmt_count = mm.uInt().default(0);
  likes = mm.uInt().default(0);
}

export default class ContentBase extends ContentBaseWithoutUser {
  user_id = user.id;
}
