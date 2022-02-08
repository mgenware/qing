/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../../models/com/contentBase.js';
import { updateCounterAction } from '../misc/counterColumnTAFactory.js';

class ContentBaseVT extends ContentBase {}

const contentBaseVT = mm.table(ContentBaseVT);

class ContentBaseUTA extends mm.TableActions {
  incrementCmtCount = updateCounterAction(contentBaseVT, contentBaseVT.cmt_count, {
    rawOffsetSQL: 1,
  });
  decrementCmtCount = updateCounterAction(contentBaseVT, contentBaseVT.cmt_count, {
    rawOffsetSQL: -1,
  });
}

export const contentBaseTableParam = 'contentBaseTable';

export const contentBaseSTA = mm.tableActions(contentBaseVT, ContentBaseUTA, {
  configurableTableName: contentBaseTableParam,
});
