/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import t from '../../models/forum/forumGroup';

export class ForumGroupTA extends mm.TableActions {
  selectGroup = mm.selectRow(t.id, t.name, t.desc, t.created_at, t.forum_count).by(t.id);
  selectInfoForEditing = mm.selectRow(t.name, t.desc).by(t.id);

  deleteGroup = mm.deleteOne().by(t.id);
  updateInfo = mm.updateOne().setInputs(t.name, t.desc).by(t.id);
  insertGroup = mm.insertOne().setInputs(t.name, t.desc).setDefaults();
}

export default mm.tableActions(t, ForumGroupTA);
