/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ForumModBase from '../../models/forum/forumModBase';

export function createForumModTA(
  t: ForumModBase,
  extraActions?: Record<string, mm.Action>,
): mm.TableActions {
  const actions = {
    selectIsMod: mm
      .selectExists()
      .whereSQL(mm.and(t.object_id.isEqualToInput(), t.user_id.isEqualToInput())),
    insertMod: mm.insertOne().setInputs(t.object_id, t.user_id),
    deleteMod: mm
      .deleteOne()
      .whereSQL(mm.and(t.object_id.isEqualToInput(), t.user_id.isEqualToInput())),
  };
  if (extraActions) {
    Object.assign(actions, extraActions);
  }
  return mm.tableActionsCore(t, null, actions, undefined);
}
