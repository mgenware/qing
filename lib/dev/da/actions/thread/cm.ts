/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import thread from '../../models/thread/thread.js';
import user from '../../models/user/user.js';

export const threadFeedType = 'ThreadFeedResult';

// Used by both home page and forum page.
export function threadFeedCols() {
  const t = thread;
  const joinedUserTable = t.user_id.join(user);
  const priCols = [
    t.id,
    t.user_id,
    joinedUserTable.name,
    joinedUserTable.icon_name,
    t.created_at,
    t.modified_at,
  ].map((c) => c.privateAttr());
  return [...priCols, t.title, t.likes, t.msg_count, t.last_replied_at];
}
