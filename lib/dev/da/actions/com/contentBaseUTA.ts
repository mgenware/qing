/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../../models/com/contentBase.js';
import { updateCounterAction } from '../misc/counterColumnTAFactory.js';

class ContentBaseUtil extends ContentBase {}

const contentBaseUtil = mm.table(ContentBaseUtil);

class ContentBaseUTA extends mm.TableActions {
  incrementCmtCount = updateCounterAction(contentBaseUtil, contentBaseUtil.cmt_count, {
    rawOffsetSQL: 1,
  });
  decrementCmtCount = updateCounterAction(contentBaseUtil, contentBaseUtil.cmt_count, {
    rawOffsetSQL: -1,
  });
}

export default mm.tableActions(contentBaseUtil, ContentBaseUTA, { configurableTable: true });
