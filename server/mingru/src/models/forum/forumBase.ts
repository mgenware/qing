/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import c from '../../constants.json';

export default class ForumBase extends mm.Table {
  id = mm.pk();
  name = mm.varChar(c.maxNameLen);
  desc = mm.text().setModelName('DescHTML');
  order_index = mm.uInt().default(0);

  created_at = mm.datetime('utc').setModelName('RawCreatedAt');
}
