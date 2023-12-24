/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import contentBaseTableParam from '../../models/com/contentBaseTableParam.js';
import { updateCounterAction } from './updateCounterAction.js';

class ContentBaseStaticAG extends mm.ActionGroup {
  selectUserID = mm.selectField(contentBaseTableParam.user_id).by(contentBaseTableParam.id);

  updateCmtCount = updateCounterAction(contentBaseTableParam, contentBaseTableParam.cmt_count);
}

export const contentBaseStaticTableParam = contentBaseTableParam.__getData().name;

export const contentBaseStaticAG = mm.actionGroup(contentBaseTableParam, ContentBaseStaticAG);
