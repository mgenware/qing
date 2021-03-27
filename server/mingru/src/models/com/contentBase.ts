/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import user from '../user/user';

export default class ContentBase extends mm.Table {
  id = mm.pk();
  content = mm.text().setModelName('ContentHTML');
  user_id = user.id;

  created_at = mm.datetime('utc');
  modified_at = mm.datetime('utc');

  cmt_count = mm.uInt().default(0);
}
