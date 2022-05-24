/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import forum from '../forum/forum.js';
import ContentWithTitleBase from '../com/contentWithTitleBase.js';

export class Thread extends ContentWithTitleBase {
  forum_id = mm.fk(forum.id).nullable;
  msg_count = mm.uInt().default(0);
  last_replied_at = mm.datetime({ defaultToNow: 'server' }).nullable.default(null);
}

export default mm.table(Thread);
