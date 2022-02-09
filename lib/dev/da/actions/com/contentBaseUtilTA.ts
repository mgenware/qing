/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import contentBaseUtil from '../../models/com/contentBaseUtil.js';
import { updateCounterAction } from '../misc/counterColumnTAFactory.js';

class ContentBaseUtilTA extends mm.TableActions {
  incrementCmtCount = updateCounterAction(contentBaseUtil, contentBaseUtil.cmt_count, {
    offsetNumber: 1,
  });
  decrementCmtCount = updateCounterAction(contentBaseUtil, contentBaseUtil.cmt_count, {
    offsetNumber: -1,
  });
}

export const contentBaseTableParam = 'contentBaseTable';

export const contentBaseUtilTA = mm.tableActions(contentBaseUtil, ContentBaseUtilTA, {
  configurableTableName: contentBaseTableParam,
});
