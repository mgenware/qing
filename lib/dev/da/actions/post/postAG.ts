/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../../models/com/contentBase.js';
import t from '../../models/post/post.js';
import ContentWithTitleBaseAG from '../com/contentWithTitleBaseAG.js';
import userStatsAG from '../user/userStatsAG.js';

export class PostAG extends ContentWithTitleBaseAG {
  override baseTable(): ContentBase {
    return t;
  }

  override getContainerUpdateCounterActions(): mm.Action[] {
    return [userStatsAG.updatePostCount];
  }
}

export default mm.actionGroup(t, PostAG);
