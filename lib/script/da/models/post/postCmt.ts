/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../com/contentBase.js';
import ContentBaseCmt from '../com/contentBaseCmt.js';
import post from './post.js';

export class PostCmt extends ContentBaseCmt {
  override getCmtHostTable(): ContentBase {
    return post;
  }
}

export default mm.table(PostCmt);
