/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import t from '../../models/forum/forumMod.js';
import { createForumModTA } from './forumModAGFactory.js';

export default createForumModTA(t, {
  deleteUserFromForumMods: mm
    .deleteSome()
    .whereSQL(mm.and(t.user_id.isEqualToParam(), t.object_id.isInArrayParam('forumIDs'))),
});
