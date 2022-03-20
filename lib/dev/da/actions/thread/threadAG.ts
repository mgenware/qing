/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../../models/com/contentBase.js';
import t from '../../models/thread/thread.js';
import ContentWithTitleBaseAG from '../com/contentWithTitleBaseAG.js';
import userStatsAG from '../user/userStatsAG.js';

export class ThreadAG extends ContentWithTitleBaseAG {
  override baseTable(): ContentBase {
    return t;
  }

  override colsOfSelectItemsForPostCenter(): mm.SelectedColumnTypes[] {
    return [...super.colsOfSelectItemsForPostCenter(), t.msg_count];
  }

  override colsOfSelectItemsForUserProfile(): mm.SelectedColumnTypes[] {
    return [...super.colsOfSelectItemsForUserProfile(), t.msg_count];
  }

  override colsOfSelectItemSrc(): mm.Column[] {
    return [t.msg_count];
  }

  override selectItemCols(): mm.SelectedColumnTypes[] {
    return [...super.selectItemCols(), t.msg_count];
  }

  override getContainerUpdateCounterActions(): mm.Action[] {
    return [userStatsAG.updateThreadCount];
  }
}

export default mm.actionGroup(t, ThreadAG);
