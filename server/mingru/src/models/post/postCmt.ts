/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../com/contentBase';
import ContentCmtBase from '../com/contentCmtCore';
import post from './post';

export class PostCmt extends ContentCmtBase {
  getHostTable(): ContentBase {
    return post;
  }
}

export default mm.table(PostCmt);
