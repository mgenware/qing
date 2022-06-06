/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import forum from '../forum/forum.js';
import { Post } from '../post/post.js';

export class FPost extends Post {
  forum_id = mm.fk(forum.id).nullable;
}

export default mm.table(FPost);
