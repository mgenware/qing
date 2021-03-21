/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import t from '../../models/forum/forumIsUserMod';

export class ForumIsUserModTA extends mm.TableActions {
  has = mm.selectExists().whereSQL(t.id.isEqualToInput());
}

export default mm.tableActions(t, ForumIsUserModTA);
