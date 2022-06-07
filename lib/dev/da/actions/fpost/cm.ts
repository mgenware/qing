/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import fpost from '../../models/fpost/fpost.js';
import user from '../../models/user/user.js';

export const threadFeedType = 'ThreadFeedResult';

// Used by both home page and forums page.
export function threadFeedCols() {
  const t = fpost;
  const joinedUserTable = t.user_id.join(user);
  const priCols = [
    t.id,
    t.user_id,
    joinedUserTable.name,
    joinedUserTable.icon_name,
    t.created_at,
    t.modified_at,
  ].map((c) => c.privateAttr());
  return [...priCols, t.title, t.likes, t.cmt_count, t.last_replied_at];
}
