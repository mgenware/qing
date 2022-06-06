/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';

function createCounterColumn(): mm.Column {
  return mm.uInt().default(0);
}

export class UserStats extends mm.Table {
  // `id` is from `user.id`.
  id = mm.pk().noAutoIncrement;

  // Stats.
  post_count = createCounterColumn();
  fpost_count = createCounterColumn();
  thread_count = createCounterColumn();
  thread_msg_count = createCounterColumn();
}

export default mm.table(UserStats);
