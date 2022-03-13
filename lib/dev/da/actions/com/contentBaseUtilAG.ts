/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import contentBaseUtil from '../../models/com/contentBaseUtil.js';
import { updateCounterAction } from './updateCounterAction.js';

class ContentBaseUtilAG extends mm.ActionGroup {
  updateCmtCount = updateCounterAction(contentBaseUtil, contentBaseUtil.cmt_count);
}

export const contentBaseTableParam = 'contentBaseTable';

export const contentBaseUtilAG = mm.actionGroup(contentBaseUtil, ContentBaseUtilAG, {
  configurableTableName: contentBaseTableParam,
});
