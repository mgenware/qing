/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../com/contentBase.js';
import ContentCmtBase from '../com/contentCmtCore.js';
import discussion from './discussion.js';

export class DiscussionCmt extends ContentCmtBase {
  getHostTable(): ContentBase {
    return discussion;
  }
}

export default mm.table(DiscussionCmt);
