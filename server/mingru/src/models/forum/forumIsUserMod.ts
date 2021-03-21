/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import * as mm from 'mingru-models';

export class ForumIsUserMod extends mm.Table {
  id = mm.pk();
}

export default mm.table(ForumIsUserMod);
