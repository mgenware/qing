/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import post from '../../models/post/post.js';
import user from '../../models/user/user.js';

class Home extends mm.GhostTable {}

export class HomeAG extends mm.ActionGroup {
  selectPosts: mm.SelectAction;

  constructor() {
    super();

    this.selectPosts = mm
      .selectRows(...this.cols())
      .from(post)
      .pageMode()
      .orderByAsc(post.created_at);
  }

  private cols() {
    const t = post;
    const joinedUserTable = t.user_id.join(user);
    const priCols = [
      t.id,
      t.user_id,
      joinedUserTable.name,
      joinedUserTable.icon_name,
      t.created_at,
      t.modified_at,
    ].map((c) => c.privateAttr());
    return [...priCols, t.title, t.likes, t.cmt_count];
  }
}

export default mm.actionGroup(mm.table(Home, { virtualTable: true }), HomeAG);