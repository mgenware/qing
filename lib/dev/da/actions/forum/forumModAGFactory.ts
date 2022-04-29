/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ForumModBase from '../../models/forum/forumModBase.js';

export function createForumModTA(
  t: ForumModBase,
  name: string,
  extraActions?: Record<string, mm.Action>,
): mm.ActionGroup {
  const actions = {
    selectIsMod: mm
      .selectExists()
      .whereSQL(mm.and(t.object_id.isEqualToParam(), t.user_id.isEqualToParam())),
    insertMod: mm.insertOne().setParams(t.object_id, t.user_id),
    deleteMod: mm
      .deleteOne()
      .whereSQL(mm.and(t.object_id.isEqualToParam(), t.user_id.isEqualToParam())),
  };
  if (extraActions) {
    Object.assign(actions, extraActions);
  }
  return mm.actionGroupCore(t, name, actions, undefined);
}
