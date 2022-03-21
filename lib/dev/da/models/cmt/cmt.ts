/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../com/contentBase.js';

export class Cmt extends ContentBase {
  parent_id = mm.uBigInt().nullable;
  del_flag = mm.uTinyInt().default(0);

  host_id = mm.uBigInt();
  host_type = mm.uTinyInt();
}

export const cmt = mm.table(Cmt);

export default cmt;
