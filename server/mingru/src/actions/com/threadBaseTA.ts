/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ThreadBase from '../../models/com/threadBase.js';
import ContentBaseTA from './contentBaseTA.js';

export default abstract class ThreadBaseTA extends ContentBaseTA {
  getStartingInsertionInputColumns(): mm.Column[] {
    const t = this.getBaseTable();
    if (t instanceof ThreadBase) {
      return [t.forum_id];
    }
    throw new Error(`t is not a \`ThreadCore\`, got ${t}`);
  }
}
