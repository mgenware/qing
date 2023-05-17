/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { appDef } from '@qing/def';

export default class ForumBase extends mm.Table {
  id = mm.pk();
  name = mm.varChar(appDef.lenMaxName);
  desc = mm.text().setModelName('DescHTML');
  desc_src = mm.text().nullable.setModelName('DescSrc');
  order_index = mm.uInt().default(0);

  created_at = mm.datetime({ defaultToNow: 'server' }).setModelName('RawCreatedAt');
}
