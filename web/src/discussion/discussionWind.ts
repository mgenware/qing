/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import app from 'app';

export interface DiscussionWind {
  EID: string;
  ReplyCount: number;
}

export default app.state.windData<DiscussionWind>();
