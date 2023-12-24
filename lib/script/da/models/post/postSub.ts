/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../com/contentBase.js';
import ContentBaseSub from '../com/contentBaseSub.js';
import post from './post.js';

export class PostSub extends ContentBaseSub {
  override getSubTargetTable(): ContentBase {
    return post;
  }
}

export default mm.table(PostSub);
