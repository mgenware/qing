/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../../models/com/contentBase.js';
import { updateCounterAction } from '../misc/counterColumnTAFactory.js';

class ContentBaseVirtualTable extends ContentBase {}

const vt = mm.table(ContentBaseVirtualTable);

// Shared actions of `ContentBaseTA`.
class ContentBaseSharedTA extends mm.TableActions {
  incrementCmtCount = updateCounterAction(vt, vt.cmt_count, { rawOffsetSQL: 1 });
  decrementCmtCount = updateCounterAction(vt, vt.cmt_count, { rawOffsetSQL: -1 });
}

export default mm.tableActions(vt, ContentBaseSharedTA, { configurableTable: true });
