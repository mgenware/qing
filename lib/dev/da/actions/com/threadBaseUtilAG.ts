/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import threadBaseUtil from '../../models/com/threadBaseUtil.js';
import { updateCounterAction } from './updateCounterAction.js';

class ThreadBaseUtilAG extends mm.ActionGroup {
  updateReplyCount = updateCounterAction(threadBaseUtil, threadBaseUtil.reply_count);
}

export const threadBaseTableParam = 'threadBaseTable';

export const threadBaseUtilAG = mm.actionGroup(threadBaseUtil, ThreadBaseUtilAG, {
  configurableTableName: threadBaseTableParam,
});
