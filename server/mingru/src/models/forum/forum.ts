/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ForumBase from './forumBase.js';
import forumGroup from './forumGroup.js';

export class Forum extends ForumBase {
  group_id = mm.fk(forumGroup.id).nullable;
  thread_count = mm.uInt().default(0);
  status = mm.uTinyInt().default(0);
}

export default mm.table(Forum);
