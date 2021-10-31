/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';

export default interface ForumModBase extends mm.Table {
  object_id: mm.Column;
  user_id: mm.Column;
}
