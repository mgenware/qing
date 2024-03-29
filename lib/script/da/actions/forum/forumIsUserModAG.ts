/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import t from '../../models/forum/forumIsUserMod.js';

export class ForumIsUserModAG extends mm.ActionGroup {
  has = mm.selectExists().whereSQL(t.id.isEqualToParam());
}

export default mm.actionGroup(t, ForumIsUserModAG);
