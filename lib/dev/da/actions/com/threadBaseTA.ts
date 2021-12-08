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
  protected getThreadBaseTable(): ThreadBase {
    const t = this.getBaseTable();
    if (t instanceof ThreadBase) {
      return t;
    }
    throw new Error(`t is not a \`ThreadBase\`, got ${t}`);
  }

  override getStartingInsertionInputColumns(): mm.Column[] {
    return [this.getThreadBaseTable().forum_id];
  }

  override getFullColumns(): mm.SelectedColumnTypes[] {
    return [...super.getFullColumns(), this.getThreadBaseTable().forum_id];
  }
}
