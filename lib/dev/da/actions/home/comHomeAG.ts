/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import thread from '../../models/thread/thread.js';
import { threadFeedCols, threadFeedInterface } from '../thread/cm.js';

class Home extends mm.GhostTable {}

export class ComHomeAG extends mm.ActionGroup {
  selectThreads: mm.SelectAction;

  constructor() {
    super();

    this.selectThreads = mm
      .selectRows(...threadFeedCols())
      .from(thread)
      .pageMode()
      .orderByAsc(thread.created_at)
      .resultTypeNameAttr(threadFeedInterface);
  }
}

export default mm.actionGroup(mm.table(Home, { virtualTable: true }), ComHomeAG);
