/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import forumGroup, { ForumGroup } from '../../models/forum/forumGroup.js';
import forum, { Forum } from '../../models/forum/forum.js';

class ForumHomeGhost extends mm.GhostTable {}

export class ForumHomeAG extends mm.ActionGroup {
  selectForumGroups = mm
    .selectRows(...this.getForumGroupCols(forumGroup))
    .from(forumGroup)
    .orderByDesc(forumGroup.order_index);
  selectForums = mm
    .selectRows(...this.getForumCols(forum))
    .from(forum)
    .noOrderBy();

  private getForumGroupCols(t: ForumGroup): mm.SelectedColumnTypes[] {
    return [t.id.privateAttr(), t.name, t.order_index, t.forum_count, t.desc];
  }

  private getForumCols(t: Forum): mm.SelectedColumnTypes[] {
    return [t.id.privateAttr(), t.name, t.order_index, t.fpost_count, t.group_id];
  }
}

export default mm.actionGroup(mm.table(ForumHomeGhost), ForumHomeAG);
