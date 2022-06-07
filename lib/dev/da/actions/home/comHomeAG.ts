/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import fpost from '../../models/fpost/fpost.js';
import { threadFeedCols, threadFeedType } from '../fpost/cm.js';

class ComHome extends mm.GhostTable {}

export class ComHomeAG extends mm.ActionGroup {
  selectThreads: mm.SelectAction;

  constructor() {
    super();

    this.selectThreads = mm
      .selectRows(...threadFeedCols())
      .from(fpost)
      .pageMode()
      .orderByAsc(fpost.created_at)
      .resultTypeNameAttr(threadFeedType);
  }
}

export default mm.actionGroup(mm.table(ComHome), ComHomeAG);
