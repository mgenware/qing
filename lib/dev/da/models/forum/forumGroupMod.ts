/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import user from '../user/user.js';
import forumGroup from './forumGroup.js';
import ForumModBase from './forumModBase.js';

export class ForumGroupMod extends mm.Table implements ForumModBase {
  object_id = mm.pk(forumGroup.id);
  user_id = mm.pk(user.id);
}

export default mm.table(ForumGroupMod);
