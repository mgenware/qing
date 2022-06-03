/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import postTableParam from '../../models/post/postTableParam.js';

class PostStaticAG extends mm.ActionGroup {
  updateLastRepliedAt = mm
    .updateOne()
    .set(postTableParam.last_replied_at, mm.datetimeNow())
    .by(postTableParam.id);
}

export const postStaticTableParam = postTableParam.__getData().name;

export const postStaticAG = mm.actionGroup(postTableParam, PostStaticAG);
