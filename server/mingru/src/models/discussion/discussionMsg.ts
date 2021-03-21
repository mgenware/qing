/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import discussion from './discussion';
import ContentBase from '../com/contentBase';

export class DiscussionMsg extends ContentBase {
  discussion_id = discussion.id;

  votes = mm.uInt().default(0);
  up_votes = mm.uInt().default(0);
  down_votes = mm.uInt().default(0);
}

export default mm.table(DiscussionMsg);
